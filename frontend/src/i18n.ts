import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: { "navbar": {"lang_select": "Select a language"} } },
            de: { translation: { "navbar": {"lang_select": "Wähle eine Sprache"} } },
            ja: { translation: { "navbar": {"lang_select": "言語を選択"} } },
        },
        fallbackLng: "en",
        supportedLngs: ["en", "de", "ja"],
        detection: {
            order: ["localStorage", "navigator"],
            cacheUserSelections: true,
        },
    });

export default i18n;
