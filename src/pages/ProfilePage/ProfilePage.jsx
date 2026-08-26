import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileMenu from "../../components/profile/ProfileMenu"; // Asegúrate de importar esto

import styles from "./ProfilePage.module.css";

import useProfile from "../../hooks/useProfile";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const {
    profile,
    stats,
    loading,
    friendsCount,
    mutualFriendsCount,
  } = useProfile(userId);

  const isOwnProfile = !userId;

  if (loading) {
    return null;
  }

  if (!profile) {
    return (
      <>
        <Layout>
          <div className={styles.container}>
            <p>
              Este perfil no está disponible.
            </p>

            {!isOwnProfile && (
              <button
                type="button"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            )}
          </div>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  const showStats =
    isOwnProfile ||
    profile.show_stats !== false;

  const showGameInfo =
    isOwnProfile ||
    profile.show_game_info !== false;

  const showBio =
    isOwnProfile ||
    profile.show_bio !== false;

  return (
    <>
      <Layout>
        <div className={styles.container}>

          <ProfileHeader
            profile={profile}
            friendsCount={friendsCount}
            mutualFriendsCount={mutualFriendsCount}
            isOwnProfile={isOwnProfile}
          />

          {showStats && (
            <ProfileStats stats={stats} />
          )}

          {(showGameInfo || showBio) && (
            <ProfileInfo
              profile={profile}
              showGameInfo={showGameInfo}
              showBio={showBio}
            />
          )}

          {isOwnProfile && (
            <ProfileMenu />
          )}

        </div>
      </Layout>

      <BottomNavigation />
    </>
  );
}
