import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import MatchCard from "../../components/match/MatchCard";
import BottomNavigation from "../../components/layout/BottomNavigation";
import Layout from "../../components/layout/Layout";
import HeroCard from "../../components/home/HeroCard";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


import useProfile from "../../hooks/useProfile";
import useMatches from "../../hooks/useMatches";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const {
    profile,
    loading: profileLoading,
  } = useProfile();
  const navigate = useNavigate();


  const {
    matches,
    loading,
    error,
  } = useMatches();

  if (loading || profileLoading) {
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
  const filteredMatches = matches.filter((match) => {
    const text = search.toLowerCase();

    return (
      match.title?.toLowerCase().includes(text) ||
      match.location?.toLowerCase().includes(text) ||
      match.city?.toLowerCase().includes(text) ||
      match.match_type?.toLowerCase().includes(text) ||
      match.court_type?.toLowerCase().includes(text)
    );
  });
  const matchesWithStatus = filteredMatches.map((match) => ({
    ...match,
    isOrganizer: match.creator_id === user?.id,
    isJoined: match.match_players.some(
      (player) => player.player_id === user?.id
    ),
    isFull: match.occupied_slots >= match.max_players,
  }));
  return (
    <>
      <Layout>
        <Header
          name={profile?.display_name}
          avatar={profile?.avatar_url}
        />
        <HeroCard />

        <div className={styles.searchSection}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.sectionHeader}>

          <div>

            <h2 className={styles.title}>
              Partidos cerca de ti
            </h2>

            <p className={styles.subtitle}>
              {filteredMatches.length} partidos disponibles
            </p>

          </div>

          <button
            className={styles.link}
            onClick={() => navigate("/explore")}
          >
            Ver todos
          </button>

        </div>
        {matchesWithStatus.map((match) => (
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