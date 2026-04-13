"use client";

import React from "react";
import { Drawer as AntDrawer, DrawerProps as AntDrawerProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface CustomDrawerProps extends AntDrawerProps {
    premium?: boolean;
}

const Drawer: React.FC<CustomDrawerProps> = ({
    className,
    premium = true,
    children,
    ...props
}) => {
    return (
        <>
            <AntDrawer
                {...props}
                className={cn(
                    "custom-drawer",
                    premium && "premium-drawer",
                    className
                )}
            >
                <div className="py-2">
                    {children}
                </div>
            </AntDrawer>
            <style jsx global>{`
                .premium-drawer .ant-drawer-content {
                    border-radius: 16px 0 0 16px !important;
                }
                .premium-drawer .ant-drawer-header {
                    border-bottom: 1px solid #f1f5f9 !important;
                    padding: 24px !important;
                }
                .premium-drawer .ant-drawer-title {
                    font-size: 1.25rem !important;
                    font-weight: 700 !important;
                    color: #1e293b !important;
                }
                .premium-drawer .ant-drawer-body {
                    padding: 24px !important;
                }
                .premium-drawer .ant-drawer-close {
                    color: #64748b !important;
                    transition: color 0.2s ease;
                }
                .premium-drawer .ant-drawer-close:hover {
                    color: #4f46e5 !important;
                }
                /* Left side drawer radius */
                .premium-drawer.ant-drawer-left .ant-drawer-content {
                    border-radius: 0 16px 16px 0 !important;
                }
                /* Top side drawer radius */
                .premium-drawer.ant-drawer-top .ant-drawer-content {
                    border-radius: 0 0 16px 16px !important;
                }
                /* Bottom side drawer radius */
                .premium-drawer.ant-drawer-bottom .ant-drawer-content {
                    border-radius: 16px 16px 0 0 !important;
                }
            `}</style>
        </>
    );
};

export { Drawer };
