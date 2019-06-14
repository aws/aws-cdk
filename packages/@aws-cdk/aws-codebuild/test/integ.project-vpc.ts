#!/usr/bin/env node
import assets = require('@aws-cdk/assets');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Project } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
    maxAZs: 1,
    natGateways: 1,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
    allowAllOutbound: true,
    description: 'Example',
    groupName: cdk.PhysicalName.of('Bob'),
    vpc,
});
new Project(stack, 'MyProject', {
    buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Bundle', { path: 'script_bundle' }),
    securityGroups: [securityGroup],
    vpc
});

app.synth();
