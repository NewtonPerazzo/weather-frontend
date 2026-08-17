export type Country = {
  code: string;
  dialCode: string;
  name: string;
};

export const countries: Country[] = [
  { code: "AR", dialCode: "+54", name: "Argentina" },
  { code: "AU", dialCode: "+61", name: "Australia" },
  { code: "BR", dialCode: "+55", name: "Brazil" },
  { code: "CA", dialCode: "+1", name: "Canada" },
  { code: "CL", dialCode: "+56", name: "Chile" },
  { code: "FR", dialCode: "+33", name: "France" },
  { code: "DE", dialCode: "+49", name: "Germany" },
  { code: "IT", dialCode: "+39", name: "Italy" },
  { code: "JP", dialCode: "+81", name: "Japan" },
  { code: "MX", dialCode: "+52", name: "Mexico" },
  { code: "PT", dialCode: "+351", name: "Portugal" },
  { code: "ES", dialCode: "+34", name: "Spain" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "US", dialCode: "+1", name: "United States" },
];
