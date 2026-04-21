'use client';

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface UserFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddUserModal({ open, onCancel, onSuccess }: UserFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (open) {
            fetchRoles();
        }
    }, [open]);

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (error: any) {
            console.error("Fetch Roles Error:", error);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await api.post('/users/create', values);
            messageApi.success("New system operator initialized.");
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error("Add User Error:", error);
            messageApi.error(error.response?.data?.detail || "User initialization failed.");
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Provision New User</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Identity & Access Management</p>
                </div>
            }
            width={500}
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
                    name="email"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</span>}
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="user@school.com" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Password</span>}
                    rules={[{ required: true, message: 'Required' }]}
                >
                    <Input.Password className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50" placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                    name="role_id"
                    label={<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Role</span>}
                    rules={[{ required: true, message: 'Please select a role' }]}
                >
                    <Select
                        className="custom-select w-full"
                        placeholder="Select Role"
                        options={roles.map((r: any) => ({ value: r.id, label: r.name.toUpperCase() }))}
                    />
                </Form.Item>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
