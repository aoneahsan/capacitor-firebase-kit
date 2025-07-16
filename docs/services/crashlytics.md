# Crashlytics Service

Firebase Crashlytics provides real-time crash reporting that helps you track, prioritize, and fix stability issues that erode your app quality.

## Overview

Firebase Crashlytics automatically captures crashes and provides detailed crash reports including:
- Stack traces
- Device information
- User actions leading to crash
- Custom logs and keys
- Non-fatal exceptions

## Setup

### 1. Initialize Crashlytics

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

// Crashlytics is automatically initialized when Firebase is configured
// No explicit initialization required, but you can enable/disable collection
await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: true });
```

### 2. Basic Usage

```typescript
// Log a message
await FirebaseKit.crashlytics.log({ message: 'User opened settings screen' });

// Set user identifier
await FirebaseKit.crashlytics.setUserId({ userId: 'user123' });

// Set custom keys
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    screen: 'settings',
    user_type: 'premium',
    app_version: '1.2.3'
  }
});
```

## Crash Reporting

### Test Crash

```typescript
// Force a crash for testing (use only in development)
await FirebaseKit.crashlytics.crash();
```

### Automatic Crash Detection

Crashlytics automatically detects and reports:
- Uncaught exceptions
- Native crashes
- ANRs (Application Not Responding)
- Out of memory errors

## Custom Logging

### Log Messages

```typescript
// Log breadcrumbs to understand user flow
await FirebaseKit.crashlytics.log({ message: 'User started checkout process' });
await FirebaseKit.crashlytics.log({ message: 'Payment method selected: credit_card' });
await FirebaseKit.crashlytics.log({ message: 'Order submitted successfully' });
```

### Log Events with Context

```typescript
// Log with contextual information
await FirebaseKit.crashlytics.log({ 
  message: `API call failed: ${endpoint} - ${statusCode}` 
});

await FirebaseKit.crashlytics.log({ 
  message: `User action: ${action} on ${screenName}` 
});
```

## User Identification

### Set User ID

```typescript
// Set user ID to track issues per user
await FirebaseKit.crashlytics.setUserId({ userId: 'user123' });

// Clear user ID
await FirebaseKit.crashlytics.setUserId({ userId: '' });
```

### Anonymous Users

```typescript
// For anonymous users, use a generated ID
const anonymousId = generateAnonymousId();
await FirebaseKit.crashlytics.setUserId({ userId: anonymousId });
```

## Custom Keys

### Set Custom Attributes

```typescript
// Set multiple custom keys
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    screen: 'product_detail',
    product_id: 'SKU123',
    user_type: 'premium',
    experiment_group: 'variant_b',
    feature_flag: 'new_checkout_enabled'
  }
});
```

### Dynamic Custom Keys

```typescript
// Update custom keys based on app state
async function updateCrashlyticsContext(appState: AppState) {
  await FirebaseKit.crashlytics.setCustomKeys({
    attributes: {
      current_screen: appState.currentScreen,
      user_level: appState.userLevel.toString(),
      network_status: appState.isOnline ? 'online' : 'offline',
      battery_level: appState.batteryLevel.toString()
    }
  });
}
```

## Non-Fatal Exceptions

### Log Exceptions

```typescript
// Log handled exceptions
try {
  await riskyOperation();
} catch (error) {
  await FirebaseKit.crashlytics.logException({
    message: 'Failed to process payment',
    code: 'PAYMENT_ERROR',
    stackTrace: [
      {
        fileName: 'payment.service.ts',
        lineNumber: 45,
        methodName: 'processPayment'
      }
    ]
  });
  
  // Handle the error gracefully
  showErrorMessage('Payment processing failed');
}
```

### API Error Logging

```typescript
async function apiCall(endpoint: string) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    await FirebaseKit.crashlytics.logException({
      message: `API call failed: ${endpoint}`,
      code: 'API_ERROR',
      domain: 'network',
      stackTrace: [
        {
          fileName: 'api.service.ts',
          lineNumber: 23,
          methodName: 'apiCall'
        }
      ]
    });
    throw error;
  }
}
```

## Advanced Features

### Crash Report Management

```typescript
// Check if app crashed on previous execution
const { crashed } = await FirebaseKit.crashlytics.didCrashOnPreviousExecution();
if (crashed) {
  console.log('App crashed on previous run');
  // Maybe show a recovery message to user
}

// Send unsent crash reports
await FirebaseKit.crashlytics.sendUnsentReports();

// Delete unsent crash reports
await FirebaseKit.crashlytics.deleteUnsentReports();
```

### Collection Control

```typescript
// Enable crash collection
await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: true });

// Disable crash collection (for privacy compliance)
await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: false });
```

## Best Practices

### 1. Meaningful Logs

```typescript
// Good: descriptive and actionable
await FirebaseKit.crashlytics.log({ 
  message: 'User attempted login with email: user@example.com' 
});

// Better: include context
await FirebaseKit.crashlytics.log({ 
  message: 'Login attempt failed: invalid credentials for user@example.com' 
});
```

### 2. Structured Custom Keys

```typescript
// Organize custom keys by category
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    // User context
    user_id: 'user123',
    user_type: 'premium',
    user_level: '25',
    
    // App context
    app_version: '1.2.3',
    feature_flags: 'new_ui,dark_mode',
    
    // Technical context
    device_memory: '4GB',
    network_type: 'wifi',
    
    // Business context
    current_screen: 'checkout',
    cart_value: '149.99',
    payment_method: 'credit_card'
  }
});
```

### 3. Exception Categorization

```typescript
// Categorize exceptions by type
await FirebaseKit.crashlytics.logException({
  message: 'Database connection failed',
  code: 'DB_CONNECTION_ERROR',
  domain: 'database'
});

await FirebaseKit.crashlytics.logException({
  message: 'Network request timeout',
  code: 'NETWORK_TIMEOUT',
  domain: 'network'
});
```

## Crashlytics Manager Class

```typescript
class CrashlyticsManager {
  private isEnabled = true;

  async initialize() {
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ 
      enabled: this.isEnabled 
    });
  }

  async setUser(userId: string, userProperties: Record<string, string>) {
    await FirebaseKit.crashlytics.setUserId({ userId });
    
    const attributes = {
      user_id: userId,
      ...userProperties
    };
    
    await FirebaseKit.crashlytics.setCustomKeys({ attributes });
  }

  async logBreadcrumb(message: string, category?: string) {
    const logMessage = category ? `[${category}] ${message}` : message;
    await FirebaseKit.crashlytics.log({ message: logMessage });
  }

  async logError(error: Error, context?: Record<string, any>) {
    // Update context
    if (context) {
      await FirebaseKit.crashlytics.setCustomKeys({ 
        attributes: context 
      });
    }

    // Log the exception
    await FirebaseKit.crashlytics.logException({
      message: error.message,
      code: error.name,
      stackTrace: this.parseStackTrace(error.stack)
    });
  }

  async updateContext(context: Record<string, string | number | boolean>) {
    const attributes = Object.fromEntries(
      Object.entries(context).map(([key, value]) => [key, String(value)])
    );
    
    await FirebaseKit.crashlytics.setCustomKeys({ attributes });
  }

  private parseStackTrace(stack?: string): any[] {
    if (!stack) return [];
    
    return stack.split('\n').map((line, index) => ({
      fileName: this.extractFileName(line),
      lineNumber: this.extractLineNumber(line),
      methodName: this.extractMethodName(line)
    })).filter(item => item.fileName);
  }

  private extractFileName(stackLine: string): string {
    const match = stackLine.match(/(?:at\s+)?(?:.*\s+)?\(?([^)]+):(\d+):(\d+)\)?/);
    return match ? match[1] : '';
  }

  private extractLineNumber(stackLine: string): number {
    const match = stackLine.match(/(?:at\s+)?(?:.*\s+)?\(?([^)]+):(\d+):(\d+)\)?/);
    return match ? parseInt(match[2]) : 0;
  }

  private extractMethodName(stackLine: string): string {
    const match = stackLine.match(/at\s+([^(]+)/);
    return match ? match[1].trim() : '';
  }

  async enable() {
    this.isEnabled = true;
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: true });
  }

  async disable() {
    this.isEnabled = false;
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ enabled: false });
  }
}
```

## Error Boundary Integration

### React Error Boundary

```typescript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Crashlytics
    await FirebaseKit.crashlytics.setCustomKeys({
      attributes: {
        error_boundary: 'true',
        component_stack: errorInfo.componentStack
      }
    });

    await FirebaseKit.crashlytics.logException({
      message: error.message,
      code: error.name,
      stackTrace: [
        {
          fileName: 'ErrorBoundary.tsx',
          lineNumber: 0,
          methodName: 'componentDidCatch'
        }
      ]
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

## Performance Considerations

### Batch Logging

```typescript
class CrashlyticsLogger {
  private logQueue: string[] = [];
  private flushInterval = 5000; // 5 seconds

  constructor() {
    setInterval(() => this.flushLogs(), this.flushInterval);
  }

  queueLog(message: string) {
    this.logQueue.push(message);
  }

  private async flushLogs() {
    if (this.logQueue.length === 0) return;

    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    for (const log of logsToFlush) {
      await FirebaseKit.crashlytics.log({ message: log });
    }
  }
}
```

## Testing

### Testing Crash Reports

```typescript
// Test crash reporting in development
if (__DEV__) {
  // Add a test button to trigger crash
  async function testCrash() {
    await FirebaseKit.crashlytics.log({ message: 'Test crash initiated' });
    await FirebaseKit.crashlytics.crash();
  }
}
```

### Mock for Testing

```typescript
// Mock Crashlytics for unit tests
const mockCrashlytics = {
  log: jest.fn(),
  setUserId: jest.fn(),
  setCustomKeys: jest.fn(),
  logException: jest.fn(),
  crash: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn()
};
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Crash Reporting | ✅ | ✅ | ⚠️ |
| Custom Logging | ✅ | ✅ | ⚠️ |
| User Identification | ✅ | ✅ | ⚠️ |
| Custom Keys | ✅ | ✅ | ⚠️ |
| Non-Fatal Exceptions | ✅ | ✅ | ⚠️ |
| Collection Control | ✅ | ✅ | ⚠️ |

⚠️ Web support is limited - some features may not work as expected

## Privacy Considerations

### GDPR Compliance

```typescript
// Disable crash collection for users who opt out
async function handlePrivacyConsent(hasConsented: boolean) {
  await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({ 
    enabled: hasConsented 
  });
}
```

### Data Minimization

```typescript
// Only collect necessary information
await FirebaseKit.crashlytics.setCustomKeys({
  attributes: {
    // Good: relevant context
    screen: 'checkout',
    user_type: 'premium',
    
    // Avoid: personal information
    // email: 'user@example.com', // Don't include PII
    // phone: '+1234567890'       // Don't include PII
  }
});
```

## Additional Resources

- [Firebase Crashlytics Documentation](https://firebase.google.com/docs/crashlytics)
- [Crashlytics Best Practices](https://firebase.google.com/docs/crashlytics/best-practices)
- [Android Crashlytics Setup](https://firebase.google.com/docs/crashlytics/get-started?platform=android)
- [iOS Crashlytics Setup](https://firebase.google.com/docs/crashlytics/get-started?platform=ios)