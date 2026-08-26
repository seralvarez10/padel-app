import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Share2,
  MessageCircle,
  Pencil,
  Trash2,
  Crown,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import MatchAttendance from "../../components/match/MatchAttendance/MatchAttendance";
import MatchResult from "../../components/match/MatchResult/MatchResult";
import MatchInfo from "../../components/match/MatchInfo";
import MatchPlayers from "../../components/match/MatchPlayers";
import JoinMatchButton from "../../components/match/JoinMatchButton";

import useMatchResult from "../../hooks/useMatchResult";
import useMatch from "../../hooks/useMatch";
import useMatchPlayers from "../../hooks/useMatchPlayers";
import useDeleteMatch from "../../hooks/useDeleteMatch";
import useUnreadMessages from "../../hooks/useUnreadMessages";

import ConfirmModal from "../../components/ui/ConfirmModal";

import styles from "./MatchDetailPage.module.css";

export default function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

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
    reload: reloadResult,
  } = useMatchResult(id);

  const { unreadCount } =
    useUnreadMessages(id);

  /*
   * ==========================================
   * JUGADOR ACTUAL
   * ==========================================
   */

  const currentPlayer = players.find(
    (player) =>
      player.player_id === user?.id
  );

  const isJoined =
    !!currentPlayer &&
    currentPlayer.status !== "LEFT";

  /*
   * ==========================================
   * ORGANIZADOR
   * ==========================================
   */

  const isOrganizer =
    match?.creator_id === user?.id;

  /*
   * ==========================================
   * ESTADO DEL PARTIDO
   * ==========================================
   */

  const matchDateTime = match
    ? new Date(
        `${match.match_date}T${match.match_time}`
      )
    : null;

  const hasFinished =
    match?.status === "FINISHED" ||
    (matchDateTime &&
      matchDateTime <= new Date());

  const isCancelled =
    match?.status === "CANCELLED";

  /*
   * La asistencia solo se muestra si:
   *
   * - el usuario está apuntado
   * - el partido no ha terminado
   * - el partido no está cancelado
   */

  const showAttendance =
    isJoined &&
    !hasFinished &&
    !isCancelled;

  /*
   * ==========================================
   * COMPARTIR
   * ==========================================
   */

  async function handleShare() {
    const shareData = {
      title:
        match?.title ||
        "Partido de pádel",

      text:
        "Mira este partido de pádel",

      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );
      }
    } catch (error) {
      /*
       * El usuario puede cancelar
       * el diálogo de compartir.
       */

      if (
        error?.name !==
        "AbortError"
      ) {
        console.error(
          "Error compartiendo:",
          error
        );
      }
    }
  }

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (
    loading ||
    playersLoading
  ) {
    return (
      <>
        <Layout>
          <p>
            Cargando partido...
          </p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error || !match) {
    return (
      <>
        <Layout>
          <p>
            Error al cargar el partido.
          </p>
        </Layout>

        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <Layout
        className={styles.container}
      >

        {/* ==================================
            CABECERA
        ================================== */}

        <div
          className={styles.topBar}
        >
          <button
            type="button"
            className={
              styles.iconButton
            }
            onClick={() =>
              navigate(-1)
            }
            aria-label="Volver"
          >
            <ArrowLeft
              size={17}
            />
          </button>

          <button
            type="button"
            className={
              styles.iconButton
            }
            onClick={handleShare}
            aria-label="Compartir partido"
          >
            <Share2
              size={16}
            />
          </button>
        </div>

        {/* ==================================
            INFORMACIÓN DEL PARTIDO
        ================================== */}

        <MatchInfo
          match={match}
          totalPlayers={totalPlayers}
        />

        {/* ==================================
            POSICIONES
        ================================== */}

        <MatchPlayers
          matchId={match.id}
          players={players}
          maxPlayers={match.max_players}
          currentUserId={user?.id}
          onPositionChange={
            reloadPlayers
          }
        />

        {/* ==================================
            ASISTENCIA
        ================================== */}

        {showAttendance && (
          <MatchAttendance
            player={currentPlayer}
            match={match}
            onUpdated={() => {
              reloadPlayers();
            }}
          />
        )}

        {/* ==================================
            RESULTADO
        ================================== */}

        <MatchResult
          match={match}
          result={result}
          players={players}
          onResultSubmitted={
            reloadResult
          }
        />

        {/* ==================================
            AVISO ORGANIZADOR
        ================================== */}

        {isOrganizer && (
          <div
            className={
              styles.organizerNotice
            }
          >
            <Crown size={15} />

            <span>
              Eres el organizador
              de este partido
            </span>
          </div>
        )}

        {/* ==================================
            CHAT
        ================================== */}

        {(isJoined ||
          isOrganizer) && (
          <Link
            to={`/matches/${match.id}/chat`}
            className={
              styles.chatButton
            }
          >
            <MessageCircle
              size={16}
            />

            <span>
              Abrir chat del partido
            </span>

            {unreadCount > 0 && (
              <span
                className={
                  styles.unreadBadge
                }
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </Link>
        )}

        {/* ==================================
            ACCIONES DEL ORGANIZADOR
        ================================== */}

        {isOrganizer && (
          <div
            className={
              styles.organizerActions
            }
          >
            <Link
              to={`/matches/${match.id}/edit`}
              className={
                styles.editButton
              }
            >
              <Pencil size={13} />

              <span>
                Editar
              </span>
            </Link>

            <button
              type="button"
              className={
                styles.deleteButton
              }
              onClick={() =>
                setShowDeleteModal(
                  true
                )
              }
              disabled={deleting}
            >
              <Trash2 size={13} />

              <span>
                {deleting
                  ? "Eliminando..."
                  : "Eliminar"}
              </span>
            </button>
          </div>
        )}

        {/* ==================================
            UNIRSE AL PARTIDO
        ==================================

            Solo mostramos el botón si:

            - no es el organizador
            - todavía NO está apuntado

            Si ya está apuntado, la acción
            "No puedo ir" se gestiona desde
            MatchAttendance.
        ================================== */}

        {!isOrganizer &&
          !isJoined && (
            <div
              className={
                styles.joinContainer
              }
            >
              <JoinMatchButton
                matchId={match.id}
                joined={false}
                full={
                  totalPlayers >=
                  match.max_players
                }
                isOrganizer={false}
                players={players}
                onJoined={() => {
                  reload();
                  reloadPlayers();
                }}
              />
            </div>
          )}

        {/* ==================================
            MODAL ELIMINAR
        ================================== */}

        <ConfirmModal
          open={
            showDeleteModal
          }
          title="Eliminar partido"
          message="¿Seguro que quieres eliminar este partido? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onCancel={() =>
            setShowDeleteModal(
              false
            )
          }
          onConfirm={async () => {
            await remove();

            setShowDeleteModal(
              false
            );
          }}
        />

      </Layout>

      <BottomNavigation />
    </>
  );
}