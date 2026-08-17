import type { InputHTMLAttributes, ReactNode } from "react";

import { TextInput } from "../atoms/TextInput";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  icon?: ReactNode;
  label: string;
};

export function FormField({ error, icon, label, ...props }: FormFieldProps) {
  return (
    <label className="field-label">
      {label}
      <span className="relative mt-1.5 block">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        ) : null}
        <TextInput
          className={icon ? "pl-10" : ""}
          hasError={Boolean(error)}
          {...props}
        />
      </span>
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-rose-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
