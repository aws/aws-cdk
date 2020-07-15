import '@aws-cdk/assert/jest';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { Distribution, Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

describe('fromBucket', () => {

  test('as bucket, renders all properties, including S3Origin config', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = Origin.fromBucket(bucket);
    origin._bind(stack, { originIndex: 0 });

    expect(origin._renderOrigin()).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketRegionalDomainName,
      s3OriginConfig: {
        originAccessIdentity: 'origin-access-identity/cloudfront/${Token[TOKEN.69]}',
      },
    });
  });

  test('as bucket, creates an OriginAccessIdentity and grants read permissions on the bucket', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = Origin.fromBucket(bucket);
    new Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    expect(stack).toHaveResourceLike('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Allows CloudFront to reach the bucket',
      },
    });
    expect(stack).toHaveResourceLike('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [{
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': [ 'DistS3Origin1C4519663', 'S3CanonicalUserId' ] },
          },
        }],
      },
    });
  });

  test('as website buvcket, renders all properties, including custom origin config', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      websiteIndexDocument: 'index.html',
    });

    const origin = Origin.fromBucket(bucket);
    origin._bind(stack, { originIndex: 0 });

    expect(origin._renderOrigin()).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketWebsiteDomainName,
      customOriginConfig: {
        originProtocolPolicy: 'http-only',
      },
    });
  });

});

