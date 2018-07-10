## AWS CloudWatch Logs Construct Library

This library supplies Constructs for working with CloudWatch Logs.

### Log Groups/Streams

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
any amount of days, or `Infinity` to keep the data in the log group forever.

[retention example](test/example.retention.lit.ts)

### Subscriptions and Destinations

Log events matching a particular filter can be sent to either a Lambda function
or a Kinesis stream.

* If the Kinesis stream lives in a different account, you have to also create a
  `Destination` object in the current account which will act as a proxy for the
  remote Kinesis stream.
* If the filter destination is either a Lambda or a Kinesis stream in the
  current account, they can be subscribed directly.

Create a `SubscriptionFilter`, initialize it with an appropriate `Pattern` (see
below) and supply the intended destination:

```ts
const lambda = new Lambda(this, 'Lambda', { ... });
const logGroup = new LogGroup(this, 'LogGroup', { ... });

new SubscriptionFilter(this, 'Subscription', {
    logGroup,
    destination: lambda,
    logPattern: LogPattern.allTerms("ERROR", "MainThread")
});
```

### Metric Filters

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

### Patterns

Patterns describe which log events match a subscription or metric filter. There
are three types of patterns:

* Text patterns
* JSON patterns
* Space-delimited table patterns

All patterns are constructed by using static functions on the `LogPattern`
class.

In addition to the patterns above, the following special patterns exist:

* `LogPattern.allEvents()`: matches all log events.
* `LogPattern.literal(string)`: if you already know what pattern expression to
  use, this function takes a string and will use that as the log pattern. For
  more information, see the [Filter and Pattern
  Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html).

#### Text Patterns

Text patterns match if the literal strings appear in the text form of the log
line.

* `LogPattern.allTerms(term, term, ...)`: matches if all of the given terms
  (substrings) appear in the log event.
* `LogPattern.anyGroup([term, term, ...], [term, term, ...], ...)`: matches if
  all of the terms in any of the groups (specified as arrays) matches. This is
  an OR match.


Examples:

```ts
const pattern1 = LogPattern.allTerms('ERROR', 'MainThread');

const pattern2 = LogPattern.anyGroup(
    ['ERROR', 'MainThread'],
    ['WARN', 'Deadlock'],
    );
```

### JSON Patterns

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

* `LogPattern.stringValue(field, comparison, string)`: matches if the given
  field compares as indicated with the given string value.
* `LogPattern.numberValue(field, comparison, number)`: matches if the given
  field compares as indicated with the given numerical value.
* `LogPattern.isNull(field)`: matches if the given field exists and has the
  value `null`.
* `LogPattern.notExists(field)`: matches if the given field is not in the JSON
  structure.
* `LogPattern.exists(field)`: matches if the given field is in the JSON
  structure.
* `LogPattern.booleanValue(field, boolean)`: matches if the given field
  is exactly the given boolean value.
* `LogPattern.all(jsonPattern, jsonPattern, ...)`: matches if all of the
  given JSON patterns match. This makes an AND combination of the given
  patterns.
* `LogPattern.any(jsonPattern, jsonPattern, ...)`: matches if any of the
  given JSON patterns match. This makes an OR combination of the given
  patterns.


Example:

```ts
const pattern = LogPattern.all(
    LogPattern.stringValue('$.component', '=', 'HttpServer'),
    LogPattern.any(
        LogPattern.booleanValue('$.error', true),
        LogPattern.numberValue('$.latency', '>', 1000)
    ));
```

### Space-delimited table patterns

If the log events are rows of a space-delimited table, this pattern can be used
to identify the columns in that structure and add conditions on any of them. The
canonical example where you would apply this type of pattern is Apache server
logs.

Text that is surrounded by `"..."` quotes or `[...]` square brackets will
be treated as one column.

* `LogPattern.spaceDelimited(column, column, ...)`: construct a
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
const pattern = LogPattern.spaceDelimited('time', 'component', '...', 'result_code', 'latency')
    .whereString('component', '=', 'HttpServer')
    .whereNumber('result_code', '!=', 200);
```
