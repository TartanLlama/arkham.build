import { afterEach } from "node:test";
import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from ".";
import type { Deck } from "./data.types";

describe("data slice", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  describe("actions.deleteDeck", () => {
    const mockState = {
      data: {
        decks: {
          "1": { id: "1" } as Deck,
          "2": { id: "2", next_deck: "1" } as Deck,
          "3": { id: "3", next_deck: "2" } as Deck,
          "4": { id: "4" } as Deck,
        },
        history: {
          "1": ["2", "3"],
          "4": [],
        },
      },
    };

    afterEach(async () => {
      store = await getMockStore();
    });

    it("does not delete decks with upgrades", () => {
      store.setState(mockState);

      expect(() =>
        store.getState().deleteDeck("2"),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: assertion failed: Cannot delete a deck that has upgrades.]`,
      );
    });

    it("removes a deck from state", () => {
      store.setState(mockState);
      store.getState().deleteDeck("4");

      const state = store.getState();
      expect(state.data.decks["4"]).toBeUndefined();
      expect(state.data.history["4"]).toBeUndefined();
      expect(state.data.decks["1"]).toBeDefined();
    });

    it("removes deck and its upgrades from state", () => {
      store.setState(mockState);
      store.getState().deleteDeck("1");

      const state = store.getState();

      expect(state.data.decks).toEqual({
        "4": { id: "4" },
      });

      expect(state.data.history).toEqual({
        "4": [],
      });
    });
  });
});
