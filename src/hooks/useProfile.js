import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { getProfile } from "../services/profileService";
import { getProfileStats } from "../services/statisticsService";

import {
  getFriendsCount,
  getMutualFriendsCount,
} from "../services/friendshipService";

export default function useProfile(profileId = null) {
  const { user } = useAuth();

  const targetUserId = profileId || user?.id;
  const isOwnProfile = !profileId;

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    matchesPlayed: 0,
    matchesCreated: 0,
    attendance: null,
  });

  const [friendsCount, setFriendsCount] = useState(0);
  const [mutualFriendsCount, setMutualFriendsCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      if (!targetUserId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [
          profileData,
          statsData,
          friendsCountData,
          mutualFriendsCountData,
        ] = await Promise.all([
          getProfile(targetUserId),
          getProfileStats(targetUserId),
          getFriendsCount(targetUserId),
          isOwnProfile
            ? Promise.resolve(0)
            : getMutualFriendsCount(user.id, targetUserId),
        ]);

        setProfile(profileData);
        setStats(statsData);
        setFriendsCount(friendsCountData);
        setMutualFriendsCount(mutualFriendsCountData);
      } catch (error) {
        console.error("Error cargando perfil:", error);

        setProfile(null);
        setFriendsCount(0);
        setMutualFriendsCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [targetUserId, user?.id, isOwnProfile]);

  return {
    profile,
    stats,
    friendsCount,
    mutualFriendsCount,
    loading,
  };
}