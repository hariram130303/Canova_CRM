import { useState, useEffect } from "react";
import styles from "./styles/Home.module.css";
import AppNav from "./AppNav";
import { api } from "../services/api";

export default function Home() {
  const [checkIn, setCheckIn] = useState("--:--");
  const [checkOut, setCheckOut] = useState("--:--");
  const [checkedIn, setCheckedIn] = useState(false);

  const [onBreak, setOnBreak] = useState(false);
  const [employee, setEmployee] = useState(null);

  const [breakLogs, setBreakLogs] = useState([
    { start: "01:10 PM", end: "02:00 PM", date: "07/04/25" },
    { start: "01:05 PM", end: "02:30 PM", date: "08/04/25" },
    { start: "01:00 PM", end: "02:05 PM", date: "09/04/25" },
    { start: "01:25 PM", end: "02:15 PM", date: "10/04/25" },
  ]);

  const [activity] = useState([
    "You were assigned 3 more leads — 1 hour ago",
    "You closed a deal — 2 hours ago",
  ]);

  useEffect(() => {
    api.get("/employee/profile").then(res => {
      setEmployee(res.data);
    });
  }, []);

  const handleCheck = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!checkedIn) {
      setCheckIn(now);
    } else {
      setCheckOut(now);
    }

    setCheckedIn(!checkedIn);
  };

  const toggleBreak = () => {
    if (!onBreak) {
      setOnBreak(true);
      const now = new Date();

      setBreakLogs(prev => [
        {
          start: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          end: "__:__",
          date: "Today",
        },
        ...prev.slice(0, 3),
      ]);
    } else {
      setOnBreak(false);

      setBreakLogs(prev => {
        const updated = [...prev];
        updated[0].end = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return updated;
      });
    }
  };

  return (
    <div className={styles.homeRoot}>
      <div className={styles.homePhone}>
        <div className={styles.header}>
          <div className={styles.logo}>
            Canova<span className={styles.crm}>CRM</span>
          </div>

          <div className={styles.greeting}>
            <p>Good Morning <br /></p>
                {employee ? `${employee.firstName} ${employee.lastName}` : "..."}
          </div>
        </div>

        <div className={styles.section}>Timings</div>

        <div className={styles.card}>
          <div className={styles.box}>
            <div className={styles.row}>
              <div>
                Checked-in
                <br />
                {checkIn}
              </div>

              <div>
                Check Out
                <br />
                {checkOut}
              </div>

              <div
                className={`${styles.indicator} ${
                  checkedIn ? styles.green : styles.red
                }`}
                onClick={handleCheck}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div
            className={`${styles.box} ${styles.clickable}`}
            onClick={toggleBreak}
          >
            <div className={styles.row}>
              <div>
                Break
                <br />
                {breakLogs[0].start}
              </div>

              <div>
                Ended
                <br />
                {breakLogs[0].end}
              </div>

              <div
                className={`${styles.indicator} ${
                  onBreak ? styles.green : styles.red
                }`}
              />
            </div>
          </div>

          {breakLogs.map((b, i) => (
            <div key={i} className={styles.logRow}>
              <div>
                Break
                <br />
                {b.start}
              </div>
              <div>
                Ended
                <br />
                {b.end}
              </div>
              <div>
                Date
                <br />
                {b.date}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section}>Recent Activity</div>

        <div className={styles.activityBox}>
          <div className={styles.scroll}>
            {activity.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                • {a}
              </div>
            ))}
          </div>
        </div>

        <AppNav />
      </div>
    </div>
  );
}
