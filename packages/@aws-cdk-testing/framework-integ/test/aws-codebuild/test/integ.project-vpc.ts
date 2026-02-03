#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
  maxAzs: 1,
  natGateways: 1,
  restrictDefaultSecurityGroup: false,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
  allowAllOutbound: true,
  description: 'Example',
  securityGroupName: 'Bob',
  vpc,
});
new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: ['echo "Nothing to do!"'],
      },
    },
  }),
  grantReportGroupPermissions: false,
  securityGroups: [securityGroup],
  vpc,
});

app.synth();
