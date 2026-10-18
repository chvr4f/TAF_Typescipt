import { WizardRepository } from "./repository.ts";

const repo = new WizardRepository();

// Exercice 1 — l'appelant ne fournit pas d'identifiant
const harry = repo.add({ name: "Harry Potter", house: "Gryffindor", patronus: "Cerf" });
const draco = repo.add({ name: "Drago Malefoy", house: "Slytherin" });

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
  repo.add({ id: 42, name: "Hermione Granger", house: "Gryffindor" });
}

// Exercice 2 — filtrer les sorciers par maison
repo.add({ name: "Hermione Granger", house: "Gryffindor", patronus: "Loutre" });
repo.add({ name: "Luna Lovegood", house: "Ravenclaw", patronus: "Lièvre" });

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
