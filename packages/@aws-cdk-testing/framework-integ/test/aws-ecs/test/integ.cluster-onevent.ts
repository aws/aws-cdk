import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'integ-ecs-cluster-onevent');

// Create a new VPC instead of looking up existing one
const vpc = new ec2.Vpc(stack, 'TestVpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

// Create cluster
const cluster = new ecs.Cluster(stack, 'TestCluster', {
  vpc,
  clusterName: 'integ-test-cluster-onevent',
});

// Create log group with proper naming for event capture
const logGroup = new logs.LogGroup(stack, 'EventCaptureLogGroup', {
  logGroupName: `/aws/events/ecs-cluster/${cluster.clusterName}`,
  retention: logs.RetentionDays.ONE_WEEK,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Enable event capture using onEvent method with log group target
cluster.onEvent('ClusterStateChangeRule', {
  target: new targets.CloudWatchLogGroup(logGroup),
  eventPattern: {
    source: ['aws.ecs'],
    detailType: ['ECS Cluster State Change'],
    detail: {
      clusterArn: [cluster.clusterArn],
    },
  },
});

// Create integration test - deployment success validates functionality
new integ.IntegTest(app, 'ClusterOnEventTest', {
  testCases: [stack],
});
