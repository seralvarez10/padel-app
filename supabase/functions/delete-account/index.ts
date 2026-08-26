import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // ================================
  // CORS
  // ================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Método no permitido",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // ================================
    // 1. Variables de entorno
    // ================================

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL no configurada");
    }

    if (!supabaseAnonKey) {
      throw new Error("SUPABASE_ANON_KEY no configurada");
    }

    if (!serviceRoleKey) {
      throw new Error("SERVICE_ROLE_KEY no configurada");
    }

    // ================================
    // 2. Comprobar sesión
    // ================================

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "No autenticado",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUser = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Sesión no válida",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userId = user.id;

    // ================================
    // 3. Cliente administrativo
    // ================================

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    // ================================
    // 4. Buscar partidos creados
    // ================================

    const {
      data: createdMatches,
      error: createdMatchesError,
    } = await supabaseAdmin
      .from("matches")
      .select("id")
      .eq("creator_id", userId);

    if (createdMatchesError) {
      throw createdMatchesError;
    }

    const matchIds =
      createdMatches?.map((match) => match.id) || [];

    // ================================
    // 5. Eliminar amistades
    // ================================

    const { error: friendshipsError } =
      await supabaseAdmin
        .from("friendships")
        .delete()
        .or(
          `requester_id.eq.${userId},receiver_id.eq.${userId}`
        );

    if (friendshipsError) {
      throw friendshipsError;
    }

    // ================================
    // 6. Eliminar lecturas de mensajes
    // ================================

    const { error: userReadsError } =
      await supabaseAdmin
        .from("match_message_reads")
        .delete()
        .eq("user_id", userId);

    if (userReadsError) {
      throw userReadsError;
    }

    if (matchIds.length > 0) {
      const { error: matchReadsError } =
        await supabaseAdmin
          .from("match_message_reads")
          .delete()
          .in("match_id", matchIds);

      if (matchReadsError) {
        throw matchReadsError;
      }
    }

    // ================================
    // 7. Eliminar confirmaciones
    // ================================

    const { error: confirmationsByUserError } =
      await supabaseAdmin
        .from("match_result_confirmations")
        .delete()
        .eq("user_id", userId);

    if (confirmationsByUserError) {
      throw confirmationsByUserError;
    }

    if (matchIds.length > 0) {
      const { error: matchConfirmationsError } =
        await supabaseAdmin
          .from("match_result_confirmations")
          .delete()
          .in("match_id", matchIds);

      if (matchConfirmationsError) {
        throw matchConfirmationsError;
      }
    }

    // ================================
    // 8. Eliminar resultados
    // ================================

    // Resultados enviados por el usuario
    const { error: submittedResultsError } =
      await supabaseAdmin
        .from("match_results")
        .delete()
        .eq("submitted_by", userId);

    if (submittedResultsError) {
      throw submittedResultsError;
    }

    // Resultados donde el usuario confirmó
    const { error: confirmedResultsError } =
      await supabaseAdmin
        .from("match_results")
        .delete()
        .eq("confirmed_by", userId);

    if (confirmedResultsError) {
      throw confirmedResultsError;
    }

    // Resultados donde el usuario rechazó
    const { error: rejectedResultsError } =
      await supabaseAdmin
        .from("match_results")
        .delete()
        .eq("rejected_by", userId);

    if (rejectedResultsError) {
      throw rejectedResultsError;
    }

    // Resultados de partidos creados por el usuario
    if (matchIds.length > 0) {
      const { error: matchResultsError } =
        await supabaseAdmin
          .from("match_results")
          .delete()
          .in("match_id", matchIds);

      if (matchResultsError) {
        throw matchResultsError;
      }
    }

    // ================================
    // 9. Eliminar mensajes
    // ================================

    const { error: userMessagesError } =
      await supabaseAdmin
        .from("match_messages")
        .delete()
        .eq("sender_id", userId);

    if (userMessagesError) {
      throw userMessagesError;
    }

    if (matchIds.length > 0) {
      const { error: matchMessagesError } =
        await supabaseAdmin
          .from("match_messages")
          .delete()
          .in("match_id", matchIds);

      if (matchMessagesError) {
        throw matchMessagesError;
      }
    }

    // ================================
    // 10. Eliminar participaciones
    // ================================

    const { error: userPlayersError } =
      await supabaseAdmin
        .from("match_players")
        .delete()
        .eq("player_id", userId);

    if (userPlayersError) {
      throw userPlayersError;
    }

    if (matchIds.length > 0) {
      const { error: matchPlayersError } =
        await supabaseAdmin
          .from("match_players")
          .delete()
          .in("match_id", matchIds);

      if (matchPlayersError) {
        throw matchPlayersError;
      }
    }

    // ================================
    // 11. Eliminar partidos creados
    // ================================

    if (matchIds.length > 0) {
      const { error: matchesDeleteError } =
        await supabaseAdmin
          .from("matches")
          .delete()
          .in("id", matchIds);

      if (matchesDeleteError) {
        throw matchesDeleteError;
      }
    }

    // ================================
    // 12. Eliminar avatar(s)
    // ================================

    const {
      data: avatarFiles,
      error: avatarListError,
    } = await supabaseAdmin.storage
      .from("avatars")
      .list(userId, {
        limit: 100,
      });

    if (avatarListError) {
      throw avatarListError;
    }

    if (avatarFiles && avatarFiles.length > 0) {
      const avatarPaths = avatarFiles
        .filter((file) => file.id !== null)
        .map((file) => `${userId}/${file.name}`);

      if (avatarPaths.length > 0) {
        const { error: avatarDeleteError } =
          await supabaseAdmin.storage
            .from("avatars")
            .remove(avatarPaths);

        if (avatarDeleteError) {
          throw avatarDeleteError;
        }
      }
    }

    // ================================
    // 13. Eliminar perfil
    // ================================

    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (profileError) {
      throw profileError;
    }

    // ================================
    // 14. Eliminar usuario Auth
    // ================================

    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

    if (authDeleteError) {
      throw authDeleteError;
    }

    // ================================
    // 15. Éxito
    // ================================

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error(
      "Error eliminando cuenta:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error eliminando cuenta",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});