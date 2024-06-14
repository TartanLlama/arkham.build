import { Coded } from "@/store/services/types";

export type CardTypeFilter = "player" | "encounter";

export type Trait = Coded;

export type CostFilter = {
  value: undefined | [number, number];
  even: boolean;
  odd: boolean;
  x: boolean;
};

export type LevelFilter = {
  value: undefined | [number, number];
  exceptional: boolean;
  nonexceptional: boolean;
};

export type SkillIconsFilter = {
  agility: number | null;
  combat: number | null;
  intellect: number | null;
  willpower: number | null;
  wild: number | null;
  any: number | null;
};

export type PropertiesFilter = {
  bonded: boolean;
  customizable: boolean;
  seal: boolean;
  unique: boolean;
  fast: boolean;
  permanent: boolean;
  exile: boolean;
  heals_damage: boolean;
  heals_horror: boolean;
  victory: boolean;
};

export type ComboboxFilter = Record<string, boolean>;

export type SelectFilter<T = string> = { value: T | undefined };

export type OwnershipFilter = {
  value: "unowned" | "owned" | "all";
};

type SharedState = {
  ownership: OwnershipFilter;
  cost: CostFilter;
  faction: {
    value: string[];
  };
  action: ComboboxFilter;
  properties: PropertiesFilter;
  skillIcons: SkillIconsFilter;
  subtype: ComboboxFilter;
  trait: ComboboxFilter;
  type: ComboboxFilter;
};

export type Filters = {
  cardType: CardTypeFilter;
  player: SharedState & {
    level: LevelFilter;
    investigator: SelectFilter;
    tabooSet: SelectFilter<number>;
  };
  encounter: SharedState;
};

export type FiltersSlice = {
  filters: Filters;

  setActiveCardType(type: CardTypeFilter): void;

  resetFilters(): void;

  resetFilterKey<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    path: P,
  ): void;

  resetFilterKeys<C extends CardTypeFilter, P extends keyof Filters[C]>(
    type: C,
    paths: P[],
  ): void;

  setActiveFilter<
    C extends CardTypeFilter,
    P extends keyof Filters[C],
    K extends keyof Filters[C][P],
  >(
    type: C,
    path: P,
    key: K,
    value: Filters[C][P][K],
  ): void;

  setActiveEncounterFilter<
    P extends keyof Filters["encounter"],
    K extends keyof Filters["encounter"][P],
  >(
    path: P,
    key: K,
    value: Filters["encounter"][P][K],
  ): void;

  setActivePlayerFilter<
    P extends keyof Filters["player"],
    K extends keyof Filters["player"][P],
  >(
    path: P,
    key: K,
    value: Filters["player"][P][K],
  ): void;

  setActiveLevelShortcut(value: string): void;

  toggleComboboxFilter<
    C extends CardTypeFilter,
    P extends keyof Filters[C],
    K extends keyof Filters[C][P],
  >(
    type: C,
    path: P,
    item: K,
    value: Filters[C][P][K],
  ): void;
};
