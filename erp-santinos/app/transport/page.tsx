'use client';

import React, { useEffect, useState } from "react";
import { Shell } from "@/lib/components/layout";
import { 
    Table, message, Tag, Tabs, Card, Statistic, Row, Col, 
    Modal, Form, Input, Select, Button as AntButton 
} from "antd";
import { 
    CarOutlined, 
    EnvironmentOutlined, 
    TeamOutlined, 
    PlusOutlined, 
    RadarChartOutlined,
    SafetyCertificateOutlined,
    DeploymentUnitOutlined
} from "@ant-design/icons";
import { Button } from "@/lib/components/ui";
import api from "@/lib/api";

const { TabPane } = Tabs;

export default function TransportPage() {
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [vehicleRes, routeRes] = await Promise.all([
                api.get('/transport/vehicles'),
                api.get('/transport/routes')
            ]);
            setVehicles(vehicleRes.data);
            setRoutes(routeRes.data);
        } catch (error) {
            console.error("Transport Sync Error:", error);
            messageApi.error("Logistics synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddVehicle = async (values: any) => {
        try {
            await api.post('/transport/vehicles', values);
            messageApi.success("Vehicle registered in the fleet.");
            setIsVehicleModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Fleet registration failed.");
        }
    };

    const handleAddRoute = async (values: any) => {
        try {
            await api.post('/transport/routes', values);
            messageApi.success("Route protocol deployed.");
            setIsRouteModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            messageApi.error("Route deployment failed.");
        }
    };

    return (
        <Shell>
            {contextHolder}
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Logistics Nexus</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Fleet management, route optimization, and student transport security.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsVehicleModalOpen(true)}>
                            <PlusOutlined /> Register Vehicle
                        </Button>
                        <Button variant="default" onClick={() => setIsRouteModalOpen(true)}>
                            <EnvironmentOutlined /> Deploy New Route
                        </Button>
                    </div>
                </div>

                {/* Logistics Stats */}
                <Row gutter={24}>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Fleet</span>} value={vehicles.length} prefix={<CarOutlined />} valueStyle={{ fontWeight: 900, color: '#000', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Routes Operational</span>} value={routes.length} prefix={<DeploymentUnitOutlined />} valueStyle={{ fontWeight: 900, color: '#6366f1', fontStyle: 'italic' }} /></Card></Col>
                    <Col span={8}><Card className="glass-card"><Statistic title={<span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Safety Index</span>} value={98} suffix="%" prefix={<SafetyCertificateOutlined className="text-green-500" />} valueStyle={{ fontWeight: 900, color: '#10b981', fontStyle: 'italic' }} /></Card></Col>
                </Row>

                {/* Logistics Tabs */}
                <Tabs defaultActiveKey="fleet" className="premium-tabs">
                    <TabPane tab={<span><CarOutlined /> Fleet Inventory</span>} key="fleet">
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={vehicles} 
                                loading={loading}
                                columns={[
                                    { title: 'VEHICLE NO', dataIndex: 'vehicle_number', key: 'vno', render: (v) => <span className="font-mono font-bold text-primary">{v}</span> },
                                    { title: 'MODEL', dataIndex: 'vehicle_model', key: 'model', render: (v) => <span className="font-black text-zinc-900 uppercase italic text-xs">{v}</span> },
                                    { title: 'CAPACITY', dataIndex: 'capacity', key: 'cap', render: (v) => <Tag className="font-black text-[10px]">{v} SEATS</Tag> },
                                    { title: 'STATUS', dataIndex: 'status', key: 'status', render: (v) => <Tag color="success" className="font-black text-[9px] uppercase italic">{v || 'ACTIVE'}</Tag> }
                                ]} 
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={<span><EnvironmentOutlined /> Route Protocols</span>} key="routes">
                        <div className="glass-card p-6">
                            <Table 
                                dataSource={routes} 
                                loading={loading}
                                columns={[
                                    { title: 'ROUTE IDENTITY', dataIndex: 'name', key: 'name', render: (v) => <span className="font-black text-zinc-900 uppercase italic text-xs">{v}</span> },
                                    { title: 'START POINT', dataIndex: 'start_point', key: 'start', render: (v) => <span className="text-[10px] text-zinc-500 font-bold">{v}</span> },
                                    { title: 'END POINT', dataIndex: 'end_point', key: 'end', render: (v) => <span className="text-[10px] text-zinc-500 font-bold">{v}</span> },
                                    { title: 'MONTHLY FARE', dataIndex: 'fare', key: 'fare', render: (v) => <span className="font-mono font-bold">₹{v}</span> }
                                ]} 
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </div>

            {/* Modals */}
            <Modal title={<span className="font-black uppercase italic tracking-widest">Register Vehicle Protocol</span>} open={isVehicleModalOpen} onCancel={() => setIsVehicleModalOpen(false)} footer={null} centered width={400}>
                <Form form={form} layout="vertical" onFinish={handleAddVehicle} className="pt-4">
                    <Form.Item name="vehicle_number" label="Registration Number" rules={[{ required: true }]}><Input placeholder="e.g., DL-01-AB-1234" className="h-11 font-mono font-bold" /></Form.Item>
                    <Form.Item name="vehicle_model" label="Vehicle Model"><Input placeholder="e.g., Tata Starbus 40" className="h-11 font-bold" /></Form.Item>
                    <Form.Item name="capacity" label="Seating Capacity"><Input type="number" placeholder="40" className="h-11" /></Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Integrate to Fleet</Button>
                </Form>
            </Modal>

            <Modal title={<span className="font-black uppercase italic tracking-widest">Deploy Route Protocol</span>} open={isRouteModalOpen} onCancel={() => setIsRouteModalOpen(false)} footer={null} centered width={450}>
                <Form form={form} layout="vertical" onFinish={handleAddRoute} className="pt-4">
                    <Form.Item name="name" label="Route Identity" rules={[{ required: true }]}><Input placeholder="e.g., North Sector Route 7" className="h-11 font-bold" /></Form.Item>
                    <Row gutter={16}>
                        <Col span={12}><Form.Item name="start_point" label="Start Point"><Input placeholder="School Campus" className="h-11" /></Form.Item></Col>
                        <Col span={12}><Form.Item name="end_point" label="End Point"><Input placeholder="Sector 14 Terminal" className="h-11" /></Form.Item></Col>
                    </Row>
                    <Form.Item name="fare" label="Monthly Subscription (INR)"><Input type="number" prefix="₹" placeholder="1500" className="h-11 font-mono font-bold" /></Form.Item>
                    <Button htmlType="submit" variant="default" className="w-full h-12 mt-4">Deploy Protocol</Button>
                </Form>
            </Modal>
        </Shell>
    );
}
