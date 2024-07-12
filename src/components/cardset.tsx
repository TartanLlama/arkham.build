import { cx } from "@/utils/cx";

import { useStore } from "@/store";
import type { CardSet as CardSetType } from "@/store/lib/types";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";

import css from "./cardset.module.css";

import { CircleHelp } from "lucide-react";
import { ListCard } from "./list-card/list-card";
import { Checkbox } from "./ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  onChangeCardQuantity?: (code: string, quantity: number) => void;
  onSelect?: (id: string) => void;
  set: CardSetType;
};

export function CardSet(props: Props) {
  const { onChangeCardQuantity, onSelect, set } = props;
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const cardOwnedCount = useStore(selectCardOwnedCount);

  return (
    <article
      data-testid={`cardset-${set.id}`}
      className={cx(css["cardset"], set.selected && css["selected"])}
    >
      <header className={css["cardset-header"]}>
        {onSelect ? (
          <Checkbox
            checked={set.selected}
            className={css["cardset-title"]}
            data-testid="cardset-select"
            disabled={!onSelect || !set.canSelect}
            id={`card-set-${set.id}`}
            label={set.title}
            onCheckedChange={() => onSelect?.(set.id)}
          />
        ) : (
          <h2 className={css["cardset-title"]}>{set.title}</h2>
        )}
        {set.help && (
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp />
            </TooltipTrigger>
            <TooltipContent>
              <p
                // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is produced by us.
                dangerouslySetInnerHTML={{ __html: set.help }}
              />
            </TooltipContent>
          </Tooltip>
        )}
      </header>
      <ul className={css["cardset-cards"]}>
        {set.cards.map(({ card }) => (
          <ListCard
            as="li"
            card={card}
            key={card.code}
            omitBorders
            onChangeCardQuantity={
              set.canSetQuantity ? onChangeCardQuantity : undefined
            }
            ownedCount={canCheckOwnership ? cardOwnedCount(card) : undefined}
            quantity={set.quantities?.[card.code] ?? 0}
          />
        ))}
      </ul>
    </article>
  );
}
