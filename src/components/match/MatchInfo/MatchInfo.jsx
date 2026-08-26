import PropTypes from "prop-types";

import {
  MapPin,
  CalendarDays,
  Clock3,
  Star,
  Building2,
  Target,
} from "lucide-react";

import MatchStatus from "../MatchStatus";
import { formatMatchDate } from "../../../utils/formatDate";

import styles from "./MatchInfo.module.css";

export default function MatchInfo({ match }) {
  /*
   * ==========================================
   * DATOS DEL PARTIDO
   * ==========================================
   */

  const courtType =
    match.court_type || "Indoor";

  const duration =
    match.duration ?? 90;

  const levelMin =
    match.level_min ?? "-";

  const levelMax =
    match.level_max ?? levelMin;

  const matchType =
    match.match_type || "Libre";

  /*
   * ==========================================
   * FECHA Y HORA
   * ==========================================
   */

  const formattedDate =
    formatMatchDate(match.match_date);

  const formattedTime =
    match.match_time?.slice(0, 5);

  /*
   * ==========================================
   * NIVEL
   * ==========================================
   */

  const levelText =
    levelMax !== levelMin
      ? `${levelMin}-${levelMax}`
      : levelMin;

  return (
    <>
      {/* ======================================
          INFORMACIÓN PRINCIPAL
      ====================================== */}

      <section className={styles.infoCard}>

        <div className={styles.statusRow}>
          <MatchStatus
            status={match.status}
          />

          <span className={styles.matchType}>
            {matchType}
          </span>
        </div>

        <h1 className={styles.title}>
          {match.title}
        </h1>

        <div className={styles.info}>
          <MapPin
            size={15}
            strokeWidth={1.8}
          />

          <span>
            {match.location}

            {match.city
              ? `, ${match.city}`
              : ""}
          </span>
        </div>

        <div className={styles.info}>
          <CalendarDays
            size={15}
            strokeWidth={1.8}
          />

          <span>
            {formattedDate}
            {" · "}
            {formattedTime}
          </span>
        </div>

      </section>


      {/* ======================================
          INFORMACIÓN RÁPIDA
      ====================================== */}

      <section className={styles.grid}>

        {/* PISTA */}

        <div className={styles.card}>
          <Building2
            size={16}
            strokeWidth={1.8}
            className={styles.cardIcon}
          />

          <span>
            {courtType}
          </span>
        </div>


        {/* DURACIÓN */}

        <div className={styles.card}>
          <Clock3
            size={16}
            strokeWidth={1.8}
            className={styles.cardIcon}
          />

          <span>
            {duration} min
          </span>
        </div>


        {/* NIVEL */}

        <div className={styles.card}>
          <Star
            size={16}
            strokeWidth={1.8}
            className={styles.cardIcon}
          />

          <span>
            Nivel {levelText}
          </span>
        </div>


        {/* TIPO */}

        <div className={styles.card}>
          <Target
            size={16}
            strokeWidth={1.8}
            className={styles.cardIcon}
          />

          <span>
            {matchType}
          </span>
        </div>

      </section>


      {/* ======================================
          DESCRIPCIÓN
      ====================================== */}

      {match.description?.trim() && (
        <section className={styles.description}>
          <h3>
            Descripción
          </h3>

          <p>
            {match.description}
          </p>
        </section>
      )}
    </>
  );
}

MatchInfo.propTypes = {
  match: PropTypes.object.isRequired,
};