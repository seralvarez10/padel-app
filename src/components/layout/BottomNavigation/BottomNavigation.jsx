import {
  CalendarDays,
  Home,
  PlusCircle,
  Search,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import styles from "./BottomNavigation.module.css";

const items = [
  {
    label: "Inicio",
    icon: Home,
    path: "/",
  },
  {
    label: "Explorar",
    icon: Search,
    path: "/explore",
  },
  {
    label: "Crear",
    icon: PlusCircle,
    path: "/create",
  },
  {
    label: "Mis partidos",
    icon: CalendarDays,
    path: "/my-matches",
  },
  {
    label: "Perfil",
    icon: User,
    path: "/profile",
  },
];

export default function BottomNavigation() {
  return (
    <nav className={styles.navigation}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={22} />

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}