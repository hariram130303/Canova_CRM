import styles from "../styles/StatsCard.module.css";

export default function StatsCard({ icon, label, value }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconRow}>
        <div className={styles.iconCircle}>{icon}</div>

        <span className={styles.label}>{label}</span>
      </div>

      <b className={styles.count}>{value}</b>
    </div>
  );
}
