# AWS::CE Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Cost Explorer is a tool that enables you to view and analyze your costs and usage. You
can explore your usage and costs using the main graph, the Cost Explorer cost and usage
reports, or the Cost Explorer RI reports. You can view data for up to the last 13 months,
forecast how much you're likely to spend for the next 12 months, and get recommendations for
what Reserved Instances to purchase. You can use Cost Explorer to identify areas that need
further inquiry and see trends that you can use to understand your costs.

## Cost Anomaly Detection

AWS Cost Anomaly Detection is an AWS Cost Management feature. This feature uses machine learning models to detect and alert on anomalous spend patterns in your deployed AWS services.

To create your cost monitors and alert subscriptions, use the `AnomalyMonitor`
and `AnomalySubscription` constructs:

```ts
declare const myTopic: sns.Topic;

// This monitor evaluates all the AWS services that are used by your
// individual AWS account for anomalies.
const servicesMonitor = new ce.AnomalyMonitor(this, 'AwsServicesMonitor', {
  type: ce.MonitorType.awsServices(),
});

// This monitor evaluates the spend for specific values of a cost allocation tag
const tagsMonitor = new ce.AnomalyMonitor(this, 'TagsMonitor', {
  type: ce.MonitorType.costAllocationTag('key', ['value1', 'value2']),
});

// Receive alerts on a SNS topic when the spend is 100 USD above the expected spend
new ce.AnomalySubscription(this, 'Subscription', {
  anomalyMonitors: [servicesMonitor, tagsMonitor],
  subscriber: ce.AnomalySubscriber.sns(myTopic),
  thresholdExpression: ce.ThresholdExpression.aboveUsdAmount(100),
})
```
