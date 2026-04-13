'use client';

import { useEffect, useRef } from 'react';
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
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect on client side
    if (typeof window === 'undefined') return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      });

      // Listen for notifications
      socketRef.current.on('notification', (payload: SocketNotificationPayload) => {
        notificationService.open({
          type: payload.type,
          message: payload.message,
          description: payload.description,
        });
      });

      // Connection events
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketInstance = socketRef.current;
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.off('notification');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
      }
    };
  }, []);

  return socketRef.current;
}

export function getSocket(): Socket | null {
  return socketInstance;
}

export function emitEvent(event: string, data?: unknown) {
  if (socketInstance) {
    socketInstance.emit(event, data);
  }
}
