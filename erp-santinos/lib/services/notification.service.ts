import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationOptions {
  message: string;
  description?: string;
  duration?: number;
  type: NotificationType;
}

export const notificationService = {
  success: (message: string, description?: string) => {
    notification.success({
      message,
      description,
      duration: 4.5,
    });
  },

  info: (message: string, description?: string) => {
    notification.info({
      message,
      description,
      duration: 4.5,
    });
  },

  warning: (message: string, description?: string) => {
    notification.warning({
      message,
      description,
      duration: 4.5,
    });
  },

  error: (message: string, description?: string) => {
    notification.error({
      message,
      description,
      duration: 4.5,
    });
  },

  open: (options: NotificationOptions) => {
    notification[options.type]({
      message: options.message,
      description: options.description,
      duration: options.duration ?? 4.5,
    });
  },
};
