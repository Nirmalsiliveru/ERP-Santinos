'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag } from "antd";
import { Button, AddClassModal, AddSectionModal } from "@/lib/components/ui";
import {
    PlusOutlined,
    BlockOutlined,
    BranchesOutlined,
    LoadingOutlined,
    EditOutlined
} from "@ant-design/icons";
import api from "@/lib/api";

export default function AcademicsPage() {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [classRes, sectionRes] = await Promise.all([
                    api.get(`/classes?page=${page}&size=${pageSize}`),
                    api.get('/sections')
                ]);
                setClasses(classRes.data.items);
                setTotal(classRes.data.total);
                setSections(sectionRes.data);
            } catch (error: any) {
                console.error("Fetch Academics Error:", error);
                messageApi.error("Failed to synchronize academic structure.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [messageApi, page, pageSize]);

    const fetchDataManual = async () => {
        setLoading(true);
        try {
            const [classRes, sectionRes] = await Promise.all([
                api.get(`/classes?page=${page}&size=${pageSize}`),
                api.get('/sections')
            ]);
            setClasses(classRes.data.items);
            setTotal(classRes.data.total);
            setSections(sectionRes.data);
        } catch (error: any) {
            console.error("Fetch Academics Error:", error);
            messageApi.error("Failed to synchronize academic structure.");
        } finally {
            setLoading(false);
        }
    };

    const classColumns = [
        {
            title: 'CLASS NAME',
            dataIndex: 'name',
            key: 'name',
            render: (t: string) => <span className="font-black text-zinc-900 text-sm italic uppercase tracking-tight">{t}</span>
        },
        {
            title: 'SECTIONS',
            key: 'sections',
            render: (r: any) => {
                const classSections = sections.filter((s: any) => s.class_id === r.id);
                return (
                    <div className="flex flex-wrap gap-2">
                        {classSections.length > 0 ? classSections.map((s: any) => (
                            <Tag key={s.id} className="bg-zinc-100 text-zinc-600 border-none font-bold text-[10px] rounded-lg px-3">
                                Section {s.name}
                            </Tag>
                        )) : <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">No Sections Assigned</span>}
                    </div>
                )
            }
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (s: boolean) => (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {s ? 'Operational' : 'Inactive'}
                </span>
            )
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (r: any) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all"
                    onClick={() => {
                        setSelectedClass(r);
                        setIsClassModalOpen(true);
                    }}
                >
                    <EditOutlined />
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
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Academic Architecture</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Configure institutional hierarchies, grades, and subdivisions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="flex items-center gap-2" onClick={() => setIsSectionModalOpen(true)}>
                            <BranchesOutlined /> Manage Sections
                        </Button>
                        <Button variant="default" className="flex items-center gap-2" onClick={() => setIsClassModalOpen(true)}>
                            <PlusOutlined /> Define New Class
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Summary Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-8 group overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Active Units</p>
                            <p className="text-5xl font-black text-zinc-900 mt-6 tracking-tighter">{classes.length}</p>
                            <p className="text-[11px] font-medium text-zinc-500 mt-2 italic">Standard grades initialized</p>
                        </div>

                        <div className="glass-card p-8 group overflow-hidden border-indigo-100">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all" />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Subdivisions</p>
                            <p className="text-5xl font-black text-zinc-900 mt-6 tracking-tighter">{sections.length}</p>
                            <p className="text-[11px] font-medium text-zinc-500 mt-2 italic">Sections across all grades</p>
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                                <h3 className="font-black text-zinc-900 text-sm uppercase tracking-widest flex items-center gap-3">
                                    <BlockOutlined className="text-primary" />
                                    Grade Hierarchy
                                </h3>
                            </div>

                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4">
                                    <LoadingOutlined className="text-4xl text-primary" />
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Parsing Core Map...</p>
                                </div>
                            ) : (
                                <Table
                                    dataSource={classes}
                                    columns={classColumns}
                                    pagination={{
                                        current: page,
                                        pageSize: pageSize,
                                        total: total,
                                        onChange: (p, s) => {
                                            setPage(p);
                                            setPageSize(s);
                                        },
                                        className: "custom-pagination px-4 pb-4"
                                    }}
                                    className="border-none"
                                    rowClassName="hover:bg-zinc-50/50 transition-all h-20"
                                    rowKey="id"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddClassModal
                open={isClassModalOpen}
                onCancel={() => setIsClassModalOpen(false)}
                onSuccess={() => {
                    setIsClassModalOpen(false);
                    setSelectedClass(null);
                    fetchDataManual();
                }}
                initialData={selectedClass}
            />
            <AddSectionModal
                open={isSectionModalOpen}
                onCancel={() => setIsSectionModalOpen(false)}
                onSuccess={() => {
                    setIsSectionModalOpen(false);
                    fetchDataManual();
                }}
            />
        </Shell>
    );
}
