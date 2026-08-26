import { useState } from "react";

import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/common/SearchBar";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchCard from "../../components/match/MatchCard";
import FilterChip from "../../components/filters/FilterChip";

import useMatches from "../../hooks/useMatches";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../contexts/AuthContext";

import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const { user } = useAuth();

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
        <div className={styles.loading}>
          Cargando partidos...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.error}>
          Error al cargar los partidos.
        </div>
      </Layout>
    );
  }

  /*
   * ==========================================
   * FECHAS
   * ==========================================
   */

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const nextWeek = new Date(today);
  nextWeek.setDate(
    nextWeek.getDate() + 7
  );

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(tomorrow);
  tomorrowStart.setHours(0, 0, 0, 0);

  const nextWeekEnd = new Date(nextWeek);
  nextWeekEnd.setHours(
    23,
    59,
    59,
    999
  );

  /*
   * ==========================================
   * FILTRADO
   * ==========================================
   */

  const filteredMatches = matches.filter(
    (match) => {
      const text = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !text ||
        match.title
          ?.toLowerCase()
          .includes(text) ||
        match.location
          ?.toLowerCase()
          .includes(text) ||
        match.city
          ?.toLowerCase()
          .includes(text) ||
        match.match_type
          ?.toLowerCase()
          .includes(text) ||
        match.court_type
          ?.toLowerCase()
          .includes(text);

      let matchesFilter = true;

      const matchDate = new Date(
        match.match_date
      );

      matchDate.setHours(0, 0, 0, 0);

      switch (filter) {
        case "Hoy":
          matchesFilter =
            matchDate.getTime() ===
            todayStart.getTime();
          break;

        case "Mañana":
          matchesFilter =
            matchDate.getTime() ===
            tomorrowStart.getTime();
          break;

        case "Esta semana":
          matchesFilter =
            matchDate >= todayStart &&
            matchDate <= nextWeekEnd;
          break;

        case "Indoor":
          matchesFilter =
            match.court_type === "Indoor";
          break;

        case "Outdoor":
          matchesFilter =
            match.court_type === "Outdoor";
          break;

        default:
          matchesFilter = true;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  /*
   * ==========================================
   * ESTADO DEL USUARIO EN CADA PARTIDO
   * ==========================================
   */

  const matchesWithStatus =
    filteredMatches.map((match) => {
      const isOrganizer =
        match.creator_id === user?.id;

      const isJoined =
        match.match_players?.some(
          (player) =>
            player.player_id === user?.id
        ) ?? false;

      const isFull =
        Number(match.occupied_slots ?? 0) >=
        Number(match.max_players ?? 4);

      return {
        ...match,
        isOrganizer,
        isJoined,
        isFull,
      };
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
        <main className={styles.page}>

          {/* =========================
              CABECERA
          ========================= */}

          <header className={styles.pageHeader}>

            <div>
              <h1>
                Explorar partidos
              </h1>
            </div>

            <span className={styles.matchCount}>
              {matchesWithStatus.length}{" "}
              {matchesWithStatus.length === 1
                ? "partido"
                : "partidos"}
            </span>

          </header>


          {/* =========================
              BUSCADOR
          ========================= */}

          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Buscar partidos..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>


          {/* =========================
              FILTROS
          ========================= */}

          <div className={styles.filtersWrapper}>

            <div className={styles.filters}>

              {filters.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={
                    filter === item
                  }
                  onClick={() =>
                    setFilter(
                      filter === item
                        ? ""
                        : item
                    )
                  }
                />
              ))}

            </div>

          </div>


          {/* =========================
              RESULTADOS
          ========================= */}

          <section className={styles.results}>

            {matchesWithStatus.length === 0 ? (
              <div className={styles.emptyState}>

                <div className={styles.emptyIcon}>
                  🎾
                </div>

                <h2>
                  No encontramos partidos
                </h2>

                <p>
                  Prueba a cambiar los
                  filtros o buscar otra
                  ubicación.
                </p>

              </div>
            ) : (
              matchesWithStatus.map(
                (match) => (
                  <MatchCard
                    key={match.id}
                    {...match}
                  />
                )
              )
            )}

          </section>

        </main>
      </Layout>

      <BottomNavigation />
    </>
  );
}