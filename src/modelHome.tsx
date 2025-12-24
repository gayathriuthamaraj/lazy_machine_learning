import { Link } from "react-router-dom";
import { modelRoutes } from "./models/modelRoutes";

export default function ModelHome() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-4 pt-10">
      <h1 className="text-2xl font-semibold">ML Playground</h1>

      {modelRoutes.map(m => (
        <Link
          key={m.path}
          to={m.path}
          className="border px-6 py-2 rounded hover:bg-primary-highlight"
        >
          {m.name}
        </Link>
      ))}
    </div>
  );
}
