# Overview
There are two options for specifying the time-series data of a CloudWatch alarm:
* [Single, specific metric](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-alarm-metric.html) - user provides the metric name, namespace, dimensions, units, etc.
* [Metric-math expressions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) - user provides a list of metrics (as described above) and mathematical expressions to compute a (single) aggregate time-series metric.

Our L2 `Alarm` construct currently only supports a specific metric - the simple case. This design proposes an extension of this construct to support metric math.

# Expressions
CloudWatch metric-math is a domain-specific language (DSL) of data types, operators and functions for specifying mathematical aggregations of CloudWatch metric data.

## Data Types
There are three data types in the language:
* Scalar (or `S`) - represents a scalar number such as `2`, `-5`, `50.25`
* Time-Series (or `TS`) - represents a single time-series metric such as CPU Utilization. Our `Metric` L2 construct can be considered a `TS` value.
* Time-Series array (or `TS[]`) - a collection of time-series metrics (multiple lines on a graph).
```
// '::' denotes 'is of type'
100      :: S
m1       :: TS
[m1, m2] :: TS[]
```

## Arithmetic Operations and Functions
Arithmetic expressions may then be applied to these data types to compute refined time-series aggregates. There are: basic arithmetic operations such as `+`, `-`, `*`, `/` and `^`, and functions such as `SUM`, `AVG` and `STDDEV`. See the [official documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) for a complete explanation.
```
AVG(m1)           :: S
AVG([m1, m2])     :: TS
AVG([m1, m2]) + 1 :: TS
SUM([m1, m2])     :: TS
METRICS()         :: TS[]
```

## Polymorphism
Both operators and functions are polymorphic with respect to input and output types - the result type depends on the input type, like an overloaded function. This is important, because if we aim to reproduce a representation of this mathematical system in code, then we should also aim to capture and enforce those rules.

For example, the `AVG` function returns a `S` if passed a single `TS`, while it returns a `TS` if passed a collection, `TS[]`:

```
AVG(m1)       :: S
AVG([m1, m2]) :: TS
```

The consequence of this is you can not alarm on `AVG(TS)` because its type is `S`. Ideally the type system would enforce this constraint at compile time, or at least synth/run time. 

## Intermediate Computations

Metrics and expressons in a list of `MetricDataQuery` objects do not have to return data; so a complex expression may be reduced into smaller, simpler (and potentially re-usable) parts. In fact, a valid alarm definition *requires* that only one expression returns data. This is to say, the result type of an alarm definition must be `TS`.

# Alarm 

Let's look at a simple example of computing the average number of published messages to an SNS topic. Instead of specifying the metric directly, we'll use an expression to compute the average of the `Sum` stat:

```yaml
MyAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    Metrics:
      - Id: m1
        MetricStat:
          Metric:
            Namespace: AWS/SNS
            MetricName: NumberOfPublishedMessages
            Dimensions:
              - Name: TopicName
                Value: MyTopic
          Period: 300
          Stat: Sum
        ReturnData: false
      - Id: s1
        Expression: AVG(m1)
        ReturnData: true
```

Our first metric, `m1`, is not an expression. It brings the topic's metric into the scope of the expression with the ID, `m1`. Think of it like assigning a local variable. Also note how the value of `ReturnData` is `false` - as previously mentioned, only one entry in an alarm definition is permitted to return data. By specifying `false`, we are indicating that this value is an 'intermediate' value only used as part of the larger computation.

The second metric, `s1`, is a mathematical expression which averages the `m1` time-series metric 


```javascript
[{
  Id: 'm1', // we're doing math on ths MetricStat
  Metric: {
    MetricName: 'NumberOfPublishedMessages',
    Namespace: 'AWS/SNS',
    Dimensions: [{
      Name: 'hello',
      Value: 'world'
    }]
  },
  Period: 300,
  Stat: 'Average',
  ReturnData: false // just used for math
}, {
  Id: 'm2', // math expression based on the 'm1' MetricStat
  Expression: 'm1 / 2',
  ReturnData: false // just used for math
}, {
  Id: 'm3', // the final result is also an expression
  Expression: 'SUM([m1,m2]) * 100',
  ReturnData: true // use this time-series metric for the alarm
}]
```

Note how only one of the metrics (`m3`) has `ReturnData` set to `true` - this is a strict requirement for the [`PutMetricAlarm`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html) API, but not for the [`GetMetricData`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricData.html).

https://docs.aws.amazon.com/sdkfornet/v3/apidocs/Index.html
```
Gets and sets the property ReturnData.

When used in GetMetricData, this option indicates whether to return the timestamps and raw data values of this metric. If you are performing this call just to do math expressions and do not also need the raw data returned, you can specify False. If you omit this, the default of True is used.

When used in PutMetricAlarm, specify True for the one expression result to use as the alarm. For all other metrics and expressions in the same PutMetricAlarm operation, specify ReturnData as False.
```
