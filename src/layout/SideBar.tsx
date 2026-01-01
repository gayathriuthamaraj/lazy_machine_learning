import { NavLink } from "react-router-dom";
import { modelRoutes } from "../models/modelRoutes";

const mainLinks = [
  { name: "Saved Models", path: "/saved-models" },
  { name: "Datasets", path: "/datasets" },
  { name: "Settings", path: "/settings" },
];

export default function SideBar() {
  return (
    <aside className="w-64 border-r bg-primary-highlight p-4 space-y-6 overflow-y-auto">
      
      {/* Main navigation */}
      <div className="space-y-1">
        {mainLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm ${
                isActive
                  ? "bg-primary-deep text-white"
                  : "hover:bg-primary-text/10"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Models section */}
      <div>
        <h2 className="text-xs uppercase tracking-wide opacity-60 mb-2">
          Models
        </h2>

        <div className="space-y-1">
          {modelRoutes.map(model => (
            <NavLink
              key={model.path}
              to={model.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive
                    ? "bg-primary-deep text-white"
                    : "hover:bg-primary-text/10"
                }`
              }
            >
              {model.name}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
