import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./PageHeader.module.css";

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
}) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>

      <div className={styles.left}>

        {showBack && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={22} />
          </button>
        )}

        <div>

          <h1>{title}</h1>

          {subtitle && (
            <p>{subtitle}</p>
          )}

        </div>

      </div>

    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showBack: PropTypes.bool,
};