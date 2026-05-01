'use client';

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface ClassFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AddClassModal({ open, onCancel, onSuccess, initialData }: ClassFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (open) {
            fetchTeachers();
            if (initialData) {
                form.setFieldsValue(initialData);
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/teachers');
            setTeachers(response.data.items || response.data);
        } catch (error) {
            console.error("Fetch Teachers Error:", error);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put(`/classes/${initialData.id}`, values);
                messageApi.success("Academic unit updated in core architecture.");
            } else {
                await api.post('/classes', values);
                messageApi.success("Academic unit established in core architecture.");
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Class Operation Error:", error);
            messageApi.error(error.response?.data?.detail || "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={
                <div className="mb-6">
                    {contextHolder}
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                        {initialData ? "Update Grade Level" : "Define New Class"}
                    </h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {initialData ? "Modify Specifications" : "Grade Level Specification"}
                    </p>
                </div>
            }
            width={450}
            className="custom-modal"
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="space-y-4"
                initialValues={{ capacity: 40 }}
            >
                <Form.Item
                    name="name"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Grade Name</span>}
                    rules={[
                        { required: true, message: 'Required' },
                        { max: 50, message: 'Too long' }
                    ]}
                >
                    <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="e.g. Grade 10 or Class X" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="capacity"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Max Capacity</span>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <InputNumber min={1} max={200} className="w-full h-11 rounded-xl border-zinc-200 bg-zinc-50/50 flex items-center" />
                    </Form.Item>

                    <Form.Item
                        name="class_teacher_id"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Class Teacher</span>}
                    >
                        <Select placeholder="Assign Teacher" className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" allowClear>
                            {teachers.map((t: any) => (
                                <Select.Option key={t.id} value={t.id}>{t.first_name} {t.last_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Metadata / Description</span>}
                >
                    <Input.TextArea
                        className="rounded-xl border-zinc-200 bg-zinc-50/50 p-4"
                        placeholder="Optional details regarding this level..."
                        rows={3}
                    />
                </Form.Item>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        {initialData ? "Update Grade" : "Initialize Grade"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
