import { Annotations, Match, Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import { App, Duration, Stack } from '../../core';
import { CLOUDFRONT_USE_ORIGIN_ACCESS_CONTROL_BY_DEFAULT } from '../../cx-api';
import { AccessLevel, S3Origin, S3OriginProps } from '../lib';

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

  test('Can set a custom originId', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');
    const bucket2 = new s3.Bucket(stack, 'Bucket2');
    const origin2 = new S3Origin(bucket2, { originId: 'MyOtherCustomOrigin' });
    const origin = new S3Origin(bucket, { originId: 'MyCustomOrigin' });
    const distro = new cloudfront.Distribution(stack, 'Dist', {
      defaultBehavior: { origin },
    });
    distro.addBehavior('/test', origin2);

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CacheBehaviors: [
          {
            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
            Compress: true,
            PathPattern: '/test',
            TargetOriginId: 'MyOtherCustomOrigin',
            ViewerProtocolPolicy: 'allow-all',
          },
        ],
        DefaultCacheBehavior: {
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          TargetOriginId: 'MyCustomOrigin',
          ViewerProtocolPolicy: 'allow-all',
        },
        Origins: [
          {
            Id: 'MyCustomOrigin',
          },
          {
            Id: 'MyOtherCustomOrigin',
          },
        ],
      },
    });
  });

  test('Cannot set an originId duplicates', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');
    const bucket2 = new s3.Bucket(stack, 'Bucket2');
    const origin = new S3Origin(bucket, { originId: 'MyCustomOrigin' });
    const origin2 = new S3Origin(bucket2, { originId: 'MyCustomOrigin' });
    expect(() => {
      new cloudfront.Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        additionalBehaviors: {
          Origin2: {
            origin: origin2,
          },
        },
      });
    }).toThrow(/Origin with id MyCustomOrigin already exists/);
  });

  test('Cannot specify both OAI and OAC', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');
    const oai = new cloudfront.OriginAccessIdentity(stack, 'OAI');
    const oac = new cloudfront.OriginAccessControl(stack, 'OAC');
    expect(() =>
      new S3Origin(bucket, {
        originAccessIdentity: oai,
        originAccessControl: oac,
      })).toThrow('Only one of originAccessControl or originAccessIdentity can be specified for an origin.');
  });

  describe('with feature flag enabled', () => {
    beforeEach(() => {
      stack.node.setContext(CLOUDFRONT_USE_ORIGIN_ACCESS_CONTROL_BY_DEFAULT, true);
    });
    test('should create an S3Origin with Origin Access Control by default', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const origin = new S3Origin(bucket);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeDefined();
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    });

    test('should create an S3Origin with OAI when specified by user', () => {
      const props: S3OriginProps = {
        originAccessIdentity: new cloudfront.OriginAccessIdentity(stack, 'TestOAI'),
      };
      const bucket = new s3.Bucket(stack, 'Bucket');
      const origin = new S3Origin(bucket, props);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeUndefined();
      Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
        CloudFrontOriginAccessIdentityConfig: {
          Comment: 'Allows CloudFront to reach the bucket',
        },
      });
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1);
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 0);
    });

    test('should create an S3Origin with Origin Access Control when specified', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const props: S3OriginProps = {
        originAccessControl: new cloudfront.OriginAccessControl(stack, 'TestOAC'),
      };
      const origin = new S3Origin(bucket, props);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeDefined();
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 0);
    });

    test('should create an S3Origin with the specified access levels', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const props: S3OriginProps = {
        originAccessLevels: [AccessLevel.READ, AccessLevel.WRITE],
      };
      const origin = new S3Origin(bucket, props);
      new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [{
            Sid: 'GrantOACAccessToS3',
            Action: ['s3:GetObject', 's3:PutObject'],
            Effect: 'Allow',
            Principal: {
              Service: 'cloudfront.amazonaws.com',
            },
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] }, '/*']],
            },
            Condition: {
              StringEquals: {
                'AWS:SourceArn': {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudfront::', { Ref: 'AWS::AccountId' }, ':distribution/', { Ref: 'DistB3B78991' }]],
                },
              },
            },
          }],
        },
      });
    });

    test('should throw warning when trying to update imported bucket policy without overrideImportedBucketPolicy set', () => {
      const importedBucket = s3.Bucket.fromBucketName(stack, 'myImportedBucket', 'bucket-name');
      const props: S3OriginProps = {
        originAccessControl: new cloudfront.OriginAccessControl(stack, 'TestOAC'),
      };
      const origin = new S3Origin(importedBucket, props);
      origin.bind(stack, { originId: 'TestOrigin' });
      Annotations.fromStack(stack).hasWarning('*', 'Cannot update bucket policy of an imported bucket. Set overrideImportedBucketPolicy to true or update the policy manually instead. [ack: @aws-cdk/aws-cloudfront-origins:updateBucketPolicy]');
    });

    test('should create custom resource to update imported bucket policy when overrideImportedBucketPolicy is set', () => {
      const importedBucket = s3.Bucket.fromBucketName(stack, 'myImportedBucket', 'bucket-name');
      const props: S3OriginProps = {
        originAccessControl: new cloudfront.OriginAccessControl(stack, 'TestOAC'),
        overrideImportedBucketPolicy: true,
      };
      const origin = new S3Origin(importedBucket, props);
      origin.bind(stack, { originId: 'TestOrigin' });
      Template.fromStack(stack).resourceCountIs('Custom::S3OriginAccessControlBucketPolicyUpdater', 1);
    });

    test('should create custom resource to update key policy for SSE-KMS buckets', () => {
      const bucket = new s3.Bucket(stack, 'myBucket', {
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: new kms.Key(stack, 'Key'),
      });
      const props: S3OriginProps = {
        originAccessControl: new cloudfront.OriginAccessControl(stack, 'TestOAC'),
        overrideImportedBucketPolicy: true,
      };
      const origin = new S3Origin(bucket, props);
      origin.bind(stack, { originId: 'TestOrigin' });
      Template.fromStack(stack).resourceCountIs('Custom::S3OriginAccessControlKeyPolicyUpdater', 1);
    });
  });

  describe('with feature flag disabled (default)', () => {
    test('should create an S3Origin with Origin Access Identity by default', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const origin = new S3Origin(bucket);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeUndefined();
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1);
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 0);
    });

    test('should create an S3Origin with Origin Access Identity when specified', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const props: S3OriginProps = {
        originAccessIdentity: new cloudfront.OriginAccessIdentity(stack, 'TestOAI'),
      };
      const origin = new S3Origin(bucket, props);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeUndefined();
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1);
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 0);
    });

    test('should create an S3Origin with Origin Access Control when specified', () => {
      const bucket = new s3.Bucket(stack, 'Bucket');
      const props: S3OriginProps = {
        originAccessControl: new cloudfront.OriginAccessControl(stack, 'TestOAC'),
      };
      const origin = new S3Origin(bucket, props);
      const bindConfig = origin.bind(stack, { originId: 'TestOrigin' });
      expect(bindConfig.originProperty?.originAccessControlId).toBeDefined();
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 0);
      Template.fromStack(stack).resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
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

  test('Can set an originId', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      websiteIndexDocument: 'index.html',
    });
    const origin = new S3Origin(bucket, { originId: 'MyCustomOrigin' });
    new cloudfront.Distribution(stack, 'Dist', { defaultBehavior: { origin } });
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Origins: [{
          Id: 'MyCustomOrigin',
        }],
      },
    });
  });
});
