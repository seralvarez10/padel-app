import PropTypes from "prop-types";
import { useState } from "react";
import ConfirmModal from "../../ui/ConfirmModal";

import {
    confirmAttendance,
    cancelAttendance,
} from "../../../services/matchPlayersService";

import { useAuth } from "../../../contexts/AuthContext";

import styles from "./MatchAttendance.module.css";

export default function MatchAttendance({
    player,
    match,
    onUpdated,
}) {
    const { user } = useAuth();
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    if (!player || player.player_id !== user?.id) {
        return null;
    }

    async function handleConfirm() {
        try {
            await confirmAttendance(match.id, user.id);
            onUpdated();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCancel() {
        try {
            await cancelAttendance(match.id, user.id);

            onUpdated();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className={styles.card}>
            <h3>Tu asistencia</h3>

            {player.status === "CONFIRMED" ? (
                <>
                    <p className={styles.confirmed}>
                        ✅ Has confirmado tu asistencia.
                    </p>

                    <p className={styles.note}>
                        Si finalmente no puedes venir,
                        podrás abandonar el partido.
                    </p>

                    <button
                        className={styles.cancelButton}
                        onClick={() => setShowLeaveModal(true)}
                    >
                        No puedo ir
                    </button>
                </>
            ) : (
                <>
                    <p>
                        Confirma que asistirás al partido.
                    </p>

                    <div className={styles.actions}>
                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirm}
                        >
                            Confirmar asistencia
                        </button>

                        <button
                            className={styles.cancelButton}
                            onClick={handleCancel}
                        >
                            No puedo ir
                        </button>
                    </div>
                </>
            )}
            <ConfirmModal
                open={showLeaveModal}
                title="Abandonar partido"
                message="¿Seguro que no puedes asistir? Tu plaza quedará libre para otro jugador."
                confirmText="Abandonar"
                cancelText="Cancelar"
                onCancel={() => setShowLeaveModal(false)}
                onConfirm={async () => {
                    await handleCancel();
                    setShowLeaveModal(false);
                }}
            />
        </section>
    );
}

MatchAttendance.propTypes = {
    player: PropTypes.object,
    match: PropTypes.object,
    onUpdated: PropTypes.func,
};