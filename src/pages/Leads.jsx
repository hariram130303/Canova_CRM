import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Leads.module.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import Pagination from "../components/Pagination";

export default function Leads() {
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [meta, setMeta] = useState({
    total: 0,
    totalPages: 1,
  });

  /* ---------- MANUAL FORM STATE ---------- */
  const [manualForm, setManualForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    date: "",
    location: "",
    language: "",
    type: "",
    scheduledDate: "",
  });

  /* ---------- LOAD LEADS ---------- */
  async function refreshLeads(p = 1) {
    const res = await api.get(`/admin/leads?page=${p}&limit=8`);

    setLeads(res.data.data);
    setPage(p);

    setMeta({
      total: res.data.total,
      totalPages: res.data.totalPages,
    });
  }

  useEffect(() => {
    const load = async () => {
      await refreshLeads();
    };

    load();
  }, []);

 const filtered = Array.isArray(leads)
  ? leads.filter((lead) =>
      (lead.name || "").toLowerCase().includes(search.toLowerCase())
    )
  : [];


  /* ---------- MANUAL HANDLERS ---------- */
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (manualForm.type === "Scheduled" && !manualForm.scheduledDate) {
      alert("Scheduled Date is required");
      return;
    }

    await api.post("/admin/leads/manual", {
      ...manualForm,
      status: "Ongoing", // enforced by rules
    });

    setShowManualModal(false);
    setManualForm({
      name: "",
      phone: "",
      email: "",
      source: "",
      date: "",
      location: "",
      language: "",
      type: "",
      scheduledDate: "",
    });

    const res = await api.get("/admin/leads");
    setLeads(res.data.data);
  };

  /* ---------- CSV UPLOAD ---------- */
  const handleCSVUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("file", csvFile);

    setUploading(true);
    setProgress(0);

    try {
      await api.post("/admin/leads/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      setTimeout(() => {
        setUploading(false);
        setShowCSVModal(false);
        setCsvFile(null);
        setProgress(0);
      }, 400);

      const res = await api.get("/admin/leads");
      console.log("AFTER CSV:", res.data);
      setLeads(res.data.data);
    } catch {
      setUploading(false);
      alert("CSV upload failed");
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.pageContent}>
        <Header showSearch searchValue={search} onSearch={setSearch} />

        <div className={styles.wrapper}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.breadcrumb}>Home &gt; Leads</div>

            <div className={styles.actions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setShowManualModal(true)}
              >
                Add Manually
              </button>

              <button
                className={styles.primaryBtn}
                onClick={() => setShowCSVModal(true)}
              >
                Add CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.card}>
            {/* HEADER */}
            <div className={styles.tableHeader}>
              <div>No.</div>
              <div>Name</div>
              <div>Email</div>
              <div>Source</div>
              <div>Date</div>
              <div>Location</div>
              <div>Assigned To</div>
              <div>Language</div>
              <div>Status</div>
              <div>Type</div>
              <div>Scheduled Date</div>
            </div>

            {/* ROWS */}
            {filtered.map((lead, index) => (
              <div key={lead._id} className={styles.row}>
                <div>{index + 1}</div>
                <div>{lead.name}</div>
                <div>{lead.email}</div>
                <div>{lead.source}</div>
                <div>{lead.date || "-"}</div>
                <div>{lead.location}</div>
                <div>{lead.assignedTo?._id.slice(-13) || "-"}</div>
                <div>{lead.language}</div>
                <div>{lead.status}</div>
                <div>{lead.type}</div>
                <div>{lead.scheduledDate || "-"}</div>
              </div>
            ))}
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={(p) => refreshLeads(p)}
            />
          </div>
        </div>

        {/* ================= CSV MODAL ================= */}
        {showCSVModal && (
          <div className={styles.modalOverlay}>
            <div
              className={`${styles.modal} ${
                uploading
                  ? styles.modalVerifying
                  : csvFile
                  ? styles.modalWithFile
                  : styles.modalNormal
              }`}
            >
              <div className={styles.modalHeader}>
                <h3>CSV Upload</h3>
                <button onClick={() => setShowCSVModal(false)}>✕</button>
              </div>

              {/* ---------- STEP 1: SELECT FILE ---------- */}
              {!uploading ? (
                <>
                  <p className={styles.modalSub}>Add your documents here</p>

                  <div className={styles.uploadBox}>
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2_5906)">
                        <path
                          d="M33.4418 3.12109H14.1744V11.1111H37.5569V7.23451C37.5569 4.96616 35.7108 3.12109 33.4418 3.12109Z"
                          fill="#00181B"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M22.5352 12.3403H0V4.92636C0 2.20972 2.21068 0 4.92828 0H12.1336C12.8497 0 13.5396 0.150925 14.1664 0.434509C15.0418 0.828964 15.7939 1.47913 16.3213 2.3286L22.5352 12.3403Z"
                          fill="#00181B"
                        />
                        <path
                          d="M42 14.0004V37.8817C42 40.153 40.1511 42.0003 37.8789 42.0003H4.12111C1.84891 42.0003 0 40.153 0 37.8817V9.88086H37.8789C40.1511 9.88086 42 11.7288 42 14.0004Z"
                          fill="#00181B"
                        />
                        <path
                          d="M42 14.0004V37.8817C42 40.153 40.1511 42.0003 37.8789 42.0003H21V9.88086H37.8789C40.1511 9.88086 42 11.7288 42 14.0004Z"
                          fill="#00181B"
                        />
                        <path
                          d="M32.0479 25.9395C32.0479 32.032 27.0918 36.9884 21 36.9884C14.9082 36.9884 9.95206 32.032 9.95206 25.9395C9.95206 19.8481 14.9082 14.8916 21 14.8916C27.0918 14.8916 32.0479 19.8481 32.0479 25.9395Z"
                          fill="white"
                        />
                        <path
                          d="M32.0479 25.9395C32.0479 32.032 27.0918 36.9884 21 36.9884V14.8916C27.0918 14.8916 32.0479 19.8481 32.0479 25.9395Z"
                          fill="#00181B"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M24.561 26.0758C24.3306 26.2709 24.0483 26.3661 23.7686 26.3661C23.4183 26.3661 23.0703 26.2177 22.8268 25.9287L22.2305 25.2218V29.8499C22.2305 30.5292 21.6793 31.0803 21 31.0803C20.3207 31.0803 19.7695 30.5292 19.7695 29.8499V25.2218L19.1732 25.9287C18.7342 26.4481 17.9584 26.5145 17.439 26.0758C16.9199 25.6378 16.8533 24.8617 17.2913 24.3422L19.7269 21.4548C20.0445 21.0793 20.5078 20.8633 21 20.8633C21.4922 20.8633 21.9555 21.0793 22.2731 21.4548L24.7087 24.3422C25.1467 24.8617 25.0801 25.6378 24.561 26.0758Z"
                          fill="#00181B"
                        />
                        <path
                          d="M24.561 26.0758C24.3306 26.2709 24.0483 26.3661 23.7686 26.3661C23.4183 26.3661 23.0703 26.2177 22.8268 25.9287L22.2305 25.2218V29.8499C22.2305 30.5292 21.6793 31.0803 21 31.0803V20.8633C21.4922 20.8633 21.9555 21.0793 22.2731 21.4548L24.7087 24.3422C25.1467 24.8617 25.0801 25.6378 24.561 26.0758Z"
                          fill="#00181B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2_5906">
                          <rect width="42" height="42" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <p>Drag your file(s) to start uploading</p>
                    <span className={styles.orDivider}>OR</span>
                    <label className={styles.browseBtn}>
                      Browse files
                      <input
                        type="file"
                        accept=".csv"
                        hidden
                        onChange={(e) => setCsvFile(e.target.files[0])}
                      />
                    </label>

                    {csvFile && (
                      <div className={styles.uploadedFile}>
                        <span className={styles.fileName}>{csvFile.name}</span>
                        <a
                          href={URL.createObjectURL(csvFile)}
                          download={csvFile.name}
                          className={styles.downloadIcon}
                          title="Download file"
                        >
                          <MdOutlineFileDownload size={22} color="#878787" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className={styles.modalFooter}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => setShowCSVModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className={styles.primaryBtn}
                      disabled={!csvFile}
                      onClick={handleCSVUpload}
                    >
                      <span className={styles.nextBtnContent}>
                        Next
                        <MdNavigateNext size={20} />
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.modalSub}>Add your documents here</p>
                  <div
                    className={`${styles.uploadBox} ${styles.uploadBoxVerifying}`}
                  >
                    <div className={styles.verifyingContent}>
                      <div className={styles.loaderWrapper}>
                        <div className={styles.loader}></div>
                        <span className={styles.loaderText}>{progress}%</span>
                      </div>

                      <p className={styles.verifyingText}>Verifying…</p>

                      <button
                        className={styles.inlineCancel}
                        onClick={() => {
                          setUploading(false);
                          setCsvFile(null);
                          setProgress(0);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => setShowCSVModal(false)}
                    >
                      Cancel
                    </button>

                    <button className={styles.primaryBtn}>Upload</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= MANUAL MODAL ================= */}
        {showManualModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${styles.manualModal}`}>
              <div className={styles.modalHeader}>
                <h3>Add New Lead</h3>
                <button onClick={() => setShowManualModal(false)}>✕</button>
              </div>

              <form className={styles.form} onSubmit={handleManualSubmit}>
                <div className={styles.field}>
                  <label>Name</label>
                  <input
                    name="name"
                    value={manualForm.name}
                    onChange={handleManualChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={manualForm.phone}
                    onChange={handleManualChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    name="email"
                    value={manualForm.email}
                    onChange={handleManualChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Source</label>
                  <input
                    name="source"
                    value={manualForm.source}
                    onChange={handleManualChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={manualForm.date}
                    onChange={handleManualChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Location</label>
                  <input
                    name="location"
                    value={manualForm.location}
                    onChange={handleManualChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Preferred Language</label>
                  <select
                    name="language"
                    value={manualForm.language}
                    onChange={handleManualChange}
                    required
                  >
                    <option value="">Select</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Kannada</option>
                    <option>Bengali</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Type</label>
                  <select
                    name="type"
                    value={manualForm.type}
                    onChange={handleManualChange}
                  >
                    <option>Hot</option>
                    <option>Warm</option>
                    <option>Cold</option>
                  </select>
                </div>

                {manualForm.type === "Scheduled" && (
                  <div className={styles.field}>
                    <label>Scheduled Date</label>
                    <input
                      type="text"
                      name="scheduledDate"
                      value={manualForm.scheduledDate}
                      onChange={handleManualChange}
                      required
                    />
                  </div>
                )}

                <button className={styles.primaryBtn} type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
