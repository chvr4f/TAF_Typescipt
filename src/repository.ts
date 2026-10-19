import { ValidateSpellPower } from "./decorators";
import type { NewSpell, NewWizard, Spell, Wizard } from "./types";

export class WizardRepository {
  private wizards: Wizard[] = [];
  private nextId = 1;

  add(data: NewWizard): Wizard {
    const wizard: Wizard = { ...data, id: this.nextId++ };
    this.wizards.push(wizard);
    return wizard;
  }

  findAll(): Wizard[] {
    return [...this.wizards];
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.wizards.filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository {
  private spells: Spell[] = [];
  private nextId = 1;

  @ValidateSpellPower
  add(data: NewSpell): Spell {
    const spell: Spell = { ...data, id: this.nextId++ };
    this.spells.push(spell);
    return spell;
  }

  findAll(): Spell[] {
    return [...this.spells];
  }
}
