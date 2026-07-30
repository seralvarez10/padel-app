import PropTypes from "prop-types";
import {
  MapPin,
  CalendarDays,
  Clock3,
  Star,
  Building2,
} from "lucide-react";

import MatchStatus from "../MatchStatus";
import { formatMatchDate } from "../../../utils/formatDate";

import styles from "./MatchInfo.module.css";

export default function MatchInfo({ match, totalPlayers }) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <MatchStatus status={match.status} />
      </div>

      <h1 className={styles.title}>{match.title}</h1>

      <div className={styles.info}>
        <MapPin size={18} />
        <span>
          {match.city
            ? `${match.location} · ${match.city}`
            : match.location}
        </span>
      </div>

      <div className={styles.info}>
        <CalendarDays size={18} />
        <span>
          {formatMatchDate(match.match_date)} · {match.match_time?.slice(0, 5)}
        </span>
      </div>

      <div className={styles.grid}>
        {match.court_type && (
          <div className={styles.card}>
            <Building2 size={18} />
            <span>{match.court_type}</span>
          </div>
        )}

        {match.match_type && (
          <div className={styles.card}>
            <span>🎾 {match.match_type}</span>
          </div>
        )}

        <div className={styles.card}>
          <Clock3 size={18} />
          <span>{match.duration ?? 90} min</span>
        </div>

        <div className={styles.card}>
          <Star size={18} />
          <span>
            {match.level_min} - {match.level_max}
          </span>
        </div>
      </div>

      {match.description?.trim() && (
        <div className={styles.description}>
          <h3>📝 Descripción</h3>
          <p>{match.description}</p>
        </div>
      )}

    </section>
  );
}

MatchInfo.propTypes = {
  match: PropTypes.object.isRequired,
  totalPlayers: PropTypes.number.isRequired,
};
