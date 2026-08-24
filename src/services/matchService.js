import { supabase } from "../lib/supabase";

import {
  sendSystemMessage,
  markMessagesAsReadAt,
} from "./chatService";

export const MATCH_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
};

export async function createMatch(matchData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  // Crear el partido
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .insert({
      creator_id: user.id,
      title: matchData.title,
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      location: matchData.location,
      city: matchData.city,
      level_min: matchData.level_min,
      level_max: matchData.level_max,
      max_players: 4,
      status: MATCH_STATUS.PENDING,
      match_type: matchData.match_type,
      court_type: matchData.court_type,
      duration: matchData.duration,
      description: matchData.description,
    })
    .select()
    .single();

  if (matchError) throw matchError;

  // Añadir automáticamente al creador como primer jugador
  const organizerPosition =
    matchData.position === "ANY"
      ? null
      : matchData.position;

  const { error: playerError } = await supabase
    .from("match_players")
    .insert({
      match_id: match.id,
      player_id: user.id,
      role: "CREATOR",
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
      position: organizerPosition,
    });
  if (playerError) {
    throw playerError;
  }

  return match;
}

export async function updateMatch(matchId, matchData) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }
  // Comprobar que el usuario es el organizador
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("creator_id")
    .eq("id", matchId)
    .single();

  if (matchError) throw matchError;

  if (match.creator_id !== user.id) {
    throw new Error("No tienes permisos para editar este partido.");
  }

  const { data, error } = await supabase
    .from("matches")
    .update({
      title: matchData.title,
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      location: matchData.location,
      city: matchData.city,
      level_min: matchData.level_min,
      level_max: matchData.level_max,
      match_type: matchData.match_type,
      court_type: matchData.court_type,
      duration: matchData.duration,
      description: matchData.description,
    })
    .eq("id", matchId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      match_players (
        id,
        player_id,
        status
      )
    `)
    .order("match_date", { ascending: true });

  if (error) throw error;

  const now = new Date();

  return data
    .filter((match) => {
      // Los partidos finalizados o cancelados
      // no deben aparecer en Home ni Explorar.
      if (
        match.status === "FINISHED" ||
        match.status === "CANCELLED"
      ) {
        return false;
      }

      // Construimos la fecha y hora exactas del partido.
      const matchDateTime = new Date(
        `${match.match_date}T${match.match_time}`
      );

      // Si la fecha/hora ya ha pasado, no aparece.
      return matchDateTime > now;
    })
    .map((match) => {
      // Solo contamos jugadores activos
      const activePlayers = match.match_players.filter(
        (player) => player.status !== "LEFT"
      );

      // Estado visual del partido
      let visualStatus = "open";

      if (activePlayers.length >= match.max_players) {
        visualStatus = "full";
      } else if (
        activePlayers.length === match.max_players - 1
      ) {
        visualStatus = "almost_full";
      }

      return {
        ...match,

        match_players: activePlayers,

        occupied_slots: activePlayers.length,

        creatorId: match.creator_id,

        joinedPlayerIds: activePlayers.map(
          (player) => player.player_id
        ),

        match_time: match.match_time?.slice(0, 5),

        // Estado visual para Home y Explorar
        status: visualStatus,
      };
    });
}

export async function getMatchById(id) {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      profiles!matches_creator_id_fkey(
  id,
  display_name,
  first_name,
  last_name,
  avatar_url,
  level_current
),
      match_players(
        id
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    currentPlayers: data.match_players.length,
  };
}

export async function getMatchPlayers(matchId) {
  const { data, error } = await supabase
    .from("match_players")
    .select(`
      id,
      role,
      status,
      confirmed_at,
      player_id,
      position,
      profiles(
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        level_current
      )
    `)
    .eq("match_id", matchId);

  if (error) throw error;

  return data;
}

export async function joinMatch(
  matchId,
  position
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Debes iniciar sesión"
    );
  }

  if (!position) {
    throw new Error(
      "Debes seleccionar una posición"
    );
  }

  const validPositions = [
    "TEAM_A_LEFT",
    "TEAM_A_RIGHT",
    "TEAM_B_LEFT",
    "TEAM_B_RIGHT",
  ];

  if (!validPositions.includes(position)) {
    throw new Error(
      "Posición no válida"
    );
  }

  // Comprobar si el jugador ya existe
  const {
    data: existingPlayer,
    error: existingError,
  } = await supabase
    .from("match_players")
    .select("id, status")
    .eq("match_id", matchId)
    .eq("player_id", user.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingPlayer) {
    if (
      existingPlayer.status !== "LEFT"
    ) {
      throw new Error(
        "Ya estás apuntado a este partido"
      );
    }

    const { error } = await supabase
      .from("match_players")
      .update({
        status: "JOINED",
        confirmed_at: null,
        position,
      })
      .eq("id", existingPlayer.id);

    if (error) throw error;

  } else {
    const { error } = await supabase
      .from("match_players")
      .insert({
        match_id: matchId,
        player_id: user.id,
        role: "PLAYER",
        status: "JOINED",
        position,
      });

    if (error) throw error;
  }

  // Mensaje de sistema
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  const {
    data: systemMessage,
    error: messageError,
  } = await supabase
    .from("match_messages")
    .insert({
      match_id: matchId,
      sender_id: null,
      message: `🟢 ${profile.display_name ||
        "Un jugador"
        } se ha unido al partido.`,
    })
    .select()
    .single();

  if (messageError) {
    throw messageError;
  }

  return systemMessage;
}

export async function leaveMatch(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const { error } = await supabase
    .from("match_players")
    .delete()
    .eq("match_id", matchId)
    .eq("player_id", user.id);

  if (error) throw error;

  return true;
}
export async function isUserInMatch(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("match_players")
    .select("id")
    .eq("match_id", matchId)
    .eq("player_id", user.id)
    .maybeSingle();

  return !!data;
}
export async function getMyMatches() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const { data, error } = await supabase
    .from("match_players")
    .select(`
      match_id,
      status,
      matches (
        *,
        match_players (
  id,
  player_id,
  status,
  position
)
      )
    `)
    .eq("player_id", user.id)
    .in("status", ["JOINED", "CONFIRMED", "AT_RISK"]);

  if (error) throw error;

  return data.map((item) => {
    const activePlayers = item.matches.match_players.filter(
      (player) => player.status !== "LEFT"
    );

    return {
      ...item.matches,

      match_players: activePlayers,

      occupied_slots: activePlayers.length,

      // Estado del partido
      status: item.matches.status.toLowerCase(),

      // Estado del usuario
      playerStatus: item.status,

      match_time: item.matches.match_time?.slice(0, 5),
    };
  });
}
export async function deleteMatch(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  // Comprobar que es el organizador
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("creator_id")
    .eq("id", matchId)
    .single();

  if (matchError) throw matchError;

  if (match.creator_id !== user.id) {
    throw new Error("No tienes permisos para eliminar este partido.");
  }

  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId);

  if (error) throw error;

  return true;
}
export async function getMatchResult(matchId) {
  const { data, error } = await supabase
    .from("match_results")
    .select("*")
    .eq("match_id", matchId)
    .maybeSingle();

  if (error) throw error;

  return data;
}