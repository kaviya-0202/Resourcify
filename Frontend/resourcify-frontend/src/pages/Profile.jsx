import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG", "Faculty"];

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myResources, setMyResources] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, resourceRes] = await Promise.all([
          api.get("/auth/profile"),
          api.get("/resource"),
        ]);
        setProfile(profileRes.data);
        setForm(profileRes.data);
        const mine = resourceRes.data.filter(r => String(r.uploadedBy) === String(profileRes.data._id));
        setMyResources(mine);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.put("/auth/profile", form);
      setProfile(res.data.user);
      const token = localStorage.getItem("token");
      login(token, res.data.user);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/resource/${id}`);
      setMyResources(myResources.filter(r => r._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div style={s.page}><Navbar /><div style={s.loading}>Loading profile...</div></div>
  );

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* Profile Card */}
        <div style={s.profileCard}>
          <div style={s.avatarBig}>{profile?.name?.[0]?.toUpperCase()}</div>
          <div style={s.profileInfo}>
            <h1 style={s.name}>{profile?.name}</h1>
            <div style={s.badge}>{profile?.role}</div>
            <div style={s.meta}>{profile?.email}</div>
            <div style={s.meta}>{profile?.department} • {profile?.year}</div>
          </div>
          <button style={s.editBtn} onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        {/* Success / Error */}
        {success && <div style={s.successMsg}>{success}</div>}
        {error && <div style={s.errorMsg}>{error}</div>}

        {/* Edit Form */}
        {editing && (
          <div style={s.editCard}>
            <h2 style={s.sectionTitle}>Edit Profile</h2>
            <div style={s.formGrid}>
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Phone", key: "phone", type: "text" },
                { label: "College", key: "college", type: "text" },
              ].map(field => (
                <div key={field.key} style={s.group}>
                  <label style={s.label}>{field.label}</label>
                  <input
                    style={s.input}
                    type={field.type}
                    value={form[field.key] || ""}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              <div style={s.group}>
                <label style={s.label}>Department</label>
                <select style={s.input} value={form.department || ""} onChange={e => setForm({ ...form, department: e.target.value })}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Year</label>
                <select style={s.input} value={form.year || ""} onChange={e => setForm({ ...form, year: e.target.value })}>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* My Uploads */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>My Uploads ({myResources.length})</h2>
          {myResources.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: "40px" }}>📂</div>
              <p>You haven't uploaded anything yet.</p>
              <button style={s.uploadBtn} onClick={() => navigate("/upload")}>Upload Now</button>
            </div>
          ) : (
            <div style={s.grid}>
              {myResources.map(r => (
                <div key={r._id} style={s.card}>
                  <div style={s.cardTop}>
                    <span style={s.typeTag}>{r.resourceType}</span>
                    <span style={s.catTag}>{r.category}</span>
                  </div>
                  <div style={s.cardName}>{r.resourceName}</div>
                  <div style={s.cardMeta}>{r.department} • {r.year}</div>
                  <button style={s.deleteBtn} onClick={() => handleDelete(r._id)}>🗑 Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  content: { maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" },
  loading: { textAlign: "center", padding: "80px", color: "var(--text2)" },
  profileCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "32px",
    display: "flex", alignItems: "center", gap: "24px",
    marginBottom: "24px", flexWrap: "wrap",
  },
  avatarBig: {
    width: "72px", height: "72px", borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", fontWeight: "700", flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  name: { fontSize: "26px", marginBottom: "6px" },
  badge: {
    display: "inline-block", padding: "3px 10px", borderRadius: "20px",
    background: "rgba(108,140,245,0.15)", color: "var(--accent)",
    fontSize: "12px", fontWeight: "600", textTransform: "capitalize", marginBottom: "8px",
  },
  meta: { fontSize: "14px", color: "var(--text2)", marginBottom: "2px" },
  editBtn: {
    padding: "9px 18px", background: "transparent", border: "1px solid var(--border)",
    borderRadius: "8px", color: "var(--text)", fontSize: "14px", cursor: "pointer",
  },
  successMsg: {
    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
    color: "var(--green)", padding: "12px 16px", borderRadius: "8px",
    fontSize: "14px", marginBottom: "16px",
  },
  errorMsg: {
    background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
    color: "var(--red)", padding: "12px 16px", borderRadius: "8px",
    fontSize: "14px", marginBottom: "16px",
  },
  editCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "28px", marginBottom: "24px",
  },
  sectionTitle: { fontSize: "20px", marginBottom: "20px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  group: {},
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text2)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { width: "100%", padding: "10px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" },
  saveBtn: {
    padding: "11px 24px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
  },
  section: { marginTop: "8px" },
  empty: { textAlign: "center", padding: "48px", color: "var(--text2)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  uploadBtn: { padding: "10px 20px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  cardTop: { display: "flex", gap: "8px" },
  typeTag: { fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", background: "rgba(108,140,245,0.15)", color: "var(--accent)" },
  catTag: { fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "var(--bg3)", color: "var(--text2)" },
  cardName: { fontWeight: "600", fontSize: "15px" },
  cardMeta: { fontSize: "12px", color: "var(--text2)" },
  deleteBtn: { padding: "7px 12px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)", borderRadius: "6px", fontSize: "13px", cursor: "pointer", marginTop: "4px" },
};

export default Profile;