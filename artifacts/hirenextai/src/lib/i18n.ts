export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
] as const;

const resources = {
  en: { account: "Account", billing: "Billing", support: "Support", theme: "Theme", language: "Language", logout: "Logout" },
  hi: { account: "अकाउंट", billing: "बिलिंग", support: "सपोर्ट", theme: "थीम", language: "भाषा", logout: "लॉग आउट" },
  bn: { account: "অ্যাকাউন্ট", billing: "বিলিং", support: "সাপোর্ট", theme: "থিম", language: "ভাষা", logout: "লগ আউট" },
  ta: { account: "கணக்கு", billing: "பில்லிங்", support: "ஆதரவு", theme: "தீம்", language: "மொழி", logout: "வெளியேறு" },
  te: { account: "ఖాతా", billing: "బిల్లింగ్", support: "సపోర్ట్", theme: "థీమ్", language: "భాష", logout: "లాగ్ఔట్" },
  mr: { account: "खाते", billing: "बिलिंग", support: "सपोर्ट", theme: "थीम", language: "भाषा", logout: "लॉग आउट" },
} as const;

export type TranslationKey = keyof (typeof resources)["en"];

export function tForLanguage(language: string, key: TranslationKey): string {
  const safeLang = (language in resources ? language : "en") as keyof typeof resources;
  return resources[safeLang][key] || resources.en[key];
}
