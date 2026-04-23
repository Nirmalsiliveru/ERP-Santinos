'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, Tag, Modal, Form, Input, DatePicker, message } from "antd";
import { PlusOutlined, GlobalOutlined, BankOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import { useUser } from "@/lib/context/UserContext";
import dayjs from "dayjs";

export default function HolidaysPage() {
    const { user } = useUser();
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<any>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchHolidays = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/system/holidays?school_id=${user?.school_id || ''}`);
            setHolidays(res.data);
        } catch (error) {
            console.error("Fetch Holidays Error:", error);
            messageApi.error("Synchronization with calendar registry failed.");
        } finally {
            setLoading(false);
        }
    }, [user?.school_id, messageApi]);

    useEffect(() => {
        if (user) fetchHolidays();
    }, [user, fetchHolidays]);

    const onFinish = async (values: any) => {
        try {
            const payload = {
                name: values.name,
                date_val: values.date.format('YYYY-MM-DD'),
            };

            if (selectedHoliday) {
                await api.put(`/system/holidays/${selectedHoliday.id}?name=${payload.name}&date_val=${payload.date_val}`);
                messageApi.success("Academic event updated.");
            } else {
                const school_id = user?.is_platform_admin ? null : user?.school_id;
                await api.post(`/system/holidays?name=${payload.name}&date_val=${payload.date_val}${school_id ? '&school_id=' + school_id : ''}`);
                messageApi.success("Academic calendar updated successfully.");
            }

            setIsModalOpen(false);
            setSelectedHoliday(null);
            form.resetFields();
            fetchHolidays();
        } catch (error) {
            messageApi.error("Failed to update institutional calendar.");
        }
    };

    const onDelete = async (id: number) => {
        try {
            await api.delete(`/system/holidays/${id}`);
            messageApi.success("Holiday purged from registry.");
            fetchHolidays();
        } catch (error) {
            messageApi.error("Deletion protocol failed.");
        }
    };

    const columns = [
        {
            title: 'EVENT NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-black text-zinc-900 uppercase tracking-tight italic">{text}</span>
        },
        {
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => <Tag className="bg-zinc-100 text-zinc-500 border-none font-bold rounded-lg">{dayjs(date).format('MMMM DD, YYYY')}</Tag>
        },
        {
            title: 'SCOPE',
            dataIndex: 'school_id',
            key: 'scope',
            render: (sid: any) => (
                sid ?
                    <Tag icon={<BankOutlined />} color="blue" className="rounded-full border-none px-3 font-bold uppercase text-[9px]">Local School</Tag> :
                    <Tag icon={<GlobalOutlined />} color="gold" className="rounded-full border-none px-3 font-bold uppercase text-[9px]">Global Platform</Tag>
            )
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (r: any) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedHoliday(r);
                            form.setFieldsValue({
                                name: r.name,
                                date: dayjs(r.date)
                            });
                            setIsModalOpen(true);
                        }}
                    >
                        <EditOutlined className="text-zinc-400 hover:text-primary transition-colors" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(r.id)}
                    >
                        <DeleteOutlined className="text-zinc-400 hover:text-red-500 transition-colors" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Chronos Registry</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Manage institutional holidays and academic events.</p>
                    </div>
                    <Button
                        variant="default"
                        className="flex items-center gap-2"
                        onClick={() => {
                            setSelectedHoliday(null);
                            form.resetFields();
                            setIsModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> Register Holiday
                    </Button>
                </div>

                <div className="glass-card overflow-hidden">
                    <Table
                        dataSource={holidays}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        rowClassName="h-16"
                    />
                </div>
            </div>

            <Modal
                title={<div className="pb-4 border-b border-zinc-50"><h3 className="font-black text-zinc-900 uppercase tracking-tighter italic">{selectedHoliday ? 'Edit Event' : 'Register Academic Event'}</h3></div>}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedHoliday(null);
                }}
                footer={null}
                centered
            >
                <Form form={form} layout="vertical" onFinish={onFinish} className="pt-6 space-y-4">
                    <Form.Item name="name" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Holiday Name</span>} rules={[{ required: true }]}>
                        <Input placeholder="e.g. Winter Break" className="h-11 rounded-xl font-bold" />
                    </Form.Item>
                    <Form.Item name="date" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Event Date</span>} rules={[{ required: true }]}>
                        <DatePicker className="w-full h-11 rounded-xl font-bold" />
                    </Form.Item>

                    <div className="pt-6 flex justify-end gap-3 border-t border-zinc-50 mt-4">
                        <Button variant="ghost" onClick={() => {
                            setIsModalOpen(false);
                            setSelectedHoliday(null);
                        }}>Discard</Button>
                        <Button variant="default" htmlType="submit">{selectedHoliday ? 'Update Repository' : 'Commit to Registry'}</Button>
                    </div>
                </Form>
            </Modal>
        </Shell>
    );
}
