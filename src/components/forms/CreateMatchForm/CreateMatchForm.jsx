import useCreateMatch from "../../../hooks/useCreateMatch";
import styles from "./CreateMatchForm.module.css";

export default function CreateMatchForm() {
  const {
    form,
    loading,
    error,
    handleChange,
    submit,
  } = useCreateMatch();

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await submit();

    if (ok) {
      alert("Partido creado correctamente");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h1>Crear Partido</h1>

      <div className={styles.group}>
        <label>Título</label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ej. Americano Nivel 3.5"
        />
      </div>

      <div className={styles.group}>
        <label>Club</label>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Nombre del club"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label>Fecha</label>

          <input
            type="date"
            name="match_date"
            value={form.match_date}
            onChange={handleChange}
          />
        </div>

        <div className={styles.group}>
          <label>Hora</label>

          <input
            type="time"
            name="match_time"
            value={form.match_time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label>Ciudad</label>

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
        />
      </div>

      <button
        className={styles.button}
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear Partido"}
      </button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}