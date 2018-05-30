#!/usr/bin/env node
import { App, Stack } from 'aws-cdk';
import { AmazonLinuxImage, AnyIPv4, ClassicLoadBalancer, Fleet, InstanceClass,
    InstanceSize, InstanceTypePair, VpcNetwork } from '../lib';

const app = new App(process.argv);
const stack = new Stack(app, 'aws-cdk-ec2-integ');

const vpc = new VpcNetwork(stack, 'VPC', {
    maxAZs: 3
});

const fleet = new Fleet(stack, 'Fleet', {
    vpc,
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    machineImage: new AmazonLinuxImage(),
});

new ClassicLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
    listeners: [{
        externalPort: 80,
        allowConnectionsFrom: [new AnyIPv4()]
    }],
    healthCheck: {
        port: 80
    },
    targets: [fleet]
});

process.stdout.write(app.run());