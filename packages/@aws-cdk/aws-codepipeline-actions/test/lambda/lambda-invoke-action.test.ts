import { Template, Match } from '@aws-cdk/assertions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import { testFutureBehavior } from '@aws-cdk/cdk-build-tools/lib/feature-flag';
import { App, Aws, Lazy, SecretValue, Stack, Token } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

const s3GrantWriteCtx = { [cxapi.S3_GRANT_WRITE_WITHOUT_ACL]: true };

describe('', () => {
  describe('Lambda invoke Action', () => {
    test('properly serializes the object passed in userParameters', () => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: 1234,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {},
          {
            'Actions': [
              {
                'Configuration': {
                  'UserParameters': '{"key":1234}',
                },
              },
            ],
          },
        ],
      }));
    });

    test('properly resolves any Tokens passed in userParameters', () => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: Lazy.string({ produce: () => Aws.REGION }),
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {},
          {
            'Actions': [
              {
                'Configuration': {
                  'UserParameters': {
                    'Fn::Join': [
                      '',
                      [
                        '{"key":"',
                        {
                          'Ref': 'AWS::Region',
                        },
                        '"}',
                      ],
                    ],
                  },
                },
              },
            ],
          },
        ],
      }));
    });

    test('properly resolves any stringified Tokens passed in userParameters', () => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: Token.asString(null),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {},
          {
            'Actions': [
              {
                'Configuration': {
                  'UserParameters': '{"key":null}',
                },
              },
            ],
          },
        ],
      }));
    });

    test('properly assings userParametersString to UserParameters', () => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParamsString: '**/*.template.json',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {},
          {
            'Actions': [
              {
                'Configuration': {
                  'UserParameters': '**/*.template.json',
                },
              },
            ],
          },
        ],
      }));
    });

    test('throws if both userParameters and userParametersString are supplied', () => {
      expect(() => stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: Token.asString(null),
        },
        userParamsString: '**/*.template.json',
      })).toThrow(/Only one of userParameters or userParametersString can be specified/);
    });

    test("assigns the Action's Role with read permissions to the Bucket if it has only inputs", () => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaInput: new codepipeline.Artifact(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 'lambda:ListFunctions',
              'Resource': '*',
              'Effect': 'Allow',
            },
            {
              'Action': 'lambda:InvokeFunction',
              'Effect': 'Allow',
            },
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
            },
            {
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
            },
          ],
        },
      }));
    });

    testFutureBehavior("assigns the Action's Role with write permissions to the Bucket if it has only outputs", s3GrantWriteCtx, App, (app) => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaOutput: new codepipeline.Artifact(),
        // no input to the Lambda Action - we want write permissions only in this case
      }, app);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineInvokeLambdaCodePipelineActionRoleDefaultPolicy103F34DA',
        'PolicyDocument': Match.objectLike({
          'Statement': [
            {
              'Action': 'lambda:ListFunctions',
              'Resource': '*',
              'Effect': 'Allow',
            },
            {
              'Action': 'lambda:InvokeFunction',
              'Effect': 'Allow',
            },
            {
              'Action': [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
            },
            {
              'Action': [
                'kms:Encrypt',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:Decrypt',
              ],
              'Effect': 'Allow',
            },
          ],
        }),
      });
    });

    testFutureBehavior("assigns the Action's Role with read-write permissions to the Bucket if it has both inputs and outputs", s3GrantWriteCtx, App, (app) => {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaInput: new codepipeline.Artifact(),
        lambdaOutput: new codepipeline.Artifact(),
      }, app);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineInvokeLambdaCodePipelineActionRoleDefaultPolicy103F34DA',
        'PolicyDocument': Match.objectLike({
          'Statement': [
            {
              'Action': 'lambda:ListFunctions',
              'Resource': '*',
              'Effect': 'Allow',
            },
            {
              'Action': 'lambda:InvokeFunction',
              'Effect': 'Allow',
            },
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
            },
            {
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
            },
            {
              'Action': [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
            },
            {
              'Action': [
                'kms:Encrypt',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:Decrypt',
              ],
              'Effect': 'Allow',
            },
          ],
        }),
      });
    });

    test('exposes variables for other actions to consume', () => {
      const stack = new Stack(undefined, undefined, {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const sourceOutput = new codepipeline.Artifact();
      const lambdaInvokeAction = new cpactions.LambdaInvokeAction({
        actionName: 'LambdaInvoke',
        lambda: lambda.Function.fromFunctionArn(stack, 'Func', 'arn:aws:lambda:us-east-1:123456789012:function:some-func'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Invoke',
            actions: [
              lambdaInvokeAction,
              new cpactions.ManualApprovalAction({
                actionName: 'Approve',
                additionalInformation: lambdaInvokeAction.variable('SomeVar'),
                notificationTopic: sns.Topic.fromTopicArn(stack, 'Topic', 'arn:aws:sns:us-east-1:123456789012:mytopic'),
                runOrder: 2,
              }),
            ],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Invoke',
            'Actions': [
              {
                'Name': 'LambdaInvoke',
                'Namespace': 'Invoke_LambdaInvoke_NS',
              },
              {
                'Name': 'Approve',
                'Configuration': {
                  'CustomData': '#{Invoke_LambdaInvoke_NS.SomeVar}',
                },
              },
            ],
          },
        ],
      }));
    });
  });
});

interface HelperProps {
  readonly userParams?: { [key: string]: any };
  readonly userParamsString?: string;
  readonly lambdaInput?: codepipeline.Artifact;
  readonly lambdaOutput?: codepipeline.Artifact;
}

function stackIncludingLambdaInvokeCodePipeline(props: HelperProps, app?: App) {
  const stack = new Stack(app);

  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub',
            output: props.lambdaInput || new codepipeline.Artifact(),
            oauthToken: SecretValue.unsafePlainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk',
          }),
        ],
      },
      {
        stageName: 'Invoke',
        actions: [
          new cpactions.LambdaInvokeAction({
            actionName: 'Lambda',
            lambda: new lambda.Function(stack, 'Lambda', {
              code: lambda.Code.fromCfnParameters(),
              handler: 'index.handler',
              runtime: lambda.Runtime.NODEJS_14_X,
            }),
            userParameters: props.userParams,
            userParametersString: props.userParamsString,
            inputs: props.lambdaInput ? [props.lambdaInput] : undefined,
            outputs: props.lambdaOutput ? [props.lambdaOutput] : undefined,
          }),
        ],
      },
    ],
  });

  return stack;
}
