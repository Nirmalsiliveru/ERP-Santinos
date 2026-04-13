'use client';

import Image from "next/image";
import { useApi } from "@/lib/hooks/useApi";
import { NotificationDemo } from "@/lib/components/NotificationDemo";

export default function Home() {
  // Example: fetch from your API endpoint
  // Change the endpoint to match your FastAPI routes
  const { data, loading, error } = useApi('/');

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full flex-1 py-8 px-4 md:px-16 bg-white dark:bg-black">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-6 text-center">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              ERP Santinos
            </h1>
          </div>

          {/* API Status Section */}
          <div className="w-full p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {loading && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-600 rounded-full animate-spin" />
                Connecting to API...
              </div>
            )}
            
            {error && (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-semibold">Error connecting to API</p>
                <p className="text-sm">{error.message}</p>
              </div>
            )}
            
            {data && !loading && (
              <div className="text-green-600 dark:text-green-400">
                <p className="font-semibold">API Connected Successfully!</p>
                <pre className="text-xs mt-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded overflow-auto max-h-48">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Notification Demo Section */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <NotificationDemo />
          </div>

          {/* Info Text */}
          <p className="text-center text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your FastAPI endpoint is integrated and ready to use. The custom hook <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">useApi</code> handles data fetching, and real-time notifications are powered by Socket.IO.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row justify-center">
            <a
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="GitHub logomark"
                width={16}
                height={16}
              />
              Repository
            </a>
            <a
              className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
