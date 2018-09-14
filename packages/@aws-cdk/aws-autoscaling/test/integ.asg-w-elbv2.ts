#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import autoscaling = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-ec2-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
    maxAZs: 3
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
    vpc,
    instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
    machineImage: new ec2.AmazonLinuxImage(),
});

new ec2.ClassicLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
    listeners: [{
        externalPort: 80,
        allowConnectionsFrom: [new ec2.AnyIPv4()]
    }],
    healthCheck: {
        port: 80
    },
    targets: [asg]
});

process.stdout.write(app.run());

