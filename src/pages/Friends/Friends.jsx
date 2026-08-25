import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Users,
    UserPlus,
    Check,
    X,
    Search,
    UserRound,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import Avatar from "../../components/common/Avatar";
import useProfile from "../../hooks/useProfile";

import useFriends from "../../hooks/useFriends";

import {
    searchPlayers,
    sendFriendRequest,
} from "../../services/matchService";

import styles from "./Friends.module.css";

export default function FriendsPage() {
    const {
        profile,
        loading: profileLoading,
    } = useProfile();

    const {
        friends,
        requests,
        loading,
        error,
        acceptRequest,
        rejectRequest,
    } = useFriends();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const [processingId, setProcessingId] = useState(null);
    const [sendingRequestId, setSendingRequestId] = useState(null);

    async function handleSearch(value) {
        setSearchTerm(value);

        const term = value.trim();

        if (!term) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);

            const results = await searchPlayers(term);

            setSearchResults(results);
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "No se pudieron buscar jugadores"
            );
        } finally {
            setSearching(false);
        }
    }

    async function handleAccept(id) {
        try {
            setProcessingId(id);

            await acceptRequest(id);
            setSearchResults((prev) =>
                prev.map((player) =>
                    player.friendshipId === id
                        ? {
                            ...player,
                            friendshipStatus: "FRIENDS",
                        }
                        : player
                )
            );

            window.dispatchEvent(
                new Event("friendships-updated")
            );

            toast.success(
                "Solicitud de amistad aceptada"
            );
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "No se pudo aceptar la solicitud"
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function handleReject(id) {
        try {
            setProcessingId(id);

            await rejectRequest(id);

            window.dispatchEvent(
                new Event("friendships-updated")
            );

            toast.success(
                "Solicitud rechazada"
            );
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "No se pudo rechazar la solicitud"
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function handleSendRequest(playerId) {
        try {
            setSendingRequestId(playerId);

            await sendFriendRequest(playerId);

            toast.success(
                "Solicitud de amistad enviada"
            );

            setSearchResults((prev) =>
                prev.map((player) =>
                    player.id === playerId
                        ? {
                            ...player,
                            friendshipStatus:
                                "PENDING_SENT",
                        }
                        : player
                )
            );
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "No se pudo enviar la solicitud"
            );
        } finally {
            setSendingRequestId(null);
        }
    }

    function getPlayerName(profile) {
        return (
            profile?.display_name ||
            `${profile?.first_name || ""} ${profile?.last_name || ""
                }`.trim() ||
            "Jugador"
        );
    }

    function getProfile(request) {
        return (
            request?.profile ||
            request?.profiles ||
            null
        );
    }

    if (loading || profileLoading) {
        return (
            <>
                <Layout>
                    <div className={styles.loading}>
                        Cargando amigos...
                    </div>
                </Layout>

                <BottomNavigation />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Layout>
                    <div className={styles.error}>
                        <h2>
                            No se pudieron cargar tus amigos
                        </h2>

                        <p>
                            Inténtalo de nuevo más tarde.
                        </p>
                    </div>
                </Layout>

                <BottomNavigation />
            </>
        );
    }

    return (
        <>
            <Layout>
                <div className={styles.page}>

                    {/* CABECERA */}

                    <div className={styles.header}>
                        <div>
                            <h1>
                                <Users size={24} />
                                Amigos
                            </h1>

                            <p>
                                Conecta con otros jugadores
                            </p>
                        </div>

                        {/* AVATAR → PERFIL */}

                        <Link
                            to="/profile"
                            className={styles.profileLink}
                            aria-label="Ir a mi perfil"
                            title="Mi perfil"
                        >
                            <Avatar
                                src={profile?.avatar_url}
                                name={
                                    profile?.display_name ||
                                    user?.user_metadata?.display_name ||
                                    user?.user_metadata?.full_name ||
                                    "Jugador"
                                }
                                size="md"
                            />
                        </Link>
                    </div>

                    {/* SOLICITUDES */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>
                            <h2>
                                Solicitudes de amistad

                                {requests.length > 0 && (
                                    <span
                                        className={
                                            styles.requestCount
                                        }
                                    >
                                        {requests.length}
                                    </span>
                                )}
                            </h2>
                        </div>

                        {requests.length === 0 ? (

                            <div className={styles.emptyRequests}>

                                <div
                                    className={
                                        styles.emptyRequestsIcon
                                    }
                                >
                                    <Users size={26} />
                                </div>

                                <h3>
                                    No tienes solicitudes ahora mismo
                                </h3>

                                <p>
                                    Cuando alguien quiera añadirte
                                    como amigo, aparecerá aquí.
                                </p>

                            </div>

                        ) : (

                            <div className={styles.requestsList}>

                                {requests.map((request) => {

                                    const profile =
                                        getProfile(request);

                                    const name =
                                        getPlayerName(profile);

                                    const isProcessing =
                                        processingId === request.id;

                                    return (
                                        <div
                                            key={request.id}
                                            className={
                                                styles.requestCard
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.requestUser
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.avatar
                                                    }
                                                >
                                                    {profile?.avatar_url ? (
                                                        <img
                                                            src={
                                                                profile.avatar_url
                                                            }
                                                            alt={name}
                                                        />
                                                    ) : (
                                                        <UserRound
                                                            size={23}
                                                        />
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.userDetails
                                                    }
                                                >
                                                    <strong>
                                                        {name}
                                                    </strong>

                                                    {profile?.level_current !=
                                                        null && (
                                                            <span>
                                                                🎾 Nivel{" "}
                                                                {
                                                                    profile.level_current
                                                                }
                                                            </span>
                                                        )}

                                                    {profile?.city && (
                                                        <span>
                                                            📍 {profile.city}
                                                        </span>
                                                    )}
                                                </div>

                                            </div>

                                            <div
                                                className={
                                                    styles.requestActions
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.rejectIconButton
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    aria-label="Rechazar solicitud"
                                                    title="Rechazar solicitud"
                                                >
                                                    <X
                                                        size={21}
                                                        strokeWidth={2.5}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.acceptIconButton
                                                    }
                                                    onClick={() =>
                                                        handleAccept(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    aria-label="Aceptar solicitud"
                                                    title="Aceptar solicitud"
                                                >
                                                    <Check
                                                        size={21}
                                                        strokeWidth={2.5}
                                                    />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                    {/* BUSCADOR */}

                    <section
                        className={
                            styles.searchSection
                        }
                    >
                        <div
                            className={styles.searchBox}
                        >
                            <Search size={20} />

                            <input
                                type="text"
                                placeholder="Buscar jugadores..."
                                value={searchTerm}
                                onChange={(e) =>
                                    handleSearch(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </section>

                    {/* RESULTADOS DE BÚSQUEDA */}

                    {searchTerm.trim() && (
                        <section
                            className={
                                styles.searchResultsSection
                            }
                        >

                            <div
                                className={
                                    styles.sectionHeader
                                }
                            >
                                <h2>
                                    <Search size={18} />
                                    Jugadores
                                </h2>
                            </div>

                            {searching ? (

                                <div
                                    className={
                                        styles.searchMessage
                                    }
                                >
                                    Buscando jugadores...
                                </div>

                            ) : searchResults.length ===
                                0 ? (

                                <div
                                    className={
                                        styles.searchMessage
                                    }
                                >
                                    No se encontraron jugadores.
                                </div>

                            ) : (

                                <div className={styles.list}>

                                    {searchResults.map(
                                        (player) => {

                                            const name =
                                                getPlayerName(
                                                    player
                                                );

                                            const isSending =
                                                sendingRequestId ===
                                                player.id;

                                            const friendshipStatus =
                                                player.friendshipStatus ||
                                                "NONE";

                                            const disabled =
                                                isSending ||
                                                friendshipStatus ===
                                                "PENDING_SENT" ||
                                                friendshipStatus ===
                                                "FRIENDS";

                                            return (
                                                <div
                                                    key={player.id}
                                                    className={
                                                        styles.friendCard
                                                    }
                                                >

                                                    <div
                                                        className={
                                                            styles.requestUser
                                                        }
                                                    >

                                                        <div
                                                            className={
                                                                styles.avatar
                                                            }
                                                        >
                                                            {player.avatar_url ? (
                                                                <img
                                                                    src={
                                                                        player.avatar_url
                                                                    }
                                                                    alt={name}
                                                                />
                                                            ) : (
                                                                <UserRound
                                                                    size={22}
                                                                />
                                                            )}
                                                        </div>

                                                        <div
                                                            className={
                                                                styles.userDetails
                                                            }
                                                        >
                                                            <strong>
                                                                {name}
                                                            </strong>

                                                            {player.level_current !=
                                                                null && (
                                                                    <span>
                                                                        🎾 Nivel{" "}
                                                                        {
                                                                            player.level_current
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        className={
                                                            friendshipStatus ===
                                                                "FRIENDS"
                                                                ? styles.friendsButton
                                                                : friendshipStatus ===
                                                                    "PENDING_SENT"
                                                                    ? styles.sentButton
                                                                    : styles.addFriendButton
                                                        }
                                                        onClick={() => {

                                                            if (
                                                                friendshipStatus ===
                                                                "NONE"
                                                            ) {
                                                                handleSendRequest(
                                                                    player.id
                                                                );
                                                            }

                                                            if (
                                                                friendshipStatus ===
                                                                "PENDING_RECEIVED"
                                                            ) {
                                                                handleAccept(
                                                                    player.friendshipId
                                                                );
                                                            }

                                                        }}
                                                        disabled={disabled}
                                                    >

                                                        {friendshipStatus ===
                                                            "FRIENDS" ? (
                                                            <>
                                                                <Users size={16} />
                                                                Amigos
                                                            </>
                                                        ) : friendshipStatus ===
                                                            "PENDING_SENT" ? (
                                                            <>
                                                                <Check size={16} />
                                                                Enviada
                                                            </>
                                                        ) : friendshipStatus ===
                                                            "PENDING_RECEIVED" ? (
                                                            <>
                                                                <Check size={16} />
                                                                Aceptar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserPlus
                                                                    size={16}
                                                                />

                                                                {isSending
                                                                    ? "Enviando..."
                                                                    : "Añadir"}
                                                            </>
                                                        )}

                                                    </button>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </section>
                    )}

                    {/* MIS AMIGOS */}

                    <section className={styles.section}>

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >
                            <h2>
                                <Users size={18} />
                                Mis amigos
                            </h2>

                            <span
                                className={
                                    styles.totalLabel
                                }
                            >
                                {friends.length}
                            </span>
                        </div>

                        {friends.length === 0 ? (

                            <div className={styles.empty}>

                                <div
                                    className={
                                        styles.emptyIcon
                                    }
                                >
                                    <Users size={30} />
                                </div>

                                <h3>
                                    Todavía no tienes amigos
                                </h3>

                                <p>
                                    Busca jugadores y empieza a
                                    crear tu círculo de confianza.
                                </p>

                                <button
                                    type="button"
                                    className={
                                        styles.primaryButton
                                    }
                                    onClick={() => {
                                        document
                                            .querySelector(
                                                `.${styles.searchBox} input`
                                            )
                                            ?.focus();
                                    }}
                                >
                                    <UserPlus size={18} />
                                    Buscar jugadores
                                </button>

                            </div>

                        ) : (

                            <div className={styles.list}>

                                {friends.map((friend) => {

                                    const profile =
                                        getProfile(friend);

                                    const name =
                                        getPlayerName(profile);

                                    return (
                                        <div
                                            key={friend.id}
                                            className={
                                                styles.friendCard
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.requestUser
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.avatar
                                                    }
                                                >
                                                    {profile?.avatar_url ? (
                                                        <img
                                                            src={
                                                                profile.avatar_url
                                                            }
                                                            alt={name}
                                                        />
                                                    ) : (
                                                        <UserRound
                                                            size={22}
                                                        />
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.userDetails
                                                    }
                                                >
                                                    <strong>
                                                        {name}
                                                    </strong>

                                                    {profile?.level_current !=
                                                        null && (
                                                            <span>
                                                                🎾 Nivel{" "}
                                                                {
                                                                    profile.level_current
                                                                }
                                                            </span>
                                                        )}
                                                </div>

                                            </div>

                                            <Link
                                                to={`/profile/${friend.friend_id}`}
                                                className={styles.profileButton}
                                            >
                                                Ver perfil
                                            </Link>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                </div>
            </Layout>

            <BottomNavigation />
        </>
    );
}