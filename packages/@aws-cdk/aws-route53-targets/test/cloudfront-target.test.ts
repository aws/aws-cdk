import '@aws-cdk/assert/jest';
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import { Stack } from '@aws-cdk/core';
import targets = require('../lib');

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
    target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { "Fn::GetAtt": [ "MyDistributionCFDistributionDE147309", "DomainName" ] },
      HostedZoneId: "Z2FDTNDATAQYW2"
    },
  });
});
