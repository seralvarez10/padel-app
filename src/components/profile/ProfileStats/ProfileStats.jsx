import PropTypes from "prop-types";

import {
  CalendarDays,
  Trophy,
  CheckCircle,
} from "lucide-react";

import styles from "./ProfileStats.module.css";

export default function ProfileStats({ stats }) {
  return (
    <section className={styles.card}>
      <h2>Estadísticas</h2>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <CalendarDays size={22} />

          <span className={styles.value}>
            {stats.matchesPlayed}
          </span>

          <span className={styles.label}>
            Partidos jugados
          </span>
        </div>

        <div className={styles.stat}>
          <Trophy size={22} />

          <span className={styles.value}>
            {stats.organized}
          </span>

          <span className={styles.label}>
            Organizados
          </span>
        </div>

        <div className={styles.stat}>
          <CheckCircle size={22} />

          <span className={styles.value}>
            {stats.attendance === null
              ? "--"
              : `${stats.attendance}%`}
          </span>

          <span className={styles.label}>
            Asistencia
          </span>
        </div>
      </div>
    </section>
  );
}

ProfileStats.propTypes = {
  stats: PropTypes.shape({
    matchesPlayed: PropTypes.number,
    organized: PropTypes.number,
    attendance: PropTypes.number,
  }).isRequired,
};