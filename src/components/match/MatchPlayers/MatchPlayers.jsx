import PropTypes from "prop-types";
import { UserRound, Plus } from "lucide-react";

import useMatchPlayers from "../../../hooks/useMatchPlayers";

import styles from "./MatchPlayers.module.css";

export default function MatchPlayers({
  matchId,
  maxPlayers,
}) {
  const {
    players,
    loading,
  } = useMatchPlayers(matchId);

  if (loading) {
    return <p>Cargando jugadores...</p>;
  }
  function getInitials(player) {
    const name =
      player.profiles.full_name ||
      player.profiles.username?.split("@")[0] ||
      "";

    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  return (
    <section className={styles.container}>

      <h2>Jugadores</h2>

      {players.map((player) => (

        <div
          key={player.id}
          className={styles.player}
        >
          <div className={styles.avatar}>
            {getInitials(player)}
          </div>

          <div>
            <strong>
              player.profiles.full_name ||
              player.profiles.username?.split("@")[0]
            </strong>

            <p>
              Nivel {player.profiles.level_current}
            </p>
            {player.role === "CREATOR" && (
              <span className={styles.creator}>
                Organizador
              </span>
            )}
          </div>

        </div>

      ))}

      {Array.from({
        length: maxPlayers - players.length,
      }).map((_, index) => (

        <div
          key={index}
          className={styles.empty}
        >
          <Plus size={18} />

          <span>Plaza libre</span>

        </div>

      ))}

    </section>
  );
}

MatchPlayers.propTypes = {
  matchId: PropTypes.string.isRequired,
  maxPlayers: PropTypes.number.isRequired,
};