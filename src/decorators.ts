import type { Spell } from "./types";

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

// Décorateur de méthode (synchrone) : mémorise le résultat pour chaque
// combinaison d'arguments, avec un cache séparé pour chaque instance.
export function Cache(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const original = descriptor.value;
  // WeakMap : le cache d'une instance disparaît avec elle.
  const caches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]) {
    let cache = caches.get(this);
    if (!cache) {
      cache = new Map();
      caches.set(this, cache);
    }

    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}
