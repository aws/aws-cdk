# CloudWatch Alarm Actions library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This library contains a set of classes which can be used as CloudWatch Alarm actions.

The currently implemented actions are: EC2 Actions, SNS Actions, Autoscaling Actions and Aplication Autoscaling Actions


## EC2 Action Example

```ts
import * as cw from "@aws-cdk/aws-cloudwatch";
// Alarm must be configured with an EC2 per-instance metric
let alarm: cw.Alarm;
// Attach a reboot when alarm triggers
alarm.addAlarmAction(
  new Ec2Action(Ec2InstanceActions.REBOOT)
);
```

See `@aws-cdk/aws-cloudwatch` for more information.
