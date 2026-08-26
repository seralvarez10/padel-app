import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Eye,
    UserRound,
    MapPin,
    BarChart3,
    UsersRound,
    Hand,
    FileText,
    Mail,
    Shield,
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

import styles from "./PrivacyPage.module.css";

export default function PrivacyPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [settings, setSettings] = useState({
        profile_visible: true,
        show_city: true,
        show_stats: true,
        show_network: true,
        show_game_info: true,
        show_bio: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);

    useEffect(() => {
        async function loadPrivacy() {
            if (!user?.id) return;

            try {
                const profile = await getProfile(user.id);

                setSettings({
                    profile_visible: profile?.profile_visible ?? true,
                    show_city: profile?.show_city ?? true,
                    show_stats: profile?.show_stats ?? true,
                    show_network: profile?.show_network ?? true,
                    show_game_info: profile?.show_game_info ?? true,
                    show_bio: profile?.show_bio ?? true,
                });
            } catch (error) {
                console.error(
                    "Error cargando privacidad:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadPrivacy();
    }, [user?.id]);

    async function toggleSetting(field) {
        const newValue = !settings[field];

        // Actualización optimista
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
                "Error actualizando privacidad:",
                error
            );

            // Si falla, volvemos al valor anterior
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
                            <h1>Privacidad</h1>

                            <p>
                                Controla quién puede ver tu información
                            </p>
                        </div>

                    </header>

                    {/* PERFIL */}

                    <section className={styles.section}>

                        <h2>PERFIL</h2>

                        <div className={styles.card}>

                            <PrivacyToggle
                                icon={Eye}
                                title="Perfil visible"
                                description="Permite que otros jugadores encuentren y consulten tu perfil"
                                value={settings.profile_visible}
                                disabled={saving === "profile_visible"}
                                onChange={() =>
                                    toggleSetting("profile_visible")
                                }
                            />

                        </div>

                    </section>

                    {/* INFORMACIÓN DEL PERFIL */}

                    <section className={styles.section}>

                        <h2>INFORMACIÓN DEL PERFIL</h2>

                        <div className={styles.card}>

                            <PrivacyToggle
                                icon={MapPin}
                                title="Mostrar mi ciudad"
                                description="Visible en tu perfil público"
                                value={settings.show_city}
                                disabled={saving === "show_city"}
                                onChange={() =>
                                    toggleSetting("show_city")
                                }
                            />

                            <PrivacyToggle
                                icon={BarChart3}
                                title="Mostrar mis estadísticas"
                                description="Partidos, nivel y estadísticas"
                                value={settings.show_stats}
                                disabled={saving === "show_stats"}
                                onChange={() =>
                                    toggleSetting("show_stats")
                                }
                            />

                            <PrivacyToggle
                                icon={Hand}
                                title="Mostrar información de juego"
                                description="Mano dominante y lado preferido"
                                value={settings.show_game_info}
                                disabled={saving === "show_game_info"}
                                onChange={() =>
                                    toggleSetting("show_game_info")
                                }
                            />

                            <PrivacyToggle
                                icon={FileText}
                                title="Mostrar mi biografía"
                                description="Tu descripción personal"
                                value={settings.show_bio}
                                disabled={saving === "show_bio"}
                                onChange={() =>
                                    toggleSetting("show_bio")
                                }
                            />

                            <PrivacyToggle
                                icon={UsersRound}
                                title="Mostrar mi red deportiva"
                                description="Amigos, amigos en común y avales"
                                value={settings.show_network}
                                disabled={saving === "show_network"}
                                onChange={() =>
                                    toggleSetting("show_network")
                                }
                            />

                        </div>

                    </section>

                    {/* INFORMACIÓN PRIVADA */}

                    <section className={styles.section}>

                        <h2>INFORMACIÓN PRIVADA</h2>

                        <div className={styles.card}>

                            <div className={styles.infoRow}>

                                <div className={styles.icon}>
                                    <Mail size={20} />
                                </div>

                                <div className={styles.content}>
                                    <strong>Email</strong>

                                    <span>
                                        Tu dirección de correo no se
                                        muestra a otros jugadores
                                    </span>
                                </div>

                                <span className={styles.private}>
                                    Privado
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* BLOQUEADOS */}

                    <section className={styles.section}>

                        <h2>BLOQUEADOS</h2>

                        <div className={styles.card}>

                            <button
                                type="button"
                                className={styles.infoRowButton}
                            >

                                <div className={styles.icon}>
                                    <Shield size={20} />
                                </div>

                                <div className={styles.content}>
                                    <strong>
                                        Usuarios bloqueados
                                    </strong>

                                    <span>
                                        Gestiona la lista de usuarios
                                        bloqueados
                                    </span>
                                </div>

                                <span className={styles.blockedCount}>
                                    0 usuarios
                                </span>

                            </button>

                        </div>

                    </section>

                    {/* AVISO */}

                    <section className={styles.notice}>

                        <Info size={20} />

                        <p>
                            Tu nombre y nivel siempre son visibles
                            para poder organizar partidos. Puedes
                            limitar el resto de tu información en
                            cualquier momento.
                        </p>

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

function PrivacyToggle({
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
                aria-label={`${title}: ${value ? "visible" : "oculto"
                    }`}
            >
                <span />
            </button>

        </div>
    );
}