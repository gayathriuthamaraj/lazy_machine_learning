type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled? : boolean;
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const base =
    "px-4 py-1.5 rounded font-medium border transition";

  const styles =
    variant === "primary"
      ? "bg-primary-deep text-white border-primary-deep hover:opacity-90"
      : "bg-primary-base border-primary-text hover:bg-primary-highlight";

  return (
    <button disabled = {disabled} className={`${base} ${styles}`} onClick={onClick}>
      {label}
    </button>
  );
}
