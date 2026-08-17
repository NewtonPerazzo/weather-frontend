import type { ReactNode } from "react";
import { LanguageSwitcher } from "../components/molecules/LanguageSwitcher";

export function AuthTemplate({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-5xl justify-end">
        <LanguageSwitcher />
      </div>
      {children}
    </main>
  );
}
