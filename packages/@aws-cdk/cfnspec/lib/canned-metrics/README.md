# Canned Metrics

This source of AWS metrics is kindly provided to us by the CloudWatch Explorer team
(and used in their console).

## What are we generating?

We are currently generating helpers to make it easier to product the `object.metricXXX()`
methods on resources. They will take care of the props (but not of instantiating a
`cloudwatch.Metric` object).

## Why are we not generating customer facing APIs from these?

We totally should, however there are some concerns that make this non-trivial.

All of the following concerns would require manual annotations.

### Adding methods

Our metrics helpers currently live ON the resource objects and interfaces.

This makes it so we have to codegen additional methods onto handwritten classes. This is not
impossible, and "augmentations" already do that, but it's somewhat uncomfortable. We need
to know interface and class names to codegen the appropriate additional methods, so these
need to be annotated everywhere.

### Renaming metrics

Whether this is a good thing or a bad thing might be a matter of opinion, but we
do rename metrics methods from the canonical names to make them more readable.

API Gateway: 4xx/5xx are translated to client/server

```js
metricClientError => '4XXError'
metricServerError => '5XXError'
```

StepFunctions State Machine: remove "executions", hide plurality change

```js
metricFailed => 'ExecutionsFailed'
metricThrottled => 'ExecutionThrottled' // Yes the 's' is missing on purpose!
```

Renames will need to be annotated.

Some metrics functions don't even map to a single metric because the actual
metric name is a parameter.

ApplicationLoadBalancer: The metric method indicates the SOURCE of the
HTTP code (ELB or backend), the metric name itself comes from an ENUM.

```js
  public metricHttpCodeElb(code: HttpCodeElb, props?: cloudwatch.MetricOptions) {
  public metricHttpCodeTarget(code: HttpCodeTarget, props?: cloudwatch.MetricOptions) {
```

NetworkLoadBalancer: get rid of underscores and recapitalize abbrevations

```js
metricTcpClientResetCount => 'TCP_Client_Reset_Count'
```

### Mapping dimensions to attribute names

Attribute names are chosen by hand, but dimension names are fixed. We need some kind
of mapping between the value that needs to go into the dimension, and the attribute
of the resource that we get it from.

Examples:

CodeBuild (simple enough)

```js
dimensions: { ProjectName: project.projectName },
```

API Gateway (slightly less clear)

```js
dimensions: { ApiName: api.restApiName },
```

ALB (even less clear)

```js
dimensions: { LoadBalancer: resource.loadBalancerFullName }
```

This mapping requires annotations somewhere.

### Metrics not consistently available on interface

Some of these dimension values are available for imported resources, but some
are not. In the examples above, `restApiName` and `loadBalancerFullName` are
only available as return values by CloudFormation, and are not known for
imported resources (as they are different identifiers than we usually expect
people to import by).

This means that the metrics cannot be made available on the resources
**interfaces**, only on the resource **classes**.

The lack of consistency here makes it harder to codegen for (requires
annotations).

## Additional logic in metrics methods

Although *many* metrics are simply of the form "give me this value for this resource",
not all of them are. Some require additional parameters or additional logic.

Examples:

ChatBot Slack configuration: metrics only in `us-east-1` regardless of stack region

```js
    return new cloudwatch.Metric({
      namespace: 'AWS/Chatbot',
      region: 'us-east-1',
      dimensions: {
        ConfigurationName: this.slackChannelConfigurationName,
      },
      metricName,
      ...props,
    });
  }
```

### Resource dimensions aren't necessarily complete

Some metrics require an additional dimensions that is not part of the resource
definition.

DynamoDB: User must supply an additional `Operation` dimension

Some metrics are emitted under `{ TableName, Operation }` instead of just `TableName`.
The API will have to have a non-standard shape like:

```js
  public metricSystemErrors(operation: Operation, options?: cloudwatch.MetricOptions): cloudwatch.IMetric {
```

### No docstrings

All of our methods have docstrings that try and describe what the metric actually
represents.

The model from CloudWatch Explorer does not have docstrings, so we would
still need to annotate them to make it user friendly.

### Incomplete model

The CW Model is certainly very exhaustive, but it's not complete. We currently
have metrics methods we would lose if we were to switch over completely.

### Backwards compatibility of default statistics

Since the CW Explorer team uses
these metrics as templates, they are free to change them at any time. For
example, when they decide that a `defaultStatistic` of `Average` should have
been `Sum`, for example. On the other hand, we have a fixed statistic
contract -- once a metric object emits under a particular statistic, we can
never change it or we will break downstream users.


## Updating

To update these metrics, see the `build-tools/update-metrics.sh` script.
