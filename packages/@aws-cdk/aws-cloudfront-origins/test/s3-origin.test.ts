import { Match, Template } from '@aws-cdk/assertions';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { S3Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack');
});

describe('With bucket', () => {
  test('renders minimal example', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket);
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(stack.resolve(originBindConfig.originProperty)).toEqual({
      id: 'StackOrigin029E19582',
      domainName: { 'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'] },
      s3OriginConfig: {
        originAccessIdentity: {
          'Fn::Join': ['',
            [
              'origin-access-identity/cloudfront/',
              { Ref: 'S3Origin83A0717C' },
            ]],
        },
      },
    });
  });

  test('can customize base origin properties', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket, {
      originPath: '/assets',
      connectionTimeout: Duration.seconds(5),
      connectionAttempts: 2,
      customHeaders: { AUTH: 'NONE' },
    });
    const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

    expect(stack.resolve(originBindConfig.originProperty)).toEqual({
      id: 'StackOrigin029E19582',
      domainName: { 'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'] },
      originPath: '/assets',
      connectionTimeout: 5,
      connectionAttempts: 2,
      originCustomHeaders: [{
        headerName: 'AUTH',
        headerValue: 'NONE',
      }],
      s3OriginConfig: {
        originAccessIdentity: {
          'Fn::Join': ['',
            [
              'origin-access-identity/cloudfront/',
              { Ref: 'S3Origin83A0717C' },
            ]],
        },
      },
    });
  });

  test('can customize OriginAccessIdentity property', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(stack, 'OriginAccessIdentity', {
      comment: 'Identity for bucket provided by test',
    });

    const origin = new S3Origin(bucket, { originAccessIdentity });
    new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Identity for bucket provided by test',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': ['OriginAccessIdentityDF1E3CAC', 'S3CanonicalUserId'] },
          },
          Resource: {
            'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] }, '/*']],
          },
        }],
      },
    });
  });

  test('creates an OriginAccessIdentity and grants read permissions on the bucket', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin(bucket);
    new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Identity for StackDistOrigin15754CE84',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': ['DistOrigin1S3Origin87D64058', 'S3CanonicalUserId'] },
          },
          Resource: {
            'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] }, '/*']],
          },
        }],
      },
    });
  });

  test('as a cross-stack reference', () => {
    // Bucket stack and bucket
    const bucketStack = new Stack(app, 'BucketStack');
    const bucket = new s3.Bucket(bucketStack, 'Bucket');

    // Distribution stack and distribution
    const origin = new S3Origin(bucket);
    new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    Template.fromStack(stack).resourceCountIs('AWS::CloudFront::Distribution', 1);
    Template.fromStack(bucketStack).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(bucketStack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Identity for StackDistOrigin15754CE84',
      },
    });
    Template.fromStack(bucketStack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [Match.objectLike({
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': ['StackDistOrigin15754CE84S3Origin25582A25', 'S3CanonicalUserId'] },
          },
        })],
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
        originSslProtocols: [
          'TLSv1.2',
        ],
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
        originSslProtocols: [
          'TLSv1.2',
        ],
      },
    });
  });
});
