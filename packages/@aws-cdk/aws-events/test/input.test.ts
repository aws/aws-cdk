import { Template } from '@aws-cdk/assertions';
import { User } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { EventField, IRuleTarget, RuleTargetInput, Schedule } from '../lib';
import { Rule } from '../lib/rule';

describe('input', () => {
  describe('json template', () => {
    test('can just be a JSON object', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({ SomeObject: 'withAValue' })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            Input: '{"SomeObject":"withAValue"}',
          },
        ],
      });
    });

    test('can use joined JSON containing refs in JSON object', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({
        data: EventField.fromPath('$'),
        stackName: cdk.Aws.STACK_NAME,
      })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputPathsMap: {
                f1: '$',
              },
              InputTemplate: {
                'Fn::Join': [
                  '',
                  [
                    '{"data":<f1>,"stackName":"',
                    { Ref: 'AWS::StackName' },
                    '"}',
                  ],
                ],
              },
            },
          },
        ],
      });
    });

    test('can use joined JSON containing refs in JSON object with tricky inputs', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({
        data: `they said \"hello\"${EventField.fromPath('$')}`,
        stackName: cdk.Aws.STACK_NAME,
      })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputPathsMap: {
                f1: '$',
              },
              InputTemplate: {
                'Fn::Join': [
                  '',
                  [
                    '{"data":"they said \\\"hello\\\"<f1>","stackName":"',
                    { Ref: 'AWS::StackName' },
                    '"}',
                  ],
                ],
              },
            },
          },
        ],
      });
    });

    test('can use joined JSON containing refs in JSON object and concat', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({
        data: `more text ${EventField.fromPath('$')}`,
        stackName: cdk.Aws.STACK_NAME,
      })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputPathsMap: {
                f1: '$',
              },
              InputTemplate: {
                'Fn::Join': [
                  '',
                  [
                    '{"data":"more text <f1>","stackName":"',
                    { Ref: 'AWS::StackName' },
                    '"}',
                  ],
                ],
              },
            },
          },
        ],
      });
    });

    test('can use joined JSON containing refs in JSON object and quotes', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({
        data: `more text "${EventField.fromPath('$')}"`,
        stackName: cdk.Aws.STACK_NAME,
      })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputPathsMap: {
                f1: '$',
              },
              InputTemplate: {
                'Fn::Join': [
                  '',
                  [
                    '{"data":"more text \\\"<f1>\\\"","stackName":"',
                    { Ref: 'AWS::StackName' },
                    '"}',
                  ],
                ],
              },
            },
          },
        ],
      });
    });

    test('can use joined JSON containing refs in JSON object and multiple keys', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({
        data: `${EventField.fromPath('$')}${EventField.fromPath('$.other')}`,
        stackName: cdk.Aws.STACK_NAME,
      })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputPathsMap: {
                f1: '$',
              },
              InputTemplate: {
                'Fn::Join': [
                  '',
                  [
                    '{"data":"<f1><other>","stackName":"',
                    { Ref: 'AWS::StackName' },
                    '"}',
                  ],
                ],
              },
            },
          },
        ],
      });
    });

    test('can use token', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });
      const user = new User(stack, 'User');

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({ userArn: user.userArn })));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            Input: {
              'Fn::Join': [
                '',
                [
                  '{\"userArn\":\"',
                  {
                    'Fn::GetAtt': [
                      'User00B015A1',
                      'Arn',
                    ],
                  },
                  '\"}',
                ],
              ],
            },
          },
        ],
      });
    });
  });

  describe('text templates', () => {
    test('strings with newlines are serialized to a newline-delimited list of JSON strings', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('I have\nmultiple lines')));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"I have"\n"multiple lines"',
          },
        ],
      });
    });

    test('escaped newlines are not interpreted as newlines', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('this is not\\na real newline')));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"this is not\\\\na real newline"',
          },
        ],
      });
    });

    test('can use Tokens in text templates', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      const world = cdk.Lazy.string({ produce: () => 'world' });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromText(`hello ${world}`)));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"hello world"',
          },
        ],
      });
    });
  });
});

class SomeTarget implements IRuleTarget {
  public constructor(private readonly input: RuleTargetInput) {
  }

  public bind() {
    return { id: 'T1', arn: 'ARN1', input: this.input };
  }
}
