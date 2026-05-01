'use client';

import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, message, Tabs, Select, Upload, Divider, InputNumber } from "antd";
import { Button } from "@/lib/components/ui";
import { UserOutlined } from "@ant-design/icons";
import api from "@/lib/api";

import dayjs from "dayjs";

interface TeacherFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const { TabPane } = Tabs;

export function AddTeacherModal({ open, onCancel, onSuccess, initialData }: TeacherFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    ...initialData,
                    date_of_joining: initialData.date_of_joining ? dayjs(initialData.date_of_joining) : null,
                    date_of_birth: initialData.date_of_birth ? dayjs(initialData.date_of_birth) : null
                });
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [open, initialData, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                date_of_joining: values.date_of_joining?.format('YYYY-MM-DD'),
                date_of_birth: values.date_of_birth?.format('YYYY-MM-DD')
            };

            let teacherId = initialData?.id;
            let res;

            if (teacherId) {
                res = await api.put(`/teachers/${teacherId}`, payload);
            } else {
                res = await api.post('/teachers', payload);
                teacherId = res.data.id;
            }

            // Handle Photo Upload
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);
                await api.post(`/teachers/${teacherId}/photo`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            messageApi.success(teacherId ? "Faculty profile updated." : "New teacher onboarded successfully.");
            form.resetFields();
            setFileList([]);
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
                <div className="mb-2">
                    {contextHolder}
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                        {initialData ? "Edit Faculty Profile" : "Comprehensive Faculty Onboarding"}
                    </h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Institutional Personnel Directory</p>
                </div>
            }
            width={800}
            className="custom-modal"
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ employment_type: 'Permanent', nationality: 'Indian', gender: 'Male' }}
            >
                <Tabs defaultActiveKey="1" className="custom-tabs">
                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">1. Personal Identity</span>} key="1">
                        <div className="pt-8 flex flex-col md:flex-row gap-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group transition-all hover:border-primary/50">
                                    {fileList.length > 0 ? (
                                        <img src={URL.createObjectURL(fileList[0].originFileObj)} className="w-full h-full object-cover" alt="preview" />
                                    ) : initialData?.photo_url ? (
                                        <img src={initialData.photo_url} className="w-full h-full object-cover" alt="profile" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                                            <UserOutlined className="text-3xl" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">No Photo</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                                            accept="image/*"
                                        >
                                            <Button variant="default" size="sm" className="h-8 text-[9px]">Replace</Button>
                                        </Upload>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Faculty Biometrics</p>
                                    <p className="text-[8px] text-zinc-400 mt-1 uppercase">PNG, JPG up to 2MB</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <Form.Item name="first_name" label={<span className="label-text">First Name</span>} rules={[{ required: true }]}>
                                        <Input className="h-11 rounded-xl" />
                                    </Form.Item>
                                    <Form.Item name="middle_name" label={<span className="label-text">Middle Name</span>}>
                                        <Input className="h-11 rounded-xl" />
                                    </Form.Item>
                                    <Form.Item name="last_name" label={<span className="label-text">Last Name</span>}>
                                        <Input className="h-11 rounded-xl" />
                                    </Form.Item>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item name="date_of_birth" label={<span className="label-text">Date of Birth</span>}>
                                        <DatePicker className="w-full custom-datepicker" />
                                    </Form.Item>
                                    <Form.Item name="gender" label={<span className="label-text">Gender</span>}>
                                        <Select className="custom-select w-full" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <Form.Item name="blood_group" label={<span className="label-text">Blood Group</span>}>
                                <Select className="custom-select w-full" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(v => ({ value: v, label: v }))} />
                            </Form.Item>
                            <Form.Item name="marital_status" label={<span className="label-text">Marital Status</span>}>
                                <Select className="custom-select w-full" options={['Single', 'Married', 'Divorced', 'Widowed'].map(v => ({ value: v, label: v }))} />
                            </Form.Item>
                            <Form.Item name="nationality" label={<span className="label-text">Nationality</span>}>
                                <Input className="h-11 rounded-xl" />
                            </Form.Item>
                            <Form.Item name="aadhaar_number" label={<span className="label-text">Aadhaar/ID No.</span>}>
                                <Input className="h-11 rounded-xl" />
                            </Form.Item>
                        </div>
                    </TabPane>

                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">2. Professional Background</span>} key="2">
                        <div className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="qualification" label={<span className="label-text">Highest Qualification</span>} rules={[{ required: true }]}>
                                    <Input className="h-11 rounded-xl" placeholder="e.g. M.Sc Physics, PhD" />
                                </Form.Item>
                                <Form.Item name="experience" label={<span className="label-text">Total Experience</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="e.g. 8 Years" />
                                </Form.Item>
                            </div>
                            <Form.Item name="subject_expertise" label={<span className="label-text">Subject Expertise</span>}>
                                <Input className="h-11 rounded-xl" placeholder="e.g. Mathematics, Quantum Physics" />
                            </Form.Item>
                            <Form.Item name="previous_institution" label={<span className="label-text">Previous Institution</span>}>
                                <Input className="h-11 rounded-xl" />
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="pan_number" label={<span className="label-text">PAN Card Number</span>}>
                                    <Input className="h-11 rounded-xl uppercase" />
                                </Form.Item>
                                <Form.Item name="employee_id" label={<span className="label-text">Employment ID</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="ST-2024-XXX" />
                                </Form.Item>
                            </div>
                        </div>
                    </TabPane>

                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">3. Employment & Contact</span>} key="3">
                        <div className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="designation" label={<span className="label-text">Designation</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="e.g. Senior Teacher, HOD" />
                                </Form.Item>
                                <Form.Item name="department" label={<span className="label-text">Department</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="e.g. Science" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="date_of_joining" label={<span className="label-text">Date of Joining</span>}>
                                    <DatePicker className="w-full custom-datepicker" />
                                </Form.Item>
                                <Form.Item name="employment_type" label={<span className="label-text">Employment Type</span>}>
                                    <Select className="custom-select w-full" options={['Permanent', 'Contract', 'Part-time', 'Probation'].map(v => ({ value: v, label: v }))} />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="max_periods_per_week" label={<span className="label-text">Max Workload (Periods/Week)</span>}>
                                    <InputNumber min={1} max={100} className="w-full h-11 rounded-xl flex items-center bg-zinc-50/50" />
                                </Form.Item>
                            </div>
                            <Divider className="my-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="email" label={<span className="label-text">Primary Email</span>} rules={[{ required: true, type: 'email' }]}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="phone" label={<span className="label-text">Phone Number</span>} rules={[{ required: true }]}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="emergency_contact_name" label={<span className="label-text">Emergency Contact</span>}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="emergency_contact_phone" label={<span className="label-text">Emergency Phone</span>}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                            <Form.Item name="address" label={<span className="label-text">Permanent Address</span>}>
                                <Input.TextArea rows={2} className="rounded-xl" />
                            </Form.Item>
                        </div>
                    </TabPane>
                </Tabs>

                <div className="pt-8 mt-6 border-t border-zinc-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="default"
                        htmlType="submit"
                        loading={loading}
                    >
                        {initialData ? "Save Changes" : "Confirm Faculty Onboarding"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
