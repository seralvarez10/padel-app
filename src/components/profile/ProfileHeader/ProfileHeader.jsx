import { useState } from "react";
import PropTypes from "prop-types";

import Avatar from "../../common/Avatar";
import Badge from "../../ui/Badge";

import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Settings,
  X,
  ArrowLeft,
  Users,
  UserRoundCheck,
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
  const navigate = useNavigate();
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

  /*
   * PRIVACIDAD
   */

  const showCity =
    isOwnProfile ||
    profile.show_city !== false;

  const showNetwork =
    isOwnProfile ||
    profile.show_network !== false;

  return (
    <>
      <section className={styles.header}>

        {/* =================================
            LÍNEAS DE PISTA
        ================================= */}

        <div
          className={styles.courtLines}
          aria-hidden="true"
        />

        {/* =================================
            VOLVER
        ================================= */}

        {!isOwnProfile && (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <ArrowLeft size={17} />
          </button>
        )}

        {/* =================================
            AJUSTES
        ================================= */}

        {isOwnProfile && (
          <button
            type="button"
            className={styles.settingsButton}
            onClick={() => navigate("/settings")}
            aria-label="Configuración"
          >
            <Settings size={18} />
          </button>
        )}

        {/* =================================
            CONTENIDO DEL PERFIL
        ================================= */}

        <div className={styles.profileContent}>

          <Avatar
            className={styles.avatar}
            src={profile.avatar_url}
            name={profile.display_name}
            size="xl"
          />

          <h1>
            {profile.display_name}
          </h1>

          <div className={styles.info}>

            <span className={styles.level}>
              🎾 Nivel {profile.level_current}
            </span>

            {showCity && (
              <span className={styles.city}>
                <MapPin size={13} />

                {profile.city ||
                  "Ciudad no especificada"}
              </span>
            )}

          </div>

          {/* =================================
              RED DE CONFIANZA

              Se mantiene para perfiles
              ajenos, pero fuera de la
              cabecera visual del propio perfil.
          ================================= */}

          {showNetwork && !isOwnProfile && (
            <div className={styles.network}>

              <button
                type="button"
                className={styles.networkItem}
                onClick={() =>
                  openNetwork("friends")
                }
              >
                <Users size={14} />

                <span>
                  <strong>
                    {friendsCount}
                  </strong>{" "}
                  amigos
                </span>
              </button>

              <span
                className={styles.networkDivider}
              />

              <button
                type="button"
                className={styles.networkItem}
                onClick={() =>
                  openNetwork("mutual")
                }
              >
                <UserRoundCheck size={14} />

                <span>
                  <strong>
                    {mutualFriendsCount}
                  </strong>{" "}
                  en común
                </span>
              </button>

            </div>
          )}

        </div>

      </section>


      {/* =================================
          MODAL DE AMIGOS
      ================================= */}

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

              <h2>
                {modalTitle}
              </h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeNetwork}
                aria-label="Cerrar"
              >
                <X size={19} />
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

                    <div
                      className={
                        styles.personInfo
                      }
                    >
                      <strong>
                        {person.display_name}
                      </strong>

                      <span>
                        🎾 Nivel{" "}
                        {person.level_current}
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

    show_city: PropTypes.bool,
    show_network: PropTypes.bool,
  }).isRequired,

  friendsCount: PropTypes.number,
  mutualFriendsCount: PropTypes.number,
  isOwnProfile: PropTypes.bool,
};