import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CATEGORIES = ["Notes", "Question Paper", "Assignment", "Lab Manual", "Project"];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/resource?department=${user?.department || ""}`)
      .then(res => setResources(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const categoryCount = (cat) => resources.filter(r => r.category === cat).length;

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroGlow} />
          <h1 style={s.heroTitle}>Hello, {user?.name?.split(" ")[0]} 👋</h1>
          <p style={s.heroSub}>
            {user?.department} • {user?.role === "staff" ? "Upload & manage resources" : "Browse resources for your department"}
          </p>
          <div style={s.heroBtns}>
            <button style={s.btnPrimary} onClick={() => navigate("/downloads")}>Browse Resources</button>
            {user?.role === "staff" && (
              <button style={s.btnSecondary} onClick={() => navigate("/upload")}>+ Upload New</button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {CATEGORIES.map(cat => (
            <div key={cat} style={s.statCard}>
              <div style={s.statNum}>{categoryCount(cat)}</div>
              <div style={s.statLabel}>{cat}</div>
            </div>
          ))}
          <div style={{ ...s.statCard, ...s.statTotal }}>
            <div style={s.statNum}>{resources.length}</div>
            <div style={s.statLabel}>Total Resources</div>
          </div>
        </div>

        {/* Recent uploads */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Recent in {user?.department}</h2>
          {loading ? (
            <p style={{ color: "var(--text2)" }}>Loading...</p>
          ) : resources.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: "40px" }}>📂</div>
              <p>No resources yet for your department.</p>
              {user?.role === "staff" && <button style={s.btnPrimary} onClick={() => navigate("/upload")}>Upload the first one</button>}
            </div>
          ) : (
            <div style={s.resourceGrid}>
              {resources.slice(0, 6).map(r => (
                <ResourceCard key={r._id} resource={r} />
              ))}
            </div>
          )}
          {resources.length > 6 && (
            <button style={s.viewAll} onClick={() => navigate("/downloads")}>View all {resources.length} resources →</button>
          )}
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource }) => {
  const typeColors = { PDF: "#f87171", PPT: "#fb923c", DOC: "#60a5fa", IMAGE: "#34d399", VIDEO: "#a78bfa", CODE: "#fbbf24" };
  const color = typeColors[resource.resourceType] || "var(--accent)";

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/resource/download/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = resource.originalName;
      a.click(); URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
  };

  return (
    <div style={s.card}>
      <div style={{ ...s.cardType, background: color + "22", color }}>{resource.resourceType}</div>
      <div style={s.cardName}>{resource.resourceName}</div>
      <div style={s.cardMeta}>{resource.category} • {resource.year}</div>
      <div style={s.cardFooter}>
        <span style={s.uploader}>by {resource.uploaderName}</span>
        <button style={s.dlBtn} onClick={handleDownload}>↓ Download</button>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  hero: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "48px 40px",
    marginBottom: "32px", position: "relative", overflow: "hidden",
  },
  heroGlow: {
    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(108,140,245,0.15) 0%, transparent 70%)",
    right: "-100px", top: "-100px", pointerEvents: "none",
  },
  heroTitle: { fontSize: "36px", marginBottom: "8px" },
  heroSub: { color: "var(--text2)", fontSize: "15px", marginBottom: "24px" },
  heroBtns: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnPrimary: {
    padding: "11px 22px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
  },
  btnSecondary: {
    padding: "11px 22px", background: "transparent", color: "var(--accent)",
    border: "1px solid var(--accent)", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "14px", marginBottom: "36px",
  },
  statCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "20px 16px", textAlign: "center",
  },
  statTotal: { background: "rgba(108,140,245,0.1)", borderColor: "var(--accent)" },
  statNum: { fontSize: "28px", fontWeight: "700", color: "var(--accent)", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "var(--text2)", fontWeight: "500" },
  section: { marginTop: "32px" },
  sectionTitle: { fontSize: "22px", marginBottom: "20px" },
  empty: { textAlign: "center", padding: "60px", color: "var(--text2)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  resourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
  card: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "20px",
    display: "flex", flexDirection: "column", gap: "8px",
  },
  cardType: { fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", alignSelf: "flex-start", letterSpacing: "0.05em" },
  cardName: { fontWeight: "600", fontSize: "15px", lineHeight: "1.3" },
  cardMeta: { fontSize: "12px", color: "var(--text2)" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  uploader: { fontSize: "12px", color: "var(--text2)" },
  dlBtn: {
    padding: "6px 12px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600",
  },
  viewAll: {
    marginTop: "20px", background: "transparent", border: "none",
    color: "var(--accent)", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
};

export default Home;
