import { useState, useEffect } from "react";
import { api } from "../services/api";
import AppNav from "./AppNav";
import LeadCardMobile from "./LeadCardMobile";
import styles from "./styles/LeadsMobile.module.css";

export default function LeadsMobile() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await api.get("/admin/leads");
        setLeads(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadLeads();
  }, []);

  return (
    <div className={styles.appRoot}>
      <div className={styles.phone}>
        <div className={styles.header}>
          <div className={styles.logo}>
            Canova<span className={styles.crm}>CRM</span>
          </div>

          <div className={styles.backRow}>
            <span className={styles.backArrow}>‹</span>
            <span className={styles.leadsTitle}>Leads</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.searchBox}>
            <input placeholder="Search" />
          </div>

          <div className={styles.list}>
            {leads.map((lead) => (
              <LeadCardMobile
                lead={lead}
                onUpdate={(updated) => {
                  setLeads((prev) =>
                    prev.map((l) => (l._id === updated._id ? updated : l))
                  );
                }}
              />
            ))}
          </div>
        </div>

        <AppNav />
      </div>
    </div>
  );
}
