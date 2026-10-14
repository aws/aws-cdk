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
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda';

// Works with L2 constructs
declare const fn: lambda.Function;
const fnMetrics = LambdaMetrics.fromFunction(fn);

new cloudwatch.Alarm(scope, 'ErrorAlarm', {
  metric: fnMetrics.errors(),
  threshold: 5,
  evaluationPeriods: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

// Also works with L1 constructs
declare const cfnFunction: lambda.CfnFunction;
const cfnMetrics = LambdaMetrics.fromFunction(cfnFunction);
```

#### Metric Features

```typescript
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda';

declare const fn: lambda.Function;
const fnMetrics = LambdaMetrics.fromFunction(fn);

// FunctionName dimension is automatically injected from the function reference
const metric = fnMetrics.invocations();
```

**Statistic Override**: Override default statistics via `MetricOptions`

```typescript
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda';

declare const fn: lambda.Function;
const fnMetrics = LambdaMetrics.fromFunction(fn);

// Default statistic for Duration is Average
const defaultMetric = fnMetrics.duration();

// Override statistic via MetricOptions
const p99Metric = fnMetrics.duration({ statistic: 'p99' });
```

### Unscoped Metrics

Unscoped metrics are not tied to a specific resource. They can be created with explicit dimensions or with no dimensions for account-wide metrics.

#### Unscoped Metrics Basic Usage

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// Explicit dimensions
const fnMetrics = new LambdaMetrics.FunctionMetrics({
  functionName: 'my-function',
});
fnMetrics.errors();

// Per-resource dimensions (e.g. alias or version)
const resourceMetrics = new LambdaMetrics.ResourceMetrics({
  functionName: 'my-function',
  resource: 'prod',
});
resourceMetrics.provisionedConcurrencyUtilization();

// Account-wide metrics (no dimensions)
const accountMetrics = new LambdaMetrics.AccountMetrics();
accountMetrics.concurrentExecutions();
accountMetrics.unreservedConcurrentExecutions();
```

### Available Metrics

Metrics are generated from the AWS CloudWatch metrics spec database. Common examples:

**Lambda Metrics**:

* `invocations()` - Function invocation count
* `errors()` - Function error count
* `duration()` - Function execution duration
* `throttles()` - Function throttle count
* `concurrentExecutions()` - Concurrent execution count

Import metrics from service-specific modules:

```typescript
import { LambdaMetrics } from '@aws-cdk/metrics-facade-alpha/aws-lambda';
```
