import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, SecretValue, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

export = {
  'S3 Deploy Action': {
    'by default extract artifacts'(test: Test) {
      const stack = new Stack();
      minimalPipeline(stack);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },

    'grant the pipeline correct access to the target bucket'(test: Test) {
      const stack = new Stack();
      minimalPipeline(stack);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Effect': 'Allow',
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject*',
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
      }));

      test.done();
    },

    'kebab-case CannedACL value'(test: Test) {
      const stack = new Stack();
      minimalPipeline(stack, {
        accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },

    'allow customizing cache-control'(test: Test) {
      const stack = new Stack();
      minimalPipeline(stack, {
        cacheControl: [
          cpactions.CacheControl.setPublic(),
          cpactions.CacheControl.maxAge(Duration.hours(12)),
          cpactions.CacheControl.sMaxAge(Duration.hours(12)),
        ],
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },

    'allow customizing objectKey (deployment path on S3)'(test: Test) {
      const stack = new Stack();
      minimalPipeline(stack, {
        objectKey: '/a/b/c',
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },
  },
};

interface MinimalPipelineOptions {
  readonly accessControl?: s3.BucketAccessControl;
  readonly bucket?: s3.IBucket;
  readonly cacheControl?: cpactions.CacheControl[];
  readonly extract?: boolean;
  readonly objectKey?: string;
}

function minimalPipeline(stack: Stack, options: MinimalPipelineOptions = {}): codepipeline.IStage {
  const sourceOutput = new codepipeline.Artifact();
  const sourceAction = new cpactions.GitHubSourceAction({
    actionName: 'Source',
    owner: 'aws',
    repo: 'aws-cdk',
    output: sourceOutput,
    oauthToken: SecretValue.plainText('secret'),
  });

  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [ sourceAction ],
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
      }),
    ],
  });

  return deploymentStage;
}
