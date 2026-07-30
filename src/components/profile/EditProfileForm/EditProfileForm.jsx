import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Avatar from "../../common/Avatar";

import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";

import styles from "./EditProfileForm.module.css";

const HAND_OPTIONS = [
    { value: "right", label: "Derecha" },
    { value: "left", label: "Izquierda" },
];

const SIDE_OPTIONS = [
    { value: "drive", label: "Drive" },
    { value: "reves", label: "Revés" },
    { value: "ambos", label: "Ambos" },
];

export default function EditProfileForm({
    profile,
    onSubmit,
    loading,
}) {
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        display_name: profile.display_name || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        city: profile.city || "",
        bio: profile.bio || "",
        dominant_hand: profile.dominant_hand || "right",
        preferred_side: profile.preferred_side || "drive",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    function handleAvatarChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Solo se permiten imágenes JPG, PNG o WEBP.");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (file.size > maxSize) {
            alert("La imagen no puede superar los 5 MB.");
            return;
        }

        setAvatarFile(file);
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await onSubmit(formData, avatarFile);

        navigate("/profile");
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <div className={styles.avatarSection}>
                <Avatar
                    src={
                        avatarFile
                            ? URL.createObjectURL(avatarFile)
                            : profile.avatar_url
                    }
                    name={profile.display_name}
                    size="xl"
                />

                <p className={styles.avatarLabel}>
                    Foto de perfil
                </p>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Cambiar foto
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={handleAvatarChange}
                />
            </div>

            <Input
                id="display_name"
                name="display_name"
                label="Nombre visible"
                value={formData.display_name}
                onChange={handleChange}
            />

            <Input
                id="first_name"
                name="first_name"
                label="Nombre"
                value={formData.first_name}
                onChange={handleChange}
            />

            <Input
                id="last_name"
                name="last_name"
                label="Apellidos"
                value={formData.last_name}
                onChange={handleChange}
            />

            <Input
                id="city"
                name="city"
                label="Ciudad"
                value={formData.city}
                onChange={handleChange}
            />

            <Select
                id="dominant_hand"
                name="dominant_hand"
                label="Mano dominante"
                value={formData.dominant_hand}
                onChange={handleChange}
                options={HAND_OPTIONS}
            />

            <Select
                id="preferred_side"
                name="preferred_side"
                label="Lado preferido"
                value={formData.preferred_side}
                onChange={handleChange}
                options={SIDE_OPTIONS}
            />

            <Textarea
                id="bio"
                name="bio"
                label="Biografía"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
            />

            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/profile")}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    loading={loading}
                >
                    Guardar cambios
                </Button>
            </div>
        </form>
    );
}

EditProfileForm.propTypes = {
    profile: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};