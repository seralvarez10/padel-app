import { useState } from "react";
import { updateProfile } from "../services/profileService";
import { uploadAvatar, deleteAvatar } from "../services/avatarService";
import { supabase } from "../lib/supabase";

export default function useEditProfile() {
    const [loading, setLoading] = useState(false);

    async function save(profile, avatarFile, previousAvatarUrl) {
        setLoading(true);

        try {
            let updatedProfile = { ...profile };

            if (avatarFile) {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                if (avatarFile && previousAvatarUrl) {
                    try {
                        await deleteAvatar(previousAvatarUrl);
                    } catch (error) {
                        console.warn("No se pudo eliminar el avatar anterior:", error);
                    }
                }

                // Sube el nuevo avatar
                const avatarUrl = await uploadAvatar(avatarFile, user.id);
                updatedProfile.avatar_url = avatarUrl;
            }

            // 2. Guarda el perfil (tanto si cambió el avatar como si no)
            await updateProfile(updatedProfile);

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            throw error; // Propaga el error para manejarlo en la UI
        } finally {
            setLoading(false);
        }
    }

    return {
        save,
        loading,
    };
}
