"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
    animate?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass, animate = true, ...props }, ref) => {
        const Comp = animate ? (motion.div as any) : "div";
        return (
            <Comp
                ref={ref}
                initial={animate ? { opacity: 0, y: 15 } : undefined}
                whileHover={animate ? { y: -4, transition: { duration: 0.2 } } : undefined}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                    "rounded-2xl border bg-card text-card-foreground transition-all duration-300",
                    glass ? "glass-card shadow-indigo-500/5" : "shadow-sm border-slate-200/60 shadow-slate-200/50",
                    "relative overflow-hidden before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
