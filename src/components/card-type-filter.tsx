import { useCallback } from "react";

import SvgAutoFail from "@/assets/icons/auto_fail.svg?react";
import SvgInvestigator from "@/assets/icons/investigator.svg?react";
import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import { CardTypeFilter as CardTypeFilterSchema } from "@/store/slices/filters/types";

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type Props = {
  className?: string;
};

export function CardTypeFilter({ className }: Props) {
  const cardTypeFilter = useStore(selectActiveCardType);
  const setActiveCardType = useStore((state) => state.setActiveCardType);

  const onToggle = useCallback(
    (value: CardTypeFilterSchema) => {
      if (value) setActiveCardType(value);
    },
    [setActiveCardType],
  );

  return (
    <ToggleGroup
      className={className}
      defaultValue="player"
      icons
      onValueChange={onToggle}
      type="single"
      value={cardTypeFilter}
    >
      <ToggleGroupItem value="player">
        <SvgInvestigator />
      </ToggleGroupItem>
      <ToggleGroupItem value="encounter">
        <SvgAutoFail />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}