import useCreateMatch from "../../../hooks/useCreateMatch";
import styles from "./CreateMatchForm.module.css";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import PageHeader from "../../ui/PageHeader";

import {
  Type,
  Building2,
  Calendar,
  Clock3,
  MapPin,
} from "lucide-react";

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
      <PageHeader
        title="Crear partido"
        subtitle="Organiza tu próximo partido fácilmente."
      />

      <Input
        label="Título"
        icon={Type}
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Ej. Americano Nivel 3.5"
      />

      <Input
        label="Club"
        icon={Building2}
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Nombre del club"
      />

      <div className={styles.row}>
        <Input
          label="Fecha"
          icon={Calendar}
          type="date"
          name="match_date"
          value={form.match_date}
          onChange={handleChange}
        />

        <Input
          label="Hora"
          icon={Clock3}
          type="time"
          name="match_time"
          value={form.match_time}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Ciudad"
        icon={MapPin}
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="Oviedo"
      />

      <div className={styles.group}>
        <label>Tipo de partido</label>

        <div className={styles.options}>
          {["Libre", "Americano", "Competitivo", "Mixto"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.option} ${form.match_type === type ? styles.active : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "match_type",
                    value: type,
                  },
                })
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label>Tipo de pista</label>

        <div className={styles.options}>
          {["Indoor", "Outdoor"].map((court) => (
            <button
              key={court}
              type="button"
              className={`${styles.option} ${form.court_type === court ? styles.active : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "court_type",
                    value: court,
                  },
                })
              }
            >
              {court}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label>Nivel mínimo</label>

        <input
          className={styles.slider}
          type="range"
          min="1"
          max="7"
          step="0.5"
          name="level_min"
          value={form.level_min}
          onChange={handleChange}
        />

        <span className={styles.sliderValue}>
          {form.level_min}
        </span>
      </div>

      <div className={styles.group}>
        <label>Nivel máximo</label>

        <input
          className={styles.slider}
          type="range"
          min="1"
          max="7"
          step="0.5"
          name="level_max"
          value={form.level_max}
          onChange={handleChange}
        />

        <span className={styles.sliderValue}>
          {form.level_max}
        </span>
      </div>

      <div className={styles.group}>
        <label>¿Cuántos jugadores hay apuntados?</label>

        <div className={styles.options}>
          {[1, 2, 3].map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.option} ${Number(form.occupied_slots) === value
                  ? styles.active
                  : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "occupied_slots",
                    value,
                  },
                })
              }
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label>Descripción</label>

        <textarea
          className={styles.textarea}
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe el partido..."
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear Partido"}
      </Button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}