import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../ui/Button";
import JoinPositionModal from "../JoinPositionModal/JoinPositionModal";

import useJoinMatch from "../../../hooks/useJoinMatch";

export default function JoinMatchButton({
  matchId,
  joined,
  full,
  isOrganizer,
  players = [],
  onJoined,
}) {
  const {
    join,
    loading,
  } = useJoinMatch();

  const [
    showPositionModal,
    setShowPositionModal,
  ] = useState(false);

  async function handleLeave() {
    const ok = await join(
      matchId,
      true
    );

    if (ok) {
      toast.success(
        "Has abandonado el partido"
      );

      onJoined?.();
    }
  }

  async function handleJoin(
    position
  ) {
    const ok = await join(
      matchId,
      false,
      position
    );

    if (ok) {
      setShowPositionModal(false);

      toast.success(
        "Te has unido al partido"
      );

      onJoined?.();
    }
  }

  function handleClick() {
    if (joined) {
      handleLeave();
      return;
    }

    setShowPositionModal(true);
  }

  let buttonText =
    "Unirme al partido";

  if (loading) {
    buttonText = joined
      ? "Saliendo..."
      : "Uniéndose...";
  } else if (isOrganizer) {
    buttonText =
      "👑 Eres el organizador";
  } else if (joined) {
    buttonText =
      "🚪 Salir del partido";
  } else if (full) {
    buttonText =
      "Partido completo";
  }

  return (
    <>
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

      {showPositionModal && (
        <JoinPositionModal
          players={players}
          loading={loading}
          onCancel={() =>
            setShowPositionModal(false)
          }
          onConfirm={handleJoin}
        />
      )}
    </>
  );
}

JoinMatchButton.propTypes = {
  matchId: PropTypes.string.isRequired,
  joined: PropTypes.bool,
  full: PropTypes.bool,
  isOrganizer: PropTypes.bool,
  players: PropTypes.array,
  onJoined: PropTypes.func,
};