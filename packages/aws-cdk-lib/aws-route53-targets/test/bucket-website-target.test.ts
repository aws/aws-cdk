import { Template } from '../../assertions';
import * as route53 from '../../aws-route53';
import * as s3 from '../../aws-s3';
import { App, Stack } from '../../core';
import * as targets from '../lib';

const [recordName, zoneName] = ['foo', 'test.public'];
const bucketName = [recordName, zoneName].join('.');

test('use S3 bucket website as record target', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  const bucketWebsite = new s3.Bucket(stack, 'Bucket', { bucketName });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName,
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 's3-website-us-east-1.amazonaws.com',
      HostedZoneId: 'Z3AQBSTGFYJSTF',
    },
  });
});

test('use S3 bucket website as record target with health check', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  const bucketWebsite = new s3.Bucket(stack, 'Bucket', { bucketName });

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName,
    target: route53.RecordTarget.fromAlias(
      new targets.BucketWebsiteTarget(bucketWebsite, {
        evaluateTargetHealth: true,
      }),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      EvaluateTargetHealth: true,
    },
  });
});

test('use S3 bucket website as record target (fromBucketName)', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-east-1' } });

  const bucketWebsite = s3.Bucket.fromBucketName(stack, 'Bucket', bucketName);

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName,
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 's3-website-us-east-1.amazonaws.com',
      HostedZoneId: 'Z3AQBSTGFYJSTF',
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
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite)),
    });
  }).toThrow(/Cannot use an S3 record alias in region-agnostic stacks/);
});

test('throws if bucket website hosting is unavailable (us-iso-east-1)', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test', { env: { region: 'us-iso-east-1' } });

  const bucketWebsite = new s3.Bucket(stack, 'Bucket');

  // WHEN
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName });

  // THEN
  expect(() => {
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite)),
    });
  }).toThrow(/Bucket website target is not supported/);
});
