#!/usr/bin/env node
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Stack, App, StackProps, RemovalPolicy, RemovalPolicies } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    new redshift.Cluster(this, 'CloudwatchLoggingCluster', {
      vpc,
      masterUser: {
        masterUsername: 'admin',
      },
      logging: redshift.ClusterLogging.cloudwatch({
        logExports: [redshift.LogExport.CONNECTION_LOG, redshift.LogExport.USER_LOG],
      }),
    });

    const loggingBucket = new s3.Bucket(this, 'LoggingBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new redshift.Cluster(this, 'S3LoggingCluster', {
      vpc,
      masterUser: {
        masterUsername: 'admin',
      },
      logging: redshift.ClusterLogging.s3({
        bucket: loggingBucket,
        logExports: [
          redshift.LogExport.USER_LOG,
          redshift.LogExport.USER_ACTIVITY_LOG,
          redshift.LogExport.CONNECTION_LOG,
        ],
        keyPrefix: 'redshift-logs/',
      }),
    });
  }
}

const app = new App();

const stack = new TestStack(app, 'redshift-cloudwatch-logging-integ');

RemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY);

new integ.IntegTest(app, 'CloudWatchLoggingInteg', {
  testCases: [stack],
});
