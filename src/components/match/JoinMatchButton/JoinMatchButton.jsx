import PropTypes from "prop-types";

import Button from "../../ui/Button";
import useJoinMatch from "../../../hooks/useJoinMatch";

export default function JoinMatchButton({
  matchId,
  joined,
  full,
  isOrganizer,
  onJoined,
}) {
  const {
    join,
    loading,
  } = useJoinMatch();

  async function handleClick() {
    const ok = await join(matchId);

    if (ok && onJoined) {
      onJoined();
    }
  }

  let buttonText = "Unirme al partido";

  if (loading) {
    buttonText = "Uniéndose...";
  } else if (isOrganizer) {
    buttonText = "👑 Eres el organizador";
  } else if (joined) {
    buttonText = "🚪 Salir del partido";
  } else if (full) {
    buttonText = "Partido completo";
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading || isOrganizer}
    >
      {buttonText}
    </Button>
  );
}

JoinMatchButton.propTypes = {
  matchId: PropTypes.string.isRequired,
  joined: PropTypes.bool,
  onJoined: PropTypes.func,
  full: PropTypes.bool,
  isOrganizer: PropTypes.bool,
};