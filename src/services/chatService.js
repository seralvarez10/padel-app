import { supabase } from "../lib/supabase";

export async function getMessages(matchId) {
  const { data, error } = await supabase
    .from("match_messages")
    .select(`
      id,
      message,
      created_at,
      profiles:sender_id (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

export async function sendMessage(matchId, message) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const { error } = await supabase
    .from("match_messages")
    .insert({
      match_id: matchId,
      sender_id: user.id,
      message,
    });

  if (error) throw error;
}