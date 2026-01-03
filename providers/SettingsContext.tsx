import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'blue' | 'emerald' | 'purple' | 'rose' | 'amber';
type Language = 'en' | 'tr';

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
}

export const THEME_CONFIG: Record<ThemeType, ThemeColors> = {
    blue: { primary: '#3b82f6', secondary: '#1e293b', accent: '#60a5fa', background: '#0f172a', card: 'rgba(30, 41, 59, 0.4)' },
    emerald: { primary: '#10b981', secondary: '#064e3b', accent: '#34d399', background: '#022c22', card: 'rgba(6, 78, 59, 0.4)' },
    purple: { primary: '#8b5cf6', secondary: '#2e1065', accent: '#a78bfa', background: '#0f0720', card: 'rgba(46, 16, 101, 0.4)' },
    rose: { primary: '#f43f5e', secondary: '#4c0519', accent: '#fb7185', background: '#270006', card: 'rgba(76, 5, 25, 0.4)' },
    amber: { primary: '#f59e0b', secondary: '#451a03', accent: '#fbbf24', background: '#1c0d02', card: 'rgba(69, 26, 3, 0.4)' }
};

interface SettingsContextType {
    theme: ThemeType;
    colors: ThemeColors;
    language: Language;
    setTheme: (theme: ThemeType) => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const TRANSLATIONS = {
    en: {
        greeting: "Good Morning,",
        premium: "Premium Tools",
        workout: "Workout & Progress",
        settings: "Settings",
        ai_coach: "AI Personal Coach",
        themes: "App Themes",
        language: "Language"
    },
    tr: {
        greeting: "Günaydın,",
        premium: "Premium Araçlar",
        workout: "Antrenman & Gelişim",
        settings: "Ayarlar",
        ai_coach: "AI Kişisel Koç",
        themes: "Uygulama Temaları",
        language: "Dil"
    }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>('blue');
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('settings_theme_v2');
            const savedLang = await AsyncStorage.getItem('settings_lang');
            if (savedTheme) setThemeState(savedTheme as ThemeType);
            if (savedLang) setLanguage(savedLang as Language);
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        setThemeState(newTheme);
        await AsyncStorage.setItem('settings_theme_v2', newTheme);
    };

    const changeLanguage = async (lang: Language) => {
        setLanguage(lang);
        await AsyncStorage.setItem('settings_lang', lang);
    };

    const t = (key: string) => {
        return TRANSLATIONS[language][key as keyof typeof TRANSLATIONS['en']] || key;
    };

    return (
        <SettingsContext.Provider value={{
            theme,
            colors: THEME_CONFIG[theme],
            language,
            setTheme,
            setLanguage: changeLanguage,
            t
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};
