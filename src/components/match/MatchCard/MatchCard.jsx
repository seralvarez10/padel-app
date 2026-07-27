import PropTypes from "prop-types";
import {
  MapPin,
  CalendarDays,
  Users,
  Star,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import MatchStatus from "../MatchStatus";
import Card from "../../ui/Card";
import { formatMatchDate } from "../../../utils/dateUtils";

import styles from "./MatchCard.module.css";

export default function MatchCard({
  id,
  title,
  location,
  match_date,
  match_time,
  level_min,
  occupied_slots,
  max_players,
  status,
  match_type,
  city,
  court_type,
  duration,
  isOrganizer = false,
  isJoined = false,
  isFull = false,

  
}) {

  const navigate = useNavigate();
  let buttonText = "Ver partido";

  if (isOrganizer) {
    buttonText = "👑 Organizando";
  } else if (isJoined) {
    buttonText = "✓ Apuntado";
  } else if (isFull) {
    buttonText = "Partido completo";
  }
  return (
    <Card
      className={styles.card}
      onClick={() => navigate(`/matches/${id}`)}
    >
      <div className={styles.header}>
        <MatchStatus status={status} />

        <span className={styles.typeBadge}>
          🎾 {match_type}
        </span>
      </div>

      <h3 className={styles.title}>
        {title}
      </h3>

      <div className={styles.location}>
        <MapPin size={16} />

        <span>
          {location} · {city}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <CalendarDays size={16} />

          <span>
            {formatMatchDate(match_date)} · {match_time}
          </span>
        </div>

        <div className={styles.detail}>
          <span className={styles.courtBadge}>
            {court_type}
          </span>
        </div>

        <div className={styles.detail}>
          <Clock3 size={16} />

          <span>
            {duration}
          </span>
        </div>

        <div className={styles.detail}>
          <Star size={16} />

          <span>
            Nivel {level_min}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.players}>
          {Array.from({ length: occupied_slots }).map((_, index) => (
            <div
              key={index}
              className={styles.avatar}
            >
              👤
            </div>
          ))}

          {Array.from({ length: max_players - occupied_slots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className={styles.emptyAvatar}
            >
              +
            </div>
          ))}
        </div>

        <div className={styles.playersCount}>
          <Users size={16} />

          <span>
            {occupied_slots}/{max_players}
          </span>
        </div>
      </div>

      <button
        className={styles.joinButton}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/matches/${id}`);
        }}
      >
        <span>{buttonText}</span>

        {!isOrganizer && !isJoined && !isFull && (
          <ArrowRight size={18} />
        )}
      </button>
    </Card>
  );
}

MatchCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  city: PropTypes.string,
  match_date: PropTypes.string.isRequired,
  match_time: PropTypes.string.isRequired,
  level_min: PropTypes.number.isRequired,
  occupied_slots: PropTypes.number.isRequired,
  max_players: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  match_type: PropTypes.string,
  court_type: PropTypes.string,
  duration: PropTypes.number,
  isOrganizer: PropTypes.bool,
  isJoined: PropTypes.bool,
  isFull: PropTypes.bool,
};