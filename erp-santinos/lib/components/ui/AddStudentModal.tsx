'use client';

import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import api from "@/lib/api";

interface StudentFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddStudentModal({ open, onCancel, onSuccess }: StudentFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Format dates for backend
            const payload = {
                ...values,
                date_of_birth: values.date_of_birth?.format('YYYY-MM-DD'),
                admission_date: values.admission_date?.format('YYYY-MM-DD'),
            };

            await api.post('/student', payload);
            message.success("New student unit initialized in the registry.");
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Add Student Error:", error);
            message.error(error.response?.data?.detail || "Registry write failed.");
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Enroll New Student</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Data Entry Module</p>
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
                initialValues={{ gender: 'Male' }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="first_name"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">First Name</span>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="e.g. John" />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Name</span>}
                    >
                        <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="e.g. Doe" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="email"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</span>}
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="student@edu.com" />
                    </Form.Item>
                    <Form.Item
                        name="admission_number"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admission ID</span>}
                    >
                        <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="ADM-2024-XXXX" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Form.Item
                        name="gender"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gender</span>}
                    >
                        <Select className="custom-select w-full" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
                    </Form.Item>
                    <Form.Item
                        name="date_of_birth"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date of Birth</span>}
                    >
                        <DatePicker className="custom-datepicker w-full" />
                    </Form.Item>
                    <Form.Item
                        name="admission_date"
                        label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admission Date</span>}
                    >
                        <DatePicker className="custom-datepicker w-full" />
                    </Form.Item>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button onClick={onCancel} className="h-11 px-8 rounded-xl font-bold text-zinc-500 hover:text-zinc-900 border-none bg-zinc-50">Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="btn-primary h-11 px-10 rounded-xl"
                    >
                        Finalize Enrollment
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
