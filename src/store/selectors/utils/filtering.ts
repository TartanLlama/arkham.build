import { Card } from "@/store/graphql/types";

type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => fns.some((f) => f(card));
}

export function filterWeaknesses(card: Card) {
  return !card.subtype_code;
}

export function filterPlayerCard(card: Card) {
  return (
    !card.alt_art_investigator && // filter novellas && parallel investigators
    !card.duplicate_of_code && // filter revised_code. TODO: we will have to handle revised core.
    !card.encounter_code // filter out encounter cards (story player cards).
  );
}

export function filterBacksides(card: Card) {
  return !card.linked;
}

export function filterFactions(factions: string[]) {
  return (card: Card) => {
    if (!factions.length) return true;

    if (factions.length === 1 && factions[0] === "multiclass") {
      return !!card.faction2_code;
    }

    return (
      factions.includes(card.faction_code) ||
      (!!card.faction2_code && factions.includes(card.faction2_code)) ||
      (!!card.faction3_code && factions.includes(card.faction3_code))
    );
  };
}

export function filterExceptional(val: boolean) {
  return (card: Card) => !!card.exceptional === val;
}

export function filterLevel(value?: [number, number]) {
  return (card: Card) => {
    if (!value) return true;
    const xp = card.xp ?? 0;
    return xp === -2 || (xp >= value[0] && xp <= value[1]);
  };
}
