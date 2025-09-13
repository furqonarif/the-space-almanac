// Header.jsx
export default function Header({ theme, setTheme }) {
  return (
    <header>
      <h1 className="page-title">THE SPACE ALMANAC</h1>

      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
      </button>
    </header>
  );
}