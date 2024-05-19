/// !cdk-integ canary-vpc

import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';
import * as cdk from 'aws-cdk-lib/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'canary-vpc');

const bucket = new s3.Bucket(stack, 'MyTestBucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const vpc = new ec2.Vpc(stack, 'MyVpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const canary = new synthetics.Canary(stack, 'MyVpcCanary', {
  canaryName: 'canary-vpc',
  test: synthetics.Test.custom({
    handler: 'canary.handler',
    code: synthetics.Code.fromAsset(path.join(__dirname, 'canary.zip')),
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
  vpc,
  artifactsBucketLocation: { bucket },
  cleanup: synthetics.Cleanup.LAMBDA,
});

const test = new IntegTest(app, 'IntegCanaryVpcTest', {
  testCases: [stack],
});

test.assertions.awsApiCall('Synthetics', 'getCanary', { Name: canary.canaryName })
  .expect(ExpectedResult.objectLike({
    Canary: {
      Status: {
        State: 'RUNNING',
      },
      VpcConfig: {
        VpcId: vpc.vpcId,
      },
    },
  }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(5) });

app.synth();
