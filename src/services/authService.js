import { supabase } from "../lib/supabase";

export async function signUp(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
export async function updateProfile(userId, data) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId);

  if (error) throw error;
}
export async function changePassword(
  currentPassword,
  newPassword
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user?.email) {
    throw new Error("No se ha encontrado el usuario.");
  }

  // Comprobar contraseña actual
  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

  if (signInError) {
    throw new Error("La contraseña actual no es correcta.");
  }

  // Cambiar contraseña
  const { error: updateError } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (updateError) {
    throw updateError;
  }
}