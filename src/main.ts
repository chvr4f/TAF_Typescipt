import { Memoize } from "./decorators.ts";
import { SpellRepository, WizardRepository } from "./repository.ts";
import type { AcademyEvent, House, SpellCastEvent, Wizard } from "./types.ts";

const repo = new WizardRepository();

// Exercice 1 — l'appelant ne fournit pas d'identifiant
const harry = repo.add({ name: "Harry Potter", house: "Gryffindor", level: 5, active: true });
const draco = repo.add({ name: "Drago Malefoy", house: "Slytherin", level: 4, active: true });

console.log("Sorcier ajouté :", harry);
console.log("Sorcier ajouté :", draco);
console.log("Tous les sorciers :", repo.findAll());

// L'identifiant est attribué par le référentiel, et unique
console.assert(harry.id === 1, "Harry devrait avoir l'id 1");
console.assert(draco.id === 2, "Drago devrait avoir l'id 2");
console.assert(repo.findAll().length === 2, "Le référentiel devrait contenir 2 sorciers");

// Fournir un id est refusé à la compilation (vérifié par `npm run typecheck`)
function appelInvalide() {
  // @ts-expect-error — 'id' n'existe pas dans NewWizard
  repo.add({ id: 42, name: "Hermione Granger", house: "Gryffindor", level: 6, active: true });
}

// Exercice 2 — filtrer les sorciers par maison
const hermione = repo.add({ name: "Hermione Granger", house: "Gryffindor", level: 6, active: true });
repo.add({ name: "Luna Lovegood", house: "Ravenclaw", level: 4, active: true });

const gryffindors = repo.findByHouse("Gryffindor");
console.log("Gryffindor :", gryffindors.map((w) => w.name));
console.log("Ravenclaw :", repo.findByHouse("Ravenclaw").map((w) => w.name));
console.log("Hufflepuff :", repo.findByHouse("Hufflepuff").map((w) => w.name));

console.assert(gryffindors.length === 2, "Gryffindor devrait contenir 2 sorciers");
console.assert(
  gryffindors.every((w) => w.house === "Gryffindor"),
  "findByHouse ne devrait renvoyer que des sorciers de Gryffindor",
);
console.assert(repo.findByHouse("Ravenclaw").length === 1, "Ravenclaw devrait contenir 1 sorcier");
console.assert(repo.findByHouse("Hufflepuff").length === 0, "Hufflepuff devrait être vide");

// Une chaîne arbitraire est refusée à la compilation
function maisonInvalide() {
  // @ts-expect-error — "Poudlard" n'est pas une House
  repo.findByHouse("Poudlard");
}

// Exercice 3 — gestionnaire limité aux lancements de sorts
// N'accepte que les événements de lancement de sorts.
function handleSpellCast(event: SpellCastEvent): string {
  return `Le sorcier #${event.wizardId} lance « ${event.spell} »`;
}

const events: AcademyEvent[] = [
  { type: "enrollment", wizardId: hermione.id, house: "Gryffindor" },
  { type: "spell-cast", wizardId: harry.id, spell: "Expelliarmus" },
  { type: "duel", challengerId: harry.id, opponentId: draco.id, winnerId: harry.id },
  { type: "spell-cast", wizardId: hermione.id, spell: "Wingardium Leviosa" },
];

const messages: string[] = [];
for (const event of events) {
  // Après ce test, TypeScript sait que `event` est un SpellCastEvent
  if (event.type === "spell-cast") {
    messages.push(handleSpellCast(event));
  }
}
console.log("Sorts lancés :", messages);

console.assert(messages.length === 2, "Seuls les 2 lancements de sorts devraient être traités");
console.assert(
  messages[0] === "Le sorcier #1 lance « Expelliarmus »",
  "Le premier message devrait concerner Expelliarmus",
);

// Les autres événements sont refusés à la compilation
function evenementsInvalides() {
  // @ts-expect-error — un événement "duel" n'est pas un SpellCastEvent
  handleSpellCast({ type: "duel", challengerId: 1, opponentId: 2, winnerId: 1 });
  // @ts-expect-error — un AcademyEvent non vérifié pourrait être n'importe quel événement
  handleSpellCast(events[0]);
}

// Exercice 4 — un sort de puissance négative est refusé par le décorateur
const spellRepo = new SpellRepository();
const lumos = spellRepo.add({ name: "Lumos", power: 10 });
const nox = spellRepo.add({ name: "Nox", power: 0 });
console.log("Sorts ajoutés :", spellRepo.findAll());

let erreur: unknown;
try {
  spellRepo.add({ name: "Sort raté", power: -5 });
} catch (e) {
  erreur = e;
  console.log((e as Error).message);
}

console.assert(lumos.id === 1 && nox.id === 2, "Les sorts valides devraient être enregistrés");
console.assert(erreur instanceof RangeError, "Un sort de puissance négative devrait lever une erreur");
console.assert(spellRepo.findAll().length === 2, "Le sort refusé ne devrait pas être enregistré");

// Exercice 5 — mise en cache des résultats, séparément pour chaque instance
class SpellService {
  calls = 0;

  @Memoize
  calculateDamage(power: number, level: number): number {
    this.calls++;
    return power * level;
  }
}

const service = new SpellService();
const d1 = service.calculateDamage(10, 3);
const d2 = service.calculateDamage(10, 3); // mêmes arguments : lu depuis le cache
const d3 = service.calculateDamage(5, 2);
console.log("Dégâts :", d1, d2, d3, "— calculs effectués :", service.calls);

console.assert(d1 === 30 && d2 === 30 && d3 === 10, "Les résultats devraient être corrects");
console.assert(service.calls === 2, "Le deuxième appel avec (10, 3) devrait venir du cache");

const autreService = new SpellService();
autreService.calculateDamage(10, 3);
console.assert(autreService.calls === 1, "Chaque instance devrait avoir son propre cache");

// Exercice 6 — type guard qui n'accepte que les quatre maisons de Poudlard
const HOUSES: readonly House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

function isHouse(value: unknown): value is House {
  return HOUSES.some((house) => house === value);
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

console.assert(isHouse("Gryffindor"), "Gryffindor devrait être une maison valide");
console.assert(!isHouse("Durmstrang"), "Durmstrang ne devrait pas être une maison de Poudlard");
console.assert(!isHouse(42), "Un nombre ne devrait pas être une maison");

// Données non typées, par exemple reçues d'une API
const donnees: unknown[] = [
  { id: 10, name: "Cedric Diggory", house: "Hufflepuff", level: 6, active: true },
  { id: 11, name: "Viktor Krum", house: "Durmstrang", level: 7, active: true },
  { id: 12, name: "Neville Londubat", level: 3, active: true },
];

const sorciersValides = donnees.filter(isWizard);
console.log("Sorciers valides :", sorciersValides.map((w) => w.name));

console.assert(sorciersValides.length === 1, "Seul Cedric devrait être un sorcier valide");
console.assert(sorciersValides[0].name === "Cedric Diggory", "Le sorcier valide devrait être Cedric");
