import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";
import ta from "@/locales/ta.json";
import te from "@/locales/te.json";
import mr from "@/locales/mr.json";
import gu from "@/locales/gu.json";
import kn from "@/locales/kn.json";
import ml from "@/locales/ml.json";
import pa from "@/locales/pa.json";

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "pa", label: "Punjabi" },
] as const;

const resources = { en, hi, bn, ta, te, mr, gu, kn, ml, pa } as const;
type LangCode = keyof typeof resources;

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const value = path.split(".").reduce<any>((acc, part) => (acc && part in acc ? acc[part] : undefined), obj);
  return typeof value === "string" ? value : undefined;
}

const legacyKeyMap = {
  account: "common.account",
  billing: "common.billing",
  support: "common.support",
  theme: "common.theme",
  language: "common.language",
  logout: "common.logout",
  features: "nav.features",
  pricing: "nav.pricing",
  sign_in: "nav.signIn",
  get_started: "nav.getStarted",
  go_dashboard: "nav.goDashboard",
  dashboard: "dashboard.dashboard",
  find_jobs: "dashboard.findJobs",
  applications: "dashboard.applications",
  saved_jobs: "dashboard.savedJobs",
  ai_tools: "dashboard.aiTools",
  resume_studio: "dashboard.resumeStudio",
  job_alerts: "dashboard.jobAlerts",
  profile: "dashboard.profile",
  recruiter_dashboard: "dashboard.recruiterDashboard",
  post_job: "dashboard.postJob",
  boost_jobs: "dashboard.boostJobs",
  analytics: "dashboard.analytics",
  company_profile: "dashboard.companyProfile",
  subscription: "dashboard.subscription",
  admin: "dashboard.admin",
} as const;

export type TranslationKey = keyof typeof legacyKeyMap;

export function tForLanguage(language: string, legacyKey: TranslationKey): string {
  const safeLang = (language in resources ? language : "en") as LangCode;
  const path = legacyKeyMap[legacyKey];
  return getNestedValue(resources[safeLang] as Record<string, any>, path)
    ?? getNestedValue(resources.en as Record<string, any>, path)
    ?? legacyKey;
}

type I18nContextValue = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => localStorage.getItem("hirenext_lang") || "en");

  const setLanguage = (lang: string) => {
    const next = lang in resources ? lang : "en";
    setLanguageState(next);
    localStorage.setItem("hirenext_lang", next);
    document.documentElement.lang = next;
  };

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key: string) => {
      const safeLang = (language in resources ? language : "en") as LangCode;
      return getNestedValue(resources[safeLang] as Record<string, any>, key)
        ?? getNestedValue(resources.en as Record<string, any>, key)
        ?? key;
    },
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return ctx;
}
