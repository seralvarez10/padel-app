import { CalendarDays } from "lucide-react";
import styles from "./HeroCard.module.css";
import Card from "../../ui/Card";

export default function HeroCard() {
  return (
    <Card className={styles.hero}>
      <div>
        <span className={styles.badge}>
          Hoy
        </span>

        <h2>
          ¿Listo para jugar?
        </h2>

        <p>
          Encuentra un partido cerca de ti en menos de un minuto.
        </p>

        <button>
          Explorar partidos
        </button>
      </div>

      <CalendarDays
        size={70}
        strokeWidth={1.5}
      />
    </Card>
  );
}