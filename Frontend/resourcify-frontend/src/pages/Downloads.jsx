import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEPTS = ["All", "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "Other"];
const YEARS = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year", "All Years"];
const CATS = ["All", "Notes", "Question Paper", "Assignment", "Lab Manual", "Project"];

const typeColors = { PDF: "#f87171", PPT: "#fb923c", DOC: "#60a5fa", IMAGE: "#34d399", VIDEO: "#a78bfa", CODE: "#fbbf24" };

const Downloads = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState(user?.department || "All");
  const [year, setYear] = useState("All");
  const [cat, setCat] = useState("All");

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dept !== "All") params.append("department", dept);
      if (year !== "All") params.append("year", year);
      if (cat !== "All") params.append("category", cat);
      if (search) params.append("search", search);
      const res = await api.get(`/resource?${params}`);
      setResources(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [dept, year, cat]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleDownload = async (resource) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/resource/download/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = resource.originalName; a.click();
      URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>Browse Resources</h1>
          <p style={{ color: "var(--text2)" }}>{resources.length} resources found</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={s.searchRow}>
          <input
            style={s.searchInput}
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" style={s.searchBtn}>Search</button>
        </form>

        {/* Filters */}
        <div style={s.filters}>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Dept</span>
            <div style={s.pills}>
              {DEPTS.map(d => (
                <button key={d} style={{ ...s.pill, ...(dept === d ? s.pillActive : {}) }} onClick={() => setDept(d)}>{d}</button>
              ))}
            </div>
          </div>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Year</span>
            <div style={s.pills}>
              {YEARS.map(y => (
                <button key={y} style={{ ...s.pill, ...(year === y ? s.pillActive : {}) }} onClick={() => setYear(y)}>{y}</button>
              ))}
            </div>
          </div>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Category</span>
            <div style={s.pills}>
              {CATS.map(c => (
                <button key={c} style={{ ...s.pill, ...(cat === c ? s.pillActive : {}) }} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={s.loading}>Loading resources...</div>
        ) : resources.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "44px" }}>🔍</div>
            <p>No resources match your filters.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {resources.map(r => (
              <div key={r._id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ ...s.tag, background: (typeColors[r.resourceType] || "#888") + "22", color: typeColors[r.resourceType] || "#888" }}>
                    {r.resourceType}
                  </span>
                  <span style={s.catTag}>{r.category}</span>
                </div>
                <div style={s.cardName}>{r.resourceName}</div>
                {r.description && <div style={s.cardDesc}>{r.description}</div>}
                <div style={s.meta}>
                  <span>{r.department}</span>
                  <span>•</span>
                  <span>{r.year}</span>
                  <span>•</span>
                  <span>by {r.uploaderName}</span>
                </div>
                <button style={s.dlBtn} onClick={() => handleDownload(r)}>↓ Download</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: "24px" },
  title: { fontSize: "32px", marginBottom: "4px" },
  searchRow: { display: "flex", gap: "12px", marginBottom: "24px" },
  searchInput: {
    flex: 1, padding: "11px 16px", background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "8px", color: "var(--text)", fontSize: "14px", outline: "none",
  },
  searchBtn: {
    padding: "11px 22px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
  },
  filters: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" },
  filterGroup: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  filterLabel: { fontSize: "12px", fontWeight: "700", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: "48px" },
  pills: { display: "flex", gap: "6px", flexWrap: "wrap" },
  pill: {
    padding: "5px 12px", borderRadius: "20px", border: "1px solid var(--border)",
    background: "var(--bg2)", color: "var(--text2)", fontSize: "13px", cursor: "pointer",
  },
  pillActive: { background: "var(--accent)", borderColor: "var(--accent)", color: "white" },
  loading: { color: "var(--text2)", padding: "60px 0", textAlign: "center" },
  empty: { textAlign: "center", padding: "60px", color: "var(--text2)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  card: {
    background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
    padding: "20px", display: "flex", flexDirection: "column", gap: "10px",
  },
  tag: { fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.05em" },
  catTag: { fontSize: "11px", color: "var(--text2)", background: "var(--bg3)", padding: "3px 8px", borderRadius: "4px" },
  cardName: { fontWeight: "600", fontSize: "15px", lineHeight: "1.4" },
  cardDesc: { fontSize: "13px", color: "var(--text2)", lineHeight: "1.5" },
  meta: { display: "flex", gap: "6px", fontSize: "12px", color: "var(--text2)", flexWrap: "wrap" },
  dlBtn: {
    padding: "9px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", marginTop: "4px",
  },
};

export default Downloads;
