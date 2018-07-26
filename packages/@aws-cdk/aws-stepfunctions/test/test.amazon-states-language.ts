import { Test } from 'nodeunit';

import { amazon_states_language as asl } from '../lib';

export = {
    'Hello World'(test: Test) {
        test.deepEqual(
            JSON.parse(JSON.stringify(
                new asl.StateMachine({
                    comment: "A simple minimal example of the States language",
                    startAt: "Hello World",
                    states: new asl.States({
                        "Hello World": new asl.TaskState({
                            resource: "arn:aws:lambda:us-east-1:123456789012:function:HelloWorld",
                            end: true
                        })
                    })
                })
            )),
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
    'Complex retry scenarios'(test: Test) {
        test.deepEqual(
            JSON.parse(JSON.stringify(
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
                            errorEquals: [ asl.ErrorCode.ALL ],
                            next: "Z"
                        })
                    ])
                })
            )),
            {
                Type: "Task",
                Resource: "arn:aws:swf:us-east-1:123456789012:task:X",
                Next: "Y",
                Retry: [
                  {
                    ErrorEquals: [ "ErrorA", "ErrorB" ],
                    IntervalSeconds: 1,
                    BackoffRate: 2,
                    MaxAttempts: 2
                  },
                  {
                    ErrorEquals: [ "ErrorC" ],
                    IntervalSeconds: 5
                  }
                ],
                Catch: [
                  {
                    ErrorEquals: [ "States.ALL" ],
                    Next: "Z"
                  }
                ]
            }
        );
        test.done();
    },
    'Choice state'(test: Test) {
        test.deepEqual(
            JSON.parse(JSON.stringify(
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
            )),
            {
                Type : "Choice",
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
    'Parallel state'(test: Test) {
        test.deepEqual(
            JSON.parse(JSON.stringify(
                new asl.ParallelState({
                    branches: new asl.Branches(
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
                    ),
                    next: "NextState"
                })
            )),
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
    }
};
