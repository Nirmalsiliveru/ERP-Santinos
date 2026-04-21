"use client";

import React from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface CustomInputProps extends AntInputProps {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<any, CustomInputProps>(
    ({ className, label, error, helperText, type, ...props }, ref) => {
        const InputComponent = type === "password" ? AntInput.Password : AntInput;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                        {label}
                    </label>
                )}
                <InputComponent
                    ref={ref as any}
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p className="text-xs text-muted-foreground">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
