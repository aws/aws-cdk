#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elb-instance-target-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 1,
});

const instance = new ec2.Instance(stack, 'targetInstance', {
  vpc: vpc,
  instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  initOptions: {
    timeout: cdk.Duration.minutes(30),
  },
  init: ec2.CloudFormationInit.fromElements(
    ec2.InitService.systemdConfigFile('pythonweb', {
      command: '/usr/bin/python3 -m http.server 8080',
      cwd: '/var/www/html',
    }),
    ec2.InitService.enable('pythonweb', {
      serviceManager: ec2.ServiceManager.SYSTEMD,
    }),
    ec2.InitFile.fromString('/var/www/html/index.html', 'Hello! You can see me!'),
  ),
});
instance.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

const elbalancer = new elb.LoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

elbalancer.addTarget(new elb.InstanceTarget(instance));
elbalancer.addListener({ externalPort: 80, internalPort: 8080 });

new integ.IntegTest(app, 'InstanceTargetTest', {
  testCases: [stack],
});

app.synth();
