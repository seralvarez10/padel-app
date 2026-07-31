import { supabase } from "../lib/supabase";

export async function confirmAttendance(matchId, playerId) {
  const { error } = await supabase
    .from("match_players")
    .update({
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
    })
    .eq("match_id", matchId)
    .eq("player_id", playerId);

  if (error) throw error;
}

export async function cancelAttendance(matchId, playerId) {
  const { error } = await supabase
    .from("match_players")
    .update({
      status: "LEFT",
      confirmed_at: null,
    })
    .eq("match_id", matchId)
    .eq("player_id", playerId);

  if (error) throw error;
}