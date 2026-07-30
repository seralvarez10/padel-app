import {
  ChevronRight,
  Bell,
  Settings,
  Trophy,
  LogOut,
} from "lucide-react";

import styles from "./ProfileMenu.module.css";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

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
    action: "logout",
    danger: true,
  },
];

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  async function handleClick(item) {
    if (item.action === "logout") {
      await logout();
      navigate("/login");
    }
  }

  return (
    <section className={styles.menu}>
      {items.map((item) => {
        const Icon = item.icon; // Renombrar en mayúscula para usarlo como componente
        
        return (
          <button
            key={item.title}
            onClick={() => handleClick(item)}
            className={`${styles.item} ${item.danger ? styles.danger : ""}`}
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