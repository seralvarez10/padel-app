import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useRealtimeMatches(onChange) {
    useEffect(() => {
        const channel = supabase
            .channel("matches-realtime")

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "match_players",
                },
                (payload) => {
                    onChange();
                }
            )

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "matches",
                },
                (payload) => {
                    onChange();
                }
            )

            .subscribe((status) => {
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [onChange]);
}