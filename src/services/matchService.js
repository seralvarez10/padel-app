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
        ),
        match_results (
          id,
          status,
          submitted_by,
          score,
          response_deadline,
          confirmed_by,
          confirmed_at
        )
      )
    `)
    .eq("player_id", user.id)
    .in("status", ["JOINED", "CONFIRMED", "AT_RISK"]);

  if (error) throw error;

  return data.map((item) => {

    const activePlayers =
      item.matches.match_players.filter(
        (player) => player.status !== "LEFT"
      );

    return {
      ...item.matches,

      match_players: activePlayers,

      occupied_slots: activePlayers.length,

      match_result:
        Array.isArray(item.matches.match_results)
          ? item.matches.match_results[0] || null
          : item.matches.match_results || null,

      currentUserId: user.id,

      status: item.matches.status.toLowerCase(),

      playerStatus: item.status,

      match_time:
        item.matches.match_time?.slice(0, 5),
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
export async function submitMatchResult(matchId, score) {
  const { data, error } = await supabase.rpc(
    "submit_match_result",
    {
      p_match_id: matchId,
      p_score: score,
    }
  );

  if (error) {
    console.error(
      "Error al publicar resultado:",
      error
    );

    throw error;
  }

  return data;
}
export async function confirmMatchResult(matchId) {
  const { data, error } = await supabase.rpc(
    "confirm_match_result",
    {
      p_match_id: matchId,
    }
  );

  if (error) {
    console.error(
      "Error al confirmar resultado:",
      error
    );

    throw error;
  }

  return data;
}

export async function rejectMatchResult(matchId) {
  const { data, error } = await supabase.rpc(
    "reject_match_result",
    {
      p_match_id: matchId,
    }
  );

  if (error) {
    console.error(
      "Error al rechazar resultado:",
      error
    );

    throw error;
  }

  return data;
}
export async function sendFriendRequest(receiverId) {
  const { data, error } = await supabase.rpc(
    "send_friend_request",
    {
      p_receiver_id: receiverId,
    }
  );

  if (error) {
    console.error(
      "Error al enviar solicitud de amistad:",
      error
    );

    throw error;
  }

  return data;
}

export async function acceptFriendRequest(
  friendshipId
) {
  const { data, error } = await supabase.rpc(
    "accept_friend_request",
    {
      p_friendship_id: friendshipId,
    }
  );

  if (error) {
    console.error(
      "Error al aceptar solicitud:",
      error
    );

    throw error;
  }

  return data;
}

export async function rejectFriendRequest(
  friendshipId
) {
  const { data, error } = await supabase.rpc(
    "reject_friend_request",
    {
      p_friendship_id: friendshipId,
    }
  );

  if (error) {
    console.error(
      "Error al rechazar solicitud:",
      error
    );

    throw error;
  }

  return data;
}
export async function getFriends() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  // Obtener amistades aceptadas
  const { data: friendships, error: friendshipsError } =
    await supabase
      .from("friendships")
      .select(`
        id,
        requester_id,
        receiver_id,
        status,
        created_at
      `)
      .eq("status", "ACCEPTED")
      .or(
        `requester_id.eq.${user.id},receiver_id.eq.${user.id}`
      );

  if (friendshipsError) {
    console.error(
      "Error al obtener amistades:",
      friendshipsError
    );

    throw friendshipsError;
  }

  if (!friendships || friendships.length === 0) {
    return [];
  }

  // Obtener el ID del amigo en cada amistad
  const friendIds = friendships.map((friendship) =>
    friendship.requester_id === user.id
      ? friendship.receiver_id
      : friendship.requester_id
  );

  // Obtener perfiles
  const { data: profiles, error: profilesError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        level_current,
        trust_score
      `)
      .in("id", friendIds);

  if (profilesError) {
    console.error(
      "Error al obtener perfiles de amigos:",
      profilesError
    );

    throw profilesError;
  }

  // Combinar amistad + perfil
  return friendships.map((friendship) => {
    const friendId =
      friendship.requester_id === user.id
        ? friendship.receiver_id
        : friendship.requester_id;

    const profile = profiles.find(
      (profile) => profile.id === friendId
    );

    return {
      ...friendship,
      friend_id: friendId,
      profile: profile || null,
    };
  });
}

export async function getPendingFriendRequests() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const { data: requests, error: requestsError } =
    await supabase
      .from("friendships")
      .select(`
        id,
        requester_id,
        receiver_id,
        status,
        created_at
      `)
      .eq("receiver_id", user.id)
      .eq("status", "PENDING");

  if (requestsError) {
    console.error(
      "Error al obtener solicitudes:",
      requestsError
    );

    throw requestsError;
  }

  if (!requests || requests.length === 0) {
    return [];
  }

  const requesterIds = requests.map(
    (request) => request.requester_id
  );

  const { data: profiles, error: profilesError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        level_current,
        trust_score
      `)
      .in("id", requesterIds);

  if (profilesError) {
    console.error(
      "Error al obtener perfiles:",
      profilesError
    );

    throw profilesError;
  }

  return requests.map((request) => ({
    ...request,
    profile:
      profiles.find(
        (profile) =>
          profile.id === request.requester_id
      ) || null,
  }));
}
export async function searchPlayers(searchTerm) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const term = searchTerm?.trim();

  if (!term) {
    return [];
  }

  // 1. Buscar jugadores
  const { data: players, error: playersError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        level_current,
        trust_score
      `)
      .neq("id", user.id)
      .or(
        `display_name.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%`
      )
      .limit(20);

  if (playersError) {
    console.error(
      "Error buscando jugadores:",
      playersError
    );

    throw playersError;
  }

  if (!players || players.length === 0) {
    return [];
  }

  // 2. Obtener las relaciones de amistad del usuario actual
  const { data: friendships, error: friendshipsError } =
    await supabase
      .from("friendships")
      .select(`
        id,
        requester_id,
        receiver_id,
        status
      `)
      .or(
        `requester_id.eq.${user.id},receiver_id.eq.${user.id}`
      )
      .in("status", ["PENDING", "ACCEPTED"]);

  if (friendshipsError) {
    console.error(
      "Error obteniendo relaciones de amistad:",
      friendshipsError
    );

    throw friendshipsError;
  }

  // 3. Añadir el estado de amistad a cada jugador
  return players.map((player) => {
    const friendship = friendships?.find((item) => {
      const otherUserId =
        item.requester_id === user.id
          ? item.receiver_id
          : item.requester_id;

      return otherUserId === player.id;
    });

    if (!friendship) {
      return {
        ...player,
        friendshipStatus: "NONE",
        friendshipId: null,
      };
    }

    // Ya son amigos
    if (friendship.status === "ACCEPTED") {
      return {
        ...player,
        friendshipStatus: "FRIENDS",
        friendshipId: friendship.id,
      };
    }

    // Solicitud enviada por mí
    if (
      friendship.status === "PENDING" &&
      friendship.requester_id === user.id
    ) {
      return {
        ...player,
        friendshipStatus: "PENDING_SENT",
        friendshipId: friendship.id,
      };
    }

    // Solicitud recibida
    return {
      ...player,
      friendshipStatus: "PENDING_RECEIVED",
      friendshipId: friendship.id,
    };
  });
}