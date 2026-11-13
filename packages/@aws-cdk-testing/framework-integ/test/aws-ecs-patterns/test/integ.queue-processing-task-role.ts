import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'QueueTaskRole');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 0 });
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  capacity: {
    instanceType: new ec2.InstanceType('t3.micro'),
    minCapacity: 0,
    maxCapacity: 1,
    desiredCapacity: 0,
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  },
});
const taskRole = new iam.Role(stack, 'WorkerRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
const props = {
  cluster,
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/busybox:1.36'),
  command: ['sh', '-c', 'sleep 3600'],
  memoryLimitMiB: 512,
  minScalingCapacity: 0,
  taskRole,
};
const fargate = new patterns.QueueProcessingFargateService(stack, 'Fargate', props);
const ec2Service = new patterns.QueueProcessingEc2Service(stack, 'Ec2', props);
const test = new IntegTest(app, 'QueueTaskRoleTest', { testCases: [stack] });
for (const service of [fargate, ec2Service]) {
  // Validate registered task definitions without starting workers or requiring EC2 capacity.
  (service.service.node.defaultChild as ecs.CfnService).desiredCount = 0;
  test.assertions.awsApiCall('ECS', 'describeTaskDefinition', {
    taskDefinition: service.taskDefinition.taskDefinitionArn,
  }).expect(ExpectedResult.objectLike({ taskDefinition: { taskRoleArn: taskRole.roleArn } }));
}
