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
      role: "PLAYER",
    });
  console.log("MATCH", match);
  if (playerError) {
    alert(JSON.stringify(playerError, null, 2));
    throw playerError;
  }

  if (playerError) throw playerError;

  return match;
}

export async function getMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      match_players (
        id
      )
    `)
    .order("match_date", { ascending: true });

  if (error) throw error;

  return data.map((match) => ({
    id: match.id,
    title: match.title || "Partido de pádel",
    location: match.location,
    date: match.match_date,
    time: match.match_time?.slice(0, 5),
    level: Number(match.level_min ?? 0),
    currentPlayers: match.match_players.length,
    maxPlayers: match.max_players ?? 4,
    status: (match.status || "PENDING").toLowerCase(),
    type: match.match_type || "Libre",
    court: match.court_type || "Indoor",
    duration: match.duration
      ? `${match.duration} min`
      : "90 min",
    distance: match.city || "",
  }));
}

export async function getMatchById(id) {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      match_players (
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
      player_id,
      profiles(
        id,
        username,
        full_name,
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

  // Comprobar si ya está apuntado
  const { data: existing } = await supabase
    .from("match_players")
    .select("id")
    .eq("match_id", matchId)
    .eq("player_id", user.id)
    .maybeSingle();

  if (existing) {
    throw new Error("Ya estás apuntado");
  }

  // Contar jugadores actuales
  const { count, error: countError } = await supabase
    .from("match_players")
    .select("*", { count: "exact", head: true })
    .eq("match_id", matchId);

  if (countError) throw countError;

  if (count >= match.max_players) {
    throw new Error("El partido está completo");
  }

  // Añadir jugador
  const { error } = await supabase
    .from("match_players")
    .insert({
      match_id: matchId,
      player_id: user.id,
      role: "PLAYER",
    });

  if (error) throw error;

  return true;
}