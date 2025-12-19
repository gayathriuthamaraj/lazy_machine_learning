type DropdownProps = {
  id: string;
  options: string[];
  onChange?: (id: string, value: string) => void;
};

export default function Dropdown({ id, options, onChange }: DropdownProps) {
  return (
    <div className="inline-flex flex-col">
      <label className="text-sm" htmlFor={id}>{id}</label>
      <select
        id={id}
        name={id}
        defaultValue=""
        onChange={(e) => onChange?.(id, e.target.value)}
        className="
          border w-24 border-slate-500
          font-fenix rounded
          bg-primary-base
          px-2 py-1 m-1
          focus:outline-2
          focus:outline-primary-deep
        "
      >
        <option value="" disabled>Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
