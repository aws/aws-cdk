import { App, Arn, FnConcat, FnJoin, Stack } from 'aws-cdk';
import { expect } from 'aws-cdk-assert';
import { iam } from 'aws-cdk-resources';
import { Test } from 'nodeunit';
import { IEventRuleTarget } from '../lib';
import { EventRule } from '../lib/rule';

// tslint:disable:object-literal-key-quotes

export = {
    'default rule'(test: Test) {
        const stack = new Stack();

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

    'eventPattern is rendered properly'(test: Test) {
        const stack = new Stack();

        new EventRule(stack, 'MyRule', {
            eventPattern: {
                account: [ 'account1', 'account2' ],
                detail: {
                    foo: [ 1, 2 ],
                },
                detailType: [ 'detailType1' ],
                id: [ 'id1', 'id2' ],
                region: [ 'region1', 'region2', 'region3' ],
                resources: [ new Arn('r1') ],
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
        const app = new App();
        const stack = new Stack(app, 'MyStack');
        new EventRule(stack, 'Rule');
        test.throws(() => app.synthesizeStack(stack.name), /Either 'eventPattern' or 'scheduleExpression' must be defined/);
        test.done();
    },

    'addEventPattern can be used to add filters'(test: Test) {
        const stack = new Stack();

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
        const stack = new Stack();
        const t1: IEventRuleTarget = {
            eventRuleTarget: {
                id: 'T1',
                arn: new Arn('ARN1'),
                kinesisParameters: { partitionKeyPath: 'partitionKeyPath' }
            }
        };

        const t2: IEventRuleTarget = {
            eventRuleTarget: {
                id: 'T2',
                arn: new Arn('ARN2'),
                roleArn: new iam.RoleArn('IAM-ROLE-ARN')
            }
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
        const stack = new Stack();
        const t1: IEventRuleTarget = {
            eventRuleTarget: { id: 'T1', arn: new Arn('ARN1'), kinesisParameters: { partitionKeyPath: 'partitionKeyPath' } }
        };

        const t2: IEventRuleTarget = { eventRuleTarget: { id: 'T2', arn: new Arn('ARN2'), roleArn: new iam.RoleArn('IAM-ROLE-ARN') } };
        const t3: IEventRuleTarget = { eventRuleTarget: { id: 'T3', arn: new Arn('ARN3') } };
        const t4: IEventRuleTarget = { eventRuleTarget: { id: 'T4', arn: new Arn('ARN4') } };

        const rule = new EventRule(stack, 'EventRule');

        // a plain string should just be stringified (i.e. double quotes added and escaped)
        rule.addTarget(t2, {
            textTemplate: 'Hello, "world"'
        });

        // tokens are used here (FnConcat), but this is a text template so we
        // expect it to be wrapped in double quotes automatically for us.
        rule.addTarget(t1, {
            textTemplate: new FnConcat('a', 'b')
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
            jsonTemplate: new FnJoin(' ', '"', 'hello', '\"world\"', '"'),
        });

        expect(stack).toMatch({
            "Resources": {
              "EventRule5A491D2C": {
                "Type": "AWS::Events::Rule",
                "Properties": {
                    "State": "ENABLED",
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
                          "InputTemplate": {
                            "Fn::Join": [
                              "",
                              [
                                "\"",
                                {
                                  "Fn::Join": [
                                    "",
                                    [
                                      "a",
                                      "b"
                                    ]
                                  ]
                                },
                                "\""
                              ]
                            ]
                          }
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
                          "InputTemplate": {
                            "Fn::Join": [
                              " ",
                              [
                                "\"",
                                "hello",
                                "\"world\"",
                                "\""
                              ]
                            ]
                          }
                        }
                      }
                    ]
                }
              }
            }
        });

        test.done();
    }
};
