import useCreateMatch from "../../../hooks/useCreateMatch";
import styles from "./CreateMatchForm.module.css";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import FormSection from "../../ui/FormSection";
import { useNavigate } from "react-router-dom";
import MatchForm from "../MatchForm/MatchForm";

import {
  Type,
  Building2,
  Calendar,
  Clock3,
  MapPin,
  Settings2,
  Hand,
  FileText,
} from "lucide-react";

export default function CreateMatchForm() {
  const navigate = useNavigate();

  const {
    form,
    loading,
    error,
    handleChange,
    submit,
  } = useCreateMatch();

  async function handleSubmit(e) {
    e.preventDefault();

    const match = await submit();

    if (match) {
      toast.success(
        "Partido creado correctamente"
      );

      navigate(`/matches/${match.id}`);
    }
  }

  const today =
    new Date().toISOString().split("T")[0];

  const currentTime =
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const minTime =
    form.match_date === today
      ? currentTime
      : undefined;

  return (
    <MatchForm
      title="Crear partido"
      subtitle="Organiza tu próximo partido fácilmente."
      buttonText="Crear partido"
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    >

      {/* INFORMACIÓN BÁSICA */}

      <FormSection
        title="Información básica"
        icon={Type}
      >

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

      </FormSection>

      {/* FECHA */}

      <FormSection
        title="Fecha y hora"
        icon={Calendar}
      >

        <div className={styles.row}>

          <Input
            label="Fecha"
            icon={Calendar}
            type="date"
            name="match_date"
            value={form.match_date}
            onChange={handleChange}
            min={today}
          />

          <Input
            label="Hora"
            icon={Clock3}
            type="time"
            name="match_time"
            value={form.match_time}
            onChange={handleChange}
            min={minTime}
          />

        </div>

      </FormSection>

      {/* UBICACIÓN */}

      <FormSection title="📍 Ubicación" icon={MapPin}>

        <Input
          label="Ciudad"
          icon={MapPin}
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Oviedo"
        />

      </FormSection>

      {/* DETALLES */}

      <FormSection
        title="Detalles"
        icon={Settings2}
      >

        <div className={styles.group}>

          <label>
            Tipo de pista
          </label>

          <div className={`${styles.options} ${styles.positionOptions}`}>

            {["Indoor", "Outdoor"].map(
              (court) => (
                <button
                  key={court}
                  type="button"
                  className={`${styles.option} ${form.court_type === court
                    ? styles.active
                    : ""
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
              )
            )}

          </div>

        </div>

        <div className={styles.group}>

          <label>
            Nivel mínimo
          </label>

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

          <label>
            Nivel máximo
          </label>

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

      </FormSection>

      {/* POSICIÓN */}

      <FormSection title="🎾 Tu posición" icon={Hand}>

        <div className={styles.group}>

          <label>
            ¿Dónde prefieres jugar?
          </label>

          <div className={`${styles.options} ${styles.positionOptions}`}>

            <button
              type="button"
              className={`${styles.option} ${form.position === "TEAM_A_LEFT"
                ? styles.active
                : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "position",
                    value: "TEAM_A_LEFT",
                  },
                })
              }
            >
              Derecha
            </button>

            <button
              type="button"
              className={`${styles.option} ${form.position === "TEAM_A_RIGHT"
                ? styles.active
                : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "position",
                    value: "TEAM_A_RIGHT",
                  },
                })
              }
            >
              Revés
            </button>

            <button
              type="button"
              className={`${styles.option} ${form.position === "ANY"
                ? styles.active
                : ""
                }`}
              onClick={() =>
                handleChange({
                  target: {
                    name: "position",
                    value: "ANY",
                  },
                })
              }
            >
              Me da igual
            </button>

          </div>

          <p className={styles.positionHelp}>
            Podrás cambiar tu posición más adelante
            si es necesario.
          </p>

        </div>

      </FormSection>

      {/* DESCRIPCIÓN */}

      <FormSection
        title="Descripción"
        icon={FileText}
      >

        <textarea
          className={styles.textarea}
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          placeholder="Ejemplo: Buscamos gente de buen rollo para jugar un americano. Nivel aproximado 3-4."
        />

      </FormSection>

    </MatchForm>
  );
}