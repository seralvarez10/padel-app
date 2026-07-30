import PropTypes from "prop-types";

import Avatar from "../../common/Avatar";
import Badge from "../../ui/Badge";

import { MapPin } from "lucide-react";

import styles from "./ProfileHeader.module.css";

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <section className={styles.header}>
      <Avatar
        className={styles.avatar}
        src={profile.avatar_url}
        name={profile.display_name}
        size="xl"
      />

      <h1>{profile.display_name}</h1>

      <div className={styles.info}>
        <Badge className={styles.level} variant="success">
          🎾 Nivel {profile.level_current}
        </Badge>

        <span className={styles.city}>
          <MapPin size={16} />
          {profile.city || "Ciudad no especificada"}
        </span>
      </div>
    </section>
  );
}

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    avatar_url: PropTypes.string,
    display_name: PropTypes.string,
    level_current: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    city: PropTypes.string,
  }).isRequired,
};