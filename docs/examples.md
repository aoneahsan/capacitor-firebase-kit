# Examples

Real-world examples demonstrating how to use Capacitor Firebase Kit in various scenarios.

## Table of Contents

- [Basic App Setup](#basic-app-setup)
- [E-commerce App](#e-commerce-app)
- [Social Media App](#social-media-app)
- [Gaming App](#gaming-app)
- [News App](#news-app)
- [Productivity App](#productivity-app)
- [Error Handling Patterns](#error-handling-patterns)
- [Performance Optimization](#performance-optimization)

## Basic App Setup

### Complete Firebase Initialization

```typescript
// firebase-manager.ts
import { FirebaseKit } from 'capacitor-firebase-kit';
import { Capacitor } from '@capacitor/core';

export class FirebaseManager {
  private static instance: FirebaseManager;
  private isInitialized = false;

  static getInstance(): FirebaseManager {
    if (!this.instance) {
      this.instance = new FirebaseManager();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize App Check first
      await this.initializeAppCheck();
      
      // Initialize other services
      await this.initializeAnalytics();
      await this.initializePerformance();
      await this.initializeCrashlytics();
      await this.initializeRemoteConfig();
      
      if (Capacitor.getPlatform() !== 'web') {
        await this.initializeAdMob();
      }

      this.isInitialized = true;
      console.log('Firebase services initialized successfully');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  }

  private async initializeAppCheck() {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'ios') {
      await FirebaseKit.appCheck.initialize({
        provider: 'deviceCheck',
        isTokenAutoRefreshEnabled: true
      });
    } else if (platform === 'android') {
      await FirebaseKit.appCheck.initialize({
        provider: 'playIntegrity',
        isTokenAutoRefreshEnabled: true
      });
    } else {
      await FirebaseKit.appCheck.initialize({
        provider: 'recaptchaV3',
        siteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY!,
        isTokenAutoRefreshEnabled: true
      });
    }
  }

  private async initializeAnalytics() {
    await FirebaseKit.analytics.initialize({
      collectionEnabled: true
    });
  }

  private async initializePerformance() {
    await FirebaseKit.performance.initialize({
      enabled: true
    });
  }

  private async initializeCrashlytics() {
    await FirebaseKit.crashlytics.setCrashlyticsCollectionEnabled({
      enabled: true
    });
  }

  private async initializeRemoteConfig() {
    await FirebaseKit.remoteConfig.initialize({
      minimumFetchIntervalInSeconds: 3600
    });

    await FirebaseKit.remoteConfig.setDefaults({
      defaults: {
        app_name: 'My App',
        primary_color: '#007AFF',
        feature_enabled: false,
        api_endpoint: 'https://api.example.com/v1'
      }
    });

    await FirebaseKit.remoteConfig.fetchAndActivate();
  }

  private async initializeAdMob() {
    await FirebaseKit.adMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [process.env.REACT_APP_TEST_DEVICE_ID]
    });
  }
}
```

### App.tsx Integration

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { FirebaseManager } from './firebase-manager';

function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await FirebaseManager.getInstance().initialize();
        setIsFirebaseReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Firebase initialization failed');
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isFirebaseReady) {
    return <div>Loading...</div>;
  }

  return <MainApp />;
}

export default App;
```

## E-commerce App

### Product Catalog with Analytics

```typescript
// product-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class ProductService {
  async viewProduct(productId: string, category: string, price: number) {
    // Track product view
    await FirebaseKit.analytics.logEvent({
      name: 'view_item',
      params: {
        item_id: productId,
        item_category: category,
        value: price,
        currency: 'USD'
      }
    });

    // Log for debugging
    await FirebaseKit.crashlytics.log({
      message: `User viewed product: ${productId}`
    });
  }

  async addToCart(productId: string, quantity: number, price: number) {
    // Start performance trace
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: 'add_to_cart'
    });

    try {
      // Add to cart logic
      await this.addProductToCart(productId, quantity);

      // Track add to cart event
      await FirebaseKit.analytics.logEvent({
        name: 'add_to_cart',
        params: {
          item_id: productId,
          quantity,
          value: price * quantity,
          currency: 'USD'
        }
      });

      await FirebaseKit.performance.incrementMetric({
        traceId,
        metricName: 'items_added',
        value: quantity
      });
    } catch (error) {
      await FirebaseKit.crashlytics.logException({
        message: 'Failed to add item to cart',
        code: 'ADD_TO_CART_ERROR'
      });
      throw error;
    } finally {
      await FirebaseKit.performance.stopTrace({ traceId });
    }
  }

  async completePurchase(
    transactionId: string,
    items: any[],
    totalValue: number,
    paymentMethod: string
  ) {
    // Track purchase
    await FirebaseKit.analytics.logEvent({
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        value: totalValue,
        currency: 'USD',
        payment_type: paymentMethod,
        items
      }
    });

    // Set user property
    await FirebaseKit.analytics.setUserProperty({
      key: 'last_purchase_method',
      value: paymentMethod
    });

    // Log purchase completion
    await FirebaseKit.crashlytics.log({
      message: `Purchase completed: ${transactionId}`
    });
  }

  private async addProductToCart(productId: string, quantity: number) {
    // Implementation
  }
}
```

### Shopping Cart with Remote Config

```typescript
// cart-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class CartService {
  async getCartConfiguration() {
    // Get cart configuration from Remote Config
    const maxItemsConfig = await FirebaseKit.remoteConfig.getValue({
      key: 'max_cart_items'
    });

    const freeShippingConfig = await FirebaseKit.remoteConfig.getValue({
      key: 'free_shipping_threshold'
    });

    const discountConfig = await FirebaseKit.remoteConfig.getValue({
      key: 'cart_discount_config'
    });

    return {
      maxItems: maxItemsConfig.asNumber,
      freeShippingThreshold: freeShippingConfig.asNumber,
      discountConfig: JSON.parse(discountConfig.asString || '{}')
    };
  }

  async validateCart(items: any[]) {
    const config = await this.getCartConfiguration();
    
    if (items.length > config.maxItems) {
      throw new Error(`Cart can contain maximum ${config.maxItems} items`);
    }
    
    return config;
  }
}
```

## Social Media App

### Post Interaction Tracking

```typescript
// social-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class SocialService {
  async createPost(content: string, mediaType: 'text' | 'image' | 'video') {
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: 'create_post'
    });

    try {
      // Create post logic
      const postId = await this.savePost(content, mediaType);

      // Track post creation
      await FirebaseKit.analytics.logEvent({
        name: 'post_created',
        params: {
          post_id: postId,
          content_type: mediaType,
          content_length: content.length
        }
      });

      await FirebaseKit.performance.putAttribute({
        traceId,
        attribute: 'media_type',
        value: mediaType
      });

      return postId;
    } catch (error) {
      await FirebaseKit.crashlytics.logException({
        message: 'Failed to create post',
        code: 'POST_CREATION_ERROR'
      });
      throw error;
    } finally {
      await FirebaseKit.performance.stopTrace({ traceId });
    }
  }

  async likePost(postId: string, userId: string) {
    await FirebaseKit.analytics.logEvent({
      name: 'post_liked',
      params: {
        post_id: postId,
        user_id: userId
      }
    });

    // Update user engagement property
    await FirebaseKit.analytics.setUserProperty({
      key: 'engagement_level',
      value: 'high'
    });
  }

  async sharePost(postId: string, platform: string) {
    await FirebaseKit.analytics.logEvent({
      name: 'share',
      params: {
        content_type: 'post',
        content_id: postId,
        method: platform
      }
    });
  }

  private async savePost(content: string, mediaType: string): Promise<string> {
    // Implementation
    return 'post_id_123';
  }
}
```

## Gaming App

### Game Progress Tracking

```typescript
// game-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class GameService {
  async startLevel(levelId: string) {
    // Start level performance trace
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: `level_${levelId}`
    });

    // Track level start
    await FirebaseKit.analytics.logEvent({
      name: 'level_start',
      params: {
        level_name: levelId,
        level_number: parseInt(levelId)
      }
    });

    // Log level start
    await FirebaseKit.crashlytics.log({
      message: `Level ${levelId} started`
    });

    return traceId;
  }

  async completeLevel(
    levelId: string,
    traceId: string,
    score: number,
    duration: number,
    success: boolean
  ) {
    // Add metrics to trace
    await FirebaseKit.performance.incrementMetric({
      traceId,
      metricName: 'score',
      value: score
    });

    await FirebaseKit.performance.incrementMetric({
      traceId,
      metricName: 'duration_seconds',
      value: duration
    });

    await FirebaseKit.performance.putAttribute({
      traceId,
      attribute: 'success',
      value: success.toString()
    });

    // Track level completion
    await FirebaseKit.analytics.logEvent({
      name: success ? 'level_end' : 'level_fail',
      params: {
        level_name: levelId,
        level_number: parseInt(levelId),
        score,
        duration,
        success
      }
    });

    // Update user level property
    if (success) {
      await FirebaseKit.analytics.setUserProperty({
        key: 'highest_level',
        value: levelId
      });
    }

    // Stop trace
    await FirebaseKit.performance.stopTrace({ traceId });
  }

  async earnAchievement(achievementId: string, points: number) {
    await FirebaseKit.analytics.logEvent({
      name: 'unlock_achievement',
      params: {
        achievement_id: achievementId,
        points_earned: points
      }
    });

    // Show rewarded ad for achievement
    await this.showRewardedAd('achievement_reward');
  }

  private async showRewardedAd(context: string) {
    try {
      await FirebaseKit.adMob.loadRewarded({
        adId: 'ca-app-pub-3940256099942544/5224354917'
      });

      await FirebaseKit.adMob.showRewarded();

      // Track ad shown
      await FirebaseKit.analytics.logEvent({
        name: 'ad_shown',
        params: {
          ad_type: 'rewarded',
          context
        }
      });
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
    }
  }
}
```

### In-App Purchases

```typescript
// iap-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class IAPService {
  async purchaseItem(productId: string, price: number, currency: string) {
    // Track purchase initiation
    await FirebaseKit.analytics.logEvent({
      name: 'begin_checkout',
      params: {
        currency,
        value: price,
        items: [{
          item_id: productId,
          item_name: productId,
          price,
          quantity: 1
        }]
      }
    });

    try {
      // Process purchase
      const transactionId = await this.processPurchase(productId);

      // Track successful purchase
      await FirebaseKit.analytics.logEvent({
        name: 'purchase',
        params: {
          transaction_id: transactionId,
          currency,
          value: price,
          items: [{
            item_id: productId,
            item_name: productId,
            price,
            quantity: 1
          }]
        }
      });

      // Set user property
      await FirebaseKit.analytics.setUserProperty({
        key: 'purchaser',
        value: 'true'
      });

      return transactionId;
    } catch (error) {
      await FirebaseKit.crashlytics.logException({
        message: 'Purchase failed',
        code: 'PURCHASE_ERROR'
      });
      throw error;
    }
  }

  private async processPurchase(productId: string): Promise<string> {
    // Implementation
    return 'txn_123';
  }
}
```

## News App

### Content Engagement Tracking

```typescript
// news-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class NewsService {
  async viewArticle(articleId: string, category: string, readTime: number) {
    // Track article view
    await FirebaseKit.analytics.logEvent({
      name: 'select_content',
      params: {
        content_type: 'article',
        content_id: articleId,
        content_category: category,
        estimated_read_time: readTime
      }
    });

    // Start reading session trace
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: 'article_reading'
    });

    await FirebaseKit.performance.putAttribute({
      traceId,
      attribute: 'category',
      value: category
    });

    return traceId;
  }

  async finishReading(traceId: string, actualReadTime: number, scrollPercentage: number) {
    // Add reading metrics
    await FirebaseKit.performance.incrementMetric({
      traceId,
      metricName: 'read_time_seconds',
      value: actualReadTime
    });

    await FirebaseKit.performance.incrementMetric({
      traceId,
      metricName: 'scroll_percentage',
      value: scrollPercentage
    });

    // Track reading completion
    await FirebaseKit.analytics.logEvent({
      name: 'article_read',
      params: {
        read_time: actualReadTime,
        completion_percentage: scrollPercentage
      }
    });

    // Stop trace
    await FirebaseKit.performance.stopTrace({ traceId });
  }

  async searchArticles(query: string, resultCount: number) {
    await FirebaseKit.analytics.logEvent({
      name: 'search',
      params: {
        search_term: query,
        result_count: resultCount
      }
    });
  }
}
```

## Productivity App

### Task Management

```typescript
// task-service.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class TaskService {
  async createTask(title: string, category: string, priority: 'low' | 'medium' | 'high') {
    const taskId = await this.saveTask(title, category, priority);

    // Track task creation
    await FirebaseKit.analytics.logEvent({
      name: 'task_created',
      params: {
        task_id: taskId,
        category,
        priority
      }
    });

    return taskId;
  }

  async completeTask(taskId: string, timeSpent: number) {
    // Track task completion
    await FirebaseKit.analytics.logEvent({
      name: 'task_completed',
      params: {
        task_id: taskId,
        time_spent_minutes: timeSpent
      }
    });

    // Update productivity metrics
    await this.updateProductivityMetrics(timeSpent);
  }

  private async updateProductivityMetrics(timeSpent: number) {
    // Get current productivity stats from Remote Config
    const { asString } = await FirebaseKit.remoteConfig.getValue({
      key: 'productivity_goals'
    });

    const goals = JSON.parse(asString || '{}');
    
    // Update user property
    await FirebaseKit.analytics.setUserProperty({
      key: 'productivity_level',
      value: timeSpent > goals.daily_target ? 'high' : 'normal'
    });
  }

  private async saveTask(title: string, category: string, priority: string): Promise<string> {
    // Implementation
    return 'task_123';
  }
}
```

## Error Handling Patterns

### Robust Error Handling

```typescript
// error-handler.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class ErrorHandler {
  static async handleError(error: Error, context?: any) {
    console.error('Error occurred:', error);

    // Log to Crashlytics
    await FirebaseKit.crashlytics.setCustomKeys({
      attributes: {
        timestamp: new Date().toISOString(),
        user_action: context?.action || 'unknown',
        screen: context?.screen || 'unknown',
        ...context
      }
    });

    await FirebaseKit.crashlytics.logException({
      message: error.message,
      code: error.name,
      stackTrace: this.parseStackTrace(error.stack)
    });

    // Track error in analytics
    await FirebaseKit.analytics.logEvent({
      name: 'error_occurred',
      params: {
        error_type: error.name,
        error_message: error.message,
        context: JSON.stringify(context || {})
      }
    });
  }

  static async wrapAsync<T>(
    operation: () => Promise<T>,
    context?: any
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      await this.handleError(error as Error, context);
      throw error;
    }
  }

  private static parseStackTrace(stack?: string): any[] {
    if (!stack) return [];
    
    return stack.split('\n').map(line => ({
      fileName: this.extractFileName(line),
      lineNumber: this.extractLineNumber(line),
      methodName: this.extractMethodName(line)
    }));
  }

  private static extractFileName(line: string): string {
    const match = line.match(/\(([^)]+)\)/);
    return match ? match[1].split(':')[0] : '';
  }

  private static extractLineNumber(line: string): number {
    const match = line.match(/:(\d+):/);
    return match ? parseInt(match[1]) : 0;
  }

  private static extractMethodName(line: string): string {
    const match = line.match(/at\s+([^(]+)/);
    return match ? match[1].trim() : '';
  }
}
```

## Performance Optimization

### Batch Operations

```typescript
// batch-operations.ts
import { FirebaseKit } from 'capacitor-firebase-kit';

export class BatchOperations {
  private analyticsQueue: Array<{ name: string; params: any }> = [];
  private flushInterval = 5000; // 5 seconds

  constructor() {
    setInterval(() => this.flushAnalytics(), this.flushInterval);
  }

  queueAnalyticsEvent(name: string, params: any) {
    this.analyticsQueue.push({ name, params });
  }

  private async flushAnalytics() {
    if (this.analyticsQueue.length === 0) return;

    const events = [...this.analyticsQueue];
    this.analyticsQueue = [];

    for (const event of events) {
      try {
        await FirebaseKit.analytics.logEvent(event);
      } catch (error) {
        console.error('Failed to log analytics event:', error);
      }
    }
  }

  async processItemsBatch(items: any[]) {
    const { traceId } = await FirebaseKit.performance.startTrace({
      traceName: 'batch_processing'
    });

    let processedCount = 0;
    const batchSize = 10;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (item) => {
        await this.processItem(item);
        processedCount++;
      }));

      // Update metrics periodically
      await FirebaseKit.performance.incrementMetric({
        traceId,
        metricName: 'items_processed',
        value: batch.length
      });
    }

    await FirebaseKit.performance.stopTrace({ traceId });
    return processedCount;
  }

  private async processItem(item: any) {
    // Implementation
  }
}
```

These examples demonstrate real-world usage patterns for Capacitor Firebase Kit across different types of applications. Each example shows best practices for analytics tracking, performance monitoring, error handling, and service integration.