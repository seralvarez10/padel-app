import PropTypes from "prop-types";

import Button from "../../ui/Button";

import useJoinMatch from "../../../hooks/useJoinMatch";

export default function JoinMatchButton({
  matchId,
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

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
    >
      {loading
        ? "Uniéndose..."
        : "Unirme al partido"}
    </Button>
  );
}

JoinMatchButton.propTypes = {
  matchId: PropTypes.string.isRequired,
  onJoined: PropTypes.func,
};