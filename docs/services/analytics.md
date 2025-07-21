# Analytics Service

Firebase Analytics provides detailed insights into your app's usage and user behavior. It automatically tracks many events and allows you to define custom events for your specific use cases.

## Overview

Firebase Analytics helps you understand how users interact with your app by tracking:
- App usage patterns
- User demographics
- Custom events
- Conversion funnels
- User retention
- Revenue metrics

## Setup

### 1. Initialize Analytics

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

await FirebaseKit.analytics.initialize({
  collectionEnabled: true,  // Default: true
  sessionTimeoutDuration: 1800  // Default: undefined (uses Firebase default of 30 minutes)
});
```

#### Analytics Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collectionEnabled` | `boolean` | `true` | Whether to enable analytics collection on startup |
| `sessionTimeoutDuration` | `number` | Firebase default (1800) | Session timeout in seconds |

### 2. Basic Usage

```typescript
// Log a custom event
await FirebaseKit.analytics.logEvent({
  name: 'button_click',
  params: {
    button_name: 'purchase',
    screen_name: 'product_details'
  }
});

// Set user properties
await FirebaseKit.analytics.setUserProperty({
  key: 'favorite_category',
  value: 'electronics'
});

// Track screen views
await FirebaseKit.analytics.setCurrentScreen({
  screenName: 'HomeScreen',
  screenClass: 'MainActivity'
});
```

## Event Logging

### Standard Events

Firebase Analytics provides predefined event names with standard parameters:

```typescript
// E-commerce events
await FirebaseKit.analytics.logEvent({
  name: 'purchase',
  params: {
    transaction_id: 'T12345',
    value: 29.99,
    currency: 'USD',
    items: [
      {
        item_id: 'SKU123',
        item_name: 'Premium Subscription',
        category: 'subscription',
        quantity: 1,
        price: 29.99
      }
    ]
  }
});

// User engagement events
await FirebaseKit.analytics.logEvent({
  name: 'select_content',
  params: {
    content_type: 'article',
    content_id: 'article_123'
  }
});

// App usage events
await FirebaseKit.analytics.logEvent({
  name: 'app_open',
  params: {
    source: 'notification'
  }
});
```

### Custom Events

Create custom events for your specific use cases:

```typescript
// Feature usage
await FirebaseKit.analytics.logEvent({
  name: 'feature_used',
  params: {
    feature_name: 'dark_mode',
    user_type: 'premium'
  }
});

// User actions
await FirebaseKit.analytics.logEvent({
  name: 'video_play',
  params: {
    video_id: 'tutorial_1',
    video_duration: 120,
    player_type: 'embedded'
  }
});
```

### Event Parameters

Event parameters provide additional context:

```typescript
await FirebaseKit.analytics.logEvent({
  name: 'tutorial_complete',
  params: {
    tutorial_id: 'onboarding_1',
    completion_time: 45, // seconds
    difficulty: 'beginner',
    success_rate: 0.95
  }
});
```

## User Properties

### Set User Properties

User properties describe attributes of your users:

```typescript
// Demographics
await FirebaseKit.analytics.setUserProperty({
  key: 'age_group',
  value: '25-34'
});

// Preferences
await FirebaseKit.analytics.setUserProperty({
  key: 'theme_preference',
  value: 'dark'
});

// Subscription status
await FirebaseKit.analytics.setUserProperty({
  key: 'subscription_type',
  value: 'premium'
});
```

### User Identification

```typescript
// Set user ID
await FirebaseKit.analytics.setUserId({ userId: 'user123' });

// Clear user ID
await FirebaseKit.analytics.setUserId({ userId: null });
```

## Screen Tracking

### Track Screen Views

```typescript
// Basic screen tracking
await FirebaseKit.analytics.setCurrentScreen({
  screenName: 'ProductListScreen'
});

// With screen class
await FirebaseKit.analytics.setCurrentScreen({
  screenName: 'ProductDetails',
  screenClass: 'ProductViewController'
});
```

### Automatic Screen Tracking

For automatic screen tracking in React/Vue apps:

```typescript
// React Router example
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useAnalyticsTracking() {
  const location = useLocation();

  useEffect(() => {
    FirebaseKit.analytics.setCurrentScreen({
      screenName: location.pathname,
      screenClass: 'WebScreen'
    });
  }, [location]);
}
```

## E-commerce Tracking

### Purchase Events

```typescript
await FirebaseKit.analytics.logEvent({
  name: 'purchase',
  params: {
    transaction_id: 'T12345',
    value: 75.50,
    currency: 'USD',
    coupon: 'SAVE20',
    items: [
      {
        item_id: 'SKU001',
        item_name: 'Wireless Headphones',
        category: 'electronics',
        quantity: 1,
        price: 59.99
      },
      {
        item_id: 'SKU002',
        item_name: 'Phone Case',
        category: 'accessories',
        quantity: 1,
        price: 15.51
      }
    ]
  }
});
```

### Add to Cart

```typescript
await FirebaseKit.analytics.logEvent({
  name: 'add_to_cart',
  params: {
    currency: 'USD',
    value: 59.99,
    items: [{
      item_id: 'SKU001',
      item_name: 'Wireless Headphones',
      category: 'electronics',
      quantity: 1,
      price: 59.99
    }]
  }
});
```

### Begin Checkout

```typescript
await FirebaseKit.analytics.logEvent({
  name: 'begin_checkout',
  params: {
    currency: 'USD',
    value: 75.50,
    items: [/* items array */]
  }
});
```

## Advanced Features

### Default Event Parameters

Set default parameters that will be included with every event:

```typescript
// Set default parameters
await FirebaseKit.analytics.setDefaultEventParameters({
  params: {
    app_version: '1.2.3',
    environment: 'production'
  }
});

// Clear default parameters
await FirebaseKit.analytics.setDefaultEventParameters({
  params: null
});
```

### Conversion Tracking

```typescript
// Track conversion funnel
await FirebaseKit.analytics.logEvent({
  name: 'sign_up',
  params: {
    method: 'email'
  }
});

await FirebaseKit.analytics.logEvent({
  name: 'tutorial_begin',
  params: {}
});

await FirebaseKit.analytics.logEvent({
  name: 'tutorial_complete',
  params: {}
});
```

### Revenue Tracking

```typescript
// In-app purchase
await FirebaseKit.analytics.logEvent({
  name: 'in_app_purchase',
  params: {
    product_id: 'premium_upgrade',
    value: 9.99,
    currency: 'USD',
    quantity: 1
  }
});

// Subscription
await FirebaseKit.analytics.logEvent({
  name: 'subscribe',
  params: {
    product_id: 'monthly_premium',
    value: 9.99,
    currency: 'USD'
  }
});
```

### Custom Dimensions

```typescript
// Set custom dimensions via user properties
await FirebaseKit.analytics.setUserProperty({
  key: 'player_level',
  value: '15'
});

await FirebaseKit.analytics.setUserProperty({
  key: 'game_difficulty',
  value: 'hard'
});
```

## Privacy and Consent

### GDPR Compliance

```typescript
// Set consent status
await FirebaseKit.analytics.setConsent({
  analyticsStorage: 'granted',
  adStorage: 'granted',
  adUserData: 'granted',
  adPersonalization: 'granted'
});

// Update consent when user changes preferences
await FirebaseKit.analytics.setConsent({
  analyticsStorage: 'denied',
  adStorage: 'denied'
});
```

### Data Collection Control

```typescript
// Disable analytics collection
await FirebaseKit.analytics.setCollectionEnabled({ enabled: false });

// Re-enable analytics collection
await FirebaseKit.analytics.setCollectionEnabled({ enabled: true });
```

### Session Management

```typescript
// Set session timeout (in seconds)
await FirebaseKit.analytics.setSessionTimeoutDuration({ duration: 1800 }); // 30 minutes (default Firebase timeout)
```

## Best Practices

### 1. Event Naming

```typescript
// Good: descriptive and consistent
await FirebaseKit.analytics.logEvent({
  name: 'video_play',
  params: { video_id: 'tutorial_1' }
});

// Avoid: generic or unclear names
await FirebaseKit.analytics.logEvent({
  name: 'click',
  params: { thing: 'button' }
});
```

### 2. Parameter Consistency

```typescript
// Define consistent parameter names
const AnalyticsParams = {
  SCREEN_NAME: 'screen_name',
  USER_TYPE: 'user_type',
  CONTENT_ID: 'content_id'
};

await FirebaseKit.analytics.logEvent({
  name: 'content_view',
  params: {
    [AnalyticsParams.CONTENT_ID]: 'article_123',
    [AnalyticsParams.SCREEN_NAME]: 'article_detail'
  }
});
```

### 3. Avoid Excessive Events

```typescript
// Good: meaningful events
await FirebaseKit.analytics.logEvent({
  name: 'level_complete',
  params: { level: 5, time_spent: 120 }
});

// Avoid: too frequent events
// Don't log every scroll or mouse move
```

### 4. Use Standard Events When Possible

```typescript
// Preferred: standard event names
await FirebaseKit.analytics.logEvent({
  name: 'search', // Standard event
  params: {
    search_term: 'bluetooth headphones'
  }
});

// Instead of custom event
await FirebaseKit.analytics.logEvent({
  name: 'user_searched_for_product',
  params: { query: 'bluetooth headphones' }
});
```

## Analytics Manager Class

```typescript
class AnalyticsManager {
  private isInitialized = false;
  private userId: string | null = null;

  async initialize() {
    if (this.isInitialized) return;

    await FirebaseKit.analytics.initialize({
      collectionEnabled: true  // Default: true
    });

    this.isInitialized = true;
  }

  async setUser(userId: string, userProperties: Record<string, string>) {
    this.userId = userId;
    
    await FirebaseKit.analytics.setUserId({ userId });
    
    for (const [key, value] of Object.entries(userProperties)) {
      await FirebaseKit.analytics.setUserProperty({ key, value });
    }
  }

  async trackScreen(screenName: string, screenClass?: string) {
    await FirebaseKit.analytics.setCurrentScreen({
      screenName,
      screenClass
    });
  }

  async trackEvent(eventName: string, parameters?: Record<string, any>) {
    await FirebaseKit.analytics.logEvent({
      name: eventName,
      params: parameters
    });
  }

  async trackPurchase(transactionId: string, value: number, currency: string, items: any[]) {
    await FirebaseKit.analytics.logEvent({
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        value,
        currency,
        items
      }
    });
  }

  async updateConsent(analyticsConsent: boolean, adConsent: boolean) {
    await FirebaseKit.analytics.setConsent({
      analyticsStorage: analyticsConsent ? 'granted' : 'denied',
      adStorage: adConsent ? 'granted' : 'denied'
    });
  }
}
```

## Data Reset

### Reset Analytics Data

```typescript
// Delete all analytics data for the current user
await FirebaseKit.analytics.resetAnalyticsData();
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Event Logging | ✅ | ✅ | ✅ |
| User Properties | ✅ | ✅ | ✅ |
| Screen Tracking | ✅ | ✅ | ✅ |
| E-commerce Events | ✅ | ✅ | ✅ |
| Consent Management | ✅ | ✅ | ✅ |
| Data Reset | ✅ | ✅ | ✅ |

## Debug Mode

For debugging analytics events:

```typescript
// Enable debug mode (iOS/Android only)
// This is typically done through Firebase Console or build configuration
```

## Additional Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Analytics Events Reference](https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Event)
- [Analytics Parameters Reference](https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Param)
- [Google Analytics 4 Migration](https://firebase.google.com/docs/analytics/migrate-to-ga4)