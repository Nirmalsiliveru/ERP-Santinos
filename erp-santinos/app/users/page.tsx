'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag } from "antd";
import { Button } from "@/lib/components/ui";
import {
    UserAddOutlined,
    SafetyCertificateOutlined,
    MoreOutlined,
    LoadingOutlined,
    VerifiedOutlined
} from "@ant-design/icons";
import api from "@/lib/api";
import { AddUserModal } from "@/lib/components/ui";

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/users/');
                setUsers(response.data);
            } catch (error: any) {
                console.error("Fetch Users Error:", error);
                messageApi.error("Unable to access the Identity Registry.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [messageApi]);

    const handleCreateSuccess = async () => {
        setIsModalOpen(false);
        setLoading(true);
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (error: any) {
            console.error("Fetch Users Error:", error);
            messageApi.error("Unable to access the Identity Registry.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'OPERATOR',
            key: 'email',
            render: (r: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-sm">
                        {r.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 text-sm tracking-tight">{r.email}</span>
                        <div className="flex items-center gap-2">
                            {r.is_platform_admin && <Tag color="gold" className="text-[9px] font-black uppercase tracking-widest rounded-full border-none px-2 m-0 bg-gold-50 text-gold-700">Platform Admin</Tag>}
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ID: {r.id}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'ASSIGNED ROLE',
            dataIndex: 'role',
            key: 'role',
            render: (role: any) => (
                <div className="flex items-center gap-2">
                    <VerifiedOutlined className="text-primary text-xs" />
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{role?.name || 'No Role'}</span>
                </div>
            )
        },
        {
            title: 'SCHOOL ID',
            dataIndex: 'school_id',
            key: 'school_id',
            render: (sid: number) => <span className="text-zinc-500 font-bold text-[10px] bg-zinc-100 px-2 py-0.5 rounded-md">SC-{sid || 'SYS'}</span>
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (s: boolean) => (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {s ? 'Active' : 'Locked'}
                </span>
            )
        },
        {
            title: '',
            key: 'action',
            render: () => <Button variant="ghost" icon={<MoreOutlined />} className="text-zinc-400 hover:text-zinc-900" />
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Identity Management</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Manage system operators, staff roles, and administrative access.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="btn-secondary flex items-center gap-2">
                            <SafetyCertificateOutlined />
                            Audit Logs
                        </Button>
                        <Button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                            <UserAddOutlined />
                            Provision User
                        </Button>
                    </div>
                </div>

                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <LoadingOutlined className="text-4xl text-primary" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Decrypting Identity Map...</p>
                        </div>
                    ) : (
                        <>
                            <Table
                                dataSource={users}
                                columns={columns}
                                pagination={false}
                                className="border-none"
                                rowClassName="hover:bg-zinc-50/50 transition-all h-20"
                                rowKey="id"
                            />
                            <div className="p-4 border-t border-zinc-50 bg-zinc-50/30">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Total Registered Identities: {users.length}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AddUserModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </Shell>
    );
}
