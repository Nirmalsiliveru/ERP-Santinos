"use client";

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";

// Note: tailwind-merge is not in package.json, I will use a simple cn function or just clsx for now.
// Since I can't easily install new packages without user approval of the command, I'll stick to clsx.
function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "underline-offset-4 hover:underline text-primary",
                premium: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg hover:shadow-indigo-500/25",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-3 rounded-md",
                lg: "h-11 px-8 rounded-md",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends Omit<AntButtonProps, "size" | "variant">,
    VariantProps<typeof buttonVariants> {
    className?: string;
    animate?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, animate = true, ...props }, ref) => {
        const Comp = animate ? motion.button : "button";

        // We wrap Ant Design button or just use its logic if we want, 
        // but for "premium" feel, we might want custom styled buttons.
        // However, antd provides a lot of logic. 
        // Let's create a custom styled button that can optionally use antd features.

        return (
            <Comp
                whileHover={animate ? { scale: 1.02 } : undefined}
                whileTap={animate ? { scale: 0.98 } : undefined}
                className={cn(buttonVariants({ variant, size, className }))}
                {...(props as any)}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
