import { useState } from "react";
import PropTypes from "prop-types";

import Avatar from "../../common/Avatar";
import Badge from "../../ui/Badge";

import {
  MapPin,
  Users,
  UserRoundCheck,
  X,
} from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";

import {
  getFriendProfiles,
  getMutualFriendProfiles,
} from "../../../services/friendshipService";

import styles from "./ProfileHeader.module.css";

export default function ProfileHeader({
  profile,
  friendsCount = 0,
  mutualFriendsCount = 0,
  isOwnProfile = false,
}) {
  const { user } = useAuth();

  const [modalType, setModalType] = useState(null);
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(false);

  if (!profile) return null;

  async function openNetwork(type) {
    setModalType(type);
    setPeople([]);
    setLoadingPeople(true);

    try {
      let data = [];

      if (type === "friends") {
        data = await getFriendProfiles(profile.id);
      }

      if (type === "mutual") {
        data = await getMutualFriendProfiles(
          user?.id,
          profile.id
        );
      }

      setPeople(data);
    } catch (error) {
      console.error(
        "Error cargando red de confianza:",
        error
      );
    } finally {
      setLoadingPeople(false);
    }
  }

  function closeNetwork() {
    setModalType(null);
    setPeople([]);
  }

  const modalTitle =
    modalType === "friends"
      ? "Amigos"
      : "Amigos en común";

  return (
    <>
      <section className={styles.header}>

        {!isOwnProfile && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            ← Volver
          </button>
        )}

        <Avatar
          className={styles.avatar}
          src={profile.avatar_url}
          name={profile.display_name}
          size="xl"
        />

        <h1>{profile.display_name}</h1>

        <div className={styles.info}>
          <Badge
            className={styles.level}
            variant="success"
          >
            🎾 Nivel {profile.level_current}
          </Badge>

          <span className={styles.city}>
            <MapPin size={16} />
            {profile.city || "Ciudad no especificada"}
          </span>
        </div>

        {!isOwnProfile && (
          <div className={styles.network}>

            <button
              type="button"
              className={styles.networkItem}
              onClick={() => openNetwork("friends")}
            >
              <Users size={16} />

              <span>
                <strong>{friendsCount}</strong> amigos
              </span>
            </button>

            <button
              type="button"
              className={styles.networkItem}
              onClick={() => openNetwork("mutual")}
            >
              <UserRoundCheck size={16} />

              <span>
                <strong>{mutualFriendsCount}</strong> en común
              </span>
            </button>

          </div>
        )}

      </section>

      {modalType && (
        <div
          className={styles.overlay}
          onClick={closeNetwork}
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className={styles.modalHeader}>
              <h2>{modalTitle}</h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeNetwork}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>

              {loadingPeople && (
                <p className={styles.empty}>
                  Cargando...
                </p>
              )}

              {!loadingPeople &&
                people.length === 0 && (
                  <p className={styles.empty}>
                    {modalType === "friends"
                      ? "No tiene amigos todavía."
                      : "No tenéis amigos en común."}
                  </p>
                )}

              {!loadingPeople &&
                people.map((person) => (
                  <div
                    key={person.id}
                    className={styles.person}
                  >
                    <Avatar
                      src={person.avatar_url}
                      name={person.display_name}
                      size="sm"
                    />

                    <div className={styles.personInfo}>
                      <strong>
                        {person.display_name}
                      </strong>

                      <span>
                        🎾 Nivel {person.level_current}
                      </span>
                    </div>
                  </div>
                ))}

            </div>

          </div>
        </div>
      )}
    </>
  );
}

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string,
    avatar_url: PropTypes.string,
    display_name: PropTypes.string,
    level_current: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    city: PropTypes.string,
  }).isRequired,

  friendsCount: PropTypes.number,
  mutualFriendsCount: PropTypes.number,
  isOwnProfile: PropTypes.bool,
};