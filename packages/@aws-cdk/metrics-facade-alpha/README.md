# Metrics Facade Alpha Library
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

## CloudWatch Metrics

This library automatically generates typed CloudWatch metric helpers for AWS resources. These metrics come in two flavors: **resource-scoped** and **unscoped**.

### Resource-Scoped Metrics

Resource-scoped metrics are created from a resource reference (e.g. a Lambda function). The resource dimensions are automatically injected, so metric methods return metrics already filtered to that specific resource.

#### Metrics Basic Usage

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda/metrics';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// Works with L2 constructs
const fn = new lambda.Function(scope, 'Function', { /* ... */ });
const fnMetrics = LambdaMetrics.fromFunction(fn);

new cloudwatch.Alarm(scope, 'ErrorAlarm', {
  metric: fnMetrics.metricErrors(),
  threshold: 5,
  evaluationPeriods: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

// Also works with L1 constructs
const cfnFunction = new lambda.CfnFunction(scope, 'CfnFunction', { /* ... */ });
const cfnMetrics = LambdaMetrics.fromFunction(cfnFunction);

new cloudwatch.CfnAlarm(scope, 'CfnAlarm', {
  metricName: 'Errors',
  namespace: 'AWS/Lambda',
  // ...
});
```

#### Metric Features

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda/metrics';

const fnMetrics = LambdaMetrics.fromFunction(fn);

// FunctionName dimension is automatically injected from the function reference
const metric = fnMetrics.metricInvocations();
```

**Statistic Override**: Override default statistics via `MetricOptions`

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda/metrics';

const fnMetrics = LambdaMetrics.fromFunction(fn);

// Default statistic for Duration is Average
const defaultMetric = fnMetrics.metricDuration();

// Override statistic via MetricOptions
const p99Metric = fnMetrics.metricDuration({ statistic: 'p99' });
```

### Unscoped Metrics

Unscoped metrics are not tied to a specific resource. They can be created with explicit dimensions or with no dimensions for account-wide metrics.

#### Unscoped Metrics Basic Usage

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda/metrics';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// Explicit dimensions
const fnMetrics = new LambdaMetrics.FunctionNameMetrics({
  functionName: 'my-function',
});
fnMetrics.metricErrors();

// Per-resource dimensions (e.g. alias or version)
const resourceMetrics = new LambdaMetrics.FunctionNamePerResourceMetrics({
  functionName: 'my-function',
  resource: 'prod',
});
resourceMetrics.metricProvisionedConcurrencyUtilization();

// Account-wide metrics (no dimensions)
const accountMetrics = new LambdaMetrics.AccountMetrics();
accountMetrics.metricConcurrentExecutions();
accountMetrics.metricUnreservedConcurrentExecutions();
```

### Available Metrics

Metrics are generated from the AWS CloudWatch metrics spec database. Common examples:

**Lambda Metrics**:

* `metricInvocations()` - Function invocation count
* `metricErrors()` - Function error count
* `metricDuration()` - Function execution duration
* `metricThrottles()` - Function throttle count
* `metricConcurrentExecutions()` - Concurrent execution count

Import metrics from service-specific modules:

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda/metrics';
```
