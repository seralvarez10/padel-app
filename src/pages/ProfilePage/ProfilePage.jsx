import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileBadges from "../../components/profile/ProfileBadges";
import RecentMatches from "../../components/profile/RecentMatches";
import ProfileMenu from "../../components/profile/ProfileMenu";

export default function ProfilePage() {
  return (
    <>
      <Layout>

        <ProfileHeader />
        <ProfileStats />
        <ProfileBadges />
        <RecentMatches />
        <ProfileMenu />

      </Layout>

      <BottomNavigation />
    </>
  );
}