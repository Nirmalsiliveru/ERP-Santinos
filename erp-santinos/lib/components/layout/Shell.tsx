"use client";

import React, { useState } from "react";
import { Layout, Menu, Button as AntButton, Dropdown, type MenuProps } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    CheckCircleOutlined,
    FileProtectOutlined,
    DollarOutlined,
    BarChartOutlined,
    SettingOutlined,
    BellOutlined,
    SearchOutlined,
    LogoutOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useUser } from "@/lib/context/UserContext";
import { GlobalOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const MotionDiv = motion.div as any;

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const [collapsed, setCollapsed] = useState(false);
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            router.push("/");
        }
    };

    const userMenu: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'My Profile',
            icon: <UserOutlined />,
            onClick: () => router.push('/settings')
        },
        {
            key: 'settings',
            label: 'Account Settings',
            icon: <SettingOutlined />,
            onClick: () => router.push('/settings')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout Unit',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },
    ];

    const baseMenuItems: MenuProps['items'] = [
        { key: "/dashboard", icon: <DashboardOutlined />, label: <Link href="/dashboard" className="text-[13px]">Dashboard</Link> },
        { key: "/students", icon: <UserOutlined />, label: <Link href="/students" className="text-[13px]">Students</Link> },
        { key: "/teachers", icon: <TeamOutlined />, label: <Link href="/teachers" className="text-[13px]">Teachers</Link> },
        { key: "/academics", icon: <BookOutlined />, label: <Link href="/academics" className="text-[13px]">Academics</Link> },
        { key: "/attendance", icon: <CheckCircleOutlined />, label: <Link href="/attendance" className="text-[13px]">Attendance</Link> },
        { key: "/exams", icon: <FileProtectOutlined />, label: <Link href="/exams" className="text-[13px]">Exams</Link> },
        { key: "/fees", icon: <DollarOutlined />, label: <Link href="/fees" className="text-[13px]">Fees</Link> },
        { key: "/reports", icon: <BarChartOutlined />, label: <Link href="/reports" className="text-[13px]">Reports</Link> },
        { key: "/users", icon: <SafetyCertificateOutlined />, label: <Link href="/users" className="text-[13px]">User Management</Link> },
        { key: "/rbac", icon: <FileProtectOutlined />, label: <Link href="/rbac" className="text-[13px]">Roles & Permissions</Link> },
        { key: "/settings", icon: <SettingOutlined />, label: <Link href="/settings" className="text-[13px]">Settings</Link> },
    ];

    const menuItems: MenuProps['items'] = user?.is_platform_admin
        ? [
            { key: "/platform", icon: <GlobalOutlined />, label: <Link href="/platform" className="text-[13px] font-bold text-primary">School Management</Link> } as any,
            { type: 'divider' } as any,
            ...baseMenuItems
        ]
        : baseMenuItems;

    if (!hasMounted) return <div className="min-h-screen bg-white" />;

    return (
        <Layout className="h-screen overflow-hidden bg-white">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
                className="sidebar-minimal hidden md:block border-r border-zinc-200/60 transition-all font-sans"
                width={260}
                trigger={null}
            >
                <div className="p-8 pb-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-black shadow-sm font-sans">
                        {user?.is_platform_admin ? 'P' : 'B'}
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-primary uppercase tracking-tight leading-none font-sans">
                                {user?.is_platform_admin ? 'Platform Admin' : 'BodhiEdu'}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1 font-sans">
                                {user?.is_platform_admin ? 'Multi-tenant Control' : 'SaaS ERP'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="px-1 custom-menu">
                    <Menu
                        mode="inline"
                        theme="light"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        className="border-none !bg-transparent"
                    />
                </div>

                {/* Support Card - Hide for Platform Admin as they are the support */}
                {!collapsed && !user?.is_platform_admin && (
                    <div className="mx-6 mt-12 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 relative group transition-all">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Support</p>
                        <p className="text-[11px] font-medium text-zinc-500 mt-2 leading-relaxed">Need help with the platform?</p>
                        <button className="text-[10px] font-bold text-zinc-900 mt-4 block hover:underline uppercase tracking-widest">Documentation</button>
                    </div>
                )}
            </Sider>

            <Layout className="!bg-white flex flex-col h-full">
                <Header className="!bg-white px-8 h-12 flex items-center justify-between border-b border-zinc-100 z-[100] flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </button>

                        <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">
                            <span>{user?.is_platform_admin ? 'PLATFORM OWNER' : 'ADMIN'}</span>
                            <span className="text-zinc-200">/</span>
                            <span className="text-zinc-900">{pathname?.split('/')[1]?.toUpperCase() || 'OVERVIEW'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center relative group" title="Search all schools (Platform Admin restriction)">
                            <SearchOutlined className="absolute left-3 text-zinc-300 text-[12px] group-focus-within:text-zinc-900 transition-colors" />
                            <input
                                type="text"
                                placeholder={user?.is_platform_admin ? "Search Schools..." : "Search..."}
                                className="bg-zinc-50 border border-zinc-100 rounded-lg pl-9 pr-3 h-8 w-40 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-300 focus:w-56 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all relative">
                                <BellOutlined />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border-2 border-white" />
                            </button>

                            <div className="h-4 w-[1px] bg-zinc-200 mx-1" />

                            <Dropdown menu={{ items: userMenu }} trigger={['click']} placement="bottomRight">
                                <button className="flex items-center gap-2 pl-2 group outline-none">
                                    <span className="text-xs font-bold text-zinc-900 hidden md:block font-sans">
                                        {user?.email?.split('@')[0] || 'Admin'}
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-900 group-hover:bg-zinc-200 transition-all font-sans relative">
                                        {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <Content className="overflow-y-auto flex-1 linear-grid p-8 lg:p-12 relative">
                    <AnimatePresence mode="wait">
                        <MotionDiv
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="max-w-[1400px] mx-auto"
                        >
                            {children}
                        </MotionDiv>
                    </AnimatePresence>
                </Content>
            </Layout>
        </Layout>
    );
}
