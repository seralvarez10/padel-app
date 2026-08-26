import {
  ChevronRight,
  LogOut,
} from "lucide-react";

import styles from "./ProfileMenu.module.css";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <section className={styles.menu}>
      <button
        type="button"
        onClick={handleLogout}
        className={`${styles.item} ${styles.danger}`}
      >
        <div className={styles.left}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </div>

        <ChevronRight size={18} />
      </button>
    </section>
  );
}