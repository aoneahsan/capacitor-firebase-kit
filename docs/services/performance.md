# Performance Service

Firebase Performance Monitoring helps you gain insight into the performance characteristics of your app by collecting performance data automatically and through custom traces.

## Overview

Firebase Performance Monitoring provides:
- Automatic performance monitoring
- Custom trace measurement
- Network request monitoring
- Screen rendering performance
- App startup time tracking

## Setup

### 1. Initialize Performance Monitoring

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

await FirebaseKit.performance.initialize({
  enabled: true,  // Default: true
  dataCollectionEnabled: true,  // Default: undefined (uses SDK default)
  instrumentationEnabled: true  // Default: undefined (uses SDK default)
});
```

#### Performance Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether to enable performance monitoring on startup |
| `dataCollectionEnabled` | `boolean` | SDK default | Data collection preferences |
| `instrumentationEnabled` | `boolean` | SDK default | Instrumentation options |

### 2. Basic Usage

```typescript
// Start a custom trace
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'checkout_flow'
});

// Add metrics and attributes
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_processed',
  value: 3
});

await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'payment_method',
  value: 'credit_card'
});

// Stop the trace
await FirebaseKit.performance.stopTrace({ traceId });
```

## Custom Traces

### Basic Trace

```typescript
// Start a trace for a specific operation
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'data_processing'
});

// Your operation here
await processData();

// Stop the trace
await FirebaseKit.performance.stopTrace({ traceId });
```

### Trace with Metrics

```typescript
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'image_processing'
});

// Process images and track metrics
let processedImages = 0;
for (const image of images) {
  await processImage(image);
  processedImages++;
  
  // Update metric
  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'images_processed',
    value: 1
  });
}

// Add final metrics
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'total_images',
  value: processedImages
});

await FirebaseKit.performance.stopTrace({ traceId });
```

### Trace with Attributes

```typescript
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'api_request'
});

// Add context attributes
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'endpoint',
  value: '/api/users'
});

await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'method',
  value: 'GET'
});

// Make API request
const response = await fetch('/api/users');

// Add response attributes
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'status_code',
  value: response.status.toString()
});

await FirebaseKit.performance.stopTrace({ traceId });
```

## Screen Rendering Performance

### Track Screen Rendering

```typescript
// Start screen trace
const { traceId } = await FirebaseKit.performance.startScreenTrace({
  screenName: 'ProductListScreen'
});

// Screen rendering happens here
await renderProductList();

// Stop screen trace
await FirebaseKit.performance.stopScreenTrace({ traceId });
```

### Automatic Screen Tracking

```typescript
// React component example
import { useEffect } from 'react';

function ProductListScreen() {
  useEffect(() => {
    let traceId: string;
    
    const startTrace = async () => {
      const result = await FirebaseKit.performance.startScreenTrace({
        screenName: 'ProductListScreen'
      });
      traceId = result.traceId;
    };
    
    const stopTrace = async () => {
      if (traceId) {
        await FirebaseKit.performance.stopScreenTrace({ traceId });
      }
    };
    
    startTrace();
    return () => stopTrace();
  }, []);
  
  return <div>Product List Content</div>;
}
```

## Network Request Monitoring

### Network Request Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | Required | URL of the request |
| `httpMethod` | `string` | Required | HTTP method (GET, POST, etc.) |
| `requestPayloadSize` | `number` | - | Request payload size in bytes |
| `responseContentType` | `string` | - | Response content type |
| `responsePayloadSize` | `number` | - | Response payload size in bytes |
| `httpResponseCode` | `number` | - | HTTP response code (0 for network errors) |
| `startTime` | `number` | - | Start time in milliseconds |
| `duration` | `number` | - | Duration in milliseconds |

### Record Network Requests

```typescript
async function makeApiCall(url: string) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url);
    const endTime = Date.now();
    
    // Record network request performance
    await FirebaseKit.performance.recordNetworkRequest({
      url,
      httpMethod: 'GET',
      responsePayloadSize: parseInt(response.headers.get('content-length') || '0'),
      httpResponseCode: response.status,
      responseContentType: response.headers.get('content-type') || '',
      startTime,
      endTime
    });
    
    return response;
  } catch (error) {
    const endTime = Date.now();
    
    // Record failed request
    await FirebaseKit.performance.recordNetworkRequest({
      url,
      httpMethod: 'GET',
      httpResponseCode: 0, // Indicates network error
      startTime,
      endTime
    });
    
    throw error;
  }
}
```

### Network Request Wrapper

```typescript
class NetworkMonitor {
  static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    const requestSize = options.body ? new Blob([options.body]).size : 0;
    
    try {
      const response = await fetch(url, options);
      const endTime = Date.now();
      
      await FirebaseKit.performance.recordNetworkRequest({
        url,
        httpMethod: method.toUpperCase() as any,
        requestPayloadSize: requestSize,
        responsePayloadSize: parseInt(response.headers.get('content-length') || '0'),
        httpResponseCode: response.status,
        responseContentType: response.headers.get('content-type') || '',
        startTime,
        endTime
      });
      
      return response;
    } catch (error) {
      const endTime = Date.now();
      
      await FirebaseKit.performance.recordNetworkRequest({
        url,
        httpMethod: method.toUpperCase() as any,
        requestPayloadSize: requestSize,
        httpResponseCode: 0,
        startTime,
        endTime
      });
      
      throw error;
    }
  }
}
```

## Performance Manager Class

```typescript
class PerformanceManager {
  private activeTraces = new Map<string, string>();
  private isEnabled = true;

  async initialize() {
    await FirebaseKit.performance.initialize({ 
      enabled: this.isEnabled  // Default: true
    });
  }

  async startTrace(traceName: string): Promise<string> {
    if (!this.isEnabled) return '';
    
    const { traceId } = await FirebaseKit.performance.startTrace({ traceName });
    this.activeTraces.set(traceName, traceId);
    return traceId;
  }

  async stopTrace(traceName: string): Promise<void> {
    if (!this.isEnabled) return;
    
    const traceId = this.activeTraces.get(traceName);
    if (traceId) {
      await FirebaseKit.performance.stopTrace({ traceId });
      this.activeTraces.delete(traceName);
    }
  }

  async addMetric(traceName: string, metricName: string, value: number): Promise<void> {
    if (!this.isEnabled) return;
    
    const traceId = this.activeTraces.get(traceName);
    if (traceId) {
      await FirebaseKit.performance.incrementMetric({
        traceId,
        metricName,
        value
      });
    }
  }

  async addAttribute(traceName: string, attribute: string, value: string): Promise<void> {
    if (!this.isEnabled) return;
    
    const traceId = this.activeTraces.get(traceName);
    if (traceId) {
      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute,
        value
      });
    }
  }

  async measureAsync<T>(traceName: string, operation: () => Promise<T>): Promise<T> {
    const traceId = await this.startTrace(traceName);
    
    try {
      const result = await operation();
      await this.stopTrace(traceName);
      return result;
    } catch (error) {
      await this.stopTrace(traceName);
      throw error;
    }
  }

  async measureSync<T>(traceName: string, operation: () => T): Promise<T> {
    const traceId = await this.startTrace(traceName);
    
    try {
      const result = operation();
      await this.stopTrace(traceName);
      return result;
    } catch (error) {
      await this.stopTrace(traceName);
      throw error;
    }
  }

  async enable() {
    this.isEnabled = true;
    await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: true });
  }

  async disable() {
    this.isEnabled = false;
    await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: false });
  }
}
```

## Common Use Cases

### App Startup Time

```typescript
// Measure app startup time
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'app_startup'
});

// App initialization code
await initializeApp();

await FirebaseKit.performance.stopTrace({ traceId });
```

### Database Operations

```typescript
async function performDatabaseOperation() {
  const { traceId } = await FirebaseKit.performance.startTrace({
    traceName: 'database_query'
  });

  await FirebaseKit.performance.putAttribute({
    traceId,
    attribute: 'query_type',
    value: 'user_data'
  });

  const startTime = Date.now();
  const result = await database.query('SELECT * FROM users');
  const duration = Date.now() - startTime;

  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'query_duration_ms',
    value: duration
  });

  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'records_returned',
    value: result.length
  });

  await FirebaseKit.performance.stopTrace({ traceId });
  return result;
}
```

### File Operations

```typescript
async function processFile(file: File) {
  const { traceId } = await FirebaseKit.performance.startTrace({
    traceName: 'file_processing'
  });

  await FirebaseKit.performance.putAttribute({
    traceId,
    attribute: 'file_type',
    value: file.type
  });

  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'file_size_bytes',
    value: file.size
  });

  const processedData = await processFileData(file);

  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'processed_size_bytes',
    value: processedData.length
  });

  await FirebaseKit.performance.stopTrace({ traceId });
  return processedData;
}
```

## Best Practices

### 1. Meaningful Trace Names

```typescript
// Good: specific and descriptive
await FirebaseKit.performance.startTrace({ traceName: 'checkout_payment_processing' });

// Avoid: generic names
await FirebaseKit.performance.startTrace({ traceName: 'process' });
```

### 2. Proper Metric Usage

```typescript
// Good: meaningful metrics
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_processed',
  value: itemCount
});

// Good: duration metrics
await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'processing_time_ms',
  value: processingTime
});
```

### 3. Trace Lifecycle Management

```typescript
// Always ensure traces are stopped
async function performOperation() {
  const { traceId } = await FirebaseKit.performance.startTrace({
    traceName: 'operation'
  });

  try {
    await doWork();
  } finally {
    await FirebaseKit.performance.stopTrace({ traceId });
  }
}
```

### 4. Avoid Excessive Traces

```typescript
// Good: trace logical operations
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'user_registration'
});

// Avoid: tracing every small operation
// Don't create traces for every function call
```

## Performance Optimization

### Batch Operations

```typescript
// Instead of individual traces for each item
for (const item of items) {
  // Don't do this for each item
  // const { traceId } = await FirebaseKit.performance.startTrace({
  //   traceName: `process_item_${item.id}`
  // });
}

// Use a single trace for batch operations
const { traceId } = await FirebaseKit.performance.startTrace({
  traceName: 'batch_item_processing'
});

let processedCount = 0;
for (const item of items) {
  await processItem(item);
  processedCount++;
}

await FirebaseKit.performance.incrementMetric({
  traceId,
  metricName: 'items_processed',
  value: processedCount
});

await FirebaseKit.performance.stopTrace({ traceId });
```

## Debug and Testing

### Performance Testing

```typescript
// Test performance monitoring
async function testPerformanceMonitoring() {
  const { traceId } = await FirebaseKit.performance.startTrace({
    traceName: 'test_trace'
  });

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 1000));

  await FirebaseKit.performance.incrementMetric({
    traceId,
    metricName: 'test_metric',
    value: 42
  });

  await FirebaseKit.performance.putAttribute({
    traceId,
    attribute: 'test_attribute',
    value: 'test_value'
  });

  await FirebaseKit.performance.stopTrace({ traceId });
  console.log('Performance test completed');
}
```

### Mock for Testing

```typescript
// Mock Performance service for unit tests
const mockPerformance = {
  initialize: jest.fn(),
  startTrace: jest.fn().mockResolvedValue({ traceId: 'test-trace-id' }),
  stopTrace: jest.fn(),
  incrementMetric: jest.fn(),
  putAttribute: jest.fn(),
  setPerformanceCollectionEnabled: jest.fn(),
  startScreenTrace: jest.fn().mockResolvedValue({ traceId: 'test-screen-trace-id' }),
  stopScreenTrace: jest.fn(),
  recordNetworkRequest: jest.fn()
};
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Custom Traces | ✅ | ✅ | ⚠️ |
| Screen Traces | ✅ | ✅ | ⚠️ |
| Network Monitoring | ✅ | ✅ | ⚠️ |
| Metrics | ✅ | ✅ | ⚠️ |
| Attributes | ✅ | ✅ | ⚠️ |
| Automatic Monitoring | ✅ | ✅ | ⚠️ |

⚠️ Web support is limited - some automatic features may not work

## Privacy Considerations

### Data Collection Control

```typescript
// Disable performance monitoring for privacy compliance
await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: false });

// Re-enable when user consents
await FirebaseKit.performance.setPerformanceCollectionEnabled({ enabled: true });
```

### Data Minimization

```typescript
// Only collect necessary performance data
await FirebaseKit.performance.putAttribute({
  traceId,
  attribute: 'user_type',
  value: 'anonymous' // Don't include PII
});
```

## Additional Resources

- [Firebase Performance Monitoring Documentation](https://firebase.google.com/docs/perf-mon)
- [Performance Monitoring Best Practices](https://firebase.google.com/docs/perf-mon/best-practices)
- [Android Performance Setup](https://firebase.google.com/docs/perf-mon/get-started-android)
- [iOS Performance Setup](https://firebase.google.com/docs/perf-mon/get-started-ios)