import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import MatchInfo from "../../components/match/MatchInfo";
import MatchPlayers from "../../components/match/MatchPlayers";
import JoinMatchButton from "../../components/match/JoinMatchButton";

import ConfirmModal from "../../components/ui/ConfirmModal";

import useMatch from "../../hooks/useMatch";
import useMatchPlayers from "../../hooks/useMatchPlayers";
import useDeleteMatch from "../../hooks/useDeleteMatch";

import styles from "./MatchDetailPage.module.css";

export default function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    remove,
    loading: deleting,
  } = useDeleteMatch(id);

  const {
    match,
    loading,
    error,
    reload,
  } = useMatch(id);

  const {
    players,
    loading: playersLoading,
    reload: reloadPlayers,
    totalPlayers,
  } = useMatchPlayers(id);

  const isJoined = players.some(
    (player) => player.player_id === user?.id
  );

  const isOrganizer =
    match?.creator_id === user?.id;

  if (loading || playersLoading) {
    return (
      <>
        <Layout>
          <p>Cargando partido...</p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Layout>
          <p>Error al cargar el partido.</p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <Layout className={styles.container}>
        <MatchInfo
          match={match}
          totalPlayers={totalPlayers}
        />

        <MatchPlayers
          players={players}
          maxPlayers={match.max_players}
        />

        {isOrganizer && (
          <div className={styles.organizerActions}>
            <Link
              to={`/matches/${match.id}/edit`}
              className={styles.editButton}
            >
              ✏️ Editar partido
            </Link>

            <button
              className={styles.deleteButton}
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              {deleting
                ? "Eliminando..."
                : "🗑️ Eliminar partido"}
            </button>
          </div>
        )}

        <div className={styles.joinContainer}>
          <JoinMatchButton
            matchId={match.id}
            joined={isJoined}
            full={totalPlayers >= match.max_players}
            isOrganizer={isOrganizer}
            onJoined={() => {
              reload();
              reloadPlayers();
            }}
          />
        </div>

        <ConfirmModal
          open={showDeleteModal}
          title="🗑️ Eliminar partido"
          message="¿Seguro que quieres eliminar este partido? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await remove();
            setShowDeleteModal(false);
          }}
        />
      </Layout>

      <BottomNavigation />
    </>
  );
}