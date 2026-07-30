import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { signIn } from "../services/authService";

import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para seguir organizando partidos."
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
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Contraseña"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton
          type="submit"
          loading={loading}
        >
          Iniciar sesión
        </AuthButton>
      </form>

      <p className={styles.footer}>
        ¿No tienes cuenta?{" "}
        <Link to="/register">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}