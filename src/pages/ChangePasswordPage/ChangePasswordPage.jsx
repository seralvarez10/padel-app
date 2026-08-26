import { useState } from "react";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import BottomNavigation from "../../components/layout/BottomNavigation";

import { changePassword } from "../../services/authService";

import styles from "./ChangePasswordPage.module.css";

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [saving, setSaving] = useState(false);

    function validate() {
        if (!currentPassword) {
            return "Introduce tu contraseña actual.";
        }

        if (!newPassword) {
            return "Introduce una nueva contraseña.";
        }

        if (newPassword.length < 8) {
            return "La nueva contraseña debe tener al menos 8 caracteres.";
        }

        if (newPassword === currentPassword) {
            return "La nueva contraseña debe ser diferente de la actual.";
        }

        if (!confirmPassword) {
            return "Confirma tu nueva contraseña.";
        }

        if (newPassword !== confirmPassword) {
            return "Las contraseñas no coinciden.";
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);

            await changePassword(
                currentPassword,
                newPassword
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setSuccess(
                "Tu contraseña se ha cambiado correctamente."
            );

            setTimeout(() => {
                navigate("/settings");
            }, 1500);
        } catch (error) {
            console.error(
                "Error cambiando contraseña:",
                error
            );

            setError(
                error.message ||
                "No se ha podido cambiar la contraseña."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Layout>
                <div className={styles.container}>

                    {/* CABECERA */}

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
                            <h1>Cambiar contraseña</h1>

                            <p>
                                Actualiza la contraseña de tu cuenta
                            </p>
                        </div>

                    </header>

                    {/* CARD */}

                    <section className={styles.card}>

                        <form onSubmit={handleSubmit}>

                            {/* CONTRASEÑA ACTUAL */}

                            <div className={styles.field}>

                                <label htmlFor="currentPassword">
                                    Contraseña actual
                                </label>

                                <div className={styles.passwordWrapper}>

                                    <LockKeyhole
                                        size={18}
                                        className={styles.fieldIcon}
                                    />

                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(event) =>
                                            setCurrentPassword(event.target.value)
                                        }
                                        placeholder="Introduce tu contraseña actual"
                                        autoComplete="current-password"
                                    />

                                    <button
                                        type="button"
                                        className={styles.visibilityButton}
                                        onClick={() =>
                                            setShowCurrent((prev) => !prev)
                                        }
                                    >
                                        {showCurrent ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* NUEVA CONTRASEÑA */}

                            <div className={styles.field}>

                                <label htmlFor="newPassword">
                                    Nueva contraseña
                                </label>

                                <div className={styles.passwordWrapper}>

                                    <LockKeyhole
                                        size={18}
                                        className={styles.fieldIcon}
                                    />

                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(event.target.value)
                                        }
                                        placeholder="Introduce una nueva contraseña"
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className={styles.visibilityButton}
                                        onClick={() =>
                                            setShowNew((prev) => !prev)
                                        }
                                    >
                                        {showNew ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* CONFIRMAR CONTRASEÑA */}

                            <div className={styles.field}>

                                <label htmlFor="confirmPassword">
                                    Confirmar contraseña
                                </label>

                                <div className={styles.passwordWrapper}>

                                    <LockKeyhole
                                        size={18}
                                        className={styles.fieldIcon}
                                    />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(event.target.value)
                                        }
                                        placeholder="Repite tu nueva contraseña"
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className={styles.visibilityButton}
                                        onClick={() =>
                                            setShowConfirm((prev) => !prev)
                                        }
                                    >
                                        {showConfirm ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* REQUISITO */}

                            <div className={styles.requirements}>

                                <LockKeyhole size={16} />

                                <p>
                                    La contraseña debe tener al menos
                                    8 caracteres.
                                </p>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className={styles.error}>

                                    <AlertCircle size={17} />

                                    <span>
                                        {error}
                                    </span>

                                </div>
                            )}

                            {/* ÉXITO */}

                            {success && (
                                <div className={styles.success}>

                                    <CheckCircle2 size={17} />

                                    <span>
                                        {success}
                                    </span>

                                </div>
                            )}

                            {/* BOTÓN */}

                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={saving}
                            >
                                {saving
                                    ? "Cambiando contraseña..."
                                    : "Cambiar contraseña"}
                            </button>

                        </form>

                    </section>

                </div>
            </Layout>

            <BottomNavigation />
        </>
    );
}