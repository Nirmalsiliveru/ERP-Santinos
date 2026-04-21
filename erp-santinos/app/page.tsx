/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from "react";
import { Input, Button } from "@/lib/components/ui";
import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { message } from "antd";

const MotionDiv = motion.div as any;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });

      if (response.data.access_token) {
        // Save token
        localStorage.setItem('token', response.data.access_token);
        // Update axios defaults
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        messageApi.success("Atmospheric Link Established. Welcome.");
        router.push("/dashboard");
      } else {
        messageApi.error(response.data.message || "Invalid credentials. Core access denied.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      messageApi.error("Nexus connection failed. Please check your signal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
      {contextHolder}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] -z-10 opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] -z-10 opacity-60" />

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-xl font-black mx-auto mb-6 shadow-xl shadow-zinc-900/10">
            B
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Sign in to BodhiEdu</h1>
          <p className="text-zinc-500 mt-2 font-medium text-sm">Nexus is online. Authentication required.</p>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-widest">Email Address</label>
              <Input
                type="email"
                placeholder="name@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 bg-white hover:border-zinc-400 focus:border-zinc-900 focus:ring-0 transition-all font-medium text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Forgot?</button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 bg-white hover:border-zinc-400 focus:border-zinc-900 focus:ring-0 transition-all font-medium text-sm"
                required
              />
            </div>

            <Button
              htmlType="submit"
              className="w-full h-11 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Continue to Dashboard</span>
                  <ArrowRightOutlined className="text-xs opacity-50" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em] leading-relaxed">
            Secure Enterprise Access <br />
            Verified via FastAPI Core
          </p>
        </div>
      </MotionDiv>
    </div>
  );
}
