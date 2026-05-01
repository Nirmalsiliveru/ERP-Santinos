'use client';

import React, { useState, useEffect } from "react";
import { Modal, Form, Select, message, Alert } from "antd";
import api from "@/lib/api";

interface PromotionModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    selectedStudentIds: number[];
}

export function PromotionModal({ open, onCancel, onSuccess, selectedStudentIds }: PromotionModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    useEffect(() => {
        if (open) {
            fetchMetadata();
        }
    }, [open]);

    const fetchMetadata = async () => {
        try {
            const [classesRes, yearsRes] = await Promise.all([
                api.get('/classes'),
                api.get('/academic-years')
            ]);
            setClasses(classesRes.data);
            setAcademicYears(yearsRes.data);
        } catch (error) {
            message.error("Failed to load promotion metadata.");
        }
    };

    const handlePromote = async (values: any) => {
        setLoading(true);
        try {
            await api.post('/students/promote', {
                student_ids: selectedStudentIds,
                target_class_id: values.target_class_id,
                target_academic_year_id: values.target_academic_year_id
            });
            message.success(`Successfully promoted ${selectedStudentIds.length} students!`);
            onSuccess();
            form.resetFields();
        } catch (error) {
            message.error("Promotion cycle failed. Check target session connectivity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-black text-zinc-900 tracking-tight italic uppercase">Student Promotion Wizard</span>}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Initiate Promotion"
            cancelText="Abort"
            width={500}
            className="glass-modal"
        >
            <div className="py-4 space-y-6">
                <Alert
                    message={`Promoting ${selectedStudentIds.length} Students`}
                    description="This action will move selected students to the new academic session. All historical records will be preserved."
                    type="info"
                    showIcon
                    className="rounded-xl border-blue-100 bg-blue-50/50"
                />

                <Form form={form} layout="vertical" onFinish={handlePromote}>
                    <Form.Item 
                        name="target_academic_year_id" 
                        label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Target Academic Session</span>} 
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select target year" className="h-11 rounded-xl">
                            {academicYears.map((y: any) => (
                                <Select.Option key={y.id} value={y.id}>{y.name} {y.is_active ? '(Active)' : ''}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        name="target_class_id" 
                        label={<span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Target Grade/Class</span>} 
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select next grade" className="h-11 rounded-xl">
                            {classes.map((c: any) => (
                                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
