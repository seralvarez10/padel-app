import PropTypes from "prop-types";
import { MapPin, CalendarDays, Users, Star } from "lucide-react";

import MatchStatus from "../MatchStatus";

import styles from "./MatchCard.module.css";

export default function MatchCard({
  title,
  location,
  date,
  time,
  level,
  currentPlayers,
  maxPlayers,
  status,
}) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <MatchStatus status={status} />
      </div>

      <h3>{title}</h3>

      <div className={styles.info}>
        <MapPin size={16} />
        <span>{location}</span>
      </div>

      <div className={styles.info}>
        <CalendarDays size={16} />
        <span>
          {date} · {time}
        </span>
      </div>

      <div className={styles.bottom}>
        <div className={styles.level}>
          <Star size={16} />
          Nivel {level}
        </div>

        <div className={styles.players}>
          <Users size={16} />
          {currentPlayers}/{maxPlayers}
        </div>
      </div>
    </article>
  );
}

MatchCard.propTypes = {
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  currentPlayers: PropTypes.number.isRequired,
  maxPlayers: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};