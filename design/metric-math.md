# Overview
Our L2 `Alarm` construct currently only supports specifying a single metric to monitor. This design discusses options for extending this construct to support metric math, AWS's domain-specific language (DSL) which defines data types, operators and functions for specifying mathematical aggregations of CloudWatch metric data.

See the [official documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) for a complete explanation of metric-math.

## Data Types
There are three data types in the language:
* Scalar (`S`) - represents a scalar number such as `2`, `-5`, `50.25`
* Time-Series (`TS`) - represents a single time-series metric such as CPU Utilization (single line on a graph). Our `Metric` L2 construct is an example of a `TS` value.
* Time-Series array (`TS[]`) - a collection of time-series metrics (multiple lines on a graph).
```
// '::' denotes 'is of type'
100      :: S
m1       :: TS
[m1, m2] :: TS[]
```

## Arithmetic Operations and Functions
Arithmetic expressions may then be applied to these data types to compute aggregations. There are: basic arithmetic operations such as `+`, `-`, `*`, `/` and `^`, and functions such as `SUM`, `AVG` and `STDDEV`. 
```
m1 * 100          :: TS
AVG(m1)           :: S
AVG([m1, m2])     :: TS
AVG([m1, m2]) + 1 :: TS
SUM([m1, m2])     :: TS
METRICS()         :: TS[]
```

Both operators and functions are polymorphic with respect to input and output types - the result type depends on the input type, like an overloaded function. This is important, because if we aim to reproduce a representation of this mathematical system in code, then we should also capture and enforce those rules as best we can.

For example, the `AVG` function returns a `S` if passed a single `TS`, while it returns a `TS` if passed a `TS[]`:

```
AVG(m1)       :: S // average of all data points 
AVG([m1, m2]) :: TS // average of the series' points at each interval
```

A consequence of this is you can not alarm on `AVG(TS)` because its type is `S`.

## Intermediate Computation
Metric definitions and math expressions co-exist in a list of `MetricDataQuery` objects. Only one time-series (single line) result may be compared against the alarm condition. That is to say, the result type of a query must be `TS` to be valid as an Alarm.

This is achieved by setting the `ReturnData` flag. When `true`, the result of that expression - whether it be a `TS` or `TS[]` - materializes as lines on a graph; setting it to `false` means it doesn't. This mechanic then enables two applications: 
* Reduction of a complex expression into smaller, simpler (and potentially re-usable) parts;
* Identify the `TS` result you want to monitor in the alarm.

Let's look at an example CloudFormation YAML definition of an alarm using metric-math:

```yaml
MyAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    Metrics:
      - Id: errors
        MetricStat:
          Metric:
            MetricName: Errors
            Namespace: Test
          Period: 300
          Stat: Sum
        ReturnData: false
      - Id: requests
        MetricStat:
          Metric:
            MetricName: Requests
            Namespace: Test
          Period: 300
          Stat: Sum
        ReturnData: false
      - Id: error_rate
        Expression: errors / requests * 100
        ReturnData: true
```

We have requested two specific metrics, `errors` and `requests`. This brings those metrics into the scope of the query with their respective IDs. Think of it like assigning local variables for use later on. Also note how the value of `ReturnData` is `false` for these metrics - as previously mentioned, only one entry in an alarm definition is permitted to return data. By specifying `false`, we are indicating that this value is an 'intermediate' value used only as part of the larger computation. The expression, `error_rate`, then computes the error rate as a percentage using a simple expression, `errors / requests * 100`. `ReturnData` is set to true because we want to alarm on this `TS` value.

# Design Options

We will discuss three options:
1. The simplest (or 'lowest') approach which simply enhances the raw CloudFormation API with our `Metric` L2.
2. A specialization of Option 1 designed to reduce boiler-plate and better express the computation of a single `TS` value
3. A type-safe DSL which makes use of functions and classes to model the metric-math system in code

## Option 1 - Simple

The simplest approach is to stay true to the CloudFormation format, but leverage the `Metric` L2 for importing specific metrics into the query scope: 

```typescript
const errors = new cloudwatch.Metric({
  metricName: 'Errors',
  namespace: 'Test'
});
const requests = new cloudwatch.Metric({
  metricName: 'Requests',
  namespace: 'Test'
});

const alarm = new cloudwatch.Alarm(this, 'woof', {
  // etc.
  metrics: [{
    id: 'errors',
    metric: errors,
    returnData: false
  }, {
    id: 'requests',
    metric: requests,
    returnData: false
  }, {
    id: 'result',
    expression: 'errors / requests * 100',
    returnData: true
  }]
});
```

### Pros
* Reflects the official CloudFormation API
* Compatible with the existing `Metric` L2 construct
* There is no hidden 'magic' (see Option 3)
  * Understanding how and what you are doing is intuitive (if you already understand the API)
  * Risk of 'us' introducing bugs is minimized

### Cons
* More verbose - the developer has to write a lot of boiler-plate such as allocating ids, returnData, etc.
* The developer must learn how to express valid metric expressions according to the somewhat complicated API and documentation. The `returnData` nuances were particulary difficult to tease out from the docs, for example.
* Not type-safe - there is no static checking of the expression to ensure it is valid. Failures are caught at deployment time which is very slow, unless we build our own parser ... ?

## Option 2 - Slight Enhancement

Straying from the original CFN format a little, we can specialize the API in a way that better reflects the usual case:
1. Fetch and assign metrics to IDs
2. Use an expression to compute and return a `TS` result

```typescript
const errors = new cloudwatch.Metric({
  metricName: 'Errors',
  namespace: 'Test'
});
const requests = new cloudwatch.Metric({
  metricName: 'Requests',
  namespace: 'Test'
});

const alarm = new cloudwatch.Alarm(this, 'woof', {
  // etc.
  metrics: {
    ids: {
      errors,
      requests
    },
    expression: 'errors / requests * 100'
  }
});
```

### Pros
* Compact
  * It takes less code to express the math
  * There is no need to manage `returnData` which is not as useful for alarms as it is for the `GetMetricData` API.

### Cons
* Different to the original CFN and SDK API.
* It's opinionated - are there metrics that can not be expressed in this way?
* Also not statically checked - errors in the expression will be found at deployment time.

## Option 3 - Type-safe DSL

Model the data types, operators and functions as classes and methods in code.

```typescript
const errors = new cloudwatch.Metric({
  metricName: 'Errors',
  namespace: 'Test'
});
const requests = new cloudwatch.Metric({
  metricName: 'Requests',
  namespace: 'Test'
});

const alarm = new cloudwatch.Alarm(this, 'woof', {
  // etc.
  metrics: errors.divide(requests).multiply(100)
});
```

### Pros
* Type-safe - the compiler and implementation checks the validity of expressions. For example, it ensures the final result is a `TS` and the arguments to functions or operators are used correctly.
* IDE discoverability, auto-complete, in-line documentation.
* Programmatic variation - like how we build constructs, the expression tree can be assembled incrementally with standard programming techniques (`if-else`, `functions`, `classes`, etc.)

### Cons
* Highly opinionated and different to the original API
* We must maintain backwards compatibility with any future features released by the CloudWatch team
* Risk of us introducing bugs is higher - especially for large complicated expressions
* Expressing paranthesis to control mathematical precedence rules may be ugly or unintuitive
* Could be problematic for JSII, although it does pass its checks :)

### Implementation

This design comes with a prototype which will be briefly explained in this section. See the code and tests for more depth.

TODO: Explain the implementation (look at the code and tests in the meantime - it is functional).
