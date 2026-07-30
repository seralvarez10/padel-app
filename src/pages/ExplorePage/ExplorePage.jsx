import { useState } from "react";

import Layout from "../../components/layout/Layout";
import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchCard from "../../components/match/MatchCard";
import FilterChip from "../../components/filters/FilterChip";

import useMatches from "../../hooks/useMatches";
import useProfile from "../../hooks/useProfile";

import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const {
    profile,
    loading: profileLoading,
  } = useProfile();

  const {
    matches,
    loading,
    error,
  } = useMatches();


  if (loading || profileLoading) {
    return (
      <Layout>
        <p>Cargando...</p>
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
  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const filteredMatches = matches.filter((match) => {
    const text = search.toLowerCase();

    const matchesSearch =
      match.title?.toLowerCase().includes(text) ||
      match.location?.toLowerCase().includes(text) ||
      match.distance?.toLowerCase().includes(text) ||
      match.type?.toLowerCase().includes(text);

    let matchesFilter = true;
    const matchDate = new Date(match.match_date);

    today.setHours(0, 0, 0, 0);

    tomorrow.setHours(0, 0, 0, 0);

    nextWeek.setHours(23, 59, 59, 999);

    matchDate.setHours(0, 0, 0, 0);

    switch (filter) {
      case "Indoor":
        matchesFilter = match.court_type === "Indoor";
        break;

      case "Outdoor":
        matchesFilter = match.court_type === "Outdoor";
        break;

      case "Hoy":
        matchesFilter =
          matchDate.toDateString() === today.toDateString();
        break;

      case "Mañana":
        matchesFilter =
          matchDate.toDateString() === tomorrow.toDateString();
        break;

      case "Esta semana":
        matchesFilter =
          matchDate >= today &&
          matchDate <= nextWeek;
        break;

      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  const filters = [
    "Hoy",
    "Mañana",
    "Esta semana",
    "Indoor",
    "Outdoor",
  ];

  return (
    <>
      <Layout>
        <Header
          name={profile?.display_name}
          avatar={profile?.avatar_url}
        />

        <SearchBar
          placeholder="Buscar partidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          {filters.map((item) => (
            <FilterChip
              key={item}
              label={item}
              active={filter === item}
              onClick={() =>
                setFilter(filter === item ? "" : item)
              }
            />
          ))}
        </div>

        <div className={styles.resultsHeader}>
          <h2>Explorar partidos</h2>

          <span>
            {filteredMatches.length}{" "}
            {filteredMatches.length === 1
              ? "partido"
              : "partidos"}
          </span>
        </div>

        {filteredMatches.map((match) => (
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