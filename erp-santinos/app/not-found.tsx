'use client';

import React from 'react';
import { Button } from '@/lib/components/ui';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HomeOutlined, WarningOutlined } from '@ant-design/icons';

const MotionDiv = motion.div as any;

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] -z-10 opacity-40 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-zinc-100 rounded-full blur-[120px] -z-10 opacity-60" />

            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[500px] text-center"
            >
                <div className="mb-10 relative inline-block">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center text-white text-4xl font-black mx-auto shadow-2xl relative z-10 italic">
                        404
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
                        <WarningOutlined />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic mb-4">Signal Lost in Nexus</h1>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-10 uppercase tracking-widest text-[10px]">
                    The requested coordinate does not exist within the current school node or platform cluster.
                    Your session is safe, but this path is dead.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="default"
                        className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] italic shadow-xl shadow-zinc-900/10"
                        onClick={() => router.push('/dashboard')}
                    >
                        <HomeOutlined className="mr-2" /> Return to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] italic border-zinc-200"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </div>

                <div className="mt-20 flex items-center justify-center gap-6 opacity-30 grayscale">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">BodhiEdu Enterprise</span>
                </div>
            </MotionDiv>
        </div>
    );
}
