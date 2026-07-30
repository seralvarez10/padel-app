import { supabase } from "../lib/supabase";

export async function uploadAvatar(file, userId) {
    const extension = file.name.split(".").pop();

    const filePath = `${userId}/avatar.${extension}`;

    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: true,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function deleteAvatar(avatarUrl) {

    if (!avatarUrl) return;

    const url = new URL(avatarUrl);

    const path = url.pathname.split("/object/public/avatars/")[1];

    if (!path) return;

    const { error } = await supabase.storage
        .from("avatars")
        .remove([path]);

    if (error) throw error;
}