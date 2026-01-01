import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("auth_token"));

  function handleLogout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  return (
    <header className="h-14 flex items-center px-6 border-b bg-primary-highlight">
      <h1
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        ML Playground
      </h1>

      <div className="ml-auto flex items-center gap-4 text-sm">
        {isLoggedIn ? (
          <>
            <span className="opacity-80">Logged in</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 text-white text-xs"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 rounded bg-primary-deep text-white text-xs"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
