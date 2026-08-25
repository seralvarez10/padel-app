import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileMenu from "../../components/profile/ProfileMenu";
import EditProfileButton from "../../components/profile/EditProfileButton";


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
            <p>No se ha encontrado este perfil.</p>
          </div>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

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

          <ProfileStats stats={stats} />

          <ProfileInfo profile={profile} />

          {isOwnProfile && (
            <>
              <ProfileMenu />

              <EditProfileButton
                onClick={() => navigate("/profile/edit")}
              />
            </>
          )}

        </div>
      </Layout>

      <BottomNavigation />
    </>
  );
}