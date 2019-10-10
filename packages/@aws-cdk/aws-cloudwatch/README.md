## Amazon CloudWatch Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

Metric objects represent a metric that is emitted by AWS services or your own
application, such as `CPUUsage`, `FailureCount` or `Bandwidth`.

Metric objects can be constructed directly or are exposed by resources as
attributes. Resources that expose metrics will have functions that look
like `metricXxx()` which will return a Metric object, initialized with defaults
that make sense.

For example, `lambda.Function` objects have the `fn.metricErrors()` method, which
represents the amount of errors reported by that Lambda function:

```ts
const errors = fn.metricErrors();
```

### Aggregation

To graph or alarm on metrics you must aggregate them first, using a function
like `Average` or a percentile function like `P99`. By default, most Metric objects
returned by CDK libraries will be configured as `Average` over `300 seconds` (5 minutes).
The exception is if the metric represents a count of discrete events, such as
failures. In that case, the Metric object will be configured as `Sum` over `300
seconds`, i.e. it represents the number of times that event occurred over the
time period.

If you want to change the default aggregation of the Metric object (for example,
the function or the period), you can do so by passing additional parameters
to the metric function call:

```ts
const minuteErrorRate = fn.metricErrors({
    statistic: 'avg',
    period: Duration.minutes(1),
    label: 'Lambda failure rate'
});
```

This function also allows changing the metric label or color (which will be
useful when embedding them in graphs, see below).

> Rates versus Sums
>
> The reason for using `Sum` to count discrete events is that *some* events are
> emitted as either `0` or `1` (for example `Errors` for a Lambda) and some are
> only emitted as `1` (for example `NumberOfMessagesPublished` for an SNS
> topic).
>
> In case `0`-metrics are emitted, it makes sense to take the `Average` of this
> metric: the result will be the fraction of errors over all executions.
>
> If `0`-metrics are not emitted, the `Average` will always be equal to `1`,
> and not be very useful.
>
> In order to simplify the mental model of `Metric` objects, we default to
> aggregating using `Sum`, which will be the same for both metrics types. If you
> happen to know the Metric you want to alarm on makes sense as a rate
> (`Average`) you can always choose to change the statistic.

## Alarms

Alarms can be created on metrics in one of two ways. Either create an `Alarm`
object, passing the `Metric` object to set the alarm on:


```ts
new Alarm(this, 'Alarm', {
    metric: fn.metricErrors(),
    threshold: 100,
    evaluationPeriods: 2,
});
```

Alternatively, you can call `metric.createAlarm()`:

```ts
fn.metricErrors().createAlarm(this, 'Alarm', {
    threshold: 100,
    evaluationPeriods: 2,
});
```

The most important properties to set while creating an Alarms are:

- `threshold`: the value to compare the metric against.
- `comparisonOperator`: the comparison operation to use, defaults to `metric >= threshold`.
- `evaluationPeriods`: how many consecutive periods the metric has to be
  breaching the the threshold for the alarm to trigger.

## Dashboards

Dashboards are set of Widgets stored server-side which can be accessed quickly
from the AWS console. Available widgets are graphs of a metric over time, the
current value of a metric, or a static piece of Markdown which explains what the
graphs mean.

The following widgets are available:

- `GraphWidget` -- shows any number of metrics on both the left and right
  vertical axes.
- `AlarmWidget` -- shows the graph and alarm line for a single alarm.
- `SingleValueWidget` -- shows the current value of a set of metrics.
- `TextWidget` -- shows some static Markdown.

### Graph widget

A graph widget can display any number of metrics on either the `left` or
`right` vertical axis:

```ts
dashboard.addWidgets(new GraphWidget({
    title: "Executions vs error rate",

    left: [executionCountMetric],

    right: [errorCountMetric.with({
        statistic: "average",
        label: "Error rate",
        color: "00FF00"
    })]
}));
```

### Alarm widget

An alarm widget shows the graph and the alarm line of a single alarm:

```ts
dashboard.addWidgets(new AlarmWidget({
    title: "Errors",
    alarm: errorAlarm,
}));
```

### Single value widget

A single-value widget shows the latest value of a set of metrics (as opposed
to a graph of the value over time):

```ts
dashboard.addWidgets(new SingleValueWidget({
    metrics: [visitorCount, purchaseCount],
}));
```

### Text widget

A text widget shows an arbitrary piece of MarkDown. Use this to add explanations
to your dashboard:

```ts
dashboard.addWidgets(new TextWidget({
    markdown: '# Key Performance Indicators'
}));
```

### Dashboard Layout

The widgets on a dashboard are visually laid out in a grid that is 24 columns
wide. Normally you specify X and Y coordinates for the widgets on a Dashboard,
but because this is inconvenient to do manually, the library contains a simple
layout system to help you lay out your dashboards the way you want them to.

Widgets have a `width` and `height` property, and they will be automatically
laid out either horizontally or vertically stacked to fill out the available
space.

Widgets are added to a Dashboard by calling `add(widget1, widget2, ...)`.
Widgets given in the same call will be laid out horizontally. Widgets given
in different calls will be laid out vertically. To make more complex layouts,
you can use the following widgets to pack widgets together in different ways:

- `Column`: stack two or more widgets vertically.
- `Row`: lay out two or more widgets horizontally.
- `Spacer`: take up empty space
