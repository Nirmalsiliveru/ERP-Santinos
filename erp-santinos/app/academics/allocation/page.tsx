'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag, Card, Statistic, Row, Col, Modal, Form, Select, Button as AntButton } from "antd";
import { 
    AppstoreAddOutlined, 
    SolutionOutlined, 
    BookOutlined, 
    PlusOutlined, 
    ClusterOutlined,
    SafetyOutlined
} from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

export default function SubjectAllocationPage() {
    const [loading, setLoading] = useState(true);
    const [allocations, setAllocations] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allocRes, teacherRes, subjectRes, classRes] = await Promise.all([
                api.get('/academics/allocations'),
                api.get('/teachers'),
                api.get('/subjects'),
                api.get('/classes')
            ]);
            setAllocations(allocRes.data);
            setTeachers(teacherRes.data.items || teacherRes.data);
            setSubjects(subjectRes.data);
            setClasses(classRes.data.items || classRes.data);
        } catch (error) {
            console.error("Allocation Sync Error:", error);
            messageApi.error("Curriculum data synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAllocate = async (values: any) => {
        try {
            await api.post('/academics/allocate', { ...values, academic_year_id: 1 });
            messageApi.success("Allocation protocol executed.");
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Allocation protocol failed.");
        }
    };

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Curriculum Allocation Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Faculty-subject mapping, strategic resource distribution, and curriculum auditing.</p>
                    </div>
                    <Button variant="default" onClick={() => setIsModalOpen(true)}>
                        <PlusOutlined /> New Allocation
                    </Button>
                </div>

                <Row gutter={24}>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Allocations</span>} value={allocations.length} prefix={<ClusterOutlined />} valueStyle={{ fontWeight: 900, color: '#000', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subjects Covered</span>} value={subjects.length} prefix={<BookOutlined />} valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Allocation Integrity</span>} value="High" prefix={<SafetyOutlined className="text-green-500" />} valueStyle={{ fontWeight: 900, color: '#10b981', fontStyle: 'italic' }} /></Card></Col>
                </Row>

                <div className="glass-card p-6">
                    <Table 
                        dataSource={allocations} 
                        loading={loading}
                        columns={[
                            { title: 'TEACHER', dataIndex: ['teacher', 'first_name'], key: 'teacher', render: (v, r) => <span className="font-black text-zinc-900 uppercase italic text-xs">{r.teacher?.first_name} {r.teacher?.last_name}</span> },
                            { title: 'SUBJECT', dataIndex: ['subject', 'name'], key: 'subject', render: (v) => <Tag color="blue" className="font-black text-[9px] uppercase italic">{v}</Tag> },
                            { title: 'CLASS', dataIndex: ['class_obj', 'name'], key: 'class', render: (v) => <span className="text-[11px] font-black text-zinc-600">{v}</span> },
                            { title: 'ACTION', key: 'action', render: () => <AntButton type="link" danger className="font-black text-[10px] uppercase italic">Revoke</AntButton> }
                        ]} 
                    />
                </div>
            </div>

            <Modal title={<span className="font-black uppercase italic tracking-widest">Execute Allocation Protocol</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} centered width={500}>
                <Form form={form} layout="vertical" onFinish={handleAllocate} className="pt-4">
                    <Form.Item name="teacher_id" label="Faculty Member" rules={[{ required: true }]}><Select placeholder="Choose Faculty" className="h-11">{teachers.map((t: any) => (<Select.Option key={t.id} value={t.id}>{t.first_name} {t.last_name}</Select.Option>))}</Select></Form.Item>
                    <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}><Select placeholder="Choose Subject" className="h-11">{subjects.map((s: any) => (<Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>))}</Select></Form.Item>
                    <Form.Item name="class_id" label="Class" rules={[{ required: true }]}><Select placeholder="Choose Class" className="h-11">{classes.map((c: any) => (<Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>))}</Select></Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Execute Mapping</Button>
                </Form>
            </Modal>
        </Shell>
    );
}
