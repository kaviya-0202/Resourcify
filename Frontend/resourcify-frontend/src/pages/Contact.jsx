import { useState } from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>Contact Us</h1>
          <p style={{ color: "var(--text2)" }}>Have a question or issue? We're here to help.</p>
        </div>

        <div style={s.grid}>
          <div style={s.card}>
            {sent ? (
              <div style={s.sentBox}>
                <div style={{ fontSize: "48px" }}>📬</div>
                <h2>Message sent!</h2>
                <p style={{ color: "var(--text2)" }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={s.group}>
                  <label style={s.label}>Name</label>
                  <input style={s.input} placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Email</label>
                  <input type="email" style={s.input} placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Subject</label>
                  <input style={s.input} placeholder="What's this about?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Message</label>
                  <textarea style={s.textarea} placeholder="Describe your issue or question..." rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                </div>
                <button type="submit" style={s.btn}>Send Message</button>
              </form>
            )}
          </div>

          <div style={s.infoCol}>
            {[
              { icon: "📧", title: "Email Support", desc: "support@resourcify.edu" },
              { icon: "🕐", title: "Response Time", desc: "Within 24 hours on weekdays" },
              { icon: "🏫", title: "Department Queries", desc: "Contact your HOD for department-specific issues" },
              { icon: "🐛", title: "Report a Bug", desc: "Found a problem? Let us know and we'll fix it fast" },
            ].map(item => (
              <div key={item.title} style={s.infoCard}>
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--text2)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  content: { maxWidth: "900px", margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: "32px" },
  title: { fontSize: "32px", marginBottom: "6px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px" },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text2)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { width: "100%", padding: "11px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" },
  textarea: { width: "100%", padding: "11px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none", resize: "vertical" },
  btn: { width: "100%", padding: "12px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "15px" },
  sentBox: { textAlign: "center", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  infoCol: { display: "flex", flexDirection: "column", gap: "12px" },
  infoCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" },
};

export default Contact;
