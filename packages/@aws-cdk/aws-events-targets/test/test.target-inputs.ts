import { expect, haveResourceLike } from '@aws-cdk/assert';
import { EventRule, IEventRuleTarget } from '@aws-cdk/aws-events';
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';

export = {
  'json template': {
    'can just be a JSON object'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new EventRule(stack, 'Rule', {
        scheduleExpression: 'rate(1 minute)'
      });

      // WHEN
      rule.addTarget(new SomeTarget(), {
        jsonTemplate: { SomeObject: 'withAValue' },
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputTemplate: "{\"SomeObject\":\"withAValue\"}"
            },
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
      const rule = new EventRule(stack, 'Rule', {
        scheduleExpression: 'rate(1 minute)'
      });

      // WHEN
      rule.addTarget(new SomeTarget(), {
        textTemplate: 'I have\nmultiple lines',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputTemplate: "\"I have\"\n\"multiple lines\""
            },
          }
        ]
      }));

      test.done();
    },

    'escaped newlines are not interpreted as newlines'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new EventRule(stack, 'Rule', {
        scheduleExpression: 'rate(1 minute)'
      });

      // WHEN
      rule.addTarget(new SomeTarget(), {
        textTemplate: 'this is not\\na real newline',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputTemplate: "\"this is not\\\\na real newline\""
            },
          }
        ]
      }));

      test.done();
    },

    'can use Tokens in text templates'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const rule = new EventRule(stack, 'Rule', {
        scheduleExpression: 'rate(1 minute)'
      });

      const world = new cdk.Token(() => 'world');

      // WHEN
      rule.addTarget(new SomeTarget(), {
        textTemplate: `hello ${world}`,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            InputTransformer: {
              InputTemplate: "\"hello world\""
            },
          }
        ]
      }));

      test.done();
    }
  },
};

class SomeTarget implements IEventRuleTarget {
  public bind() {
    return {
      id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
    };
  }
}