import PropTypes from "prop-types";

import {
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";

import styles from "./RecentMatches.module.css";

export default function RecentMatches({ matches = [] }) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Últimos partidos
      </h2>

      {matches.map((match) => (
        <div
          key={match.id}
          className={styles.card}
        >
          <div>
            <h3>{match.title}</h3>

            <div className={styles.info}>
              <MapPin size={15} />
              <span>{match.location}</span>
            </div>

            <div className={styles.info}>
              <CalendarDays size={15} />
              <span>{match.date}</span>
            </div>
          </div>

          {match.rating && (
            <div className={styles.rating}>
              <Star
                size={18}
                fill="#FACC15"
                color="#FACC15"
              />

              <span>{match.rating}</span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

RecentMatches.propTypes = {
  matches: PropTypes.array,
};