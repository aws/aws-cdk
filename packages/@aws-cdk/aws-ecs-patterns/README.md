# CDK Construct library for higher-level ECS Constructs

This library provides higher-level ECS constructs which follow common architectural patterns. It contains:

* Scheduled Tasks (cron jobs)

## Scheduled Tasks

To define a task that runs periodically, instantiate an `ScheduledEc2Task`:


```ts
// Instantiate an Amazon EC2 Task to run at a scheduled interval
const ecsScheduledTask = new ScheduledEc2Task(this, 'ScheduledTask', {
  cluster,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  scheduleExpression: 'rate(1 minute)',
  environment: [{ name: 'TRIGGER', value: 'CloudWatch Events' }],
  memoryLimitMiB: 256
});
```
