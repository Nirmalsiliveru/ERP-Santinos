'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag, Space } from "antd";
import { Button, AddTeacherModal } from "@/lib/components/ui";
import {
    UserAddOutlined,
    TeamOutlined,
    EditOutlined,
    DeleteOutlined,
    LoadingOutlined,
    MailOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import api from "@/lib/api";

export default function TeachersPage() {
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchTeachers = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/teachers?page=${page}&size=${pageSize}`);
            setTeachers(res.data.items);
            setTotal(res.data.total);
        } catch (error: any) {
            console.error("Fetch Teachers Error:", error);
            messageApi.error("Personnel synchronization failed.");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, messageApi]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/teachers/${id}`);
            messageApi.success("Teacher profile removed.");
            fetchTeachers();
        } catch (error: any) {
            messageApi.error("Decommissioning failed.");
        }
    };

    const columns = [
        {
            title: 'TEACHER NAME',
            key: 'name',
            render: (r: any) => (
                <div className="flex flex-col">
                    <span className="font-black text-zinc-900 text-sm italic uppercase tracking-tight">
                        {r.first_name} {r.last_name}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                        {r.qualification || "Unspecified"}
                    </span>
                </div>
            )
        },
        {
            title: 'CONTACT INFO',
            key: 'contact',
            render: (r: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                        <MailOutlined className="text-[10px]" /> {r.email}
                    </div>
                    {r.phone && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                            <PhoneOutlined className="text-[10px]" /> {r.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'TENURE',
            dataIndex: 'experience',
            key: 'experience',
            render: (v: string) => (
                <span className="text-zinc-600 font-bold text-xs">{v || '0'} Years</span>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (s: boolean) => (
                <Tag className={`border-none font-black text-[9px] uppercase px-3 py-0.5 rounded-full ${s ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {s ? 'Active Duty' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (r: any) => (
                <Space>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelectedTeacher(r); setIsModalOpen(true); }}
                    >
                        <EditOutlined className="text-zinc-400 hover:text-primary" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                    >
                        <DeleteOutlined className="text-zinc-400 hover:text-rose-500" />
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Faculty Directory</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Manage institutional staff, qualifications, and system access.</p>
                    </div>
                    <Button
                        variant="default"
                        className="flex items-center gap-2"
                        onClick={() => { setSelectedTeacher(null); setIsModalOpen(true); }}
                    >
                        <UserAddOutlined /> Onboard Teacher
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-8 group overflow-hidden border-primary/20">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Faculty</p>
                            <p className="text-5xl font-black text-zinc-900 mt-6 tracking-tighter">{total}</p>
                            <p className="text-[11px] font-medium text-zinc-500 mt-2 italic">Educational personnel</p>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                                <h3 className="font-black text-zinc-900 text-sm uppercase tracking-widest flex items-center gap-3">
                                    <TeamOutlined className="text-primary" />
                                    Staff Registry
                                </h3>
                            </div>

                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4">
                                    <LoadingOutlined className="text-4xl text-primary" />
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Indexing Personnel...</p>
                                </div>
                            ) : (
                                <Table
                                    dataSource={teachers}
                                    columns={columns}
                                    rowKey="id"
                                    rowClassName="hover:bg-zinc-50/50 transition-all h-20"
                                    pagination={{
                                        current: page,
                                        pageSize: pageSize,
                                        total: total,
                                        onChange: (p, s) => { setPage(p); setPageSize(s); },
                                        className: "custom-pagination px-4 pb-4"
                                    }}
                                    scroll={{ x: 'max-content' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddTeacherModal
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); setSelectedTeacher(null); }}
                onSuccess={() => { setIsModalOpen(false); setSelectedTeacher(null); fetchTeachers(); }}
                initialData={selectedTeacher}
            />
        </Shell>
    );
}
