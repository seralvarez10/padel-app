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

  return await supabase.from("matches").insert([
    {
      creator_id: user.id,
      title: "Partido de pádel",
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      location: matchData.location,
      city: matchData.city,
      level_min: matchData.level_min,
      level_max: matchData.level_max,
      occupied_slots: matchData.occupied_slots,
      max_players: 4,
      status: MATCH_STATUS.PENDING,
    },
  ]);
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