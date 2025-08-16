# AWS::RUM Construct Library (Alpha)

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as rum from '@aws-cdk/aws-rum-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
```

## App Monitor

Amazon CloudWatch RUM is a real-user monitoring service that collects client-side data about your web application performance from actual user sessions in real time. The data that RUM collects includes page load times, client-side errors, and user behavior.

You can use the `AppMonitor` construct to create a RUM app monitor:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
});
```

### Configuration

You can configure various aspects of the app monitor:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
  appMonitorConfiguration: {
    allowCookies: true,
    enableXRay: true,
    sessionSampleRate: 0.5, // Sample 50% of sessions
  },
  customEvents: {
    enabled: true,
  },
});
```

### CloudWatch Logs Integration

When `cwLogEnabled` is set to `true`, RUM sends a copy of the telemetry data to CloudWatch Logs. You can access the log group through the `logGroup` property to configure additional processing, monitoring, or alerting:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

// Access the log group for further configuration
const logGroup = appMonitor.logGroup;
if (logGroup) {
  // Add subscription filters, set retention, etc.
  new logs.SubscriptionFilter(this, 'MySubscription', {
    logGroup,
    destination: new LambdaDestination(myFunction),
    filterPattern: logs.FilterPattern.allEvents(),
  });
  
  // Set log retention policy
  logGroup.addRetentionPolicy(logs.RetentionDays.ONE_MONTH);
}
```

#### Processing RUM Events with Lambda

A common use case is to process RUM events in real-time using Lambda functions. This is useful for alerting, custom analytics, or triggering actions based on application performance data:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

// Create a Lambda function to process RUM events
const rumProcessor = new lambda.Function(this, 'RUMProcessor', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      // Process CloudWatch Logs events from RUM
      const logs = event.awslogs.data;
      // Decode and process RUM telemetry data
      // Implement custom alerting, analytics, etc.
    };
  `),
});

const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

// Connect RUM logs to Lambda for real-time processing
const logGroup = appMonitor.logGroup;
if (logGroup) {
  new logs.SubscriptionFilter(this, 'RUMLogProcessor', {
    logGroup,
    destination: new LambdaDestination(rumProcessor),
    filterPattern: logs.FilterPattern.allEvents(),
  });
}
```

### JavaScript Source Maps

You can configure JavaScript source maps for better error stack trace deobfuscation:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  deobfuscationConfiguration: {
    javaScriptSourceMaps: {
      enabled: true,
      s3Uri: 's3://my-bucket/source-maps/',
    },
  },
});
```

### Importing Existing App Monitors

You can import an existing app monitor using the `fromAppMonitorAttributes` method:

```ts
const importedAppMonitor = rum.AppMonitor.fromAppMonitorAttributes(this, 'ImportedAppMonitor', {
  appMonitorId: 'existing-monitor-id',
  appMonitorName: 'existing-monitor-name',
  cwLogEnabled: true,
});
```

## Attributes

The `AppMonitor` construct exposes the following attributes:

- `appMonitorId` - The unique ID of the app monitor
- `appMonitorName` - The name of the app monitor
- `logGroup` - The CloudWatch log group (only available when `cwLogEnabled` is true)

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

// Use the attributes
console.log('App Monitor ID:', appMonitor.appMonitorId);
console.log('App Monitor Name:', appMonitor.appMonitorName);

// Access the log group for additional configuration
const logGroup = appMonitor.logGroup;
if (logGroup) {
  console.log('Log Group Name:', logGroup.logGroupName);
  // The log group follows the pattern: RUMService_${appMonitorName}${appMonitorId.slice(0,8)}
  // CDK handles the dynamic name construction automatically
}
```

## Properties

### AppMonitorConfiguration

The `appMonitorConfiguration` property accepts the following options:

- `allowCookies` - Whether to allow cookies for tracking user sessions (default: false)
- `enableXRay` - Whether to enable X-Ray tracing (default: false)
- `sessionSampleRate` - Portion of user sessions to sample (0 to 1, default: 0.1)

### CustomEventsConfig

The `customEvents` property accepts:

- `enabled` - Whether custom events are enabled (default: false)

### DeobfuscationConfig

The `deobfuscationConfiguration` property accepts:

- `javaScriptSourceMaps` - Configuration for JavaScript source maps
  - `enabled` - Whether source maps are enabled
  - `s3Uri` - S3 URI where source map files are stored (required when enabled is true)
