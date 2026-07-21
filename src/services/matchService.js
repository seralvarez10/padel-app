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

  // 1. Crear el partido
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

  // 2. Añadir automáticamente al creador
  const { error: playerError } = await supabase
    .from("match_players")
    .insert({
      match_id: match.id,
      player_id: user.id,
      role: "CREATOR",
    });

  if (playerError) throw playerError;

  return match;
}
export async function getMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true });

  if (error) throw error;

  return data.map((match) => ({
    id: match.id,

    title: match.title || "Partido de pádel",

    location: match.location,

    date: match.match_date,

    time: match.match_time?.slice(0, 5),

    level: Number(match.level_min ?? 0),

    currentPlayers: match.occupied_slots ?? 0,

    maxPlayers: match.max_players ?? 4,

    status: (match.status || "pending").toLowerCase(),

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
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
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

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("occupied_slots,max_players")
    .eq("id", matchId)
    .single();

  if (matchError) throw matchError;

  if (match.occupied_slots >= match.max_players) {
    throw new Error("El partido está completo");
  }

  const { data: existing } = await supabase
    .from("match_players")
    .select("id")
    .eq("match_id", matchId)
    .eq("player_id", user.id)
    .maybeSingle();

  if (existing) {
    throw new Error("Ya estás apuntado");
  }

  const { error } = await supabase
    .from("match_players")
    .insert({
      match_id: matchId,
      player_id: user.id,
    });

  if (error) throw error;

  await supabase
    .from("matches")
    .update({
      occupied_slots: match.occupied_slots + 1,
    })
    .eq("id", matchId);

  return true;
}