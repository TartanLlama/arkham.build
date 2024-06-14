import {
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from "@floating-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { imageUrl } from "@/utils/card-utils";
import { FLOATING_PORTAL_ID } from "@/utils/constants";
import { preloadImage } from "@/utils/preload-image";

import { CardTooltip } from "../card-tooltip";
import type { Props as ListCardInnerProps } from "./list-card-inner";
import { ListCardInner } from "./list-card-inner";

type Props = {
  canOpenModal?: boolean;
  tooltip?: React.ReactNode;
} & Omit<ListCardInnerProps, "onToggleModal" | "figureRef" | "referenceProps">;

export function ListCard({
  canOpenModal = true,
  card,
  tooltip,
  ...rest
}: Props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const restTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(
    () => () => {
      if (restTimeoutRef.current) clearTimeout(restTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (tooltipOpen) preloadImage(imageUrl(card.code));
  }, [card.code, tooltipOpen]);

  const { context, refs, floatingStyles } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    middleware: [shift(), autoPlacement(), offset(2)],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    placement: "bottom-start",
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const onPointerLeave = useCallback(() => {
    clearTimeout(restTimeoutRef.current);
    setTooltipOpen(false);
  }, []);

  const onPointerMove = useCallback(() => {
    if (tooltipOpen) return;

    clearTimeout(restTimeoutRef.current);

    restTimeoutRef.current = setTimeout(() => {
      setTooltipOpen(true);
    }, 25);
  }, [tooltipOpen]);

  const referenceProps = useMemo(
    () => ({
      onPointerLeave,
      onPointerMove,
      onMouseLeave: onPointerLeave,
    }),
    [onPointerLeave, onPointerMove],
  );

  if (!card) return null;

  return (
    <>
      <ListCardInner
        {...rest}
        canOpenModal={canOpenModal}
        card={card}
        figureRef={refs.setReference}
        referenceProps={referenceProps}
      />
      {isMounted && (
        <FloatingPortal id={FLOATING_PORTAL_ID}>
          <div ref={refs.setFloating} style={floatingStyles}>
            <div style={styles}>
              {tooltip ?? <CardTooltip code={card.code} />}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}