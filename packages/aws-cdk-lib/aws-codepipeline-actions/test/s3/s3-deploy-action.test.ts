import { Match, Template } from '../../../assertions';
import * as codepipeline from '../../../aws-codepipeline';
import * as kms from '../../../aws-kms';
import * as s3 from '../../../aws-s3';
import { App, Duration, SecretValue, Stack } from '../../../core';
import * as cxapi from '../../../cx-api';
import * as cpactions from '../../lib';

/* eslint-disable @stylistic/quote-props */

describe('S3 Deploy Action', () => {
  test('by default extract artifacts', () => {
    const stack = new Stack();
    minimalPipeline(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
          'Actions': [
            {
              'Name': 'Source',
              'ActionTypeId': {
                'Category': 'Source',
                'Owner': 'ThirdParty',
              },
            },
          ],
        },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Deploy',
                'Provider': 'S3',
              },
              'Configuration': {
                'Extract': 'true',
              },
              'Name': 'CopyFiles',
            },
          ],
        },
      ],
    });
  });

  test('grant the pipeline correct access to the target bucket', () => {
    const stack = new Stack();
    minimalPipeline(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Effect': 'Allow',
            'Action': [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
          },
          {},
          {
            'Effect': 'Allow',
            'Action': 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  test('kebab-case CannedACL value', () => {
    const stack = new Stack();
    minimalPipeline(stack, {
      accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {},
        {
          'Actions': [
            {
              'Configuration': {
                'CannedACL': 'public-read-write',
              },
            },
          ],
        },
      ],
    });
  });

  test('allow customizing cache-control', () => {
    const stack = new Stack();
    minimalPipeline(stack, {
      cacheControl: [
        cpactions.CacheControl.setPublic(),
        cpactions.CacheControl.maxAge(Duration.hours(12)),
        cpactions.CacheControl.sMaxAge(Duration.hours(12)),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {},
        {
          'Actions': [
            {
              'Configuration': {
                'CacheControl': 'public, max-age=43200, s-maxage=43200',
              },
            },
          ],
        },
      ],
    });
  });

  test('cache-control directive has correct values', () => {
    expect(cpactions.CacheControl.mustRevalidate().value).toEqual('must-revalidate');
    expect(cpactions.CacheControl.noCache().value).toEqual('no-cache');
    expect(cpactions.CacheControl.noTransform().value).toEqual('no-transform');
    expect(cpactions.CacheControl.noStore().value).toEqual('no-store');
    expect(cpactions.CacheControl.mustUnderstand().value).toEqual('must-understand');
    expect(cpactions.CacheControl.setPublic().value).toEqual('public');
    expect(cpactions.CacheControl.setPrivate().value).toEqual('private');
    expect(cpactions.CacheControl.immutable().value).toEqual('immutable');
    expect(cpactions.CacheControl.proxyRevalidate().value).toEqual('proxy-revalidate');
    expect(cpactions.CacheControl.maxAge(Duration.minutes(1)).value).toEqual('max-age=60');
    expect(cpactions.CacheControl.sMaxAge(Duration.minutes(1)).value).toEqual('s-maxage=60');
    expect(cpactions.CacheControl.staleWhileRevalidate(Duration.minutes(1)).value).toEqual('stale-while-revalidate=60');
    expect(cpactions.CacheControl.staleIfError(Duration.minutes(1)).value).toEqual('stale-if-error=60');
    expect(cpactions.CacheControl.fromString('custom').value).toEqual('custom');
  });

  test('allow customizing objectKey (deployment path on S3)', () => {
    const stack = new Stack();
    minimalPipeline(stack, {
      objectKey: '/a/b/c',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {},
        {
          'Actions': [
            {
              'Configuration': {
                'ObjectKey': '/a/b/c',
              },
            },
          ],
        },
      ],
    });
  });

  test('correctly makes the action cross-region for a Bucket imported with a different region', () => {
    const app = new App();
    const stack = new Stack(app, 'PipelineStack', {
      env: { account: '123456789012', region: 'us-west-2' },
    });
    const deployBucket = s3.Bucket.fromBucketAttributes(stack, 'DeployBucket', {
      bucketName: 'my-deploy-bucket',
      region: 'ap-southeast-1',
    });

    minimalPipeline(stack, {
      bucket: deployBucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'CopyFiles',
              Region: 'ap-southeast-1',
            },
          ],
        },
      ],
    });
  });

  test('cross-account, cross-region deploy grants the replication key via account-root and PrincipalTag when the flag is enabled', () => {
    // Regression test for cross-account + cross-region pipelines. The cross-region replication
    // key's policy used to reference the cross-account action role by ARN. That role is created
    // in a separate support stack with no guaranteed deploy ordering relative to the key, so KMS
    // rejected the key policy on first deploy ("Policy contains a statement with one or more
    // invalid principals."). The key should instead trust the action account's root scoped down
    // to the role's `aws-cdk:id` tag.
    const app = new App({ context: { [cxapi.CROSS_ACCOUNT_GRANTS_VIA_PRINCIPAL_TAG]: true } });
    const stack = new Stack(app, 'PipelineStack', {
      env: { account: '123456789012', region: 'us-west-2' },
    });
    // A deploy bucket that is in both another account and another region forces both a
    // cross-account support stack (holding the action role) and a cross-region support stack
    // (holding the replication bucket and its KMS key).
    const deployBucket = s3.Bucket.fromBucketAttributes(stack, 'DeployBucket', {
      bucketName: 'my-deploy-bucket',
      account: '234567890123',
      region: 'ap-southeast-1',
    });

    minimalPipeline(stack, { bucket: deployBucket });

    const asm = app.synth();
    const crossRegionSupportStack = asm.getStackByName('PipelineStack-support-ap-southeast-1');
    const template = Template.fromJSON(crossRegionSupportStack.template);

    // The replication key trusts the account root of the action's account, scoped by the tag,
    // instead of the (possibly not-yet-existing) cross-account action-role ARN.
    template.hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['kms:Decrypt', 'kms:DescribeKey'],
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::234567890123:root']] },
            },
            Condition: {
              StringEquals: {
                'aws:PrincipalTag/aws-cdk:id': Match.stringLikeRegexp('PipelineStack-support-234567890123_.*'),
              },
            },
          }),
        ]),
      },
    });

    // The key policy must NOT reference the cross-account action role by ARN.
    const keys = template.findResources('AWS::KMS::Key');
    expect(JSON.stringify(keys)).not.toMatch(/234567890123:role\//);
  });
});

test('KMSEncryptionKeyARN value', () => {
  const stack = new Stack();
  minimalPipeline(stack);

  Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    'Stages': [
      {},
      {
        'Actions': [
          {
            'Configuration': {
              'KMSEncryptionKeyARN': { 'Fn::GetAtt': ['EnvVarEncryptKey1A7CABDB', 'Arn'] },
            },
          },
        ],
      },
    ],
  });
});

interface MinimalPipelineOptions {
  readonly accessControl?: s3.BucketAccessControl;
  readonly bucket?: s3.IBucket;
  readonly cacheControl?: cpactions.CacheControl[];
  readonly extract?: boolean;
  readonly objectKey?: string;
}

function minimalPipeline(stack: Stack, options: MinimalPipelineOptions = {}): codepipeline.IStage {
  const key: kms.IKey = new kms.Key(stack, 'EnvVarEncryptKey', {
    description: 'sample key',
  });
  const sourceOutput = new codepipeline.Artifact();
  const sourceAction = new cpactions.GitHubSourceAction({
    actionName: 'Source',
    owner: 'aws',
    repo: 'aws-cdk',
    output: sourceOutput,
    oauthToken: SecretValue.unsafePlainText('secret'),
  });

  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [sourceAction],
      },
    ],
  });

  const deploymentStage = pipeline.addStage({
    stageName: 'Deploy',
    actions: [
      new cpactions.S3DeployAction({
        accessControl: options.accessControl,
        actionName: 'CopyFiles',
        bucket: options.bucket || new s3.Bucket(stack, 'MyBucket'),
        cacheControl: options.cacheControl,
        extract: options.extract,
        input: sourceOutput,
        objectKey: options.objectKey,
        encryptionKey: key,
      }),
    ],
  });

  return deploymentStage;
}
