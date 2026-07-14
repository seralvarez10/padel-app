import PropTypes from "prop-types";
import {
  MapPin,
  CalendarDays,
  Users,
  Star,
  Clock3,
  ArrowRight,
} from "lucide-react";

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
  type,
  distance,
  court,
  duration,
}) {
  return (
    <article className={styles.card} role="button">
      <div className={styles.header}>
        <MatchStatus status={status} />

        <span className={styles.typeBadge}>
          🎾 {type}
        </span>
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.location}>
        <MapPin size={16} />
        <span>
          {location} · {distance}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <CalendarDays size={16} />
          <span>
            {date} · {time}
          </span>
        </div>

        <div className={styles.detail}>
          <span className={styles.courtBadge}>
            {court}
          </span>
        </div>

        <div className={styles.detail}>
          <Clock3 size={16} />
          <span>{duration}</span>
        </div>

        <div className={styles.detail}>
          <Star size={16} />
          <span>Nivel {level}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.players}>
          <div className={styles.avatar}>SA</div>
          <div className={styles.avatar}>AM</div>
          <div className={styles.avatar}>JR</div>

          {currentPlayers < maxPlayers && (
            <div className={styles.emptyAvatar}>+</div>
          )}
        </div>

        <div className={styles.playersCount}>
          <Users size={16} />
          <span>
            {currentPlayers}/{maxPlayers}
          </span>
        </div>
      </div>

      <button className={styles.joinButton}>
        <span>Unirme</span>
        <ArrowRight size={18} />
      </button>
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
  type: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  court: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
};