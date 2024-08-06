import { Match, Template } from '../../../assertions';
import * as s3 from '../../../aws-s3';
import * as cdk from '../../../core';
import * as elbv2 from '../../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('Trust Store Revocation with all properties', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  const trustStore = new elbv2.TrustStore(stack, 'TrustStore', {
    bucket,
    key: 'dummy.pem',
  });

  // WHEN
  new elbv2.TrustStoreRevocation(stack, 'Revocation', {
    trustStore,
    revocationContents: [
      {
        revocationType: elbv2.RevocationType.CRL,
        bucket,
        key: 'crl.pem',
        version: 'test-version',
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TrustStoreRevocation', {
    TrustStoreArn: stack.resolve(trustStore.trustStoreArn),
    RevocationContents: [
      {
        RevocationType: 'CRL',
        S3Bucket: stack.resolve(bucket.bucketName),
        S3Key: 'crl.pem',
        S3ObjectVersion: 'test-version',
      },
    ],
  });
});

test('Trust Store Revocation with required properties', () => {
  // GIVEN
  const bucket = new s3.Bucket(stack, 'Bucket');

  const trustStore = new elbv2.TrustStore(stack, 'TrustStore', {
    bucket,
    key: 'dummy.pem',
  });

  // WHEN
  new elbv2.TrustStoreRevocation(stack, 'Revocation', {
    trustStore,
    revocationContents: [
      {
        bucket,
        key: 'crl.pem',
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TrustStoreRevocation', {
    TrustStoreArn: stack.resolve(trustStore.trustStoreArn),
    RevocationContents: [
      {
        RevocationType: Match.absent(),
        S3Bucket: stack.resolve(bucket.bucketName),
        S3Key: 'crl.pem',
        S3ObjectVersion: Match.absent(),
      },
    ],
  });
});
