import type { SpellCastEvent } from "./types.ts";

// N'accepte que les événements de lancement de sorts.
export function handleSpellCast(event: SpellCastEvent): string {
  return `Le sorcier #${event.wizardId} lance « ${event.spell} »`;
}
