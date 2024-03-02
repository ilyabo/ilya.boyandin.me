export default function formatDate(date: number | Date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('en-us', { year: 'numeric' });
}
