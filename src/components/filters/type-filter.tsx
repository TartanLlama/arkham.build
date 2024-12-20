import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListFilter,
  selectMultiselectChanges,
} from "@/store/selectors/lists";
import { selectTypeOptions } from "@/store/selectors/lists";
import type { Type } from "@/store/services/queries.types";
import { isTypeFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { FilterProps } from "./filters.types";
import { MultiselectFilter } from "./primitives/multiselect-filter";

const nameRenderer = (item: Type) => item.name;
const itemToString = (item: Type) => item.name.toLowerCase();

export function TypeFilter({ id, resolvedDeck }: FilterProps) {
  const activeList = useStore(selectActiveList);
  const filter = useStore((state) => selectActiveListFilter(state, id));
  const setFilterValue = useStore((state) => state.setFilterValue);

  assert(
    isTypeFilterObject(filter),
    `TypeFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectMultiselectChanges(filter.value);
  const options = useStore((state) => selectTypeOptions(state, resolvedDeck));

  const onApplyShortcut = useCallback(
    (value: string[]) => {
      setFilterValue(id, value);
    },
    [id, setFilterValue],
  );

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder="Select type(s)..."
      title="Type"
      value={filter.value}
    >
      {!filter.open && activeList?.cardType === "player" && (
        <ToggleGroup
          data-testid="filters-type-shortcut"
          full
          onValueChange={onApplyShortcut}
          type="multiple"
          value={filter.value}
        >
          <ToggleGroupItem value="asset">Asset</ToggleGroupItem>
          <ToggleGroupItem value="event">Event</ToggleGroupItem>
          <ToggleGroupItem value="skill">Skill</ToggleGroupItem>
        </ToggleGroup>
      )}
    </MultiselectFilter>
  );
}
