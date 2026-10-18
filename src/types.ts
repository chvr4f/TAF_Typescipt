export type House = "Gryffondor" | "Serpentard" | "Poufsouffle" | "Serdaigle";

export interface Wizard {
  id: number;
  name: string;
  house: House;
  patronus?: string;
}

// Données fournies par l'appelant : tout sauf l'identifiant,
// qui est attribué par le référentiel.
export type NewWizard = Omit<Wizard, "id">;
