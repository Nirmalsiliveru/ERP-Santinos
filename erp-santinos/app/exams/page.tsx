'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { 
    Table, message, Tag, Tabs, Card, Statistic, Row, Col, 
    Modal, Form, Input, Select, DatePicker, Button as AntButton 
} from "antd";
import { 
    ReadOutlined, 
    CalendarOutlined, 
    TrophyOutlined, 
    PlusOutlined, 
    EditOutlined,
    CheckCircleOutlined,
    LineChartOutlined,
    CloudSyncOutlined
} from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import dayjs from "dayjs";

const { TabPane } = Tabs;

export default function ExamsPage() {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(1);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [examRes, subjectRes, yearRes] = await Promise.all([
                api.get('/exams'),
                api.get('/subjects'),
                api.get('/academic-years')
            ]);
            setExams(examRes.data);
            setSubjects(subjectRes.data);
            setAcademicYears(yearRes.data);
        } catch (error) {
            console.error("Data Fetch Error:", error);
            messageApi.error("Failed to synchronize academic data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const handleCreateExam = async (values: any) => {
        try {
            await api.post('/exams', values);
            messageApi.success("Exam protocol initialized.");
            setIsExamModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Protocol initialization failed.");
        }
    };

    const handleCreateSubject = async (values: any) => {
        try {
            await api.post('/subjects', values);
            messageApi.success("Subject registered in the nexus.");
            setIsSubjectModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Subject registration failed.");
        }
    };

    const examColumns = [
        {
            title: 'EXAM IDENTITY',
            dataIndex: 'name',
            key: 'name',
            render: (v: string) => <span className="font-black text-zinc-900 uppercase italic tracking-tighter">{v}</span>
        },
        {
            title: 'TERM',
            dataIndex: 'term',
            key: 'term',
            render: (v: string) => <Tag className="bg-primary/10 text-primary border-none font-black uppercase text-[9px] px-2">{v || 'ANNUAL'}</Tag>
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors: any = { 'Upcoming': 'processing', 'Ongoing': 'warning', 'Completed': 'success', 'Result Published': 'magenta' };
                return <Tag color={colors[status] || 'default'} className="font-black text-[9px] uppercase italic">{status}</Tag>
            }
        },
        {
            title: 'ACTION',
            key: 'action',
            render: () => <AntButton type="link" className="text-primary font-black text-[10px] uppercase italic">Configure</AntButton>
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Academic Evaluation Hub</h1>
                            <Select 
                                value={selectedYear} 
                                onChange={setSelectedYear}
                                className="w-32"
                                bordered={false}
                            >
                                {academicYears.map((y: any) => (
                                    <Select.Option key={y.id} value={y.id}>{y.name}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Manage examinations, grading protocols, and academic performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsSubjectModalOpen(true)}>
                            <PlusOutlined /> Register Subject
                        </Button>
                        <Button variant="default" onClick={() => setIsExamModalOpen(true)}>
                            <PlusOutlined /> Initialize Exam
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <Row gutter={24}>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Exams</span>} value={exams.filter(e => e.status === 'Ongoing').length} valueStyle={{ fontWeight: 900, color: '#000', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subjects Tracked</span>} value={subjects.length} valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Sync</span>} value="Active" prefix={<CloudSyncOutlined className="text-green-500" />} valueStyle={{ fontWeight: 900, color: '#10b981', fontStyle: 'italic' }} /></Card></Col>
                </Row>

                {/* Main Tabs */}
                <Tabs defaultActiveKey="exams" className="premium-tabs">
                    <TabPane tab={<span><CalendarOutlined /> Exam Protocols</span>} key="exams">
                        <div className="glass-card p-6">
                            <Table dataSource={exams} columns={examColumns} pagination={{ pageSize: 10 }} loading={loading} />
                        </div>
                    </TabPane>
                    <TabPane tab={<span><ReadOutlined /> Subjects</span>} key="subjects">
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={subjects} 
                                columns={[
                                    { title: 'CODE', dataIndex: 'code', key: 'code', render: (v) => <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">{v || 'N/A'}</span> },
                                    { title: 'SUBJECT NAME', dataIndex: 'name', key: 'name', render: (v) => <span className="font-black text-zinc-900 uppercase italic text-xs">{v}</span> },
                                    { title: 'DESCRIPTION', dataIndex: 'description', key: 'desc', render: (v) => <span className="text-[10px] text-zinc-500 font-medium">{v || '---'}</span> }
                                ]} 
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={<span><TrophyOutlined /> Performance Nexus</span>} key="performance">
                        <Card className="glass-card flex items-center justify-center h-64 border-dashed">
                            <div className="text-center">
                                <LineChartOutlined className="text-4xl text-zinc-200 mb-4" />
                                <p className="text-zinc-400 font-black uppercase italic tracking-widest text-[10px]">Analytics Module Pending Deployment</p>
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>

            {/* Modals */}
            <Modal title={<span className="font-black uppercase italic tracking-widest">Initialize Exam Protocol</span>} open={isExamModalOpen} onCancel={() => setIsExamModalOpen(false)} footer={null} centered width={450}>
                <Form form={form} layout="vertical" onFinish={handleCreateExam} className="pt-4">
                    <Form.Item name="name" label="Exam Title" rules={[{ required: true }]}><Input placeholder="e.g., Mid-Term Assessment" className="h-11 font-bold" /></Form.Item>
                    <Row gutter={16}>
                        <Col span={12}><Form.Item name="term" label="Academic Term"><Select placeholder="Select Term" className="h-11 font-bold"><Select.Option value="Term 1">Term 1</Select.Option><Select.Option value="Term 2">Term 2</Select.Option><Select.Option value="Final">Final Exam</Select.Option></Select></Form.Item></Col>
                        <Col span={12}><Form.Item name="academic_year_id" label="Academic Year" rules={[{ required: true }]}><Select placeholder="Select Year" className="h-11">{academicYears.map((y: any) => (<Select.Option key={y.id} value={y.id}>{y.name}</Select.Option>))}</Select></Form.Item></Col>
                    </Row>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Deploy Protocol</Button>
                </Form>
            </Modal>

            <Modal title={<span className="font-black uppercase italic tracking-widest">Register New Subject</span>} open={isSubjectModalOpen} onCancel={() => setIsSubjectModalOpen(false)} footer={null} centered width={400}>
                <Form form={form} layout="vertical" onFinish={handleCreateSubject} className="pt-4">
                    <Form.Item name="name" label="Subject Name" rules={[{ required: true }]}><Input placeholder="e.g., Advanced Mathematics" className="h-11 font-bold" /></Form.Item>
                    <Form.Item name="code" label="Subject Code"><Input placeholder="e.g., MATH-101" className="h-11 font-mono font-bold" /></Form.Item>
                    <Form.Item name="description" label="Notes"><Input.TextArea placeholder="Internal subject details..." rows={3} /></Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Register in Nexus</Button>
                </Form>
            </Modal>
        </Shell>
    );
}
