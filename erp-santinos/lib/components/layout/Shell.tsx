"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, type MenuProps, notification, Drawer } from "antd";
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
    SafetyCertificateOutlined,
    CalendarOutlined,
    GlobalOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SessionSwitcher } from "./SessionSwitcher";
import { useUser } from "@/lib/context/UserContext";
import { useSocket } from "@/lib/hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { addNotification, markAsRead, clearAllNotifications, markAllAsRead } from "@/lib/store/slices/notificationSlice";
import { ChangePasswordModal } from "@/lib/components/ui/ChangePasswordModal";

const { Header, Sider, Content } = Layout;

const MotionDiv = motion.div as any;

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, refreshUser } = useUser();
    const socket = useSocket();
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    React.useEffect(() => {
        if (socket) {
            if (user?.school_id) {
                socket.emit("join_room", `school_${user.school_id}`);
            }

            if (user?.is_platform_admin) {
                socket.emit("join_room", "platform_admins");
            }

            // Listen for live notifications
            socket.on("notification", (data: any) => {
                // Update Redux notification state
                dispatch(addNotification({
                    message: data.message,
                    description: data.description,
                    notification_type: data.type || 'info',
                }));

                api.open({
                    message: <span className="font-black text-zinc-900 uppercase tracking-tighter italic">{data.message}</span>,
                    description: <span className="text-zinc-500 font-medium text-xs">{data.description}</span>,
                    placement: 'bottomRight',
                    duration: 5,
                    className: "glass-card !border-zinc-100 !shadow-2xl !rounded-2xl",
                    icon: <BellOutlined className="text-primary" />
                });
            });

            return () => {
                socket.off("notification");
            };
        }
    }, [socket, user, api, dispatch]);

    React.useEffect(() => {
        if (hasMounted && user?.must_change_password) {
            setIsChangePasswordOpen(true);
        }
    }, [hasMounted, user]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            console.log("Initiating Logout...");
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            // Hard refresh to clear all states
            window.location.href = '/';
        }
    };

    const userMenu: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile & Settings',
            icon: <SettingOutlined />,
            onClick: () => router.push('/settings')
        },
        {
            key: 'security',
            label: 'Security & Password',
            icon: <SafetyCertificateOutlined />,
            onClick: () => setIsChangePasswordOpen(true)
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
    const baseMenuItems = [
        {
            key: "/dashboard", 
            icon: <DashboardOutlined />, 
            label: <Link href="/dashboard" className="text-[13px]">Dashboard</Link>,
            permission: "read_dashboard"
        },
        { 
            key: "/students", 
            icon: <UserOutlined />, 
            label: <Link href="/students" className="text-[13px]">Students</Link>,
            permission: "manage_students"
        },
        { 
            key: "/teachers", 
            icon: <TeamOutlined />, 
            label: <Link href="/teachers" className="text-[13px]">Teachers</Link>,
            permission: "manage_teachers"
        },
        { 
            key: "/academics", 
            icon: <BookOutlined />, 
            label: <Link href="/academics" className="text-[13px]">Academics</Link>,
            permission: "manage_classes" 
        },
        { 
            key: "/attendance", 
            icon: <CheckCircleOutlined />, 
            label: <Link href="/attendance" className="text-[13px]">Attendance</Link>,
            permission: "read_attendance"
        },
        {
            key: "/holidays", 
            icon: <CalendarOutlined />, 
            label: <Link href="/holidays" className="text-[13px]">Holidays</Link>,
            permission: "manage_holidays"
        },
        { 
            key: "/exams", 
            icon: <FileProtectOutlined />, 
            label: <Link href="/exams" className="text-[13px]">Exams</Link>,
            permission: "view_reports"
        },
        { 
            key: "/fees", 
            icon: <DollarOutlined />, 
            label: <Link href="/fees" className="text-[13px]">Fees</Link>,
            permission: "manage_fees"
        },
        { 
            key: "/reports", 
            icon: <BarChartOutlined />, 
            label: <Link href="/reports" className="text-[13px]">Reports</Link>,
            permission: "view_reports"
        },
        { 
            key: "/users", 
            icon: <SafetyCertificateOutlined />, 
            label: <Link href="/users" className="text-[13px]">User Management</Link>,
            permission: "manage_users"
        },
        { 
            key: "/rbac", 
            icon: <FileProtectOutlined />, 
            label: <Link href="/rbac" className="text-[13px]">Roles & Permissions</Link>,
            permission: "manage_roles"
        },
        { 
            key: "/settings/audit-logs", 
            icon: <BarChartOutlined />, 
            label: <Link href="/settings/audit-logs" className="text-[13px]">System Audit Logs</Link>,
            permission: "manage_users" // Audits are usually admin-level
        },
        { type: 'divider' },
        { 
            key: "/settings/academic-years", 
            icon: <CalendarOutlined />, 
            label: <Link href="/settings/academic-years" className="text-[13px] font-bold">Academic Sessions</Link>,
            permission: "manage_classes"
        },
        { 
            key: "/settings", 
            icon: <SettingOutlined />, 
            label: <Link href="/settings" className="text-[13px]">Settings</Link>,
            permission: "manage_settings"
        },
    ];

    // Filter items based on backend permissions
    const filteredMenuItems = baseMenuItems.filter(item => {
        if (item.type === 'divider') return true;
        if (!item.permission) return false; // Every item now requires a permission
        
        // Platform admins with '*' get everything
        if (user?.permissions?.includes('*')) return true;
        
        return user?.permissions?.includes(item.permission);
    });

    let menuItems: MenuProps['items'] = [];
    if (user?.is_platform_admin) {
        menuItems = [
            { key: "/platform", icon: <GlobalOutlined />, label: <Link href="/platform" className="text-[13px] font-bold text-primary">School Management</Link> } as any,
            { type: 'divider' } as any,
            ...filteredMenuItems as any
        ];
    } else {
        menuItems = filteredMenuItems as any;
    }

    if (!hasMounted) return <div className="min-h-screen bg-white" />;

    const SidebarContent = (
        <div className="h-full flex flex-col">
            <div className="p-8 pb-10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-black shadow-sm font-sans">
                    {user?.is_platform_admin ? 'P' : 'B'}
                </div>
                {(!collapsed || mobileVisible) && (
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-primary uppercase tracking-tight leading-none font-sans">
                            {user?.is_platform_admin ? 'Platform Admin' : user?.role === 'teacher' ? 'Faculty Member' : 'BodhiEdu'}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1 font-sans">
                            {user?.is_platform_admin ? 'Multi-tenant Control' : user?.role === 'teacher' ? 'Teacher Nexus' : 'SaaS ERP'}
                        </span>
                    </div>
                )}
            </div>

            <div className="px-1 custom-menu flex-1 overflow-y-auto">
                <Menu
                    mode="inline"
                    theme="light"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={() => setMobileVisible(false)}
                    className="border-none !bg-transparent"
                />
            </div>

            {!user?.is_platform_admin && (
                <div className="mx-6 mt-auto mb-8 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 relative group transition-all">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Support</p>
                    <p className="text-[11px] font-medium text-zinc-500 mt-2 leading-relaxed">Need help with the platform?</p>
                    <button className="text-[10px] font-bold text-zinc-900 mt-4 block hover:underline uppercase tracking-widest">Documentation</button>
                </div>
            )}
        </div>
    );

    return (
        <Layout className="h-screen overflow-hidden bg-white">
            {contextHolder}

            {/* Desktop Sidebar */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
                className="sidebar-minimal hidden md:block border-r border-zinc-200/60 transition-all font-sans"
                width={260}
                trigger={null}
            >
                {SidebarContent}
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileVisible(false)}
                open={mobileVisible}
                width={280}
                styles={{ body: { padding: 0 } }}
                closable={false}
                className="mobile-drawer"
            >
                {SidebarContent}
            </Drawer>

            <Layout className="!bg-white flex flex-col h-full">
                <Header className="!bg-white px-8 h-12 flex items-center justify-between border-b border-zinc-100 z-[100] flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-zinc-400 hover:text-zinc-900 transition-colors hidden md:block" // Desktop collapse
                        >
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </button>

                        <button
                            onClick={() => setMobileVisible(true)}
                            className="text-zinc-400 hover:text-zinc-900 transition-colors md:hidden" // Mobile hamburger
                        >
                            <MenuUnfoldOutlined />
                        </button>

                        <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">
                            <span>{user?.is_platform_admin ? 'PLATFORM OWNER' : user?.role?.toUpperCase() || 'ADMIN'}</span>
                            <span className="text-zinc-200">/</span>
                            <span className="text-zinc-900">{pathname?.split('/')[1]?.toUpperCase() || 'OVERVIEW'}</span>
                        </div>

                        {!user?.is_platform_admin && (
                            <div className="ml-6 pl-6 border-l border-zinc-100">
                                <SessionSwitcher />
                            </div>
                        )}
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

                            {/* Manual Automation Trigger for Demo */}
                            <button
                                onClick={async () => {
                                    try {
                                        api.info({ message: "Sync Initiated", description: "Backend is scanning for daily events...", placement: 'bottomRight' });
                                        await fetch("http://localhost:8000/system/trigger-daily-checks", { method: 'POST' });
                                    } catch (e) {
                                        console.error("Sync Trigger Failed", e);
                                    }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all"
                                title="Sync Daily Events"
                            >
                                <TeamOutlined className="text-[14px]" />
                            </button>

                            <Dropdown
                                trigger={['click']}
                                placement="bottomRight"
                                popupRender={() => (
                                    <div className="glass-card w-80 p-4 !shadow-2xl !bg-white">
                                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-50">
                                            <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Notification Registry</span>
                                            <span
                                                className="text-[9px] font-bold text-primary cursor-pointer hover:underline"
                                                onClick={() => dispatch(clearAllNotifications())}
                                            >
                                                Clear All
                                            </span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                                            {notifications.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">No active alerts</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => dispatch(markAsRead(n.id))}
                                                        className={`p-3 rounded-xl border transition-all group cursor-pointer ${n.read
                                                            ? 'bg-zinc-50/50 border-zinc-50 opacity-60'
                                                            : 'bg-white border-zinc-100 hover:border-primary/20 shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <p className={`text-[11px] font-black uppercase tracking-tighter italic leading-none ${n.read ? 'text-zinc-500' : 'text-zinc-900'}`}>{n.message}</p>
                                                            {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                                                        </div>
                                                        <p className="text-[10px] text-zinc-500 mt-1 lines-2 font-medium">{n.description}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            >
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all relative">
                                    <BellOutlined />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                            {notifications.filter(n => !n.read).length}
                                        </span>
                                    )}
                                </button>
                            </Dropdown>

                            <div className="h-4 w-[1px] bg-zinc-200 mx-1" />

                            <Dropdown menu={{ items: userMenu }} trigger={['click']} placement="bottomRight">
                                <button className="flex items-center gap-2 pl-2 group outline-none">
                                    <span className="text-xs font-bold text-zinc-900 hidden md:block font-sans">
                                        {user?.full_name || user?.email?.split('@')[0] || 'Admin'}
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-900 group-hover:bg-zinc-200 transition-all font-sans relative overflow-hidden">
                                        {user?.profile_photo ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8000'}${user.profile_photo}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                width={32}
                                                height={32}
                                                unoptimized
                                            />
                                        ) : (
                                            user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : (user?.email?.substring(0, 2).toUpperCase() || 'AD')
                                        )}
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
            <ChangePasswordModal 
                open={isChangePasswordOpen} 
                onCancel={() => setIsChangePasswordOpen(false)} 
            />
        </Layout>
    );
}
