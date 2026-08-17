import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CloudSun, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api, ApiError } from "../../api";
import { countries } from "../../constants/countries";
import type { AuthTokens } from "../../types";
import { formatPhone } from "../../utils/phone";
import { Button } from "../atoms/Button";
import { FeedbackMessage } from "../atoms/FeedbackMessage";
import { FormField } from "../molecules/FormField";
import { PasswordField } from "../molecules/PasswordField";

type AuthFormValues = {
  countryCode: string;
  dialCode: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
};
type AuthFormProps = { onLogin: (tokens: AuthTokens) => void };

export function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<AuthFormValues>({
    defaultValues: { countryCode: "BR", dialCode: "+55" },
  });
  const countryCode = watch("countryCode");

  function setMode(registerMode: boolean) {
    setIsRegister(registerMode);
    setMessage("");
    setRequestError("");
  }
  function updateCountry(code: string) {
    const country = countries.find((item) => item.code === code);
    if (country) {
      setValue("countryCode", country.code);
      setValue("dialCode", country.dialCode);
      setValue("phone", "");
    }
  }
  const onSubmit = handleSubmit(async (data) => {
    setMessage("");
    setRequestError("");
    setIsLoading(true);
    try {
      if (isRegister) {
        await api.register({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          password: data.password,
          phone: `${data.dialCode} ${data.phone}`,
        });
        setMode(false);
        setMessage(t("accountCreated"));
        reset({ countryCode: "BR", dialCode: "+55" });
      } else {
        onLogin(await api.login(data.email, data.password));
      }
    } catch (error) {
      setRequestError(
        error instanceof ApiError ? error.message : t("requestError"),
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 md:grid-cols-[.9fr_1.1fr]">
      <div className="bg-sky-700 p-8 text-white md:p-12">
        <CloudSun className="mb-8" size={42} />
        <p className="text-lg font-black">{t("app")}</p>
        <h1 className="mt-5 text-4xl font-black leading-tight">
          {t("tagline")}
        </h1>
        <p className="mt-5 text-sky-100">
          {isRegister ? t("registerHint") : t("loginHint")}
        </p>
      </div>
      <div className="p-8 md:p-12">
        <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
          <button
            className={`auth-tab ${!isRegister ? "auth-tab-active" : ""}`}
            onClick={() => setMode(false)}
            type="button"
          >
            {t("login")}
          </button>
          <button
            className={`auth-tab ${isRegister ? "auth-tab-active" : ""}`}
            onClick={() => setMode(true)}
            type="button"
          >
            {t("register")}
          </button>
        </div>
        <h2 className="text-2xl font-black text-slate-950">
          {isRegister ? t("register") : t("welcome")}
        </h2>
        <form className="mt-7 space-y-4" noValidate onSubmit={onSubmit}>
          {isRegister ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                error={errors.firstName?.message}
                label={t("firstName")}
                {...register("firstName", {
                  required: "First name is required.",
                })}
              />
              <FormField
                error={errors.lastName?.message}
                label={t("lastName")}
                {...register("lastName", {
                  required: "Last name is required.",
                })}
              />
            </div>
          ) : null}
          <FormField
            error={errors.email?.message}
            icon={<Mail size={17} />}
            label={t("email")}
            type="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          {isRegister ? (
            <div>
              <p className="field-label">{t("phone")}</p>
              <div className="mt-1.5 flex gap-2">
                <select
                  className="w-36 rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-sm font-semibold text-slate-950"
                  onChange={(event) => updateCountry(event.target.value)}
                  value={countryCode}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.dialCode}
                    </option>
                  ))}
                </select>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: "Phone number is required.",
                    validate: (value) =>
                      value.replace(/\D/g, "").length >= 6 ||
                      "Enter a valid phone number.",
                  }}
                  render={({ field }) => (
                    <input
                      className="input"
                      inputMode="numeric"
                      placeholder={
                        countryCode === "BR" ? "(11) 99999-9999" : "123 456 789"
                      }
                      type="tel"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          formatPhone(event.target.value, countryCode),
                        )
                      }
                    />
                  )}
                />
              </div>
              {errors.phone?.message ? (
                <span className="mt-1 block text-xs font-semibold text-rose-700">
                  {errors.phone.message}
                </span>
              ) : null}
              <input type="hidden" {...register("dialCode")} />
            </div>
          ) : null}
          <PasswordField
            error={errors.password?.message}
            label={t("password")}
            registration={register("password", {
              required: "Password is required.",
              minLength: {
                value: 3,
                message: "Password must have at least 3 characters.",
              },
            })}
          />
          {requestError ? (
            <FeedbackMessage type="error">{requestError}</FeedbackMessage>
          ) : null}
          {message ? (
            <FeedbackMessage type="success">{message}</FeedbackMessage>
          ) : null}
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? t("loading") : isRegister ? t("register") : t("login")}
          </Button>
        </form>
      </div>
    </section>
  );
}
