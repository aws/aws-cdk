# Amazon Simple Email Service Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Email receiving

Create a receipt rule set with rules and actions (actions can be found in the
`@aws-cdk/aws-ses-actions` package):

```ts
import * as s3 from '@aws-cdk/aws-s3';
import * as actions from '@aws-cdk/aws-ses-actions';

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
import * as actions from '@aws-cdk/aws-ses-actions';

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
Amazon SES users. For an additional monthly charge, you can lease dedicated IP addresses that are reserved
for your exclusive use:

```ts
new ses.DedicatedIpPool(this, 'Pool');
```

### Configuration sets

Configuration sets are groups of rules that you can apply to your verified identities. A verified identity is
a domain, subdomain, or email address you use to send email through Amazon SES When you apply a configuration
set to an email, all of the rules in that configuration set are applied to the email:

```ts
declare const myPool: ses.IDedicatedIpPool;

new ConfigurationSet(this, 'ConfigurationSet', {
  customTrackingRedirectDomain: 'track.cdk.dev',
  suppressionReasons: SuppressionReasons.COMPLAINTS_ONLY,
  tlsPolicy: ConfigurationSetTlsPolicy.REQUIRE,
  dedicatedIpPool: myPool,
});
```

### Email identity

In Amazon SES, a verified identity is a domain or email address that you use to send or receive email. Before you
can send an email using Amazon SES, you must create and verify each identity that you're going to use as a "From",
"Source", "Sender", or "Return-Path" address. Verifying an identity with Amazon SES confirms that you own it and
helps prevent unauthorized use.

```ts
declare const myConfigurationSet: ses.IConfigurationSet;

new EmailIdentity(stack, 'Identity', {
  identity: 'cdk.dev',
  configurationSet: myConfigurationSet,
  mailFromDomain: 'mail.cdk.dev',
});
```
