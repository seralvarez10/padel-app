import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import styles from "./MatchResultForm.module.css";

const INITIAL_SETS = [
  { a: "", b: "" },
  { a: "", b: "" },
];

export default function MatchResultForm({
  teamA,
  teamB,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [sets, setSets] = useState(INITIAL_SETS);

  function updateSet(index, team, value) {
    setSets((prev) =>
      prev.map((set, setIndex) =>
        setIndex === index
          ? {
              ...set,
              [team]: value,
            }
          : set
      )
    );
  }

  /*
   * Convertimos los sets actuales a números.
   * Los campos vacíos se mantienen como NaN.
   */
  const parsedSets = useMemo(() => {
    return sets.map((set) => ({
      a: Number(set.a),
      b: Number(set.b),
    }));
  }, [sets]);

  /*
   * Número de sets ganados por cada pareja.
   */
  const winsA = parsedSets.filter(
    (set) =>
      Number.isInteger(set.a) &&
      Number.isInteger(set.b) &&
      set.a > set.b
  ).length;

  const winsB = parsedSets.filter(
    (set) =>
      Number.isInteger(set.a) &&
      Number.isInteger(set.b) &&
      set.b > set.a
  ).length;

  /*
   * Si los dos primeros sets ya determinan
   * un 2-0, no se puede añadir un tercer set.
   */
  const firstTwoComplete =
    sets.length >= 2 &&
    parsedSets
      .slice(0, 2)
      .every(
        (set) =>
          Number.isInteger(set.a) &&
          Number.isInteger(set.b)
      );

  const firstTwoWinner =
    firstTwoComplete &&
    (
      (
        parsedSets[0].a > parsedSets[0].b &&
        parsedSets[1].a > parsedSets[1].b
      ) ||
      (
        parsedSets[0].b > parsedSets[0].a &&
        parsedSets[1].b > parsedSets[1].a
      )
    );

  const isTwoZero =
    firstTwoWinner;

  /*
   * Si ya hay 3 sets pero los dos primeros
   * han terminado 2-0, el resultado es inválido.
   */
  const invalidThirdSet =
    sets.length === 3 && isTwoZero;

  function addSet() {
    /*
     * Nunca permitimos un tercer set si
     * los dos primeros ya han terminado 2-0.
     */
    if (sets.length >= 3 || isTwoZero) {
      return;
    }

    setSets((prev) => [
      ...prev,
      { a: "", b: "" },
    ]);
  }

  function removeSet(index) {
    if (sets.length <= 2) {
      return;
    }

    setSets((prev) =>
      prev.filter(
        (_, setIndex) => setIndex !== index
      )
    );
  }

  function validateSets() {
    const parsedSets = sets.map((set) => ({
      a: Number(set.a),
      b: Number(set.b),
    }));

    /*
     * Comprobar que todos los marcadores
     * están completos.
     */
    for (const set of parsedSets) {
      if (
        !Number.isInteger(set.a) ||
        !Number.isInteger(set.b)
      ) {
        return "Completa todos los marcadores.";
      }

      if (
        set.a < 0 ||
        set.b < 0
      ) {
        return "Los marcadores no pueden ser negativos.";
      }

      if (set.a === set.b) {
        return "Un set no puede terminar en empate.";
      }

      if (
        set.a > 7 ||
        set.b > 7
      ) {
        return "Un set no puede superar los 7 juegos.";
      }
    }

    const winsA = parsedSets.filter(
      (set) => set.a > set.b
    ).length;

    const winsB = parsedSets.filter(
      (set) => set.b > set.a
    ).length;

    /*
     * Un partido debe terminar 2-0 o 2-1.
     */
    if (
      !(
        (winsA === 2 && winsB <= 1) ||
        (winsB === 2 && winsA <= 1)
      )
    ) {
      return "El resultado debe terminar 2-0 o 2-1.";
    }

    /*
     * Si alguien gana los dos primeros sets,
     * el partido terminó 2-0.
     */
    if (
      sets.length === 3 &&
      (
        (
          parsedSets[0].a > parsedSets[0].b &&
          parsedSets[1].a > parsedSets[1].b
        ) ||
        (
          parsedSets[0].b > parsedSets[0].a &&
          parsedSets[1].b > parsedSets[1].a
        )
      )
    ) {
      return "Un partido 2-0 no necesita un tercer set.";
    }

    /*
     * Si el resultado es 2-1,
     * deben existir exactamente 3 sets.
     */
    if (
      (winsA === 2 || winsB === 2) &&
      parsedSets.length !== 3
    ) {
      return "Un resultado 2-1 necesita tres sets.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateSets();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const cleanSets = sets.map((set) => ({
      a: Number(set.a),
      b: Number(set.b),
    }));

    await onSubmit({
      sets: cleanSets,
    });
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <h2>🏆 Publicar resultado</h2>

            <p>
              Introduce el resultado final del partido.
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

        {/* EQUIPOS */}

        <div className={styles.teams}>

          <div className={styles.team}>
            <span className={styles.teamTitle}>
              PAREJA A
            </span>

            {teamA.map((player) => (
              <span
                key={player.player_id}
                className={styles.player}
              >
                {player.profiles?.display_name ||
                  "Jugador"}
              </span>
            ))}
          </div>

          <span className={styles.vs}>
            VS
          </span>

          <div className={styles.team}>
            <span className={styles.teamTitle}>
              PAREJA B
            </span>

            {teamB.map((player) => (
              <span
                key={player.player_id}
                className={styles.player}
              >
                {player.profiles?.display_name ||
                  "Jugador"}
              </span>
            ))}
          </div>

        </div>

        {/* SETS */}

        <div className={styles.sets}>

          <div className={styles.setHeader}>
            <span>Set</span>
            <span>Pareja A</span>
            <span></span>
            <span>Pareja B</span>
            <span></span>
          </div>

          {sets.map((set, index) => (
            <div
              key={index}
              className={styles.setRow}
            >

              <span className={styles.setNumber}>
                {index + 1}
              </span>

              <input
                type="number"
                min="0"
                max="7"
                value={set.a}
                onChange={(e) =>
                  updateSet(
                    index,
                    "a",
                    e.target.value
                  )
                }
                disabled={loading}
              />

              <span className={styles.separator}>
                -
              </span>

              <input
                type="number"
                min="0"
                max="7"
                value={set.b}
                onChange={(e) =>
                  updateSet(
                    index,
                    "b",
                    e.target.value
                  )
                }
                disabled={loading}
              />

              {sets.length > 2 ? (
                <button
                  type="button"
                  className={styles.removeSet}
                  onClick={() =>
                    removeSet(index)
                  }
                  disabled={loading}
                  aria-label={`Eliminar set ${
                    index + 1
                  }`}
                >
                  ×
                </button>
              ) : (
                <span />
              )}

            </div>
          ))}

        </div>

        {/* TERCER SET */}

        {sets.length < 3 && !isTwoZero && (
          <button
            type="button"
            className={styles.addSet}
            onClick={addSet}
            disabled={loading}
          >
            + Añadir tercer set
          </button>
        )}

        {/* AVISO SI HAY 2-0 + TERCER SET */}

        {invalidThirdSet && (
          <div className={styles.validationError}>
            <strong>Resultado no válido</strong>

            <p>
              El partido ya está decidido 2-0.
              Elimina el tercer set para poder
              publicar el resultado.
            </p>
          </div>
        )}

        {/* AVISO */}

        <div className={styles.notice}>
          <strong>Importante</strong>

          <p>
            El resultado quedará pendiente de
            confirmación por un jugador de la
            pareja rival durante 7 días.
          </p>
        </div>

        {/* BOTONES */}

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
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={
              loading ||
              invalidThirdSet
            }
          >
            {loading
              ? "Publicando..."
              : "Publicar resultado"}
          </button>

        </div>

      </div>
    </div>
  );
}

MatchResultForm.propTypes = {
  teamA: PropTypes.array.isRequired,
  teamB: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};