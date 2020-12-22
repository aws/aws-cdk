import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

// S3 bucket to host envfile without public access
const bucket = new s3.Bucket(stack, 'Bucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// ECS cluster to host EC2 task
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

// permit EC2 task to read envfiles from S3
const s3PolicyStatement = new iam.PolicyStatement({
  actions: ['s3:GetBucketLocation', 's3:GetObject'],
});

s3PolicyStatement.addAllResources();

const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
  inlinePolicies: {
    s3Policy: new iam.PolicyDocument({
      statements: [s3PolicyStatement],
    }),
  },
});

// define task to run the container with envfiles
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition', {
  executionRole,
  networkMode: ecs.NetworkMode.AWS_VPC,
});

// deploy an envfile to S3 and delete when the bucket is deleted
const envFileDeployment = new s3deployment.BucketDeployment(stack, 'EnvFileDeployment', {
  destinationBucket: bucket,
  retainOnDelete: false,
  sources: [s3deployment.Source.asset(path.join(__dirname, '../demo-envfiles'))],
});

// define container with envfiles - one from local disk and another from S3
const containerDefinition = new ecs.ContainerDefinition(stack, 'Container', {
  environmentFiles: [
    ecs.EnvironmentFile.fromAsset(path.join(__dirname, '../demo-envfiles/test-envfile.env')),
    ecs.EnvironmentFile.fromBucket(bucket, 'test-envfile.env'),
  ],
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
  taskDefinition,
});

containerDefinition.node.addDependency(envFileDeployment);

// define a service to run the task definition
new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
});

app.synth();
