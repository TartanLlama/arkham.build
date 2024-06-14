import clsx from "clsx";
import { useParams } from "wouter";

import type { Grouping } from "@/store/lib/deck-grouping";
import { sortBySlots } from "@/store/lib/sorting";
import type { Card } from "@/store/services/types";
import { capitalize } from "@/utils/capitalize";
import type { PlayerType } from "@/utils/constants";
import { PLAYER_TYPE_ORDER } from "@/utils/constants";

import css from "./decklist-groups.module.css";

import { ListCard } from "../card-list/list-card";
import SlotIcon from "../icons/slot-icon";

type Props = {
  group: Grouping;
  layout: "one_column" | "two_column";
};

export function DecklistGroups({ group, layout }: Props) {
  const assetGroup = group["asset"] ? (
    <div className={clsx(css["group"], css["asset"])}>
      <h4 className={css["group-title"]}>Asset</h4>
      <ol className={css["group-children"]}>
        {Object.entries(group["asset"] as Record<string, Card[]>)
          .toSorted(([a], [b]) => sortBySlots(a, b))
          .map(([key, val]) => {
            return (
              <li className={css["group-child"]} key={key}>
                <h5 className={css["group-entry_nested-title"]}>
                  <SlotIcon code={key} />
                  {capitalize(key)}
                </h5>
                <DecklistGroup cards={val} />
              </li>
            );
          })}
      </ol>
    </div>
  ) : null;

  const rest = Object.keys(group)
    .filter((g) => g !== "asset")
    .toSorted(
      (a, b) =>
        PLAYER_TYPE_ORDER.indexOf(a as PlayerType) -
        PLAYER_TYPE_ORDER.indexOf(b as PlayerType),
    )
    .map((key) => {
      const k = key as keyof Grouping;
      const entry = group[k] as Card[];
      if (!entry) return null;
      return (
        <li className={clsx(css["group"])} key={k}>
          <h4 className={css["group-title"]}>{capitalize(k)}</h4>
          <DecklistGroup cards={entry} />
        </li>
      );
    });

  return layout === "one_column" ? (
    <ol className={css["group_one-col"]}>
      {assetGroup}
      {rest}
    </ol>
  ) : (
    <div className={css["group_two-cols"]}>
      {assetGroup}
      <ol>{rest}</ol>
    </div>
  );
}

export function DecklistGroup({ cards }: { cards: Card[] }) {
  const { id } = useParams();

  return (
    <ol>
      {cards
        .toSorted((a, b) => a.real_name.localeCompare(b.real_name))
        .map((card) => (
          <ListCard
            as="li"
            key={card.code}
            card={card}
            quantity={card.quantity}
            pathPrefix={`/deck/${id}/`}
            size="sm"
          />
        ))}
    </ol>
  );
}