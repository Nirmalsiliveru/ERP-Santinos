'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { Table, message, Tag, Tabs, Card, Statistic, Row, Col, Modal, Form, Input, Select, DatePicker, Button as AntButton } from "antd";
import { 
    DollarCircleOutlined, 
    CalendarOutlined, 
    UserOutlined, 
    PlusOutlined, 
    TransactionOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";
import dayjs from "dayjs";

const { TabPane } = Tabs;

export default function FeesPage() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [structures, setStructures] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(1); // Default to current
    const [studentFees, setStudentFees] = useState<any[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [selectedFee, setSelectedFee] = useState<any>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [assignForm] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, structRes, classRes, yearRes] = await Promise.all([
                api.get('/fees/categories'),
                api.get('/fees/structures'),
                api.get('/classes?size=100'),
                api.get('/academic-years')
            ]);
            
            console.log("Categories Fetched:", catRes.data);
            console.log("Classes Fetched:", classRes.data);

            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
            setStructures(Array.isArray(structRes.data) ? structRes.data.filter((s: any) => s.academic_year_id === selectedYear) : []);
            
            // Fail-proof extraction for classes
            let classList = [];
            if (Array.isArray(classRes.data)) {
                classList = classRes.data;
            } else if (classRes.data && Array.isArray(classRes.data.items)) {
                classList = classRes.data.items;
            } else if (classRes.data && typeof classRes.data === 'object') {
                // Try to find any array inside the object
                const possibleArray = Object.values(classRes.data).find(val => Array.isArray(val));
                if (possibleArray) classList = possibleArray as any[];
            }
            setClasses(classList);
            
            setAcademicYears(Array.isArray(yearRes.data) ? yearRes.data : []);
            
            const studentsRes = await api.get('/students');
            setStudentFees(studentsRes.data.items || studentsRes.data || []);
        } catch (error) {
            console.error("Financial Data Fetch Error:", error);
            messageApi.error("Sync failed. Check if Classes and Categories are created.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const handleAssignFees = async (values: any) => {
        try {
            await api.post('/fees/assign-bulk', null, { params: values });
            messageApi.success("Fee assignment protocols executed.");
            setIsAssignModalOpen(false);
            assignForm.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Bulk assignment failed.");
        }
    };

    const handleCreateCategory = async (values: any) => {
        try {
            await api.post('/fees/categories', values);
            messageApi.success("Fee category registered.");
            setIsCategoryModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Category registration failed.");
        }
    };

    const handleCreateStructure = async (values: any) => {
        try {
            const payload = {
                ...values,
                due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
                academic_year_id: selectedYear
            };
            await api.post('/fees/structures', payload);
            messageApi.success("Fee structure deployed.");
            setIsStructureModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Structure deployment failed.");
        }
    };

    const structureColumns = [
        {
            title: 'TARGET CLASS',
            dataIndex: ['class_obj', 'name'],
            key: 'class',
            render: (v: string) => <span className="font-black text-primary uppercase text-xs">{v || 'GLOBAL'}</span>
        },
        {
            title: 'FEE IDENTITY',
            dataIndex: 'name',
            key: 'name',
            render: (v: string) => <span className="font-black text-zinc-900 uppercase italic tracking-tighter">{v}</span>
        },
        {
            title: 'TERM',
            dataIndex: 'term',
            key: 'term',
            render: (v: string) => <Tag className="bg-primary/10 text-primary border-none font-black uppercase text-[9px] px-2">{v || 'ANNUAL'}</Tag>
        },
        {
            title: 'AMOUNT',
            dataIndex: 'amount',
            key: 'amount',
            render: (v: number) => <span className="font-mono font-bold text-zinc-900">₹{v.toLocaleString()}</span>
        }
    ];

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Financial Nexus</h1>
                            <Select 
                                value={selectedYear} 
                                onChange={setSelectedYear}
                                className="w-32 academic-year-select"
                                bordered={false}
                            >
                                {academicYears.map((y: any) => (
                                    <Select.Option key={y.id} value={y.id}>{y.name}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Institutional revenue management and student fee auditing.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsCategoryModalOpen(true)}>
                            <PlusOutlined /> New Category
                        </Button>
                        <Button variant="ghost" onClick={() => setIsAssignModalOpen(true)}>
                            <UserOutlined /> Assign to Students
                        </Button>
                        <Button variant="default" onClick={() => setIsStructureModalOpen(true)}>
                            <TransactionOutlined /> Configure Dues
                        </Button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <Row gutter={24}>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic 
                                title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Collection</span>}
                                value={1250000} 
                                prefix="₹" 
                                valueStyle={{ fontWeight: 900, color: '#000', fontStyle: 'italic', fontSize: '24px' }}
                            />
                            <div className="mt-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">+15% vs Last Month</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic 
                                title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Outstanding Dues</span>}
                                value={450000} 
                                prefix="₹" 
                                valueStyle={{ fontWeight: 900, color: '#f43f5e', fontStyle: 'italic', fontSize: '24px' }}
                            />
                            <div className="mt-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest">32 Students Overdue</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="glass-card">
                            <Statistic 
                                title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discounts/Scholarships</span>}
                                value={85000} 
                                prefix="₹" 
                                valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic', fontSize: '24px' }}
                            />
                            <div className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Waivers Applied</div>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Tabs */}
                <Tabs defaultActiveKey="ledger" className="premium-tabs">
                    <TabPane 
                        tab={<span><HistoryOutlined /> Fee Ledger</span>} 
                        key="ledger"
                    >
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={studentFees}
                                columns={[
                                    {
                                        title: 'STUDENT IDENTITY',
                                        key: 'student',
                                        render: (r: any) => (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold">
                                                    {r.first_name[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-zinc-900 text-xs uppercase tracking-tight">{r.first_name} {r.last_name}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold tracking-widest">{r.admission_number || 'ADM-001'}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'CLASS',
                                        dataIndex: ['class_obj', 'name'],
                                        key: 'class',
                                        render: (v) => <span className="text-[11px] font-black text-zinc-600">{v || 'N/A'}</span>
                                    },
                                    {
                                        title: 'STATUS',
                                        key: 'status',
                                        render: () => <Tag color="success" className="font-black text-[9px] uppercase italic border-none px-2 rounded-full">PAID</Tag>
                                    },
                                    {
                                        title: 'DUE',
                                        key: 'due',
                                        render: () => <span className="font-mono text-zinc-300 font-bold">₹0.00</span>
                                    },
                                    {
                                        title: 'ACTION',
                                        key: 'action',
                                        render: () => (
                                            <div className="flex gap-2">
                                                <AntButton type="link" className="text-primary font-black text-[10px] uppercase italic tracking-widest">
                                                    Collect
                                                </AntButton>
                                                <AntButton type="link" className="text-indigo-500 font-black text-[10px] uppercase italic tracking-widest">
                                                    Discount
                                                </AntButton>
                                            </div>
                                        )
                                    }
                                ]}
                                pagination={{ pageSize: 10 }}
                                rowClassName="h-16"
                            />
                        </div>
                    </TabPane>
                    
                    <TabPane 
                        tab={<span><DollarCircleOutlined /> Fee Structures</span>} 
                        key="structures"
                    >
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={structures}
                                columns={structureColumns}
                                pagination={false}
                                loading={loading}
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </div>

            {/* Category Modal */}
            <Modal
                title={<span className="font-black uppercase italic tracking-widest">Register Fee Category</span>}
                open={isCategoryModalOpen}
                onCancel={() => setIsCategoryModalOpen(false)}
                footer={null}
                centered
                width={400}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateCategory} className="pt-4">
                    <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Annual Tuition" className="h-11 font-bold" />
                    </Form.Item>
                    <Form.Item name="description" label="Internal Notes">
                        <Input.TextArea placeholder="Description of this category..." rows={3} />
                    </Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">
                        Register Protocol
                    </Button>
                </Form>
            </Modal>

            {/* Structure Modal */}
            <Modal
                title={<span className="font-black uppercase italic tracking-widest">Configure Fee Dues</span>}
                open={isStructureModalOpen}
                onCancel={() => setIsStructureModalOpen(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateStructure} className="pt-4">
                    <Form.Item name="name" label="Structure Identifier" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Class X - Term 1" className="h-11 font-bold" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="class_id" label="Target Class">
                                <Select placeholder="All Classes" className="h-11" allowClear>
                                    {classes.map((c: any) => (
                                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
                                <Select placeholder="Select Type" className="h-11">
                                    {categories.map((c: any) => (
                                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="term" label="Academic Term">
                                <Select placeholder="Select Term" className="h-11 font-bold">
                                    <Select.Option value="Annual">Annual</Select.Option>
                                    <Select.Option value="Term 1">Term 1</Select.Option>
                                    <Select.Option value="Term 2">Term 2</Select.Option>
                                    <Select.Option value="Term 3">Term 3</Select.Option>
                                    <Select.Option value="Monthly">Monthly</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="amount" label="Amount (INR)" rules={[{ required: true }]}>
                                <Input type="number" prefix="₹" placeholder="0.00" className="h-11 font-mono font-bold" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="due_date" label="Payment Deadline">
                        <DatePicker className="w-full h-11" />
                    </Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">
                        Deploy Financial Structure
                    </Button>
                </Form>
            </Modal>
            {/* Assign Modal */}
            <Modal
                title={<span className="font-black uppercase italic tracking-widest">Bulk Fee Assignment</span>}
                open={isAssignModalOpen}
                onCancel={() => setIsAssignModalOpen(false)}
                footer={null}
                centered
                width={500}
            >
                <Form form={assignForm} layout="vertical" onFinish={handleAssignFees} className="pt-4">
                    <Form.Item name="structure_id" label="Select Fee Structure" rules={[{ required: true }]}>
                        <Select placeholder="Choose Structure" className="h-11 font-bold">
                            {structures.map((s: any) => (
                                <Select.Option key={s.id} value={s.id}>
                                    {s.name} (₹{s.amount})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <div className="bg-zinc-50 p-6 rounded-xl space-y-4 mb-6 border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Target Selection</p>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="class_id" label="Class">
                                    <Select 
                                        placeholder="All Classes" 
                                        className="h-11" 
                                        allowClear
                                        onChange={async (id) => {
                                            if (id) {
                                                const res = await api.get(`/sections?class_id=${id}`);
                                                setSections(res.data);
                                            } else {
                                                setSections([]);
                                            }
                                        }}
                                    >
                                        {classes.map((c: any) => (
                                            <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="section_id" label="Section">
                                    <Select placeholder="All Sections" className="h-11" allowClear>
                                        {sections.map((s: any) => (
                                            <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <Button htmlType="submit" variant="default" className="w-full h-12">
                        Execute Bulk Allotment
                    </Button>
                </Form>
            </Modal>
        </Shell>
    );
}
