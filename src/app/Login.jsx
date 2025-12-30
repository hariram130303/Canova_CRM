// frontend/src/app/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    // save token
    localStorage.setItem("employeeToken", res.data.token);

    navigate("/app/home");
  } catch (err) {
    alert("Invalid credentials");
  }
};


  return (
  <div style={styles.wrapper}>
    <div style={styles.phone}>
      <h2 style={styles.logo}>
        Canova<span style={{ color: "#EFFF4D" }}>CRM</span>
      </h2>

      <input
        placeholder="email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.btn} onClick={handleLogin}>
        Submit
      </button>
    </div>
  </div>
);
}

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    background: "#f4f4f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  phone: {
    width: "380px",         // mobile width
    height: "680px",        // mobile height
    background: "#1F55FF",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  },

  logo: { color: "white", fontSize: 22, fontWeight: 700, marginBottom: 25 },

  input: {
    width: "75%",
    background: "#E5E5E5",
    padding: 10,
    margin: "6px 0",
    borderRadius: 8,
    border: "none",
    outline: "none",
  },

  btn: {
    backgroundColor: "#E5E5E5",
    border: "none",
    padding: "10px 25px",
    borderRadius: 10,
    marginTop: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
};
