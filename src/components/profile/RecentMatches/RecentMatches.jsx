import {
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";

import styles from "./RecentMatches.module.css";

const matches = [
  {
    id: 1,
    title: "Americano Nivel 3.5",
    location: "Oviedo",
    date: "Hace 2 días",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Partido Libre",
    location: "Gijón",
    date: "Hace 1 semana",
    rating: 5,
  },
  {
    id: 3,
    title: "Competitivo",
    location: "Avilés",
    date: "Hace 2 semanas",
    rating: 4.7,
  },
];

export default function RecentMatches() {
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

          <div className={styles.rating}>
            <Star
              size={18}
              fill="#FACC15"
              color="#FACC15"
            />

            <span>{match.rating}</span>
          </div>

        </div>
      ))}

    </section>
  );
}