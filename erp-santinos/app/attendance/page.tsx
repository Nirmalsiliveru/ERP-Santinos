'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Button } from "@/lib/components/ui";
import { 
    Select, 
    DatePicker, 
    Table, 
    Radio, 
    Input, 
    message, 
    Tag,
    Empty,
    Spin,
    Alert
} from "antd";
import {
    SaveOutlined,
    SearchOutlined,
    LockOutlined,
    InfoCircleOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import api from "@/lib/api";
import dayjs from "dayjs";
import { useUser } from "@/lib/context/UserContext";

export default function AttendancePage() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<number, any>>({});
    
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [contextData, setContextData] = useState<any>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const isAdmin = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';
    const isHOD = user?.role === 'hod';

    // Fetch Attendance Context on mount
    useEffect(() => {
        const fetchContext = async () => {
            try {
                if (isTeacher || isHOD) {
                    const res = await api.get('/attendance/context');
                    setContextData(res.data);
                    
                    if (res.data.is_assigned) {
                        setClasses(res.data.classes);
                        if (res.data.classes.length === 1) {
                            setSelectedClass(res.data.classes[0].id);
                            setSections(res.data.classes[0].sections);
                            if (res.data.classes[0].sections.length === 1) {
                                setSelectedSection(res.data.classes[0].sections[0].id);
                            }
                        }
                    }
                } else {
                    // Admin logic
                    const classRes = await api.get('/classes?size=100');
                    setClasses(classRes.data.items);
                }
            } catch (error) {
                messageApi.error("Failed to fetch academic context.");
            }
        };
        if (user) fetchContext();
    }, [messageApi, isTeacher, isHOD, user]);

    // Update Sections when Class changes
    useEffect(() => {
        if (selectedClass) {
            if (isAdmin) {
                const fetchSections = async () => {
                    try {
                        const res = await api.get('/sections');
                        setSections(res.data.filter((s: any) => s.class_id === selectedClass));
                        setSelectedSection(null);
                        setStudents([]);
                    } catch (error) {
                        messageApi.error("Failed to fetch sections.");
                    }
                };
                fetchSections();
            } else if (isHOD || isTeacher) {
                const cls = classes.find(c => c.id === selectedClass);
                if (cls) {
                    setSections(cls.sections);
                    setSelectedSection(null);
                }
            }
        }
    }, [selectedClass, messageApi, isAdmin, isHOD, isTeacher, classes]);

    // Fetch Students and existing Attendance
    useEffect(() => {
        if (selectedSection && selectedDate) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const studentsRes = await api.get(`/students?section_id=${selectedSection}`);
                    const studentsList = studentsRes.data;
                    setStudents(studentsList);

                    const attendanceRes = await api.get(`/attendance/section/${selectedSection}?attendance_date=${selectedDate.format('YYYY-MM-DD')}`);
                    const existingAttendance = attendanceRes.data;

                    const initialAttendance: Record<number, any> = {};
                    studentsList.forEach((student: any) => {
                        const record = existingAttendance.find((a: any) => a.student_id === student.id);
                        initialAttendance[student.id] = {
                            status: record ? record.status : 'Present',
                            remarks: record ? record.remarks : ''
                        };
                    });
                    setAttendanceData(initialAttendance);
                } catch (error) {
                    messageApi.error("Failed to synchronize student attendance.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [selectedSection, selectedDate, messageApi]);

    const handleStatusChange = (studentId: number, status: string) => {
        if (isAdmin || isHOD) return; // Read-only
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleRemarksChange = (studentId: number, remarks: string) => {
        if (isAdmin || isHOD) return;
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };

    const handleSave = async () => {
        if (!selectedSection || !selectedDate || isAdmin || isHOD) return;

        setLoading(true);
        try {
            const records = students.map(student => ({
                student_id: student.id,
                section_id: selectedSection,
                academic_year_id: student.academic_year_id,
                date: selectedDate.format('YYYY-MM-DD'),
                status: attendanceData[student.id]?.status || 'Present',
                remarks: attendanceData[student.id]?.remarks || ''
            }));

            await api.post('/attendance/bulk', { records });
            messageApi.success(`Attendance synchronized for ${selectedDate.format('MMM DD, YYYY')}`);
        } catch (error: any) {
            messageApi.error(error.response?.data?.detail || "Nexus uplink failed.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ROLL NO',
            dataIndex: 'roll_number',
            key: 'roll_number',
            width: 100,
            render: (t: string) => <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t || 'N/A'}</span>
        },
        {
            title: 'STUDENT UNIT',
            key: 'name',
            render: (r: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 uppercase">
                        {r.first_name[0]}{r.last_name ? r.last_name[0] : ''}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 tracking-tight">{r.first_name} {r.last_name}</p>
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">ID: {r.admission_number}</p>
                    </div>
                </div>
            )
        },
        {
            title: 'STATUS',
            key: 'status',
            width: 300,
            render: (r: any) => (
                <Radio.Group 
                    value={attendanceData[r.id]?.status} 
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    className="attendance-radio-group"
                    disabled={isAdmin || isHOD}
                >
                    <Radio.Button value="Present" className="present">Present</Radio.Button>
                    <Radio.Button value="Absent" className="absent">Absent</Radio.Button>
                    <Radio.Button value="Late" className="late">Late</Radio.Button>
                </Radio.Group>
            )
        },
        {
            title: 'REMARKS',
            key: 'remarks',
            render: (r: any) => (
                <Input 
                    placeholder="Notes..." 
                    value={attendanceData[r.id]?.remarks}
                    onChange={(e) => handleRemarksChange(r.id, e.target.value)}
                    className="bg-transparent border-zinc-100 hover:border-zinc-300 focus:border-zinc-900 transition-all text-xs h-8"
                    disabled={isAdmin || isHOD}
                />
            )
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Attendance Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">
                            {isAdmin || isHOD ? 'Administrative and Departmental oversight.' : 'Real-time presence tracking and synchronization.'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {isHOD && (
                            <Tag icon={<SafetyCertificateOutlined />} color="gold" className="h-8 flex items-center px-3 font-bold uppercase text-[10px] tracking-widest border-none shadow-sm">
                                HOD: {contextData?.department_name}
                            </Tag>
                        )}
                        {(isAdmin || isHOD) && (
                            <Tag icon={<LockOutlined />} color="default" className="h-8 flex items-center px-3 font-bold uppercase text-[10px] tracking-widest">
                                Read Only
                            </Tag>
                        )}
                        <Select
                            placeholder="Select Class"
                            className="w-48"
                            onChange={setSelectedClass}
                            value={selectedClass}
                            options={classes.map(c => ({ label: c.name, value: c.id }))}
                            disabled={isTeacher && classes.length <= 1}
                        />
                        <Select
                            placeholder="Select Section"
                            className="w-48"
                            disabled={!selectedClass || (sections.length <= 1 && (isTeacher || isHOD))}
                            onChange={setSelectedSection}
                            value={selectedSection}
                            options={sections.map(s => ({ label: `Section ${s.name}`, value: s.id }))}
                        />
                        <DatePicker 
                            value={selectedDate} 
                            onChange={(date) => setSelectedDate(date || dayjs())}
                            className="w-40"
                            format="MMM DD, YYYY"
                        />
                        {!isAdmin && !isHOD && (
                            <Button 
                                className="btn-primary" 
                                disabled={!selectedSection || students.length === 0 || loading}
                                onClick={handleSave}
                                icon={loading ? <Spin size="small" /> : <SaveOutlined />}
                            >
                                Sync Attendance
                            </Button>
                        )}
                    </div>
                </div>

                {(isTeacher || isHOD) && contextData && !contextData.is_assigned && (
                    <Alert
                        message="Academic Assignment Required"
                        description={isHOD ? "You are not currently assigned as a Head of Department. Please contact the administrator." : "You are not currently assigned as a Class Teacher."}
                        type="info"
                        showIcon
                        icon={<InfoCircleOutlined />}
                        className="rounded-xl border-none bg-blue-50/50"
                    />
                )}

                {!selectedSection ? (
                    <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 text-zinc-300">
                            <SearchOutlined className="text-3xl" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Select parameters to begin</h3>
                        <p className="text-zinc-500 text-sm mt-2 max-w-xs">
                            {isHOD ? `Oversight view for the ${contextData?.department_name || 'assigned'} department.` : 'Access student presence records across the institution.'}
                        </p>
                    </div>
                ) : loading && students.length === 0 ? (
                    <div className="h-64 flex items-center justify-center">
                        <Spin tip="Fetching roster..." />
                    </div>
                ) : students.length === 0 ? (
                    <Empty description="No students found in this section roster." className="glass-card p-20" />
                ) : (
                    <div className="glass-card overflow-hidden">
                        <div className="p-5 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Tag color="blue" className="m-0 font-bold uppercase text-[10px] tracking-widest border-none px-3">
                                        Total roster: {students.length}
                                    </Tag>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            Present: {Object.values(attendanceData).filter(a => a.status === 'Present').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            Absent: {Object.values(attendanceData).filter(a => a.status === 'Absent').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {(isAdmin || isHOD) && (
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                    <LockOutlined className="text-xs" /> Oversight Mode
                                </span>
                            )}
                        </div>

                        <Table
                            dataSource={students}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                            className="attendance-table"
                            rowClassName="hover:bg-zinc-50/50 transition-all h-16"
                            loading={loading}
                        />
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .attendance-table .ant-table-thead > tr > th {
                    background: #fafafa;
                    font-size: 10px;
                    font-weight: 900;
                    color: #a1a1aa;
                    letter-spacing: 0.1em;
                    padding: 16px 20px;
                    border-bottom: 1px solid #f4f4f5;
                }
                .attendance-radio-group .ant-radio-button-wrapper {
                    border-radius: 8px !important;
                    margin-right: 8px;
                    border: 1px solid #f4f4f5 !important;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    height: 32px;
                    line-height: 30px;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .attendance-radio-group .ant-radio-button-wrapper:before {
                    display: none !important;
                }
                .attendance-radio-group .ant-radio-button-wrapper-checked.present {
                    background: #ecfdf5 !important;
                    color: #059669 !important;
                    border-color: #10b981 !important;
                }
                .attendance-radio-group .ant-radio-button-wrapper-checked.absent {
                    background: #fef2f2 !important;
                    color: #dc2626 !important;
                    border-color: #ef4444 !important;
                }
                .attendance-radio-group .ant-radio-button-wrapper-checked.late {
                    background: #fffbeb !important;
                    color: #d97706 !important;
                    border-color: #f59e0b !important;
                }
            `}</style>
        </Shell>
    );
}
