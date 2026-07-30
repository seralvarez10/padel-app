import PropTypes from "prop-types";
import { Plus } from "lucide-react";
import Avatar from "../../common/Avatar";
import styles from "./MatchPlayers.module.css";

export default function MatchPlayers({
  players,
  maxPlayers,
}) {

  function getInitials(player) {
    const name = player.profiles.display_name || "";

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.role === "CREATOR") return -1;
    if (b.role === "CREATOR") return 1;
    return 0;
  });
  return (
    <section className={styles.container}>

      <h2 className={styles.title}>
        👥 Jugadores ({players.length}/{maxPlayers})
      </h2>
      <p className={styles.subtitle}>
        {players.length === maxPlayers
          ? "🔒 Partido completo"
          : `🟢 Quedan ${maxPlayers - players.length} plaza${maxPlayers - players.length > 1 ? "s" : ""}`}
      </p>
      {sortedPlayers.map((player) => (

        <div
          key={player.id}
          className={styles.player}
        >

          <Avatar
            src={player.profiles.avatar_url}
            name={player.profiles.display_name}
            size="md"
          />

          <div className={styles.info}>

            <strong>
              {player.profiles.display_name || "Jugador"}
            </strong>

            <span>
              🎾 Nivel {player.profiles.level_current}
            </span>

            {player.role === "CREATOR" && (
              <span className={styles.creator}>
                👑 Organizador
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

          <div>
            <strong>Plaza libre</strong>
            <span>Esperando jugador</span>
          </div>

        </div>

      ))}

    </section>
  );
}

MatchPlayers.propTypes = {
  players: PropTypes.array.isRequired,
  maxPlayers: PropTypes.number.isRequired,
};