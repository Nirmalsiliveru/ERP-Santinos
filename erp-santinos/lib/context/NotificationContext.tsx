'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '../hooks/useSocket';

const NotificationContext = createContext<void>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Initialize socket connection and listeners
  useSocket();

  return (
    <NotificationContext.Provider value={undefined}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
