# Amazon CloudWatch Logs Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This library supplies constructs for working with CloudWatch Logs.

## Log Groups/Streams

The basic unit of CloudWatch is a *Log Group*. Every log group typically has the
same kind of data logged to it, in the same format. If there are multiple
applications or services logging into the Log Group, each of them creates a new
*Log Stream*.

Every log operation creates a "log event", which can consist of a simple string
or a single-line JSON object. JSON objects have the advantage that they afford
more filtering abilities (see below).

The only configurable attribute for log streams is the retention period, which
configures after how much time the events in the log stream expire and are
deleted.

The default retention period if not supplied is 2 years, but it can be set to
one of the values in the `RetentionDays` enum to configure a different
retention period (including infinite retention).

[retention example](test/example.retention.lit.ts)

## LogRetention

The `LogRetention` construct is a way to control the retention period of log groups that are created outside of the CDK. The construct is usually
used on log groups that are auto created by AWS services, such as [AWS
lambda](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html).

This is implemented using a [CloudFormation custom
resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html)
which pre-creates the log group if it doesn't exist, and sets the specified log retention period (never expire, by default).

By default, the log group will be created in the same region as the stack. The `logGroupRegion` property can be used to configure
log groups in other regions. This is typically useful when controlling retention for log groups auto-created by global services that
publish their log group to a specific region, such as AWS Chatbot creating a log group in `us-east-1`.

## Resource Policy

CloudWatch Resource Policies allow other AWS services or IAM Principals to put log events into the log groups.
A resource policy is automatically created when `addToResourcePolicy` is called on the LogGroup for the first time:

```ts
const logGroup = new logs.LogGroup(this, 'LogGroup');
logGroup.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
    principals: [new iam.ServicePrincipal('es.amazonaws.com')],
    resources: [logGroup.logGroupArn],
}));
```

Or more conveniently, write permissions to the log group can be granted as follows which gives same result as in the above example.

```ts
const logGroup = new logs.LogGroup(this, 'LogGroup');
logGroup.grantWrite(new iam.ServicePrincipal('es.amazonaws.com'));
```

Be aware that any ARNs or tokenized values passed to the resource policy will be converted into AWS Account IDs.
This is because CloudWatch Logs Resource Policies do not accept ARNs as principals, but they do accept
Account ID strings. Non-ARN principals, like Service principals or Any princpals, are accepted by CloudWatch.

## Encrypting Log Groups

By default, log group data is always encrypted in CloudWatch Logs. You have the
option to encrypt log group data using a AWS KMS customer master key (CMK) should
you not wish to use the default AWS encryption. Keep in mind that if you decide to
encrypt a log group, any service or IAM identity that needs to read the encrypted
log streams in the future will require the same CMK to decrypt the data.

Here's a simple example of creating an encrypted Log Group using a KMS CMK.

```ts
import * as kms from '@aws-cdk/aws-kms';

new logs.LogGroup(this, 'LogGroup', {
  encryptionKey: new kms.Key(this, 'Key'),
});
```

See the AWS documentation for more detailed information about [encrypting CloudWatch
Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html).

## Subscriptions and Destinations

Log events matching a particular filter can be sent to either a Lambda function
or a Kinesis stream.

If the Kinesis stream lives in a different account, a `CrossAccountDestination`
object needs to be added in the destination account which will act as a proxy
for the remote Kinesis stream. This object is automatically created for you
if you use the CDK Kinesis library.

Create a `SubscriptionFilter`, initialize it with an appropriate `Pattern` (see
below) and supply the intended destination:

```ts
import * as destinations from '@aws-cdk/aws-logs-destinations';
declare const fn: lambda.Function;
declare const logGroup: logs.LogGroup;

new logs.SubscriptionFilter(this, 'Subscription', {
  logGroup,
  destination: new destinations.LambdaDestination(fn),
  filterPattern: logs.FilterPattern.allTerms("ERROR", "MainThread"),
});
```

## Metric Filters

CloudWatch Logs can extract and emit metrics based on a textual log stream.
Depending on your needs, this may be a more convenient way of generating metrics
for you application than making calls to CloudWatch Metrics yourself.

A `MetricFilter` either emits a fixed number every time it sees a log event
matching a particular pattern (see below), or extracts a number from the log
event and uses that as the metric value.

Example:

[metricfilter example](test/integ.metricfilter.lit.ts)

Remember that if you want to use a value from the log event as the metric value,
you must mention it in your pattern somewhere.

A very simple MetricFilter can be created by using the `logGroup.extractMetric()`
helper function:

```ts
declare const logGroup: logs.LogGroup;
logGroup.extractMetric('$.jsonField', 'Namespace', 'MetricName');
```

Will extract the value of `jsonField` wherever it occurs in JSON-structed
log records in the LogGroup, and emit them to CloudWatch Metrics under
the name `Namespace/MetricName`.

### Exposing Metric on a Metric Filter

You can expose a metric on a metric filter by calling the `MetricFilter.metric()` API.
This has a default of `statistic = 'avg'` if the statistic is not set in the `props`.

```ts
declare const logGroup: logs.LogGroup;
const mf = new logs.MetricFilter(this, 'MetricFilter', {
  logGroup,
  metricNamespace: 'MyApp',
  metricName: 'Latency',
  filterPattern: logs.FilterPattern.exists('$.latency'),
  metricValue: '$.latency',
});

//expose a metric from the metric filter
const metric = mf.metric();

//you can use the metric to create a new alarm
new cloudwatch.Alarm(this, 'alarm from metric filter', {
  metric,
  threshold: 100,
  evaluationPeriods: 2,
});
```

## Patterns

Patterns describe which log events match a subscription or metric filter. There
are three types of patterns:

* Text patterns
* JSON patterns
* Space-delimited table patterns

All patterns are constructed by using static functions on the `FilterPattern`
class.

In addition to the patterns above, the following special patterns exist:

* `FilterPattern.allEvents()`: matches all log events.
* `FilterPattern.literal(string)`: if you already know what pattern expression to
  use, this function takes a string and will use that as the log pattern. For
  more information, see the [Filter and Pattern
  Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html).

### Text Patterns

Text patterns match if the literal strings appear in the text form of the log
line.

* `FilterPattern.allTerms(term, term, ...)`: matches if all of the given terms
  (substrings) appear in the log event.
* `FilterPattern.anyTerm(term, term, ...)`: matches if all of the given terms
  (substrings) appear in the log event.
* `FilterPattern.anyTermGroup([term, term, ...], [term, term, ...], ...)`: matches if
  all of the terms in any of the groups (specified as arrays) matches. This is
  an OR match.

Examples:

```ts
// Search for lines that contain both "ERROR" and "MainThread"
const pattern1 = logs.FilterPattern.allTerms('ERROR', 'MainThread');

// Search for lines that either contain both "ERROR" and "MainThread", or
// both "WARN" and "Deadlock".
const pattern2 = logs.FilterPattern.anyTermGroup(
  ['ERROR', 'MainThread'],
  ['WARN', 'Deadlock'],
);
```

## JSON Patterns

JSON patterns apply if the log event is the JSON representation of an object
(without any other characters, so it cannot include a prefix such as timestamp
or log level). JSON patterns can make comparisons on the values inside the
fields.

* **Strings**: the comparison operators allowed for strings are `=` and `!=`.
  String values can start or end with a `*` wildcard.
* **Numbers**: the comparison operators allowed for numbers are `=`, `!=`,
  `<`, `<=`, `>`, `>=`.

Fields in the JSON structure are identified by identifier the complete object as `$`
and then descending into it, such as `$.field` or `$.list[0].field`.

* `FilterPattern.stringValue(field, comparison, string)`: matches if the given
  field compares as indicated with the given string value.
* `FilterPattern.numberValue(field, comparison, number)`: matches if the given
  field compares as indicated with the given numerical value.
* `FilterPattern.isNull(field)`: matches if the given field exists and has the
  value `null`.
* `FilterPattern.notExists(field)`: matches if the given field is not in the JSON
  structure.
* `FilterPattern.exists(field)`: matches if the given field is in the JSON
  structure.
* `FilterPattern.booleanValue(field, boolean)`: matches if the given field
  is exactly the given boolean value.
* `FilterPattern.all(jsonPattern, jsonPattern, ...)`: matches if all of the
  given JSON patterns match. This makes an AND combination of the given
  patterns.
* `FilterPattern.any(jsonPattern, jsonPattern, ...)`: matches if any of the
  given JSON patterns match. This makes an OR combination of the given
  patterns.

Example:

```ts
// Search for all events where the component field is equal to
// "HttpServer" and either error is true or the latency is higher
// than 1000.
const pattern = logs.FilterPattern.all(
  logs.FilterPattern.stringValue('$.component', '=', 'HttpServer'),
  logs.FilterPattern.any(
    logs.FilterPattern.booleanValue('$.error', true),
    logs.FilterPattern.numberValue('$.latency', '>', 1000),
  ),
);
```

## Space-delimited table patterns

If the log events are rows of a space-delimited table, this pattern can be used
to identify the columns in that structure and add conditions on any of them. The
canonical example where you would apply this type of pattern is Apache server
logs.

Text that is surrounded by `"..."` quotes or `[...]` square brackets will
be treated as one column.

* `FilterPattern.spaceDelimited(column, column, ...)`: construct a
  `SpaceDelimitedTextPattern` object with the indicated columns. The columns
  map one-by-one the columns found in the log event. The string `"..."` may
  be used to specify an arbitrary number of unnamed columns anywhere in the
  name list (but may only be specified once).

After constructing a `SpaceDelimitedTextPattern`, you can use the following
two members to add restrictions:

* `pattern.whereString(field, comparison, string)`: add a string condition.
  The rules are the same as for JSON patterns.
* `pattern.whereNumber(field, comparison, number)`: add a numerical condition.
  The rules are the same as for JSON patterns.

Multiple restrictions can be added on the same column; they must all apply.

Example:

```ts
// Search for all events where the component is "HttpServer" and the
// result code is not equal to 200.
const pattern = logs.FilterPattern.spaceDelimited('time', 'component', '...', 'result_code', 'latency')
  .whereString('component', '=', 'HttpServer')
  .whereNumber('result_code', '!=', 200);
```

## Logs Insights Query Definition

Creates a query definition for CloudWatch Logs Insights.

Example:

```ts
new logs.QueryDefinition(this, 'QueryDefinition', {
  queryDefinitionName: 'MyQuery',
  queryString: new logs.QueryString({
    fields: ['@timestamp', '@message'],
    sort: '@timestamp desc',
    limit: 20,
  }),
});
```

## Notes

Be aware that Log Group ARNs will always have the string `:*` appended to
them, to match the behavior of [the CloudFormation `AWS::Logs::LogGroup`
resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#aws-resource-logs-loggroup-return-values).
