import { expect, haveResourceLike } from "@aws-cdk/assert";
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import { Aws, Lazy, SecretValue, Stack, Token } from "@aws-cdk/cdk";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'Lambda invoke Action': {
    'properly serializes the object passed in userParameters'(test: Test) {
      const stack = stackIncludingLambdaInvokeCodePipeline({
        key: 1234,
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
        key: Lazy.stringValue({ produce: () => Aws.region }),
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
        key: Token.asString(null),
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
  },
};

function stackIncludingLambdaInvokeCodePipeline(userParams: { [key: string]: any }) {
  const stack = new Stack();

  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        name: 'Source',
        actions: [
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub',
            output: new codepipeline.Artifact(),
            oauthToken: SecretValue.plainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk',
          }),
        ],
      },
      {
        name: 'Invoke',
        actions: [
          new cpactions.LambdaInvokeAction({
            actionName: 'Lambda',
            lambda: new lambda.Function(stack, 'Lambda', {
              code: lambda.Code.cfnParameters(),
              handler: 'index.handler',
              runtime: lambda.Runtime.Nodejs810,
            }),
            userParameters: userParams,
          }),
        ],
      },
    ],
  });

  return stack;
}
