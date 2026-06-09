import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { PrivateHostedZone } from 'aws-cdk-lib/aws-route53';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1, restrictDefaultSecurityGroup: false });

const privateZone = new PrivateHostedZone(stack, 'PrivateZone', {
  zoneName: 'aws-cdk.dev', vpc,
});

const expectPrivateHostedZone = route53.PrivateHostedZone.fromHostedZoneAttributes(stack, 'ExpectPrivateHostedZone', {
  hostedZoneId: privateZone.hostedZoneId,
  zoneName: privateZone.zoneName,
});

const integTest = new IntegTest(app, 'AwsCdkRoute53IntegTest', {
  testCases: [stack],
  diffAssets: false,
});

const hostedZoneApiCall = integTest.assertions.awsApiCall('Route53', 'getHostedZone', {
  Id: expectPrivateHostedZone.hostedZoneId,
});

hostedZoneApiCall.expect(
  ExpectedResult.objectLike({
    HostedZone: {
      Id: expectPrivateHostedZone.hostedZoneId,
      Name: expectPrivateHostedZone.zoneName,
    },
  }),
);

app.synth();

