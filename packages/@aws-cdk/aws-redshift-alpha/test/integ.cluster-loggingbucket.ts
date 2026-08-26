#!/usr/bin/env node
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { Stack, App } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
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

const app = new App();
const stack = new Stack(app, 'aws-cdk-redshift-cluster-database');

new RedshiftEnv(stack, 'redshift-loggingbucket-integ');

new integ.IntegTest(app, 'LoggingBucketInteg', {
  testCases: [stack],
});
