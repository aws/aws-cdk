# Overview
Our L2 `Alarm` construct currently only supports specifying a specific metric to monitor - the simple case. This design discusses options for extending this construct to support metric math, a domain-specific language (DSL) of data types, operators and functions for specifying mathematical aggregations of CloudWatch metric data.

See the [official documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) for a complete explanation.

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
AVG(m1)           :: S
AVG([m1, m2])     :: TS
AVG([m1, m2]) + 1 :: TS
SUM([m1, m2])     :: TS
METRICS()         :: TS[]
```

Both operators and functions are polymorphic with respect to input and output types - the result type depends on the input type, like an overloaded function. This is important, because if we aim to reproduce a representation of this mathematical system in code, then we should also aim to capture and enforce those rules as best we can.

For example, the `AVG` function returns a `S` if passed a single `TS`, while it returns a `TS` if passed a collection, `TS[]`:

```
AVG(m1)       :: S // average of all data points 
AVG([m1, m2]) :: TS // average of the series' points at each interval
```

A consequence of this is you can not alarm on `AVG(TS)` because its type is `S`.

## Intermediate Computation
Metric definitions and math expressions co-exist in a list of `MetricDataQuery` objects, but only one time-series (single line) result may be compared against the alarm condition. That is to say, the result type of a `MetricDataQuery` must be `TS` for it to be valid as an Alarm.

This is achieved by setting the `ReturnData` flag. When `true`, the result of that expression - whether it be a `TS` or `TS[]` - materializes as lines on a graph; setting it to `false` means the opposite. This mechanic then supports two applications: 
* Reduction of a complex expression into smaller, simpler (and potentially re-usable) parts;
* Identify the expression which yields the time-series result to monitor as an alarm. 

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
          Period: 300
          Stat: Sum
        ReturnData: false
      - Id: requests
        MetricStat:
          Metric:
            MetricName: Requests
          Period: 300
          Stat: Sum
        ReturnData: false
      - Id: error_rate
        Expression: (requests - errors) * 100
        ReturnData: true
```

We have requested two specific metrics, `errors` and `requests`. This brings those metrics into the scope of the query with their respective IDs. Think of it like assigning local variables for use later on. Also note how the value of `ReturnData` is `false` for these metrics - as previously mentioned, only one entry in an alarm definition is permitted to return data. By specifying `false`, we are indicating that this value is an 'intermediate' value only used as part of the larger computation. The expression, `error_rate`, then computes the error rate as a percentage using a simple expressio, `(requests - errors) * 100`.

# Option 1 - simple

