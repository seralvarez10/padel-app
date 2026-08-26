import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Bell,
    CalendarDays,
    RefreshCw,
    UserPlus,
    UsersRound,
    Star,
    MessageCircle,
    Info,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import toast from "react-hot-toast";

import { useAuth } from "../../contexts/AuthContext";
import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

import styles from "./NotificationsPage.module.css";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [settings, setSettings] = useState({
        notify_match_changes: true,
        notify_match_reminders: true,
        notify_match_invitations: true,
        notify_friend_requests: true,
        notify_connections: true,
        notify_endorsements: true,
        notify_chat: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);

    useEffect(() => {
        async function loadNotifications() {
            if (!user?.id) return;

            try {
                const profile = await getProfile(user.id);

                setSettings({
                    notify_match_changes:
                        profile?.notify_match_changes ?? true,

                    notify_match_reminders:
                        profile?.notify_match_reminders ?? true,

                    notify_match_invitations:
                        profile?.notify_match_invitations ?? true,

                    notify_friend_requests:
                        profile?.notify_friend_requests ?? true,

                    notify_connections:
                        profile?.notify_connections ?? true,

                    notify_endorsements:
                        profile?.notify_endorsements ?? true,

                    notify_chat:
                        profile?.notify_chat ?? true,
                });
            } catch (error) {
                console.error(
                    "Error cargando notificaciones:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, [user?.id]);

    async function toggleSetting(field) {
        const newValue = !settings[field];

        setSettings((prev) => ({
            ...prev,
            [field]: newValue,
        }));

        try {
            setSaving(field);

            await updateProfile({
                [field]: newValue,
            });
        } catch (error) {
            console.error(
                "Error actualizando notificaciones:",
                error
            );

            setSettings((prev) => ({
                ...prev,
                [field]: !newValue,
            }));

            toast.error(
                "No se ha podido actualizar la configuración."
            );
        } finally {
            setSaving(null);
        }
    }

    if (loading) {
        return null;
    }

    return (
        <>
            <Layout>
                <div className={styles.container}>

                    {/* HEADER */}

                    <header className={styles.header}>

                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={() => navigate("/settings")}
                            aria-label="Volver"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h1>Notificaciones</h1>

                            <p>
                                Gestiona qué avisos quieres recibir
                            </p>
                        </div>

                    </header>

                    {/* PARTIDOS */}

                    <section className={styles.section}>

                        <h2>PARTIDOS</h2>

                        <div className={styles.card}>

                            <NotificationToggle
                                icon={RefreshCw}
                                title="Cambios en mis partidos"
                                description="Recibe avisos cuando cambie un partido en el que participas"
                                value={settings.notify_match_changes}
                                disabled={
                                    saving === "notify_match_changes"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_match_changes"
                                    )
                                }
                            />

                            <NotificationToggle
                                icon={CalendarDays}
                                title="Recordatorios de partidos"
                                description="Recibe un aviso antes de tus próximos partidos"
                                value={
                                    settings.notify_match_reminders
                                }
                                disabled={
                                    saving === "notify_match_reminders"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_match_reminders"
                                    )
                                }
                            />
                            <NotificationToggle
                                icon={CalendarDays}
                                title="Invitaciones a partidos"
                                description="Cuando alguien te invite a un partido"
                                value={settings.notify_match_invitations}
                                disabled={
                                    saving === "notify_match_invitations"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_match_invitations"
                                    )
                                }
                            />

                        </div>

                    </section>

                    {/* RED Y CONFIANZA */}

                    <section className={styles.section}>

                        <h2>RED Y CONFIANZA</h2>

                        <div className={styles.card}>

                            <NotificationToggle
                                icon={UserPlus}
                                title="Solicitudes de amistad"
                                description="Cuando otro jugador quiera conectar contigo"
                                value={
                                    settings.notify_friend_requests
                                }
                                disabled={
                                    saving ===
                                    "notify_friend_requests"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_friend_requests"
                                    )
                                }
                            />

                            <NotificationToggle
                                icon={UsersRound}
                                title="Nuevas conexiones"
                                description="Cuando alguien acepte tu solicitud de amistad"
                                value={settings.notify_connections}
                                disabled={
                                    saving ===
                                    "notify_connections"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_connections"
                                    )
                                }
                            />

                            <NotificationToggle
                                icon={Star}
                                title="Nuevos avales"
                                description="Cuando otro jugador te dé un aval"
                                value={
                                    settings.notify_endorsements
                                }
                                disabled={
                                    saving ===
                                    "notify_endorsements"
                                }
                                onChange={() =>
                                    toggleSetting(
                                        "notify_endorsements"
                                    )
                                }
                            />

                        </div>

                    </section>

                    {/* CHAT */}

                    <section className={styles.section}>

                        <h2>CHAT</h2>

                        <div className={styles.card}>

                            <NotificationToggle
                                icon={MessageCircle}
                                title="Mensajes de partidos"
                                description="Cuando recibas un mensaje en el chat de un partido"
                                value={settings.notify_chat}
                                disabled={
                                    saving === "notify_chat"
                                }
                                onChange={() =>
                                    toggleSetting("notify_chat")
                                }
                            />

                        </div>

                    </section>

                    {/* AVISOS IMPORTANTES */}

                    <section className={styles.notice}>

                        <Info size={20} />

                        <div>
                            <strong>Avisos importantes</strong>

                            <p>
                                Las cancelaciones y cambios importantes
                                de un partido siempre se mostrarán para
                                que no pierdas información relevante.
                            </p>
                        </div>

                    </section>

                </div>
            </Layout>

            <BottomNavigation />
        </>
    );
}


/* =========================================
   TOGGLE
========================================= */

function NotificationToggle({
    icon: Icon,
    title,
    description,
    value,
    onChange,
    disabled,
}) {
    return (
        <div className={styles.option}>

            <div className={styles.icon}>
                <Icon size={20} />
            </div>

            <div className={styles.content}>

                <strong>{title}</strong>

                <span>{description}</span>

            </div>

            <button
                type="button"
                className={`${styles.switch} ${value ? styles.switchOn : ""
                    }`}
                onClick={onChange}
                disabled={disabled}
                aria-pressed={value}
                aria-label={`${title}: ${value ? "activado" : "desactivado"
                    }`}
            >
                <span />
            </button>

        </div>
    );
}