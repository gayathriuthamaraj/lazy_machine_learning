import { NavLink } from "react-router-dom";

const links = [
  { name: "Train Model", path: "/" },
  { name: "Saved Model", path: "/train" },
  { name: "Datasets", path: "/datasets" },
  { name: "Settings", path: "/settings" },
];

export default function SideBar() {
  return (
    <aside className="w-56 border-r bg-primary-highlight p-4 space-y-2">
      {links.map(link => (
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
    </aside>
  );
}
