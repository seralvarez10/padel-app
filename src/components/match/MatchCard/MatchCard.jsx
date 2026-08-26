import PropTypes from "prop-types";

import {
  MapPin,
  CalendarDays,
  Users,
  Star,
  Clock3,
  ChevronRight,
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
  playerStatus,
  match_type,
  city,
  court_type,
  duration,
  isOrganizer = false,
  isJoined = false,
  isFull = false,
  unreadCount = 0,
  isPast = false,
  match_result = null,
  currentUserId = null,
}) {
  const navigate = useNavigate();

  let buttonText = "Ver partido";
  let badgeStatus = status;

  /*
   * ==========================================
   * RESULTADO DEL PARTIDO
   * ==========================================
   */

  let resultText = null;
  let resultStatus = null;

  const hasFinalResult =
    match_result &&
    (
      match_result.status === "CONFIRMED" ||
      match_result.status === "AUTO_CONFIRMED"
    );

  if (hasFinalResult && currentUserId) {
    const score = match_result.score;

    const teamAPlayers = [
      score?.teamA?.player1,
      score?.teamA?.player2,
    ].filter(Boolean);

    const teamBPlayers = [
      score?.teamB?.player1,
      score?.teamB?.player2,
    ].filter(Boolean);

    const isInTeamA =
      teamAPlayers.includes(currentUserId);

    const isInTeamB =
      teamBPlayers.includes(currentUserId);

    if (
      score?.sets &&
      Array.isArray(score.sets) &&
      (isInTeamA || isInTeamB)
    ) {
      let teamAWins = 0;
      let teamBWins = 0;

      score.sets.forEach((set) => {
        const teamAScore = Number(set.a);
        const teamBScore = Number(set.b);

        if (teamAScore > teamBScore) {
          teamAWins++;
        } else if (teamBScore > teamAScore) {
          teamBWins++;
        }
      });

      const userIsWinner =
        (isInTeamA && teamAWins > teamBWins) ||
        (isInTeamB && teamBWins > teamAWins);

      const userScore = isInTeamA
        ? teamAWins
        : teamBWins;

      const opponentScore = isInTeamA
        ? teamBWins
        : teamAWins;

      if (userIsWinner) {
        resultText = `Ganado ${userScore}-${opponentScore}`;
        resultStatus = "result_won";
      } else {
        resultText = `Perdido ${userScore}-${opponentScore}`;
        resultStatus = "result_lost";
      }
    }
  }

  /*
   * ==========================================
   * ESTADO DEL PARTIDO
   * ==========================================
   */

  if (isPast) {
    if (status === "finished") {
      badgeStatus = "finished";
    } else if (status === "cancelled") {
      badgeStatus = "cancelled";
    } else if (
      match_result?.status === "PENDING"
    ) {
      badgeStatus = "result_pending";
    } else if (
      match_result?.status === "REJECTED"
    ) {
      badgeStatus = "result_rejected";
    } else {
      badgeStatus = "not_played";
    }
  } else if (playerStatus) {
    switch (playerStatus) {
      case "CONFIRMED":
        badgeStatus = "confirmed";
        break;

      case "JOINED":
        badgeStatus = "pending";
        break;

      case "AT_RISK":
        badgeStatus = "at_risk";
        break;

      default:
        badgeStatus = status;
    }
  }

  /*
   * ==========================================
   * BOTÓN
   * ==========================================
   */

  if (isPast) {
    buttonText = "Ver partido";
  } else if (isOrganizer) {
    buttonText = "Gestionar partido";
  } else if (isJoined) {
    buttonText = "Ver partido";
  } else if (isFull) {
    buttonText = "Partido completo";
  } else {
    buttonText = "Unirme";
  }

  /*
   * Clase visual del botón
   */

  const buttonClass = isPast
    ? styles.joinedButton
    : isOrganizer
      ? styles.manageButton
      : isJoined
        ? styles.joinedButton
        : isFull
          ? styles.fullButton
          : styles.joinAvailableButton;

  return (
    <Card
      className={styles.card}
      onClick={() =>
        navigate(`/matches/${id}`)
      }
    >

      {/* =========================
          CABECERA
      ========================= */}

      <div className={styles.header}>

        <MatchStatus
          status={badgeStatus}
        />

        <span className={styles.typeBadge}>
          {match_type || "Libre"}
        </span>

      </div>


      {/* =========================
          TÍTULO
      ========================= */}

      <h3 className={styles.title}>
        {title}
      </h3>


      {/* =========================
          UBICACIÓN
      ========================= */}

      <div className={styles.location}>

        <MapPin size={14} />

        <span>
          {location}
          {city ? `, ${city}` : ""}
        </span>

      </div>


      {/* =========================
          FECHA Y HORA
      ========================= */}

      <div className={styles.dateRow}>

        <CalendarDays size={14} />

        <span>
          {formatMatchDate(match_date)} · {match_time}
        </span>

      </div>


      {/* =========================
          INFORMACIÓN DEL PARTIDO
      ========================= */}

      <div className={styles.metaGrid}>

        <div className={styles.metaItem}>

          <span className={styles.metaIcon}>
            {court_type === "Indoor"
              ? "⌂"
              : "☀"}
          </span>

          <span>
            {court_type || "Pista"}
          </span>

        </div>


        <div className={styles.metaItem}>

          <Clock3 size={13} />

          <span>
            {duration
              ? `${duration} min`
              : "--"}
          </span>

        </div>


        <div className={styles.metaItem}>

          <Star size={13} />

          <span>
            Nivel {level_min}
          </span>

        </div>

      </div>


      {/* =========================
          RESULTADO
      ========================= */}

      {isPast && resultText && (
        <div
          className={`${styles.matchResult} ${resultStatus === "result_won"
            ? styles.resultWon
            : styles.resultLost
            }`}
        >

          <span>
            {resultStatus === "result_won"
              ? "🏆"
              : "❌"}
          </span>

          <span>
            {resultText}
          </span>

        </div>
      )}


      {isPast &&
        !resultText &&
        match_result?.status === "PENDING" && (
          <div
            className={`${styles.matchResult} ${styles.resultPending}`}
          >

            <span>⏳</span>

            <span>
              Resultado pendiente
            </span>

          </div>
        )}


      {isPast &&
        !resultText &&
        match_result?.status === "REJECTED" && (
          <div
            className={`${styles.matchResult} ${styles.resultRejected}`}
          >

            <span>⚠️</span>

            <span>
              Resultado rechazado
            </span>

          </div>
        )}


      {/* =========================
          JUGADORES
      ========================= */}

      <div className={styles.footer}>

        <div className={styles.players}>

          {Array.from({
            length: occupied_slots,
          }).map((_, index) => (
            <div
              key={index}
              className={styles.avatar}
            >
              {index === 0 ? "SA" : ""}
            </div>
          ))}


          {Array.from({
            length: Math.max(
              0,
              max_players - occupied_slots
            ),
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className={styles.emptyAvatar}
            >
              +
            </div>
          ))}

        </div>


        <div className={styles.footerInfo}>

          <div className={styles.playersCount}>

            <Users size={13} />

            <span>
              {occupied_slots}/{max_players} jugadores
            </span>

          </div>


          {unreadCount > 0 && (
            <div
              className={styles.unreadMessages}
            >

              <span>💬</span>

              <span>
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>

            </div>
          )}

        </div>

      </div>


      {/* =========================
          BOTÓN
      ========================= */}

      <button
        type="button"
        className={`${styles.joinButton} ${buttonClass}`}
        onClick={(e) => {
          e.stopPropagation();

          navigate(`/matches/${id}`);
        }}
      >

        <span>
          {buttonText}
        </span>

        {!isFull && (
          <ChevronRight size={17} />
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

  occupied_slots:
    PropTypes.number.isRequired,

  max_players:
    PropTypes.number.isRequired,

  status: PropTypes.string.isRequired,

  playerStatus: PropTypes.string,

  match_type: PropTypes.string,

  court_type: PropTypes.string,

  duration: PropTypes.number,

  isOrganizer: PropTypes.bool,

  isJoined: PropTypes.bool,

  isFull: PropTypes.bool,

  unreadCount: PropTypes.number,

  isPast: PropTypes.bool,

  match_result: PropTypes.object,

  currentUserId: PropTypes.string,
};