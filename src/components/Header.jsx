import { IoSearchSharp } from "react-icons/io5";
import styles from "../styles/Header.module.css";

export default function Header({
  showSearch = false,
  searchValue = "",
  onSearch,
}) {
  if (!showSearch) return null;

  return (
    <header className={styles.header}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.searchBox}>
          <IoSearchSharp className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search here..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* RIGHT (EMPTY FOR NOW – FUTURE USE) */}
      <div className={styles.right}></div>
    </header>
  );
}
