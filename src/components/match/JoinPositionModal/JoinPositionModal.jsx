import PropTypes from "prop-types";
import { useState } from "react";
import Avatar from "../../common/Avatar";

import styles from "./JoinPositionModal.module.css";

const POSITIONS = {
  TEAM_A_LEFT: {
    label: "Derecha",
    team: "A",
  },

  TEAM_A_RIGHT: {
    label: "Revés",
    team: "A",
  },

  TEAM_B_LEFT: {
    label: "Revés",
    team: "B",
  },

  TEAM_B_RIGHT: {
    label: "Derecha",
    team: "B",
  },
};

export default function JoinPositionModal({
  players,
  onConfirm,
  onCancel,
  loading = false,
  currentUserId,
}) {
  const [selectedPosition, setSelectedPosition] =
    useState(null);

  function getPlayer(position) {
    return players.find(
      (player) =>
        player.position === position &&
        player.status !== "LEFT"
    );
  }

  function handleSelect(position) {
    if (loading) return;

    setSelectedPosition(position);
  }

  function renderPosition(position) {
    const player = getPlayer(position);
    const positionInfo = POSITIONS[position];

    const isSelected =
      selectedPosition === position;

    if (player) {
      return (
        <button
          type="button"
          className={`${styles.position} ${
            styles.occupied
          } ${
            isSelected
              ? styles.selected
              : ""
          }`}
          onClick={() =>
            handleSelect(position)
          }
          disabled={
            loading ||
            player.player_id === currentUserId
          }
        >
          <Avatar
            src={
              player.profiles?.avatar_url
            }
            name={
              player.profiles?.display_name ||
              "Jugador"
            }
            size="sm"
          />

          <div className={styles.playerInfo}>
            <strong>
              {player.profiles?.display_name ||
                "Jugador"}
            </strong>

            <span>
              {isSelected
                ? "Intercambiar"
                : positionInfo.label}
            </span>
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        className={`${styles.position} ${
          styles.empty
        } ${
          isSelected
            ? styles.selected
            : ""
        }`}
        onClick={() =>
          handleSelect(position)
        }
        disabled={loading}
      >
        <span className={styles.plus}>
          {isSelected ? "✓" : "+"}
        </span>

        <span className={styles.positionLabel}>
          {isSelected
            ? "Seleccionada"
            : positionInfo.label}
        </span>
      </button>
    );
  }

  const selectedPlayer =
    selectedPosition
      ? getPlayer(selectedPosition)
      : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div>
            <h2>
              Elige tu posición
            </h2>

            <p>
              Pulsa sobre una plaza libre
              o sobre otro jugador para
              intercambiar posiciones.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className={styles.court}>

          <div className={styles.teamLabel}>
            PAREJA A
          </div>

          <div className={styles.side}>
            {renderPosition(
              "TEAM_A_LEFT"
            )}

            {renderPosition(
              "TEAM_A_RIGHT"
            )}
          </div>

          <div className={styles.net}>
            <span>RED</span>
          </div>

          <div className={styles.side}>
            {renderPosition(
              "TEAM_B_LEFT"
            )}

            {renderPosition(
              "TEAM_B_RIGHT"
            )}
          </div>

          <div className={styles.teamLabel}>
            PAREJA B
          </div>

        </div>

        {selectedPlayer && (
          <div className={styles.swapInfo}>
            🔄 Vas a intercambiar posición
            con{" "}
            <strong>
              {
                selectedPlayer.profiles
                  ?.display_name
              }
            </strong>
          </div>
        )}

        <div className={styles.actions}>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.confirmButton
            }
            onClick={() =>
              onConfirm(
                selectedPosition,
                selectedPlayer
              )
            }
            disabled={
              !selectedPosition ||
              loading
            }
          >
            {loading
              ? "Guardando..."
              : selectedPlayer
              ? "Intercambiar posiciones"
              : "Confirmar posición"}
          </button>

        </div>

      </div>
    </div>
  );
}

JoinPositionModal.propTypes = {
  players: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  currentUserId: PropTypes.string,
};