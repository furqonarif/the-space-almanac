// App.jsx
import { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import ContentContainer from "./components/ContentContainer";
import Footer from "./components/Footer";
import "./styles.css"; // <-- tambahkan import ini

export default function App() {
  // State: tab aktif (default "Films")
  const [activeTab, setActiveTab] = useState("Films");

  // State: theme (default "dark")
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`app-root ${theme}`}>
      {/* Header */}
      <Header theme={theme} setTheme={setTheme} setActiveTab={setActiveTab} />

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <main className="main-content">
        <ContentContainer activeTab={activeTab} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}