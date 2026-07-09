import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Entrar
        </button>

      </form>

      <br />

      <Link to="/register">
        ¿No tienes cuenta? Regístrate
      </Link>

    </div>
  );
}