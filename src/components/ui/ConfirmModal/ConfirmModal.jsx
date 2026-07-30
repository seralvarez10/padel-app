import PropTypes from "prop-types";

import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>

        <p>{message}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={styles.confirm}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};