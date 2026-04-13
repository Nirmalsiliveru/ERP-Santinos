"use client";

import React from "react";
import { Select as AntSelect, SelectProps as AntSelectProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface SelectProps extends AntSelectProps {
    className?: string;
}

export const Select: React.FC<SelectProps> = ({ className, ...props }) => {
    return (
        <AntSelect
            className={cn("custom-select w-full", className)}
            popupClassName="custom-select-popup"
            {...props}
        />
    );
};
