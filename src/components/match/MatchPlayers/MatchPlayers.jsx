import PropTypes from "prop-types";
import { Plus } from "lucide-react";

import styles from "./MatchPlayers.module.css";

export default function MatchPlayers({
  players,
  maxPlayers,
}) {

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

      <h2 className={styles.title}>
        Jugadores
      </h2>

      {players.map((player) => (

        <div
          key={player.id}
          className={styles.player}
        >

          <div className={styles.avatar}>
            {getInitials(player)}
          </div>

          <div className={styles.info}>

            <strong>
              {player.profiles.full_name ||
                player.profiles.username?.split("@")[0]}
            </strong>

            <span>
              Nivel {player.profiles.level_current}
            </span>

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
  players: PropTypes.array.isRequired,
  maxPlayers: PropTypes.number.isRequired,
};