import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MyMatchCard from "../../components/match/MyMatchCard";

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

  const now = new Date();

  // Construimos la fecha + hora exacta del partido
  function getMatchDateTime(match) {
    return new Date(
      `${match.match_date}T${match.match_time}`
    );
  }

  const upcomingMatches = matches.filter((match) => {
    return getMatchDateTime(match) >= now;
  });

  const pastMatches = matches.filter((match) => {
    return getMatchDateTime(match) < now;
  });

  return (
    <>
      <Layout>

        <h1>Mis partidos</h1>

        <h2>Próximos partidos</h2>

        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => (
            <MyMatchCard
              key={match.id}
              match={match}
              showUnread={true}
              isPast={false}
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
            <MyMatchCard
              key={match.id}
              match={match}
              showUnread={false}
              isPast={true}
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