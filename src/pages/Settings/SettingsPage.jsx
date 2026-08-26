import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  UserRound,
  Camera,
  LockKeyhole,
  Shield,
  Bell,
  LogIn,
  Trash2,
  ChevronRight,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import useLogout from "../../hooks/useLogout";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";

import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function handleDeleteAccount() {
    try {
      setDeletingAccount(true);

      const { data, error } =
        await supabase.functions.invoke(
          "delete-account"
        );

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(
          data?.error || "No se pudo eliminar la cuenta."
        );
      }

      // Cerramos la sesión local
      await supabase.auth.signOut();

      // Volvemos al login
      navigate("/login");

    } catch (error) {
      console.error(
        "Error eliminando cuenta:",
        error
      );

      toast.error(
        "No se ha podido eliminar la cuenta. Inténtalo de nuevo."
      );
    } finally {
      setDeletingAccount(false);
    }
  }
  return (
    <>
      <Layout>
        <div className={styles.container}>

          {/* Cabecera */}
          <header className={styles.header}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/profile")}
              aria-label="Volver"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Configuración</h1>
              <p>Gestiona tu cuenta y tus preferencias</p>
            </div>
          </header>

          {/* Mi cuenta */}
          <section className={styles.section}>
            <h2>MI CUENTA</h2>

            <div className={styles.card}>

              <button
                type="button"
                className={styles.option}
                onClick={() => navigate("/profile/edit")}
              >
                <div className={styles.icon}>
                  <UserRound size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Editar perfil</strong>
                  <span>
                    Nombre, ciudad, nivel y datos personales
                  </span>
                </div>

                <ChevronRight className={styles.arrow} size={20} />
              </button>

              <button
                type="button"
                className={styles.option}
                onClick={() => navigate("/profile/photo")}
              >
                <div className={styles.icon}>
                  <Camera size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Foto de perfil</strong>
                  <span>
                    Cambia tu imagen de perfil
                  </span>
                </div>

                <ChevronRight className={styles.arrow} size={20} />
              </button>

            </div>
          </section>

          {/* Seguridad y privacidad */}
          <section className={styles.section}>
            <h2>SEGURIDAD Y PRIVACIDAD</h2>

            <div className={styles.card}>

              <button
                type="button"
                className={styles.option}
                onClick={() => navigate("/settings/password")}
              >
                <div className={styles.icon}>
                  <LockKeyhole size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Cambiar contraseña</strong>
                  <span>
                    Actualiza tu contraseña
                  </span>
                </div>

                <ChevronRight
                  className={styles.arrow}
                  size={20}
                />
              </button>
              <button
                type="button"
                className={styles.option}
                onClick={() => navigate("/privacy")}
              >
                <div className={styles.icon}>
                  <Shield size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Privacidad</strong>
                  <span>
                    Controla quién puede ver tu información
                  </span>
                </div>

                <ChevronRight className={styles.arrow} size={20} />
              </button>

            </div>
          </section>

          {/* Notificaciones */}
          <section className={styles.section}>
            <h2>NOTIFICACIONES</h2>

            <div className={styles.card}>

              <button
                type="button"
                className={styles.option}
                onClick={() => navigate("/notifications")}
              >
                <div className={styles.icon}>
                  <Bell size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Notificaciones</strong>
                  <span>
                    Gestiona qué avisos quieres recibir
                  </span>
                </div>

                <ChevronRight
                  className={styles.arrow}
                  size={20}
                />
              </button>

            </div>
          </section>

          {/* Cuenta */}
          <section className={styles.section}>
            <h2>CUENTA</h2>

            <div className={styles.card}>

              <button
                type="button"
                className={`${styles.option} ${styles.logout}`}
                onClick={async () => {
                  try {
                    await logout();
                    navigate("/login");
                  } catch (error) {
                    console.error("Error cerrando sesión:", error);
                  }
                }}
              >
                <div className={`${styles.icon} ${styles.logoutIcon}`}>
                  <LogIn size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Cerrar sesión</strong>
                  <span>
                    Sal de tu cuenta en este dispositivo
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.option} ${styles.delete}`}
                onClick={() => setShowDeleteModal(true)}
              >
                <div className={`${styles.icon} ${styles.deleteIcon}`}>
                  <Trash2 size={20} />
                </div>

                <div className={styles.content}>
                  <strong>Eliminar cuenta</strong>
                  <span>
                    Esta acción no se puede deshacer
                  </span>
                </div>
              </button>

            </div>
          </section>
          {showDeleteModal && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowDeleteModal(false)}
            >
              <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.modalIcon}>
                  <Trash2 size={24} />
                </div>

                <h2>¿Eliminar cuenta?</h2>

                <p>
                  Esta acción no se puede deshacer. Se eliminarán tu
                  perfil y tus datos personales.
                </p>

                <p>
                  Tu historial deportivo podrá conservarse de forma
                  anonimizada.
                </p>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.modalCancel}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className={styles.modalDelete}
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount
                      ? "Eliminando..."
                      : "Eliminar cuenta"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>

      <BottomNavigation />
    </>
  );
}