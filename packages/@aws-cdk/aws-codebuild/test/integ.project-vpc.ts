#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import codebuild = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
    maxAzs: 1,
    natGateways: 1,
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
    securityGroups: [securityGroup],
    vpc
});

app.synth();
