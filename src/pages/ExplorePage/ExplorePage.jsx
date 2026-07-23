import Layout from "../../components/layout/Layout";
import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchCard from "../../components/match/MatchCard";
import FilterChip from "../../components/filters/FilterChip";

import useMatches from "../../hooks/useMatches";
import { currentUser } from "../../mocks/currentUser";
import { useState } from "react";

import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const {
    matches,
    loading,
    error,
  } = useMatches();
  const filteredMatches = matches.filter((match) => {
    const text = search.toLowerCase();

    return (
      match.title?.toLowerCase().includes(text) ||
      match.location?.toLowerCase().includes(text) ||
      match.city?.toLowerCase().includes(text) ||
      match.match_type?.toLowerCase().includes(text)
    );
  });
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

        <SearchBar
          placeholder="Buscar partidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
          <span>
            {filteredMatches.length} {filteredMatches.length === 1 ? "partido" : "partidos"}
          </span>
        </div>

        {filteredMatches.map((match) => (
          <MatchCard
            key={match.id}
            id={match.id}
            title={match.title}
            location={match.location}
            date={match.match_date}
            time={match.match_time}
            level={match.level_min}
            currentPlayers={match.occupied_slots}
            maxPlayers={match.max_players}
            status={match.status}
            type={match.match_type}
            distance={match.city}
            court={match.court_type}
            duration={`${match.duration} min`}
          />
        ))}
      </Layout>

      <BottomNavigation />
    </>
  );
}