import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import { ServicePrincipal } from '@aws-cdk/aws-iam';
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { EventField, IRule, IRuleTarget, RuleTargetInput } from '../lib';
import { Rule } from '../lib/rule';

// tslint:disable:object-literal-key-quotes

export = {
  'default rule'(test: Test) {
    const stack = new cdk.Stack();

    new Rule(stack, 'MyRule', {
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
    new Rule(stack, 'MyRule', {
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

    new Rule(stack, 'MyRule', {
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
    new Rule(stack, 'Rule');
    test.throws(() => app.run(), /Either 'eventPattern' or 'scheduleExpression' must be defined/);
    test.done();
  },

  'addEventPattern can be used to add filters'(test: Test) {
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'MyRule');
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
    const t1: IRuleTarget = {
      bind: () => ({
        id: 'T1',
        arn: 'ARN1',
        kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
      })
    };

    const t2: IRuleTarget = {
      bind: () => ({
        id: 'T2',
        arn: 'ARN2',
        input: RuleTargetInput.fromText(`This is ${EventField.fromPath('$.detail.bla', 'bla')}`),
      })
    };

    const rule = new Rule(stack, 'EventRule', {
      targets: [ t1 ],
      scheduleExpression: 'rate(5 minutes)'
    });

    rule.addTarget(t2);

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

    const rule = new Rule(stack, 'EventRule', { scheduleExpression: 'rate(1 minute)' });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: 'T2', arn: 'ARN2', input: RuleTargetInput.fromText('Hello, "world"')
      })
    });

    // tokens are used here (FnConcat), but this is a text template so we
    // expect it to be wrapped in double quotes automatically for us.
    rule.addTarget({
      bind: () => ({
        id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
        input: RuleTargetInput.fromText(cdk.Fn.join('', [ 'a', 'b' ]).toString()),
      })
    });

    // jsonTemplate can be used to format JSON documents with replacements
    rule.addTarget({
      bind: () => ({
        id: 'T3', arn: 'ARN3',
        input: RuleTargetInput.fromObject({ foo: EventField.fromPath('$.detail.bar') }),
      })
    });

    // tokens can also used for JSON templates.
    rule.addTarget({
      bind: () => ({
        id: 'T4', arn: 'ARN4',
        input: RuleTargetInput.fromText(cdk.Fn.join(' ', ['hello', '"world"']).toString()),
      })
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
              "Input": '"Hello, \\"world\\""',
            },
            {
              "Arn": "ARN1",
              "Id": "T1",
              "Input": "\"ab\"",
              "KinesisParameters": {
                "PartitionKeyPath": "partitionKeyPath"
              }
            },
            {
              "Arn": "ARN3",
              "Id": "T3",
              "InputTransformer": {
                "InputPathsMap": {
                  "f1": "$.detail.bar"
                },
                "InputTemplate": "{\"foo\":<f1>}"
              }
            },
            {
              "Arn": "ARN4",
              "Id": "T4",
              "Input": '"hello \\"world\\""'
            }
          ]
        }
        }
      }
    });

    test.done();
  },

  'target can declare role which will be used'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'EventRule', { scheduleExpression: 'rate(1 minute)' });

    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new ServicePrincipal('nobody')
    });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: 'T2',
        arn: 'ARN2',
        role,
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Events::Rule', {
      "Targets": [
        {
          "Arn": "ARN2",
          "Id": "T2",
          "RoleArn": {"Fn::GetAtt": ["SomeRole6DDC54DD", "Arn"]}
        }
      ]
    }));

    test.done();
  },

  'asEventRuleTarget can use the ruleArn and a uniqueId of the rule'(test: Test) {
    const stack = new cdk.Stack();

    let receivedRuleArn = 'FAIL';
    let receivedRuleId = 'FAIL';

    const t1: IRuleTarget = {
      bind: (eventRule: IRule) => {
        receivedRuleArn = eventRule.ruleArn;
        receivedRuleId = eventRule.node.uniqueId;

        return {
          id: 'T1',
          arn: 'ARN1',
          kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
        };
      }
    };

    const rule = new Rule(stack, 'EventRule');
    rule.addTarget(t1);

    test.deepEqual(stack.node.resolve(receivedRuleArn), stack.node.resolve(rule.ruleArn));
    test.deepEqual(receivedRuleId, rule.node.uniqueId);
    test.done();
  },

  'fromEventRuleArn'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const importedRule = Rule.fromEventRuleArn(stack, 'ImportedRule', 'arn:of:rule');

    // THEN
    test.deepEqual(importedRule.ruleArn, 'arn:of:rule');
    test.done();
  },

  'rule can be disabled'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Rule(stack, 'Rule', {
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
    const rule = new Rule(stack, 'Rule', {
      scheduleExpression: 'foom',
      enabled: false
    });
    rule.addTarget(new SomeTarget());

    // THEN
    test.throws(() => rule.addTarget(new SomeTarget()), /Duplicate event rule target with ID/);
    test.done();
  }
};

class SomeTarget implements IRuleTarget {
  public bind() {
    return {
      id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
    };
  }
}