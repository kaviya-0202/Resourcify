import { useNavigate } from "react-router-dom";

const WhoAreYou = () => {
  const navigate = useNavigate();

  return (
    <div style={s.bg}>
      <div style={s.glow} />
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.logo}>📚</div>
          <h1 style={s.title}>Resourcify</h1>
          <p style={s.subtitle}>Your college's academic resource hub</p>
        </div>

        <div style={s.cards}>
          <div style={s.card} onClick={() => navigate("/register/student")}>
            <div style={s.cardIcon}>🎓</div>
            <h2 style={s.cardTitle}>Student</h2>
            <p style={s.cardDesc}>Browse and download notes, question papers, lab manuals & more from your department</p>
            <div style={s.cardArrow}>→</div>
          </div>

          <div style={{...s.card, ...s.cardStaff}} onClick={() => navigate("/register/staff")}>
            <div style={s.cardIcon}>👩‍🏫</div>
            <h2 style={s.cardTitle}>Staff</h2>
            <p style={s.cardDesc}>Upload and manage academic resources for your students and department</p>
            <div style={s.cardArrow}>→</div>
          </div>
        </div>

        <p style={s.loginHint}>
          Already have an account?{" "}
          <span style={s.loginLink} onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

const s = {
  bg: {
    minHeight: "100vh", background: "var(--bg)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
  },
  glow: {
    position: "absolute", width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(108,140,245,0.12) 0%, transparent 70%)",
    top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%", maxWidth: "720px", padding: "40px 24px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "40px",
    position: "relative", zIndex: 1,
  },
  header: { textAlign: "center" },
  logo: { fontSize: "52px", marginBottom: "12px" },
  title: { fontSize: "48px", color: "var(--text)", marginBottom: "10px" },
  subtitle: { fontSize: "17px", color: "var(--text2)" },
  cards: { display: "flex", gap: "20px", width: "100%", flexWrap: "wrap" },
  card: {
    flex: 1, minWidth: "260px", background: "var(--bg2)",
    border: "1px solid var(--border)", borderRadius: "var(--radius)",
    padding: "32px 28px", cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
    position: "relative", overflow: "hidden",
  },
  cardStaff: { background: "rgba(108,140,245,0.06)" },
  cardIcon: { fontSize: "36px", marginBottom: "14px" },
  cardTitle: { fontSize: "22px", marginBottom: "10px" },
  cardDesc: { color: "var(--text2)", fontSize: "14px", lineHeight: "1.6" },
  cardArrow: {
    position: "absolute", bottom: "24px", right: "24px",
    fontSize: "20px", color: "var(--accent)", opacity: 0.6,
  },
  loginHint: { color: "var(--text2)", fontSize: "14px" },
  loginLink: { color: "var(--accent)", cursor: "pointer", fontWeight: "600" },
};

export default WhoAreYou;
