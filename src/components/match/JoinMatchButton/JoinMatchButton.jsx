import PropTypes from "prop-types";
import toast from "react-hot-toast";

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
    const ok = await join(matchId, joined);

    if (ok) {
      toast.success(
        joined
          ? "Has abandonado el partido"
          : "Te has unido al partido"
      );

      onJoined?.();
    }
  }

  let buttonText = "Unirme al partido";

  if (loading) {
    buttonText = joined
      ? "Saliendo..."
      : "Uniéndose...";
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
      disabled={
        loading ||
        isOrganizer ||
        (full && !joined)
      }
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