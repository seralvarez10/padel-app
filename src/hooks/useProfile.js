import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { getProfile } from "../services/profileService";
import { getProfileStats } from "../services/statisticsService";

export default function useProfile() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        matchesPlayed: 0,
        matchesCreated: 0,
        attendance: null,
    });

    useEffect(() => {
        async function loadProfile() {
            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                const [profileData, statsData] = await Promise.all([
                    getProfile(user.id),
                    getProfileStats(user.id),
                ]);

                setProfile(profileData);
                setStats(statsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user]);

    return {
        profile,
        stats,
        loading,
    };
}