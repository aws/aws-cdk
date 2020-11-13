import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';


const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });

    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    /// !show
    // Create a Task Definition for the container to start
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('TheContainer', {
      image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
      memoryLimitMiB: 256,
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
    });

    // An Rule that describes the event trigger (in this case a scheduled run)
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
          { name: 'I_WAS_TRIGGERED', value: 'From CloudWatch Events' },
        ],
      }],
    }));
    /// !hide
  }
}

new EventStack(app, 'aws-ecs-integ-ecs');
app.synth();
