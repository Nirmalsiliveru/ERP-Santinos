'use client';

import React from "react";
import { Shell } from "@/lib/components/layout";
import { useUser } from "@/lib/context/UserContext";

export default function ParentDashboard() {
    const { user } = useUser();

    return (
        <Shell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Parent Dashboard</h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Welcome back, {user?.full_name || "Parent"}. Here is an overview of your children's progress.</p>
                </div>
                
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center border border-zinc-100 shadow-sm rounded-2xl">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-black mb-4">
                        <span role="img" aria-label="family">👨‍👩‍👧</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900">Portal Initialized</h3>
                    <p className="text-zinc-500 text-sm max-w-md mt-2 leading-relaxed">
                        The Parent Portal infrastructure is now active. As students are enrolled and linked to your email address, they will automatically appear here.
                    </p>
                </div>
            </div>
        </Shell>
    );
}
