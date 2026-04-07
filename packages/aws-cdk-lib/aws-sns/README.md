# Amazon Simple Notification Service Construct Library

Add an SNS Topic to your stack:

```ts
const topic = new sns.Topic(this, 'Topic', {
  displayName: 'Customer subscription topic',
});
```

Add a FIFO SNS topic with content-based de-duplication to your stack:

```ts
const topic = new sns.Topic(this, 'Topic', {
  contentBasedDeduplication: true,
  displayName: 'Customer subscription topic',
  fifo: true,
});
```

Add an SNS Topic to your stack with a specified signature version, which corresponds
to the hashing algorithm used while creating the signature of the notifications,
subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS.

The default signature version is `1` (`SHA1`).
SNS also supports signature version `2` (`SHA256`).

```ts
const topic = new sns.Topic(this, 'Topic', {
  signatureVersion: '2',
});
```

Note that FIFO topics require a topic name to be provided. The required `.fifo` suffix will be automatically generated and added to the topic name if it is not explicitly provided.

## Data Protection Policy

You can add a data protection policy to your SNS topic to automatically identify and protect sensitive data in messages. The data protection policy scans messages for personally identifiable information (PII) and other sensitive data, then audits findings and optionally redacts the data before delivery to subscribers.

The policy uses both AWS-managed data identifiers (like email addresses, credit card numbers, SSNs) and custom regex-based identifiers to detect sensitive information:

```ts
const topic = new sns.Topic(this, 'MyTopic', {
  dataProtectionPolicy: new sns.DataProtectionPolicy({
    name: 'MyDataProtectionPolicy',
    description: 'Policy to protect sensitive data',
    identifiers: [
      sns.DataIdentifier.CREDIT_CARD_NUMBER,
      sns.DataIdentifier.EMAIL_ADDRESS,
      sns.DataIdentifier.phoneNumber('US'),
      // Add custom data identifiers
      new sns.CustomDataIdentifier('MyCustomDataIdentifier', 'CustomRegex-\\d{3}-\\d{3}-\\d{4}'),
    ],
  }),
});
```

### Available Data Identifiers

The CDK provides access to all AWS managed data identifiers through static properties for common types and factory methods for regional identifiers:

```ts
// Common non-regional identifiers
sns.DataIdentifier.EMAIL_ADDRESS
sns.DataIdentifier.CREDIT_CARD_NUMBER
sns.DataIdentifier.ADDRESS
sns.DataIdentifier.AWS_SECRET_KEY
sns.DataIdentifier.IP_ADDRESS
sns.DataIdentifier.NAME

// Regional identifiers using factory methods
sns.DataIdentifier.driversLicense('US')
sns.DataIdentifier.driversLicense('GB')
sns.DataIdentifier.passportNumber('CA')
sns.DataIdentifier.phoneNumber('DE')
sns.DataIdentifier.bankAccountNumber('FR')
sns.DataIdentifier.socialSecurityNumber('US')
sns.DataIdentifier.taxId('GB')
sns.DataIdentifier.nationalId('DE')

// Any AWS managed identifier using the managed() method
sns.DataIdentifier.managed('NhsNumber-GB')
sns.DataIdentifier.managed('ElectoralRollNumber-GB')
sns.DataIdentifier.managed('MedicareBeneficiaryNumber-US')

// Custom identifiers with regex patterns
new sns.CustomDataIdentifier('EmployeeId', 'EMP-[0-9]{6}')
new sns.CustomDataIdentifier('ProjectCode', 'PROJ-[A-Z]{2}-[0-9]{4}')
```

### Audit Destinations

You can configure audit destinations to receive detailed findings about detected sensitive data. This allows you to monitor and track PII exposure across your SNS topics:

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';

declare const logGroup: logs.LogGroup;
declare const bucket: s3.Bucket;

const topic = new sns.Topic(this, 'MyTopic', {
  dataProtectionPolicy: new sns.DataProtectionPolicy({
    identifiers: [sns.DataIdentifier.CREDIT_CARD_NUMBER],
    logGroupAuditDestination: logGroup,
    s3BucketAuditDestination: bucket,
    deliveryStreamNameAuditDestination: 'my-delivery-stream',
  }),
});
```

### Comprehensive Example

Here's a comprehensive example showing different types of data identifiers:

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';

declare const logGroup: logs.LogGroup;
declare const bucket: s3.Bucket;

const topic = new sns.Topic(this, 'ComprehensiveTopic', {
  dataProtectionPolicy: new sns.DataProtectionPolicy({
    name: 'ComprehensiveDataProtectionPolicy',
    description: 'Policy protecting multiple data types',
    identifiers: [
      // Common non-regional identifiers
      sns.DataIdentifier.EMAIL_ADDRESS,
      sns.DataIdentifier.CREDIT_CARD_NUMBER,
      sns.DataIdentifier.ADDRESS,
      sns.DataIdentifier.AWS_SECRET_KEY,
      
      // Regional identifiers using factory methods
      sns.DataIdentifier.driversLicense('US'),
      sns.DataIdentifier.driversLicense('GB'),
      sns.DataIdentifier.phoneNumber('US'),
      sns.DataIdentifier.phoneNumber('DE'),
      sns.DataIdentifier.bankAccountNumber('FR'),
      sns.DataIdentifier.socialSecurityNumber('US'),
      sns.DataIdentifier.taxId('GB'),
      sns.DataIdentifier.passportNumber('CA'),
      
      // Any AWS managed identifier
      sns.DataIdentifier.managed('NhsNumber-GB'),
      sns.DataIdentifier.managed('ElectoralRollNumber-GB'),
      
      // Custom identifiers
      new sns.CustomDataIdentifier('EmployeeId', 'EMP-[0-9]{6}'),
      new sns.CustomDataIdentifier('ProjectCode', 'PROJ-[A-Z]{2}-[0-9]{4}'),
    ],
    logGroupAuditDestination: logGroup,
    s3BucketAuditDestination: bucket,
  }),
});
```

### Advanced Custom Policies

For advanced use cases, you can implement custom data protection policies by implementing the `IDataProtectionPolicy` interface. This allows you to create complex policies with custom logic:

```ts
class MyCustomDataProtectionPolicy implements sns.IDataProtectionPolicy {
  _bind(scope: Construct): sns.DataProtectionPolicyConfig {
    return {
      name: 'MyCustomPolicy',
      description: 'Custom data protection implementation',
      version: '2021-06-01',
      statement: [
        {
          Sid: 'audit-statement-custom',
          DataIdentifier: ['arn:aws:dataprotection::aws:data-identifier/EmailAddress'],
          DataDirection: 'Inbound',
          Principal: ['*'],
          Operation: {
            Audit: {
              SampleRate: 100,
              FindingsDestination: {},
            },
          },
        },
      ],
      configuration: { CustomDataIdentifier: [] },
    };
  }
}

const topic = new sns.Topic(this, 'MyTopic', {
  dataProtectionPolicy: new MyCustomDataProtectionPolicy(),
});
```

## Subscriptions

Various subscriptions can be added to the topic by calling the
`.addSubscription(...)` method on the topic. It accepts a *subscription* object,
default implementations of which can be found in the
`aws-cdk-lib/aws-sns-subscriptions` package:

Add an HTTPS Subscription to your topic:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.UrlSubscription('https://foobar.com/'));
```

Subscribe a queue to the topic:

```ts
declare const queue: sqs.Queue;
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.addSubscription(new subscriptions.SqsSubscription(queue));
```

Note that subscriptions of queues in different accounts need to be manually confirmed by
reading the initial message from the queue and visiting the link found in it.

 The `topic.grants.subscribe` method adds a policy statement to the topic's resource policy, allowing the specified principal to perform the `sns:Subscribe` action.
 It's useful when you want to allow entities, such as another AWS account or resources created later, to subscribe to the topic at their own pace, separating permission granting from the actual subscription process.

```ts
declare const accountPrincipal: iam.AccountPrincipal;
const myTopic = new sns.Topic(this, 'MyTopic');

myTopic.grants.subscribe(accountPrincipal);
```

### Filter policy

A filter policy can be specified when subscribing an endpoint to a topic.

Example with a Lambda subscription:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const myTopic = new sns.Topic(this, 'MyTopic');
declare const fn: lambda.Function;

// Lambda should receive only message matching the following conditions on attributes:
// color: 'red' or 'orange' or begins with 'bl'
// size: anything but 'small' or 'medium'
// price: between 100 and 200 or greater than 300
// store: attribute must be present
myTopic.addSubscription(new subscriptions.LambdaSubscription(fn, {
  filterPolicy: {
    color: sns.SubscriptionFilter.stringFilter({
      allowlist: ['red', 'orange'],
      matchPrefixes: ['bl'],
      matchSuffixes: ['ue'],
    }),
    size: sns.SubscriptionFilter.stringFilter({
      denylist: ['small', 'medium'],
    }),
    price: sns.SubscriptionFilter.numericFilter({
      between: { start: 100, stop: 200 },
      greaterThan: 300,
    }),
    store: sns.SubscriptionFilter.existsFilter(),
  },
}));
```

#### Payload-based filtering

To filter messages based on the payload or body of the message, use the `filterPolicyWithMessageBody` property. This type of filter policy supports creating filters on nested objects.

Example with a Lambda subscription:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const myTopic = new sns.Topic(this, 'MyTopic');
declare const fn: lambda.Function;

// Lambda should receive only message matching the following conditions on message body:
// color: 'red' or 'orange'
// store: property must not be present
myTopic.addSubscription(new subscriptions.LambdaSubscription(fn, {
  filterPolicyWithMessageBody: {
    background: sns.FilterOrPolicy.policy({
      color: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
        allowlist: ['red', 'orange'],
      })),
    }),
    store: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.notExistsFilter()),
  },
}));
```

### Example of Firehose Subscription

```ts
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

const topic = new sns.Topic(this, 'Topic');
declare const stream: firehose.DeliveryStream;

new sns.Subscription(this, 'Subscription', {
  topic,
  endpoint: stream.deliveryStreamArn,
  protocol: sns.SubscriptionProtocol.FIREHOSE,
  subscriptionRoleArn: "SAMPLE_ARN", //role with permissions to send messages to a firehose delivery stream
});
```

## DLQ setup for SNS Subscription

CDK can attach provided Queue as DLQ for your SNS subscription.
See the [SNS DLQ configuration docs](https://docs.aws.amazon.com/sns/latest/dg/sns-configure-dead-letter-queue.html) for more information about this feature.

Example of usage with user provided DLQ.

```ts
const topic = new sns.Topic(this, 'Topic');
const dlQueue = new sqs.Queue(this, 'DeadLetterQueue', {
  queueName: 'MySubscription_DLQ',
  retentionPeriod: Duration.days(14),
});

new sns.Subscription(this, 'Subscription', {
  endpoint: 'endpoint',
  protocol: sns.SubscriptionProtocol.LAMBDA,
  topic,
  deadLetterQueue: dlQueue,
});
```

## CloudWatch Event Rule Target

SNS topics can be used as targets for CloudWatch event rules.

Use the `aws-cdk-lib/aws-events-targets.SnsTopic`:

```ts
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const repo: codecommit.Repository;
const myTopic = new sns.Topic(this, 'Topic');

repo.onCommit('OnCommit', {
  target: new targets.SnsTopic(myTopic),
});
```

This will result in adding a target to the event rule and will also modify the
topic resource policy to allow CloudWatch events to publish to the topic.

## Topic Policy

A topic policy is automatically created when `addToResourcePolicy` is called, if
one doesn't already exist. Using `addToResourcePolicy` is the simplest way to
add policies, but a `TopicPolicy` can also be created manually.

```ts
const topic = new sns.Topic(this, 'Topic');
const topicPolicy = new sns.TopicPolicy(this, 'TopicPolicy', {
  topics: [topic],
});

topicPolicy.document.addStatements(new iam.PolicyStatement({
  actions: ["sns:Subscribe"],
  principals: [new iam.AnyPrincipal()],
  resources: [topic.topicArn],
}));
```

A policy document can also be passed on `TopicPolicy` construction

```ts
const topic = new sns.Topic(this, 'Topic');
const policyDocument = new iam.PolicyDocument({
  assignSids: true,
  statements: [
    new iam.PolicyStatement({
      actions: ["sns:Subscribe"],
      principals: [new iam.AnyPrincipal()],
      resources: [topic.topicArn],
    }),
  ],
});

const topicPolicy = new sns.TopicPolicy(this, 'Policy', {
  topics: [topic],
  policyDocument,
});
```

A simpler and more general way of achieving the same result is to use the
`TopicGrants` class:

```ts 
const topic = new sns.Topic(this, 'Topic');

// This would work the same way if topic was a CfnTopic (L1)
sns.TopicGrants.fromTopic(topic).subscribe(new iam.AnyPrincipal()); 
```

For convenience, if you are using an L2, you can also call `grants` on the topic: 

```ts 
const topic = new sns.Topic(this, 'Topic'); 
topic.grants.subscribe(new iam.AnyPrincipal());
```

### Enforce encryption of data in transit when publishing to a topic

You can enforce SSL when creating a topic policy by setting the `enforceSSL` flag:

```ts
const topic = new sns.Topic(this, 'Topic');
const policyDocument = new iam.PolicyDocument({
  assignSids: true,
  statements: [
    new iam.PolicyStatement({
      actions: ["sns:Publish"],
      principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
      resources: [topic.topicArn],
    }),
  ],
});

const topicPolicy = new sns.TopicPolicy(this, 'Policy', {
  topics: [topic],
  policyDocument,
  enforceSSL: true,
});
```

Similiarly you can enforce SSL by setting the `enforceSSL` flag on the topic:

```ts
const topic = new sns.Topic(this, 'TopicAddPolicy', {
  enforceSSL: true,
});

topic.addToResourcePolicy(new iam.PolicyStatement({
  principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
  actions: ['sns:Publish'],
  resources: [topic.topicArn],
}));
```

## Delivery status logging

Amazon SNS provides support to log the delivery status of notification messages sent to topics with the following Amazon SNS endpoints:

- HTTP
- Amazon Data Firehose
- AWS Lambda
- Platform application endpoint
- Amazon Simple Queue Service

Example with a delivery status logging configuration for SQS:

```ts
declare const role: iam.Role;
const topic = new sns.Topic(this, 'MyTopic', {
  loggingConfigs: [
    {
      protocol: sns.LoggingProtocol.SQS,
      failureFeedbackRole: role,
      successFeedbackRole: role,
      successFeedbackSampleRate: 50,
    },
  ],
});
```

A delivery status logging configuration can also be added to your topic by `addLoggingConfig` method:

```ts
declare const role: iam.Role;
const topic = new sns.Topic(this, 'MyTopic');

topic.addLoggingConfig({
  protocol: sns.LoggingProtocol.SQS,
  failureFeedbackRole: role,
  successFeedbackRole: role,
  successFeedbackSampleRate: 50,
});
```

Note that valid values for `successFeedbackSampleRate` are integer between 0-100.

## Archive Policy

Message archiving provides the ability to archive a single copy of all messages published to your topic.
You can store published messages within your topic by enabling the message archive policy on the topic, which enables message archiving for all subscriptions linked to that topic.
Messages can be archived for a minimum of one day to a maximum of 365 days.

Example with an archive policy:

```ts
const topic = new sns.Topic(this, 'MyTopic', {
  fifo: true,
  messageRetentionPeriodInDays: 7,
});
```

**Note**: The `messageRetentionPeriodInDays` property is only available for FIFO topics.

## TracingConfig

Tracing mode of an Amazon SNS topic.

If PassThrough, the topic passes trace headers received from the Amazon SNS publisher to its subscription.
If set to Active, Amazon SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true.

The default TracingConfig is `TracingConfig.PASS_THROUGH`.

Example with a tracingConfig set to Active:

```ts
const topic = new sns.Topic(this, 'MyTopic', {
  tracingConfig: sns.TracingConfig.ACTIVE,
});
```

## High-throughput mode for Amazon SNS FIFO Topics

High throughput FIFO topics in Amazon SNS efficiently manage high message throughput while maintaining strict message order, ensuring reliability and scalability for applications processing numerous messages.
This solution is ideal for scenarios demanding both high throughput and ordered message delivery.

To improve message throughput using high throughput FIFO topics, increasing the number of message groups is recommended.

For more information, see [High throughput FIFO topics in Amazon SNS](https://docs.aws.amazon.com/sns/latest/dg/fifo-high-throughput.html).

You can configure high-throughput mode for your FIFO topics by setting the `fifoThroughputScope` property:

```ts
const topic = new sns.Topic(this, 'MyTopic', {
  fifo: true,
  fifoThroughputScope: sns.FifoThroughputScope.TOPIC,
});
```

**Note**: The `fifoThroughputScope` property is only available for FIFO topics.
