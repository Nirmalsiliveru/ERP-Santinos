'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationService } from '../services/notification.service';

const SOCKET_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:8000';

export interface SocketNotificationPayload {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  userId?: string;
}

let socketInstance: Socket | null = null;

export function useSocket() {
  // Use state to track the socket so it's safe for rendering and triggers updates
  const [socket, setSocket] = useState<Socket | null>(socketInstance);

  useEffect(() => {
    // Only connect on client side
    if (typeof window === 'undefined') return;

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        path: '/socket.io/',
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['polling', 'websocket'], // Polling first is more stable on Render/Vercel
        withCredentials: true,
        secure: true,
      });

      // Connection events
      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance?.id);
        setSocket(socketInstance);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setSocket(socketInstance);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  }, []);

  return socket;
}

export function getSocket(): Socket | null {
  return socketInstance;
}

export function emitEvent(event: string, data?: unknown) {
  if (socketInstance) {
    socketInstance.emit(event, data);
  }
}
