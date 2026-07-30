import { useState } from "react";
import { signOut } from "../services/authService";

export default function useLogout() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    try {
      setLoading(true);

      await signOut();

      return true;
    } finally {
      setLoading(false);
    }
  }

  return {
    logout,
    loading,
  };
}