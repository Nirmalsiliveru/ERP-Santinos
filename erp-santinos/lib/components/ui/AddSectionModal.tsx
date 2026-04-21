'use client';

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface SectionFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddSectionModal({ open, onCancel, onSuccess }: SectionFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [classes, setClasses] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (open) {
            fetchClasses();
        }
    }, [open]);

    const fetchClasses = async () => {
        setLoadingClasses(true);
        try {
            const response = await api.get('/classes?size=100');
            setClasses(response.data.items || []);
        } catch (error: any) {
            console.error("Fetch Classes Error:", error);
        } finally {
            setLoadingClasses(false);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await api.post('/sections', values);
            messageApi.success("Subdivision registered successfully.");
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Add Section Error:", error);
            messageApi.error(error.response?.data?.detail || "Failed to initialize section.");
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Manage Sections</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Class Subdivisions</p>
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
                    name="class_id"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Grade</span>}
                    rules={[{ required: true, message: 'Please select a class' }]}
                >
                    <Select
                        className="custom-select w-full"
                        placeholder="Select Class"
                        loading={loadingClasses}
                        options={classes.map((c: any) => ({ value: c.id, label: c.name }))}
                    />
                </Form.Item>

                <Form.Item
                    name="name"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Section Name / Identifier</span>}
                    rules={[
                        { required: true, message: 'Required' },
                        { max: 10, message: 'Too long' }
                    ]}
                >
                    <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="e.g. A, B, or North" />
                </Form.Item>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        Create Section
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
