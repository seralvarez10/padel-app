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


/**
 * Obtiene el número de mensajes no leídos de un partido.
 */
export async function getUnreadMessageCount(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  // Último momento en el que el usuario leyó el chat
  const { data: readData, error: readError } = await supabase
    .from("match_message_reads")
    .select("last_read_at")
    .eq("match_id", matchId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (readError) throw readError;

  const lastReadAt = readData?.last_read_at;

  let query = supabase
    .from("match_messages")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("match_id", matchId)

    // Contar:
    // - mensajes de otros usuarios
    // - mensajes del sistema (sender_id IS NULL)
    // Pero no los mensajes propios.
    .or(`sender_id.neq.${user.id},sender_id.is.null`);

  // Si existe una última lectura, solamente contamos
  // los mensajes posteriores.
  if (lastReadAt) {
    query = query.gt("created_at", lastReadAt);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count || 0;
}


/**
 * Marca el chat como leído en este momento.
 */
export async function markMessagesAsRead(matchId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await markMessagesAsReadAt(
    matchId,
    user.id,
    new Date().toISOString()
  );
}


/**
 * Marca el chat como leído usando una fecha concreta.
 *
 * Esto es importante cuando un usuario se acaba de unir:
 * queremos que su lectura empiece exactamente desde
 * el momento de incorporación.
 */
export async function markMessagesAsReadAt(
  matchId,
  userId,
  timestamp
) {
  const { error } = await supabase
    .from("match_message_reads")
    .upsert(
      {
        match_id: matchId,
        user_id: userId,
        last_read_at: timestamp,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "match_id,user_id",
      }
    );

  if (error) throw error;
}


/**
 * Crea un mensaje automático del sistema.
 *
 * Devuelve el mensaje creado para poder utilizar
 * exactamente su created_at.
 */
export async function sendSystemMessage(matchId, message) {
  const { data, error } = await supabase
    .from("match_messages")
    .insert({
      match_id: matchId,
      sender_id: null,
      message,
    })
    .select("id, created_at")
    .single();

  if (error) throw error;

  return data;
}