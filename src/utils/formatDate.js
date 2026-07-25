export function formatMatchDate(dateString) {
  const date = new Date(dateString);

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return "Mañana";
  }

  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}