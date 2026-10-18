import { WizardRepository } from "./wizardRepository.ts";

const repo = new WizardRepository();

// Exercice 1 — l'appelant ne fournit pas d'identifiant
const harry = repo.add({ name: "Harry Potter", house: "Gryffondor", patronus: "Cerf" });
const draco = repo.add({ name: "Drago Malefoy", house: "Serpentard" });

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
  repo.add({ id: 42, name: "Hermione Granger", house: "Gryffondor" });
}
