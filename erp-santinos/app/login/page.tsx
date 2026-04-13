'use client';

import React, { useState } from "react";
import { Input, Button } from "@/lib/components/ui";
import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionDiv = motion.div as any;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[400px]"
            >
                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-sm">
                        E
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Sign in to EduCore</h1>
                    <p className="text-zinc-500 mt-2 font-medium text-sm">Enter your credentials to access your dashboard</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)]">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 ml-1">Work Email</label>
                            <Input
                                type="email"
                                placeholder="name@school.com"
                                className="h-11 rounded-xl border-zinc-200 bg-white hover:border-zinc-300 focus:border-zinc-500 transition-all font-medium text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-zinc-500">Password</label>
                                <Link href="#" className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">Forgot?</Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11 rounded-xl border-zinc-200 bg-white hover:border-zinc-300 focus:border-zinc-500 transition-all font-medium text-sm"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 transition-all" />
                            <span className="text-xs font-medium text-zinc-500">Keep me signed in</span>
                        </div>

                        <Button
                            htmlType="submit"
                            className="w-full h-11 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRightOutlined className="text-xs opacity-50" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-400 font-medium tracking-tight">
                        Secure enterprise access provided by EduCore Systems. <br />
                        Managed by your IT Department.
                    </p>
                </div>
            </MotionDiv>
        </div>
    );
}
