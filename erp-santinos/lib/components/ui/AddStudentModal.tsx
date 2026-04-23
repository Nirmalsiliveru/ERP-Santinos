'use client';

import React from "react";
import { Modal, Form, Input, DatePicker, Select, message, Tabs, Checkbox, Row, Col, Divider, Upload } from "antd";
import Image from "next/image";
import { Button } from "@/lib/components/ui";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/lib/api";

const { TabPane } = Tabs;

interface StudentFormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddStudentModal({ open, onCancel, onSuccess }: StudentFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [loadingAcademics, setLoadingAcademics] = React.useState(false);
    const [classes, setClasses] = React.useState<any[]>([]);
    const [sections, setSections] = React.useState<any[]>([]);
    const [filteredSections, setFilteredSections] = React.useState<any[]>([]);
    const [fileList, setFileList] = React.useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    React.useEffect(() => {
        if (open) {
            fetchAcademics();
        }
    }, [open]);

    const fetchAcademics = async () => {
        setLoadingAcademics(true);
        try {
            const [classRes, sectionRes] = await Promise.all([
                api.get('/classes?size=100'),
                api.get('/sections')
            ]);
            setClasses(classRes.data.items || []);
            setSections(sectionRes.data);
        } catch (error: any) {
            console.error("Fetch Academics Error:", error);
        } finally {
            setLoadingAcademics(false);
        }
    };

    const handleClassChange = (classId: number) => {
        const filtered = sections.filter(s => s.class_id === classId);
        setFilteredSections(filtered);
        form.setFieldValue('section_id', undefined);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                date_of_birth: values.date_of_birth?.format('YYYY-MM-DD'),
                admission_date: values.admission_date?.format('YYYY-MM-DD'),
            };

            const studentRes = await api.post('/student', payload);
            const studentId = studentRes.data.data.id;

            // Handle Photo Upload if exists
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);
                await api.post(`/student/${studentId}/photo`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            messageApi.success("Comprehensive student record & biometric data initialized.");
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error: any) {
            console.error("Add Student Error:", error);
            messageApi.error(error.response?.data?.detail || "Registry write failed.");
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Comprehensive Student Enrollment</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">High-Fidelity Unified Profile</p>
                </div>
            }
            width={720}
            className="custom-modal"
            centered
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 180px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '8px'
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ gender: 'Male', transport_required: false, hostel_required: false, nationality: 'Indian' }}
            >
                <Tabs defaultActiveKey="1" className="custom-tabs">
                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">1. Personal Identity</span>} key="1">
                        <div className="pt-8 flex flex-col md:flex-row gap-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group transition-all hover:border-primary/50">
                                    {fileList.length > 0 ? (
                                        <Image
                                            src={URL.createObjectURL(fileList[0].originFileObj)}
                                            className="w-full h-full object-cover"
                                            alt="preview"
                                            width={128}
                                            height={128}
                                            unoptimized
                                        />
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
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Biometric Profile</p>
                                    <p className="text-[8px] text-zinc-400 mt-1 uppercase">PNG, JPG up to 2MB</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item name="first_name" label={<span className="label-text">First Name</span>} rules={[{ required: true }]}>
                                        <Input className="h-11 rounded-xl" placeholder="Full legal first name" />
                                    </Form.Item>
                                    <Form.Item name="last_name" label={<span className="label-text">Last Name</span>}>
                                        <Input className="h-11 rounded-xl" placeholder="Legal surname" />
                                    </Form.Item>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item name="date_of_birth" label={<span className="label-text">Date of Birth</span>} rules={[{ required: true }]}>
                                        <DatePicker className="w-full custom-datepicker" placement="bottomRight" />
                                    </Form.Item>
                                    <Form.Item name="gender" label={<span className="label-text">Gender</span>}>
                                        <Select className="custom-select w-full" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <Form.Item name="blood_group" label={<span className="label-text">Blood Group</span>}>
                                <Select className="custom-select w-full" placeholder="Select" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(v => ({ value: v, label: v }))} />
                            </Form.Item>
                            <Form.Item name="religion" label={<span className="label-text">Religion</span>}>
                                <Input className="h-11 rounded-xl" placeholder="Institutional record" />
                            </Form.Item>
                            <Form.Item name="category" label={<span className="label-text">Category</span>}>
                                <Select className="custom-select w-full" options={[{ value: 'General', label: 'General' }, { value: 'OBC', label: 'OBC' }, { value: 'SC', label: 'SC' }, { value: 'ST', label: 'ST' }]} />
                            </Form.Item>
                            <Form.Item name="aadhaar_number" label={<span className="label-text">Aadhaar / ID No.</span>}>
                                <Input className="h-11 rounded-xl" placeholder="XXXX-XXXX-XXXX" />
                            </Form.Item>
                        </div>
                    </TabPane>

                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">2. Academic & Parents</span>} key="2">
                        <div className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="admission_number" label={<span className="label-text">Admission ID</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="REG-24-XXX" />
                                </Form.Item>
                                <Form.Item name="admission_date" label={<span className="label-text">Admission Date</span>}>
                                    <DatePicker className="w-full custom-datepicker" placement="bottomRight" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="class_id" label={<span className="label-text">Grade Level</span>} rules={[{ required: true }]}>
                                    <Select className="custom-select w-full" loading={loadingAcademics} onChange={handleClassChange} options={classes.map(c => ({ value: c.id, label: c.name }))} />
                                </Form.Item>
                                <Form.Item name="section_id" label={<span className="label-text">Section Unit</span>} rules={[{ required: true }]}>
                                    <Select className="custom-select w-full" disabled={!form.getFieldValue('class_id')} options={filteredSections.map(s => ({ value: s.id, label: s.name }))} />
                                </Form.Item>
                            </div>
                            <Divider className="my-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="father_name" label={<span className="label-text">Father&apos;s Name</span>} rules={[{ required: true }]}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="father_occupation" label={<span className="label-text">Father&apos;s Occupation</span>}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="mother_name" label={<span className="label-text">Mother&apos;s Name</span>}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="mother_occupation" label={<span className="label-text">Mother&apos;s Occupation</span>}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                        </div>
                    </TabPane>

                    <TabPane tab={<span className="text-[10px] font-bold uppercase tracking-widest px-2">3. Medical & Contact</span>} key="3">
                        <div className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="email" label={<span className="label-text">Primary Email</span>} rules={[{ required: true, type: 'email' }]}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="parent_phone" label={<span className="label-text">Parent Contact</span>} rules={[{ required: true }]}>
                                    <Input className="h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                            <Form.Item name="address" label={<span className="label-text">Permanent Address</span>}>
                                <Input.TextArea rows={2} className="rounded-xl" />
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="medical_conditions" label={<span className="label-text">Medical Conditions</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="Chronic conditions if any" />
                                </Form.Item>
                                <Form.Item name="allergies" label={<span className="label-text">Known Allergies</span>}>
                                    <Input className="h-11 rounded-xl" placeholder="Food/Medication allergies" />
                                </Form.Item>
                            </div>
                            <div className="flex gap-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <Form.Item name="transport_required" valuePropName="checked" className="mb-0">
                                    <Checkbox className="text-[11px] font-black uppercase tracking-widest">Transport Required</Checkbox>
                                </Form.Item>
                                <Form.Item name="hostel_required" valuePropName="checked" className="mb-0">
                                    <Checkbox className="text-[11px] font-black uppercase tracking-widest">Hostel Facility</Checkbox>
                                </Form.Item>
                            </div>
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
                        Initialize Full Profile
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

// Minimal CSS component for labels
const labelStyle = `
.label-text {
    font-size: 10px;
    font-weight: 900;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
`;
