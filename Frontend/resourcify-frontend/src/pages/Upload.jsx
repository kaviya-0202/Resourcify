import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const DEPTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "All Years"];
const TYPES = ["PDF", "PPT", "DOC", "IMAGE", "VIDEO", "CODE"];
const CATS = ["Notes", "Question Paper", "Assignment", "Lab Manual", "Project"];

const Upload = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    resourceName: "", resourceType: "", department: "",
    year: "", category: "", description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    setLoading(true); setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append("file", file);
      await api.post("/resource/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setTimeout(() => navigate("/home"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={s.page}>
      <Navbar />
      <div style={s.successBox}>
        <div style={{ fontSize: "56px" }}>✅</div>
        <h2>Uploaded successfully!</h2>
        <p style={{ color: "var(--text2)" }}>Redirecting to home...</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>Upload Resource</h1>
          <p style={{ color: "var(--text2)" }}>Share academic materials with your students</p>
        </div>

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.group}>
              <label style={s.label}>Resource Name *</label>
              <input style={s.input} name="resourceName" placeholder="e.g. Data Structures Unit 3 Notes" value={form.resourceName} onChange={handleChange} required />
            </div>

            <div style={s.row}>
              <div style={s.group}>
                <label style={s.label}>Type *</label>
                <select style={s.select} name="resourceType" value={form.resourceType} onChange={handleChange} required>
                  <option value="">Select type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Category *</label>
                <select style={s.select} name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={s.row}>
              <div style={s.group}>
                <label style={s.label}>Department *</label>
                <select style={s.select} name="department" value={form.department} onChange={handleChange} required>
                  <option value="">Select dept</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Year *</label>
                <select style={s.select} name="year" value={form.year} onChange={handleChange} required>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={s.group}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} name="description" placeholder="Brief description of this resource..." rows={3} value={form.description} onChange={handleChange} />
            </div>

            <div style={s.group}>
              <label style={s.label}>File *</label>
              <div style={s.fileArea}>
                <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                <label htmlFor="file" style={s.fileLabel}>
                  {file ? (
                    <span style={{ color: "var(--green)", fontWeight: "600" }}>📎 {file.name}</span>
                  ) : (
                    <span>📁 Click to choose a file</span>
                  )}
                </label>
              </div>
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? "Uploading..." : "Upload Resource"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  content: { maxWidth: "680px", margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: "28px" },
  title: { fontSize: "32px", marginBottom: "6px" },
  card: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "36px",
  },
  error: {
    background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)",
    color: "var(--red)", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
  },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text2)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: {
    width: "100%", padding: "11px 14px", background: "var(--bg3)",
    border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none",
  },
  select: {
    width: "100%", padding: "11px 14px", background: "var(--bg3)",
    border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none",
  },
  textarea: {
    width: "100%", padding: "11px 14px", background: "var(--bg3)",
    border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none", resize: "vertical",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  fileArea: { border: "2px dashed var(--border)", borderRadius: "8px", padding: "24px", textAlign: "center" },
  fileLabel: { cursor: "pointer", color: "var(--text2)", fontSize: "14px" },
  submitBtn: {
    width: "100%", padding: "13px", background: "var(--accent)", color: "white",
    border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "15px", marginTop: "8px",
  },
  successBox: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "16px", minHeight: "60vh", textAlign: "center",
  },
};

export default Upload;
