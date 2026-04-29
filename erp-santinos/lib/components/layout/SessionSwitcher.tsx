"use client";

import React, { useEffect, useState } from "react";
import { Select, Space, Tag, message } from "antd";
import { CalendarOutlined, LoadingOutlined } from "@ant-design/icons";
import api from "@/lib/api";
import { useUser } from "@/lib/context/UserContext";

export function SessionSwitcher() {
    const { user, activeSession, setActiveSession } = useUser();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchSessions = async () => {
        if (!user?.school_id) return;
        setLoading(true);
        try {
            const response = await api.get("/academic-years/");
            setSessions(response.data);
            
            // If no active session in context but we have sessions, set the one marked as active
            if (!activeSession && response.data.length > 0) {
                const current = response.data.find((s: any) => s.is_active);
                if (current) setActiveSession(current);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [user?.school_id]);

    const handleSessionChange = async (sessionId: number) => {
        const selected = sessions.find(s => s.id === sessionId);
        if (selected) {
            try {
                // In a real app, we might want to update the backend OR 
                // just flip a global header/state for the current UI session.
                // For now, we update the local context.
                setActiveSession(selected);
                messageApi.success(`Switched to Academic Session: ${selected.name}`);
                
                // Optional: Refresh the page to reload all data for the new session
                // window.location.reload(); 
            } catch (e) {
                messageApi.error("Failed to switch session.");
            }
        }
    };

    if (!user || user.is_platform_admin) return null;

    return (
        <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1.5 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-pointer group">
            {contextHolder}
            <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-0.5">Academic Session</span>
                <Select
                    value={activeSession?.id}
                    loading={loading}
                    onChange={handleSessionChange}
                    className="session-select min-w-[100px] h-5"
                    variant="borderless"
                    dropdownStyle={{
                        borderRadius: '16px',
                        padding: '8px',
                        boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.15)',
                        border: '1px solid #f1f5f9'
                    }}
                    suffixIcon={loading ? <LoadingOutlined className="text-zinc-400" /> : null}
                    optionLabelProp="label"
                >
                    {sessions.length === 0 && activeSession ? (
                        <Select.Option value={activeSession.id} label={activeSession.name}>
                            <div className="flex items-center justify-between gap-4 py-1">
                                <span className="text-sm font-bold text-zinc-900">{activeSession.name}</span>
                            </div>
                        </Select.Option>
                    ) : (
                        sessions.map(s => (
                            <Select.Option key={s.id} value={s.id} label={s.name}>
                                <div className="flex items-center justify-between gap-4 py-1">
                                    <span className="text-sm font-bold text-zinc-900">{s.name}</span>
                                    {s.is_active && (
                                        <Tag color="#10b981" className="m-0 rounded-full text-[8px] font-black border-none px-2 text-white">ACTIVE</Tag>
                                    )}
                                </div>
                            </Select.Option>
                        ))
                    )}
                </Select>
            </div>
            
            <style jsx global>{`
                .session-select .ant-select-selector {
                    padding: 0 !important;
                    background: transparent !important;
                    height: 20px !important;
                }
                .session-select .ant-select-selection-item {
                    font-size: 14px !important;
                    font-weight: 800 !important;
                    color: #18181b !important;
                    line-height: 20px !important;
                }
                .ant-select-dropdown .ant-select-item-option-selected {
                    background-color: #f0fdf4 !important;
                }
            `}</style>
        </div>
    );
}
