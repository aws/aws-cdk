import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ecs from '../../lib';


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
const app = new cdk.App();

const ecsStack = new EcsStack(app, 'aws-cdk-ecs-integration-test-stack');

const testCase = new IntegTest(app, 'PlacementStrategies', {
  testCases: [ecsStack],
});

const template = testCase.assertions.awsApiCall('Cloudformation', 'getTemplate', {
  StackName: ecsStack.stackName,
});

template.expect(ExpectedResult.stringLikeRegexp('/PlacementStrategies:\s*- Field: CPU\s*Type: binpack\s*- Field: MEMORY\s*Type: binpack/'));
app.synth();