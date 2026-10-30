import * as path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { WebFunction } from '../lib/webfunction';
import { WebFunctionCode } from '../lib/webfunction-code';
import type { WebFunctionProvidedBucketAssetOptions } from '../lib/webfunction-code';
import { WebFunctionAuthType } from '../lib/webfunction-endpoint';
import { WebFunctionRuntime } from '../lib/webfunction-runtime';

// Any real directory works as an asset source; the handler code itself is irrelevant here.
const ASSET_PATH = path.join(__dirname, 'my-lambda-handler');

// Resources of the copy handler's s3:DeleteObject* statements, as the trailing key pattern.
function deleteGrantKeyPatterns(stack: cdk.Stack): string[] {
  const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
  return Object.values(policies)
    .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement)
    .filter((statement: any) => statement.Action === 's3:DeleteObject*')
    .map((statement: any) => statement.Resource['Fn::Join'][1][1]);
}

// Resources of the copy handler's s3:PutObject statements, as the trailing key pattern.
function putGrantKeyPatterns(stack: cdk.Stack): string[] {
  const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
  return Object.values(policies)
    .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement)
    .filter((statement: any) => [statement.Action].flat().includes('s3:PutObject'))
    .map((statement: any) => statement.Resource['Fn::Join'][1][1]);
}

/** The `s3:prefix` values the version-listing statements are conditioned on. */
function listGrantPrefixConditions(stack: cdk.Stack): string[] {
  const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
  return Object.values(policies)
    .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement)
    .filter((statement: any) => statement.Action === 's3:ListBucketVersions')
    .map((statement: any) => statement.Condition?.StringLike?.['s3:prefix']);
}

describe('WebFunctionCode', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('WebFunctionCode.fromBucket', () => {
    test('creates bucket code with version', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      const key = 'my-function.zip';
      const version = 'v1.0.0';
      const webFunctionCode = WebFunctionCode.fromBucket(bucket, key, version);
      const config = webFunctionCode.bind(stack, { webFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/my-func' });

      expect(config.s3Location).toBeDefined();
      expect(config.s3Location.bucketName).toEqual(bucket.bucketName);
      expect(config.s3Location.objectKey).toEqual(key);
      expect(config.s3Location.objectVersion).toEqual(version);
    });

    test.each(['code/*.zip', 'code?.zip', 'code/${aws:username}.zip', '/code.zip'])(
      'rejects a key that would widen the read grant: %s', (key) => {
        const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
        expect(() => WebFunctionCode.fromBucket(bucket, key).bind(stack, {
          webFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/my-func',
        })).toThrow(/must not start with '\/' or contain/);
      });

    test('accepts a deploy-time key without checking it', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      const key = new cdk.CfnParameter(stack, 'Key').valueAsString;
      expect(() => WebFunctionCode.fromBucket(bucket, key).bind(stack, {
        webFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:web-function/my-func',
      })).not.toThrow();
    });

    test('creates WebFunction with bucket code', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
        BuildConfig: {
          CodeConfig: {
            S3Object: {
              Bucket: {
                Ref: Match.stringLikeRegexp('TestBucket.*'),
              },
              Key: 'my-function.zip',
            },
          },
        },
      });
    });

    test('grants the Lambda service principal read access scoped to the object key and the function revisions', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        webFunctionName: 'my-fn',
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
              Action: ['s3:GetObject', 's3:GetObjectVersion'],
              Resource: {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': [Match.stringLikeRegexp('TestBucket.*'), 'Arn'] },
                  '/my-function.zip',
                ]],
              },
              Condition: Match.exact({
                StringEquals: {
                  'aws:SourceAccount': { Ref: 'AWS::AccountId' },
                },
                ArnLike: {
                  // The service presents the revision ARN as aws:SourceArn; the
                  // revision id is generated server-side, so only it is wildcarded.
                  'aws:SourceArn': {
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':',
                      { Ref: 'AWS::AccountId' }, ':web-function/my-fn/revision/*',
                    ]],
                  },
                },
              }),
            }),
          ]),
        },
      });
    });

    test('validation fails at synth when an in-app bucket is not versioned', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket');
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(/must have versioning enabled/);
    });

    test('validation fails at synth when an in-app bucket uses the AWS-managed KMS key', () => {
      // `encryptionKey` is undefined here just as it is for SSE-S3, so the two are told apart
      // on the L1: a KMS algorithm with no key id means the key policy is AWS's to control.
      const bucket = new s3.Bucket(stack, 'TestBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.KMS_MANAGED,
      });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(/AWS-managed KMS key/);
    });

    // The AWS-managed key can also be named explicitly by its alias, as a literal or as an
    // alias ARN built from the stack's partition, Region and account.
    test.each([
      ['the literal alias', (_s: cdk.Stack) => 'alias/aws/s3'],
      ['an imported alias', (s: cdk.Stack) => kms.Alias.fromAliasName(s, 'S3Key', 'alias/aws/s3').keyArn],
    ])('rejects the AWS-managed key named by %s', (_name, keyId) => {
      const bucket = new s3.Bucket(stack, 'CodeBucket', { versioned: true });
      (bucket.node.defaultChild as s3.CfnBucket).bucketEncryption = {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms', kmsMasterKeyId: keyId(stack) },
        }],
      };
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'code.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(/encrypted with an AWS-managed KMS key/);
    });

    test('accepts a customer managed key named by its alias', () => {
      const bucket = new s3.Bucket(stack, 'CodeBucket', { versioned: true });
      (bucket.node.defaultChild as s3.CfnBucket).bucketEncryption = {
        serverSideEncryptionConfiguration: [{
          serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms', kmsMasterKeyId: 'alias/my-s3-key' },
        }],
      };
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'code.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('validation fails at synth for dual-layer encryption with the AWS-managed key', () => {
      // DSSE_MANAGED has the same problem under a different algorithm name.
      const bucket = new s3.Bucket(stack, 'TestBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.DSSE_MANAGED,
      });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(/AWS-managed KMS key/);
    });

    test('accepts SSE-S3 and a customer managed key', () => {
      const s3Managed = new s3.Bucket(stack, 'S3ManagedBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.S3_MANAGED,
      });
      const cmk = new s3.Bucket(stack, 'CmkBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.KMS,
      });
      new WebFunction(stack, 'S3ManagedFunction', {
        code: WebFunctionCode.fromBucket(s3Managed, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });
      new WebFunction(stack, 'CmkFunction', {
        code: WebFunctionCode.fromBucket(cmk, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('skips the encryption check for an imported bucket', () => {
      // Nothing to inspect, so an imported bucket is assumed compatible — the risk is
      // documented rather than validated.
      const bucket = s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'my-code-bucket');
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('does not throw or add a policy for an imported bucket, and emits a warning', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'Imported', 'my-existing-bucket');
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::S3::BucketPolicy', 0);
      template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
        BuildConfig: {
          CodeConfig: {
            S3Object: {
              Bucket: 'my-existing-bucket',
              Key: 'my-function.zip',
            },
          },
        },
      });

      // The warning must name all three requirements, because none of them are checked
      // for an imported bucket.
      const warning = Annotations.fromStack(stack).findWarning(
        '*', Match.stringLikeRegexp('Cannot inspect or modify the imported bucket'),
      );
      expect(warning).toHaveLength(1);
      expect(warning[0].entry.data).toMatch(/versioning enabled/);
      expect(warning[0].entry.data).toMatch(/AWS managed KMS key/);
      expect(warning[0].entry.data).toMatch(/s3:GetObject and s3:GetObjectVersion/);
    });

    test('grants kms:Decrypt to the Lambda service principal on a CMK-encrypted bucket', () => {
      const key = new kms.Key(stack, 'CodeKey');
      const bucket = new s3.Bucket(stack, 'TestBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: key,
      });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Effect: 'Allow',
              Action: 'kms:Decrypt',
              Principal: { Service: 'lambda.amazonaws.com' },
              Condition: Match.exact({
                StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
                ArnLike: {
                  'aws:SourceArn': {
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':',
                      { Ref: 'AWS::AccountId' }, ':web-function/*/revision/*',
                    ]],
                  },
                },
              }),
            }),
          ]),
        },
      });
    });

    test('emits a warning when the CMK is imported', () => {
      const importedKey = kms.Key.fromKeyArn(
        stack, 'ImportedKey',
        'arn:aws:kms:us-east-1:111111111111:key/abc-123',
      );
      const bucket = new s3.Bucket(stack, 'TestBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: importedKey,
      });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      Annotations.fromStack(stack).hasWarning(
        '*',
        Match.stringLikeRegexp('Cannot grant kms:Decrypt to lambda.amazonaws.com on the imported KMS key'),
      );
    });
  });

  describe('WebFunctionCode.fromAssetToManagedBucket', () => {
    const minimalStaged = (overrides: Record<string, any> = {}) => ({
      code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
      runtime: WebFunctionRuntime.NODEJS_24_X,
      defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      ...overrides,
    });

    test('rejects a single file that is not a .zip', () => {
      // A raw file would be copied as-is to a .zip key and fail only at deployment.
      const file = path.join(ASSET_PATH, 'index.py');

      expect(() => new WebFunction(stack, 'TestFunction', minimalStaged({
        code: WebFunctionCode.fromAssetToManagedBucket(file),
      }))).toThrow(/Asset must be a .zip file or a directory \(.*index\.py\)/);
    });

    test('accepts a .zip file', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged({
        code: WebFunctionCode.fromAssetToManagedBucket(path.join(__dirname, 'handler.zip')),
      }));

      Template.fromStack(stack).resourceCountIs('Custom::S3ObjectCopy', 1);
    });

    test('lets the copy handler write anywhere in the managed bucket\'s code segment', () => {
      // The handler is shared by every function in the stack. A per-function put grant would
      // add one statement per function to its role; one pattern per bucket does not grow.
      new WebFunction(stack, 'TestFunction', minimalStaged());

      expect(putGrantKeyPatterns(stack)).toEqual(['/web-function/*']);
    });

    test('lets the copy handler delete every code object in the managed bucket', () => {
      // The bucket is CDK-owned and holds only WebFunction code, all of it under one segment.
      new WebFunction(stack, 'TestFunction', minimalStaged());

      expect(deleteGrantKeyPatterns(stack)).toEqual(['/web-function/*']);
    });

    test('grants no version listing', () => {
      // The copy deletes the one version it wrote, named by its physical ID.
      new WebFunction(stack, 'TestFunction', minimalStaged());

      expect(listGrantPrefixConditions(stack)).toEqual([]);
    });

    test('writes the code object under the reserved segment', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationKeyPrefix: Match.stringLikeRegexp('^web-function/[A-Za-z0-9]+/$'),
      });
    });

    test('creates a compliant per-stack code bucket', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: { Status: 'Enabled' },
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' },
          }],
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });

      // enforceSSL renders as a policy statement, not a bucket property.
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Effect: 'Deny',
              Action: 's3:*',
              Principal: { AWS: '*' },
              Condition: { Bool: { 'aws:SecureTransport': 'false' } },
            }),
          ]),
        },
      });
    });

    test('grants the Lambda service principal read access on the code segment', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
              Action: ['s3:GetObject', 's3:GetObjectVersion'],
              Resource: {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': [Match.stringLikeRegexp('AWSCDKWebFunctionAssetBucket.*'), 'Arn'] },
                  '/web-function/*',
                ]],
              },
              Condition: Match.exact({
                StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
                ArnLike: {
                  // One statement covers every function sharing the bucket, so the source
                  // is any WebFunction revision in this account rather than one function's.
                  'aws:SourceArn': {
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':',
                      { Ref: 'AWS::AccountId' }, ':web-function/*/revision/*',
                    ]],
                  },
                },
              }),
            }),
          ]),
        },
      });
    });

    test('creates a copy custom resource and pins the version it wrote', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      const template = Template.fromStack(stack);
      template.resourceCountIs('Custom::S3ObjectCopy', 1);
      template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
        BuildConfig: {
          CodeConfig: {
            // The full address resolves through the copy CR's outputs — what was actually
            // written — not literals reassembled from the construct's inputs.
            S3Object: {
              Bucket: { 'Fn::GetAtt': [Match.stringLikeRegexp('.*CodeCopy.*'), 'Bucket'] },
              Key: { 'Fn::GetAtt': [Match.stringLikeRegexp('.*CodeCopy.*'), 'Key'] },
              VersionId: { 'Fn::GetAtt': [Match.stringLikeRegexp('.*CodeCopy.*'), 'VersionId'] },
            },
          },
        },
      });
    });

    test('two functions in one stack share a single bucket but get their own copy', () => {
      new WebFunction(stack, 'First', minimalStaged());
      new WebFunction(stack, 'Second', minimalStaged());

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::S3::Bucket', 1);
      template.resourceCountIs('Custom::S3ObjectCopy', 2);
    });

    test('the shared bucket hangs off the stack, not off whichever function needed it first', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      // A stack-level construct id keeps the logical ID independent of declaration order.
      expect(stack.node.tryFindChild('AWSCDKWebFunctionAssetBucket')).toBeDefined();
    });

    test('destroys the bucket and its objects by default', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      const template = Template.fromStack(stack);
      template.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Delete' });
      template.resourceCountIs('Custom::S3AutoDeleteObjects', 1);
    });

    test('the revision is not created before the shared bucket policy exists', () => {
      // The service reads the code through the bucket policy when the revision is created, so
      // CloudFormation must be told about the ordering: the policy is a separate resource with
      // no implicit edge to the revision.
      new WebFunction(stack, 'TestFunction', minimalStaged());

      const template = Template.fromStack(stack);
      const [policyId] = Object.keys(template.findResources('AWS::S3::BucketPolicy'));
      template.hasResource('AWS::Lambda::WebFunctionRevision', {
        DependsOn: Match.arrayWith([policyId]),
      });
      template.hasResource('Custom::S3ObjectCopy', {
        DependsOn: Match.arrayWith([policyId]),
      });
    });

    test('throws when the reserved construct id is occupied by an unrelated construct', () => {
      new Construct(stack, 'AWSCDKWebFunctionAssetBucket');

      expect(() => {
        new WebFunction(stack, 'TestFunction', {
          code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
        });
      }).toThrow(/reserved for the code bucket/);
    });

    test('recognizes a bucket marked by another copy of the library instead of reporting a collision', () => {
      // Two copies of aws-cdk-lib in one app share the construct tree but not module state. The
      // marker is a `Symbol.for` key, so a bucket stamped by one copy is adopted by the other.
      const bucket = new s3.Bucket(stack, 'AWSCDKWebFunctionAssetBucket', { versioned: true });
      Object.defineProperty(bucket, Symbol.for('@aws-cdk/aws-lambda.WebFunctionAssetBucket'), {
        value: cdk.RemovalPolicy.DESTROY,
      });

      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    });

    test('throws when the reserved construct id is occupied by a customer bucket', () => {
      // A customer bucket type-checks, but skips the configuration (versioning, encryption,
      // service-principal policy) the managed bucket relies on — so it must be rejected too.
      new s3.Bucket(stack, 'AWSCDKWebFunctionAssetBucket');

      expect(() => {
        new WebFunction(stack, 'TestFunction', {
          code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
        });
      }).toThrow(/reserved for the code bucket/);
    });
  });

  describe('WebFunctionCode.fromAssetToProvidedBucket', () => {
    test('copies into the supplied bucket and creates no bucket of its own', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      const template = Template.fromStack(stack);
      // Only the customer's bucket — no AWSCDKWebFunctionAssetBucket.
      template.resourceCountIs('AWS::S3::Bucket', 1);
      expect(stack.node.tryFindChild('AWSCDKWebFunctionAssetBucket')).toBeUndefined();
      template.hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationBucketName: { Ref: Match.stringLikeRegexp('MyBucket.*') },
      });
    });

    describe('the copy resource', () => {
      // The copy represents the code object of one revision. Its resource is replaced, through a
      // new physical ID, whenever the content or the revision's configuration changes, and is a
      // new resource only when it needs another copy function, whose ServiceToken it cannot
      // take over.
      interface Setup {
        readonly bucket: s3.IBucket;
        readonly assetPath?: string;
        readonly options?: WebFunctionProvidedBucketAssetOptions;
        readonly timeout?: cdk.Duration;
      }
      const copyOf = (configure: (s: cdk.Stack) => Setup, adjust?: (fn: WebFunction) => void) => {
        const s = new cdk.Stack();
        const { bucket, assetPath, options, timeout } = configure(s);
        const fn = new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(bucket, assetPath ?? ASSET_PATH, options),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          timeout,
        });
        adjust?.(fn);
        const copies = Template.fromStack(s).findResources('Custom::S3ObjectCopy');
        const [logicalId] = Object.keys(copies);
        const { DestinationKeyPrefix, ContentHash, Configuration } = copies[logicalId].Properties;
        return { logicalId, prefix: DestinationKeyPrefix, contentHash: ContentHash, configuration: Configuration };
      };
      const owned = (s: cdk.Stack) => new s3.Bucket(s, 'MyBucket', { versioned: true, bucketName: 'my-bucket' });
      const original = () => copyOf(s => ({ bucket: owned(s) }));

      test('keeps its logical ID and changes its content hash for new code', () => {
        const before = original();
        const after = copyOf(s => ({ bucket: owned(s), assetPath: path.join(__dirname, 'handler.zip') }));
        expect(after.logicalId).toEqual(before.logicalId);
        expect(after.contentHash).not.toEqual(before.contentHash);
      });

      test('keeps its logical ID and passes the new configuration when only the revision changes', () => {
        const before = original();
        const after = copyOf(s => ({ bucket: owned(s), timeout: cdk.Duration.seconds(60) }));
        expect(after.logicalId).toEqual(before.logicalId);
        expect(after.contentHash).toEqual(before.contentHash);
        expect(after.configuration).not.toEqual(before.configuration);
      });

      test('carries the revision configuration without the code location', () => {
        const { configuration } = original();
        expect(Object.keys(configuration.Properties).sort()).toEqual(['BuildConfig', 'FunctionName', 'ServiceConfig']);
        expect(Object.keys(configuration.Properties.BuildConfig)).toEqual(['RuntimeConfig']);
      });

      test('passes a fingerprint of the environment, not its values', () => {
        const s = new cdk.Stack();
        // The validator does not list WebFunctionRevision among the properties that accept an
        // SSM SecureString reference; the revision itself is not what this test is about.
        cdk.Validations.of(s).acknowledge({ id: 'CloudFormation-Validate::E1027', reason: 'ssm-secure on the revision' });
        const role = new iam.Role(s, 'Other', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: {
            SECRET: cdk.SecretValue.secretsManager('my-secret').unsafeUnwrap(),
            SECURE: cdk.SecretValue.ssmSecure('/my/param').unsafeUnwrap(),
            PLAIN: 'plain-value',
            ROLE: role.roleArn,
            JOINED: `joined-literal-${role.roleArn}`,
          },
        });
        const [copy] = Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'));
        const properties = JSON.stringify(copy.Properties);
        expect(properties).not.toContain('{{resolve:');
        expect(properties).not.toContain('plain-value');
        expect(properties).not.toContain('joined-literal-');
        // A value only known at deployment is kept, so it still changes the key.
        expect(copy.Properties.Configuration.Properties.ServiceConfig.EnvironmentVariables.ROLE).toEqual(
          { 'Fn::GetAtt': [s.getLogicalId(role.node.defaultChild as cdk.CfnElement), 'Arn'] });
      });

      test('one code object bound to two functions gives each copy its own function\'s configuration', () => {
        cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });
        const code = WebFunctionCode.fromAssetToProvidedBucket(owned(stack), ASSET_PATH);
        const first = new WebFunction(stack, 'First', {
          code,
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          timeout: cdk.Duration.seconds(10),
        });
        const second = new WebFunction(stack, 'Second', {
          code,
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          timeout: cdk.Duration.seconds(20),
        });
        first.resourceRevision.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

        const copies = Template.fromStack(stack).findResources('Custom::S3ObjectCopy');
        const copyFor = (fn: WebFunction) => {
          const id = Object.keys(copies).find((logicalId) => logicalId.startsWith(fn.node.id))!;
          return copies[id];
        };
        const functionRef = (fn: WebFunction) => ({ Ref: stack.getLogicalId(fn.resource) });
        const config = (fn: WebFunction) => copyFor(fn).Properties.Configuration.Properties;
        expect(config(first).FunctionName).toEqual(functionRef(first));
        expect(config(second).FunctionName).toEqual(functionRef(second));
        expect(config(first).ServiceConfig.TimeoutSeconds).toEqual(10);
        expect(config(second).ServiceConfig.TimeoutSeconds).toEqual(20);
        expect(copyFor(first).DeletionPolicy).toEqual('Retain');
        expect(copyFor(second).DeletionPolicy).toEqual('Delete');
      });

      test('passes no secure reference used inside Fn::Sub, Fn::If or Fn::Select', () => {
        const s = new cdk.Stack();
        cdk.Validations.of(s).acknowledge({ id: 'CloudFormation-Validate::E1027', reason: 'secure references on the revision' });
        const role = new iam.Role(s, 'Other', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
        const param = new cdk.CfnParameter(s, 'Env');
        const condition = new cdk.CfnCondition(s, 'IsProd', { expression: cdk.Fn.conditionEquals(param.valueAsString, 'prod') });
        const secret = '{{resolve:secretsmanager:db:SecretString:password}}';
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: {
            SUB: cdk.Fn.sub(`postgres://\${AWS::AccountId}:${secret}@host`),
            SUB_VARS: cdk.Fn.sub('postgres://${User}@host', { User: secret }),
            IF: cdk.Fn.conditionIf(condition.logicalId, secret, 'none').toString(),
            SELECT: cdk.Fn.select(0, [secret, role.roleArn]),
          },
        });
        const [copy] = Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'));
        expect(JSON.stringify(copy.Properties)).not.toContain('{{resolve:');
        const env = copy.Properties.Configuration.Properties.ServiceConfig.EnvironmentVariables;
        // Placeholders and condition names stay, so the template still resolves at deployment.
        expect(env.SUB['Fn::Sub']).toContain('${AWS::AccountId}');
        expect(env.SUB_VARS['Fn::Sub'][0]).toContain('${User}');
        expect(env.IF['Fn::If'][0]).toEqual('IsProd');
        // Any other intrinsic is replaced by a hash, with the references inside it kept apart.
        expect(typeof env.SELECT).toEqual('string');
        expect(copy.Properties.Configuration.References)
          .toContainEqual({ 'Fn::GetAtt': [s.getLogicalId(role.node.defaultChild as cdk.CfnElement), 'Arn'] });
      });

      test('passes no secure reference used inside any other intrinsic, nested or not', () => {
        const s = new cdk.Stack();
        cdk.Validations.of(s).acknowledge({ id: 'CloudFormation-Validate::E1027', reason: 'secure references on the revision' });
        const secret = '{{resolve:secretsmanager:db:SecretString:password}}';
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: {
            BASE64: cdk.Fn.base64(`admin:${secret}`),
            SPLIT: cdk.Fn.select(1, cdk.Fn.split(':', `a:${secret}`)),
            IN_JOIN: cdk.Fn.join('', ['x', cdk.Fn.base64(secret)]),
            IN_SUB_VARS: cdk.Fn.sub('${V}', { V: cdk.Fn.base64(secret) }),
          },
        });
        const [copy] = Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'));
        expect(JSON.stringify(copy.Properties)).not.toContain('{{resolve:');
        expect(JSON.stringify(copy.Properties)).not.toContain('Fn::Base64');
      });

      test('keeps a reference inside a conditional branch conditional', () => {
        const s = new cdk.Stack();
        const param = new cdk.CfnParameter(s, 'Env');
        const condition = new cdk.CfnCondition(s, 'IsProd', { expression: cdk.Fn.conditionEquals(param.valueAsString, 'prod') });
        const role = new iam.Role(s, 'Other', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: {
            IF: cdk.Fn.conditionIf(condition.logicalId, cdk.Fn.base64(role.roleArn), 'none').toString(),
          },
        });
        const [copy] = Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'));
        expect(copy.Properties.Configuration.References).toEqual([{
          'Fn::If': ['IsProd', [{ 'Fn::GetAtt': [s.getLogicalId(role.node.defaultChild as cdk.CfnElement), 'Arn'] }], []],
        }]);
      });

      test('keeps a conditional reference inside a hashed intrinsic conditional', () => {
        const s = new cdk.Stack();
        const param = new cdk.CfnParameter(s, 'Env');
        const condition = new cdk.CfnCondition(s, 'IsProd', { expression: cdk.Fn.conditionEquals(param.valueAsString, 'prod') });
        const role = new iam.Role(s, 'Other', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: {
            BASE64: cdk.Fn.base64(cdk.Fn.conditionIf(condition.logicalId, role.roleArn, 'none').toString()),
          },
        });
        const [copy] = Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'));
        expect(copy.Properties.Configuration.References).toEqual([{
          'Fn::If': ['IsProd', [{ 'Fn::GetAtt': [s.getLogicalId(role.node.defaultChild as cdk.CfnElement), 'Arn'] }], []],
        }]);
      });

      test('fails synthesis rather than pass on a dynamic reference it cannot hash', () => {
        const s = new cdk.Stack();
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
          environment: { IMPORTED: cdk.Fn.importValue('{{resolve:ssm:/export/name}}') },
        });
        expect(() => Template.fromStack(s)).toThrow(/dynamic reference .* would reach the code copy/);
      });

      test('sees property overrides on the revision', () => {
        const before = original();
        const after = copyOf((s) => ({ bucket: owned(s) }), (fn) => {
          fn.resourceRevision.addPropertyOverride('ServiceConfig.TimeoutSeconds', 60);
        });
        expect(after.configuration).not.toEqual(before.configuration);
      });

      test('a changed environment value changes the configuration', () => {
        const withEnv = (value: string) => {
          const s = new cdk.Stack();
          new WebFunction(s, 'TestFunction', {
            code: WebFunctionCode.fromAssetToProvidedBucket(owned(s), ASSET_PATH),
            runtime: WebFunctionRuntime.NODEJS_24_X,
            defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
            environment: { A: value },
          });
          return Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy'))[0].Properties.Configuration;
        };
        expect(withEnv('one')).not.toEqual(withEnv('two'));
        expect(withEnv('one')).toEqual(withEnv('one'));
      });

      test.each<[string, (s: cdk.Stack) => Setup]>([
        ['a new key prefix', s => ({ bucket: owned(s), options: { keyPrefix: 'b/' } })],
        ['the same bucket imported by name', s => ({ bucket: s3.Bucket.fromBucketName(s, 'MyBucket', 'my-bucket') })],
        ['a copy function in a VPC', s => ({
          bucket: owned(s), options: { copyOptions: { vpc: new ec2.Vpc(s, 'Vpc') } },
        })],
      ])('is a new resource for %s, which needs another copy function', (_name, configure) => {
        expect(copyOf(configure).logicalId).not.toEqual(original().logicalId);
      });

      test('nothing changes when nothing does', () => {
        expect(original()).toEqual(original());
      });
    });

    test('the read grant stays the same when the code changes', () => {
      // The revision being replaced keeps reading its own object until the deployment completes,
      // so the bucket policy must not move to the new object alone.
      const readGrant = (assetPath: string) => {
        const s = new cdk.Stack();
        const bucket = new s3.Bucket(s, 'MyBucket', { versioned: true });
        new WebFunction(s, 'TestFunction', {
          code: WebFunctionCode.fromAssetToProvidedBucket(bucket, assetPath),
          runtime: WebFunctionRuntime.NODEJS_24_X,
          defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
        });
        return Template.fromStack(s).findResources('AWS::S3::BucketPolicy');
      };
      expect(readGrant(path.join(__dirname, 'handler.zip'))).toEqual(readGrant(ASSET_PATH));
    });

    test('lets the copy handler delete under the key prefix only', () => {
      // Renaming the construct replaces the copy resource and the old key must still be
      // deletable, so the grant covers the caller's prefix rather than the single key — but
      // nothing outside it.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(deleteGrantKeyPatterns(stack)).toEqual(['/webfunctions/web-function/*']);
    });

    test('cannot write outside the code segment under the caller\'s prefix', () => {
      // Wider than the single key so the shared handler role does not grow per function, but
      // still confined to what this module writes: the caller's own objects stay out of reach.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(putGrantKeyPatterns(stack)).toEqual(['/webfunctions/web-function/*']);
    });

    test('cannot enumerate the caller\'s bucket', () => {
      // A version listing is bucket-level; the copy handler does not need one, so it gets none.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(listGrantPrefixConditions(stack)).toEqual([]);
    });

    test('never grants delete on the whole of a provided bucket, even without a prefix', () => {
      // The caller's bucket may hold unrelated data. The reserved segment bounds the grant to
      // what this module writes, so omitting keyPrefix does not widen it to `*`.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(deleteGrantKeyPatterns(stack)).toEqual(['/web-function/*']);
    });

    test.each(['/apps/', 'apps/*', 'app?/', 'apps/${aws:username}/'])('rejects keyPrefix %p', (keyPrefix) => {
      // The prefix scopes the copy function's grants on the caller's bucket, where these would widen them.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });

      expect(() => new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, { keyPrefix }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      })).toThrow(/keyPrefix .* must not start with '\/' or contain/);
    });

    test('rejects a keyPrefix that cannot be checked', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });

      expect(() => new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: new cdk.CfnParameter(stack, 'Prefix').valueAsString,
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      })).toThrow(/keyPrefix must be a literal string, not a deploy-time value/);
    });

    test('applies keyPrefix to the destination key', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationKeyPrefix: Match.stringLikeRegexp('^webfunctions/web-function/[A-Za-z0-9]+/$'),
      });
    });

    test('grants the Lambda service principal read access on the copied object', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      // Scoped to this function's objects, not to the whole bucket: the caller owns the bucket
      // and may keep unrelated objects in it.
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Principal: { Service: 'lambda.amazonaws.com' },
              Action: ['s3:GetObject', 's3:GetObjectVersion'],
              Resource: {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': [Match.stringLikeRegexp('MyBucket.*'), 'Arn'] },
                  Match.stringLikeRegexp('^/web-function/[A-Za-z0-9]+/\\*$'),
                ]],
              },
              Condition: {
                StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
              },
            }),
          ]),
        },
      });
    });

    test('validation fails at synth when an in-app bucket is not versioned', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket');

      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      // The error names this factory, not `fromBucket()`, so the message points at the
      // call the customer actually made.
      expect(() => Template.fromStack(stack)).toThrow(
        /fromAssetToProvidedBucket\(\) must have versioning enabled/,
      );
    });

    test('rejects a bucket encrypted with the AWS-managed KMS key', () => {
      // The same constraint as `fromBucket`: the service reads the object as
      // lambda.amazonaws.com, which can only be authorized on a key policy we can edit.
      const bucket = new s3.Bucket(stack, 'MyBucket', {
        versioned: true,
        encryption: s3.BucketEncryption.KMS_MANAGED,
      });

      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(
        /fromAssetToProvidedBucket\(\) is encrypted with an AWS-managed KMS key/,
      );
    });

    test('accepts an imported bucket, deferring the check to deploy time', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'Imported', 'my-existing-bucket');

      expect(() => new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      })).not.toThrow();

      Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationBucketName: 'my-existing-bucket',
      });
    });
  });

  describe('copy custom resource configuration', () => {
    test('passes copyOptions through to the copy handler', () => {
      const vpc = new ec2.Vpc(stack, 'Vpc');
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH, {
          copyOptions: { vpc },
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
      });

      // The copy handler is the singleton Lambda behind Custom::S3ObjectCopy.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.objectLike({
          SubnetIds: Match.anyValue(),
        }),
      });
    });
  });

  describe('retention', () => {
    const managed = (s: cdk.Stack, id = 'Fn') => new WebFunction(s, id, {
      code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
      runtime: WebFunctionRuntime.NODEJS_24_X,
      defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
    });
    const policies = (resource: any) => ({ DeletionPolicy: resource.DeletionPolicy, UpdateReplacePolicy: resource.UpdateReplacePolicy });
    const copyPolicies = (s: cdk.Stack) => Object.values(Template.fromStack(s).findResources('Custom::S3ObjectCopy')).map(policies);
    const bucketPolicies = (s: cdk.Stack) => policies(Object.values(Template.fromStack(s).findResources('AWS::S3::Bucket'))[0]);
    const autoDeletePolicies = (s: cdk.Stack) =>
      Object.values(Template.fromStack(s).findResources('Custom::S3AutoDeleteObjects')).map(policies);
    const bucketPolicyPolicies = (s: cdk.Stack) =>
      Object.values(Template.fromStack(s).findResources('AWS::S3::BucketPolicy')).map(policies);
    const provided = (s: cdk.Stack, bucket: s3.IBucket, id = 'Fn') => new WebFunction(s, id, {
      code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
      runtime: WebFunctionRuntime.NODEJS_24_X,
      defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
    });
    const DELETE = { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' };
    const RETAIN = { DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain' };

    test('copy, bucket and auto-delete are deleted when no revision is retained', () => {
      managed(stack);

      expect(copyPolicies(stack)).toEqual([DELETE]);
      expect(bucketPolicies(stack)).toEqual(DELETE);
      expect(autoDeletePolicies(stack)).toEqual([DELETE]);
      expect(bucketPolicyPolicies(stack)).toEqual([{ DeletionPolicy: undefined, UpdateReplacePolicy: undefined }]);
      Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('code bucket .* are retained'));
    });

    test('a retained revision retains its copy, the bucket, its policy and the auto-delete resource, and warns', () => {
      const fn = managed(stack);
      fn.resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      expect(copyPolicies(stack)).toEqual([RETAIN]);
      expect(bucketPolicies(stack)).toEqual(RETAIN);
      expect(autoDeletePolicies(stack)).toEqual([RETAIN]);
      expect(bucketPolicyPolicies(stack)).toEqual([RETAIN]);
      Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('code bucket .* are retained'));
    });

    test.each([false, true])('follows a removal policy applied by an aspect (aspectStabilization: %s)', (stabilization) => {
      const app = new cdk.App({ context: { '@aws-cdk/core:aspectStabilization': stabilization } });
      const s = new cdk.Stack(app, 'Stack');
      managed(s);
      cdk.RemovalPolicies.of(s).retain({ applyToResourceTypes: ['AWS::Lambda::WebFunctionRevision'] });

      // The warning is checked first: a second synthesis runs the aspects again, by which time the
      // first one has already set the policy.
      Annotations.fromStack(s).hasWarning('*', Match.stringLikeRegexp('code bucket .* are retained'));
      expect(copyPolicies(s)).toEqual([RETAIN]);
      expect(bucketPolicies(s)).toEqual(RETAIN);
      expect(bucketPolicyPolicies(s)).toEqual([RETAIN]);
    });

    test('retains the bucket for a revision of a function defined after the bucket', () => {
      managed(stack, 'First');
      const second = managed(stack, 'Second');
      second.resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      expect(bucketPolicies(stack)).toEqual(RETAIN);
      expect(copyPolicies(stack)).toEqual(expect.arrayContaining([DELETE, RETAIN]));
    });

    test('a revision retained on replacement only keeps its copy except after a failed first create', () => {
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });
      const fn = managed(stack);
      fn.resourceRevision.cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

      expect(copyPolicies(stack)).toEqual([{ DeletionPolicy: 'RetainExceptOnCreate', UpdateReplacePolicy: 'Retain' }]);
    });

    test('RETAIN_ON_UPDATE_OR_DELETE keeps RetainExceptOnCreate for everything the revision depends on', () => {
      const fn = managed(stack);
      fn.resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE);

      const EXCEPT_ON_CREATE = { DeletionPolicy: 'RetainExceptOnCreate', UpdateReplacePolicy: 'Retain' };
      expect(copyPolicies(stack)).toEqual([EXCEPT_ON_CREATE]);
      expect(bucketPolicies(stack)).toEqual(EXCEPT_ON_CREATE);
      expect(autoDeletePolicies(stack)).toEqual([EXCEPT_ON_CREATE]);
      expect(bucketPolicyPolicies(stack)).toEqual([EXCEPT_ON_CREATE]);
    });

    test('a later aspect still sets a value on the revision that the retention warning has rendered', () => {
      const app = new cdk.App();
      const s = new cdk.Stack(app, 'Stack');
      let value = 'before';
      const fn = new WebFunction(s, 'Fn', {
        code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
        environment: { VALUE: cdk.Lazy.string({ produce: () => value }) },
      });
      fn.resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      // The endpoint comes after the revision in the tree, so this runs after the revision is visited.
      cdk.Aspects.of(s).add({ visit: (node) => { if (node === fn.endpoint) { value = 'after'; } } });

      const [revision] = Object.values(Template.fromStack(s).findResources('AWS::Lambda::WebFunctionRevision'));
      expect(revision.Properties.ServiceConfig.EnvironmentVariables.VALUE).toEqual('after');
      Annotations.fromStack(s).hasWarning('*', Match.stringLikeRegexp('code bucket .* are retained'));
    });

    test('keeps an override already on a provided bucket policy', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'], principals: [new iam.AccountRootPrincipal()], resources: [bucket.arnForObjects('*')],
      }));
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'only the deletion policy is set' });
      (bucket.policy!.node.defaultChild as cdk.CfnResource).addOverride('DeletionPolicy', 'Retain');
      provided(stack, bucket);

      expect(Object.values(Template.fromStack(stack).findResources('AWS::S3::BucketPolicy'))[0].DeletionPolicy)
        .toEqual('Retain');
    });

    test('a revision retained on deletion only keeps its copy on deletion, not on replacement', () => {
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });
      const fn = managed(stack);
      fn.resourceRevision.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

      expect(copyPolicies(stack)).toEqual([{ DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Delete' }]);
    });

    test('follows a removal policy set with an escape hatch on the revision', () => {
      const fn = managed(stack);
      fn.resourceRevision.addOverride('DeletionPolicy', 'Retain');
      fn.resourceRevision.addOverride('UpdateReplacePolicy', 'Retain');

      expect(copyPolicies(stack)).toEqual([RETAIN]);
      expect(bucketPolicies(stack)).toEqual(RETAIN);
    });

    test('carries RetainExceptOnCreate rather than retaining outright', () => {
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });
      const fn = managed(stack);
      fn.resourceRevision.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN_EXCEPT_ON_CREATE;

      const EXCEPT_ON_CREATE = { DeletionPolicy: 'RetainExceptOnCreate', UpdateReplacePolicy: 'Retain' };
      expect(copyPolicies(stack)).toEqual([{ DeletionPolicy: 'RetainExceptOnCreate', UpdateReplacePolicy: 'Delete' }]);
      expect(bucketPolicies(stack)).toEqual(EXCEPT_ON_CREATE);
      expect(autoDeletePolicies(stack)).toEqual([EXCEPT_ON_CREATE]);
      expect(bucketPolicyPolicies(stack)).toEqual([EXCEPT_ON_CREATE]);
    });

    test('a shared bucket takes the strongest policy of the revisions using it', () => {
      managed(stack, 'First').resourceRevision.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN_EXCEPT_ON_CREATE;
      managed(stack, 'Second').resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });

      expect(bucketPolicies(stack)).toEqual(RETAIN);
    });

    test('a retained revision in a provided bucket retains its copy and the bucket policy, and leaves the bucket alone', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      const fn = provided(stack, bucket);
      fn.resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      expect(copyPolicies(stack)).toEqual([RETAIN]);
      expect(bucketPolicies(stack)).toEqual(RETAIN); // the s3.Bucket default
      expect(bucketPolicyPolicies(stack)).toEqual([RETAIN]);
      Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('code bucket .* are retained'));
    });

    test('a provided bucket policy keeps its own removal policy when no revision is retained', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      provided(stack, bucket);
      expect(Object.values(Template.fromStack(stack).findResources('AWS::S3::BucketPolicy'))[0])
        .not.toHaveProperty('DeletionPolicy');

      const s = new cdk.Stack();
      const retainedBucket = new s3.Bucket(s, 'MyBucket', { versioned: true });
      provided(s, retainedBucket);
      retainedBucket.policy!.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      expect(bucketPolicyPolicies(s)).toEqual([RETAIN]);
    });

    test('a provided bucket policy keeps a stronger policy of its own', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      provided(stack, bucket).resourceRevision.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN_EXCEPT_ON_CREATE;
      bucket.policy!.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3011', reason: 'the policies differ on purpose' });

      expect(bucketPolicyPolicies(stack)).toEqual([RETAIN]);
    });

    test('a provided bucket policy is retained when a later function sharing it has a retained revision', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      provided(stack, bucket, 'First');
      provided(stack, bucket, 'Second').resourceRevision.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      expect(bucketPolicyPolicies(stack)).toEqual([RETAIN]);
    });
  });
});
