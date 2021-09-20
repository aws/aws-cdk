# AWS::CE Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Cost Explorer helps you visualize, understand, and manage your AWS costs and usage over a daily
or monthly granularity. The solution also lets you dive deeper using granular filtering and grouping
dimensions such as Usage Type and Tags. You can also access your data with further granularity by
enabling hourly and resource level granularity.

## Anomaly monitor and subscriptions

AWS Cost Anomaly Detection leverages advanced Machine Learning technologies to identify anomalous
spend and root causes, so you can quickly take action. 

```ts
// A default monitor that alerts based on abnormal service usage, for example an unexplained
// increase in EC2 costs.
const defaultMonitor = new ce.AnomalyMonitor(this, 'anomaly-monitor', {});

new ce.AnomalySubscription(this, 'subscription', {
  frequency: ce.Frequency.IMMEDIATE,
  monitors: [defaultMonitor],
  subscribers: [
    new ce.SnsTopic(new sns.Topic(this, 'Topic')),
  ],
  // Trigger a notification the size of the anomality exceeds $100.
  threshold: 100,
});
```

## Cost categories

AWS Cost Categories enable you to group cost and usage information into meaningful categories based on the rules defined
by you using various dimensions such as account, tag, service, charge type, and even other cost categories. 

```ts
const costCategory = new ce.CostCategory(this, 'cost-category', {
  rules: JSON.stringify([{
    Type: 'REGULAR',
    Value: 'ServiceIsAmazonEC2',
    // DefaultValue: 'ThisIsNotSupportedViaCloudFormation',
    Rule: {
      Dimensions: {
        Key: 'SERVICE_CODE',
        Values: ['AmazonEC2'],
        MatchOptions: ['EQUALS'],
      },
    },
  }]),
});
```
