import { useState } from "react";
import { Users, UserRoundCheck, X } from "lucide-react";

import Avatar from "../../common/Avatar";

import {
  getFriendProfiles,
  getMutualFriendProfiles,
} from "../../../services/friendshipService";

import { useAuth } from "../../../contexts/AuthContext";

import styles from "./ProfileNetwork.module.css";

export default function ProfileNetwork({
  profileId,
  friendsCount = 0,
  mutualFriendsCount = 0,
}) {
  const { user } = useAuth();

  const [modalType, setModalType] = useState(null);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  async function openNetwork(type) {
    setModalType(type);
    setPeople([]);
    setLoading(true);

    try {
      let data = [];

      if (type === "friends") {
        data = await getFriendProfiles(profileId);
      }

      if (type === "mutual") {
        data = await getMutualFriendProfiles(
          user?.id,
          profileId
        );
      }

      setPeople(data);
    } catch (error) {
      console.error(
        "Error cargando red de confianza:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setModalType(null);
    setPeople([]);
  }

  const modalTitle =
    modalType === "friends"
      ? "Amigos"
      : "Amigos en común";

  return (
    <>
      <section className={styles.card}>
        <h2 className={styles.title}>
          Red de confianza
        </h2>

        <div className={styles.items}>

          <button
            type="button"
            className={styles.item}
            onClick={() => openNetwork("friends")}
          >
            <div className={styles.icon}>
              <Users size={20} />
            </div>

            <div className={styles.content}>
              <span className={styles.label}>
                Amigos
              </span>

              <strong className={styles.value}>
                {friendsCount}
              </strong>
            </div>
          </button>


          <button
            type="button"
            className={styles.item}
            onClick={() => openNetwork("mutual")}
          >
            <div className={styles.icon}>
              <UserRoundCheck size={20} />
            </div>

            <div className={styles.content}>
              <span className={styles.label}>
                Amigos en común
              </span>

              <strong className={styles.value}>
                {mutualFriendsCount}
              </strong>
            </div>
          </button>

        </div>
      </section>


      {modalType && (
        <div
          className={styles.overlay}
          onClick={closeModal}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >

            <div className={styles.modalHeader}>
              <h3>{modalTitle}</h3>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>


            <div className={styles.modalContent}>

              {loading && (
                <p className={styles.empty}>
                  Cargando...
                </p>
              )}


              {!loading && people.length === 0 && (
                <p className={styles.empty}>
                  {modalType === "friends"
                    ? "No tiene amigos todavía."
                    : "No tenéis amigos en común."}
                </p>
              )}


              {!loading &&
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