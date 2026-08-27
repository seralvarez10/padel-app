import { supabase } from "../lib/supabase";

export async function getProfileStats(userId) {
    /*
     * ==========================================
     * PARTIDOS DEL JUGADOR
     * ==========================================
     */

    const { data: playerMatches, error: playerError } =
        await supabase
            .from("match_players")
            .select(`
        match_id,
        player_id,
        position,
        status
      `)
            .eq("player_id", userId)
            .neq("status", "LEFT");

    if (playerError) {
        throw playerError;
    }

    if (!playerMatches || playerMatches.length === 0) {
        return {
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
        };
    }


    /*
     * ==========================================
     * RESULTADOS DE ESOS PARTIDOS
     * ==========================================
     */

    const matchIds = playerMatches.map(
        (match) => match.match_id
    );

    const { data: results, error: resultsError } =
        await supabase
            .from("match_results")
            .select(`
        match_id,
        status,
        score
      `)
            .in("match_id", matchIds)
            .in("status", [
                "CONFIRMED",
                "AUTO_CONFIRMED",
            ]);

    if (resultsError) {
        throw resultsError;
    }


    /*
     * ==========================================
     * CALCULAR VICTORIAS Y DERROTAS
     * ==========================================
     */

    let matchesWon = 0;
    let matchesLost = 0;

    results?.forEach((result) => {
        const playerMatch = playerMatches.find(
            (match) =>
                match.match_id === result.match_id
        );

        if (!playerMatch) {
            return;
        }

        const sets = result.score?.sets;

        if (!Array.isArray(sets) || sets.length === 0) {
            return;
        }


        /*
         * Saber a qué pareja pertenece el jugador
         */

        const playerIsTeamA =
            playerMatch.position === "TEAM_A_LEFT" ||
            playerMatch.position === "TEAM_A_RIGHT";

        const playerIsTeamB =
            playerMatch.position === "TEAM_B_LEFT" ||
            playerMatch.position === "TEAM_B_RIGHT";


        /*
         * Contar sets ganados por cada pareja
         */

        let teamAWins = 0;
        let teamBWins = 0;

        sets.forEach((set) => {
            const scoreA = Number(set.a);
            const scoreB = Number(set.b);

            if (
                Number.isNaN(scoreA) ||
                Number.isNaN(scoreB)
            ) {
                return;
            }

            if (scoreA > scoreB) {
                teamAWins++;
            }

            if (scoreB > scoreA) {
                teamBWins++;
            }
        });


        /*
         * Determinar ganador del partido
         */

        if (
            playerIsTeamA &&
            teamAWins > teamBWins
        ) {
            matchesWon++;
        } else if (
            playerIsTeamB &&
            teamBWins > teamAWins
        ) {
            matchesWon++;
        } else if (
            (playerIsTeamA &&
                teamBWins > teamAWins) ||
            (playerIsTeamB &&
                teamAWins > teamBWins)
        ) {
            matchesLost++;
        }
    });


    /*
     * ==========================================
     * ESTADÍSTICAS FINALES
     * ==========================================
     */

    return {
        matchesPlayed: matchesWon + matchesLost,
        matchesWon,
        matchesLost,
    };
}