import "../styles/modal.css";

export default function Modal({ onClose }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Add New Employee</h3>

        <input placeholder="First name" />
        <input placeholder="Last name" />
        <input placeholder="Email" />
        <select>
          <option>Location</option>
        </select>
        <select>
          <option>Preferred Language</option>
        </select>

        <button disabled>Save</button>
        <span onClick={onClose} className="close">×</span>
      </div>
    </div>
  );
}
