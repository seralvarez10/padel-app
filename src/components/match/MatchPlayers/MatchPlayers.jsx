import PropTypes from "prop-types";
import { useState } from "react";

import {
  Users,
  Crown,
} from "lucide-react";

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
    emptyLabel: "Derecha libre",
  },

  TEAM_A_RIGHT: {
    team: "A",
    label: "Revés",
    emptyLabel: "Revés libre",
  },

  TEAM_B_LEFT: {
    team: "B",
    label: "Revés",
    emptyLabel: "Revés libre",
  },

  TEAM_B_RIGHT: {
    team: "B",
    label: "Derecha",
    emptyLabel: "Derecha libre",
  },
};


export default function MatchPlayers({
  matchId,
  players,
  maxPlayers,
  currentUserId,
  onPositionChange,
}) {
  const [
    showPositionModal,
    setShowPositionModal,
  ] = useState(false);


  /*
   * ==========================================
   * JUGADORES VISIBLES
   * ==========================================
   */

  const visiblePlayers =
    players.filter(
      (player) =>
        player.status !== "LEFT"
    );


  const currentPlayer =
    visiblePlayers.find(
      (player) =>
        player.player_id ===
        currentUserId
    );


  const canChangePosition =
    !!currentPlayer;


  /*
   * ==========================================
   * CAMBIAR POSICIÓN
   * ==========================================
   */

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


  /*
   * ==========================================
   * BUSCAR JUGADOR
   * ==========================================
   */

  function getPlayer(position) {
    return visiblePlayers.find(
      (player) =>
        player.position === position
    );
  }


  /*
   * ==========================================
   * RENDERIZAR POSICIÓN
   * ==========================================
   */

  function renderPosition(position) {
    const player =
      getPlayer(position);

    const positionInfo =
      POSITIONS[position];


    /*
     * POSICIÓN VACÍA
     */

    if (!player) {
      return (
        <div
          className={
            styles.emptyPosition
          }
        >
          <span
            className={
              styles.emptyPlus
            }
          >
            +
          </span>

          <span
            className={
              styles.emptyLabel
            }
          >
            {positionInfo.emptyLabel}
          </span>
        </div>
      );
    }


    /*
     * POSICIÓN OCUPADA
     */

    const fullName =
      player.profiles?.display_name ||
      "Jugador";

    const nameParts =
      fullName.trim().split(/\s+/);

    const shortName =
      nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1][0]}.`
        : nameParts[0];

    return (
      <div className={styles.occupiedPosition}>
        <Avatar
          src={player.profiles?.avatar_url}
          name={fullName}
          size="sm"
        />

        <div className={styles.playerInfo}>
          <strong>
            {shortName}
          </strong>

          <span>
            {positionInfo.label}
          </span>
        </div>

        {player.role === "CREATOR" && (
          <span className={styles.organizer}>
            ♛
          </span>
        )}
      </div>
    );
  }


  return (
    <section
      className={
        styles.container
      }
    >

      {/* ==================================
          CABECERA
      ================================== */}

      <div
        className={
          styles.header
        }
      >
        <div
          className={
            styles.titleWrapper
          }
        >
          <Users
            size={17}
            className={
              styles.titleIcon
            }
          />

          <h2
            className={
              styles.title
            }
          >
            Posiciones
          </h2>
        </div>


        <span
          className={
            styles.playerCount
          }
        >
          {visiblePlayers.length}/
          {maxPlayers}
        </span>
      </div>


      {/* ==================================
          PAREJA A
      ================================== */}

      <div
        className={
          styles.teamLabel
        }
      >
        PAREJA A
      </div>


      <div
        className={
          styles.team
        }
      >
        {renderPosition(
          "TEAM_A_LEFT"
        )}

        {renderPosition(
          "TEAM_A_RIGHT"
        )}
      </div>


      {/* ==================================
          VS
      ================================== */}

      <div
        className={
          styles.vs
        }
      >
        <span />
        <strong>VS</strong>
        <span />
      </div>


      {/* ==================================
          PAREJA B
      ================================== */}

      <div
        className={
          styles.teamLabel
        }
      >
        PAREJA B
      </div>


      <div
        className={
          styles.team
        }
      >
        {renderPosition(
          "TEAM_B_LEFT"
        )}

        {renderPosition(
          "TEAM_B_RIGHT"
        )}
      </div>


      {/* ==================================
          CAMBIAR POSICIÓN
      ================================== */}

      {canChangePosition && (
        <button
          type="button"
          className={
            styles.choosePositionButton
          }
          onClick={() =>
            setShowPositionModal(true)
          }
        >
          Cambiar mi posición
        </button>
      )}


      {/* ==================================
          MODAL
      ================================== */}

      {showPositionModal && (
        <JoinPositionModal
          players={
            visiblePlayers
          }
          currentUserId={
            currentUserId
          }
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

            setShowPositionModal(
              false
            );
          }}
        />
      )}

    </section>
  );
}


MatchPlayers.propTypes = {
  matchId:
    PropTypes.string.isRequired,

  players:
    PropTypes.array.isRequired,

  maxPlayers:
    PropTypes.number.isRequired,

  currentUserId:
    PropTypes.string,

  onPositionChange:
    PropTypes.func,
};