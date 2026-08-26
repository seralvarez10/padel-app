import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../../contexts/AuthContext";

import MatchResultForm from "../MatchResultForm/MatchResultForm";

import {
  submitMatchResult,
  confirmMatchResult,
  rejectMatchResult,
} from "../../../services/matchService";

import styles from "./MatchResult.module.css";

export default function MatchResult({
  match,
  result,
  players,
  onResultSubmitted,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const { user } = useAuth();


  /*
   * ==========================================
   * JUGADORES ACTIVOS
   * ==========================================
   */

  const activePlayers =
    players.filter(
      (player) =>
        player.status !== "LEFT"
    );


  const isComplete =
    activePlayers.length === 4;


  const allPositionsAssigned =
    isComplete &&
    activePlayers.every(
      (player) => player.position
    );


  /*
   * ==========================================
   * USUARIO QUE PUBLICÓ EL RESULTADO
   * ==========================================
   */

  const isResultSubmitter =
    result?.submitted_by === user?.id;


  /*
   * ==========================================
   * PARTIDO TERMINADO
   * ==========================================
   */

  const matchDateTime = new Date(
    `${match.match_date}T${match.match_time}`
  );

  const hasFinished =
    matchDateTime <= new Date();


  /*
   * ==========================================
   * EQUIPOS
   * ==========================================
   */

  const teamA =
    activePlayers.filter(
      (player) =>
        player.position ===
          "TEAM_A_LEFT" ||
        player.position ===
          "TEAM_A_RIGHT"
    );

  const teamB =
    activePlayers.filter(
      (player) =>
        player.position ===
          "TEAM_B_LEFT" ||
        player.position ===
          "TEAM_B_RIGHT"
    );


  /*
   * ==========================================
   * NOMBRE JUGADOR
   * ==========================================
   */

  function getPlayerName(player) {
    return (
      player.profiles?.display_name ||
      "Jugador"
    );
  }


  /*
   * ==========================================
   * PUBLICAR RESULTADO
   * ==========================================
   */

  async function handleSubmit(score) {
    try {
      setSubmitting(true);

      await submitMatchResult(
        match.id,
        score
      );

      await onResultSubmitted?.();

      setShowForm(false);

      toast.success(
        "Resultado publicado correctamente"
      );

    } catch (error) {
      console.error(
        "Error al publicar resultado:",
        error
      );

      toast.error(
        error.message ||
          "No se pudo publicar el resultado"
      );

    } finally {
      setSubmitting(false);
    }
  }


  /*
   * ==========================================
   * CONFIRMAR RESULTADO
   * ==========================================
   */

  async function handleConfirm() {
    try {
      setSubmitting(true);

      await confirmMatchResult(
        match.id
      );

      await onResultSubmitted?.();

      toast.success(
        "Resultado confirmado correctamente"
      );

    } catch (error) {
      console.error(
        "Error al confirmar resultado:",
        error
      );

      toast.error(
        error.message ||
          "No se pudo confirmar el resultado"
      );

    } finally {
      setSubmitting(false);
    }
  }


  /*
   * ==========================================
   * RECHAZAR RESULTADO
   * ==========================================
   */

  async function handleReject() {
    try {
      setSubmitting(true);

      await rejectMatchResult(
        match.id
      );

      await onResultSubmitted?.();

      toast.success(
        "Resultado rechazado"
      );

    } catch (error) {
      console.error(
        "Error al rechazar resultado:",
        error
      );

      toast.error(
        error.message ||
          "No se pudo rechazar el resultado"
      );

    } finally {
      setSubmitting(false);
    }
  }


  /*
   * ==========================================
   * SIN RESULTADO Y SIN 4 JUGADORES
   * ==========================================
   */

  if (
    !isComplete &&
    !result
  ) {
    return null;
  }


  /*
   * ==========================================
   * PARTIDO COMPLETO
   * ==========================================
   */

  if (
    !result &&
    !hasFinished
  ) {
    return (
      <section
        className={
          styles.container
        }
      >
        <div
          className={
            styles.header
          }
        >
          <h2>
            Resultado
          </h2>
        </div>

        <div
          className={
            styles.empty
          }
        >
          <span
            className={
              styles.emptyIcon
            }
          >
            🏁
          </span>

          <h3>
            Partido completo
          </h3>

          <p>
            El resultado estará disponible
            cuando termine el partido.
          </p>
        </div>
      </section>
    );
  }


  /*
   * ==========================================
   * PARTIDO TERMINADO SIN RESULTADO
   * ==========================================
   */

  if (
    !result &&
    hasFinished
  ) {
    return (
      <>
        <section
          className={
            styles.container
          }
        >
          <div
            className={
              styles.header
            }
          >
            <h2>
              Resultado
            </h2>
          </div>

          <div
            className={
              styles.empty
            }
          >
            <span
              className={
                styles.emptyIcon
              }
            >
              🏁
            </span>

            <h3>
              Partido finalizado
            </h3>

            {!isComplete ? (
              <p>
                El partido necesita
                4 jugadores para
                registrar el resultado.
              </p>
            ) : !allPositionsAssigned ? (
              <p>
                Los 4 jugadores deben
                tener una posición asignada.
              </p>
            ) : (
              <>
                <p>
                  El partido ha terminado.
                  Ya podéis registrar
                  el resultado.
                </p>

                <button
                  type="button"
                  className={
                    styles.primaryButton
                  }
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  Publicar resultado
                </button>
              </>
            )}
          </div>
        </section>

        {showForm && (
          <MatchResultForm
            teamA={teamA}
            teamB={teamB}
            onSubmit={handleSubmit}
            onCancel={() =>
              setShowForm(false)
            }
            loading={submitting}
          />
        )}
      </>
    );
  }


  /*
   * ==========================================
   * RESULTADO EXISTENTE
   * ==========================================
   */

  let statusClass =
    "";

  let statusText =
    result.status;


  if (
    result.status === "PENDING"
  ) {
    statusClass =
      styles.statusPending;

    statusText =
      "Pendiente";

  } else if (
    result.status === "CONFIRMED"
  ) {
    statusClass =
      styles.statusConfirmed;

    statusText =
      "Confirmado";

  } else if (
    result.status ===
    "AUTO_CONFIRMED"
  ) {
    statusClass =
      styles.statusAutoConfirmed;

    statusText =
      "Confirmado automáticamente";

  } else if (
    result.status === "REJECTED"
  ) {
    statusClass =
      styles.statusRejected;

    statusText =
      "Rechazado";
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
        <h2>
          Resultado
        </h2>

        <span
          className={`${styles.status} ${statusClass}`}
        >
          {statusText}
        </span>
      </div>


      {/* ==================================
          EQUIPOS
      ================================== */}

      <div
        className={
          styles.teams
        }
      >

        <div
          className={
            styles.team
          }
        >
          <span
            className={
              styles.teamTitle
            }
          >
            PAREJA A
          </span>

          {teamA.map(
            (player) => (
              <span
                key={
                  player.player_id
                }
              >
                {getPlayerName(
                  player
                )}
              </span>
            )
          )}
        </div>


        <div
          className={
            styles.vs
          }
        >
          VS
        </div>


        <div
          className={
            styles.team
          }
        >
          <span
            className={
              styles.teamTitle
            }
          >
            PAREJA B
          </span>

          {teamB.map(
            (player) => (
              <span
                key={
                  player.player_id
                }
              >
                {getPlayerName(
                  player
                )}
              </span>
            )
          )}
        </div>

      </div>


      {/* ==================================
          INFORMACIÓN DEL RESULTADO
      ================================== */}

      <div
        className={
          styles.resultInfo
        }
      >

        {/* PENDIENTE */}

        {result.status ===
          "PENDING" && (
          <>
            <strong>
              Resultado pendiente de confirmación
            </strong>

            <p>
              El resultado ha sido
              publicado y está pendiente
              de confirmación por la
              pareja rival.
            </p>

            {result.response_deadline && (
              <p>
                La otra pareja tiene
                hasta el{" "}

                <strong>
                  {new Date(
                    result.response_deadline
                  ).toLocaleDateString(
                    "es-ES"
                  )}
                </strong>

                {" "}
                para confirmar o
                rechazar el resultado.
              </p>
            )}


            {!isResultSubmitter && (
              <div
                className={
                  styles.resultActions
                }
              >

                <button
                  type="button"
                  className={
                    styles.confirmResultButton
                  }
                  onClick={
                    handleConfirm
                  }
                  disabled={
                    submitting
                  }
                >
                  <span
                    className={
                      styles.actionIcon
                    }
                  >
                    ✓
                  </span>

                  <span>
                    {submitting
                      ? "Procesando..."
                      : "Confirmar resultado"}
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    styles.rejectResultButton
                  }
                  onClick={
                    handleReject
                  }
                  disabled={
                    submitting
                  }
                >
                  <span
                    className={
                      styles.actionIcon
                    }
                  >
                    ×
                  </span>

                  <span>
                    Rechazar resultado
                  </span>
                </button>

              </div>
            )}
          </>
        )}


        {/* CONFIRMADO */}

        {result.status ===
          "CONFIRMED" && (
          <>
            <strong>
              Resultado confirmado
            </strong>

            <p>
              Ambas parejas han confirmado
              el resultado del partido.
            </p>
          </>
        )}


        {/* AUTO CONFIRMADO */}

        {result.status ===
          "AUTO_CONFIRMED" && (
          <>
            <strong>
              Resultado confirmado automáticamente
            </strong>

            <p>
              La pareja rival no respondió
              dentro del plazo establecido.
            </p>
          </>
        )}


        {/* RECHAZADO */}

        {result.status ===
          "REJECTED" && (
          <>
            <strong>
              Resultado rechazado
            </strong>

            <p>
              La otra pareja ha rechazado
              el resultado publicado.
            </p>
          </>
        )}


        {/* ==================================
            MARCADOR
        ================================== */}

        <div
          className={
            styles.scoreboard
          }
        >

          <div
            className={
              styles.scoreHeader
            }
          >
            <span></span>

            <span>
              Pareja A
            </span>

            <span>
              Pareja B
            </span>
          </div>


          {result.score?.sets?.map(
            (set, index) => (
              <div
                key={index}
                className={
                  styles.scoreRow
                }
              >
                <span>
                  Set {index + 1}
                </span>

                <strong>
                  {set.a}
                </strong>

                <strong>
                  {set.b}
                </strong>
              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}


MatchResult.propTypes = {
  match:
    PropTypes.object.isRequired,

  result:
    PropTypes.object,

  players:
    PropTypes.array.isRequired,

  onResultSubmitted:
    PropTypes.func,
};