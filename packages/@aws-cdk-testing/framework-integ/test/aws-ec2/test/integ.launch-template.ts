import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-lt-metadata-1');

const vpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'MyVpc',
  subnetConfiguration: [],
});

const sg1 = new ec2.SecurityGroup(stack, 'sg1', {
  vpc: vpc,
});

const lt = new ec2.LaunchTemplate(stack, 'LT', {
  httpEndpoint: true,
  httpProtocolIpv6: true,
  httpPutResponseHopLimit: 2,
  httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
  instanceMetadataTags: true,
  securityGroup: sg1,
});

const sg2 = new ec2.SecurityGroup(stack, 'sg2', {
  vpc: vpc,
});

lt.addSecurityGroup(sg2);

new ec2.LaunchTemplate(stack, 'LTWithMachineImage', {
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
