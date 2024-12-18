import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const producer = new cdk.Stack(app, 'Producer');
const nested = new cdk.NestedStack(producer, 'Nestor');

const vpc = new ec2.Vpc(nested, 'MyVpc', { maxAzs: 1 });
const vpce = new ec2.InterfaceVpcEndpoint(nested, 'MyVpcEndpoint', {
  vpc,
  service: {
    name: `com.amazonaws.${nested.region}.execute-api`,
    port: 443,
  },
});

const consumer = new cdk.Stack(app, 'Consumer');
new s3.Bucket(consumer, 'ConsumerBucket');

new cdk.CfnOutput(consumer, 'StringAttribute', {
  value: vpce.vpcEndpointId,
});

new cdk.CfnOutput(consumer, 'ListAttribute', {
  value: cdk.Fn.join('$$', vpce.vpcEndpointDnsEntries),
});

new integ.IntegTest(app, 'NestedStackReferences', {
  testCases: [producer, consumer],
});
