import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import {
  signUp,
  updateProfile,
} from "../services/authService";

import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signUp(
        form.email,
        form.password
      );

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      await updateProfile(user.id, {
        display_name: `${form.firstName} ${form.lastName}`,
        first_name: form.firstName,
        last_name: form.lastName,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a organizar partidos y conocer nuevos jugadores."
    >
      <form
        className={styles.form}
        onSubmit={handleRegister}
      >
        <AuthInput
          label="Nombre"
          icon={User}
          name="firstName"
          placeholder="Tu nombre"
          value={form.firstName}
          onChange={handleChange}
        />

        <AuthInput
          label="Apellidos"
          icon={User}
          name="lastName"
          placeholder="Tus apellidos"
          value={form.lastName}
          onChange={handleChange}
        />

        <AuthInput
          label="Correo electrónico"
          icon={Mail}
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
        />

        <AuthInput
          label="Contraseña"
          icon={Lock}
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        <AuthInput
          label="Confirmar contraseña"
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <AuthButton
          type="submit"
          loading={loading}
        >
          Crear cuenta
        </AuthButton>
      </form>

      <p className={styles.footer}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}