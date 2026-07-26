import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import MatchInfo from "../../components/match/MatchInfo";
import MatchPlayers from "../../components/match/MatchPlayers";
import JoinMatchButton from "../../components/match/JoinMatchButton";
import MatchOrganizer from "../../components/match/MatchOrganizer";

import useMatch from "../../hooks/useMatch";
import useMatchPlayers from "../../hooks/useMatchPlayers";

import styles from "./MatchDetailPage.module.css";

export default function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const {
    match,
    loading,
    error,
    reload,
  } = useMatch(id);

  const {
    players,
    loading: playersLoading,
    reload: reloadPlayers,
    totalPlayers,
  } = useMatchPlayers(id);

  const isJoined = players.some(
    (player) => player.player_id === user?.id
  );

  const isOrganizer =
    match?.creator_id === user?.id;

  if (loading || playersLoading) {
    return (
      <>
        <Layout>
          <p>Cargando partido...</p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Layout>
          <p>Error al cargar el partido.</p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <Layout className={styles.container}>

        <MatchInfo
          match={match}
          totalPlayers={totalPlayers}
        />
        <MatchOrganizer
          organizer={match.profiles}
        />
        <MatchPlayers
          players={players}
          maxPlayers={match.max_players}
        />

        <div className={styles.joinContainer}>
          <JoinMatchButton
            matchId={match.id}
            joined={isJoined}
            full={totalPlayers >= match.max_players}
            isOrganizer={isOrganizer}
            onJoined={() => {
              reload();
              reloadPlayers();
            }}
          />
        </div>

      </Layout>

      <BottomNavigation />
    </>
  );
}