import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

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

new route53.AaaaRecord(zone, 'AaaaAlias', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
});

new route53.HttpsRecord(zone, 'HttpsAlias', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
});

new IntegTest(app, 'aws-cdk-route53-cloudfront-alias-integ-test', {
  testCases: [stack],
});
