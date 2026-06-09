export function formatDate(value: Date | string | number) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

export function formatFullDate(value: Date | string | number) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}
