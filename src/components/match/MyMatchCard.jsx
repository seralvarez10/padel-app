import PropTypes from "prop-types";

import MatchCard from "./MatchCard";
import useUnreadMessages from "../../hooks/useUnreadMessages";

export default function MyMatchCard({
  match,
  showUnread = true,
  isPast = false,
}) {
  const { unreadCount } = useUnreadMessages(
    showUnread ? match.id : null
  );

  return (
    <MatchCard
      {...match}
      unreadCount={showUnread ? unreadCount : 0}
      isPast={isPast}
    />
  );
}

MyMatchCard.propTypes = {
  match: PropTypes.object.isRequired,
  showUnread: PropTypes.bool,
  isPast: PropTypes.bool,
};