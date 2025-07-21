# Remote Config Service

Firebase Remote Config allows you to change the behavior and appearance of your app without requiring users to download an app update. It provides a cloud-based key-value store backed by Firebase.

## Overview

Firebase Remote Config provides:
- Dynamic app configuration
- A/B testing capabilities
- Feature flagging
- Gradual rollout of features
- Real-time configuration updates
- Conditional configuration based on user properties

## Setup

### 1. Initialize Remote Config

```typescript
import { FirebaseKit } from 'capacitor-firebase-kit';

await FirebaseKit.remoteConfig.initialize({
  minimumFetchIntervalInSeconds: 3600,  // Default: 43200 (12 hours)
  fetchTimeoutInSeconds: 60  // Default: 60 seconds
});
```

#### Remote Config Initialization Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minimumFetchIntervalInSeconds` | `number` | `43200` (12 hours) | Minimum interval between fetches in seconds |
| `fetchTimeoutInSeconds` | `number` | `60` | Fetch timeout in seconds |

### 2. Set Default Values

```typescript
await FirebaseKit.remoteConfig.setDefaults({
  defaults: {
    welcome_message: 'Welcome to our app!',
    button_color: '#007AFF',
    feature_enabled: false,
    max_items_per_page: 10,
    api_endpoint: 'https://api.example.com/v1'
  }
});
```

### 3. Basic Usage

```typescript
// Fetch and activate configuration
const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();

if (activated) {
  console.log('New configuration activated');
}

// Get configuration values
const { asString } = await FirebaseKit.remoteConfig.getValue({
  key: 'welcome_message'
});

console.log('Welcome message:', asString);
```

## Configuration Settings

### Get Current Settings

```typescript
// Get current Remote Config settings
const settings = await FirebaseKit.remoteConfig.getSettings();

console.log('Minimum fetch interval:', settings.minimumFetchIntervalInSeconds);
console.log('Fetch timeout:', settings.fetchTimeoutInSeconds);
```

### Update Settings

```typescript
// Update Remote Config settings
await FirebaseKit.remoteConfig.setSettings({
  minimumFetchIntervalInSeconds: 1800,  // 30 minutes
  fetchTimeoutInSeconds: 30  // 30 seconds
});
```

## Configuration Management

### Fetch Configuration

```typescript
try {
  // Fetch latest configuration from server
  await FirebaseKit.remoteConfig.fetch({
    minimumFetchIntervalInSeconds: 0  // Default: uses the initialized value
  });
  
  // Activate the fetched configuration
  const { activated } = await FirebaseKit.remoteConfig.activate();
  
  if (activated) {
    console.log('Configuration updated');
  }
} catch (error) {
  console.error('Failed to fetch configuration:', error);
}
```

### Fetch and Activate (Combined)

```typescript
try {
  const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate({
    minimumFetchIntervalInSeconds: 0  // Default: uses the initialized value
  });
  
  if (activated) {
    console.log('New configuration fetched and activated');
    // Update UI or app behavior
    updateAppConfiguration();
  }
} catch (error) {
  console.error('Failed to fetch and activate configuration:', error);
}
```

## Getting Values

### Single Value

```typescript
const configValue = await FirebaseKit.remoteConfig.getValue({
  key: 'feature_enabled'
});

console.log('As string:', configValue.asString);
console.log('As boolean:', configValue.asBoolean);
console.log('As number:', configValue.asNumber);
console.log('Source:', configValue.source); // 'default', 'remote', or 'static'
```

### All Values

```typescript
const { values } = await FirebaseKit.remoteConfig.getAll();

Object.entries(values).forEach(([key, value]) => {
  console.log(`${key}: ${value.asString} (source: ${value.source})`);
});
```

### Type-Safe Value Access

```typescript
class ConfigManager {
  private static async getStringValue(key: string): Promise<string> {
    const { asString } = await FirebaseKit.remoteConfig.getValue({ key });
    return asString;
  }

  private static async getBooleanValue(key: string): Promise<boolean> {
    const { asBoolean } = await FirebaseKit.remoteConfig.getValue({ key });
    return asBoolean;
  }

  private static async getNumberValue(key: string): Promise<number> {
    const { asNumber } = await FirebaseKit.remoteConfig.getValue({ key });
    return asNumber;
  }

  static async getWelcomeMessage(): Promise<string> {
    return this.getStringValue('welcome_message');
  }

  static async isFeatureEnabled(): Promise<boolean> {
    return this.getBooleanValue('feature_enabled');
  }

  static async getMaxItemsPerPage(): Promise<number> {
    return this.getNumberValue('max_items_per_page');
  }
}
```

## Feature Flags

### Simple Feature Flag

```typescript
// Check if a feature is enabled
const isNewUIEnabled = await ConfigManager.isFeatureEnabled();

if (isNewUIEnabled) {
  // Show new UI
  renderNewUI();
} else {
  // Show old UI
  renderOldUI();
}
```

### Complex Feature Configuration

```typescript
interface FeatureConfig {
  enabled: boolean;
  rolloutPercentage: number;
  targetUserTypes: string[];
  experimentId: string;
}

class FeatureManager {
  static async getFeatureConfig(featureName: string): Promise<FeatureConfig> {
    const { asString } = await FirebaseKit.remoteConfig.getValue({
      key: `feature_${featureName}`
    });

    try {
      return JSON.parse(asString);
    } catch {
      return {
        enabled: false,
        rolloutPercentage: 0,
        targetUserTypes: [],
        experimentId: ''
      };
    }
  }

  static async isFeatureEnabledForUser(
    featureName: string,
    userType: string,
    userId: string
  ): Promise<boolean> {
    const config = await this.getFeatureConfig(featureName);

    if (!config.enabled) return false;

    // Check user type targeting
    if (config.targetUserTypes.length > 0 && 
        !config.targetUserTypes.includes(userType)) {
      return false;
    }

    // Check rollout percentage
    const userHash = this.hashUserId(userId);
    const userPercentile = userHash % 100;
    
    return userPercentile < config.rolloutPercentage;
  }

  private static hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
```

## Real-time Updates

### Listen for Configuration Updates

```typescript
// Listen for real-time configuration updates
const listener = await FirebaseKit.remoteConfig.addListener(
  'remoteConfigUpdated',
  async (update) => {
    console.log('Configuration updated:', update.updatedKeys);
    
    // Handle specific key updates
    if (update.updatedKeys.includes('feature_enabled')) {
      const newValue = await ConfigManager.isFeatureEnabled();
      updateFeatureUI(newValue);
    }
    
    if (update.updatedKeys.includes('welcome_message')) {
      const newMessage = await ConfigManager.getWelcomeMessage();
      updateWelcomeMessage(newMessage);
    }
  }
);

// Remove listener when done
await listener.remove();
```

### Auto-refresh Configuration

```typescript
class ConfigAutoRefresh {
  private refreshInterval: number = 5 * 60 * 1000; // 5 minutes
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    this.intervalId = setInterval(async () => {
      try {
        const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate({
          minimumFetchIntervalInSeconds: 0  // Force immediate fetch for auto-refresh
        });
        if (activated) {
          console.log('Configuration auto-refreshed');
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, this.refreshInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

## A/B Testing

### Simple A/B Test

```typescript
async function getExperimentVariant(): Promise<'A' | 'B'> {
  const { asString } = await FirebaseKit.remoteConfig.getValue({
    key: 'checkout_experiment'
  });
  
  return asString === 'variant_b' ? 'B' : 'A';
}

// Use in your app
const variant = await getExperimentVariant();

if (variant === 'A') {
  showCheckoutVariantA();
} else {
  showCheckoutVariantB();
}

// Track experiment participation
await FirebaseKit.analytics.logEvent({
  name: 'experiment_participation',
  params: {
    experiment_id: 'checkout_experiment',
    variant: variant
  }
});
```

### Advanced A/B Testing

```typescript
interface ExperimentConfig {
  id: string;
  enabled: boolean;
  variants: {
    [key: string]: {
      weight: number;
      config: any;
    };
  };
}

class ExperimentManager {
  static async getExperimentConfig(experimentId: string): Promise<ExperimentConfig | null> {
    const { asString } = await FirebaseKit.remoteConfig.getValue({
      key: `experiment_${experimentId}`
    });

    try {
      return JSON.parse(asString);
    } catch {
      return null;
    }
  }

  static async getVariantForUser(experimentId: string, userId: string): Promise<string | null> {
    const config = await this.getExperimentConfig(experimentId);
    
    if (!config || !config.enabled) return null;

    // Deterministic variant selection based on user ID
    const userHash = this.hashUserId(userId);
    const totalWeight = Object.values(config.variants)
      .reduce((sum, variant) => sum + variant.weight, 0);
    
    const userPercentile = userHash % 100;
    const targetPercentile = (userPercentile / 100) * totalWeight;
    
    let currentWeight = 0;
    for (const [variantId, variant] of Object.entries(config.variants)) {
      currentWeight += variant.weight;
      if (targetPercentile <= currentWeight) {
        return variantId;
      }
    }
    
    return null;
  }

  private static hashUserId(userId: string): number {
    // Same hash function as before
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
```

## Configuration Templates

### App Theme Configuration

```typescript
interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  darkMode: boolean;
}

class ThemeManager {
  static async getThemeConfig(): Promise<ThemeConfig> {
    const { asString } = await FirebaseKit.remoteConfig.getValue({
      key: 'app_theme'
    });

    try {
      return JSON.parse(asString);
    } catch {
      return {
        primaryColor: '#007AFF',
        secondaryColor: '#34C759',
        fontFamily: 'system-ui',
        borderRadius: 8,
        darkMode: false
      };
    }
  }

  static async applyTheme() {
    const theme = await this.getThemeConfig();
    
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    document.documentElement.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    
    if (theme.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
```

### API Configuration

```typescript
interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  enableCaching: boolean;
  rateLimitPerMinute: number;
}

class APIManager {
  static async getAPIConfig(): Promise<APIConfig> {
    const { asString } = await FirebaseKit.remoteConfig.getValue({
      key: 'api_config'
    });

    try {
      return JSON.parse(asString);
    } catch {
      return {
        baseURL: 'https://api.example.com/v1',
        timeout: 30000,
        retryAttempts: 3,
        enableCaching: true,
        rateLimitPerMinute: 60
      };
    }
  }

  static async configureAPI() {
    const config = await this.getAPIConfig();
    
    // Configure your API client with the remote config
    APIClient.configure({
      baseURL: config.baseURL,
      timeout: config.timeout,
      retryAttempts: config.retryAttempts,
      enableCaching: config.enableCaching,
      rateLimitPerMinute: config.rateLimitPerMinute
    });
  }
}
```

## Best Practices

### 1. Meaningful Default Values

```typescript
// Always provide meaningful defaults
await FirebaseKit.remoteConfig.setDefaults({
  defaults: {
    // Good: descriptive and sensible defaults
    max_concurrent_downloads: 3,
    cache_expiry_hours: 24,
    enable_offline_mode: false,
    
    // Avoid: unclear or arbitrary defaults
    setting1: 'value1',
    flag: true
  }
});
```

### 2. Gradual Rollout

```typescript
// Start with small rollout percentage
const rolloutConfig = {
  enabled: true,
  rolloutPercentage: 5, // Start with 5%
  targetUserTypes: ['beta_users']
};

// Gradually increase rollout
// Week 1: 5% -> Week 2: 15% -> Week 3: 50% -> Week 4: 100%
```

### 3. Fallback Handling

```typescript
async function getConfigValue(key: string, fallback: string): Promise<string> {
  try {
    const { asString, source } = await FirebaseKit.remoteConfig.getValue({ key });
    
    if (source === 'default' && !asString) {
      return fallback;
    }
    
    return asString || fallback;
  } catch (error) {
    console.error(`Failed to get config value for ${key}:`, error);
    return fallback;
  }
}
```

### 4. Configuration Validation

```typescript
function validateConfig(config: any, schema: any): boolean {
  // Implement your validation logic
  return true; // placeholder
}

async function getSafeConfig(key: string): Promise<any> {
  const { asString } = await FirebaseKit.remoteConfig.getValue({ key });
  
  try {
    const config = JSON.parse(asString);
    
    if (!validateConfig(config, expectedSchema)) {
      throw new Error('Invalid configuration');
    }
    
    return config;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    return getDefaultConfig();
  }
}
```

## Error Handling

### Robust Error Handling

```typescript
class RemoteConfigManager {
  private static async safeGetValue(key: string, defaultValue: any): Promise<any> {
    try {
      const { asString, source } = await FirebaseKit.remoteConfig.getValue({ key });
      
      if (source === 'default' && !asString) {
        return defaultValue;
      }
      
      // Try to parse as JSON first
      try {
        return JSON.parse(asString);
      } catch {
        // If not JSON, return as string
        return asString;
      }
    } catch (error) {
      console.error(`Failed to get remote config value for ${key}:`, error);
      return defaultValue;
    }
  }

  static async fetchWithRetry(maxRetries: number = 3): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { activated } = await FirebaseKit.remoteConfig.fetchAndActivate();
        return activated;
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error);
        
        if (i === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    return false;
  }
}
```

## Performance Optimization

### Caching Strategy

```typescript
class ConfigCache {
  private cache = new Map<string, { value: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  async getValue(key: string, ttl: number = this.defaultTTL): Promise<any> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.value;
    }

    const { asString } = await FirebaseKit.remoteConfig.getValue({ key });
    const value = asString;
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
    
    return value;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

## Testing

### Mock Remote Config

```typescript
// Mock for testing
const mockRemoteConfig = {
  values: new Map([
    ['feature_enabled', { asBoolean: true, asString: 'true', source: 'remote' }],
    ['welcome_message', { asString: 'Welcome!', source: 'remote' }]
  ]),

  getValue: jest.fn().mockImplementation(({ key }) => {
    return Promise.resolve(mockRemoteConfig.values.get(key) || {
      asString: '',
      asBoolean: false,
      asNumber: 0,
      source: 'default'
    });
  }),

  fetchAndActivate: jest.fn().mockResolvedValue({ activated: true }),
  setDefaults: jest.fn().mockResolvedValue(undefined)
};
```

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Basic Configuration | ✅ | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ | ✅ |
| A/B Testing | ✅ | ✅ | ✅ |
| Conditional Targeting | ✅ | ✅ | ✅ |
| Default Values | ✅ | ✅ | ✅ |
| Fetch Intervals | ✅ | ✅ | ✅ |

## Additional Resources

- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config)
- [Remote Config Best Practices](https://firebase.google.com/docs/remote-config/best-practices)
- [A/B Testing with Remote Config](https://firebase.google.com/docs/remote-config/abtest-config)
- [Remote Config REST API](https://firebase.google.com/docs/remote-config/rest-api)