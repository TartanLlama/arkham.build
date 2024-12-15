import { applyDeckEdits } from "@/store/lib/deck-edits";
import { createDeck } from "@/store/lib/deck-factory";
import type { Card } from "@/store/services/queries.types";
import { assert } from "@/utils/assert";
import { decodeExileSlots, formatLocalCard } from "@/utils/card-utils";
import {
  ALT_ART_INVESTIGATOR_MAP,
  SPECIAL_CARD_CODES,
} from "@/utils/constants";
import { randomId } from "@/utils/crypto";
import { download } from "@/utils/download";
import { tryEnablePersistence } from "@/utils/persistence";
import { time, timeEnd } from "@/utils/time";
import type { StateCreator } from "zustand";
import type { StoreState } from ".";
import { prepareBackup, restoreBackup } from "../lib/backup";
import { mapValidationToProblem } from "../lib/deck-io";
import {
  decodeDeckMeta,
  encodeCardPool,
  encodeSealedDeck,
} from "../lib/deck-meta";
import { mappedByCode, mappedById } from "../lib/metadata-utils";
import { resolveDeck } from "../lib/resolve-deck";
import { decodeExtraSlots, encodeExtraSlots } from "../lib/slots";
import { disconnectProviderIfUnauthorized, syncAdapters } from "../lib/sync";
import type { DeckMeta } from "../lib/types";
import { selectDeckCreateCardSets } from "../selectors/deck-create";
import { selectDeckValid } from "../selectors/decks";
import { selectLatestUpgrade } from "../selectors/decks";
import {
  createShare,
  deleteDeck,
  newDeck,
  updateDeck,
  upgradeDeck,
} from "../services/queries";
import type { AppSlice } from "./app.types";
import type { Deck } from "./data.types";
import { makeLists } from "./lists";
import { createLookupTables, createRelations } from "./lookup-tables";
import { getInitialMetadata } from "./metadata";
import type { Metadata } from "./metadata.types";

import localCards from "@/store/services/data/cards.json";
import localCycles from "@/store/services/data/cycles.json";
import factions from "@/store/services/data/factions.json";
import localPacks from "@/store/services/data/packs.json";
import subTypes from "@/store/services/data/subtypes.json";
import types from "@/store/services/data/types.json";
import { assertCanPublishDeck } from "@/utils/arkhamdb";

export function getInitialAppState() {
  return {
    clientId: "",
  };
}

export const createAppSlice: StateCreator<StoreState, [], [], AppSlice> = (
  set,
  get,
) => ({
  app: getInitialAppState(),

  async init(
    queryMetadata,
    queryDataVersion,
    queryCards,
    queryDecklists,
    refresh = false,
  ) {
    const state = get();

    if (!refresh && state.metadata.dataVersion?.cards_updated_at) {
      const metadata = {
        ...state.metadata,
        factions: mappedByCode(factions),
        subtypes: mappedByCode(subTypes),
        types: mappedByCode(types),
      };

      if (localCards.length) {
        const cards = state.metadata.cards;

        for (const card of localCards) {
          cards[card.code] = formatLocalCard(card);
        }

        for (const pack of localPacks) {
          metadata.packs[pack.code] = pack;
        }

        for (const cycle of localCycles) {
          metadata.cycles[cycle.code] = cycle;
        }
      }

      state.refreshLookupTables({
        lists: makeLists(state.settings),
        metadata,
      });

      return false;
    }

    time("query_data");
    const [metadataResponse, dataVersionResponse, cards, decklists] =
      await Promise.all([
        queryMetadata(),
        queryDataVersion(),
        queryCards(),
        queryDecklists(),
      ]);
    timeEnd("query_data");

    time("create_store_data");
    const metadata: Metadata = {
      ...getInitialMetadata(),
      dataVersion: dataVersionResponse,
      cards: {},
      taboos: {},
      cycles: mappedByCode(metadataResponse.cycle),
      packs: {
        ...mappedByCode(metadataResponse.pack),
        ...mappedByCode(metadataResponse.reprint_pack),
      },
      encounterSets: mappedByCode(metadataResponse.card_encounter_set),
      factions: mappedByCode(factions),
      subtypes: mappedByCode(subTypes),
      types: mappedByCode(types),
      tabooSets: mappedById(metadataResponse.taboo_set),
      decklists: {},
    };

    if (metadata.packs["rcore"]) {
      metadata.packs["rcore"].reprint = {
        type: "rcore",
      };
    }

    for (const c of cards) {
      if (c.taboo_set_id) {
        metadata.taboos[c.id] = {
          code: c.code,
          real_text: c.real_text,
          real_back_text: c.real_back_text,
          real_taboo_text_change: c.real_taboo_text_change,
          taboo_set_id: c.taboo_set_id,
          taboo_xp: c.taboo_xp,
          exceptional: c.exceptional,
          deck_requirements: c.deck_requirements,
          deck_options: c.deck_options,
          customization_options: c.customization_options,
          real_customization_text: c.real_customization_text,
          real_customization_change: c.real_customization_change,
        };

        continue;
      }

      // SAFE! Diverging fields are added below.
      const card = c as Card;

      const pack = metadata.packs[card.pack_code];
      const cycle = metadata.cycles[pack.cycle_code];

      if (card.code in ALT_ART_INVESTIGATOR_MAP) {
        card.duplicate_of_code =
          ALT_ART_INVESTIGATOR_MAP[
            card.code as keyof typeof ALT_ART_INVESTIGATOR_MAP
          ];
      }

      // "tags" is sometimes empty string, see: https://github.com/Kamalisk/arkhamdb-json-data/pull/1351#issuecomment-1937852236
      if (!card.tags) card.tags = undefined;
      card.parallel = cycle?.code === "parallel";
      card.original_slot = card.real_slot;

      metadata.cards[card.code] = card;

      if (card.encounter_code) {
        const encounterSet = metadata.encounterSets[card.encounter_code];

        if (encounterSet && !encounterSet.pack_code) {
          encounterSet.pack_code = card.pack_code;
        }
      }
    }

    metadata.decklists = decklists.reduce<Record<string, Deck>>((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    const lookupTables = createLookupTables(metadata, state.settings);
    createRelations(metadata, lookupTables);

    for (const code of Object.keys(metadata.encounterSets)) {
      if (!metadata.encounterSets[code].pack_code) {
        delete metadata.encounterSets[code];
      }
    }

    if (refresh) {
      localStorage.removeItem("deckbuilder-data-version");
    }

    if (localCards.length) {
      for (const card of localCards) {
        if (!metadata.cards[card.code]) {
          metadata.cards[card.code] = formatLocalCard(card);
        }
      }

      for (const pack of localPacks) {
        if (!metadata.packs[pack.code]) {
          metadata.packs[pack.code] = pack;
        }
      }

      for (const cycle of localCycles) {
        if (!metadata.cycles[cycle.code]) {
          metadata.cycles[cycle.code] = cycle;
        }
      }
    }

    set({
      app: {
        clientId: state.app.clientId || randomId(),
      },
      metadata,
      lookupTables,
      ui: {
        ...state.ui,
        initialized: true,
      },
      lists: makeLists(state.settings),
    });

    timeEnd("create_store_data");

    return true;
  },
  async createDeck() {
    const state = get();
    assert(state.deckCreate, "DeckCreate state must be initialized.");

    const extraSlots: Record<string, number> = {};
    const meta: DeckMeta = {};
    const slots: Record<string, number> = {};

    const { investigatorCode, investigatorFrontCode, investigatorBackCode } =
      state.deckCreate;

    if (investigatorCode !== investigatorFrontCode) {
      meta.alternate_front = investigatorFrontCode;
    }

    if (investigatorCode !== investigatorBackCode) {
      meta.alternate_back = investigatorBackCode;
    }

    const back = state.metadata.cards[investigatorBackCode];

    for (const [key, value] of Object.entries(state.deckCreate.selections)) {
      // EDGE CASE: mandy's taboo removes the deck size select,
      // omit any selection made from deck meta.
      if (
        key === "deck_size_selected" &&
        !back.deck_options?.some((o) => !!o.deck_size_select)
      ) {
        continue;
      }

      meta[key as keyof DeckMeta] = value;
    }

    const cardSets = selectDeckCreateCardSets(state);

    for (const set of cardSets) {
      if (!set.selected) continue;

      for (const { card } of set.cards) {
        const quantity =
          state.deckCreate.extraCardQuantities?.[card.code] ??
          set.quantities?.[card.code];

        if (!quantity) continue;

        if (card.code === SPECIAL_CARD_CODES.VENGEFUL_SHADE) {
          extraSlots[card.code] = quantity;
        } else {
          slots[card.code] = quantity;
        }
      }
    }

    if (Object.keys(extraSlots).length) {
      meta.extra_deck = encodeExtraSlots(extraSlots);
    }

    const cardPool = state.deckCreate.cardPool ?? [];
    if (cardPool.length) {
      meta.card_pool = encodeCardPool(cardPool);
    }

    const sealedDeck = state.deckCreate.sealed;

    if (sealedDeck) {
      Object.assign(meta, encodeSealedDeck(sealedDeck));
    }

    let deck = createDeck({
      investigator_code: state.deckCreate.investigatorCode,
      investigator_name: back.real_name,
      name: state.deckCreate.title,
      slots,
      meta: JSON.stringify(meta),
      taboo_id: state.deckCreate.tabooSetId ?? null,
      problem: "too_few_cards",
    });

    if (state.deckCreate.provider === "arkhamdb") {
      const resolved = resolveDeck(
        state.metadata,
        state.lookupTables,
        state.sharing,
        deck,
      );

      assertCanPublishDeck(resolved);

      try {
        const adapter = new syncAdapters["arkhamdb"](state);
        const { id } = await newDeck(deck);
        deck = adapter.in(await updateDeck(adapter.out({ ...deck, id })));
      } catch (err) {
        disconnectProviderIfUnauthorized("arkhamdb", err, set);
        throw err;
      }
    }

    set({
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: deck,
        },
        history: {
          ...state.data.history,
          [deck.id]: [],
        },
      },
      deckCreate: undefined,
    });

    return deck.id;
  },
  async deleteDeck(id, cb) {
    const state = get();
    const decks = { ...state.data.decks };

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[id];

    const deck = decks[id];
    assert(deck.next_deck == null, "Cannot delete a deck that has upgrades.");

    delete decks[id];
    const history = { ...state.data.history };

    const historyEntries = history[id] ?? [];

    for (const prevId of historyEntries) {
      delete decks[prevId];
      delete deckEdits[prevId];
    }

    if (deck.source === "arkhamdb") {
      try {
        await deleteDeck(id, true);
      } catch (err) {
        disconnectProviderIfUnauthorized("arkhamdb", err, set);
        // when deleting, we ignore the remote error and continue to delete
      }
    } else {
      await Promise.allSettled(
        [...history[id], deck.id].map((curr) =>
          state.deleteShare(curr as string),
        ),
      );
    }

    delete history[id];

    cb?.();

    set({
      data: {
        ...state.data,
        decks,
        history,
      },
      deckEdits,
    });
  },

  async deleteAllDecks() {
    const state = get();

    const decks = { ...state.data.decks };
    const history = { ...state.data.history };
    const edits = { ...state.deckEdits };

    for (const id of Object.keys(decks)) {
      if (decks[id].source !== "arkhamdb") {
        delete decks[id];
        delete history[id];
        delete edits[id];
      }
    }

    set({
      data: {
        ...state.data,
        decks,
        history,
      },
    });

    if (Object.keys(state.sharing.decks).length) {
      await state.deleteAllShares().catch(console.error);
    }
  },
  async saveDeck(deckId) {
    const state = get();

    const edits = state.deckEdits[deckId];

    const deck = state.data.decks[deckId];
    if (!deck) return deckId;

    let nextDeck = applyDeckEdits(deck, edits, state.metadata, true);
    nextDeck.date_update = new Date().toISOString();

    const resolved = resolveDeck(
      state.metadata,
      state.lookupTables,
      state.sharing,
      nextDeck,
    );

    const validation = selectDeckValid(state, resolved);
    nextDeck.problem = mapValidationToProblem(validation);

    const upgrade = selectLatestUpgrade(state, resolved);

    if (upgrade) {
      nextDeck.xp_spent = upgrade.xpSpent;
      nextDeck.xp_adjustment = upgrade.xpAdjustment;
    }

    if (nextDeck.source === "arkhamdb") {
      assertCanPublishDeck(resolved);

      state.setRemoting("arkhamdb", true);

      try {
        const adapter = new syncAdapters.arkhamdb(state);
        nextDeck = adapter.in(await updateDeck(adapter.out(nextDeck)));
      } catch (err) {
        disconnectProviderIfUnauthorized("arkhamdb", err, set);
        throw err;
      } finally {
        state.setRemoting("arkhamdb", false);
      }
    } else {
      await state.updateShare(nextDeck);
    }

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deckId];

    set({
      deckEdits,
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [nextDeck.id]: nextDeck,
        },
      },
    });

    tryEnablePersistence();
    return nextDeck.id;
  },

  async upgradeDeck({ id, xp: _xp, exileString, usurped }) {
    const xp = _xp + (usurped === false ? 1 : 0);

    const state = get();

    const deck = state.data.decks[id];
    assert(deck, `Deck ${id} does not exist.`);

    assert(
      !deck.next_deck,
      `Deck ${id} already has an upgrade: ${deck.next_deck}.`,
    );

    const xpCarryover =
      (deck.xp ?? 0) + (deck.xp_adjustment ?? 0) - (deck.xp_spent ?? 0);

    const now = new Date().toISOString();
    let newDeck: Deck = {
      ...structuredClone(deck),
      id: randomId(),
      date_creation: now,
      date_update: now,
      next_deck: null,
      previous_deck: deck.id,
      version: "0.1",
      xp: xp + xpCarryover,
      xp_spent: null,
      xp_adjustment: null,
      exile_string: exileString ?? null,
    };

    const meta = decodeDeckMeta(deck);

    if (usurped) {
      delete newDeck.slots[SPECIAL_CARD_CODES.THE_GREAT_WORK];
      meta.transform_into = SPECIAL_CARD_CODES.LOST_HOMUNCULUS;

      for (const [code, quantity] of Object.entries(newDeck.slots)) {
        const card = state.metadata.cards[code];

        if (quantity && card.restrictions?.investigator) {
          delete newDeck.slots[code];
          newDeck.slots[SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS] ??= 0;
          newDeck.slots[SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS] += quantity;
        }
      }
    }

    if (exileString) {
      const exiledSlots = decodeExileSlots(exileString);
      const extraSlots = decodeExtraSlots(meta);

      for (const [code, quantity] of Object.entries(exiledSlots)) {
        if (newDeck.slots[code]) {
          newDeck.slots[code] -= quantity;
          if (newDeck.slots[code] <= 0) delete newDeck.slots[code];
        }

        if (extraSlots[code]) {
          extraSlots[code] -= quantity;
          if (extraSlots[code] <= 0) delete extraSlots[code];
        }

        if (meta[`cus_${code}`]) {
          delete meta[`cus_${code}`];
        }
      }

      meta.extra_deck = encodeExtraSlots(extraSlots);
    }

    newDeck.meta = JSON.stringify(meta);

    const isShared = !!state.sharing.decks[deck.id];

    if (deck.source === "arkhamdb") {
      state.setRemoting("arkhamdb", true);
      try {
        const adapter = new syncAdapters.arkhamdb(state);
        const res = await upgradeDeck(deck.id, {
          xp,
          exiles: exileString,
          meta: newDeck.meta,
        });
        newDeck = adapter.in(res);
      } catch (err) {
        disconnectProviderIfUnauthorized("arkhamdb", err, set);
        throw err;
      } finally {
        state.setRemoting("arkhamdb", false);
      }
    } else if (isShared) {
      await createShare(state.app.clientId, newDeck);
    }

    const history = { ...state.data.history };
    history[newDeck.id] = [deck.id, ...history[deck.id]];
    delete history[deck.id];

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deck.id];

    const sharedDecks = { ...state.sharing.decks };
    if (isShared) {
      sharedDecks[newDeck.id] = newDeck.date_update;
    }

    set({
      deckEdits,
      data: {
        ...state.data,
        decks: {
          ...state.data.decks,
          [deck.id]: {
            ...deck,
            next_deck: newDeck.id,
          },
          [newDeck.id]: newDeck,
        },
        history,
      },
      sharing: {
        ...state.sharing,
        decks: sharedDecks,
      },
    });

    tryEnablePersistence();

    return newDeck;
  },

  async deleteUpgrade(id, cb) {
    const state = get();

    const deck = state.data.decks[id];
    assert(deck, `Deck ${id} does not exist.`);

    const previousId = deck.previous_deck;

    assert(previousId, "Deck does not have a previous deck.");

    const decks = { ...state.data.decks };
    assert(decks[previousId], "Previous deck does not exist.");

    const history = { ...state.data.history };

    const deckHistory = history[deck.id];
    assert(Array.isArray(deckHistory), "Deck history does not exist.");

    history[previousId] = deckHistory.filter((x) => deck.previous_deck !== x);
    delete history[deck.id];

    decks[previousId] = { ...decks[previousId], next_deck: null };
    delete decks[deck.id];

    const deckEdits = { ...state.deckEdits };
    delete deckEdits[deck.id];

    if (deck.source === "arkhamdb") {
      state.setRemoting("arkhamdb", true);

      try {
        await deleteDeck(deck.id, false);
      } catch (err) {
        disconnectProviderIfUnauthorized("arkhamdb", err, set);
        throw err;
      } finally {
        state.setRemoting("arkhamdb", false);
      }
    } else {
      await state.deleteShare(deck.id as string).catch(console.error);
    }

    cb?.(previousId);

    set({
      deckEdits,
      data: {
        ...state.data,
        decks,
        history,
      },
    });

    return previousId;
  },
  backup() {
    download(
      prepareBackup(get()),
      `arkham-build-${new Date().toISOString()}.json`,
      "application/json",
    );
  },
  async restore(buffer) {
    set(await restoreBackup(get(), buffer));
  },
});
