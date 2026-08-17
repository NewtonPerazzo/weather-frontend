export function formatPhone(value: string, countryCode: string) {
  const digits = value.replace(/\D/g, "").slice(0, 15);

  if (countryCode !== "BR")
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
