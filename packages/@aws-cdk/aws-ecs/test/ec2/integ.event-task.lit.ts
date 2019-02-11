import ec2 = require('@aws-cdk/aws-ec2');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.VpcNetwork(this, 'Vpc', { maxAZs: 1 });

    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro')
    });

    /// !show
    // Create a Task Definition for the container to start
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('TheContainer', {
      image: ecs.ContainerImage.fromAsset(this, 'EventImage', { directory: 'eventhandler-image' }),
      memoryLimitMiB: 256,
      logging: new ecs.AwsLogDriver(this, 'TaskLogging', { streamPrefix: 'EventDemo' })
    });

    // An EventRule that describes the event trigger (in this case a scheduled run)
    const rule = new events.EventRule(this, 'Rule', {
      scheduleExpression: 'rate(1 minute)',
    });

    // Use Ec2TaskEventRuleTarget as the target of the EventRule
    const target = new ecs.Ec2EventRuleTarget(this, 'EventTarget', {
      cluster,
      taskDefinition,
      taskCount: 1
    });

    // Pass an environment variable to the container 'TheContainer' in the task
    rule.addTarget(target, {
      jsonTemplate: JSON.stringify({
        containerOverrides: [{
          name: 'TheContainer',
          environment: [{ name: 'I_WAS_TRIGGERED', value: 'From CloudWatch Events' }]
        }]
      })
    });
    /// !hide
  }
}

new EventStack(app, 'aws-ecs-integ-ecs');
app.run();
