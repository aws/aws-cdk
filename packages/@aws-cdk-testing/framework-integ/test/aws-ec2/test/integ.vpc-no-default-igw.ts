import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpc-no-default-igw');

new ec2.Vpc(stack, 'MyVpc', {
  createInternetGateway: false,
  subnetConfiguration: [
    {
      subnetType: ec2.SubnetType.PUBLIC,
      name: 'Public',
    },
  ],
});

new integ.IntegTest(app, 'VpcNoDefaultIgw', {
  testCases: [stack],
});

app.synth();
