import * as path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { WebFunctionAuthType, WebFunction } from '../lib/webfunction';
import { WebFunctionCode } from '../lib/webfunction-code';
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
      const config = webFunctionCode.bind(stack);

      expect(config.s3Location).toBeDefined();
      expect(config.s3Location.bucketName).toEqual(bucket.bucketName);
      expect(config.s3Location.objectKey).toEqual(key);
      expect(config.s3Location.objectVersion).toEqual(version);
    });

    test('creates WebFunction with bucket code', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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

    test('bind without a function identity scopes the read policy to the account only', () => {
      const bucket = new s3.Bucket(stack, 'TestBucket', { versioned: true });
      WebFunctionCode.fromBucket(bucket, 'my-function.zip').bind(stack);

      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Principal: { Service: 'lambda.amazonaws.com' },
              Condition: Match.exact({
                StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).toThrow(/AWS-managed KMS key/);
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });
      new WebFunction(stack, 'CmkFunction', {
        code: WebFunctionCode.fromBucket(cmk, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('does not throw or add a policy for an imported bucket, and emits a warning', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'Imported', 'my-existing-bucket');
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
      authType: WebFunctionAuthType.IAM_AUTH,
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

    test('scopes the version listing to the same pattern as the delete grant', () => {
      // Listing versions is bucket-level, so the resource cannot be narrowed; the `s3:prefix`
      // condition is what keeps it from enumerating anything else in the bucket.
      new WebFunction(stack, 'TestFunction', minimalStaged());

      expect(listGrantPrefixConditions(stack)).toEqual(['web-function/*']);
    });

    test('writes the code object under the reserved segment', () => {
      new WebFunction(stack, 'TestFunction', minimalStaged());

      Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationObjectKey: Match.stringLikeRegexp('^web-function/[A-Za-z0-9]+\\.zip$'),
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
          authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
          authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      const template = Template.fromStack(stack);
      // Only the customer's bucket — no AWSCDKWebFunctionAssetBucket.
      template.resourceCountIs('AWS::S3::Bucket', 1);
      expect(stack.node.tryFindChild('AWSCDKWebFunctionAssetBucket')).toBeUndefined();
      template.hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationBucketName: { Ref: Match.stringLikeRegexp('MyBucket.*') },
      });
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      expect(putGrantKeyPatterns(stack)).toEqual(['/webfunctions/web-function/*']);
    });

    test('cannot enumerate the rest of the caller\'s bucket', () => {
      // The delete grant is narrowed by resource, but listing versions is bucket-level. Without
      // the `s3:prefix` condition the copy handler could enumerate every versioned object in a
      // bucket that is not ours.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      expect(listGrantPrefixConditions(stack)).toEqual(['webfunctions/web-function/*']);
    });

    test('never grants delete on the whole of a provided bucket, even without a prefix', () => {
      // The caller's bucket may hold unrelated data. The reserved segment bounds the grant to
      // what this module writes, so omitting keyPrefix does not widen it to `*`.
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      expect(deleteGrantKeyPatterns(stack)).toEqual(['/web-function/*']);
    });

    test('applies keyPrefix to the destination key', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH, {
          keyPrefix: 'webfunctions/',
        }),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
        DestinationObjectKey: Match.stringLikeRegexp('^webfunctions/web-function/[A-Za-z0-9]+\\.zip$'),
      });
    });

    test('grants the Lambda service principal read access on the copied object', () => {
      const bucket = new s3.Bucket(stack, 'MyBucket', { versioned: true });
      new WebFunction(stack, 'TestFunction', {
        code: WebFunctionCode.fromAssetToProvidedBucket(bucket, ASSET_PATH),
        runtime: WebFunctionRuntime.NODEJS_24_X,
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      // Scoped to this function's object, not to the whole bucket: the caller owns the bucket
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
                  Match.stringLikeRegexp('^/.*\\.zip$'),
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
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
        authType: WebFunctionAuthType.IAM_AUTH,
      });

      // The copy handler is the singleton Lambda behind Custom::S3ObjectCopy.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.objectLike({
          SubnetIds: Match.anyValue(),
        }),
      });
    });
  });
});
