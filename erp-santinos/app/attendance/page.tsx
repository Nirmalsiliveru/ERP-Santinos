'use client';

import React from "react";
import { Shell } from "@/lib/components/layout";
import { Button } from "@/lib/components/ui";
import {
    LeftOutlined,
    RightOutlined
} from "@ant-design/icons";

export default function AttendancePage() {
    const days = Array.from({ length: 14 }, (_, i) => i + 1);
    const students = [
        { id: 1, name: 'Sarah Jenkins', attendance: ['P', 'P', 'A', 'P', 'P'] },
        { id: 2, name: 'David Miller', attendance: ['P', 'P', 'P', 'P', 'P'] },
        { id: 3, name: 'Emily Watson', attendance: ['A', 'A', 'P', 'P', 'P'] },
    ];

    return (
        <Shell>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Attendance Tracking</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Daily presence monitoring for active classes.</p>
                    </div>
                    <Button className="btn-primary">Daily Update</Button>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="p-5 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" icon={<LeftOutlined />} className="text-zinc-400 hover:text-zinc-900" />
                            <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">April 2024</span>
                            <Button variant="ghost" icon={<RightOutlined />} className="text-zinc-400 hover:text-zinc-900" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" /><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PRESENT</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" /><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ABSENT</span></div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-50 bg-zinc-50/10">
                                    <th className="p-5 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] w-64">Student Unit</th>
                                    {days.map(day => (
                                        <th key={day} className="p-5 text-center text-[10px] font-bold text-zinc-400 w-12">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-zinc-50/50 transition-all">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                                <span className="text-sm font-bold text-zinc-900 tracking-tight">{student.name}</span>
                                            </div>
                                        </td>
                                        {days.map(day => {
                                            const status = student.attendance[day - 1] || (Math.random() > 0.1 ? 'P' : 'A');
                                            return (
                                                <td key={day} className="p-5">
                                                    <div className={`w-2.5 h-2.5 rounded-full mx-auto transition-all ${status === 'P' ? 'bg-emerald-500 shadow-inner' : 'bg-rose-500 shadow-inner opacity-20'}`} />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
