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
    "inline-flex items-center justify-center rounded-xl text-[11px] font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] border-none cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-white shadow-md hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600",
                secondary: "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                ghost: "hover:bg-zinc-100 text-zinc-600",
                link: "underline-offset-4 hover:underline text-primary",
                premium: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25",
            },
            size: {
                default: "h-11 px-8",
                sm: "h-9 px-4",
                lg: "h-12 px-10",
                icon: "h-11 w-11",
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

import { LoadingOutlined } from "@ant-design/icons";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, animate = true, loading, children, ...props }, ref) => {
        const Comp = (animate ? motion.button : "button") as any;

        return (
            <Comp
                ref={ref}
                whileHover={animate && !loading ? { scale: 1.02 } : undefined}
                whileTap={animate && !loading ? { scale: 0.98 } : undefined}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={loading || props.disabled}
                {...(props as any)}
            >
                {loading && <LoadingOutlined className="mr-2" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
