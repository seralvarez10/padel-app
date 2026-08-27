import PropTypes from "prop-types";
import {
  CalendarDays,
  Trophy,
  CircleX,
  History,
} from "lucide-react";

import styles from "./ProfileStats.module.css";

export default function ProfileStats({
  stats,
  onViewHistory,
}) {
  return (
    <section className={styles.card}>

      <div className={styles.grid}>

        {/* PARTIDOS JUGADOS */}
        <div className={styles.stat}>
          <CalendarDays size={22} />

          <span className={styles.value}>
            {stats.matchesPlayed ?? 0}
          </span>

          <span className={styles.label}>
            Jugados
          </span>
        </div>


        {/* PARTIDOS GANADOS */}
        <div className={styles.stat}>
          <Trophy size={22} />

          <span className={styles.value}>
            {stats.matchesWon ?? 0}
          </span>

          <span className={styles.label}>
            Ganados
          </span>
        </div>


        {/* PARTIDOS PERDIDOS */}
        <div className={styles.stat}>
          <CircleX size={22} />

          <span className={styles.value}>
            {stats.matchesLost ?? 0}
          </span>

          <span className={styles.label}>
            Perdidos
          </span>
        </div>

      </div>


      {/* HISTORIAL */}
      <button
        type="button"
        className={styles.historyButton}
        onClick={onViewHistory}
      >
        <History size={16} />

        <span>
          Ver historial Completo 
        </span>
      </button>
    </section>
  );
}

ProfileStats.propTypes = {
  stats: PropTypes.shape({
    matchesPlayed: PropTypes.number,
    matchesWon: PropTypes.number,
    matchesLost: PropTypes.number,
  }).isRequired,

  onViewHistory: PropTypes.func,
};