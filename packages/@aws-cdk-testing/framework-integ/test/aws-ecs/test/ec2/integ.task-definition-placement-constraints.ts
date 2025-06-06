import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-ecs-integration-test-stack');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

taskDefinition.addPlacementConstraint(ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

new ecs.Ec2Service(stack, 'Ec2Service', {
  cluster,
  taskDefinition,
});

new IntegTest(stack, 'TaskDefinitionPlacementConstraints', {
  testCases: [stack],
});

app.synth();
