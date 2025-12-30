import { useState } from "react";
import { api } from "../services/api";

import { FaCalendarAlt } from "react-icons/fa";
import { FiEdit2, FiClock, FiChevronDown } from "react-icons/fi";

import styles from "./styles/LeadCardMobile.module.css";

export default function LeadCardMobile({ lead ,onUpdate}) {
  const [openType, setOpenType] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [localLead, setLocalLead] = useState(lead);

  /* ---------- TYPE CHANGE ---------- */
  async function handleTypeChange(newType) {
  try {
    const res = await api.put(`/leads/${localLead._id}`, {
      type: newType
    });

    setLocalLead(res.data);

    if (onUpdate) onUpdate(res.data);

    setOpenType(false);
  } catch (err) {
    console.error(err);
  }
}


  /* ---------- STATUS CHANGE ---------- */
  async function handleStatusChange(value) {
  if (localLead.type === "Ongoing" && value === "Closed") {
    alert("Lead cannot be closed because it is scheduled.");
    return;
  }

  try {
    const res = await api.put(`/leads/${localLead._id}`, {
      status: value,
    });

    setLocalLead(res.data);

    if (onUpdate) onUpdate(res.data);

    setOpenStatus(false);
  } catch (err) {
    console.error(err);
  }
}

  // /* ---------- SCHEDULE DATE CHANGE ---------- */
 async function handleScheduleChange(date) {
  try {
    const res = await api.put(`/leads/${localLead._id}`, {
      scheduledDate: date,
    });

    setLocalLead(res.data);

    if (onUpdate) onUpdate(res.data);

    setOpenDate(false);
  } catch (err) {
    console.error(err);
  }
}


  return (
    <div className={styles.card}>
      <div
        className={`${styles.strip} ${styles[localLead.type?.toLowerCase()]}`}
      />

      <div className={styles.top}>
        <div>
          <h4 className={styles.name}>{localLead.name}</h4>
          <p className={styles.email}>@{localLead.email}</p>
        </div>

        <div
          className={`${styles.statusCircle} ${
            styles[localLead.status?.toLowerCase()]
          }`}
        >
          {localLead.status}
        </div>
      </div>

      <div className={styles.dateRow}>
        <FaCalendarAlt size={15} />
        <span>
          {localLead.date
            ? new Date(localLead.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </span>
      </div>

      <div className={styles.actions}>
        <svg
          onClick={() => setOpenType(!openType)}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99831 0C10.5542 0 11.0981 0.044 11.63 0.132L9.75835 2.004C8.19799 2.05083 6.68544 2.5533 5.40715 3.44948C4.12886 4.34566 3.1407 5.59637 2.56448 7.04743C1.98826 8.49849 1.84917 10.0865 2.16435 11.6156C2.47954 13.1448 3.23522 14.5483 4.33825 15.6531C5.44128 16.758 6.84344 17.5158 8.37189 17.8333C9.90033 18.1507 11.4883 18.0139 12.9399 17.4397C14.3916 16.8655 15.6435 15.879 16.5414 14.6018C17.4393 13.3246 17.9439 11.8125 17.9929 10.252L19.8666 8.38C19.9533 8.90666 19.9966 9.44666 19.9966 10C19.9966 11.9778 19.4102 13.9112 18.3116 15.5557C17.213 17.2002 15.6514 18.4819 13.8245 19.2388C11.9975 19.9957 9.98722 20.1937 8.04774 19.8078C6.10825 19.422 4.32673 18.4696 2.92844 17.0711C1.53015 15.6725 0.577906 13.8907 0.192119 11.9509C-0.193668 10.0111 0.00433213 8.00042 0.76108 6.17316C1.51783 4.3459 2.79934 2.78412 4.44355 1.6853C6.08776 0.58649 8.02083 0 9.99831 0ZM18.8788 1.124C18.5234 0.768479 18.1014 0.486461 17.637 0.294051C17.1727 0.101642 16.6749 0.00260949 16.1723 0.00260949C15.6696 0.00260949 15.1719 0.101642 14.7075 0.294051C14.2431 0.486461 13.8211 0.768479 13.4657 1.124L8.2986 6.292C8.18979 6.40111 8.10766 6.5339 8.05864 6.68L6.09097 12.52C6.02566 12.714 6.01577 12.9224 6.06243 13.1217C6.10908 13.321 6.21042 13.5034 6.35505 13.6483C6.49967 13.7931 6.68184 13.8947 6.88107 13.9417C7.08029 13.9886 7.28866 13.979 7.48273 13.914L13.3217 11.95C13.4685 11.9012 13.602 11.8191 13.7117 11.71L18.8788 6.54C19.2343 6.18453 19.5162 5.76251 19.7086 5.29804C19.901 4.83357 20 4.33575 20 3.833C20 3.33025 19.901 2.83243 19.7086 2.36796C19.5162 1.90349 19.2343 1.47947 18.8788 1.124Z"
            fill="#2051E5"
          />
        </svg>

        <svg
          onClick={() => setOpenDate(!openDate)}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 9.6V6C11 5.71666 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 9.99999 5C9.71733 4.99933 9.47999 5.09533 9.288 5.288C9.09599 5.48067 9 5.718 9 6V9.975C9 10.1083 9.02499 10.2377 9.075 10.363C9.125 10.4883 9.2 10.6007 9.3 10.7L12.6 14C12.7833 14.1833 13.0167 14.275 13.3 14.275C13.5833 14.275 13.8167 14.1833 14 14C14.1833 13.8167 14.275 13.5833 14.275 13.3C14.275 13.0167 14.1833 12.7833 14 12.6L11 9.6ZM9.99999 20C8.61666 20 7.31666 19.7373 6.1 19.212C4.88333 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 10C-0.0006654 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 9.99999 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 9.99999 20ZM9.99999 18C12.2167 18 14.1043 17.221 15.663 15.663C17.2217 14.105 18.0007 12.2173 18 10C17.9993 7.78266 17.2203 5.895 15.663 4.337C14.1057 2.779 12.218 2 9.99999 2C7.782 2 5.89433 2.77933 4.337 4.338C2.77967 5.89666 2.00067 7.784 2 10C1.99933 12.216 2.77867 14.1037 4.338 15.663C5.89733 17.2223 7.78466 18.0013 9.99999 18Z"
            fill="#2051E5"
          />
        </svg>

        <svg
          onClick={() => setOpenStatus(!openStatus)}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="9" stroke="#2051E5" strokeWidth="2" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.33344 13.7217L4 8.34415L5.33312 7L10 11.7055L14.6669 7L16 8.34415L10.6666 13.7217C10.4898 13.8999 10.25 14 10 14C9.75 14 9.51024 13.8999 9.33344 13.7217Z"
            fill="#2051E5"
          />
        </svg>
      </div>

      {/* TYPE POPUP */}
      {openType && (
        <div className={styles.popupType}>
          <div className={styles.popupTitle}>Type</div>

          {["Hot", "Warm", "Cold"].map((t) => (
            <button
              key={t}
              className={`${styles.tag} ${styles[t.toLowerCase()]}`}
              onClick={() => handleTypeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* DATE + TIME POPUP */}
      {openDate && (
        <div className={styles.popupDate}>
          <label>Date</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />

          <label>Time</label>
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />

          <button
            className={styles.saveBtn}
            onClick={() =>
              handleScheduleChange(scheduleDate)
            }
          >
            Save
          </button>
        </div>
      )}

      {/* STATUS DROPDOWN POPUP */}
      {openStatus && (
        <div className={styles.popupStatus}>
          <div className={styles.statusHeader}>
            <span>Lead Status</span>

            <div className={styles.tooltipWrap}>
              <span className={styles.infoIcon}>i</span>

              <span className={styles.tooltip}>
                Lead can not be closed if scheduled
              </span>
            </div>
          </div>

          <select
  value={localLead.status}
  onChange={(e) => handleStatusChange(e.target.value)}
  className={styles.select}
>

            <option>Ongoing</option>
            <option>Closed</option>
          </select>

          <button className={styles.saveBtn}
          
          >Save</button>
        </div>
      )}
    </div>
  );
}
