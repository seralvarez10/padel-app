import PropTypes from "prop-types";

import {
    Hand,
    MoveHorizontal,
    FileText,
} from "lucide-react";

import styles from "./ProfileInfo.module.css";

export default function ProfileInfo({
    profile,
    showGameInfo = true,
    showBio = true,
}) {
    const HANDS = {
        right: "Derecha",
        left: "Izquierda",
    };

    const SIDES = {
        drive: "Drive",
        backhand: "Revés",
        both: "Indiferente",
    };

    return (
        <section className={styles.container}>

            <h2>Información</h2>

            {showGameInfo && (
                <div className={styles.gameInfo}>

                    {/* MANO DOMINANTE */}
                    <div className={styles.gameItem}>

                        <div className={styles.iconBox}>
                            <Hand size={14} />
                        </div>

                        <div className={styles.itemContent}>
                            <strong>
                                Mano dominante
                            </strong>

                            <span>
                                {profile.dominant_hand
                                    ? HANDS[profile.dominant_hand]
                                    : "No especificada"}
                            </span>
                        </div>

                    </div>


                    {/* LADO FAVORITO */}
                    <div className={styles.gameItem}>

                        <div className={styles.iconBox}>
                            <MoveHorizontal size={14} />
                        </div>

                        <div className={styles.itemContent}>
                            <strong>
                                Lado favorito
                            </strong>

                            <span>
                                {profile.preferred_side
                                    ? SIDES[profile.preferred_side]
                                    : "No especificado"}
                            </span>
                        </div>

                    </div>

                </div>
            )}


            {/* SOBRE MÍ */}
            {showBio && (
                <div className={styles.bioItem}>

                    <div className={styles.bioIcon}>
                        <FileText size={14} />
                    </div>

                    <div className={styles.itemContent}>

                        <strong>
                            Sobre mí
                        </strong>

                        <span>
                            {profile.bio ||
                                "Todavía no hay biografía."}
                        </span>

                    </div>

                </div>
            )}

        </section>
    );
}

ProfileInfo.propTypes = {
    profile: PropTypes.object.isRequired,
    showGameInfo: PropTypes.bool,
    showBio: PropTypes.bool,
};