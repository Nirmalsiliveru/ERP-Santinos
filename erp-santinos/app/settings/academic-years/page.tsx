"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Typography, message, Modal, Form, Input, DatePicker, Checkbox } from "antd";
import { PlusOutlined, CalendarOutlined, EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import { Shell } from "@/lib/components/layout/Shell";
import dayjs from "dayjs";
import { useUser } from "@/lib/context/UserContext";

const { Title, Text } = Typography;

export default function AcademicYearsPage() {
    const { refreshUser } = useUser();
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchYears = async () => {
        setLoading(true);
        try {
            const response = await api.get("/academic-years/");
            setYears(response.data);
        } catch (error) {
            console.error("Fetch Years Error:", error);
            message.error("Failed to load academic years.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const onCreateYear = async (values: any) => {
        setModalLoading(true);
        try {
            await api.post("/academic-years/", {
                name: values.name,
                start_date: values.start_date.format('YYYY-MM-DD'),
                end_date: values.end_date.format('YYYY-MM-DD'),
                is_active: values.is_active || false
            });
            messageApi.success("New academic session initialized.");
            setIsModalOpen(false);
            form.resetFields();
            fetchYears();
            if (values.is_active) {
                refreshUser(); // Update global context if new one is active
            }
        } catch (error: any) {
            messageApi.error(error.response?.data?.detail || "Failed to create academic year.");
        } finally {
            setModalLoading(false);
        }
    };

    const onActivate = async (id: number) => {
        try {
            await api.patch(`/academic-years/${id}/activate`);
            messageApi.success("Academic year activated successfully.");
            fetchYears();
            refreshUser(); // Update the header
        } catch (error) {
            messageApi.error("Failed to activate year.");
        }
    };

    const columns = [
        {
            title: 'SESSION NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text className="font-bold text-zinc-900">{text}</Text>
        },
        {
            title: 'DURATION',
            key: 'duration',
            render: (_: any, record: any) => (
                <Text className="text-xs text-zinc-500 whitespace-nowrap">
                    {dayjs(record.start_date).format('MMM D, YYYY')} — {dayjs(record.end_date).format('MMM D, YYYY')}
                </Text>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active: boolean) => (
                <Tag
                    color={active ? '#10b981' : '#e4e4e7'}
                    className={`rounded-lg px-4 py-1.5 border-none text-[10px] uppercase font-black tracking-widest ${active ? 'text-white' : 'text-zinc-600'}`}
                >
                    {active ? 'CURRENT ACTIVE' : 'PREVIOUS SESSION'}
                </Tag>
            )
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    {!record.is_active ? (
                        <Button
                            variant="default"
                            size="sm"
                            className="text-[10px] h-8 px-4 font-bold bg-zinc-900 text-white rounded-lg border-none"
                            icon={<CheckCircleOutlined />}
                            onClick={() => onActivate(record.id)}
                        >
                            SET AS CURRENT
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Currently In Use
                        </div>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Shell>
            <>
                {contextHolder}
                <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm gap-4">
                        <div>
                            <Title level={2} className="!mb-1 !font-black tracking-tight text-3xl">Academic Sessions</Title>
                            <Text className="text-zinc-500 font-bold tracking-widest uppercase text-[11px] bg-zinc-50 px-2 py-1 rounded-lg">Historical Timeline Registry</Text>
                        </div>
                        <Button
                            variant="default"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto rounded-2xl h-14 px-8 shadow-xl shadow-zinc-200 bg-zinc-900 text-white border-none font-bold text-base"
                        >
                            Create Session
                        </Button>
                    </div>

                    <div className="bg-white overflow-hidden border border-zinc-100 rounded-[32px] shadow-2xl shadow-zinc-200/50">
                        <Table
                            columns={columns}
                            dataSource={years}
                            loading={loading}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            className="custom-table"
                        />
                    </div>
                </div>

                <style jsx global>{`
                    .custom-table .ant-table-thead > tr > th {
                        background: #fafafa !important;
                        color: #71717a !important;
                        font-size: 11px !important;
                        font-weight: 900 !important;
                        letter-spacing: 0.1em !important;
                        padding: 24px !important;
                        border-bottom: 2px solid #f4f4f5 !important;
                    }
                    .custom-table .ant-table-tbody > tr > td {
                        padding: 24px !important;
                        border-bottom: 1px solid #f4f4f5 !important;
                    }
                `}</style>

                {/* Create Session Modal */}
                <Modal
                    title={<div className="pb-4 border-b border-zinc-100"><Title level={4} className="!m-0 font-black tracking-tight">Initialize New Session</Title></div>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    width={500}
                    style={{ top: 20 }}
                >
                    <Form form={form} layout="vertical" onFinish={onCreateYear} className="pt-6 space-y-4">
                        <Form.Item name="name" label={<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Session Name</span>} rules={[{ required: true }]} help="e.g. 2025-26">
                            <Input placeholder="Enter session name" className="h-11 rounded-xl" />
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item name="start_date" label={<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Start Date</span>} rules={[{ required: true }]}>
                                <DatePicker placement="bottomLeft" className="w-full h-11 rounded-xl" getPopupContainer={(trigger) => trigger.parentElement as HTMLElement} />
                            </Form.Item>
                            <Form.Item name="end_date" label={<span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">End Date</span>} rules={[{ required: true }]}>
                                <DatePicker placement="bottomLeft" className="w-full h-11 rounded-xl" getPopupContainer={(trigger) => trigger.parentElement as HTMLElement} />
                            </Form.Item>
                        </div>
                        <Form.Item name="is_active" valuePropName="checked">
                            <Checkbox><span className="text-xs font-medium text-zinc-600">Activate this session immediately</span></Checkbox>
                        </Form.Item>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="default" htmlType="submit" loading={modalLoading}>Create Session</Button>
                        </div>
                    </Form>
                </Modal>
            </>
        </Shell>
    );
}
