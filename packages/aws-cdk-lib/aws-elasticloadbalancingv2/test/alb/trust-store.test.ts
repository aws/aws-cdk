import { Match, Template } from '../../../assertions';
import * as s3 from '../../../aws-s3';
import * as cdk from '../../../core';
import * as elbv2 from '../../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('Trust Store with all properties', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  // WHEN
  new elbv2.TrustStore(stack, 'TrustStore', {
    trustStoreName: 'MyTrustStore',
    bucket,
    key: 'dummy.pem',
    version: 'test-version',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TrustStore', {
    CaCertificatesBundleS3Bucket: stack.resolve(bucket.bucketName),
    CaCertificatesBundleS3Key: 'dummy.pem',
    CaCertificatesBundleS3ObjectVersion: 'test-version',
    Name: 'MyTrustStore',
  });
});

test('Trust Store with required properties', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  // WHEN
  new elbv2.TrustStore(stack, 'TrustStore', {
    bucket,
    key: 'dummy.pem',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TrustStore', {
    CaCertificatesBundleS3Bucket: stack.resolve(bucket.bucketName),
    CaCertificatesBundleS3Key: 'dummy.pem',
    CaCertificatesBundleS3ObjectVersion: Match.absent(),
    Name: 'TrustStore',
  });
});

test.each(['', 'a'.repeat(33)])('Throw an error when trustStoreName length is invalid, trustStoreName: %s', (trustStoreName) => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  // WHEN
  expect(() => {
    new elbv2.TrustStore(stack, 'TrustStore', {
      bucket,
      key: 'dummy.pem',
      trustStoreName,
    });
  }).toThrow(`trustStoreName '${trustStoreName}' must be 1-32 characters long.`);
});

test.each(['-test', 'test-', '$test'])('Throw an error when trustStoreName has invalid patten, trustStoreName: %s', (trustStoreName) => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  // WHEN
  expect(() => {
    new elbv2.TrustStore(stack, 'TrustStore', {
      bucket,
      key: 'dummy.pem',
      trustStoreName,
    });
  }).toThrow(`trustStoreName '${trustStoreName}' must contain only alphanumeric characters and hyphens, and cannot begin or end with a hyphen.`);
});
