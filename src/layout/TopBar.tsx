export default function TopBar() {
  return (
    <header className="h-14 flex items-center px-6 border-b bg-primary-highlight">
      <h1 className="text-lg font-semibold">ML Playground</h1>

      <div className="ml-auto text-sm opacity-80">
        Logged in as Guest
      </div>
    </header>
  );
}
