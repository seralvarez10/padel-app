import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../ui/ConfirmModal";

import {
  confirmAttendance,
  cancelAttendance,
} from "../../../services/matchPlayersService";

import { useAuth } from "../../../contexts/AuthContext";

import styles from "./MatchAttendance.module.css";

export default function MatchAttendance({
  player,
  match,
  onUpdated,
}) {
  const { user } = useAuth();

  const [
    showLeaveModal,
    setShowLeaveModal,
  ] = useState(false);

  const navigate = useNavigate();


  /*
   * ==========================================
   * VALIDACIÓN
   * ==========================================
   */

  if (
    !player ||
    player.player_id !== user?.id
  ) {
    return null;
  }


  /*
   * ==========================================
   * CONFIRMAR ASISTENCIA
   * ==========================================
   */

  async function handleConfirm() {
    try {
      await confirmAttendance(
        match.id,
        user.id
      );

      onUpdated?.();

    } catch (error) {
      console.error(
        "Error confirmando asistencia:",
        error
      );
    }
  }


  /*
   * ==========================================
   * CANCELAR ASISTENCIA
   * ==========================================
   */

  async function handleCancel() {
    try {
      await cancelAttendance(
        match.id,
        user.id
      );

      onUpdated?.();

      navigate("/explore");

    } catch (error) {
      console.error(
        "Error cancelando asistencia:",
        error
      );
    }
  }


  const isConfirmed =
    player.status === "CONFIRMED";


  return (
    <section
      className={styles.card}
    >

      {/* ==================================
          CABECERA
      ================================== */}

      <div
        className={styles.header}
      >
        <h3
          className={styles.title}
        >
          Tu asistencia
        </h3>
      </div>


      {/* ==================================
          ASISTENCIA CONFIRMADA
      ================================== */}

      {isConfirmed ? (
        <>
          <div
            className={
              styles.confirmed
            }
          >
            <span
              className={
                styles.statusIcon
              }
            >
              ✓
            </span>

            <span>
              Has confirmado tu asistencia
            </span>
          </div>


          <p
            className={styles.note}
          >
            Si finalmente no puedes venir,
            podrás abandonar el partido.
          </p>


          <button
            type="button"
            className={
              styles.cancelButton
            }
            onClick={() =>
              setShowLeaveModal(true)
            }
          >
            No puedo ir
          </button>
        </>
      ) : (

        /* ==================================
           ASISTENCIA PENDIENTE
        ================================== */

        <>
          <p
            className={
              styles.pendingText
            }
          >
            Confirma que asistirás al partido.
          </p>


          <div
            className={
              styles.actions
            }
          >
            <button
              type="button"
              className={
                styles.confirmButton
              }
              onClick={
                handleConfirm
              }
            >
              Confirmar asistencia
            </button>


            <button
              type="button"
              className={
                styles.cancelButton
              }
              onClick={
                handleCancel
              }
            >
              No puedo ir
            </button>
          </div>
        </>
      )}


      {/* ==================================
          MODAL
      ================================== */}

      <ConfirmModal
        open={showLeaveModal}
        title="Abandonar partido"
        message="¿Seguro que no puedes asistir? Tu plaza quedará libre para otro jugador."
        confirmText="Abandonar"
        cancelText="Cancelar"
        onCancel={() =>
          setShowLeaveModal(false)
        }
        onConfirm={async () => {
          await handleCancel();

          setShowLeaveModal(false);
        }}
      />

    </section>
  );
}


MatchAttendance.propTypes = {
  player: PropTypes.object,

  match: PropTypes.object,

  onUpdated: PropTypes.func,
};