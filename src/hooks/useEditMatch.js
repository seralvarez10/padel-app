import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useMatch from "./useMatch";
import { updateMatch } from "../services/matchService";

export default function useEditMatch() {
    const { id } = useParams();

    const {
        match,
        loading: matchLoading,
    } = useMatch(id);

    const [form, setForm] = useState({
        title: "",
        location: "",
        city: "",
        match_date: "",
        match_time: "",
        level_min: 2,
        level_max: 4,
        match_type: "Libre",
        court_type: "Indoor",
        duration: 90,
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!match) return;

        setForm({
            title: match.title || "",
            location: match.location || "",
            city: match.city || "",
            match_date: match.match_date || "",
            match_time: match.match_time?.slice(0, 5) || "",
            level_min: match.level_min ?? 2,
            level_max: match.level_max ?? 4,
            match_type: match.match_type || "Libre",
            court_type: match.court_type || "Indoor",
            duration: match.duration ?? 90,
            description: match.description || "",
        });
    }, [match]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function submit() {
        try {
            setLoading(true);
            setError(null);

            if (!form.title.trim()) {
                throw new Error("Debes introducir un título.");
            }

            if (!form.location.trim()) {
                throw new Error("Debes indicar el club.");
            }

            if (!form.city.trim()) {
                throw new Error("Debes indicar la ciudad.");
            }

            if (!form.match_date) {
                throw new Error("Selecciona una fecha.");
            }

            if (!form.match_time) {
                throw new Error("Selecciona una hora.");
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const selectedDate = new Date(form.match_date);

            if (selectedDate < today) {
                throw new Error("La fecha no puede ser anterior a hoy.");
            }

            const now = new Date();

            const selectedDateTime = new Date(
                `${form.match_date}T${form.match_time}`
            );

            if (selectedDateTime < now) {
                throw new Error(
                    "La fecha y la hora deben ser posteriores a la actual."
                );
            }

            if (Number(form.level_min) > Number(form.level_max)) {
                throw new Error(
                    "El nivel mínimo no puede ser mayor que el nivel máximo."
                );
            }

            const cleanForm = {
                ...form,
                title: form.title.trim(),
                location: form.location.trim(),
                city: form.city.trim(),
                description: form.description.trim(),
            };

            const updatedMatch = await updateMatch(id, cleanForm);

            return updatedMatch;
        } catch (err) {
            console.error(err);

            setError(err.message);

            toast.error(err.message);

            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        form,
        loading: loading || matchLoading,
        error,
        handleChange,
        submit,
    };
}