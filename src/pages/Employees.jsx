import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BsThreeDotsVertical } from "react-icons/bs";
import styles from "../styles/Employees.module.css";
import { FiInfo } from "react-icons/fi";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    language: "",
  });

  const isValid =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.location &&
    form.language;

  const PER_PAGE = 8;

  useEffect(() => {
    api.get("/admin/employees").then((res) => {
      setEmployees(res.data.data); // <-- extract the array
    });
  }, []);

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const initials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`;

  const handleSave = async () => {
    try {
      const res = await api.post("/admin/employees", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        location: form.location,
        language: form.language,
        password: form.email, // rule: default password = email
      });

      const newEmp = res.data;

      // add new employee to TOP of list
      setEmployees((prev) => [newEmp, ...prev]);

      // reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        location: "",
        language: "",
      });

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create employee");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected employees?")) return;

    try {
      await api.delete("/admin/employees/bulk", {
        data: { ids: selected },
      });

      // remove from UI
      setEmployees((prev) => prev.filter((emp) => !selected.includes(emp._id)));

      // clear selection
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete employees");
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <Header showSearch searchValue={search} onSearch={setSearch} />
        {/* TOP BAR */}
        <div className={styles.wrapper}>
          <div className={styles.topBar}>
            <div className={styles.breadcrumb}>
              Home <span>&gt;</span> Employees
            </div>

            <button
              className={styles.addBtn}
              onClick={() => setShowModal(true)}
            >
              Add Employees
            </button>
            {selected.length > 0 && (
              <button className={styles.deleteBtn} onClick={handleBulkDelete}>
                Delete Selected ({selected.length})
              </button>
            )}
          </div>

          <div className={styles.card}>
            {/* HEADER ROW */}
            <div className={styles.tableHeader}>
              <input
                className={styles.headerCheckbox}
                type="checkbox"
                checked={
                  selected.length === visible.length && visible.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected(visible.map((emp) => emp._id));
                  } else {
                    setSelected([]);
                  }
                }}
              />

              <div className={styles.headerItem}>Name</div>
              <div className={styles.headerItem}>Employee ID</div>
              <div className={styles.headerItem}>Assigned Leads</div>
              <div className={styles.headerItem}>Closed Leads</div>
              <div className={styles.headerItem}>Status</div>
              <div></div>
            </div>

            {/* ROWS */}
            {visible.map((emp) => (
              <div className={styles.row} key={emp._id}>
                <input
                  type="checkbox"
                  checked={selected.includes(emp._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected((prev) => [...prev, emp._id]);
                    } else {
                      setSelected((prev) =>
                        prev.filter((id) => id !== emp._id)
                      );
                    }
                  }}
                />

                <div className={styles.nameCell}>
                  <div className={styles.avatar}>
                    {initials(emp.firstName, emp.lastName)}
                  </div>

                  <div className={styles.ename}>
                    <div className={styles.name}>
                      {emp.firstName} {emp.lastName}
                    </div>

                    <div className={styles.email}>{emp.email}</div>
                  </div>
                </div>

                <div className={styles.badge}>#{emp._id.slice(-13)}</div>

                <div className={styles.leads}>{emp.assigned || 0}</div>
                <div className={styles.leads}>{emp.closed || 0}</div>

                <div>
                  <span
                    className={
                      emp.status === "active" ? styles.active : styles.inactive
                    }
                  >
                    {emp.status}
                  </span>
                </div>

                <div className={styles.menuWrapper}>
                  <BsThreeDotsVertical
                    className={styles.menuIcon}
                    onClick={() =>
                      setOpenMenu(openMenu === emp._id ? null : emp._id)
                    }
                  />

                  {openMenu === emp._id && (
                    <div className={styles.menuCard}>
                      <div
                        className={styles.menuRow}
                        onClick={() => {
                          setOpenMenu(null);
                          navigate(`/settings/${emp._id}`);
                        }}
                      >
                        <span className={`${styles.iconBox} ${styles.pink}`}>
                          <FiEdit3 size={18} />
                        </span>
                        <span>Edit</span>
                      </div>

                      <div className={`${styles.menuRow} ${styles.deleteRow}`}>
                        <span className={`${styles.iconBox} ${styles.red}`}>
                          <FiTrash2 size={18} />
                        </span>
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={page === i + 1 ? styles.pageActive : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>

          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                {/* HEADER */}
                <div className={styles.modalHeader}>
                  <h3>Add New Employee</h3>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>

                {/* FORM */}
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label>First name</label>
                    <input
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Last name</label>
                    <input
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Location</label>
                    <select
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    >
                      <option value="">Select State / UT</option>

                      {/* States */}
                      <option>Andhra Pradesh</option>
                      <option>Arunachal Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Chhattisgarh</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Haryana</option>
                      <option>Himachal Pradesh</option>
                      <option>Jharkhand</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Manipur</option>
                      <option>Meghalaya</option>
                      <option>Mizoram</option>
                      <option>Nagaland</option>
                      <option>Odisha</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Sikkim</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Tripura</option>
                      <option>Uttar Pradesh</option>
                      <option>Uttarakhand</option>
                      <option>West Bengal</option>

                      {/* Union Territories */}
                      <option>Andaman and Nicobar Islands</option>
                      <option>Chandigarh</option>
                      <option>Dadra and Nagar Haveli and Daman and Diu</option>
                      <option>Delhi</option>
                      <option>Jammu and Kashmir</option>
                      <option>Ladakh</option>
                      <option>Lakshadweep</option>
                      <option>Puducherry</option>
                    </select>
                  </div>
                  {/* {Language} */}
                  <div className={styles.field}>
                    <label>Preferred Language</label>
                    <div className={styles.inputWithIcon}>
                      <select
                        value={form.language}
                        onChange={(e) =>
                          setForm({ ...form, language: e.target.value })
                        }
                      >
                        <option value="">Select Language</option>
                        {/* Major Languages */}
                        <option>Hindi</option>
                        <option>English</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                        <option>Kannada</option>
                        <option>Malayalam</option>
                        <option>Marathi</option>
                        <option>Bengali</option>
                        <option>Gujarati</option>
                        <option>Punjabi</option>
                        <option>Odia</option>
                        <option>Assamese</option>
                        <option>Urdu</option>

                        {/* Other Languages */}
                        <option>Konkani</option>
                        <option>Manipuri</option>
                        <option>Maithili</option>
                        <option>Santali</option>
                        <option>Kashmiri</option>
                        <option>Dogri</option>
                        <option>Nepali</option>
                        <option>Bodo</option>
                        <option>Sindhi</option>
                        <option>Santhali</option>
                      </select>
                      <FiInfo size={20} className={styles.infoIcon} />
                      <span className={styles.langTooltip}>
                        Lead will be assigned based on language
                      </span>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className={styles.modalFooter}>
                  <button
                    className={styles.saveBtn}
                    disabled={!isValid}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
