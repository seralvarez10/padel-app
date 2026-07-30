import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileMenu from "../../components/profile/ProfileMenu";
import styles from "./ProfilePage.module.css";
import EditProfileButton from "../../components/profile/EditProfileButton";

import useProfile from "../../hooks/useProfile";

export default function ProfilePage() {
  const navigate = useNavigate();

  const {
    profile,
    stats,
    loading,
  } = useProfile();

  if (loading) return null;


  return (
    <>
      <Layout>
        <div className={styles.container}>

          <ProfileHeader profile={profile} />

          <ProfileStats stats={stats} />

          <ProfileInfo profile={profile} />

          <ProfileMenu />

          <EditProfileButton
            onClick={() => navigate("/profile/edit")}
          />

        </div>
      </Layout>

      <BottomNavigation />
    </>
  )
};