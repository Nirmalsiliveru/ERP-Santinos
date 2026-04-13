'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { StatCard } from "@/lib/components/ui";
import {
    UserOutlined,
    BookOutlined,
    ProjectOutlined,
    CalendarOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import api from "@/lib/api";
import { Tag } from "antd";

const performanceData = [
    { name: 'Jan', score: 85 },
    { name: 'Feb', score: 88 },
    { name: 'Mar', score: 92 },
    { name: 'Apr', score: 90 },
    { name: 'May', score: 95 },
    { name: 'Jun', score: 93 },
];

const attendanceData = [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 98 },
    { day: 'Thu', rate: 94 },
    { day: 'Fri', rate: 96 },
];

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        students: 0,
        classes: 0,
        sections: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [s, c, sec] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes'),
                    api.get('/sections')
                ]);
                setStats({
                    students: s.data.length,
                    classes: c.data.length,
                    sections: sec.data.length
                });
            } catch (error) {
                console.error("Dashboard Stats Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Shell>
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Institutional Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Global oversight of EduCore operational metrics.</p>
                    </div>
                    <div className="bg-zinc-100/50 p-1 rounded-xl flex items-center gap-1 border border-zinc-200">
                        <div className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-[10px] font-black text-zinc-900 uppercase">Real Time</div>
                        <div className="px-4 py-1.5 text-[10px] font-bold text-zinc-400 uppercase">Historical</div>
                    </div>
                </div>

                {loading ? (
                    <div className="h-[200px] flex flex-col items-center justify-center gap-4">
                        <LoadingOutlined className="text-4xl text-primary" />
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Calibrating Core Metrics...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Student Registry"
                            value={stats.students.toString()}
                            icon={<UserOutlined className="text-primary" />}
                            trend={{ value: 12, isUp: true }}
                        />
                        <StatCard
                            title="Grade Units"
                            value={stats.classes.toString()}
                            icon={<BookOutlined className="text-accent" />}
                            trend={{ value: 0, isUp: true }}
                        />
                        <StatCard
                            title="Active Sessions"
                            value={stats.sections.toString()}
                            icon={<ProjectOutlined className="text-sky-500" />}
                            trend={{ value: 100, isUp: true }}
                        />
                        <StatCard
                            title="Faculty Load"
                            value="42"
                            icon={<CalendarOutlined className="text-emerald-500" />}
                            trend={{ value: 2, isUp: false }}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-zinc-900 text-sm uppercase tracking-widest text-gradient">Academic Velocity</h3>
                                <p className="text-zinc-400 text-[10px] font-medium mt-1 uppercase tracking-wider">Historical Performance Output</p>
                            </div>
                            <Tag className="bg-zinc-100 text-zinc-600 border-none font-bold text-[10px] rounded-lg">+14% Growth</Tag>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide={true}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -12px rgba(15, 23, 42, 0.12)', padding: '12px' }}
                                        labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '4px', fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-zinc-900 text-sm uppercase tracking-widest text-gradient">Presence Metrics</h3>
                                <p className="text-zinc-400 text-[10px] font-medium mt-1 uppercase tracking-wider">Weekly Attendance Flow</p>
                            </div>
                            <Tag className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] rounded-lg">96% Optimal</Tag>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }} />
                                    <Bar
                                        dataKey="rate"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
