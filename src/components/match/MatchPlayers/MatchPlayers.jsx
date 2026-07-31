import PropTypes from "prop-types";
import { Plus } from "lucide-react";
import Avatar from "../../common/Avatar";
import styles from "./MatchPlayers.module.css";

export default function MatchPlayers({
  players,
  maxPlayers,
}) {
  function getStatusLabel(status) {
    switch (status) {
      case "CONFIRMED":
        return {
          text: "🟢 Confirmado",
          className: styles.confirmed,
        };

      case "JOINED":
        return {
          text: "🟡 Pendiente",
          className: styles.joined,
        };

      case "LEFT":
        return {
          text: "🔴 Ha abandonado",
          className: styles.left,
        };

      case "AT_RISK":
        return {
          text: "🟠 Sin confirmar",
          className: styles.atRisk,
        };

      case "EXPIRED":
        return {
          text: "⚪ Plaza perdida",
          className: styles.expired,
        };

      case "NO_SHOW":
        return {
          text: "❌ No asistió",
          className: styles.noShow,
        };

      default:
        return {
          text: "",
          className: "",
        };
    }
  }

  // Ocultamos los jugadores que han abandonado el partido
  const visiblePlayers = players.filter(
    (player) => player.status !== "LEFT"
  );

  // Organizador siempre el primero
  const sortedPlayers = [...visiblePlayers].sort((a, b) => {
    if (a.role === "CREATOR") return -1;
    if (b.role === "CREATOR") return 1;
    return 0;
  });

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        👥 Jugadores ({visiblePlayers.length}/{maxPlayers})
      </h2>

      <p className={styles.subtitle}>
        {visiblePlayers.length === maxPlayers
          ? "🔒 Partido completo"
          : `🟢 Quedan ${
              maxPlayers - visiblePlayers.length
            } plaza${
              maxPlayers - visiblePlayers.length > 1 ? "s" : ""
            }`}
      </p>

      {sortedPlayers.map((player) => {
        const status = getStatusLabel(player.status);

        return (
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

              <div className={styles.meta}>
                <span>
                  🎾 Nivel {player.profiles.level_current}
                </span>

                {status.text && (
                  <>
                    <span className={styles.separator}>•</span>

                    <span className={status.className}>
                      {status.text}
                    </span>
                  </>
                )}
              </div>

              {player.role === "CREATOR" && (
                <span className={styles.creator}>
                  👑 Organizador
                </span>
              )}
            </div>
          </div>
        );
      })}

      {Array.from({
        length: maxPlayers - visiblePlayers.length,
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