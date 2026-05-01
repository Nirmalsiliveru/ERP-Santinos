'use client';

import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { LockOutlined, KeyOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface ChangePasswordModalProps {
    open: boolean;
    onCancel: () => void;
}

export function ChangePasswordModal({ open, onCancel }: ChangePasswordModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await api.post('/change-password', {
                old_password: values.old_password,
                new_password: values.new_password
            });
            messageApi.success("Credential updated successfully! Please use your new password from your next login.");
            form.resetFields();
            setTimeout(() => {
                onCancel();
            }, 1500);
        } catch (error: any) {
            console.error("Change Password Error:", error);
            messageApi.error(error.response?.data?.detail || "Authentication registry update failed.");
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
                <div className="mb-4">
                    {contextHolder}
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                        <SafetyCertificateOutlined className="text-primary" />
                        Security Update
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Registry Credential Modification</p>
                </div>
            }
            width={400}
            className="custom-modal"
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="pt-4"
            >
                <Form.Item
                    name="old_password"
                    label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Password</span>}
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined className="text-zinc-300" />} 
                        className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" 
                        placeholder="••••••••"
                    />
                </Form.Item>

                <Form.Item
                    name="new_password"
                    label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Secure Password</span>}
                    rules={[
                        { required: true, message: 'Please enter your new password' },
                        { min: 8, message: 'Password must be at least 8 characters' }
                    ]}
                >
                    <Input.Password 
                        prefix={<KeyOutlined className="text-zinc-300" />} 
                        className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" 
                        placeholder="••••••••"
                    />
                </Form.Item>

                <Form.Item
                    name="confirm_password"
                    label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Confirm New Password</span>}
                    dependencies={['new_password']}
                    rules={[
                        { required: true, message: 'Please confirm your new password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        prefix={<KeyOutlined className="text-zinc-300" />} 
                        className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" 
                        placeholder="••••••••"
                    />
                </Form.Item>

                <div className="flex flex-col gap-3 pt-6">
                    <Button 
                        className="h-12 rounded-2xl font-black text-xs uppercase tracking-widest btn-primary shadow-lg shadow-primary/20"
                        htmlType="submit"
                        loading={loading}
                    >
                        Update Credentials
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={onCancel} 
                        className="h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-zinc-400"
                        disabled={loading}
                    >
                        Keep Current Password
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
