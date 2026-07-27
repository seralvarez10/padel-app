import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./HeroCard.module.css";
import Card from "../../ui/Card";

export default function HeroCard() {
  const navigate = useNavigate();

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

        <button onClick={() => navigate("/explore")}>
          Explorar partidos
        </button>
      </div>

      <div className={styles.icon}>
        <CalendarDays
          size={90}
          strokeWidth={1.3}
        />
      </div>
    </Card>
  );
}