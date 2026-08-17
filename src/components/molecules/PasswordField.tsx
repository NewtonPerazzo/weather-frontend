import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { TextInput } from "../atoms/TextInput";

type PasswordFieldProps = {
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
};

export function PasswordField({
  error,
  label,
  registration,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="field-label">
      {label}
      <span className="relative mt-1.5 block">
        <LockKeyhole
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={17}
        />
        <TextInput
          className="pl-10 pr-11"
          hasError={Boolean(error)}
          type={isVisible ? "text" : "password"}
          {...registration}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-sky-800"
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-rose-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
