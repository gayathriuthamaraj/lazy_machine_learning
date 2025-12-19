import { useState } from "react";
import type { ChangeEvent } from "react";

type NumberInputProps = {
  id: string;
  min?: number;        
  max?: number;        
  allowMin?: boolean;  
  allowMax?: boolean;
  float: boolean;
};

export default function NumberInput({
  id,
  min,
  max,
  allowMin = true,
  allowMax = true,
  float,
}: NumberInputProps) {
  const step = float ? 0.01 : 1;

  const hasMin = typeof min === "number";
  const hasMax = typeof max === "number";

  const baseMin = allowMin && hasMin ? min! : 1;

  const effectiveMin = baseMin;
  const effectiveMax = hasMax && !allowMax ? max! - step : max;

  const [value, setValue] = useState<number>(effectiveMin);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
      let next = Number(e.target.value);

      if (Number.isNaN(next)) return;

      if (next < effectiveMin) {
        next = effectiveMin;
      }

      if (hasMax && next > effectiveMax!) {
        next = effectiveMax!;
      }

  setValue(next);
}



  return (
    <div className="inline-flex flex-col">
      <label className="text-sm" id={id}>{id}</label>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        min={effectiveMin}
        max={effectiveMax}
        step={step}
        onChange={handleChange}
        className="
          border w-18 m-1 pl-1.5 h-7
          border-slate-500 font-fenix rounded
          focus:outline-2 focus:outline-primary-deep
          bg-primary-base
        "
      />
    </div>
  );
}
