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
        <section className={styles.card}>

            <h2>Información</h2>

            {showGameInfo && (
                <>
                    <div className={styles.item}>

                        <Hand size={18} />

                        <div>
                            <strong>
                                Mano dominante
                            </strong>

                            <span>
                                {profile.dominant_hand
                                    ? HANDS[
                                    profile.dominant_hand
                                    ]
                                    : "No especificada"}
                            </span>
                        </div>

                    </div>

                    <div className={styles.item}>

                        <MoveHorizontal size={18} />

                        <div>
                            <strong>
                                Lado favorito
                            </strong>

                            <span>
                                {profile.preferred_side
                                    ? SIDES[
                                    profile.preferred_side
                                    ]
                                    : "No especificado"}
                            </span>
                        </div>

                    </div>
                </>
            )}

            {showBio && (
                <div className={styles.item}>

                    <FileText size={18} />

                    <div>
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