import PropTypes from "prop-types";

import Button from "../../ui/Button";
import PageHeader from "../../ui/PageHeader";

import styles from "./MatchForm.module.css";

export default function MatchForm({
  title,
  subtitle,
  buttonText,
  loading,
  error,
  handleSubmit,
  children,
}) {
  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
      />

      <div className={styles.card}>
        {children}
      </div>

      <div className={styles.submitWrapper}>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Guardando..." : buttonText}
        </Button>
      </div>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}

MatchForm.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};