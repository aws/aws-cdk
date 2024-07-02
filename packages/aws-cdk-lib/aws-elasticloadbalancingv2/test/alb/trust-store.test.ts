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
