import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import {
  selectChanges,
  selectOpen,
  selectOptions,
  selectValue,
} from "@/store/selectors/filters/traits";
import { Trait } from "@/store/slices/filters/types";

import { Combobox } from "../ui/combobox/combobox";
import { FilterContainer } from "./filter-container";

export function TraitFilter() {
  const cardType = useStore(selectActiveCardType);
  const changes = useStore(selectChanges);
  const traits = useStore(selectOptions);
  const open = useStore(selectOpen);
  const value = useStore(selectValue);

  const setActiveNestedFilter = useStore(
    (state) => state.setActiveNestedFilter,
  );
  const setFilterOpen = useStore((state) => state.setFilterOpen);
  const resetFilter = useStore((state) => state.resetFilterKey);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen(cardType, "trait", val);
    },
    [setFilterOpen, cardType],
  );

  const onReset = useCallback(() => {
    resetFilter(cardType, "trait");
  }, [resetFilter, cardType]);

  const onSelectTrait = useCallback(
    (code: string, value: boolean) => {
      setActiveNestedFilter(cardType, "trait", code, value);
    },
    [setActiveNestedFilter, cardType],
  );

  const nameRenderer = useCallback((item: Trait) => item.code, []);
  const itemToString = useCallback(
    (item: Trait) => item.code.toLowerCase(),
    [],
  );

  return (
    <FilterContainer
      title="Trait"
      filterString={changes}
      onReset={onReset}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Combobox
        id={"combobox-filter-trait"}
        items={traits}
        onSelectItem={onSelectTrait}
        selectedItems={value}
        placeholder="Add traits..."
        label="Traits"
        itemToString={itemToString}
        renderItem={nameRenderer}
        renderResult={nameRenderer}
      />
    </FilterContainer>
  );
}
