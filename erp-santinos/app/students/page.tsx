'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Button, Input, Table } from "@/lib/components/ui";
import {
    SearchOutlined,
    FilterOutlined,
    MoreOutlined,
    UserAddOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import api from "@/lib/api";
import { message, Tag } from "antd";
import { AddStudentModal } from "@/lib/components/ui/AddStudentModal";

export default function StudentsPage() {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error: any) {
            console.error("Fetch Students Error:", error);
            message.error("Unable to synchronize with the Student Registry.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollSuccess = () => {
        setIsModalOpen(false);
        fetchStudents();
    };

    const columns = [
        {
            title: 'STUDENT',
            key: 'name',
            render: (r: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs uppercase">
                        {r.first_name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 text-sm">{r.first_name} {r.last_name || ''}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">{r.email}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'ADMISSION ID',
            dataIndex: 'admission_number',
            key: 'admission_number',
            render: (t: string) => <span className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase">{t || 'N/A'}</span>
        },
        {
            title: 'CLASS',
            dataIndex: 'class_id',
            key: 'class_id',
            render: (t: number) => <Tag color="blue" className="rounded-full px-3 border-none font-bold text-[10px]">Grade {t || '?'}</Tag>
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (s: boolean) => (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {s ? 'Active' : 'Deactivated'}
                </span>
            )
        },
        {
            title: 'JOINED',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (t: string) => <span className="text-zinc-400 text-[10px] font-bold">{new Date(t).toLocaleDateString()}</span>
        },
        { title: '', key: 'action', render: () => <Button variant="ghost" icon={<MoreOutlined />} className="text-zinc-400 hover:text-zinc-900" /> }
    ];

    return (
        <Shell>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Student Directory</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Live synchronization with the core student database.</p>
                    </div>
                    <Button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <UserAddOutlined />
                        Enroll New Student
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-sm group-focus-within:text-zinc-900 transition-colors" />
                        <Input placeholder="Search students by name, email or ID..." className="pl-11 h-11 bg-white border-zinc-200 text-zinc-900 rounded-xl focus:border-zinc-900 transition-all font-medium" />
                    </div>
                    <Button variant="outline" className="btn-secondary h-11 px-6 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                        <FilterOutlined />
                        Filters
                    </Button>
                </div>

                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <LoadingOutlined className="text-4xl text-primary" />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Accessing Registry...</p>
                        </div>
                    ) : (
                        <>
                            <Table
                                dataSource={students}
                                columns={columns}
                                pagination={false}
                                className="border-none"
                                rowClassName="hover:bg-zinc-50/50 transition-all h-16 cursor-pointer"
                                rowKey="id"
                            />
                            <div className="p-4 border-t border-zinc-50 flex flex-col sm:flex-row items-center justify-between bg-zinc-50/30 gap-4">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                    Currently Tracking {students.length} Student Profiles
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-8 text-[10px] font-bold border-zinc-100 px-3 rounded-lg bg-white text-zinc-500">Previous</Button>
                                    <Button variant="outline" className="h-8 text-[10px] font-bold border-zinc-100 px-3 rounded-lg bg-white text-zinc-500">Next</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AddStudentModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleEnrollSuccess}
            />
        </Shell>
    );
}
