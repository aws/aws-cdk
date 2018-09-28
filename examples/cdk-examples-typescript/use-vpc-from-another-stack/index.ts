#!/usr/bin/env node
// Like an integ test, but our integ test doesn't currently
// support multi-stack deployments since we have no good way of
// ordering stack deployments. So run this test by hand for now
// until we have that.
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App(process.argv);
const vpcStack = new cdk.Stack(app, 'VPCStack');

const exportedVpc = new ec2.VpcNetwork(vpcStack, 'VPC', {
  maxAZs: 3
});

const appStack = new cdk.Stack(app, 'AppStack');

const importedVpc = ec2.VpcNetworkRef.import(appStack, 'VPC', exportedVpc.export());

const asg = new autoscaling.AutoScalingGroup(appStack, 'ASG', {
  vpc: importedVpc,
  instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
  machineImage: new ec2.AmazonLinuxImage()
});

new elb.LoadBalancer(appStack, 'LB', {
  vpc: importedVpc,
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
