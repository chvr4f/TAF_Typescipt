import type { Spell } from "./types.ts";

// Décorateur de méthode : refuse l'appel si le sort passé en premier
// argument a une puissance négative.
export function ValidateSpellPower(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const original = descriptor.value;

  descriptor.value = function (this: unknown, ...args: unknown[]) {
    const spell = args[0] as Pick<Spell, "power">;
    if (spell.power < 0) {
      throw new RangeError(`Sort refusé : la puissance (${spell.power}) ne peut pas être négative`);
    }
    return original.apply(this, args);
  };

  return descriptor;
}
