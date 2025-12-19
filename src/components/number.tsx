import { useState } from "react";
import type { ChangeEvent } from "react";

type NumberInputProps = {
  id: string;
  min?: number;
  max?: number;
  allowMin?: boolean;
  allowMax?: boolean;
  float: boolean;
  onChange?: (id: string, value: number) => void;
};

export default function NumberInput({
  id,
  min,
  max,
  allowMin = true,
  allowMax = true,
  float,
  onChange,
}: NumberInputProps) {
  const step = float ? 0.01 : 1;

  const hasMin = typeof min === "number";
  const hasMax = typeof max === "number";

  const effectiveMin = allowMin && hasMin ? min! : 0;
  const effectiveMax = hasMax && !allowMax ? max! - step : max;

  const [value, setValue] = useState<number>(effectiveMin);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let next = Number(e.target.value);
    if (Number.isNaN(next)) return;

    if (next < effectiveMin) next = effectiveMin;
    if (hasMax && effectiveMax !== undefined && next > effectiveMax)
      next = effectiveMax;

    setValue(next);
    onChange?.(id, next);
  }

  return (
    <div className="inline-flex flex-col">
      <label className="text-sm" htmlFor={id}>{id}</label>
      <input
        type="number"
        id={id}
        value={value}
        min={effectiveMin}
        max={effectiveMax}
        step={step}
        onChange={handleChange}
        className="
          border w-20 m-1 pl-1.5 h-7
          border-slate-500 font-fenix rounded
          focus:outline-2 focus:outline-primary-deep
          bg-primary-base
        "
      />
    </div>
  );
}
