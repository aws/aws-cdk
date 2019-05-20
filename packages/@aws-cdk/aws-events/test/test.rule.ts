import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { IEventRuleTarget } from '../lib';
import { EventRule } from '../lib/rule';

// tslint:disable:object-literal-key-quotes

export = {
  'default rule'(test: Test) {
    const stack = new cdk.Stack();

    new EventRule(stack, 'MyRule', {
      scheduleExpression: 'rate(10 minutes)'
    });

    expect(stack).toMatch({
      "Resources": {
        "MyRuleA44AB831": {
        "Type": "AWS::Events::Rule",
        "Properties": {
          "ScheduleExpression": "rate(10 minutes)",
          "State": "ENABLED"
        }
        }
      }
    });
    test.done();
  },

  'rule with physical name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new EventRule(stack, 'MyRule', {
    ruleName: 'PhysicalName',
    scheduleExpression: 'rate(10 minutes)'
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
    Name: 'PhysicalName'
    }));

    test.done();
  },

  'eventPattern is rendered properly'(test: Test) {
    const stack = new cdk.Stack();

    new EventRule(stack, 'MyRule', {
      eventPattern: {
        account: [ 'account1', 'account2' ],
        detail: {
          foo: [ 1, 2 ],
        },
        detailType: [ 'detailType1' ],
        id: [ 'id1', 'id2' ],
        region: [ 'region1', 'region2', 'region3' ],
        resources: [ 'r1' ],
        source: [ 'src1', 'src2' ],
        time: [ 't1' ],
        version: [ '0' ]
      }
    });

    expect(stack).toMatch({
      "Resources": {
        "MyRuleA44AB831": {
        "Type": "AWS::Events::Rule",
        "Properties": {
          "EventPattern": {
            account: [ 'account1', 'account2' ],
            detail: { foo: [ 1, 2 ] },
            'detail-type': [ 'detailType1' ],
            id: [ 'id1', 'id2' ],
            region: [ 'region1', 'region2', 'region3' ],
            resources: [ 'r1' ],
            source: [ 'src1', 'src2' ],
            time: [ 't1' ],
            version: [ '0' ]
          },
          "State": "ENABLED"
        }
        }
      }
    });

    test.done();
  },

  'fails synthesis if neither eventPattern nor scheudleExpression are specified'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');
    new EventRule(stack, 'Rule');
    test.throws(() => app.synthesizeStack(stack.name), /Either 'eventPattern' or 'scheduleExpression' must be defined/);
    test.done();
  },

  'addEventPattern can be used to add filters'(test: Test) {
    const stack = new cdk.Stack();

    const rule = new EventRule(stack, 'MyRule');
    rule.addEventPattern({
      account: [ '12345' ],
      detail: {
        foo: [ 'hello' ]
      }
    });

    rule.addEventPattern({
      source: [ 'aws.source' ],
      detail: {
        foo: [ 'bar' ],
        goo: {
          hello: [ 'world' ]
        }
      }
    });

    expect(stack).toMatch({
      "Resources": {
        "MyRuleA44AB831": {
        "Type": "AWS::Events::Rule",
        "Properties": {
          "EventPattern": {
          "account": [
            "12345"
          ],
          "detail": {
            "foo": [
            "hello",
            "bar"
            ],
            "goo": {
            "hello": [
              "world"
            ]
            }
          },
          "source": [
            "aws.source"
          ]
          },
          "State": "ENABLED"
        }
        }
      }
    });
    test.done();
  },

  'targets can be added via props or addTarget with input transformer'(test: Test) {
    const stack = new cdk.Stack();
    const t1: IEventRuleTarget = {
      asEventRuleTarget: () => ({
        id: 'T1',
        arn: 'ARN1',
        kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
      })
    };

    const t2: IEventRuleTarget = {
      asEventRuleTarget: () => ({
        id: 'T2',
        arn: 'ARN2',
        roleArn: 'IAM-ROLE-ARN'
      })
    };

    const rule = new EventRule(stack, 'EventRule', {
      targets: [ t1 ],
      scheduleExpression: 'rate(5 minutes)'
    });

    rule.addTarget(t2, {
      textTemplate: 'This is <bla>',
      pathsMap: {
        bla: '$.detail.bla'
      }
    });

    expect(stack).toMatch({
      "Resources": {
        "EventRule5A491D2C": {
        "Type": "AWS::Events::Rule",
        "Properties": {
          "ScheduleExpression": "rate(5 minutes)",
          "State": "ENABLED",
          "Targets": [
          {
            "Arn": "ARN1",
            "Id": "T1",
            "KinesisParameters": {
            "PartitionKeyPath": "partitionKeyPath"
            }
          },
          {
            "Arn": "ARN2",
            "Id": "T2",
            "InputTransformer": {
            "InputPathsMap": {
              "bla": "$.detail.bla"
            },
            "InputTemplate": "\"This is <bla>\""
            },
            "RoleArn": "IAM-ROLE-ARN"
          }
          ]
        }
        }
      }
    });
    test.done();
  },

  'input template can contain tokens'(test: Test) {
    const stack = new cdk.Stack();
    const t1: IEventRuleTarget = {
      asEventRuleTarget: () => ({
        id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
      })
    };

    const t2: IEventRuleTarget = { asEventRuleTarget: () => ({ id: 'T2', arn: 'ARN2', roleArn: 'IAM-ROLE-ARN' }) };
    const t3: IEventRuleTarget = { asEventRuleTarget: () => ({ id: 'T3', arn: 'ARN3' }) };
    const t4: IEventRuleTarget = { asEventRuleTarget: () => ({ id: 'T4', arn: 'ARN4' }) };

    const rule = new EventRule(stack, 'EventRule', { scheduleExpression: 'rate(1 minute)' });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget(t2, {
      textTemplate: 'Hello, "world"'
    });

    // tokens are used here (FnConcat), but this is a text template so we
    // expect it to be wrapped in double quotes automatically for us.
    rule.addTarget(t1, {
      textTemplate: cdk.Fn.join('', [ 'a', 'b' ]).toString()
    });

    // jsonTemplate can be used to format JSON documents with replacements
    rule.addTarget(t3, {
      jsonTemplate: '{ "foo": <bar> }',
      pathsMap: {
        bar: '$.detail.bar'
      }
    });

    // tokens can also used for JSON templates, but that means escaping is
    // the responsibility of the user.
    rule.addTarget(t4, {
      jsonTemplate: cdk.Fn.join(' ', ['"', 'hello', '\"world\"', '"']),
    });

    expect(stack).toMatch({
      "Resources": {
        "EventRule5A491D2C": {
        "Type": "AWS::Events::Rule",
        "Properties": {
          "State": "ENABLED",
          "ScheduleExpression": "rate(1 minute)",
          "Targets": [
            {
            "Arn": "ARN2",
            "Id": "T2",
            "InputTransformer": {
              "InputTemplate": "\"Hello, \\\"world\\\"\""
            },
            "RoleArn": "IAM-ROLE-ARN"
            },
            {
            "Arn": "ARN1",
            "Id": "T1",
            "InputTransformer": {
              "InputTemplate": "\"ab\""
            },
            "KinesisParameters": {
              "PartitionKeyPath": "partitionKeyPath"
            }
            },
            {
            "Arn": "ARN3",
            "Id": "T3",
            "InputTransformer": {
              "InputPathsMap": {
              "bar": "$.detail.bar"
              },
              "InputTemplate": "{ \"foo\": <bar> }"
            }
            },
            {
            "Arn": "ARN4",
            "Id": "T4",
            "InputTransformer": {
              "InputTemplate": "\" hello \"world\" \""
            }
            }
          ]
        }
        }
      }
    });

    test.done();
  },

  'asEventRuleTarget can use the ruleArn and a uniqueId of the rule'(test: Test) {
    const stack = new cdk.Stack();

    let receivedRuleArn = 'FAIL';
    let receivedRuleId = 'FAIL';

    const t1: IEventRuleTarget = {
      asEventRuleTarget: (ruleArn: string, ruleId: string) => {
        receivedRuleArn = ruleArn;
        receivedRuleId = ruleId;

        return {
          id: 'T1',
          arn: 'ARN1',
          kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
        };
      }
    };

    const rule = new EventRule(stack, 'EventRule');
    rule.addTarget(t1);

    test.deepEqual(stack.node.resolve(receivedRuleArn), stack.node.resolve(rule.ruleArn));
    test.deepEqual(receivedRuleId, rule.node.uniqueId);
    test.done();
  },

  'fromEventRuleArn'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const importedRule = EventRule.fromEventRuleArn(stack, 'ImportedRule', 'arn:of:rule');

    // THEN
    test.deepEqual(importedRule.ruleArn, 'arn:of:rule');
    test.done();
  },

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

  'rule can be disabled'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new EventRule(stack, 'Rule', {
      scheduleExpression: 'foom',
      enabled: false
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      "State": "DISABLED"
    }));

    test.done();
  },

  'fails if multiple targets with the same id are added'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new EventRule(stack, 'Rule', {
      scheduleExpression: 'foom',
      enabled: false
    });
    rule.addTarget(new SomeTarget());

    // THEN
    test.throws(() => rule.addTarget(new SomeTarget()), /Duplicate event rule target with ID/);
    test.done();
  }
};

class SomeTarget implements IEventRuleTarget {
  public asEventRuleTarget() {
    return {
      id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
    };
  }
}