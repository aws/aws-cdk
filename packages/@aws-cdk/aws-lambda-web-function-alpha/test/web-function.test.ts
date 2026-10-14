import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnWebFunction, CfnWebFunctionRevision } from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  WebFunction,
  WebFunctionApplicationLogLevel,
  WebFunctionCode,
  WebFunctionSystemLogLevel,
} from '../lib';

const FIXTURE_DIR = path.join(__dirname, 'fixture-app');

let stack: cdk.Stack;

beforeEach(() => {
  const app = new cdk.App();
  stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
});

describe('WebFunction', () => {
  test('creates a function, a revision and an execution role from an asset', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      webFunctionName: 'my-web-function',
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::WebFunction', 1);
    template.resourceCountIs('AWS::Lambda::WebFunctionRevision', 1);
    template.hasResourceProperties('AWS::Lambda::WebFunction', {
      FunctionName: 'my-web-function',
    });
    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      FunctionName: 'my-web-function',
      BuildConfig: {
        CodeConfig: {
          S3Object: {
            Bucket: Match.anyValue(),
            Key: Match.stringLikeRegexp('\\.zip$'),
          },
        },
        RuntimeConfig: {
          Runtime: 'nodejs24.x',
        },
      },
      ServiceConfig: {
        ExecutionRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^WebFunctionRole'), 'Arn'] },
      },
    });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: [Match.objectLike({
          Principal: { Service: 'lambda.amazonaws.com' },
        })],
      }),
      ManagedPolicyArns: [Match.objectLike({
        'Fn::Join': Match.anyValue(),
      })],
    });
  });

  test('copies an asset into a versioned bucket the service can read', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
      BucketEncryption: Match.anyValue(),
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: ['s3:GetObject', 's3:GetObjectVersion'],
          Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
        })]),
      },
    });
    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      BuildConfig: {
        CodeConfig: {
          S3Object: {
            Bucket: { Ref: Match.stringLikeRegexp('^WebFunctionCodeBucket') },
            Key: Match.stringLikeRegexp('\\.zip$'),
            VersionId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^WebFunctionCodeCopy'), 'VersionId'] },
          },
        },
      },
    });
    template.resourceCountIs('AWS::CloudFormation::CustomResource', 1);
  });

  test('revision depends on the function', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      webFunctionName: 'my-web-function',
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::WebFunctionRevision', {
      DependsOn: Match.arrayWith([Match.stringLikeRegexp('^WebFunction[0-9A-F]{8}$')]),
    });
  });

  test('uses code from an existing S3 object, including its version', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-code-bucket');
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromBucket(bucket, 'app.zip', 'v1'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      BuildConfig: {
        CodeConfig: {
          S3Object: {
            Bucket: 'my-code-bucket',
            Key: 'app.zip',
            VersionId: 'v1',
          },
        },
        RuntimeConfig: { Runtime: 'nodejs24.x' },
      },
    });
  });

  test('maps optional service configuration to the revision', () => {
    const logGroup = new logs.LogGroup(stack, 'LogGroup');
    const key = new kms.Key(stack, 'Key');
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromBucket(s3.Bucket.fromBucketName(stack, 'Bucket', 'my-code-bucket'), 'app.zip'),
      description: 'first release',
      runtime: lambda.Runtime.NODEJS_24_X,
      timeout: cdk.Duration.seconds(30),
      maxConcurrencyPerEnvironment: 64,
      environment: { NODE_ENV: 'production' },
      kmsKey: key,
      logGroup,
      applicationLogLevel: WebFunctionApplicationLogLevel.INFO,
      systemLogLevel: WebFunctionSystemLogLevel.WARN,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      Description: 'first release',
      KmsKeyArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Key'), 'Arn'] },
      ServiceConfig: {
        TimeoutSeconds: 30,
        MaxConcurrencyPerEnvironment: 64,
        EnvironmentVariables: { NODE_ENV: 'production' },
        TelemetryConfig: {
          LoggingConfig: {
            LogGroup: { Ref: Match.stringLikeRegexp('^LogGroup') },
            ApplicationLogLevel: 'INFO',
            SystemLogLevel: 'WARN',
          },
        },
      },
    });
  });

  test('uses a provided role', () => {
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com') });
    const fn = new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      role,
    });

    expect(fn.role).toBe(role);
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        ExecutionRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Role'), 'Arn'] },
      },
    });
  });

  test('applies tags to taggable resources', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      tags: { team: 'platform' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunction', {
      Tags: Match.arrayWith([{ Key: 'team', Value: 'platform' }]),
    });
  });

  test('exposes L1 escape hatches and attributes', () => {
    const fn = new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    expect(fn.cfnWebFunction).toBeInstanceOf(CfnWebFunction);
    expect(fn.cfnRevision).toBeInstanceOf(CfnWebFunctionRevision);
    expect(fn.functionArn).toBeDefined();
    expect(fn.revisionId).toBeDefined();
    expect(fn.revisionArn).toBeDefined();
  });

  test('exposes a reference to the function', () => {
    const fn = new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    expect(fn.webFunctionRef).toEqual({ functionArn: fn.functionArn });
  });

  test('generates a function name in an environment-agnostic stack', () => {
    const agnostic = new cdk.Stack(new cdk.App(), 'AgnosticStack');
    new WebFunction(agnostic, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    Template.fromStack(agnostic).hasResourceProperties('AWS::Lambda::WebFunction', {
      FunctionName: Match.stringLikeRegexp('^[a-zA-Z0-9-]{1,64}$'),
    });
  });

  test('generates a function name when none is given', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunction', {
      FunctionName: Match.anyValue(),
    });
  });

  test.each([
    ['too long', 'a'.repeat(65)],
    ['invalid character', 'my.function'],
    ['leading hyphen', '-function'],
    ['trailing underscore', 'function_'],
  ])('rejects a function name that is %s', (_label, functionName) => {
    expect(() => new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      webFunctionName: functionName,
    })).toThrow(/Web function name/);
  });
});

describe('code bucket and key access for the service', () => {
  test('limits the code bucket policy to the revisions of the function', () => {
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Principal: { Service: 'lambda.amazonaws.com' },
          Condition: {
            StringEquals: { 'aws:SourceAccount': '123456789012' },
            ArnLike: { 'aws:SourceArn': Match.anyValue() },
          },
        })]),
      },
    });
  });

  test('grants the service decrypt on a customer managed key', () => {
    const key = new kms.Key(stack, 'Key');
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([Match.objectLike({
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: Match.anyValue(),
          Condition: {
            StringEquals: { 'aws:SourceAccount': '123456789012' },
            ArnLike: { 'aws:SourceArn': Match.anyValue() },
          },
        })]),
      },
    });
  });

  test('warns when the key is imported, since its policy cannot be changed', () => {
    const key = kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab');
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromAsset(FIXTURE_DIR),
      kmsKey: key,
    });

    Annotations.fromStack(stack).hasWarning('/Stack/WebFunction', Match.stringLikeRegexp('imported'));
  });

  test('fails at synth when a bucket for code is not versioned', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', { versioned: false });
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
    });

    expect(() => Template.fromStack(stack)).toThrow(/must have versioning enabled/);
  });

  test('fails at synth when a bucket for code uses the AWS managed KMS key', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
    });

    expect(() => Template.fromStack(stack)).toThrow(/AWS managed KMS key/);
  });

  test('accepts a versioned bucket with SSE-S3 encryption', () => {
    const bucket = new s3.Bucket(stack, 'Bucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
    new WebFunction(stack, 'WebFunction', {
      code: WebFunctionCode.fromBucket(bucket, 'app.zip'),
    });

    expect(() => Template.fromStack(stack)).not.toThrow();
  });
});
