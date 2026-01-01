import { useState } from "react";

type Mode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";

        const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            email,
            password,
        }),
        });

        if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
        }

        const data = await res.json();
        localStorage.setItem("auth_token", data.token);


      if (mode === "login") {
        if (email !== "test@example.com" || password !== "password") {
          throw new Error("Invalid credentials");
        }
      }

      localStorage.setItem("auth_token", "mock-jwt-token");
      alert(mode === "login" ? "Logged in!" : "Account created!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-base">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border border-slate-600 p-6 rounded-lg bg-primary-highlight shadow-lg"
      >
        <h1 className="text-xl font-semibold text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border px-2 py-1 rounded bg-primary-base"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border px-2 py-1 rounded bg-primary-base"
          />
        </div>

        {mode === "signup" && (
          <div className="flex flex-col">
            <label className="text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="border px-2 py-1 rounded bg-primary-base"
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-primary-deep text-white disabled:opacity-60"
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>

        <div className="text-sm text-center">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary-deep underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary-deep underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
