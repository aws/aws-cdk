import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ecs from '../../lib';

const app = new cdk.App();

class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 256,
    });

    new ecs.Ec2Service(this, 'Test_Stack', {
      cluster,
      taskDefinition,
      placementStrategies: [
        ecs.PlacementStrategy.packedByCpu(),
        ecs.PlacementStrategy.packedByMemory(),
      ],
    });
  }
}

new EcsStack(app, 'aws-cdk-ecs-integration-test-stack');

app.synth();
