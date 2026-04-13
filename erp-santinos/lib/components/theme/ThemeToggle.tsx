"use client";

import React from "react";
import { useBranding } from "@/lib/context/BrandingContext";
import { Button, Popover, ColorPicker, Space, Divider } from "antd";
import { BgColorsOutlined, ReloadOutlined } from "@ant-design/icons";

export function ThemeToggle() {
    const { colors, setColors, resetBranding } = useBranding();

    const themes = [
        { name: "Classic Blue", primary: "#2563eb", accent: "#7c3aed" },
        { name: "Emerald Green", primary: "#10b981", accent: "#3b82f6" },
        { name: "Royal Purple", primary: "#8b5cf6", accent: "#ec4899" },
        { name: "Crimson Red", primary: "#ef4444", accent: "#f59e0b" },
        { name: "Modern Slate", primary: "#0f172a", accent: "#6366f1" },
    ];

    const content = (
        <div className="w-64 p-2">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">School Branding</span>
                <Button
                    type="text"
                    icon={<ReloadOutlined className="text-[10px]" />}
                    size="small"
                    onClick={resetBranding}
                    className="text-[10px] uppercase font-bold text-zinc-400"
                >
                    Reset
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Presets</span>
                    <div className="grid grid-cols-5 gap-2">
                        {themes.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => setColors({ primary: t.primary, accent: t.accent })}
                                className="w-8 h-8 rounded-lg border border-zinc-100 shadow-sm transition-transform hover:scale-110"
                                style={{ backgroundColor: t.primary }}
                                title={t.name}
                            />
                        ))}
                    </div>
                </div>

                <Divider className="my-2" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-700">Primary Color</span>
                        <ColorPicker
                            value={colors.primary}
                            onChange={(value) => setColors({ primary: value.toHexString() })}
                            size="small"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-700">Accent Color</span>
                        <ColorPicker
                            value={colors.accent}
                            onChange={(value) => setColors({ accent: value.toHexString() })}
                            size="small"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-700">Background</span>
                        <ColorPicker
                            value={colors.background}
                            onChange={(value) => setColors({ background: value.toHexString() })}
                            size="small"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Popover content={content} trigger="click" placement="bottomRight" arrow={false}>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
                <BgColorsOutlined />
            </button>
        </Popover>
    );
}
