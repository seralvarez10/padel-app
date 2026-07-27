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

  return (
    <>
      <Layout>

        <h1>Mis partidos</h1>

        {matches.map(match => (

          <MatchCard
            key={match.id}
            {...match}
          />

        ))}

      </Layout>

      <BottomNavigation />

    </>
  );
}