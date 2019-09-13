import '@aws-cdk/assert/jest';
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import { App, Stack } from '@aws-cdk/core';
import targets = require('../lib');

test('use S3 bucket website as record target', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  const bucketWebsite = new s3.Bucket(stack, 'Bucket');

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { "Fn::GetAtt": [ "Bucket83908E77", "RegionalDomainName"] },
      HostedZoneId: "Z3AQBSTGFYJSTF"
    },
  });
});

test('use S3 bucket website as record target (fromBucketName)', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  const bucketWebsite = s3.Bucket.fromBucketName(stack, 'Bucket', 'test');

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        "Fn::Join": [
          "",
          [
            "test.s3.us-east-1.",
            {
              Ref: "AWS::URLSuffix"
            }
          ]
        ]
      },
      HostedZoneId: "Z3AQBSTGFYJSTF"
    },
  });
});

test('throws if region agnostic', () => {
  // GIVEN
  const stack = new Stack();

  const bucketWebsite = new s3.Bucket(stack, 'Bucket');

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName: '_foo',
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
    });
  }).toThrow(/Cannot use an S3 record alias in region-agnostic stacks/);
});

test('throws if bucket website hosting is unavailable (cn-northwest-1)', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'cn-northwest-1'}});

  const bucketWebsite = new s3.Bucket(stack, 'Bucket');

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName: '_foo',
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
    });
  }).toThrow(/Bucket website target is not supported/);
});
