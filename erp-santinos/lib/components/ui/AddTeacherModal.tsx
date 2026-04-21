'use client';

import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, message } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

import dayjs from "dayjs";

interface TeacherFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AddTeacherModal({ open, onCancel, onSuccess, initialData }: TeacherFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    ...initialData,
                    date_of_joining: initialData.date_of_joining ? dayjs(initialData.date_of_joining) : null
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                date_of_joining: values.date_of_joining?.format('YYYY-MM-DD')
            };

            if (initialData?.id) {
                await api.put(`/teachers/${initialData.id}`, payload);
                messageApi.success("Staff profile updated.");
            } else {
                await api.post('/teachers', payload);
                messageApi.success("New teacher onboarded.");
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Teacher Action Error:", error);
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
                        {initialData ? "Edit Faculty Profile" : "Onboard New Teacher"}
                    </h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Personnel Directory Entry</p>
                </div>
            }
            width={600}
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
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="first_name"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">First Name</span>}
                        rules={[{ required: true }]}
                    >
                        <Input className="h-11 rounded-xl" placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Name</span>}
                    >
                        <Input className="h-11 rounded-xl" placeholder="Last Name" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="email"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Primary Email</span>}
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input className="h-11 rounded-xl" placeholder="teacher@school.com" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Number</span>}
                    >
                        <Input className="h-11 rounded-xl" placeholder="+1 XXXXXXXXX" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="qualification"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Qualification</span>}
                    >
                        <Input className="h-11 rounded-xl" placeholder="e.g. M.Ed, PhD" />
                    </Form.Item>
                    <Form.Item
                        name="experience"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Experience (Years)</span>}
                    >
                        <Input className="h-11 rounded-xl" placeholder="e.g. 5 Years" />
                    </Form.Item>
                </div>

                <Form.Item
                    name="date_of_joining"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Join Date</span>}
                >
                    <DatePicker className="w-full custom-datepicker" />
                </Form.Item>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        {initialData ? "Save Changes" : "Confirm Onboarding"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
