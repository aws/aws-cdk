# CloudWatch Alarm Actions library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This library contains a set of classes which can be used as CloudWatch Alarm actions.

The currently implemented actions are: EC2 Actions, SNS Actions, SSM OpsCenter Actions, Autoscaling Actions and Application Autoscaling Actions


## EC2 Action Example

```ts
// Alarm must be configured with an EC2 per-instance metric
declare const alarm: cloudwatch.Alarm;
// Attach a reboot when alarm triggers
alarm.addAlarmAction(
  new actions.Ec2Action(actions.Ec2InstanceAction.REBOOT),
);
```

## SSM OpsCenter Action Example

```ts
declare const alarm: cloudwatch.Alarm;
// Create an OpsItem with specific severity and category when alarm triggers
alarm.addAlarmAction(
  new actions.SsmAction(
    actions.OpsItemSeverity.CRITICAL,
    actions.OpsItemCategory.PERFORMANCE // category is optional
  )
);
```

See `@aws-cdk/aws-cloudwatch` for more information.
