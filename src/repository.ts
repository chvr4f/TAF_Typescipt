import { ValidateSpellPower } from "./decorators";
import type { NewWizard, Spell, Wizard } from "./types";

export class Repository<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findAll(): T[] {
    return [...this.items];
  }
}

export class WizardRepository extends Repository<Wizard> {
  private nextId = 1;

  // L'appelant fournit un NewWizard (sans id) : le référentiel attribue l'identifiant.
  override add(data: NewWizard): Wizard {
    const wizard: Wizard = { ...data, id: this.nextId++ };
    super.add(wizard);
    return wizard;
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.items.filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
