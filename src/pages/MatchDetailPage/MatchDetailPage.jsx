import { useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import useMatch from "../../hooks/useMatch";

import styles from "./MatchDetailPage.module.css";
import MatchInfo from "../../components/match/MatchInfo";

export default function MatchDetailPage() {
  const { id } = useParams();

  const {
    match,
    loading,
    error,
  } = useMatch(id);

  if (loading) {
    return (
      <Layout>
        <p>Cargando partido...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>Error al cargar el partido.</p>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <h1 className={styles.title}>
          {match.title}
        </h1>

        <p>{match.location}</p>

        <p>
          {match.match_date} · {match.match_time}
        </p>

        <p>
          Nivel {match.level_min} - {match.level_max}
        </p>

        <p>
          {match.occupied_slots}/{match.max_players} jugadores
        </p>

        <p>{match.description}</p>
      </Layout>

      <BottomNavigation />
    </>
  );
}