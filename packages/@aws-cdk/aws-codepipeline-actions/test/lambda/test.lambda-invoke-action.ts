import { expect, haveResourceLike } from "@aws-cdk/assert";
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import { Aws, Lazy, SecretValue, Stack, Token } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

/* eslint-disable quote-props */

export = {
  'Lambda invoke Action': {
    'properly serializes the object passed in userParameters'(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: 1234,
        },
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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

      test.done();
    },

    'properly resolves any Tokens passed in userParameters'(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: Lazy.stringValue({ produce: () => Aws.REGION }),
        },
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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

      test.done();
    },

    'properly resolves any stringified Tokens passed in userParameters'(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        userParams: {
          key: Token.asString(null),
        },
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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

      test.done();
    },

    "assigns the Action's Role with read permissions to the Bucket if it has only inputs"(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaInput: new codepipeline.Artifact(),
      });

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "lambda:ListFunctions",
              "Resource": "*",
              "Effect": "Allow",
            },
            {
              "Action": "lambda:InvokeFunction",
              "Effect": "Allow",
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
              ],
              "Effect": "Allow",
            },
            {
              "Action": [
                "kms:Decrypt",
                "kms:DescribeKey",
              ],
              "Effect": "Allow",
            },
          ],
        },
      }));

      test.done();
    },

    "assigns the Action's Role with write permissions to the Bucket if it has only outputs"(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaOutput: new codepipeline.Artifact(),
        // no input to the Lambda Action - we want write permissions only in this case
      });

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "lambda:ListFunctions",
              "Resource": "*",
              "Effect": "Allow",
            },
            {
              "Action": "lambda:InvokeFunction",
              "Effect": "Allow",
            },
            {
              "Action": [
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*",
              ],
              "Effect": "Allow",
            },
            {
              "Action": [
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
              ],
              "Effect": "Allow",
            },
          ],
        },
      }));

      test.done();
    },

    "assigns the Action's Role with read-write permissions to the Bucket if it has both inputs and outputs"(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        lambdaInput: new codepipeline.Artifact(),
        lambdaOutput: new codepipeline.Artifact(),
      });

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "lambda:ListFunctions",
              "Resource": "*",
              "Effect": "Allow",
            },
            {
              "Action": "lambda:InvokeFunction",
              "Effect": "Allow",
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
              ],
              "Effect": "Allow",
            },
            {
              "Action": [
                "kms:Decrypt",
                "kms:DescribeKey",
              ],
              "Effect": "Allow",
            },
            {
              "Action": [
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*",
              ],
              "Effect": "Allow",
            },
            {
              "Action": [
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
              ],
              "Effect": "Allow",
            },
          ],
        },
      }));

      test.done();
    },
  },
};

interface HelperProps {
  readonly userParams?: { [key: string]: any };
  readonly lambdaInput?: codepipeline.Artifact;
  readonly lambdaOutput?: codepipeline.Artifact;
}

function stackIncludingLambdaInvokeCodePipeline(props: HelperProps) {
  const stack = new Stack();

  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub',
            output: props.lambdaInput || new codepipeline.Artifact(),
            oauthToken: SecretValue.plainText('secret'),
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
              runtime: lambda.Runtime.NODEJS_8_10,
            }),
            userParameters: props.userParams,
            inputs: props.lambdaInput ? [props.lambdaInput] : undefined,
            outputs: props.lambdaOutput ? [props.lambdaOutput] : undefined,
          }),
        ],
      },
    ],
  });

  return stack;
}
