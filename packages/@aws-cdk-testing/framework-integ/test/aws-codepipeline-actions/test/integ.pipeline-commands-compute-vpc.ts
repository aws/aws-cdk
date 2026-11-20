import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-commands-compute-vpc');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 1,
  restrictDefaultSecurityGroup: false,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: true,
});

const sourceBucket = new s3.Bucket(stack, 'SourceBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');

new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          output: sourceOutput,
          bucket: sourceBucket,
          bucketKey: 'source.zip',
        }),
      ],
    },
    {
      stageName: 'Compute',
      actions: [
        // Linux environment in the private subnets with a generated security group
        new cpactions.CommandsAction({
          actionName: 'LinuxInVpc',
          commands: ['echo hello from the vpc'],
          input: sourceOutput,
          environmentType: cpactions.CommandsEnvironmentType.LINUX_CONTAINER,
          computeType: codebuild.ComputeType.MEDIUM,
          vpc,
        }),
        // Windows environment with explicit subnets and security groups
        new cpactions.CommandsAction({
          actionName: 'WindowsInVpc',
          commands: ['dir'],
          input: sourceOutput,
          environmentType: cpactions.CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER,
          computeType: codebuild.ComputeType.LARGE,
          vpc,
          subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          securityGroups: [securityGroup],
        }),
      ],
    },
  ],
});

new IntegTest(app, 'aws-cdk-codepipeline-commands-compute-vpc-test', {
  testCases: [stack],
});
