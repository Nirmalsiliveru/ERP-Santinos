# Real-Time Notification System

This project includes a real-time notification system powered by Socket.IO and Ant Design.

## Features

- ✅ Real-time notifications via WebSocket
- ✅ Ant Design UI components
- ✅ Automatic reconnection with backoff
- ✅ Support for success, info, warning, and error notifications
- ✅ Global notification provider
- ✅ Type-safe TypeScript support

## Usage

### 1. Using the Notification Service (Synchronous)

```typescript
import { notificationService } from '@/lib/services/notification.service';

// Success notification
notificationService.success('Action Completed', 'Your changes have been saved');

// Error notification
notificationService.error('Something went wrong', 'Please try again');

// Info notification
notificationService.info('Info', 'This is an info message');

// Warning notification
notificationService.warning('Warning', 'Please verify your action');

// Using the open method
notificationService.open({
  type: 'success',
  message: 'Success',
  description: 'Operation completed',
  duration: 3,
});
```

### 2. Using Socket.IO for Live Notifications

```typescript
'use client';

import { useSocket, emitEvent } from '@/lib/hooks/useSocket';

export function MyComponent() {
  const socket = useSocket();

  const handleAction = () => {
    // Emit an event to the server
    emitEvent('user-action', { action: 'clicked-button' });
  };

  return (
    <button onClick={handleAction}>
      Trigger Action
    </button>
  );
}
```

### 3. Backend Integration (FastAPI Example)

```python
from fastapi import FastAPI
from fastapi_socketio import SocketManager

app = FastAPI()
sio = SocketManager(app=app, cors_allowed_origins=['*'])

@sio.event
async def user_action(data):
    # Broadcast notification to all connected clients
    await sio.emit('notification', {
        'type': 'success',
        'message': 'User Action Received',
        'description': f'Action: {data["action"]}'
    })

@app.post('/api/trigger-notification')
async def trigger_notification():
    # Send notification to all connected clients
    await sio.emit('notification', {
        'type': 'info',
        'message': 'Server Update',
        'description': 'Something happened on the server'
    })
    return {'status': 'sent'}
```

## Socket Events

### Client Listens For:
- `notification` - Incoming notification
- `connect` - Socket connected
- `disconnect` - Socket disconnected
- `connect_error` - Connection error

### Client Emits:
- Custom events via `emitEvent('event-name', data)`

## Environment Variables

Make sure your `.env` file has:
```
NEXT_PUBLIC_URL=https://your-api.com
```

The Socket.IO client will connect to the same URL as your API.

## Notification Types

| Type | Icon | Use Case |
|------|------|----------|
| success | ✓ | Successful operations |
| info | ℹ | General information |
| warning | ⚠ | Warnings or cautions |
| error | ✗ | Errors or failures |

## Advanced Usage

### Custom Socket Events

```typescript
import { getSocket } from '@/lib/hooks/useSocket';

const socket = getSocket();
socket?.on('custom-event', (data) => {
  console.log('Custom event received:', data);
});

socket?.emit('custom-event', { foo: 'bar' });
```

### Listening to Socket Events in Components

```typescript
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/hooks/useSocket';
import { notificationService } from '@/lib/services/notification.service';

export function RealTimeUpdates() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('order-update', (data) => {
      notificationService.info('Order Updated', `Order #${data.id} status: ${data.status}`);
    });

    return () => {
      socket.off('order-update');
    };
  }, [socket]);

  return <div>Real-time component</div>;
}
```

## Testing

The notification system is mock-friendly for testing:

```typescript
import { notificationService } from '@/lib/services/notification.service';

jest.mock('@/lib/services/notification.service');

it('should show notification', () => {
  notificationService.success('Test', 'Testing');
  expect(notificationService.success).toHaveBeenCalledWith('Test', 'Testing');
});
```
