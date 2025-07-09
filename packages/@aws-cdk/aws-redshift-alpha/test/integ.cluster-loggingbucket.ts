#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Stack, App, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
    const loggingBucket = new s3.Bucket(this, 'S3');

    new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      loggingProperties: {
        loggingBucket: loggingBucket,
        loggingKeyPrefix: 'prefix',
      },
    });
  }
}

const app = new App({
  context: {
    'availability-zones:account=123456789012:region=us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
});
const stack = new Stack(app, 'aws-cdk-redshift-cluster-database', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

new RedshiftEnv(stack, 'redshift-loggingbucket-integ');

new integ.IntegTest(app, 'LoggingBucketInteg', {
  testCases: [stack],
});

app.synth();
