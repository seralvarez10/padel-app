import {
  CalendarDays,
  Home,
  PlusCircle,
  Search,
  User,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import useFriendRequestCount from "../../../hooks/useFriendRequestCount";


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
    label: "Amigos",
    icon: Users,
    path: "/friends",
  },
  {
    label: "Perfil",
    icon: User,
    path: "/profile",
  },
];

export default function BottomNavigation() {
  const { count: friendRequestsCount } =
    useFriendRequestCount();

  return (
    <nav className={styles.navigation}>
      {items.map((item) => {
        const Icon = item.icon;

        const showFriendBadge =
          item.path === "/friends" &&
          friendRequestsCount > 0;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/profile"}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.iconContainer}>
              <Icon size={22} />

              {showFriendBadge && (
                <span className={styles.badge}>
                  {friendRequestsCount > 99
                    ? "99+"
                    : friendRequestsCount}
                </span>
              )}
            </div>

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}