import '@aws-cdk/assert/jest';
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import { App, Stack } from '@aws-cdk/core';
import targets = require('../lib');

const [recordName, zoneName] = ['foo', 'test.public'];
const bucketName = [recordName, zoneName].join('.');
const invalidBucketName = ['invalid', bucketName].join('.');

test('use S3 bucket website as record target', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  const bucketWebsite = new s3.Bucket(stack, 'Bucket', { bucketName });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName,
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: "s3-website-us-east-1.amazonaws.com",
      HostedZoneId: "Z3AQBSTGFYJSTF"
    },
  });
});

test('use S3 bucket website as record target (fromBucketName)', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  const bucketWebsite = s3.Bucket.fromBucketName(stack, 'Bucket', bucketName);

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName,
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: "s3-website-us-east-1.amazonaws.com",
      HostedZoneId: "Z3AQBSTGFYJSTF"
    },
  });
});

test('throws if region agnostic', () => {
  // GIVEN
  const stack = new Stack();

  const bucketWebsite = new s3.Bucket(stack, 'Bucket', { bucketName });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName,
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
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
    });
  }).toThrow(/Bucket website target is not supported/);
});


test("throws if bucket name doesn't match full record domain name: new Bucket", () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  // FIXME bucketName is unresolved?
  const bucketWebsite = new s3.Bucket(stack, 'Bucket', { bucketName: invalidBucketName });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
    });
  }).toThrow(/The bucket name must match the full DNS record name/);
});


test("throws if bucket name doesn't match full record domain name: fromBucketName", () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', {env: {region: 'us-east-1'}});

  const bucketWebsite = s3.Bucket.fromBucketName(stack, 'Bucket', invalidBucketName);

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite))
    });
  }).toThrow(/The bucket name must match the full DNS record name/);
});
