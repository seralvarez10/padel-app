import { useState } from "react";
import { signUp } from "../services/authService";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        const { data, error } = await signUp(email, password);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        alert("Usuario creado correctamente");
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Registro</h1>

            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button type="submit">
                    Registrarse
                </button>
            </form>
        </div>
    );
}