"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

interface BrandingColors {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
}

interface BrandingContextType {
    colors: BrandingColors;
    setColors: (colors: Partial<BrandingColors>) => void;
    resetBranding: () => void;
}

const defaultColors: BrandingColors = {
    primary: "#5d4037",
    primaryHover: "#3e2723",
    secondary: "#f1f5f9",
    accent: "#7c3aed",
    background: "#f8fafc",
    surface: "#ffffff",
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [colors, setColorsState] = useState<BrandingColors>(defaultColors);

    // Initialize from localStorage if available
    useEffect(() => {
        const saved = localStorage.getItem("school-branding");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Use requestAnimationFrame to move the state update out of the synchronous 
                // effect body, avoiding cascading render warnings and allowing the first 
                // paint to complete.
                requestAnimationFrame(() => {
                    setColorsState(parsed);

                    // Sync CSS Variables on initial load
                    const root = document.documentElement;
                    Object.entries(parsed as BrandingColors).forEach(([key, value]) => {
                        root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
                    });
                });
            } catch (e) {
                console.error("Failed to parse saved branding", e);
            }
        }
    }, []);

    const updateColors = (newColors: Partial<BrandingColors>) => {
        const updated = { ...colors, ...newColors };
        setColorsState(updated);
        localStorage.setItem("school-branding", JSON.stringify(updated));

        // Update CSS Variables
        const root = document.documentElement;
        Object.entries(updated).forEach(([key, value]) => {
            root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        });
    };

    const resetBranding = () => {
        setColorsState(defaultColors);
        localStorage.removeItem("school-branding");

        const root = document.documentElement;
        Object.entries(defaultColors).forEach(([key, value]) => {
            root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        });
    };

    return (
        <BrandingContext.Provider value={{ colors, setColors: updateColors, resetBranding }}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: colors.primary,
                        borderRadius: 12,
                        fontFamily: "Inter, var(--font-geist-sans), sans-serif",
                    },
                    algorithm: theme.defaultAlgorithm,
                }}
            >
                {children}
            </ConfigProvider>
        </BrandingContext.Provider>
    );
}

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error("useBranding must be used within a BrandingProvider");
    }
    return context;
};
