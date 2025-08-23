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

## App Monitor

Amazon CloudWatch RUM is a real-user monitoring service that collects client-side data about your web application performance from actual user sessions in real time. The data that RUM collects includes page load times, client-side errors, and user behavior.

You can use the `AppMonitor` construct to create a RUM app monitor:

```ts
import * as rum from '@aws-cdk/aws-rum-alpha';

new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
});
```

### Configuration

You can configure various aspects of the app monitor:

```ts
new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
  appMonitorConfiguration: {
    allowCookies: true,
    enableXRay: true,
    sessionSampleRate: 0.5,
  },
  customEvents: { enabled: true },
});
```

### CloudWatch Logs Integration

When `cwLogEnabled` is set to `true`, RUM sends a copy of the telemetry data to CloudWatch Logs. You can access the log group through the `logGroup` property:

```ts
const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

// Access the log group
appMonitor.logGroup?.addRetentionPolicy(logs.RetentionDays.ONE_MONTH);
```

#### Processing RUM Events with Lambda

You can process RUM events in real-time using Lambda functions:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';

const rumProcessor = new lambda.Function(this, 'RUMProcessor', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      // Process RUM telemetry data
      console.log(event.awslogs.data);
    };
  `),
});

const appMonitor = new rum.AppMonitor(this, 'MyAppMonitor', {
  appMonitorName: 'my-web-app',
  domain: 'example.com',
  cwLogEnabled: true,
});

new logs.SubscriptionFilter(this, 'RUMLogProcessor', {
  logGroup: appMonitor.logGroup!,
  destination: new LambdaDestination(rumProcessor),
  filterPattern: logs.FilterPattern.allEvents(),
});
```

### JavaScript Source Maps

You can configure JavaScript source maps for better error stack trace deobfuscation:

```ts
new rum.AppMonitor(this, 'MyAppMonitor', {
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
rum.AppMonitor.fromAppMonitorAttributes(this, 'ImportedAppMonitor', {
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

// Access attributes
console.log(appMonitor.appMonitorId);
console.log(appMonitor.logGroup?.logGroupName);
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
