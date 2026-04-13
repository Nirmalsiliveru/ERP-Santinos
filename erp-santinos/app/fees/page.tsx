'use client';

import React from "react";
import { Shell } from "@/lib/components/layout";
import { Button, Table } from "@/lib/components/ui";
import {
    MoreOutlined
} from "@ant-design/icons";

const feeRecords = [
    { key: '1', id: 'INV-102', name: 'Sarah Jenkins', amount: '$1,200', date: 'Apr 10, 2024', status: 'Paid' },
    { key: '2', id: 'INV-103', name: 'David Miller', amount: '$450', date: 'Apr 12, 2024', status: 'Pending' },
    { key: '3', id: 'INV-104', name: 'Emily Watson', amount: '$800', date: 'Apr 14, 2024', status: 'Overdue' },
];

export default function FeesPage() {
    return (
        <Shell>
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Fee Matrix</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Manage institutional billing and student financial streams.</p>
                    </div>
                    <Button className="btn-primary">Generate Invoice</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Net Revenue", value: "$452,000", color: "text-zinc-900" },
                        { title: "Deficit Stream", value: "$12,400", color: "text-rose-600" },
                        { title: "Processing Speed", value: "4.2 Days", color: "text-emerald-600" },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-8 relative flex flex-col justify-between">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.title}</p>
                            <p className={`text-3xl font-black mt-4 tracking-tighter ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="glass-card overflow-hidden">
                    <Table
                        dataSource={feeRecords}
                        columns={[
                            { title: 'INVOICE', dataIndex: 'id', key: 'id', render: (t) => <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t}</span> },
                            { title: 'STUDENT', dataIndex: 'name', key: 'name', render: (t) => <span className="text-sm font-bold text-zinc-900">{t}</span> },
                            { title: 'AMOUNT', dataIndex: 'amount', key: 'amount', render: (t) => <span className="text-sm font-black text-zinc-900">{t}</span> },
                            { title: 'DUE DATE', dataIndex: 'date', key: 'date', render: (t) => <span className="text-xs text-zinc-400 font-medium">{t}</span> },
                            {
                                title: 'STATUS',
                                dataIndex: 'status',
                                key: 'status',
                                render: (s) => (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s === 'Paid' ? 'bg-emerald-100 text-emerald-700' : s === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{s}</span>
                                )
                            },
                            { title: '', key: 'action', render: () => <Button variant="ghost" icon={<MoreOutlined />} className="text-zinc-400" /> }
                        ]}
                        pagination={false}
                        className="border-none"
                        rowClassName="hover:bg-zinc-50/50 transition-all h-20"
                    />
                </div>
            </div>
        </Shell>
    );
}
