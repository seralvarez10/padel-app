import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Camera,
    ImagePlus,
    Trash2,
    Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";
import toast from "react-hot-toast";

import { useAuth } from "../../contexts/AuthContext";
import { getProfile, updateProfile } from "../../services/profileService";
import {
    uploadAvatar,
    deleteAvatar,
} from "../../services/avatarService";


import styles from "./ProfilePhotoPage.module.css";

export default function ProfilePhotoPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const fileInputRef = useRef(null);

    const [avatarUrl, setAvatarUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileError, setFileError] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;

            try {
                const profile = await getProfile(user.id);

                setAvatarUrl(profile?.avatar_url || "");
            } catch (error) {
                console.error(
                    "Error cargando foto de perfil:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user?.id]);

    function handleSelectFile(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        setFileError("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setFileError(
                "Formato no válido. Solo se permiten JPG, PNG o WEBP."
            );

            event.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (file.size > maxSize) {
            setFileError(
                "La imagen es demasiado grande. El tamaño máximo es de 5 MB."
            );

            event.target.value = "";
            return;
        }

        setSelectedFile(file);

        const preview = URL.createObjectURL(file);

        setPreviewUrl(preview);
    }

    function openFilePicker() {
        fileInputRef.current?.click();
    }

    async function handleSave() {
        if (!selectedFile || !user?.id) return;

        try {
            setSaving(true);

            const newAvatarUrl = await uploadAvatar(
                selectedFile,
                user.id
            );

            await updateProfile({
                avatar_url: newAvatarUrl,
            });

            setAvatarUrl(newAvatarUrl);
            setSelectedFile(null);
            setPreviewUrl("");

            navigate("/settings");
        } catch (error) {
            console.error(
                "Error guardando foto:",
                error
            );

            toast.error(
                "No se ha podido guardar la foto."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!avatarUrl || !user?.id) return;

        try {
            setDeleting(true);

            await deleteAvatar(avatarUrl);

            await updateProfile({
                avatar_url: null,
            });

            setAvatarUrl("");
            setPreviewUrl("");
            setSelectedFile(null);
            setShowDeleteModal(false);

        } catch (error) {
            console.error(
                "Error eliminando foto:",
                error
            );

            toast.error(
                "No se ha podido eliminar la foto."
            );
        } finally {
            setDeleting(false);
        }
    }
    function handleCancelPreview() {
        setSelectedFile(null);
        setPreviewUrl("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    if (loading) {
        return null;
    }

    const displayedImage = previewUrl || avatarUrl;

    return (
        <>
            <Layout>
                <div className={styles.container}>

                    {/* Cabecera */}

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
                            <h1>Foto de perfil</h1>

                            <p>
                                Cambia tu imagen de perfil
                            </p>
                        </div>

                    </header>

                    {/* Card principal */}

                    <section className={styles.card}>

                        <div className={styles.avatarWrapper}>

                            {displayedImage ? (
                                <img
                                    src={displayedImage}
                                    alt="Foto de perfil"
                                    className={styles.avatar}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {user?.email?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}

                            <button
                                type="button"
                                className={styles.cameraButton}
                                onClick={openFilePicker}
                                aria-label="Cambiar foto"
                            >
                                <Camera size={18} />
                            </button>

                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleSelectFile}
                            className={styles.fileInput}
                        />

                        <p className={styles.description}>
                            Selecciona una imagen para utilizarla como
                            foto de perfil.
                        </p>

                        <p className={styles.fileRequirements}>
                            Formatos permitidos: JPG, PNG o WEBP · Tamaño máximo: 5 MB
                        </p>

                        {fileError && (
                            <p className={styles.fileError}>
                                {fileError}
                            </p>
                        )}

                        <button
                            type="button"
                            className={styles.uploadButton}
                            onClick={openFilePicker}
                        >
                            <ImagePlus size={19} />
                            {selectedFile
                                ? "Cambiar foto"
                                : "Subir nueva foto"}
                        </button>

                        {selectedFile && (
                            <div className={styles.previewActions}>

                                <button
                                    type="button"
                                    className={styles.cancelPreviewButton}
                                    onClick={handleCancelPreview}
                                    disabled={saving}
                                >
                                    Cancelar cambio
                                </button>

                                <button
                                    type="button"
                                    className={styles.saveButton}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Guardando..."
                                        : "Guardar cambios"}
                                </button>

                            </div>
                        )}

                        {avatarUrl && !selectedFile && (
                            <button
                                type="button"
                                className={styles.deleteButton}
                                onClick={() => setShowDeleteModal(true)}
                                disabled={deleting}
                            >
                                <Trash2 size={18} />

                                {deleting
                                    ? "Eliminando..."
                                    : "Eliminar foto actual"}
                            </button>
                        )}

                    </section>

                    {/* Información */}

                    <section className={styles.infoCard}>

                        <Info size={16} />

                        <p>
                            Usa una foto clara donde se vea bien la cara.
                            Ayuda a que otros jugadores confíen más en tu
                            perfil.
                        </p>

                    </section>

                </div>
                {showDeleteModal && (
                    <div
                        className={styles.modalOverlay}
                        onClick={() => {
                            if (!deleting) {
                                setShowDeleteModal(false);
                            }
                        }}
                    >
                        <div
                            className={styles.modal}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className={styles.modalIcon}>
                                <Trash2 size={22} />
                            </div>

                            <h2>¿Eliminar foto de perfil?</h2>

                            <p>
                                Se eliminará tu foto actual de perfil.
                                Podrás subir una nueva cuando quieras.
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.modalCancel}
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className={styles.modalDelete}
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting
                                        ? "Eliminando..."
                                        : "Eliminar foto"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Layout>

            <BottomNavigation />
        </>
    );
}