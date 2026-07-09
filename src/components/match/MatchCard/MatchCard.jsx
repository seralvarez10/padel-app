import PropTypes from "prop-types";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";

import Button from "@/components/common/Button";
import MatchStatus from "@/components/match/MatchStatus";

import { MATCH_STATUS } from "@/constants/matchStatus";

import styles from "./MatchCard.module.css";

export default function MatchCard({
  title,
  location,
  date,
  time,
  level,
  currentPlayers,
  maxPlayers,
  status = MATCH_STATUS.OPEN,
  onClick,
}) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <MatchStatus status={status} />
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.info}>

        <div className={styles.row}>
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        <div className={styles.row}>
          <Calendar size={18} />
          <span>{date} · {time}</span>
        </div>

        <div className={styles.row}>
          <Trophy size={18} />
          <span>Nivel {level}</span>
        </div>

        <div className={styles.row}>
          <Users size={18} />
          <span>
            {currentPlayers}/{maxPlayers} jugadores
          </span>
        </div>

      </div>

      <Button onClick={onClick}>
        Ver partido
      </Button>
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
  status: PropTypes.oneOf(Object.values(MATCH_STATUS)),
  onClick: PropTypes.func,
};