import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ECS_REMOVE_EMPTY_LOAD_BALANCERS } from 'aws-cdk-lib/cx-api';

const app = new cdk.App({
  postCliContext: {
    [ECS_REMOVE_EMPTY_LOAD_BALANCERS]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-ecs-empty-load-balancers');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
  portMappings: [{ containerPort: 80 }],
});

// The service has no target groups, so `LoadBalancers` renders as an empty array. CloudFormation has to
// accept that array on both create and update; on update it is what removes existing registrations.
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
});

const test = new integ.IntegTest(app, 'EmptyLoadBalancersTest', { testCases: [stack] });

test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterArn,
  services: [service.serviceArn],
}).expect(integ.ExpectedResult.objectLike({
  services: [{ loadBalancers: [] }],
}));
