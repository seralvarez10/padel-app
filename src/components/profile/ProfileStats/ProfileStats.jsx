import {
  CalendarDays,
  Star,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import styles from "./ProfileStats.module.css";

const stats = [
  {
    icon: CalendarDays,
    value: 28,
    label: "Partidos",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Valoración",
  },
  {
    icon: ShieldCheck,
    value: "87%",
    label: "Asistencia",
  },
  {
    icon: TrendingUp,
    value: "3.5",
    label: "Nivel",
  },
];

export default function ProfileStats() {
  return (
    <section className={styles.container}>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={styles.card}
          >
            <Icon
              size={22}
              className={styles.icon}
            />

            <h3>{stat.value}</h3>

            <span>{stat.label}</span>
          </div>
        );
      })}
    </section>
  );
}