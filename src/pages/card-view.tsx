import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "wouter";

import { CardViewSidebar } from "@/components/card-view/card-view-sidebar";
import { Card } from "@/components/card/card";
import { ResolvedCard } from "@/components/card/resolved-card";
import { AppLayout } from "@/components/layouts/app-layout";
import { CenterLayout } from "@/components/layouts/center-layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";

import css from "./card-view.module.css";

type Props = {
  title: string;
  children: ReactNode;
};

function CardViewSection({ title, children }: Props) {
  return (
    <section className={css["view-section"]}>
      <h2 className={css["view-section-title"]}>{title}</h2>
      <div className={css["view-section-cards"]}>{children}</div>
    </section>
  );
}

export function CardView() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { code } = useParams();
  const [pathname] = useLocation();

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code),
  );

  useEffect(() => {
    scrollerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  if (!cardWithRelations) return null;

  const { relations } = cardWithRelations;

  return (
    <AppLayout
      centerClassName={css["view-center"]}
      sidebar="Deck list"
      filters={<CardViewSidebar resolvedCard={cardWithRelations} />}
      title={cardWithRelations.card.real_name}
    >
      <CenterLayout
        top={
          <header className={css["view-nav"]}>
            <Link href="/">
              <Button as="a">
                <ChevronDownIcon />
              </Button>
            </Link>
          </header>
        }
      >
        <div className={clsx(css["view"])} ref={scrollerRef}>
          <ResolvedCard resolvedCard={cardWithRelations} />

          {relations?.parallel && (
            <CardViewSection title="Parallel">
              <Card resolvedCard={relations.parallel} />
            </CardViewSection>
          )}

          {!!relations?.bound?.length && (
            <CardViewSection title="Bound Cards">
              {relations.bound.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.bonded?.length && (
            <CardViewSection title="Bonded">
              {relations.bonded.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.requiredCards?.length && (
            <CardViewSection title="Required cards">
              {relations.requiredCards.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.parallelCards?.length && (
            <CardViewSection title="Parallel cards">
              {relations.parallelCards.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.replacement?.length && (
            <CardViewSection title="Alternate cards">
              {relations.replacement.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.advanced?.length && (
            <CardViewSection title="Advanced cards">
              {relations.advanced.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}

          {!!relations?.restrictedTo && (
            <CardViewSection title="Restricted">
              <ResolvedCard
                resolvedCard={relations.restrictedTo}
                linked
                size="compact"
              />
            </CardViewSection>
          )}

          {!!relations?.level?.length && (
            <CardViewSection title="Other levels">
              {relations.level.map((c) => (
                <ResolvedCard
                  key={c.card.code}
                  resolvedCard={c}
                  linked
                  size="compact"
                />
              ))}
            </CardViewSection>
          )}
        </div>
      </CenterLayout>
    </AppLayout>
  );
}