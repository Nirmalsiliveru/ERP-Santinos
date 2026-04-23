'use client';

import { Button, Space, Card } from 'antd';
import { notificationService } from '@/lib/services/notification.service';
import { useSocket, emitEvent } from '@/lib/hooks/useSocket';

export function NotificationDemo() {
  const socket = useSocket();
  const isConnected = socket?.connected ?? false;

  return (
    <div className="p-6 space-y-6">
      <Card title="Notification System Demo">
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="p-4 rounded-lg border-2" style={{
            borderColor: isConnected ? '#52c41a' : '#f5222d'
          }}>
            <span className="font-semibold">Socket Status: </span>
            <span style={{ color: isConnected ? '#52c41a' : '#f5222d' }}>
              {isConnected ? 'Connected ✓' : 'Disconnected ✗'}
            </span>
          </div>

          {/* Notification Types */}
          <div className="space-y-3">
            <h3 className="font-semibold">Test Notifications:</h3>
            <Space wrap>
              <Button
                type="primary"
                onClick={() =>
                  notificationService.success(
                    'Operation Successful',
                    'Your action completed successfully!'
                  )
                }
              >
                Success
              </Button>

              <Button
                onClick={() =>
                  notificationService.info(
                    'Information',
                    'This is an informational message'
                  )
                }
              >
                Info
              </Button>

              <Button
                onClick={() =>
                  notificationService.warning(
                    'Warning',
                    'Please review this carefully'
                  )
                }
              >
                Warning
              </Button>

              <Button
                danger
                onClick={() =>
                  notificationService.error(
                    'Error Occurred',
                    'Something went wrong. Please try again.'
                  )
                }
              >
                Error
              </Button>
            </Space>
          </div>

          {/* Socket Emit Demo */}
          <div className="space-y-3">
            <h3 className="font-semibold">Testing Socket Events:</h3>
            <Space wrap>
              <Button
                onClick={() => {
                  emitEvent('test-event', {
                    message: 'Test message from client',
                    timestamp: new Date().toISOString(),
                  });
                  notificationService.info(
                    'Event Sent',
                    'Test event emitted to server'
                  );
                }}
              >
                Emit Test Event
              </Button>

              <Button
                onClick={() => {
                  emitEvent('user-action', {
                    action: 'demo-click',
                    userId: 'demo-user',
                  });
                  notificationService.info(
                    'Action Recorded',
                    'User action sent to server'
                  );
                }}
              >
                Send User Action
              </Button>
            </Space>
          </div>

          {/* Documentation */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              📚 See <strong>NOTIFICATIONS.md</strong> for complete documentation and FastAPI integration examples.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
