import { expect, haveResourceLike } from '@aws-cdk/assert';
import { User } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { EventField, IRuleTarget, RuleTargetInput, Schedule } from '../lib';
import { Rule } from '../lib/rule';

export = {
  'json template': {
    'can just be a JSON object'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({ SomeObject: 'withAValue' })));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: '{"SomeObject":"withAValue"}',
          },
        ],
      }));
      test.done();
    },

    'can use joined JSON containing refs in JSON object'(test: Test) {
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
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
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
      }));

      test.done();
    },

    'can use token'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });
      const user = new User(stack, 'User');

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({ userArn: user.userArn })));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
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
      }));
      test.done();
    },
  },

  'text templates': {
    'strings with newlines are serialized to a newline-delimited list of JSON strings'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('I have\nmultiple lines')));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"I have"\n"multiple lines"',
          },
        ],
      }));

      test.done();
    },

    'escaped newlines are not interpreted as newlines'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('this is not\\na real newline'))),

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"this is not\\\\na real newline"',
          },
        ],
      }));

      test.done();
    },

    'can use Tokens in text templates'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(cdk.Duration.minutes(1)),
      });

      const world = cdk.Lazy.string({ produce: () => 'world' });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromText(`hello ${world}`)));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: '"hello world"',
          },
        ],
      }));

      test.done();
    },
  },
};

class SomeTarget implements IRuleTarget {
  public constructor(private readonly input: RuleTargetInput) {
  }

  public bind() {
    return { id: 'T1', arn: 'ARN1', input: this.input };
  }
}
