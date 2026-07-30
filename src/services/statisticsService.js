import { supabase } from "../lib/supabase";

export async function getProfileStats(userId) {
    const [
        { count: matchesPlayed, error: playedError },
        { count: matchesCreated, error: createdError },
    ] = await Promise.all([
        supabase
            .from("match_players")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("player_id", userId),

        supabase
            .from("matches")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("creator_id", userId),
    ]);

    if (playedError) throw playedError;
    if (createdError) throw createdError;

    return {
        matchesPlayed: matchesPlayed ?? 0,
        organized: matchesCreated ?? 0,
        attendance: null,
    };
}