import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./ChatHeader.module.css";

export default function ChatHeader({ match }) {
    const navigate = useNavigate();

    const players = match?.match_players?.length ?? 0;

    const level =
        match?.level_min && match?.level_max
            ? `${match.level_min} - ${match.level_max}`
            : "Todos los niveles";

    function formatDate(date) {
        if (!date) return "";

        return new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
        });
    }
    function formatTime(time) {
        if (!time) return "";

        return time.slice(0, 5);
    }
    function formatStatus(status) {
        switch (status) {
            case "PENDING":
                return "Buscando jugadores";
            case "CONFIRMED":
                return "Confirmado";
            case "FINISHED":
                return "Finalizado";
            default:
                return "";
        }
    }
    return (
        <header className={styles.header}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={22} />
            </button>

            <div className={styles.info}>
                <h2>
                    {match?.title || "Chat del partido"}
                </h2>

                <p>
                    {formatDate(match?.match_date)} · {formatTime(match?.match_time)} · {match?.location}
                </p>

                <p>
                    {players}/{match?.max_players ?? "-"} jugadores · Nivel {level}
                </p>
                <span
                    className={`${styles.status} ${styles[match?.status?.toLowerCase()]}`}
                >
                    {formatStatus(match?.status)}
                </span>
            </div>
        </header>
    );
}

ChatHeader.propTypes = {
    match: PropTypes.object,
};