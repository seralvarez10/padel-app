import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import { useAuth } from "../../contexts/AuthContext";
import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

import styles from "./EditProfilePage.module.css";

export default function EditProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        city: "",
        dominant_hand: "",
        preferred_side: "",
        bio: "",
    });

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;

            try {
                const profile = await getProfile(user.id);

                setForm({
                    first_name: profile?.first_name || "",
                    last_name: profile?.last_name || "",
                    city: profile?.city || "",
                    dominant_hand: profile?.dominant_hand || "",
                    preferred_side: profile?.preferred_side || "",
                    bio: profile?.bio || "",
                });
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user?.id]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleCancel() {
        navigate("/settings");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);

            const updatedProfile = await updateProfile({
                ...form,
                display_name: `${form.first_name} ${form.last_name}`.trim(),
            });

            navigate("/profile");
        } catch (error) {
            console.error("Error actualizando perfil:", error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return null;
    }

    return (
        <>
            <Layout>
                <div className={styles.container}>

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
                            <h1>Editar perfil</h1>
                            <p>Nombre, ciudad, nivel y datos personales</p>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit}>

                        <section className={styles.card}>
                            <h2>DATOS PERSONALES</h2>

                            <div className={styles.fieldFull}>
                                <label htmlFor="display_name">
                                    Nombre visible
                                </label>

                                <div className={styles.displayName}>
                                    {form.first_name} {form.last_name}
                                </div>
                            </div>

                            <div className={styles.row}>

                                <div className={styles.field}>
                                    <label htmlFor="first_name">
                                        Nombre
                                    </label>

                                    <input
                                        id="first_name"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="last_name">
                                        Apellidos
                                    </label>

                                    <input
                                        id="last_name"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            <div className={styles.fieldFull}>
                                <label htmlFor="city">
                                    Ciudad
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Oviedo"
                                />
                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2>ESTILO DE JUEGO</h2>

                            <div className={styles.row}>

                                <div className={styles.field}>
                                    <label htmlFor="hand">
                                        Mano dominante
                                    </label>

                                    <select
                                        id="dominant_hand"
                                        name="dominant_hand"
                                        value={form.dominant_hand}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Selecciona
                                        </option>

                                        <option value="right">
                                            Derecha
                                        </option>

                                        <option value="left">
                                            Izquierda
                                        </option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="preferred_side">
                                        Lado preferido
                                    </label>

                                    <select
                                        id="preferred_side"
                                        name="preferred_side"
                                        value={form.preferred_side}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Selecciona
                                        </option>

                                        <option value="drive">
                                            Drive
                                        </option>

                                        <option value="backhand">
                                            Revés
                                        </option>

                                        <option value="both">
                                            Indiferente
                                        </option>
                                    </select>
                                </div>

                            </div>
                        </section>

                        <section className={styles.card}>
                            <h2>SOBRE TI</h2>

                            <div className={styles.fieldFull}>
                                <label htmlFor="bio">
                                    Biografía
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    placeholder="Cuéntales algo sobre ti y tu forma de jugar."
                                    rows={4}
                                />
                            </div>
                        </section>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>

                    </form>

                </div>
            </Layout>

            <BottomNavigation />
        </>
    );
}