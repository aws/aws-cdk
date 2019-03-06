## The CDK Construct Library for AWS Simple Email Service
This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Email receiving
Create a receipt rule set with rules and actions:
```ts
const bucket = new s3.Bucket(this, 'Bucket');

const topic = new sns.Topic(this, 'Topic');

const ruleSet = new ses.ReceiptRuleSet(this, 'RuleSet', {
  rules: [
    {
      actions: [
        new ses.ReceiptRuleAddHeaderAction({
          name: 'X-Special-Header',
          value: 'aws'
        })
        new ses.ReceiptRuleS3Action({
          bucket,
          objectKeyPrefix: 'emails/',
          topic
        })
      ],
      recipients: ['hello@aws.com'],
    },
    {
      actions: [
        new ses.ReceiptRuleSnsAction({
          topic
        })
      ]
      recipients: ['aws.com'],
    }
  ]
});
```

Alternatively, rules can be added to a rule set:
```ts
const ruleSet = new ses.ReceiptRuleSet(this, 'RuleSet'):

const awsRule = ruleSet.addRule('Aws', {
  recipients: ['aws.com']
});
```

And actions to rules:
```ts
awsRule.addAction(
  new ses.ReceiptRuleSnsAction({
    topic
  });
);
```
When using `addRule`, the new rule is added after the last added rule unless `after` is specified.

[More actions](test/integ.receipt.ts)

#### Drop spams
A rule to drop spam can be added by setting `dropSpam` to `true`:

```ts
new ses.ReceiptRuleSet(this, 'RuleSet', {
  dropSpam: true
});
```

This will add a rule at the top of the rule set with a Lambda action that stops processing messages that have at least one spam indicator. See [Lambda Function Examples](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda-example-functions.html).

### Import and export receipt rule set and receipt rules
Receipt rule sets and receipt rules can be exported:

```ts
const ruleSet = new ReceiptRuleSet(this, 'RuleSet');
const rule = ruleSet.addRule(this, 'Rule', {
  recipients: ['hello@mydomain.com']
});

const ruleSetRef = ruleSet.export();
const ruleRef = rule.export();
```

And imported:
```ts
const importedRuleSet = ses.ReceiptRuleSet.import(this, 'ImportedRuleSet', ruleSetRef);

const importedRule = ses.ReceiptRule.import(this, 'ImportedRule', ruleRef);

const otherRule = ses.ReceiptRule.import(this, 'OtherRule', {
  name: 'other-rule'
});

importedRuleSet.addRule('New', { // This rule as added after the imported rule
  after: importedRule,
  recipients: ['mydomain.com']
});

importedRuleSet.addRule('Extra', { // Added after the 'New' rule
  recipients: ['extra.com']
});
```

### Receipt filter
Create a receipt filter:
```ts
new ses.ReceiptFilter(this, 'Filter', {
  ip: '1.2.3.4/16' // Will be blocked
})
```

Without props, a block all (0.0.0.0/0) filter is created.

A white list filter is also available:
```ts
new ses.WhiteListReceiptFilter(this, 'WhiteList', {
  ips: [
    '10.0.0.0/16',
    '1.2.3.4/16',
  ]
});
```
This will first create a block all filter and then create allow filters for the listed ip addresses.
