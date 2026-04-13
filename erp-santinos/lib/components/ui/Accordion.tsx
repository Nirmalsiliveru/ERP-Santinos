"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownOutlined } from "@ant-design/icons";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen: defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-zinc-100 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left hover:bg-zinc-50/50 transition-colors px-2 rounded-lg"
            >
                <span className="text-sm font-bold text-zinc-900 tracking-tight">{title}</span>
                <DownOutlined className={cn("text-[10px] text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="pb-6 pt-1 px-2 text-sm text-zinc-600 font-medium leading-relaxed">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Accordion: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <div className={cn("bg-white", className)}>
            {children}
        </div>
    );
};
