import data from "../content.json";
import Dropdown from "../components/dropdown";
import NumberInput from "../components/number";

type DropdownItem = {
  id: number;
  desc: string;
  options: string[];
};

type NumberItem = {
  id: number;
  desc: string;
  float_bool: boolean;
  allowMin?: boolean;
  allowMax?: boolean;
  min?: number;
  max?: number;
};

export default function LinearRegression() {
  const model = data[0];

  const dropdown_items = (model?.dropdown?.content ?? []) as DropdownItem[];
  const number_items = (model?.number_input?.content ?? []) as NumberItem[];

  return (
    <div className="flex justify-center-safe items-center-safe min-h-screen min-w-screen select-none">
      <div className="border-2 rounded bg-primary-highlight border-primary-text pb-3 pt-10 px-5">
        <h1 className="text-xl font-semibold mb-4">{model.desc}</h1>

        {dropdown_items.map(item => (
          <Dropdown key={item.id} id={item.desc} options={item.options} />
        ))}

        {number_items.map(item => (
          <NumberInput
            key={item.id}
            id={item.desc}
            float={item.float_bool}
            allowMin={item.allowMin}
            allowMax={item.allowMax}
            min={item.min}
            max={item.max}
          />
        ))}
      </div>
    </div>
  );
}
