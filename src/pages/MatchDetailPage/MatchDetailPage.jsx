import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import MatchAttendance from "../../components/match/MatchAttendance/MatchAttendance";
import MatchResult from "../../components/match/MatchResult/MatchResult";

import MatchInfo from "../../components/match/MatchInfo";
import MatchPlayers from "../../components/match/MatchPlayers";
import JoinMatchButton from "../../components/match/JoinMatchButton";
import useMatchResult from "../../hooks/useMatchResult";

import ConfirmModal from "../../components/ui/ConfirmModal";

import useMatch from "../../hooks/useMatch";
import useMatchPlayers from "../../hooks/useMatchPlayers";
import useDeleteMatch from "../../hooks/useDeleteMatch";
import useUnreadMessages from "../../hooks/useUnreadMessages";

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
  const {
    result,
    loading: resultLoading,
    error: resultError,
    reload: reloadResult,
  } = useMatchResult(id);
 
  const { unreadCount } = useUnreadMessages(id);

  const currentPlayer = players.find(
    (player) => player.player_id === user?.id
  );

  const isJoined =
    !!currentPlayer &&
    currentPlayer.status !== "LEFT";

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
          matchId={match.id}
          players={players}
          maxPlayers={match.max_players}
          currentUserId={user?.id}
          onPositionChange={reloadPlayers}
        />

        {isJoined && (
          <MatchAttendance
            player={currentPlayer}
            match={match}
            onUpdated={() => {
              reloadPlayers();
            }}
          />

        )}
        <MatchResult
          result={result}
          players={players}
          currentUserId={user?.id}
        />

        {(isJoined || isOrganizer) && (
          <Link
            to={`/matches/${match.id}/chat`}
            className={styles.chatButton}
          >
            <span>💬 Abrir chat</span>

            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        )}

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
            players={players}
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