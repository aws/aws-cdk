import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { EventField, EventTargetInput, IEventRule, IEventRuleTarget } from '../lib';
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
      bind: () => ({
        id: 'T1',
        arn: 'ARN1',
        kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
      })
    };

    const t2: IEventRuleTarget = {
      bind: () => ({
        id: 'T2',
        arn: 'ARN2',
        roleArn: 'IAM-ROLE-ARN',
        input: EventTargetInput.fromText(`This is ${EventField.fromPath('$.detail.bla', 'bla')}`).toInputProperties(),
      })
    };

    const rule = new EventRule(stack, 'EventRule', {
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

    const rule = new EventRule(stack, 'EventRule', { scheduleExpression: 'rate(1 minute)' });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: 'T2', arn: 'ARN2', roleArn: 'IAM-ROLE-ARN', input: EventTargetInput.fromText('Hello, "world"').toInputProperties()
      })
    });

    // tokens are used here (FnConcat), but this is a text template so we
    // expect it to be wrapped in double quotes automatically for us.
    rule.addTarget({
      bind: () => ({
        id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
        input: EventTargetInput.fromText(cdk.Fn.join('', [ 'a', 'b' ]).toString()).toInputProperties(),
      })
    });

    // jsonTemplate can be used to format JSON documents with replacements
    rule.addTarget({
      bind: () => ({
        id: 'T3', arn: 'ARN3',
        input: EventTargetInput.fromObject({ foo: EventField.fromPath('$.detail.bar') }).toInputProperties()
      })
    });

    // tokens can also used for JSON templates, but that means escaping is
    // the responsibility of the user.
    rule.addTarget({
      bind: () => ({
        id: 'T4', arn: 'ARN4',
        input: EventTargetInput.fromText(cdk.Fn.join(' ', ['"', 'hello', '\"world\"', '"']).toString()).toInputProperties(),
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
            "Input": "\"Hello, \\\"world\\\"\"",
            "RoleArn": "IAM-ROLE-ARN"
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
      bind: (eventRule: IEventRule) => {
        receivedRuleArn = eventRule.ruleArn;
        receivedRuleId = eventRule.node.uniqueId;

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

  'import/export rule'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const myRule = new EventRule(stack, 'MyRule');

    // WHEN
    const exportedRule = myRule.export();
    const importedRule = EventRule.fromEventRuleArn(stack, 'ImportedRule', 'arn:of:rule');

    // THEN
    test.deepEqual(stack.node.resolve(exportedRule), { eventRuleArn: { 'Fn::ImportValue': 'Stack:MyRuleRuleArnDB13ADB1' } });
    test.deepEqual(importedRule.ruleArn, 'arn:of:rule');

    test.done();
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
  public bind() {
    return {
      id: 'T1', arn: 'ARN1', kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
    };
  }
}