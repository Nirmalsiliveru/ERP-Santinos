'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag, Card, Statistic, Row, Col, Progress, Rate } from "antd";
import { 
    TeamOutlined, 
    FireOutlined, 
    ThunderboltOutlined, 
    BarChartOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "@/lib/api";

export default function TeacherPerformancePage() {
    const [loading, setLoading] = useState(true);
    const [performance, setPerformance] = useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/teachers/performance/analytics');
            setPerformance(res.data);
        } catch (error) {
            console.error("Performance Sync Error:", error);
            messageApi.error("Faculty analytics synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'FACULTY IDENTITY',
            key: 'faculty',
            render: (r: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs">{r.name[0]}</div>
                    <div className="flex flex-col">
                        <span className="font-black text-zinc-900 text-xs uppercase italic">{r.name}</span>
                        <span className="text-[10px] text-zinc-400 font-bold tracking-widest">{r.designation}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'ATTENDANCE',
            dataIndex: 'attendance_rate',
            key: 'attendance',
            render: (v: number) => <Progress percent={v} size="small" strokeColor={v > 90 ? '#10b981' : '#f59e0b'} format={v => <span className="text-[10px] font-black">{v}%</span>} />
        },
        {
            title: 'WORKLOAD',
            key: 'workload',
            render: (r: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-zinc-900 italic uppercase">{r.periods_completed} / {r.total_periods} PERIODS</span>
                    <Progress percent={Math.round((r.periods_completed / r.total_periods) * 100)} size={[100, 4]} showInfo={false} strokeColor="#6366f1" />
                </div>
            )
        },
        {
            title: 'SYLLABUS',
            dataIndex: 'syllabus_progress',
            key: 'syllabus',
            render: (v: number) => <Progress percent={v} size="small" strokeColor="#8b5cf6" format={v => <span className="text-[10px] font-black">{v}%</span>} />
        },
        {
            title: 'RATING',
            dataIndex: 'rating',
            key: 'rating',
            render: (v: number) => <Rate disabled defaultValue={v} style={{ fontSize: 12 }} />
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Faculty Performance Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Real-time workload metrics, academic efficiency monitoring, and faculty auditing.</p>
                    </div>
                </div>

                <Row gutter={24}>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Avg Faculty Efficiency</span>} value={92.4} suffix="%" valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic' }} prefix={<ThunderboltOutlined />} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Periods Logged</span>} value={482} valueStyle={{ fontWeight: 900, color: '#10b981', fontStyle: 'italic' }} prefix={<FireOutlined />} />
                        </Col>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Curriculum Coverage</span>} value={78.5} suffix="%" valueStyle={{ fontWeight: 900, color: '#8b5cf6', fontStyle: 'italic' }} prefix={<BarChartOutlined />} />
                        </Card>
                    </Col>
                </Row>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase italic tracking-widest text-zinc-900">Strategic Efficiency Monitoring</h2>
                    </div>
                    <Table dataSource={performance} columns={columns} pagination={{ pageSize: 10 }} loading={loading} rowClassName="h-16" />
                </div>
            </div>
        </Shell>
    );
}
