export function formatMatchDate(dateString) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const date = new Date(dateString);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return "Mañana";
  }

  const formatted = date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}