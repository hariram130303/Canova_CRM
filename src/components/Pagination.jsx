import styles from "../styles/Pagination.module.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  const pages = [];

  const add = (p) =>
    pages.push(
      <button
        key={p}
        className={p === currentPage ? styles.active : ""}
        onClick={() => onPageChange(p)}
      >
        {p}
      </button>
    );

  if (totalPages <= 6) {
    for (let p = 1; p <= totalPages; p++) add(p);
  } else {
    add(1);
    if (currentPage > 3) pages.push(<span key="l">…</span>);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let p = start; p <= end; p++) add(p);

    if (currentPage < totalPages - 2) pages.push(<span key="r">…</span>);

    add(totalPages);
  }

  return (
    <div className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </button>

      {pages}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
}
