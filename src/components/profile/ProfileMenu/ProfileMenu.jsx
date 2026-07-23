import {
  ChevronRight,
  Bell,
  Settings,
  Trophy,
  LogOut,
} from "lucide-react";

import styles from "./ProfileMenu.module.css";

const items = [
  {
    icon: Bell,
    title: "Notificaciones",
  },
  {
    icon: Trophy,
    title: "Mis logros",
  },
  {
    icon: Settings,
    title: "Configuración",
  },
  {
    icon: LogOut,
    title: "Cerrar sesión",
    danger: true,
  },
];

export default function ProfileMenu() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Ajustes
      </h2>

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.title}
            className={`${styles.item} ${
              item.danger ? styles.danger : ""
            }`}
          >
            <div className={styles.left}>
              <Icon size={20} />
              <span>{item.title}</span>
            </div>

            <ChevronRight size={18} />
          </button>
        );
      })}
    </section>
  );
}