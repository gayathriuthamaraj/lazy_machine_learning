type DropdownProps = {
  id: string;
  options: string[];
};

export default function Dropdown({ id, options }: DropdownProps) {
  return (
    <div className="inline-flex flex-col">
      <label className="text-sm" id={id}>{id}</label>
      <select
        id={id}
        name={id}
        defaultValue=""
        className="
          border w-20 border-slate-500
          font-fenix rounded
          bg-primary-base
          px-2 py-1 m-1
          focus:outline-2
          focus:outline-primary-deep
        "
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
