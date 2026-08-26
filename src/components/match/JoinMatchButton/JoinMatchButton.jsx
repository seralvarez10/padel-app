import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";

import JoinPositionModal from "../JoinPositionModal/JoinPositionModal";

import useJoinMatch from "../../../hooks/useJoinMatch";

import styles from "./JoinMatchButton.module.css";

export default function JoinMatchButton({
  matchId,
  joined,
  full,
  isOrganizer,
  players = [],
  onJoined,
}) {
  const {
    join,
    loading,
  } = useJoinMatch();

  const [
    showPositionModal,
    setShowPositionModal,
  ] = useState(false);

  async function handleLeave() {
    const ok = await join(
      matchId,
      true
    );

    if (ok) {
      toast.success(
        "Has abandonado el partido"
      );

      onJoined?.();
    }
  }

  async function handleJoin(position) {
    const ok = await join(
      matchId,
      false,
      position
    );

    if (ok) {
      setShowPositionModal(false);

      toast.success(
        "Te has unido al partido"
      );

      onJoined?.();
    }
  }

  function handleClick() {
    if (joined) {
      handleLeave();
      return;
    }

    setShowPositionModal(true);
  }

  /*
   * =========================
   * ESTADO DEL BOTÓN
   * =========================
   */

  let buttonText = "Unirme al partido";

  let buttonClass =
    styles.joinButton;

  let disabled = false;

  let icon = "🎾";

  if (loading) {
    buttonText = joined
      ? "Saliendo..."
      : "Uniéndose...";

    disabled = true;

    buttonClass = styles.loadingButton;

    icon = "⏳";
  } else if (isOrganizer) {
    buttonText =
      "Eres el organizador";

    disabled = true;

    buttonClass =
      styles.organizerButton;

    icon = "👑";
  } else if (joined) {
    buttonText =
      "Salir del partido";

    buttonClass =
      styles.leaveButton;

    icon = "↩";
  } else if (full) {
    buttonText =
      "Partido completo";

    disabled = true;

    buttonClass =
      styles.fullButton;

    icon = "×";
  }

  return (
    <>
      <button
        type="button"
        className={buttonClass}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className={styles.icon}>
          {icon}
        </span>

        <span>
          {buttonText}
        </span>
      </button>


      {showPositionModal && (
        <JoinPositionModal
          players={players}
          loading={loading}
          onCancel={() =>
            setShowPositionModal(false)
          }
          onConfirm={handleJoin}
        />
      )}
    </>
  );
}

JoinMatchButton.propTypes = {
  matchId: PropTypes.string.isRequired,

  joined: PropTypes.bool,

  full: PropTypes.bool,

  isOrganizer: PropTypes.bool,

  players: PropTypes.array,

  onJoined: PropTypes.func,
};