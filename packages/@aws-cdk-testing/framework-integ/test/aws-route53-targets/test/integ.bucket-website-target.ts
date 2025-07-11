#!/usr/bin/env node
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const zone = new route53.PublicHostedZone(this, 'HostedZone', { zoneName: 'test.public' });

    new route53.ARecord(this, 'Alias', {
      zone,
      recordName: 'without-health-check',
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucket)),
    });

    new route53.ARecord(this, 'AliasWithHealthCheck', {
      zone,
      recordName: 'with-health-check',
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(bucket, {
          evaluateTargetHealth: true,
        }),
      ),
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'aws-cdk-s3-integ', {
  env: {
    region: 'us-east-1',
  },
});

new IntegTest(app, 'aws-cdk-s3-integ-test', {
  testCases: [testCase],
  regions: [testCase.region],
});
