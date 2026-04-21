'use client';

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, message, Divider } from "antd";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

interface RoleFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AddRoleModal({ open, onCancel, onSuccess, initialData }: RoleFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (open) {
            fetchPermissions();
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    permission_ids: initialData.permissions?.map((p: any) => p.id) || []
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const fetchPermissions = async () => {
        try {
            const res = await api.get('/permissions');
            setPermissions(res.data);
        } catch (error) {
            console.error("Fetch Permissions Error:", error);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (initialData?.id) {
                // Backend might need update_role endpoint
                await api.put(`/roles/${initialData.id}`, values);
                messageApi.success("Role permissions updated.");
            } else {
                await api.post('/roles', values);
                messageApi.success("New system role defined.");
            }
            onSuccess();
        } catch (error: any) {
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
                        {initialData ? "Configure Permissions" : "Define System Role"}
                    </h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Access Control Management</p>
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
                className="space-y-6"
            >
                <Form.Item
                    name="name"
                    label={<span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Role Identifier</span>}
                    rules={[{ required: true }]}
                >
                    <Input className="h-11 rounded-xl font-bold italic" placeholder="e.g. SUPER_ADMIN" disabled={!!initialData} />
                </Form.Item>

                <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Functional Scopes</span>
                    <Form.Item name="permission_ids">
                        <Checkbox.Group className="w-full grid grid-cols-2 gap-4">
                            {permissions.map((p: any) => (
                                <div key={p.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 transition-all flex items-center gap-3">
                                    <Checkbox value={p.id} />
                                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-tight">{p.name.replace(/_/g, ' ')}</span>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        Save Configuration
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
