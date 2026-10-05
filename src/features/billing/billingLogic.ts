export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateDueDate(issueDate: string, creditTermDays: number): string {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + creditTermDays);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
