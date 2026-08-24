import PropTypes from "prop-types";
import { useState } from "react";
import Avatar from "../../common/Avatar";
import JoinPositionModal from "../JoinPositionModal/JoinPositionModal";
import {
  updatePlayerPosition,
  swapPlayerPositions,
} from "../../../services/matchPlayersService";
import toast from "react-hot-toast";

import styles from "./MatchPlayers.module.css";

const POSITIONS = {
  TEAM_A_LEFT: {
    team: "A",
    label: "Derecha",
  },

  TEAM_A_RIGHT: {
    team: "A",
    label: "Revés",
  },

  TEAM_B_LEFT: {
    team: "B",
    label: "Revés",
  },

  TEAM_B_RIGHT: {
    team: "B",
    label: "Derecha",
  },
};

export default function MatchPlayers({
  matchId,
  players,
  maxPlayers,
  currentUserId,
  onPositionChange,
}) {
  const [showPositionModal, setShowPositionModal] =
    useState(false);

  const visiblePlayers = players.filter(
    (player) => player.status !== "LEFT"
  );

  const currentPlayer = visiblePlayers.find(
    (player) => player.player_id === currentUserId
  );

  const isOrganizer =
    currentPlayer?.role === "CREATOR";

  const canChangePosition =
    !!currentPlayer;

  async function handlePositionChange(
    position,
    targetPlayer
  ) {
    try {
      if (targetPlayer) {
        await swapPlayerPositions(
          matchId,
          currentUserId,
          targetPlayer.player_id
        );

        toast.success(
          "Has intercambiado tu posición"
        );
      } else {
        await updatePlayerPosition(
          matchId,
          currentUserId,
          position
        );

        toast.success(
          "Has cambiado de posición"
        );
      }

      onPositionChange?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
        "No se pudo actualizar la posición"
      );
    }
  }

  function getPlayer(position) {
    return visiblePlayers.find(
      (player) => player.position === position
    );
  }

  function renderPosition(position) {
    const player = getPlayer(position);
    const positionInfo = POSITIONS[position];

    if (!player) {
      return (
        <div className={styles.emptyPosition}>
          <span className={styles.plus}>
            +
          </span>

          <span className={styles.positionLabel}>
            {positionInfo.label}
          </span>
        </div>
      );
    }

    const name =
      player.profiles?.display_name ||
      "Jugador";

    return (
      <div className={styles.occupiedPosition}>
        <Avatar
          src={player.profiles?.avatar_url}
          name={name}
          size="sm"
        />

        <div className={styles.playerInfo}>
          <strong>
            {name}
          </strong>

          <span>
            {positionInfo.label}
          </span>
        </div>

        {player.role === "CREATOR" && (
          <span className={styles.organizer}>
            👑
          </span>
        )}
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            🎾 Posiciones
          </h2>

          <p className={styles.subtitle}>
            {visiblePlayers.length}/{maxPlayers} jugadores
          </p>
        </div>
      </div>

      <div className={styles.court}>
        {/* Pareja A */}
        <div className={styles.teamLabel}>
          PAREJA A
        </div>

        <div className={styles.side}>
          {renderPosition("TEAM_A_LEFT")}
          {renderPosition("TEAM_A_RIGHT")}
        </div>

        {/* Red */}
        <div className={styles.net}>
          <span>RED</span>
        </div>

        {/* Pareja B */}
        <div className={styles.side}>
          {renderPosition("TEAM_B_LEFT")}
          {renderPosition("TEAM_B_RIGHT")}
        </div>

        <div className={styles.teamLabel}>
          PAREJA B
        </div>
      </div>

      {canChangePosition && (
        <button
          type="button"
          className={styles.choosePositionButton}
          onClick={() =>
            setShowPositionModal(true)
          }
        >
          🎾 Cambiar posición
        </button>
      )}

      {showPositionModal && (
        <JoinPositionModal
          players={visiblePlayers}
          currentUserId={currentUserId}
          onCancel={() =>
            setShowPositionModal(false)
          }
          onConfirm={async (
            position,
            targetPlayer
          ) => {
            await handlePositionChange(
              position,
              targetPlayer
            );

            setShowPositionModal(false);
          }}
        />
      )}
    </section>
  );
}

MatchPlayers.propTypes = {
  matchId: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
  maxPlayers: PropTypes.number.isRequired,
  currentUserId: PropTypes.string,
  onPositionChange: PropTypes.func,
};