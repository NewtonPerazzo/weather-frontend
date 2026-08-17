import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function TextInput({
  className = "",
  hasError = false,
  ...props
}: TextInputProps) {
  const errorClasses = hasError
    ? "border-rose-500 focus:border-rose-600 focus:ring-rose-100"
    : "";
  return <input className={`input ${errorClasses} ${className}`} {...props} />;
}
