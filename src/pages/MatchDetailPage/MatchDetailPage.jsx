import { useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import MatchInfo from "../../components/match/MatchInfo";
import MatchPlayers from "../../components/match/MatchPlayers";
import JoinMatchButton from "../../components/match/JoinMatchButton";

import useMatch from "../../hooks/useMatch";

import styles from "./MatchDetailPage.module.css";

export default function MatchDetailPage() {
  const { id } = useParams();

  const {
    match,
    loading,
    error,
  } = useMatch(id);

  if (loading) {
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

        <MatchInfo match={match} />

        <MatchPlayers
          matchId={match.id}
          maxPlayers={match.max_players}
        />

        {/* MatchDescription */}

        <JoinMatchButton
          matchId={match.id}
          onJoined={() => {
            reload();
          }}
        />

      </Layout>

      <BottomNavigation />
    </>
  );
}