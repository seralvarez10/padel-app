import { supabase } from "../lib/supabase";
import {
  sendSystemMessage,
  markMessagesAsReadAt,
} from "./chatService";

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

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", playerId)
      .single();

  if (profileError) throw profileError;

  const systemMessage = await sendSystemMessage(
    matchId,
    `✅ ${profile.display_name || "Un jugador"
    } ha confirmado su asistencia.`
  );

  await markMessagesAsReadAt(
    matchId,
    playerId,
    systemMessage.created_at
  );
}

export async function cancelAttendance(
  matchId,
  playerId
) {
  const { error } = await supabase
    .from("match_players")
    .update({
      status: "LEFT",
      confirmed_at: null,
    })
    .eq("match_id", matchId)
    .eq("player_id", playerId);

  if (error) throw error;

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", playerId)
      .single();

  if (profileError) throw profileError;

  const systemMessage = await sendSystemMessage(
    matchId,
    `🔴 ${profile.display_name || "Un jugador"
    } ha abandonado el partido.`
  );

  await markMessagesAsReadAt(
    matchId,
    playerId,
    systemMessage.created_at
  );
}

export async function updatePlayerPosition(
  matchId,
  playerId,
  position
) {
  const validPositions = [
    "TEAM_A_LEFT",
    "TEAM_A_RIGHT",
    "TEAM_B_LEFT",
    "TEAM_B_RIGHT",
  ];

  if (!validPositions.includes(position)) {
    throw new Error("Posición no válida");
  }

  const { error } = await supabase
    .from("match_players")
    .update({
      position,
    })
    .eq("match_id", matchId)
    .eq("player_id", playerId);

  if (error) throw error;
}

export async function swapPlayerPositions(
  matchId,
  playerId,
  targetPlayerId
) {
  if (!matchId || !playerId || !targetPlayerId) {
    throw new Error(
      "Datos insuficientes para intercambiar posiciones."
    );
  }

  if (playerId === targetPlayerId) {
    throw new Error(
      "No puedes intercambiar tu posición contigo mismo."
    );
  }

  const { error } = await supabase.rpc(
    "swap_match_player_positions",
    {
      p_match_id: matchId,
      p_player_id: playerId,
      p_target_player_id: targetPlayerId,
    }
  );

  if (error) {
    console.error(
      "Error al intercambiar posiciones:",
      error
    );

    throw error;
  }

  return true;
}