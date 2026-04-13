"use client";

import React from "react";
import { Modal as AntModal, ModalProps as AntModalProps } from "antd";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export interface CustomModalProps extends AntModalProps {
    premium?: boolean;
}

const Modal: React.FC<CustomModalProps> = ({
    className,
    premium = true,
    children,
    ...props
}) => {
    return (
        <>
            <AntModal
                centered
                {...props}
                className={cn(
                    "custom-modal",
                    premium && "premium-modal",
                    className
                )}
            >
                <div className="py-4">
                    {children}
                </div>
            </AntModal>
            <style jsx global>{`
        .premium-modal .ant-modal-content {
          border-radius: 16px !important;
          padding: 24px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .premium-modal .ant-modal-header {
          margin-bottom: 16px !important;
          background: transparent !important;
        }
        .premium-modal .ant-modal-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
        }
        .premium-modal .ant-modal-footer {
          margin-top: 24px !important;
          border-top: 1px solid #f1f5f9 !important;
          padding-top: 16px !important;
        }
        .premium-modal .ant-btn {
          border-radius: 8px !important;
          height: 38px !important;
          font-weight: 500 !important;
        }
        .premium-modal .ant-btn-primary {
          background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4) !important;
        }
      `}</style>
        </>
    );
};

export { Modal };
