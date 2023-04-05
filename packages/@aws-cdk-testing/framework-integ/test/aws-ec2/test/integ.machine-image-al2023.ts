import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-al2023');

new ec2.LaunchTemplate(stack, 'LT', {
  httpEndpoint: true,
  httpProtocolIpv6: true,
  httpPutResponseHopLimit: 2,
  httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
  instanceMetadataTags: true,
});

new ec2.LaunchTemplate(stack, 'LTWithMachineImageAL2023', {
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
  }),
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
