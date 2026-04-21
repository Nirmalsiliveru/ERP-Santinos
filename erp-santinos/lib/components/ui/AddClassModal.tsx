'use client';

import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface ClassFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddClassModal({ open, onCancel, onSuccess }: ClassFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await api.post('/classes', values);
            messageApi.success("Academic unit established in core architecture.");
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Add Class Error:", error);
            messageApi.error(error.response?.data?.detail || "Structural initialization failed.");
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Define New Class</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Grade Level Specification</p>
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
                        Initialize Grade
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
