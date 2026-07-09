import { useEffect, useState } from "react";
import { getUser, signOut } from "../services/authService";
import { getMatches } from "../services/matchService";
import { useNavigate, Link } from "react-router-dom";

function traducirEstado(status) {
  const estados = {
    PENDING: "🟡 Buscando jugadores",
    CONFIRMED: "🟢 Confirmado",
    IN_PROGRESS: "🔵 En juego",
    FINISHED: "⚫ Finalizado",
    CANCELLED: "🔴 Cancelado",
  };
  return estados[status] || status;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const currentUser = await getUser();
      setUser(currentUser);

      const data = await getMatches();
      setMatches(data);
    }
    loadData();
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>Bienvenido:</p>
          <strong>{user.email}</strong>
        </>
      )}

      <br /><br />

      <Link to="/create-match">
        <button>➕ Crear Partido</button>
      </Link>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <br /><br />

      <h2>Partidos disponibles</h2>

      {matches.length === 0 ? (
        <p>No hay partidos disponibles.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12, borderRadius: 8 }}>
            <p><strong>📍 {match.location}</strong> — {match.city}</p>
            <p>📅 {match.match_date} a las {match.match_time.slice(0, 5)}</p>
            <p>👥 {match.occupied_slots} / {match.max_players} jugadores</p>
            <p>🎾 Nivel: {match.level_min} - {match.level_max}</p>
            <p>{traducirEstado(match.status)}</p>
          </div>
        ))
      )}
    </div>
  );
}