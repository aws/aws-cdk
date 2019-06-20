import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Duration, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { IRuleTarget, RuleTargetInput, Schedule } from '../lib';
import { Rule } from '../lib/rule';

export = {
  'json template': {
    'can just be a JSON object'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromObject({ SomeObject: 'withAValue' })));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: "{\"SomeObject\":\"withAValue\"}"
          }
        ]
      }));
      test.done();
    },
  },

  'text templates': {
    'strings with newlines are serialized to a newline-delimited list of JSON strings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('I have\nmultiple lines')));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: "\"I have\"\n\"multiple lines\""
          }
        ]
      }));

      test.done();
    },

    'escaped newlines are not interpreted as newlines'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(Duration.minutes(1)),
      });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromMultilineText('this is not\\na real newline'))),

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: "\"this is not\\\\na real newline\""
          }
        ]
      }));

      test.done();
    },

    'can use Tokens in text templates'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new Rule(stack, 'Rule', {
        schedule: Schedule.rate(Duration.minutes(1)),
      });

      const world = cdk.Lazy.stringValue({ produce: () => 'world' });

      // WHEN
      rule.addTarget(new SomeTarget(RuleTargetInput.fromText(`hello ${world}`)));

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Input: "\"hello world\""
          }
        ]
      }));

      test.done();
    }
  },
};

class SomeTarget implements IRuleTarget {
  public constructor(private readonly input: RuleTargetInput) {
  }

  public bind() {
    return { id: 'T1', arn: 'ARN1', input: this.input };
  }
}