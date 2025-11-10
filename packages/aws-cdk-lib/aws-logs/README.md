# Amazon CloudWatch Logs Construct Library


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

By default, the log group created by LogRetention will be retained after the stack is deleted. If the RemovalPolicy is set to DESTROY, then the log group will be deleted when the stack is deleted.

## Log Group Class

CloudWatch Logs offers two classes of log groups:

1. The CloudWatch Logs Standard log class is a full-featured option for logs that require real-time monitoring or logs that you access frequently.

2. The CloudWatch Logs Infrequent Access log class is a new log class that you can use to cost-effectively consolidate your logs. This log class offers a subset of CloudWatch Logs capabilities including managed ingestion, storage, cross-account log analytics, and encryption with a lower ingestion price per GB. The Infrequent Access log class is ideal for ad-hoc querying and after-the-fact forensic analysis on infrequently accessed logs.

For more details please check: [log group class documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)

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

Similarly, read permissions can be granted to the log group as follows.

```ts
const logGroup = new logs.LogGroup(this, 'LogGroup');
logGroup.grantRead(new iam.ServicePrincipal('es.amazonaws.com'));
```

Be aware that any ARNs or tokenized values passed to the resource policy will be converted into AWS Account IDs.
This is because CloudWatch Logs Resource Policies do not accept ARNs as principals, but they do accept
Account ID strings. Non-ARN principals, like Service principals or Any principals, are accepted by CloudWatch.

## Encrypting Log Groups

By default, log group data is always encrypted in CloudWatch Logs. You have the
option to encrypt log group data using a AWS KMS customer master key (CMK) should
you not wish to use the default AWS encryption. Keep in mind that if you decide to
encrypt a log group, any service or IAM identity that needs to read the encrypted
log streams in the future will require the same CMK to decrypt the data.

Here's a simple example of creating an encrypted Log Group using a KMS CMK.

```ts
import * as kms from 'aws-cdk-lib/aws-kms';

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
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';

declare const fn: lambda.Function;
declare const logGroup: logs.LogGroup;

new logs.SubscriptionFilter(this, 'Subscription', {
  logGroup,
  destination: new destinations.LambdaDestination(fn),
  filterPattern: logs.FilterPattern.allTerms("ERROR", "MainThread"),
  filterName: 'ErrorInMainThread',
});
```

When you use `KinesisDestination`, you can choose the method used to
distribute log data to the destination by setting the `distribution` property.

```ts
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

declare const stream: kinesis.Stream;
declare const logGroup: logs.LogGroup;

new logs.SubscriptionFilter(this, 'Subscription', {
  logGroup,
  destination: new destinations.KinesisDestination(stream),
  filterPattern: logs.FilterPattern.allTerms("ERROR", "MainThread"),
  filterName: 'ErrorInMainThread',
  distribution: logs.Distribution.RANDOM,
});
```

When you use `FirehoseDestination`, you can choose the method used to
distribute log data to the destination by setting the `distribution` property.

```ts
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

declare const deliveryStream: firehose.IDeliveryStream;
declare const logGroup: logs.LogGroup;

new logs.SubscriptionFilter(this, 'Subscription', {
  logGroup,
  destination: new destinations.FirehoseDestination(deliveryStream),
  filterPattern: logs.FilterPattern.allEvents(),
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

Will extract the value of `jsonField` wherever it occurs in JSON-structured
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
  dimensions: {
    ErrorCode: '$.errorCode',
  },
  unit: cloudwatch.Unit.MILLISECONDS,
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

### Metrics for IncomingLogs and IncomingBytes
Metric methods have been defined for IncomingLogs and IncomingBytes within LogGroups. These metrics allow for the creation of alarms on log ingestion, ensuring that the log ingestion process is functioning correctly.

To define an alarm based on these metrics, you can use the following template:
```ts
const logGroup = new logs.LogGroup(this, 'MyLogGroup');
const incomingEventsMetric = logGroup.metricIncomingLogEvents();
new cloudwatch.Alarm(this, 'HighLogVolumeAlarm', {
  metric: incomingEventsMetric,
  threshold: 1000,
  evaluationPeriods: 1,
});
```
```ts
const logGroup = new logs.LogGroup(this, 'MyLogGroup');
const incomingBytesMetric = logGroup.metricIncomingBytes();
new cloudwatch.Alarm(this, 'HighDataVolumeAlarm', {
  metric: incomingBytesMetric,
  threshold: 5000000,  // 5 MB
  evaluationPeriods: 1,
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
* `FilterPattern.regexValue(field, comparison, string)`: matches if the given
  field compares as indicated with the given regex pattern.
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
  logs.FilterPattern.regexValue('$.message', '=', 'bind address already in use'),
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
    parseStatements: [
      '@message "[*] *" as loggingType, loggingMessage',
      '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
    ],
    filterStatements: [
      'loggingType = "ERROR"',
      'loggingMessage = "A very strange error occurred!"',
    ],
    statsStatements: [
      'count(loggingMessage) as loggingErrors',
      'count(differentLoggingMessage) as differentLoggingErrors',
    ],
    sort: '@timestamp desc',
    limit: 20,
  }),
});
```

## Data Protection Policy

Creates a data protection policy and assigns it to the log group. A data protection policy can help safeguard sensitive data that's ingested by the log group by auditing and masking the sensitive log data. When a user who does not have permission to view masked data views a log event that includes masked data, the sensitive data is replaced by asterisks.

For more information, see [Protect sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html).

For a list of types of managed identifiers that can be audited and masked, see [Types of data that you can protect](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types.html).

If a new identifier is supported but not yet in the `DataIdentifiers` enum, the name of the identifier can be supplied as `name` in the constructor instead.

To add a custom data identifier, supply a custom `name` and `regex` to the `CustomDataIdentifiers` constructor.
For more information on custom data identifiers, see [Custom data identifiers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-custom-data-identifiers.html).

Each policy may consist of a log group, S3 bucket, and/or Firehose delivery stream audit destination.

Example:

```ts
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

const logGroupDestination = new logs.LogGroup(this, 'LogGroupLambdaAudit', {
  logGroupName: 'auditDestinationForCDK',
});

const bucket = new s3.Bucket(this, 'audit-bucket');
const s3Destination = new firehose.S3Bucket(bucket);

const deliveryStream = new firehose.DeliveryStream(this, 'Delivery Stream', {
  destination: s3Destination,
});

const dataProtectionPolicy = new logs.DataProtectionPolicy({
  name: 'data protection policy',
  description: 'policy description',
  identifiers: [
    logs.DataIdentifier.DRIVERSLICENSE_US, // managed data identifier
    new logs.DataIdentifier('EmailAddress'), // forward compatibility for new managed data identifiers
    new logs.CustomDataIdentifier('EmployeeId', 'EmployeeId-\\d{9}')], // custom data identifier
  logGroupAuditDestination: logGroupDestination,
  s3BucketAuditDestination: bucket,
  deliveryStreamNameAuditDestination: deliveryStream.deliveryStreamName,
});

new logs.LogGroup(this, 'LogGroupLambda', {
  logGroupName: 'cdkIntegLogGroup',
  dataProtectionPolicy: dataProtectionPolicy,
});
```

## Field Index Policies

Creates or updates a field index policy for the specified log group. You can use field index policies to create field indexes on fields found in log events in the log group. Creating field indexes lowers the costs for CloudWatch Logs Insights queries that reference those field indexes, because these queries attempt to skip the processing of log events that are known to not match the indexed field. Good fields to index are fields that you often need to query for and fields that have high cardinality of values.

For more information, see [Create field indexes to improve query performance and reduce costs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Field-Indexing.html).

Only log groups in the Standard log class support field index policies.
Currently, this array supports only one field index policy object.

Example:

```ts

const fieldIndexPolicy = new logs.FieldIndexPolicy({
  fields: ['Operation', 'RequestId'],
});

new logs.LogGroup(this, 'LogGroup', {
  logGroupName: 'cdkIntegLogGroup',
  fieldIndexPolicies: [fieldIndexPolicy],
});
```

## Transformer

A log transformer enables transforming log events into a different format, making them easier
to process and analyze. You can transform logs from different sources into standardized formats
that contain relevant, source-specific information. Transformations are performed at the time of log ingestion.
Transformers support several types of processors which can be chained into a processing pipeline (subject to some restrictions, see [Usage Limits](#usage-limits)).

### Processor Types

1. **Parser Processors**: Parse string log events into structured log events. These are configurable parsers created using `ParserProcessor`, and support conversion to a format like Json, extracting fields from CSV input, converting vended sources to [OCSF](https://schema.ocsf.io/1.1.0/) format, regex parsing using Grok patterns or key-value parsing. Refer [configurable parsers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-Configurable) for more examples.

2. **Vended Log Parsers**: Parse log events from vended sources into structured log events. These are created using `VendedLogParser`, and support conversion from sources such as AWS WAF, PostGres, Route53, CloudFront and VPC. These parsers are not configurable, meaning these can be added to the pipeline but do not accept any properties or configurations. Refer [vended log parsers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-BuiltIn) for more examples.

3. **String Mutators**: Perform operations on string values in a field of a log event and are created using `StringMutatorProcessor`. These can be used to format string values in the log event such as changing case, removing trailing whitespaces or extracting values from a string field by splitting the string or regex backreferences. Refer [string mutators](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-StringMutate) for more examples.

4. **JSON Mutators**: Perform operation on JSON log events and are created using `JsonMutatorProcessor`. These processors can be used to enrich log events by adding new fields, deleting, moving, renaming fields, copying values to other fields or converting a list of key-value pairs to a map. Refer [JSON mutators](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-JSONMutate) for more examples.

5. **Data Converters**: Convert the data into different formats and are created using `DataConverterProcessor`. These can be used to convert values in a field to datatypes such as integers, string, double and boolean or to convert dates and times to different formats. Refer [datatype processors](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-Datatype) for more examples.

### Usage Limits

- A transformer can have a maximum of 20 processors
- At least one parser-type processor is required
- Maximum of 5 parser-type processors allowed
- AWS vended log parser (if used) must be the first processor
- Only one parseToOcsf processor, one grok processor, one addKeys processor, and one copyValue processor allowed per transformer
- Transformers can only be used with log groups in the Standard log class

Example:

```ts

// Create a log group
const logGroup = new logs.LogGroup(this, 'MyLogGroup');

// Create a JSON parser processor
const jsonParser = new logs.ParserProcessor({
  type: logs.ParserProcessorType.JSON
});

// Create a processor to add keys
const addKeysProcessor = new logs.JsonMutatorProcessor({
  type: logs.JsonMutatorType.ADD_KEYS,
  addKeysOptions: {
    entries: [{
      key: 'metadata.transformed_in',
      value: 'CloudWatchLogs'
    }]
  }
});

// Create a transformer with these processors
new logs.Transformer(this, 'Transformer', {
  transformerName: 'MyTransformer',
  logGroup: logGroup,
  transformerConfig: [jsonParser, addKeysProcessor]
});
```

For more details on CloudWatch Logs transformation processors, refer to the [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html).

### Usage of metric filters on transformed logs

In order to use the transformed logs as search pattern, set the parameter `applyOnTransformedLogs: true` in the MetricFilterProps.

## Notes

Be aware that Log Group ARNs will always have the string `:*` appended to
them, to match the behavior of [the CloudFormation `AWS::Logs::LogGroup`
resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#aws-resource-logs-loggroup-return-values).
