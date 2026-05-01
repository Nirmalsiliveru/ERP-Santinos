'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, Tag } from "antd";
import api from "@/lib/api";
import { LoadingOutlined, HistoryOutlined } from "@ant-design/icons";

export default function AuditLogsPage() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/audit-logs');
            setLogs(response.data);
        } catch (error) {
            console.error("Fetch Logs Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'TIMESTAMP',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (t: string) => <span className="text-zinc-400 text-[10px] font-bold">{new Date(t).toLocaleString()}</span>
        },
        {
            title: 'ACTION',
            dataIndex: 'action',
            key: 'action',
            render: (a: string) => (
                <Tag color={a === 'DELETE' ? 'red' : a === 'CREATE' ? 'green' : 'blue'} className="font-bold text-[10px] uppercase border-none rounded-full px-3">
                    {a}
                </Tag>
            )
        },
        {
            title: 'MODULE',
            dataIndex: 'module',
            key: 'module',
            render: (m: string) => <span className="text-zinc-900 font-black text-[10px] tracking-widest uppercase">{m}</span>
        },
        {
            title: 'DESCRIPTION',
            dataIndex: 'description',
            key: 'description',
            render: (d: string) => <span className="text-zinc-500 text-xs font-medium">{d}</span>
        },
        {
            title: 'PAYLOAD',
            dataIndex: 'payload',
            key: 'payload',
            render: (p: any) => (
                <pre className="text-[9px] text-zinc-400 bg-zinc-50 p-2 rounded-lg max-w-xs overflow-hidden text-ellipsis">
                    {JSON.stringify(p, null, 2)}
                </pre>
            )
        }
    ];

    return (
        <Shell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                        <HistoryOutlined className="text-primary" />
                        System Audit Logs
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Immutable record of all administrative actions within the school Nexus.</p>
                </div>

                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <LoadingOutlined className="text-4xl text-primary" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Scanning History...</p>
                        </div>
                    ) : (
                        <Table
                            dataSource={logs}
                            columns={columns}
                            pagination={{ pageSize: 10 }}
                            className="border-none"
                            rowClassName="hover:bg-zinc-50/50 transition-all cursor-default"
                            rowKey="id"
                        />
                    )}
                </div>
            </div>
        </Shell>
    );
}
