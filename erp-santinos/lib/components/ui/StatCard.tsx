"use client";

import React from "react";
import { Card } from "../ui/Card";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    className,
}) => {
    return (
        <Card className={cn("group transition-all duration-200 border-zinc-100 hover:border-zinc-200", className)}>
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
                        <h3 className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">{value}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                        {icon}
                    </div>
                </div>

                {trend && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className={cn(
                            "text-[10px] font-bold",
                            trend.isUp ? "text-emerald-600" : "text-zinc-400"
                        )}>
                            {trend.isUp ? "+" : "-"}{Math.abs(trend.value)}%
                        </span>
                        <span className="text-[10px] text-zinc-300 font-bold uppercase">Trend</span>
                    </div>
                )}
            </div>
        </Card>
    );
};
