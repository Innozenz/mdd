/** Formate une date en français (ex. « 5 septembre 2026 »). */
export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date);
