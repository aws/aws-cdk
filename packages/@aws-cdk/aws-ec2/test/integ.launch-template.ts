import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-lt-metadata-1');

new ec2.LaunchTemplate(stack, 'LT', {
  httpEndpoint: true,
  httpProtocolIpv6: true,
  httpPutResponseHopLimit: 2,
  httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
  instanceMetadataTags: true,
});

new ec2.LaunchTemplate(stack, 'LTWithMachineImage', {
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
