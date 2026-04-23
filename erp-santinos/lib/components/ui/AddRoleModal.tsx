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
    const [permissions, setPermissions] = useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    const updateCheckAllStatus = React.useCallback((checkedList: any[], totalCount?: number) => {
        const count = totalCount || permissions.length;
        setIndeterminate(!!checkedList.length && checkedList.length < count);
        setCheckAll(checkedList.length === count && count > 0);
    }, [permissions.length]);

    const fetchPermissions = React.useCallback(async () => {
        try {
            const res = await api.get('/permissions');
            setPermissions(res.data);
            if (initialData) {
                const initialIds = initialData.permissions?.map((p: any) => p.id) || [];
                updateCheckAllStatus(initialIds, res.data.length);
            }
        } catch (error) {
            console.error("Fetch Permissions Error:", error);
        }
    }, [initialData, updateCheckAllStatus]);

    useEffect(() => {
        if (open) {
            fetchPermissions();
            if (initialData) {
                const initialIds = initialData.permissions?.map((p: any) => p.id) || [];
                form.setFieldsValue({
                    name: initialData.name,
                    permission_ids: initialIds
                });
                updateCheckAllStatus(initialIds);
            } else {
                form.resetFields();
                setCheckAll(false);
                setIndeterminate(false);
            }
        }
    }, [open, initialData, form, fetchPermissions, updateCheckAllStatus]);

    const onCheckAllChange = (e: any) => {
        const allIds = permissions.map((p: any) => p.id);
        const newCheckedList = e.target.checked ? allIds : [];
        form.setFieldsValue({ permission_ids: newCheckedList });
        setCheckAll(e.target.checked);
        setIndeterminate(false);
    };

    const onPermissionChange = (list: any) => {
        updateCheckAllStatus(list);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (initialData?.id) {
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
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Functional Scopes</span>
                        <Checkbox
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                            className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Select All
                        </Checkbox>
                    </div>
                    <Form.Item name="permission_ids">
                        <Checkbox.Group className="w-full grid grid-cols-2 gap-4" onChange={onPermissionChange}>
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
