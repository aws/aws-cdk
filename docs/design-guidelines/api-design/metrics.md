## Metrics

Almost all AWS resources emit CloudWatch metrics, which can be used with alarms
and dashboards.

AWS construct interfaces should include a set of “metric” methods which
represent the CloudWatch metrics emitted from this resource
_[awslint:metrics-on-interface]_.

At a minimum (and enforced by IResource), all resources should have a single
method called **metric**, which returns a **cloudwatch.Metric** object
associated with this instance (usually this method will simply set the right
metrics namespace and dimensions [_awslint:metrics-generic-method_]:

```ts
metric(metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
```

> **Exclusion**: If a resource does not emit CloudWatch metrics, this rule may
    be excluded

Additional metric methods should be exposed with the official metric name as a
suffix and adhere to the following rules _[awslint:metrics-method-signature]:_

* Name should be “metricXxx” where “Xxx” is the official metric name
* Accepts a single “options” argument of type **MetricOptions**
* Returns a **Metric** object

```ts
interface IFunction {
  metricDuration(options?: cloudwatch.MetricOptions): cloudwatch.Metric;
  metricInvocations(options?: cloudwatch.MetricOptions): cloudwatch.Metric;
  metricThrottles(options?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
```

It is sometimes desirable to use a metric that applies to all resources of a
certain type within the account. To facilitate this, resources should expose a
static method called **metricAll** _[awslint:metrics-static-all]_. Additional
**metricAll** static methods can also be exposed
_[awslint:metrics-all-methods]_.

<!-- markdownlint-disable MD013 -->
```ts
class Function extends Resource implements IFunction {
  public static metricAll(metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
  public static metricAllErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
```
<!-- markdownlint-enable MD013 -->