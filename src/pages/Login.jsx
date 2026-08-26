import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
} from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import toast from "react-hot-toast";

import { signIn } from "../services/authService";

import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Introduce tu correo electrónico.");
      return;
    }

    if (!password.trim()) {
      toast.error("Introduce tu contraseña.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn(
        email,
        password
      );

      if (error) {
        toast.error(
          "El correo o la contraseña no son correctos."
        );
        return;
      }

      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para seguir organizando partidos"
    >

      <form
        className={styles.form}
        onSubmit={handleLogin}
      >

        <AuthInput
          label="Correo electrónico"
          icon={Mail}
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          autoComplete="email"
        />

        <div className={styles.passwordField}>

          <div className={styles.passwordHeader}>
            <span>Contraseña</span>

            <button
              type="button"
              className={styles.forgotButton}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <AuthInput
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
          />

        </div>

        <AuthButton
          type="submit"
          loading={loading}
        >
          Iniciar sesión
        </AuthButton>

      </form>

      <div className={styles.divider}>
        <span></span>
        <p>o continúa con</p>
        <span></span>
      </div>

      <button
        type="button"
        className={styles.googleButton}
      >
        <span className={styles.googleIcon}>
          G
        </span>

        <span>
          Continuar con Google
        </span>
      </button>

      <p className={styles.footer}>
        ¿No tienes cuenta?{" "}
        <Link to="/register">
          Regístrate
        </Link>
      </p>

    </AuthLayout>
  );
}