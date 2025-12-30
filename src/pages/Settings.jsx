import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Settings.module.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Settings() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  const isValid =
    form.firstName.trim() && form.lastName.trim() && form.email.trim();

  const passwordsMatch =
    !form.password || form.password === form.confirmPassword;
  useEffect(() => {
    if (!id) return;

    api.get("/admin/employees").then((res) => {
      const list = res.data.data; // because you store in .data
      const emp = list.find((e) => e._id === id);

      if (emp) {
        setForm({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          password: "",
          confirmPassword: "",
        });
      }
    });
  }, [id]);

  const handleSave = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await api.put(`/admin/employees/${id}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password || undefined,
    });

    alert("Employee updated");
    navigate("/employees");
  };

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.pageContent}>
        {/* Header without search */}
        <Header showSearch={false} />

        <div className={styles.wrapper}>
          <div className={styles.breadcrumb}>Home &gt; Settings</div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>Edit Profile</div>

            <div className={styles.cardBody}>
              <div className={styles.field}>
                <label className={styles.label}>First name</label>
                <input
                  className={styles.input}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Last name</label>
                <input
                  className={styles.input}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />{" "}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />{" "}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  className={styles.input}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />{" "}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button
                className={styles.saveButton}
                disabled={!isValid || !passwordsMatch}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
