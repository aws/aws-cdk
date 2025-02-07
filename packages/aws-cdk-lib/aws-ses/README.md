# Amazon Simple Email Service Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Email receiving

Create a receipt rule set with rules and actions (actions can be found in the
`aws-cdk-lib/aws-ses-actions` package):

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as actions from 'aws-cdk-lib/aws-ses-actions';

const bucket = new s3.Bucket(this, 'Bucket');
const topic = new sns.Topic(this, 'Topic');

new ses.ReceiptRuleSet(this, 'RuleSet', {
  rules: [
    {
      recipients: ['hello@aws.com'],
      actions: [
        new actions.AddHeader({
          name: 'X-Special-Header',
          value: 'aws',
        }),
        new actions.S3({
          bucket,
          objectKeyPrefix: 'emails/',
          topic,
        }),
      ],
    },
    {
      recipients: ['aws.com'],
      actions: [
        new actions.Sns({
          topic,
        }),
      ],
    },
  ],
});
```

Alternatively, rules can be added to a rule set:

```ts
const ruleSet = new ses.ReceiptRuleSet(this, 'RuleSet');

const awsRule = ruleSet.addRule('Aws', {
  recipients: ['aws.com'],
});
```

And actions to rules:

```ts
import * as actions from 'aws-cdk-lib/aws-ses-actions';

declare const awsRule: ses.ReceiptRule;
declare const topic: sns.Topic;
awsRule.addAction(new actions.Sns({
  topic,
}));
```

When using `addRule`, the new rule is added after the last added rule unless `after` is specified.

### Drop spams

A rule to drop spam can be added by setting `dropSpam` to `true`:

```ts
new ses.ReceiptRuleSet(this, 'RuleSet', {
  dropSpam: true,
});
```

This will add a rule at the top of the rule set with a Lambda action that stops processing messages that have at least one spam indicator. See [Lambda Function Examples](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda-example-functions.html).


### Receipt filter

Create a receipt filter:

```ts
new ses.ReceiptFilter(this, 'Filter', {
  ip: '1.2.3.4/16', // Will be blocked
});
```

An allow list filter is also available:

```ts
new ses.AllowListReceiptFilter(this, 'AllowList', {
  ips: [
    '10.0.0.0/16',
    '1.2.3.4/16',
  ],
});
```

This will first create a block all filter and then create allow filters for the listed ip addresses.

## Email sending

### Dedicated IP pools

When you create a new Amazon SES account, your emails are sent from IP addresses that are shared with other
Amazon SES users. For [an additional monthly charge](https://aws.amazon.com/ses/pricing/), you can lease
dedicated IP addresses that are reserved for your exclusive use.

Use the DedicatedIpPool construct to create a pool of dedicated IP addresses. When specifying a name for your dedicated IP pool, ensure that it adheres to the following naming convention:

- The name must include only lowercase letters (a-z), numbers (0-9), underscores (_), and hyphens (-).
- The name must not exceed 64 characters in length.

```ts
new ses.DedicatedIpPool(this, 'Pool', {
  dedicatedIpPoolName: 'mypool',
  scalingMode: ses.ScalingMode.STANDARD,
});
```

The pool can then be used in a configuration set. If the provided dedicatedIpPoolName does not follow the specified naming convention, an error will be thrown.

### Configuration sets

Configuration sets are groups of rules that you can apply to your verified identities. A verified identity is
a domain, subdomain, or email address you use to send email through Amazon SES. When you apply a configuration
set to an email, all of the rules in that configuration set are applied to the email.

Use the `ConfigurationSet` construct to create a configuration set:

```ts
import { Duration } from 'aws-cdk-lib';

declare const myPool: ses.IDedicatedIpPool;

new ses.ConfigurationSet(this, 'ConfigurationSet', {
  customTrackingRedirectDomain: 'track.cdk.dev',
  tlsPolicy: ses.ConfigurationSetTlsPolicy.REQUIRE,
  dedicatedIpPool: myPool,
  // Specify maximum delivery time
  // This configuration can be useful in such cases as time-sensitive emails (like those containing a one-time-password),
  // transactional emails, and email that you want to ensure isn't delivered during non-business hours.
  maxDeliveryDuration: Duration.minutes(10),
});
```

Use `addEventDestination()` to publish email sending events to Amazon SNS or Amazon CloudWatch:

```ts
declare const myConfigurationSet: ses.ConfigurationSet;
declare const myTopic: sns.Topic;

myConfigurationSet.addEventDestination('ToSns', {
  destination: ses.EventDestination.snsTopic(myTopic),
})
```

### Override account-level suppression list settings

You can customize account-level suppression list separately for different configuration sets by overriding it
with configuration set-level suppression.

For details, see [Using configuration set-level suppression to override your account-level suppression list](https://docs.aws.amazon.com/ses/latest/dg/sending-email-suppression-list-config-level.html).

By default, the configuration set uses your account-level suppression list settings.

You can disable account-level suppression list by specifying `disableSuppressionList` to true. Email sent with this configuration set will not use any suppression settings at all.

``` ts
new ses.ConfigurationSet(this, 'ConfigurationSet', {
  disableSuppressionList: true,
});
```

You can also override account level settings with configuration set-level suppression enabled. Email sent with this configuration set will only use the suppression conditions you enabled for it (bounces, complaints, or bounces and complaints) - regardless of what your account-level suppression list settings are, it will override them.

``` ts
// Only bounces will be suppressed.
new ses.ConfigurationSet(this, 'ConfigurationSet', {
  suppressionReasons: ses.SuppressionReasons.BOUNCES_ONLY,
});

// Only complaints will be suppressed.
new ses.ConfigurationSet(this, 'ConfigurationSet', {
  suppressionReasons: ses.SuppressionReasons.COMPLAINTS_ONLY,
});

// Both bounces and complaints will be suppressed.
new ses.ConfigurationSet(this, 'ConfigurationSet', {
  suppressionReasons: ses.SuppressionReasons.BOUNCES_AND_COMPLAINTS,
});
```

### Email identity

In Amazon SES, a verified identity is a domain or email address that you use to send or receive email. Before you
can send an email using Amazon SES, you must create and verify each identity that you're going to use as a `From`,
`Source`, `Sender`, or `Return-Path` address. Verifying an identity with Amazon SES confirms that you own it and
helps prevent unauthorized use.

To verify an identity for a hosted zone, you create an `EmailIdentity`:

```ts
declare const myHostedZone: route53.IPublicHostedZone;

const identity = new ses.EmailIdentity(this, 'Identity', {
  identity: ses.Identity.publicHostedZone(myHostedZone),
  mailFromDomain: 'mail.cdk.dev',
});
```

By default, [Easy DKIM](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-easy.html) with
a 2048-bit DKIM key is used.

You can instead configure DKIM authentication by using your own public-private key pair. This process is known
as [Bring Your Own DKIM (BYODKIM)](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-bring-your-own.html):

```ts
declare const myHostedZone: route53.IPublicHostedZone;

new ses.EmailIdentity(this, 'Identity', {
  identity: ses.Identity.publicHostedZone(myHostedZone),
  dkimIdentity: ses.DkimIdentity.byoDkim({
    privateKey: SecretValue.secretsManager('dkim-private-key'),
    publicKey: '...base64-encoded-public-key...',
    selector: 'selector',
  }),
});
```

When using `publicHostedZone()` for the identity, all necessary Amazon Route 53 records are created automatically:

* CNAME records for Easy DKIM
* TXT record for BYOD DKIM
* MX and TXT records for the custom MAIL FROM

When working with `domain()`, records must be created manually:

```ts
const identity = new ses.EmailIdentity(this, 'Identity', {
  identity: ses.Identity.domain('cdk.dev'),
});

for (const record of identity.dkimRecords) {
  // create CNAME records using `record.name` and `record.value`
}
```

#### Grants

To grant a specific action to a principal use the `grant` method.
For sending emails, `grantSendEmail` can be used instead:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
declare const user: iam.User;

const identity = new ses.EmailIdentity(this, 'Identity', {
  identity: ses.Identity.domain('cdk.dev'),
});

identity.grantSendEmail(user);
```

### Virtual Deliverability Manager (VDM)

Virtual Deliverability Manager is an Amazon SES feature that helps you enhance email deliverability,
like increasing inbox deliverability and email conversions, by providing insights into your sending
and delivery data, and giving advice on how to fix the issues that are negatively affecting your
delivery success rate and reputation.

Use the `VdmAttributes` construct to configure the Virtual Deliverability Manager for your account:

```ts
// Enables engagement tracking and optimized shared delivery by default
new ses.VdmAttributes(this, 'Vdm');
```

If you want to override the VDM settings in the specified configuration set, use `vdmOptions` in the `ConfigurationSet` construct.

> **Note:** The configuration set level settings need to be used together with the account level settings. (To set the account level settings using CDK, use the `VdmAttributes` Construct.)
If you enable only the configuration set level settings, VDM will not be enabled until the account level settings are configured.
For more information, see [Virtual Deliverability Manager settings](https://docs.aws.amazon.com/ses/latest/dg/vdm-settings.html).

```ts
new ses.ConfigurationSet(this, 'ConfigurationSetWithVdmOptions', {
  vdmOptions: {
    engagementMetrics: true,
    optimizedSharedDelivery: true,
  },
});
```
