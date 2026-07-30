import { Navigate } from "react-router-dom";

import useProfile from "../../hooks/useProfile";
import useEditProfile from "../../hooks/useEditProfile";

import EditProfileForm from "../../components/profile/EditProfileForm";

export default function EditProfilePage() {
    const { profile, loading } = useProfile();
    const { save, loading: saving } = useEditProfile();

    if (loading) return null;

    async function handleSubmit(values, avatarFile) {
        await save(values, avatarFile, profile.avatar_url);
    }

    if (!profile) {
        return <Navigate to="/profile" replace />;
    }

    return (
        <EditProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            loading={saving}
        />
    );
}