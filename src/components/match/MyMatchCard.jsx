import PropTypes from "prop-types";

import MatchCard from "./MatchCard";

import useUnreadMessages from "../../hooks/useUnreadMessages";
import { useAuth } from "../../contexts/AuthContext";

export default function MyMatchCard({
  match,
  showUnread = true,
  isPast = false,
}) {
  const { user } = useAuth();

  const { unreadCount } = useUnreadMessages(
    showUnread ? match.id : null
  );

  /*
   * ==========================================
   * RELACIÓN DEL USUARIO CON EL PARTIDO
   * ==========================================
   */

  const isOrganizer =
    match.creator_id === user?.id;

  /*
   * Si estamos en "Mis partidos", significa que
   * el usuario forma parte del partido.
   *
   * El organizador se trata por separado.
   */

  const isJoined =
    !isOrganizer;

  /*
   * ==========================================
   * PARTIDO COMPLETO
   * ==========================================
   */

  const isFull =
    Number(match.occupied_slots ?? 0) >=
    Number(match.max_players ?? 4);

  return (
    <MatchCard
      {...match}

      unreadCount={
        showUnread
          ? unreadCount
          : 0
      }

      isPast={isPast}

      isOrganizer={isOrganizer}

      isJoined={isJoined}

      isFull={isFull}
    />
  );
}

MyMatchCard.propTypes = {
  match: PropTypes.object.isRequired,

  showUnread: PropTypes.bool,

  isPast: PropTypes.bool,
};