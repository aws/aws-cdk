import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/core');
import targets = require('../../lib');

import path = require('path');

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });

    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });

    /// !show
    // Create a Task Definition for the container to start
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('TheContainer', {
      image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' })
    });

    // A rule that describes the event trigger (in this case a scheduled run)
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // Use EcsTask as the target of the Rule
    rule.addTarget(new targets.EcsTask({
      cluster,
      taskDefinition,
      taskCount: 1,
      containerOverrides: [{
        containerName: 'TheContainer',
        environment: [
          { name: 'I_WAS_TRIGGERED', value: 'From CloudWatch Events' }
        ]
      }]
    }));
    /// !hide
  }
}

new EventStack(app, 'aws-ecs-integ-fargate');
app.synth();
