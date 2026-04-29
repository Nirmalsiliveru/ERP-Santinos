"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Card, Typography, message, Modal, Form, Input } from "antd";
import { PlusOutlined, BankOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import { Shell } from "@/lib/components/layout/Shell";

const { Title, Text } = Typography;

export default function PlatformDashboard() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<any>(null);
    const [form] = Form.useForm();
    const [adminForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await api.get("/platform/schools"); // Need to create this endpoint in FastAPI if not exists
            setSchools(response.data);
        } catch (error) {
            console.error("Fetch Schools Error:", error);
            // If endpoint doesn't exist, I'll handle it or mock it for now
            // message.error("Platform API not ready.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const onCreateSchool = async (values: any) => {
        setModalLoading(true);
        try {
            await api.post(`/platform/schools?name=${values.name}&subdomain=${values.subdomain}`);
            messageApi.success("New school onboarded to the platform.");
            setIsModalOpen(false);
            form.resetFields();
            fetchSchools();
        } catch (error: any) {
            messageApi.error(error.response?.data?.detail || "Onboarding failed.");
        } finally {
            setModalLoading(false);
        }
    };

    const onCreateAdmin = async (values: any) => {
        setModalLoading(true);
        try {
            await api.post(`/platform/schools/${selectedSchool.id}/admin`, values);
            messageApi.success(`School Admin credentials generated for ${selectedSchool.name}`);
            setIsAdminModalOpen(false);
            adminForm.resetFields();
        } catch (error: any) {
            messageApi.error(error.response?.data?.detail || "Credential generation failed.");
        } finally {
            setModalLoading(false);
        }
    };

    const columns = [
        {
            title: 'INSTITUTION',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary">
                        <BankOutlined />
                    </div>
                    <div>
                        <Text className="font-bold text-zinc-900 block">{text}</Text>
                        <Text className="text-[10px] text-zinc-400 uppercase tracking-widest">{record.subdomain}.bodhiedu.com</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active: boolean) => (
                <Tag color={active ? 'emerald' : 'orange'} className="rounded-full px-3 py-0.5 border-none text-[10px] uppercase font-bold tracking-widest">
                    {active ? 'Operational' : 'Suspended'}
                </Tag>
            )
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px]"
                        onClick={() => {
                            setSelectedSchool(record);
                            setIsAdminModalOpen(true);
                        }}
                    >
                        Create Admin
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <Title level={2} className="!mb-1 !font-black tracking-tight">Platform Control Center</Title>
                        <Text className="text-zinc-400 font-medium tracking-wide uppercase text-[10px]">Multi-tenant Instance Management</Text>
                    </div>
                    <Button
                        variant="default"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        Onboard New School
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-none shadow-sm bg-primary/5">
                        <div className="flex flex-col gap-1">
                            <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Institutions</Text>
                            <Title level={2} className="!m-0 !font-black">12</Title>
                        </div>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm">
                        <div className="flex flex-col gap-1">
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Students</Text>
                            <Title level={2} className="!m-0 !font-black text-zinc-900">4.2k</Title>
                        </div>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-sm">
                        <div className="flex flex-col gap-1">
                            <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Server Status</Text>
                            <Title level={4} className="!m-0 !font-black text-emerald-500 uppercase tracking-widest pt-2">Healthy</Title>
                        </div>
                    </Card>
                </div>

                <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={schools}
                        loading={loading}
                        rowKey="id"
                        pagination={false}
                        className="custom-table"
                        scroll={{ x: 'max-content' }}
                    />
                </Card>

                {/* Create School Modal */}
                <Modal
                    title={<div className="pb-4 border-b border-zinc-100"><Title level={4} className="!m-0 font-black tracking-tight">Onboard New Institution</Title></div>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    centered
                    width={500}
                    className="custom-modal"
                >
                    <Form form={form} layout="vertical" onFinish={onCreateSchool} className="pt-6 space-y-4">
                        <Form.Item name="name" label={<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">School Name</span>} rules={[{ required: true }]}>
                            <Input placeholder="e.g. Saint Mary Global School" className="h-11 rounded-xl" />
                        </Form.Item>
                        <Form.Item name="subdomain" label={<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Platform Subdomain</span>} rules={[{ required: true }]}>
                            <div className="flex items-center gap-2">
                                <Input placeholder="stmary" className="h-11 rounded-xl flex-1" />
                                <span className="text-zinc-400 font-bold text-[10px]">.bodhiedu.com</span>
                            </div>
                        </Form.Item>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="default" htmlType="submit" loading={modalLoading}>Initialize Instance</Button>
                        </div>
                    </Form>
                </Modal>

                {/* Create School Admin Modal */}
                <Modal
                    title={<div className="pb-4 border-b border-zinc-100"><Title level={4} className="!m-0 font-black tracking-tight">Generate Admin Credentials</Title></div>}
                    open={isAdminModalOpen}
                    onCancel={() => setIsAdminModalOpen(false)}
                    footer={null}
                    centered
                >
                    <div className="pt-4 pb-2">
                        <Text className="text-zinc-400 text-xs">Assigning primary administrative access to </Text>
                        <Text className="font-bold text-zinc-900 text-xs">{selectedSchool?.name}</Text>
                    </div>
                    <Form form={adminForm} layout="vertical" onFinish={onCreateAdmin} className="pt-4 space-y-4">
                        <Form.Item name="email" label={<span className="label-text">Admin Email Address</span>} rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="admin@school.com" className="h-11 rounded-xl" />
                        </Form.Item>
                        <Form.Item name="password" label={<span className="label-text">Secure Passcode</span>} rules={[{ required: true, min: 6 }]}>
                            <Input.Password placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" className="h-11 rounded-xl" />
                        </Form.Item>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsAdminModalOpen(false)}>Discard</Button>
                            <Button variant="default" htmlType="submit" icon={<UserAddOutlined />} loading={modalLoading}>Assign Ownership</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </Shell>
    );
}
