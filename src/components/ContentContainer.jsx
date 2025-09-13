import { useEffect, useState, useRef } from "react";

const TAB_URLS = {
  Films: "https://swapi.py4e.com/api/films/",
  People: "https://swapi.py4e.com/api/people/",
  Planets: "https://swapi.py4e.com/api/planets/",
  Species: "https://swapi.py4e.com/api/species/",
  Starships: "https://swapi.py4e.com/api/starships/",
  Vehicles: "https://swapi.py4e.com/api/vehicles/",
};

// Global cache agar data tab tidak hilang saat ganti tab
const dataCache = {};

export default function ContentContainer({ activeTab }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const isPrefetching = useRef(false);

  // Helper fetch semua page
  async function fetchAllPages(url) {
    const accumulated = [];
    let next = url;
    while (next) {
      const res = await fetch(next);
      if (!res.ok) throw new Error("Network error " + next);
      const json = await res.json();
      accumulated.push(...(json.results || []));
      next = json.next;
    }
    return accumulated;
  }

  // Load data untuk tab aktif (dengan cache)
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setSearch("");
      setSelectedItem(null);
      setCurrentPage(1);

      if (dataCache[activeTab]) {
        // ambil dari cache
        setData(dataCache[activeTab]);
        setLoading(false);
        return;
      }

      try {
        const url = TAB_URLS[activeTab];
        if (!url) {
          setData([]);
          return;
        }
        const all = await fetchAllPages(url);
        if (!mounted) return;
        dataCache[activeTab] = all;
        setData(all);
      } catch (err) {
        console.error("Error fetching " + activeTab, err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  // Prefetch tab lain (sekali saja di background)
  useEffect(() => {
    if (isPrefetching.current) return; // jangan ulang
    isPrefetching.current = true;

    async function prefetch() {
      for (const [tab, url] of Object.entries(TAB_URLS)) {
        if (dataCache[tab]) continue;
        try {
          const all = await fetchAllPages(url);
          dataCache[tab] = all;
          console.log("Prefetched:", tab, all.length);
        } catch (err) {
          console.warn("Prefetch failed for", tab, err);
        }
      }
    }

    prefetch();
  }, []);

  // Reset page saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const normalizedQuery = search.trim().toLowerCase();
  const filteredData = data.filter((item) =>
    (item.title || item.name || "").toLowerCase().includes(normalizedQuery)
  );

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const renderDetail = (item) => {
    switch (activeTab) {
      case "Films":
        return (
          <>
            <h2 className="detail-title">{item.title}</h2>
            <p><b>Episode:</b> {item.episode_id}</p>
            <p><b>Director:</b> {item.director}</p>
            <p><b>Producer:</b> {item.producer}</p>
            <p><b>Release Date:</b> {item.release_date}</p>
            <pre className="detail-pre">{item.opening_crawl}</pre>
          </>
        );
      case "People":
        return (
          <>
            <h2 className="detail-title">{item.name}</h2>
            <p><b>Height:</b> {item.height}</p>
            <p><b>Mass:</b> {item.mass}</p>
            <p><b>Hair Color:</b> {item.hair_color}</p>
            <p><b>Skin Color:</b> {item.skin_color}</p>
            <p><b>Birth Year:</b> {item.birth_year}</p>
            <p><b>Gender:</b> {item.gender}</p>
          </>
        );
      default:
        return <pre>{JSON.stringify(item, null, 2)}</pre>;
    }
  };

  if (selectedItem) {
    return (
      <div style={{ marginTop: "16px" }}>
        <button className="back-button" onClick={() => setSelectedItem(null)}>
          ← Back
        </button>
        <div className="detail-view">{renderDetail(selectedItem)}</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h2>{activeTab}</h2>

      {totalItems > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading}
          >
            ← Prev
          </button>
          <div className="page-indicator">
            {loading ? "Loading…" : `Page ${currentPage} of ${totalPages} • ${totalItems} items`}
          </div>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || loading}
          >
            Next →
          </button>
        </div>
      )}

      <input
        type="text"
        className="search-input"
        placeholder={`Search ${activeTab}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading {activeTab}…</p>}
      {!loading && filteredData.length === 0 && <p>No results found.</p>}

      <ul>
        {pagedData.map((item, idx) => (
          <li key={idx} onClick={() => setSelectedItem(item)}>
            <h3>{item.title || item.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}