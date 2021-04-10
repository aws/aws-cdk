import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

const sourceBucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: sourceBucket,
      },
      behaviors: [{ isDefaultBehavior: true }],
    },
  ],
});

new route53.ARecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
});

app.synth();
