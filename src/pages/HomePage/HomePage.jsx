import Header from "../../components/layout/Header";
import SearchBar from "../../components/common/SearchBar";
import MatchCard from "../../components/match/MatchCard";
import BottomNavigation from "../../components/layout/BottomNavigation";
import Layout from "../../components/layout/Layout";

import { currentUser } from "../../mocks/currentUser";
import { matches } from "../../mocks/matches";

export default function HomePage() {
  return (
    <>
      <Layout>
        <Header
          name={currentUser.name}
          avatar={currentUser.avatar}
        />

        <SearchBar />

        <h2>Partidos cerca de ti</h2>
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