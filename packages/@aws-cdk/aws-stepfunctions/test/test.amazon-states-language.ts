import { Test } from 'nodeunit';
import { asl } from './../lib';

function roundtrip(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export = {
    'Hello World example state machine'(test: Test) {
        test.deepEqual(
            JSON.parse(
                new asl.StateMachine({
                    comment: "A simple minimal example of the States language",
                    startAt: "Hello World",
                    states: new asl.States({
                        "Hello World": new asl.TaskState({
                            resource: "arn:aws:lambda:us-east-1:123456789012:function:HelloWorld",
                            end: true
                        })
                    })
                }).definitionString()
            ),
            {
                Comment: "A simple minimal example of the States language",
                StartAt: "Hello World",
                States: {
                    "Hello World": {
                        Type: "Task",
                        Resource: "arn:aws:lambda:us-east-1:123456789012:function:HelloWorld",
                        End: true
                    }
                }
            }
        );
        test.done();
    },
    'Models Complex retry scenarios example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.TaskState({
                    resource: "arn:aws:swf:us-east-1:123456789012:task:X",
                    next: "Y",
                    retry: new asl.Retriers([
                        new asl.Retrier({
                            errorEquals: ["ErrorA", "ErrorB"],
                            intervalSeconds: 1,
                            backoffRate: 2,
                            maxAttempts: 2
                        }),
                        new asl.Retrier({
                            errorEquals: ["ErrorC"],
                            intervalSeconds: 5
                        })
                    ]),
                    catch: new asl.Catchers([
                        new asl.Catcher({
                            errorEquals: [asl.ErrorCode.ALL],
                            next: "Z"
                        })
                    ])
                })
            ),
            {
                Type: "Task",
                Resource: "arn:aws:swf:us-east-1:123456789012:task:X",
                Next: "Y",
                Retry: [
                    {
                        ErrorEquals: ["ErrorA", "ErrorB"],
                        IntervalSeconds: 1,
                        BackoffRate: 2,
                        MaxAttempts: 2
                    },
                    {
                        ErrorEquals: ["ErrorC"],
                        IntervalSeconds: 5
                    }
                ],
                Catch: [
                    {
                        ErrorEquals: ["States.ALL"],
                        Next: "Z"
                    }
                ]
            }
        );
        test.done();
    },
    'Pass state example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.PassState({
                    result: {
                        "x-datum": 0.381018,
                        "y-datum": 622.2269926397355
                    },
                    resultPath: "$.coords",
                    next: "End"
                })
            ),
            {
                Type: "Pass",
                Result: {
                    "x-datum": 0.381018,
                    "y-datum": 622.2269926397355
                },
                ResultPath: "$.coords",
                Next: "End"
            }
        );
        test.done();
    },
    'Task state example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.TaskState({
                    comment: "Task State example",
                    resource: "arn:aws:swf:us-east-1:123456789012:task:HelloWorld",
                    next: "NextState",
                    timeoutSeconds: 300,
                    heartbeatSeconds: 60
                })
            ),
            {
                Comment: "Task State example",
                Type: "Task",
                Resource: "arn:aws:swf:us-east-1:123456789012:task:HelloWorld",
                Next: "NextState",
                TimeoutSeconds: 300,
                HeartbeatSeconds: 60
            }
        );
        test.done();
    },
    'Choice state example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.ChoiceState({
                    choices: new asl.ChoiceRules(
                        new asl.ChoiceRule({
                            comparisonOperation: new asl.NotComparisonOperation(
                                new asl.StringEqualsComparisonOperation({
                                    variable: "$.type",
                                    value: "Private"
                                })
                            ),
                            next: "Public"
                        }),
                        new asl.ChoiceRule({
                            comparisonOperation: new asl.AndComparisonOperation(
                                new asl.NumericGreaterThanEqualsComparisonOperation({
                                    variable: "$.value",
                                    value: 20
                                }),
                                new asl.NumericLessThanComparisonOperation({
                                    variable: "$.value",
                                    value: 30
                                })
                            ),
                            next: "ValueInTwenties"
                        })
                    ),
                    default: "DefaultState"
                })
            ),
            {
                Type: "Choice",
                Choices: [
                    {
                        Not: {
                            Variable: "$.type",
                            StringEquals: "Private"
                        },
                        Next: "Public"
                    },
                    {
                        And: [
                            {
                                Variable: "$.value",
                                NumericGreaterThanEquals: 20
                            },
                            {
                                Variable: "$.value",
                                NumericLessThan: 30
                            }
                        ],
                        Next: "ValueInTwenties"
                    }
                ],
                Default: "DefaultState"
            }
        );
        test.done();
    },
    'Wait state examples'(test: Test) {
        test.deepEqual(
            roundtrip(new asl.WaitState({ seconds: 10, next: "NextState" })),
            {
                Type: "Wait",
                Seconds: 10,
                Next: "NextState"
            }
        );
        test.deepEqual(
            roundtrip(new asl.WaitState({ timestamp: "2016-03-14T01:59:00Z", next: "NextState" })),
            {
                Type: "Wait",
                Timestamp: "2016-03-14T01:59:00Z",
                Next: "NextState"
            }
        );
        test.deepEqual(
            roundtrip(new asl.WaitState({ timestampPath: "$.expirydate", next: "NextState" })),
            {
                Type: "Wait",
                TimestampPath: "$.expirydate",
                Next: "NextState"
            }
        );
        test.done();
    },
    'Succeed state example'(test: Test) {
        test.deepEqual(roundtrip(new asl.SucceedState()), { Type: "Succeed" });
        test.done();
    },
    'Fail state example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.FailState({
                    error: "ErrorA",
                    cause: "Kaiju attack"
                })
            ),
            {
                Type: "Fail",
                Error: "ErrorA",
                Cause: "Kaiju attack"
            }
        );
        test.done();
    },
    'Parallel state example'(test: Test) {
        test.deepEqual(
            roundtrip(
                new asl.ParallelState({
                    branches: new asl.Branches([
                        new asl.Branch({
                            startAt: "LookupAddress",
                            states: new asl.States({
                                LookupAddress: new asl.TaskState({
                                    resource: "arn:aws:lambda:us-east-1:123456789012:function:AddressFinder",
                                    end: true
                                })
                            })
                        }),
                        new asl.Branch({
                            startAt: "LookupPhone",
                            states: new asl.States({
                                LookupPhone: new asl.TaskState({
                                    resource: "arn:aws:lambda:us-east-1:123456789012:function:PhoneFinder",
                                    end: true
                                })
                            })
                        })
                    ]),
                    next: "NextState"
                })
            ),
            {
                Type: "Parallel",
                Branches: [
                    {
                        StartAt: "LookupAddress",
                        States: {
                            LookupAddress: {
                                Type: "Task",
                                Resource: "arn:aws:lambda:us-east-1:123456789012:function:AddressFinder",
                                End: true
                            }
                        }
                    },
                    {
                        StartAt: "LookupPhone",
                        States: {
                            LookupPhone: {
                                Type: "Task",
                                Resource: "arn:aws:lambda:us-east-1:123456789012:function:PhoneFinder",
                                End: true
                            }
                        }
                    }
                ],
                Next: "NextState"
            }
        );
        test.done();
    },
    'Validates state names are unique'(test: Test) {
        test.throws(() => {
            new asl.StateMachine({
                startAt: "foo",
                states: new asl.States({
                    foo: new asl.PassState({ next: "bar" }),
                    bar: new asl.PassState({ next: "bat" }),
                    bat: new asl.ParallelState({
                        branches: new asl.Branches([
                            new asl.Branch({
                                startAt: "foo",
                                states: new asl.States({
                                    foo: new asl.PassState({ end: true })
                                })
                            })
                        ]),
                        end: true
                    })
                })
            });
        });
        test.done();
    },
    'Validates startAt is in states'(test: Test) {
        test.throws(() => {
            new asl.StateMachine({
                startAt: "notFoo",
                states: new asl.States({
                    foo: new asl.SucceedState()
                })
            });
        });
        test.throws(() => {
            new asl.Branch({
                startAt: "notFoo",
                states: new asl.States({
                    foo: new asl.SucceedState()
                })
            });
        });
        test.done();
    },
    'Validates state names aren\'t too long'(test: Test) {
        test.throws(() => {
            new asl.States({
                [new Array(200).join('x')]: new asl.SucceedState()
            });
        });
        test.done();
    },
    'Validates next states are known'(test: Test) {
        test.throws(() => {
            new asl.States({
                foo: new asl.PassState({ next: "unknown" })
            });
        });
        test.done();
    },
    'Validates Error.ALL appears alone'(test: Test) {
        test.throws(() => {
            new asl.Retrier({
                errorEquals: ["a", "b", asl.ErrorCode.ALL, "c"]
            });
        });
        test.done();
    },
    'Validates error names'(test: Test) {
        test.throws(() => {
            new asl.Retrier({
                errorEquals: ["States.MY_ERROR"]
            });
        });
        test.done();
    },
    'Valdiate Error.ALL must appear last'(test: Test) {
        test.throws(() => {
            new asl.Retriers([
                new asl.Retrier({ errorEquals: ["SomeOtherError", "BeforeERROR.ALL"] }),
                new asl.Retrier({ errorEquals: [asl.ErrorCode.ALL] }),
                new asl.Retrier({ errorEquals: ["SomeOtherError", "AfterERROR.ALL"] })
            ]);
        });
        test.throws(() => {
            new asl.Catchers([
                new asl.Retrier({ errorEquals: ["SomeOtherError", "BeforeERROR.ALL"] }),
                new asl.Catcher({ errorEquals: [asl.ErrorCode.ALL], next: "" }),
                new asl.Catcher({ errorEquals: ["SomeOtherError", "AfterERROR.ALL"], next: "" })
            ]);
        });
        test.done();
    }
};
