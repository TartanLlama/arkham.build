import { Field, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { ALargeSmallIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import css from "./font-size.module.css";
import type { SettingProps } from "./types";

export function FontSizeSetting(props: SettingProps) {
  const { settings, updateSettings } = props;

  const min = 85;
  const max = 125;

  const value = useMemo(() => [settings.fontSize], [settings]);

  const [liveValue, setLiveValue] = useState(value);

  useEffect(() => {
    setLiveValue(value);
  }, [value]);

  const onValueChange = useCallback(
    (values: number[]) => {
      updateSettings({
        ...settings,
        fontSize: values[0],
      });
    },
    [updateSettings, settings],
  );

  const onLiveValueChange = useCallback((values: number[]) => {
    setLiveValue(values);
  }, []);

  const onLostPointerCapture = useCallback(() => {
    if (liveValue[0] !== value[0] || liveValue[1] !== value[1]) {
      onValueChange?.(liveValue);
    }
  }, [liveValue, onValueChange, value]);

  return (
    <Field className={css["field"]} bordered>
      <FieldLabel htmlFor="font-size">
        <ALargeSmallIcon />
        Font size
      </FieldLabel>
      <div className={css["input"]}>
        <Slider
          id="font-size"
          onLostPointerCapture={onLostPointerCapture}
          onValueChange={onLiveValueChange}
          onValueCommit={onValueChange}
          min={min}
          max={max}
          step={5}
          value={liveValue}
        />
        <span>{liveValue}%</span>
      </div>
      <div className={css["preview"]} style={{ fontSize: `${liveValue[0]}%` }}>
        <h4>Preview</h4>
        <p>
          Armitage had an idea that the alphabet might be something esoterically
          used by certain forbidden cults which have come down from old times,
          and which have inherited many forms and traditions from the wizards of
          the Saracenic world.
        </p>
      </div>
    </Field>
  );
}
