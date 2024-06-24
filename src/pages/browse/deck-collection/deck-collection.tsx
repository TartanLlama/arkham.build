import { Plus } from "lucide-react";
import { Link } from "wouter";

import { DeckSummary } from "@/components/deck-summary";
import { DeckTags } from "@/components/deck-tags";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Scroller } from "@/components/ui/scroller";
import { useStore } from "@/store";
import { selectLocalDecks } from "@/store/selectors/decks";

import css from "./deck-collection.module.css";

import { DeckCollectionImport } from "./deck-collection-import";

export function DeckCollection() {
  const decks = useStore(selectLocalDecks);

  return (
    <div className={css["container"]}>
      <header className={css["header"]}>
        <h2 className={css["title"]}>Decks</h2>
        <div className={css["actions"]}>
          <Popover>
            <DeckCollectionImport />
          </Popover>
          <Link asChild to="/deck/create">
            <Button as="a">
              <Plus />
            </Button>
          </Link>
        </div>
      </header>
      {decks.length ? (
        <Scroller>
          <ol className={css["decks"]}>
            {decks.map(({ deck, validation }) => (
              <li className={css["deck"]} key={deck.id}>
                <Link asChild href={`/deck/view/${deck.id}`}>
                  <a>
                    <DeckSummary
                      deck={deck}
                      interactive
                      showThumbnail
                      validation={validation}
                    >
                      {deck.tags && <DeckTags tags={deck.tags} />}
                    </DeckSummary>
                  </a>
                </Link>
              </li>
            ))}
          </ol>
        </Scroller>
      ) : (
        <div className={css["placeholder"]}>No decks.</div>
      )}
    </div>
  );
}
