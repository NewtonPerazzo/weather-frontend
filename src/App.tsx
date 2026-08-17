import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import type { AuthTokens } from "./types";

const TOKEN_STORAGE_KEY = "weather_access_token";

export default function App() {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  function handleLogin(tokens: AuthTokens) {
    localStorage.setItem(TOKEN_STORAGE_KEY, tokens.access_token);
    setAccessToken(tokens.access_token);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAccessToken(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            accessToken ? (
              <Navigate replace to="/" />
            ) : (
              <AuthPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            accessToken ? (
              <DashboardPage
                accessToken={accessToken}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate replace to={accessToken ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
