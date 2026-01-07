import { useEffect, useState } from "react";
import AppNav from "./AppNav";
import styles from "./styles/Profile.module.css";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/employee/profile").then(res => {
      setForm(f => ({
        ...f,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email
      }));
    });
  }, []);

  const handleSave = async () => {
  if (form.password && form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  await api.put("/employee/profile", {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password || undefined
  });

  alert("Profile updated successfully\nPlease login again.");

  localStorage.removeItem("employeeToken");
  window.location.href = "/app/login";
};

  

  return (
    <div className={styles.appRoot}>
      <div className={styles.phone}>
        <div className={styles.header}>
          <div className={styles.logo}>
            Canova<span className={styles.crm}>CRM</span>
          </div>

          <div className={styles.backRow}>
            <span
  className={styles.backArrow}
  onClick={() => navigate(-1)}
>
  ‹
</span>

            <span className={styles.profileTitle}>Profile</span>
          </div>
        </div>

        <div className={styles.section}>
          <form className={styles.form}>
            <label>First name</label>
            <input
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />

            <label>Last name</label>
            <input
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />

            <label>Email</label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </form>

          <div className={styles.buttonsRow}>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save
            </button>

            <button className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        <AppNav />
      </div>
    </div>
  );
};

export default Profile;
