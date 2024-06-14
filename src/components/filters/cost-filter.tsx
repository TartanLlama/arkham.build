import { useCallback } from "react";

import SvgX from "@/assets/icons/x.svg?react";
import { useStore } from "@/store";
import {
  selectCostMinMax,
  selectOpen,
  selectValue,
} from "@/store/selectors/filters/cost";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import { CostFilter as CostFilterSchema } from "@/store/slices/filters/types";

import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { RangeSelect } from "../ui/range-select";
import { FilterContainer } from "./filter-container";

export function CostFilter() {
  const [min, max] = useStore(selectCostMinMax);
  const cardType = useStore(selectActiveCardType);
  const value = useStore(selectValue);
  const open = useStore(selectOpen);

  const setFilter = useStore((state) => state.setActiveNestedFilter);
  const resetFilter = useStore((state) => state.resetFilterKey);
  const setFilterOpen = useStore((state) => state.setFilterOpen);

  const setValue = useCallback(
    function setValue<K extends keyof CostFilterSchema["value"]>(
      key: K,
      val: CostFilterSchema["value"][K],
    ) {
      setFilter(cardType, "cost", key, val);
    },
    [cardType, setFilter],
  );

  const resetActiveCost = useCallback(() => {
    resetFilter(cardType, "cost");
  }, [cardType, resetFilter]);

  const onValueCommit = useCallback(
    (val: number[]) => {
      setValue("range", [val[0], val[1]]);
    },
    [setValue],
  );

  const onSetEven = useCallback(
    (val: boolean | string) => {
      setValue("even", !!val);
    },
    [setValue],
  );

  const onSetOdd = useCallback(
    (val: boolean | string) => {
      setValue("odd", !!val);
    },
    [setValue],
  );

  const onSetX = useCallback(
    (val: boolean | string) => {
      setValue("x", !!val);
    },
    [setValue],
  );

  const onOpenChange = useCallback(
    (val: boolean) => {
      if (val) {
        setValue("range", [min, max]);
        setFilterOpen(cardType, "cost", val);
      } else {
        resetActiveCost();
      }
    },
    [min, max, setValue, setFilterOpen, resetActiveCost, cardType],
  );

  return (
    <FilterContainer title="Cost" open={open} onOpenChange={onOpenChange}>
      <RangeSelect
        id="cost-select"
        min={min}
        max={max}
        onValueCommit={onValueCommit}
        value={value.range ?? [min, max]}
      />
      <CheckboxGroup>
        <Checkbox
          label="Even"
          id="cost-even"
          onCheckedChange={onSetEven}
          checked={value.even}
        />
        <Checkbox
          label="Odd"
          id="cost-odd"
          onCheckedChange={onSetOdd}
          checked={value.odd}
        />
        <Checkbox
          label={<SvgX />}
          id="cost-x"
          onCheckedChange={onSetX}
          checked={value.x}
        />
      </CheckboxGroup>
    </FilterContainer>
  );
}
