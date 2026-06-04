import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Who are you?</h2>

      <button
        style={{ margin: "10px" }}
        onClick={() => navigate("/student")}
      >
        Student
      </button>

      <button
        style={{ margin: "10px" }}
        onClick={() => navigate("/staff")}
      >
        Staff
      </button>
    </div>
  );
};

export default RoleSelect;
