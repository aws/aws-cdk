/// !cdk-integ canary-vpc

import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib/core';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name canary-vpc has state of 'RUNNING'
 * -- aws synthetics get-canary --name canary-vpc has VpcId
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-vpc');

const vpc = new ec2.Vpc(stack, 'MyVpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new synthetics.Canary(stack, 'MyVpcCanary', {
  canaryName: 'canary-vpc',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
  vpc,
});

app.synth();
