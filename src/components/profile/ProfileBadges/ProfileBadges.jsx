import {
  Trophy,
  Flame,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

import styles from "./ProfileBadges.module.css";

const badges = [
  {
    icon: Trophy,
    title: "Competidor",
    color: "#F59E0B",
  },
  {
    icon: Flame,
    title: "Activo",
    color: "#EF4444",
  },
  {
    icon: ShieldCheck,
    title: "Fair Play",
    color: "#22C55E",
  },
  {
    icon: HeartHandshake,
    title: "Buen compañero",
    color: "#3B82F6",
  },
];

export default function ProfileBadges() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Insignias
      </h2>

      <div className={styles.badges}>
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.title}
              className={styles.badge}
            >
              <Icon
                size={18}
                style={{ color: badge.color }}
              />

              <span>{badge.title}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}