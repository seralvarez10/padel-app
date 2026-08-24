import PropTypes from "prop-types";

import styles from "./MatchResult.module.css";

export default function MatchResult({
  result,
  players,
}) {
  const activePlayers = players.filter(
    (player) => player.status !== "LEFT"
  );

  const isComplete =
    activePlayers.length === 4;

  // Mientras el partido no tenga los 4 jugadores,
  // no mostramos la sección de resultados.
  if (!isComplete && !result) {
    return null;
  }

  const teamA = activePlayers.filter(
    (player) =>
      player.position === "TEAM_A_LEFT" ||
      player.position === "TEAM_A_RIGHT"
  );

  const teamB = activePlayers.filter(
    (player) =>
      player.position === "TEAM_B_LEFT" ||
      player.position === "TEAM_B_RIGHT"
  );

  function getPlayerName(player) {
    return (
      player.profiles?.display_name ||
      "Jugador"
    );
  }

  /*
   * Partido completo pero todavía sin resultado.
   */
  if (!result) {
    return (
      <section className={styles.container}>
        <div className={styles.header}>
          <h2>🏆 Resultado</h2>
        </div>

        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            🏁
          </span>

          <h3>Partido completo</h3>

          <p>
            Cuando termine el partido,
            podréis registrar el resultado.
          </p>
        </div>
      </section>
    );
  }

  /*
   * Resultado existente.
   */
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>🏆 Resultado</h2>

        <span className={styles.status}>
          {result.status}
        </span>
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          <span className={styles.teamTitle}>
            PAREJA A
          </span>

          {teamA.map((player) => (
            <span key={player.player_id}>
              {getPlayerName(player)}
            </span>
          ))}
        </div>

        <div className={styles.vs}>
          VS
        </div>

        <div className={styles.team}>
          <span className={styles.teamTitle}>
            PAREJA B
          </span>

          {teamB.map((player) => (
            <span key={player.player_id}>
              {getPlayerName(player)}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.resultInfo}>
        <strong>
          Resultado registrado
        </strong>

        <pre>
          {JSON.stringify(
            result.score,
            null,
            2
          )}
        </pre>
      </div>
    </section>
  );
}

MatchResult.propTypes = {
  result: PropTypes.object,
  players: PropTypes.array.isRequired,
};