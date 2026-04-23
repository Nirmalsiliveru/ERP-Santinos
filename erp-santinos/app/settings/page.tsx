'use client';

import React, { useState, useEffect } from "react";
import { Shell } from "@/lib/components/layout";
import { Form, Input, Card, Tabs, message, Space, Tag, Avatar, Divider, Upload } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyOutlined, BankOutlined, CameraOutlined } from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import { useUser } from "@/lib/context/UserContext";

export default function SettingsPage() {
    const { user, refreshUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onUploadPhoto = async (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            messageApi.success("Institutional avatar synchronized.");
            refreshUser();
            setLoading(false);
        } else if (info.file.status === 'error') {
            messageApi.error("Avatar upload failed.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            });
        }
    }, [user, profileForm]);

    const onUpdateProfile = async (values: any) => {
        setLoading(true);
        try {
            await api.put(`/users/me/profile?full_name=${encodeURIComponent(values.full_name || '')}&phone=${encodeURIComponent(values.phone || '')}`);
            messageApi.success("Profile credentials updated successfully.");
            refreshUser();
        } catch (error) {
            messageApi.error("Synchronization with user registry failed.");
        } finally {
            setLoading(false);
        }
    };

    const onChangePassword = async (values: any) => {
        setLoading(true);
        try {
            await api.put(`/users/me/change-password?old_password=${values.old_password}&new_password=${values.new_password}`);
            messageApi.success("Security protocols updated. Password changed.");
            passwordForm.resetFields();
        } catch (error: any) {
            messageApi.error(error.response?.data?.detail || "Security update failed.");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: '1',
            label: <span className="text-[10px] font-black uppercase tracking-widest px-2">Institutional Identity</span>,
            children: (
                <div className="max-w-xl mx-auto py-10">
                    <Form form={profileForm} layout="vertical" onFinish={onUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item name="full_name" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Full Legal Name</span>}>
                                <Input prefix={<UserOutlined />} className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold" />
                            </Form.Item>
                            <Form.Item name="phone" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact Number</span>}>
                                <Input prefix={<PhoneOutlined />} className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold" />
                            </Form.Item>
                        </div>
                        <Form.Item name="email" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Digital Identity (Email)</span>}>
                            <Input prefix={<MailOutlined />} disabled className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold opacity-60" />
                        </Form.Item>

                        <div className="pt-6 border-t border-zinc-100">
                            <Button variant="default" htmlType="submit" loading={loading} className="w-full md:w-auto px-10">
                                Update Identity
                            </Button>
                        </div>
                    </Form>
                </div>
            )
        },
        {
            key: '2',
            label: <span className="text-[10px] font-black uppercase tracking-widest px-2">Security Settings</span>,
            children: (
                <div className="max-w-xl mx-auto py-10">
                    <Form form={passwordForm} layout="vertical" onFinish={onChangePassword} className="space-y-6">
                        <Form.Item name="old_password" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Password</span>} rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold" />
                        </Form.Item>
                        <Form.Item name="new_password" label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Password</span>} rules={[{ required: true }]}>
                            <Input.Password prefix={<SafetyOutlined />} className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold" />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Confirm New Password</span>}
                            dependencies={['new_password']}
                            rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<SafetyOutlined />} className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-bold" />
                        </Form.Item>

                        <div className="pt-6 border-t border-zinc-100">
                            <Button variant="default" htmlType="submit" loading={loading} className="w-full md:w-auto px-10">
                                Update Password
                            </Button>
                        </div>
                    </Form>
                </div>
            )
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Account Hub</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Manage your institutional profile and security clusters.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Info Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                            <div className="relative inline-block group/avatar mb-6">
                                <Avatar
                                    size={100}
                                    src={user?.profile_photo ? `http://localhost:8000${user.profile_photo}` : null}
                                    className="bg-primary/5 text-primary border-4 border-white shadow-xl font-black text-3xl italic flex items-center justify-center overflow-hidden"
                                >
                                    {!user?.profile_photo && (user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : user?.email?.substring(0, 2).toUpperCase())}
                                </Avatar>
                                <Upload
                                    name="file"
                                    action="http://localhost:8000/users/me/photo"
                                    headers={{ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` }}
                                    showUploadList={false}
                                    onChange={onUploadPhoto}
                                    className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
                                >
                                    <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-all shadow-lg border-2 border-white">
                                        <CameraOutlined className="text-xs" />
                                    </div>
                                </Upload>
                            </div>

                            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">{user?.full_name || 'IDENTIFIED ENTITY'}</h2>
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2 block">{user?.email}</p>

                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                <Tag color="black" className="rounded-full border-none px-4 py-0.5 text-[10px] font-black uppercase italic tracking-widest">
                                    {user?.is_platform_admin ? 'PLATFORM OWNER' : user?.role}
                                </Tag>
                                <Tag icon={<BankOutlined />} color={user?.is_platform_admin ? "gold" : "blue"} className="rounded-full border-none px-4 py-0.5 text-[10px] font-black uppercase italic tracking-widest">
                                    {user?.is_platform_admin ? 'Global Node' : 'School Node'}
                                </Tag>
                            </div>

                            <Divider className="my-8 opacity-50" />

                            <div className="space-y-4 text-left">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-black text-zinc-400 uppercase tracking-widest">Node Status</span>
                                    <span className="font-black text-emerald-500 uppercase italic">OPERATIONAL</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-black text-zinc-400 uppercase tracking-widest">Sync Priority</span>
                                    <span className="font-black text-zinc-900 uppercase italic">CRITICAL</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-black text-zinc-400 uppercase tracking-widest">Created</span>
                                    <span className="font-black text-zinc-900 uppercase italic">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-zinc-900 text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <SafetyOutlined className="text-emerald-400" /> Security Telemetry
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                                Your account is protected by multi-tenant isolation and AES-256 encrypted session tokens.
                            </p>
                        </div>
                    </div>

                    {/* Right Action Column */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-2 !bg-white">
                            <Tabs
                                defaultActiveKey="1"
                                items={tabItems}
                                className="settings-tabs"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
