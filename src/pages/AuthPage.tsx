import { AuthForm } from "../components/organisms/AuthForm";
import { AuthTemplate } from "../templates/AuthTemplate";
import type { AuthTokens } from "../types";

export function AuthPage({
  onLogin,
}: {
  onLogin: (tokens: AuthTokens) => void;
}) {
  return (
    <AuthTemplate>
      <AuthForm onLogin={onLogin} />
    </AuthTemplate>
  );
}
