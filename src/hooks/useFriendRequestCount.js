import { useCallback, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

export default function useFriendRequestsCount() {
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCount(0);
        return;
      }

      const { count: total, error } = await supabase
        .from("friendships")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("receiver_id", user.id)
        .eq("status", "PENDING");

      if (error) {
        console.error(
          "Error cargando solicitudes:",
          error
        );

        return;
      }

      setCount(total || 0);
    } catch (error) {
      console.error(
        "Error cargando contador de amigos:",
        error
      );
    }
  }, []);

  useEffect(() => {
    loadCount();

    // Permite actualizar el contador
    // cuando cambia una solicitud desde
    // cualquier parte de la aplicación.
    function handleFriendshipsUpdated() {
      loadCount();
    }

    window.addEventListener(
      "friendships-updated",
      handleFriendshipsUpdated
    );

    return () => {
      window.removeEventListener(
        "friendships-updated",
        handleFriendshipsUpdated
      );
    };
  }, [loadCount]);

  return {
    count,
    reload: loadCount,
  };
}