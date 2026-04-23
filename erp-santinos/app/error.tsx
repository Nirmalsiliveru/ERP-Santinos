'use client';

import React, { useEffect } from 'react';
import { Button } from '@/lib/components/ui';
import { motion } from 'framer-motion';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';

const MotionDiv = motion.div as any;

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Core System Exception:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
            {/* Background Glitch Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-10 opacity-30" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-50/10 rounded-full blur-[150px] -z-10 opacity-20" />

            <MotionDiv
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[550px] text-center"
            >
                <div className="mb-10 text-primary animate-pulse">
                    <BugOutlined style={{ fontSize: '64px' }} />
                </div>

                <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-4">System Anomaly Detected</h1>
                <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-10 uppercase tracking-widest text-[10px]">
                    The Nexus core encountered an unhandled exception. This usually occurs during intense data synchronization or unstable node connections.
                </p>

                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-10 text-left overflow-hidden">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 italic">Error Log Chunk:</p>
                    <code className="text-xs text-zinc-300 font-mono block whitespace-pre-wrap break-all">
                        {error.message || 'Unknown internal cluster error occurred.'}
                    </code>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="default"
                        className="w-full sm:w-auto h-12 px-10 rounded-xl font-bold uppercase tracking-widest text-[10px] italic shadow-2xl shadow-primary/20"
                        onClick={() => reset()}
                    >
                        <ReloadOutlined className="mr-2" /> Re-initialize Core
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-10 rounded-xl font-bold uppercase tracking-widest text-[10px] italic border-zinc-700 text-zinc-400 hover:text-white"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Emergency Extraction
                    </Button>
                </div>

                <div className="mt-20">
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.5em]">Nexus Diagnostic Protocol 0.81.2</p>
                </div>
            </MotionDiv>
        </div>
    );
}
