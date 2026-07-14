import Layout from "../../components/layout/Layout";
import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchCard from "../../components/match/MatchCard";
import FilterChip from "../../components/filters/FilterChip";

import { currentUser } from "../../mocks/currentUser";
import { matches } from "../../mocks/matches";

import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  return (
    <>
      <Layout>
        <Header
          name={currentUser.name}
          avatar={currentUser.avatar}
        />

        <SearchBar placeholder="Buscar partidos..." />

        <div className={styles.filters}>
          <FilterChip label="Hoy" active />
          <FilterChip label="Mañana" />
          <FilterChip label="Esta semana" />
          <FilterChip label="Indoor" />
          <FilterChip label="Outdoor" />
          <FilterChip label="Nivel" />
        </div>

        <div className={styles.resultsHeader}>
          <h2>Explorar partidos</h2>
          <span>{matches.length} resultados</span>
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