import type { NewWizard, Wizard } from "./types.ts";

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
}
