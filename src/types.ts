export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Wizard {
  id: number;
  name: string;
  house: House;
  level: number;
  active: boolean;
}

// Données fournies par l'appelant : tout sauf l'identifiant,
// qui est attribué par le référentiel.
export type NewWizard = Omit<Wizard, "id">;

export interface Spell {
  id: number;
  name: string;
  power: number;
}

export type NewSpell = Omit<Spell, "id">;

// Union discriminée : la propriété `type` indique de quel événement il s'agit.
export type AcademyEvent =
  | { type: "enrollment"; wizardId: number; house: House }
  | { type: "spell-cast"; wizardId: number; spell: string }
  | { type: "duel"; challengerId: number; opponentId: number; winnerId: number };

// Ne garde que le membre de l'union dont `type` vaut "spell-cast".
export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;
