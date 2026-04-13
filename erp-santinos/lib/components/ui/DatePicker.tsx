"use client";

import React from "react";
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export const DatePicker: React.FC<AntDatePickerProps> = ({ className, ...props }) => {
    return (
        <AntDatePicker
            className={cn("custom-datepicker h-11 w-full rounded-xl border-zinc-200 hover:border-zinc-300 focus:border-zinc-900", className)}
            {...props}
        />
    );
};
