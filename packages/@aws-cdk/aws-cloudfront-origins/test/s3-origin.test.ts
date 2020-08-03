import '@aws-cdk/assert/jest';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { S3Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

describe('With bucket', () => {
  test('renders minimal example', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket);
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(originBindConfig.originProperty).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketRegionalDomainName,
      s3OriginConfig: {
        originAccessIdentity: 'origin-access-identity/cloudfront/${Token[TOKEN.69]}',
      },
    });
  });

  test('can customize properties', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket, { originPath: '/assets' });
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(originBindConfig.originProperty).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketRegionalDomainName,
      originPath: '/assets',
      s3OriginConfig: {
        originAccessIdentity: 'origin-access-identity/cloudfront/${Token[TOKEN.89]}',
      },
    });
  });

  test('creates an OriginAccessIdentity and grants read permissions on the bucket', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket);
    new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    expect(stack).toHaveResourceLike('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Allows CloudFront to reach the bucket',
      },
    });
    expect(stack).toHaveResourceLike('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [{
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': [ 'DistOrigin1S3Origin87D64058', 'S3CanonicalUserId' ] },
          },
        }],
      },
    });
  });
});

describe('With website-configured bucket', () => {
  test('renders all required properties, including custom origin config', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      websiteIndexDocument: 'index.html',
    });

    const origin = new S3Origin(bucket);
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(originBindConfig.originProperty).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketWebsiteDomainName,
      customOriginConfig: {
        originProtocolPolicy: 'http-only',
      },
    });
  });

  test('can customize properties', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      websiteIndexDocument: 'index.html',
    });

    const origin = new S3Origin(bucket, { originPath: '/assets' });
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(originBindConfig.originProperty).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketWebsiteDomainName,
      originPath: '/assets',
      customOriginConfig: {
        originProtocolPolicy: 'http-only',
      },
    });
  });
});
