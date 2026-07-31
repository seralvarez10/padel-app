import { supabase } from "../lib/supabase";

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
  const { error: playerError } = await supabase
    .from("match_players")
    .insert({
      match_id: match.id,
      player_id: user.id,
      role: "CREATOR",
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
    })
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
        player_id
      )
    `)
    .order("match_date", { ascending: true });

  if (error) throw error;

  return data.map((match) => {
    return {
      ...match,

      occupied_slots: match.match_players.length,

      creatorId: match.creator_id,

      joinedPlayerIds: match.match_players.map((p) => p.player_id),

      match_time: match.match_time?.slice(0, 5),

      status: (match.status || "PENDING").toLowerCase(),
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

export async function joinMatch(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  // Obtener el partido
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("max_players")
    .eq("id", matchId)
    .single();

  if (matchError) throw matchError;

  // Buscar si ya existe un registro del jugador
  const { data: existing, error: existingError } = await supabase
    .from("match_players")
    .select("id, status")
    .eq("match_id", matchId)
    .eq("player_id", user.id)
    .maybeSingle();

  if (existingError) throw existingError;

  // Si había abandonado, lo reactivamos
  if (existing && existing.status === "LEFT") {
    const { error: updateError } = await supabase
      .from("match_players")
      .update({
        status: "JOINED",
        confirmed_at: null,
      })
      .eq("id", existing.id);

    if (updateError) throw updateError;

    return true;
  }

  // Si ya estaba apuntado con cualquier otro estado
  if (existing) {
    throw new Error("Ya estás apuntado");
  }

  // Contar solo jugadores activos
  const { count, error: countError } = await supabase
    .from("match_players")
    .select("*", { count: "exact", head: true })
    .eq("match_id", matchId)
    .neq("status", "LEFT");

  if (countError) throw countError;

  if (count >= match.max_players) {
    throw new Error("El partido está completo");
  }

  // Añadir jugador nuevo
  const { error } = await supabase
    .from("match_players")
    .insert({
      match_id: matchId,
      player_id: user.id,
      role: "PLAYER",
      status: "JOINED",
      confirmed_at: null,
    });

  if (error) throw error;

  return true;
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
      matches (
        *,
        match_players (
          id,
          player_id
        )
      )
    `)
    .eq("player_id", user.id);

  if (error) throw error;

  return data.map((item) => ({
    ...item.matches,
    occupied_slots: item.matches.match_players.length,
    status: item.matches.status.toLowerCase(),
    match_time: item.matches.match_time?.slice(0, 5),
  }));
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