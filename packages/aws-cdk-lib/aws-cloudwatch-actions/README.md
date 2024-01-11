# CloudWatch Alarm Actions library


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

## SSM Incident Manager Action Example

```ts
declare const alarm: cloudwatch.Alarm;
// Create an Incident Manager incident based on a specific response plan
alarm.addAlarmAction(
  new actions.SsmIncidentAction('ResponsePlanName')
);
```

## Lambda Action Example

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda'
declare const alarm: cloudwatch.Alarm;
declare const fn: lambda.Function;
declare const alias: lambda.Alias;
declare const version: lambda.Version;

// Attach a Lambda Function when alarm triggers
alarm.addAlarmAction(
  new actions.LambdaAction(fn)
);

// Attach a Lambda Function Alias when alarm triggers
alarm.addAlarmAction(
  new actions.LambdaAction(alias)
);

// Attach a Lambda Function version when alarm triggers
alarm.addAlarmAction(
  new actions.LambdaAction(version)
);

```

See `aws-cdk-lib/aws-cloudwatch` for more information.
