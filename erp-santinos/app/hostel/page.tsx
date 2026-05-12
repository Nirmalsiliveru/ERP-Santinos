'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { 
    Table, message, Tag, Tabs, Card, Statistic, Row, Col, 
    Modal, Form, Input, Select, Button as AntButton 
} from "antd";
import { 
    HomeOutlined, 
    AppstoreOutlined, 
    UsergroupAddOutlined, 
    PlusOutlined, 
    SecurityScanOutlined,
    PieChartOutlined
} from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

const { TabPane } = Tabs;

export default function HostelPage() {
    const [loading, setLoading] = useState(true);
    const [hostels, setHostels] = useState<any[]>([]);
    const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/hostels');
            setHostels(res.data);
        } catch (error) {
            console.error("Hostel Sync Error:", error);
            messageApi.error("Residential synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddHostel = async (values: any) => {
        try {
            await api.post('/hostels', values);
            messageApi.success("Hostel facility registered.");
            setIsHostelModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Facility registration failed.");
        }
    };

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Residential Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Hostel facility management, room allocation, and occupancy tracking.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsHostelModalOpen(true)}>
                            <PlusOutlined /> Register Hostel
                        </Button>
                        <Button variant="default" onClick={() => setIsRoomModalOpen(true)}>
                            <AppstoreOutlined /> Configure Rooms
                        </Button>
                    </div>
                </div>

                {/* Residential Stats */}
                <Row gutter={24}>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Hostels</span>} value={hostels.length} prefix={<HomeOutlined />} valueStyle={{ fontWeight: 900, color: '#000', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Occupancy</span>} value={85} suffix="%" prefix={<UsergroupAddOutlined />} valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Status</span>} value="Secured" prefix={<SecurityScanOutlined className="text-green-500" />} valueStyle={{ fontWeight: 900, color: '#10b981', fontStyle: 'italic' }} /></Card></Col>
                </Row>

                {/* Main Content */}
                <Tabs defaultActiveKey="inventory" className="premium-tabs">
                    <TabPane tab={<span><AppstoreOutlined /> Facility Inventory</span>} key="inventory">
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={hostels} 
                                loading={loading}
                                columns={[
                                    { title: 'HOSTEL IDENTITY', dataIndex: 'name', key: 'name', render: (v) => <span className="font-black text-zinc-900 uppercase italic text-xs">{v}</span> },
                                    { title: 'TYPE', dataIndex: 'type', key: 'type', render: (v) => <Tag className="font-black text-[9px] uppercase italic">{v || 'UNSPECIFIED'}</Tag> },
                                    { title: 'ADDRESS', dataIndex: 'address', key: 'addr', render: (v) => <span className="text-[10px] text-zinc-500 font-bold">{v}</span> },
                                    { title: 'ACTION', key: 'action', render: () => <AntButton type="link" className="text-primary font-black text-[10px] uppercase italic">Manage Rooms</AntButton> }
                                ]} 
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={<span><PieChartOutlined /> Occupancy Analytics</span>} key="analytics">
                        <Card className="glass-card h-64 flex items-center justify-center border-dashed">
                            <div className="text-center">
                                <PieChartOutlined className="text-4xl text-zinc-200 mb-4" />
                                <p className="text-zinc-400 font-black uppercase italic tracking-widest text-[10px]">Analytics Protocol Pending Deployment</p>
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>

            {/* Modals */}
            <Modal title={<span className="font-black uppercase italic tracking-widest">Register Hostel Facility</span>} open={isHostelModalOpen} onCancel={() => setIsHostelModalOpen(false)} footer={null} centered width={400}>
                <Form form={form} layout="vertical" onFinish={handleAddHostel} className="pt-4">
                    <Form.Item name="name" label="Hostel Identity" rules={[{ required: true }]}><Input placeholder="e.g., Phoenix Boys Hostel" className="h-11 font-bold" /></Form.Item>
                    <Form.Item name="type" label="Facility Type"><Select placeholder="Select Type" className="h-11 font-bold"><Select.Option value="Boys">Boys Only</Select.Option><Select.Option value="Girls">Girls Only</Select.Option><Select.Option value="Co-ed">Co-educational</Select.Option></Select></Form.Item>
                    <Form.Item name="address" label="Internal Address"><Input.TextArea placeholder="Location details..." rows={3} /></Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Integrate Facility</Button>
                </Form>
            </Modal>
        </Shell>
    );
}
