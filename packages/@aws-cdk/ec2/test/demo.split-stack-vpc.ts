#!/usr/bin/env node
// Like an integ test, but our integ test doesn't currently
// support multi-stack deployments since we have no good way of
// ordering stack deployments. So run this test by hand for now
// until we have that.
import { App, Stack } from '@aws-cdk/core';
import { AmazonLinuxImage, AnyIPv4, ClassicLoadBalancer, Fleet, InstanceClass, InstanceSize,
         InstanceTypePair, VpcNetwork, VpcNetworkRef } from '../lib';

const app = new App(process.argv);
const vpcStack = new Stack(app, 'VPCStack');

const exportedVpc = new VpcNetwork(vpcStack, 'VPC', {
    maxAZs: 3
});

const appStack = new Stack(app, 'AppStack');

const importedVpc = VpcNetworkRef.import(appStack, 'VPC', exportedVpc.export());

const fleet = new Fleet(appStack, 'Fleet', {
    vpc: importedVpc,
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    machineImage: new AmazonLinuxImage()
});

new ClassicLoadBalancer(appStack, 'LB', {
    vpc: importedVpc,
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
