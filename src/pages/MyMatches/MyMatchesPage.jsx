import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchCard from "../../components/match/MatchCard";

import useMyMatches from "../../hooks/useMyMatches";

export default function MyMatchesPage() {

  const {
    matches,
    loading,
    error,
  } = useMyMatches();

  if (loading) {
    return (
      <Layout>
        Cargando...
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        Error al cargar partidos.
      </Layout>
    );
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMatches = matches.filter((match) => {
    const date = new Date(match.match_date);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  });

  const pastMatches = matches.filter((match) => {
    const date = new Date(match.match_date);
    date.setHours(0, 0, 0, 0);
    return date < today;
  });
  return (
    <>
      <Layout>

        <h1>Mis partidos</h1>

        <h2>Próximos partidos</h2>

        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => (
            <MatchCard
              key={match.id}
              {...match}
              playerStatus={match.playerStatus}
            />
          ))
        ) : (
          <p>No tienes próximos partidos.</p>
        )}

        <h2 style={{ marginTop: "32px" }}>
          Historial
        </h2>

        {pastMatches.length > 0 ? (
          pastMatches.map((match) => (
            <MatchCard
              key={match.id}
              {...match}
            />
          ))
        ) : (
          <p>No hay partidos anteriores.</p>
        )}

      </Layout>

      <BottomNavigation />

    </>
  );
}