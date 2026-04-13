"use client";

import React from "react";
import { Table as AntTable, TableProps as AntTableProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface CustomTableProps<T> extends AntTableProps<T> {
    premium?: boolean;
    className?: string;
}

const Table = <T extends object>({
    className,
    premium = true,
    ...props
}: CustomTableProps<T>) => {
    return (
        <div className={cn(
            "w-full overflow-hidden rounded-xl border bg-card shadow-sm",
            premium && "shadow-indigo-500/10",
            className
        )}>
            <AntTable
                {...props}
                className={cn(
                    "custom-antd-table",
                    premium && "premium-table"
                )}
            />
            <style jsx global>{`
        .custom-antd-table .ant-table {
          background: transparent !important;
        }
        .custom-antd-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }
        .custom-antd-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
          padding: 16px !important;
        }
        .custom-antd-table .ant-table-tbody > tr:hover > td {
          background: #f1f5f9 !important;
        }
        .premium-table .ant-table-tbody > tr {
          transition: all 0.2s ease;
        }
        .premium-table .ant-table-pagination {
          padding: 16px !important;
          margin: 0 !important;
          border-top: 1px solid #e2e8f0;
        }
      `}</style>
        </div>
    );
};

export { Table };
