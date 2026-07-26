import PropTypes from "prop-types";

import Avatar from "../../common/Avatar";

import styles from "./MatchOrganizer.module.css";

export default function MatchOrganizer({ organizer }) {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Organiza</h2>

            <div className={styles.card}>
                <Avatar
                    src={organizer.avatar_url}
                    name={organizer.full_name || organizer.username}
                    size="lg"
                />

                <div className={styles.info}>
                    <strong>
                        {organizer.full_name || organizer.username}
                    </strong>

                    <span>
                        Nivel {organizer.level_current}
                    </span>
                </div>

                <span className={styles.badge}>
                    Organizador
                </span>
            </div>
        </section>
    );
}

MatchOrganizer.propTypes = {
    organizer: PropTypes.object.isRequired,
};