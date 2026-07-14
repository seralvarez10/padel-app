import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import MatchCard from "../../components/match/MatchCard";
import BottomNavigation from "../../components/layout/BottomNavigation";
import Layout from "../../components/layout/Layout";
import HeroCard from "../../components/home/HeroCard";


import { currentUser } from "../../mocks/currentUser";
import useMatches from "../../hooks/useMatches";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const {
    matches,
    loading,
    error,
  } = useMatches();
  console.log(matches);
  if (loading) {
    return (
      <Layout>
        <p>Cargando partidos...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>Error al cargar los partidos.</p>
      </Layout>
    );
  }
  return (
    <>
      <Layout>
        <Header
          name={currentUser.name}
          avatar={currentUser.avatar}
        />
        <HeroCard />

        <SearchBar />

        <div className={styles.sectionHeader}>
          <h2>Partidos cerca de ti</h2>

          <button>
            Ver todos
          </button>
        </div>
        {matches.map((match) => (
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