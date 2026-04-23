'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag } from "antd";
import { Button, AddRoleModal } from "@/lib/components/ui";
import {
    SafetyCertificateOutlined,
    LockOutlined,
    EditOutlined,
    LoadingOutlined,
    SafetyOutlined
} from "@ant-design/icons";
import api from "@/lib/api";

export default function RBACPage() {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchRoles = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/roles');
            setRoles(res.data);
        } catch (error) {
            console.error("Fetch Roles Error:", error);
            messageApi.error("Access control synchronization failed.");
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const columns = [
        {
            title: 'ROLE IDENTITY',
            dataIndex: 'name',
            key: 'name',
            render: (v: string) => (
                <div className="flex items-center gap-3">
                    <SafetyOutlined className="text-primary text-sm" />
                    <span className="font-black text-zinc-900 text-sm italic uppercase tracking-tighter">
                        {v}
                    </span>
                </div>
            )
        },
        {
            title: 'PERMISSIONS GRANTED',
            key: 'permissions',
            render: (r: any) => (
                <div className="flex flex-wrap gap-2 max-w-md">
                    {r.permissions?.map((p: any) => (
                        <Tag key={p.id} className="bg-zinc-100 text-zinc-500 border-none font-bold text-[9px] rounded-md px-2 py-0">
                            {p.name.toUpperCase()}
                        </Tag>
                    ))}
                    {!r.permissions?.length && <span className="text-[10px] italic text-zinc-400">No active permissions</span>}
                </div>
            )
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (r: any) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedRole(r); setIsModalOpen(true); }}
                >
                    <EditOutlined className="text-zinc-400 hover:text-primary" />
                </Button>
            )
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Access Control Architecture</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Define system roles and map functional permissions across the institution.</p>
                    </div>
                    <Button
                        variant="default"
                        className="flex items-center gap-2"
                        onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}
                    >
                        <LockOutlined /> Define New Role
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                            <h3 className="font-black text-zinc-900 text-sm uppercase tracking-widest flex items-center gap-3">
                                <SafetyCertificateOutlined className="text-primary" />
                                Privilege Registry
                            </h3>
                        </div>

                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-4">
                                <LoadingOutlined className="text-4xl text-primary" />
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Parsing Security Protocols...</p>
                            </div>
                        ) : (
                            <Table
                                dataSource={roles}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                rowClassName="hover:bg-zinc-50/50 transition-all h-20"
                            />
                        )}
                    </div>
                </div>
            </div>

            <AddRoleModal
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); setSelectedRole(null); }}
                onSuccess={() => { setIsModalOpen(false); setSelectedRole(null); fetchRoles(); }}
                initialData={selectedRole}
            />
        </Shell>
    );
}
