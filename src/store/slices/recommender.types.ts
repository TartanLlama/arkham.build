import type { Id } from "./data.types";

export type RecommenderState = {
  recommender: {
    includeSideDeck: boolean;
    isRelative: boolean;
    deckFilter: [number, number];
    coreCards: { [id: Id]: string[] };
  };
};

export type RecommenderSlice = RecommenderState & {
  setIncludeSideDeck(value: boolean): void;
  setIsRelative(value: boolean): void;
  setRecommenderDeckFilter(value: [number, number]): void;
  addCoreCard(deck: Id, value: string): void;
  removeCoreCard(deck: Id, value: string): void;
};
