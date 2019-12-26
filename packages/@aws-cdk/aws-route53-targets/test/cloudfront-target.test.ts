import '@aws-cdk/assert/jest';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('use CloudFront as record target', () => {
  // GIVEN
  const stack = new Stack();

  const sourceBucket = new s3.Bucket(stack, 'Bucket');

  const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: sourceBucket
        },
        behaviors : [ {isDefaultBehavior: true}]
      }
    ]
  });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { "Fn::GetAtt": [ "MyDistributionCFDistributionDE147309", "DomainName" ] },
      HostedZoneId: "Z2FDTNDATAQYW2"
    },
  });
});
