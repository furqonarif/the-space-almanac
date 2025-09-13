// Tabs.jsx
export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["Films", "People", "Planets", "Species", "Starships", "Vehicles"];

  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
          aria-pressed={activeTab === tab}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}