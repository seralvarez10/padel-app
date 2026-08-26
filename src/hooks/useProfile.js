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
    organized: 0,
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
        // Primero obtenemos el perfil
        const profileData = await getProfile(targetUserId);

        /*
         * Si estamos viendo el perfil de otra persona
         * y esa persona lo tiene oculto, no mostramos nada.
         */
        if (
          !isOwnProfile &&
          profileData.profile_visible === false
        ) {
          setProfile(null);
          setStats({
            matchesPlayed: 0,
            organized: 0,
            attendance: null,
          });
          setFriendsCount(0);
          setMutualFriendsCount(0);

          return;
        }

        /*
         * El propio usuario siempre puede ver
         * toda su información.
         *
         * Para otro usuario, solo cargamos estadísticas
         * y red si están permitidas.
         */
        const shouldShowStats =
          isOwnProfile ||
          profileData.show_stats !== false;

        const shouldShowNetwork =
          isOwnProfile ||
          profileData.show_network !== false;

        const [
          statsData,
          friendsCountData,
          mutualFriendsCountData,
        ] = await Promise.all([
          shouldShowStats
            ? getProfileStats(targetUserId)
            : Promise.resolve({
              matchesPlayed: 0,
              organized: 0,
              attendance: null,
            }),

          shouldShowNetwork
            ? getFriendsCount(targetUserId)
            : Promise.resolve(0),

          shouldShowNetwork && !isOwnProfile
            ? getMutualFriendsCount(
              user.id,
              targetUserId
            )
            : Promise.resolve(0),
        ]);

        setProfile(profileData);
        setStats(statsData);
        setFriendsCount(friendsCountData);
        setMutualFriendsCount(mutualFriendsCountData);

      } catch (error) {
        console.error(
          "Error cargando perfil:",
          error
        );

        setProfile(null);
        setFriendsCount(0);
        setMutualFriendsCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [
    targetUserId,
    user?.id,
    isOwnProfile,
  ]);

  return {
    profile,
    stats,
    friendsCount,
    mutualFriendsCount,
    loading,
  };
}