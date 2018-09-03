import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');
import { IChainable } from '../lib';

export = {
    'Basic composition': {
        'A single task is a State Machine'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const chain = new stepfunctions.Pass(stack, 'Some State');

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Some State',
                States: {
                    'Some State': { Type: 'Pass', End: true }
                }
            });

            test.done();
        },

        'A sequence of two tasks is a State Machine'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');

            const chain = task1.next(task2);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'You dont need to hold on to the state to render the entire state machine correctly'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');

            task1.next(task2);

            // THEN
            test.deepEqual(render(task1), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'A chain can be appended to'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');
            const task3 = new stepfunctions.Pass(stack, 'State Three');

            // WHEN
            const chain = task1.next(task2).next(task3);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', Next: 'State Three' },
                    'State Three': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'A state machine can be appended to another state machine'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');
            const task3 = new stepfunctions.Wait(stack, 'State Three', { seconds: 10 });

            // WHEN
            const chain = task1.next(task2.next(task3));

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', Next: 'State Three' },
                    'State Three': { Type: 'Wait', End: true, Seconds: 10 },
                }
            });

            test.done();
        },

        'Start state in a StateMachineFragment can be implicit'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const sm = new ReusableStateMachineWithImplicitStartState(stack, 'Reusable');

            // THEN
            test.equals(render(sm).StartAt, 'Reusable/Choice');

            test.done();
        },

        'Can skip adding names in StateMachineFragment'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const sm = new ReusableStateMachineWithImplicitStartState(stack, 'Reusable', { scopeStateNames: false });

            // THEN
            test.equals(render(sm).StartAt, 'Choice');

            test.done();
        },

        'A state machine definition can be instantiated and chained'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const before = new stepfunctions.Pass(stack, 'Before');
            const after = new stepfunctions.Pass(stack, 'After');

            // WHEN
            const chain = before.next(new ReusableStateMachine(stack, 'Reusable')).next(after);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Before',
                States: {
                    'Before': { Type: 'Pass', Next: 'Reusable/Choice' },
                    'Reusable/Choice': {
                        Type: 'Choice',
                        Choices: [
                            { Variable: '$.branch', StringEquals: 'left', Next: 'Reusable/Left Branch' },
                            { Variable: '$.branch', StringEquals: 'right', Next: 'Reusable/Right Branch' },
                        ]
                    },
                    'Reusable/Left Branch': { Type: 'Pass', Next: 'After' },
                    'Reusable/Right Branch': { Type: 'Pass', Next: 'After' },
                    'After': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'A success state cannot be chained onto'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineFragment(stack, 'SM');

            const succeed = new stepfunctions.Succeed(sm, 'Succeed');
            const pass = new stepfunctions.Pass(sm, 'Pass');

            // WHEN
            test.throws(() => {
                succeed.toStateChain().next(pass);
            });

            test.done();
        },

        'A failure state cannot be chained onto'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineFragment(stack, 'SM');
            const fail = new stepfunctions.Fail(sm, 'Fail', { error: 'X', cause: 'Y' });
            const pass = new stepfunctions.Pass(sm, 'Pass');

            // WHEN
            test.throws(() => {
                fail.toStateChain().next(pass);
            });

            test.done();
        },

        'Parallels can contain direct states'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const one = new stepfunctions.Pass(stack, 'One');
            const two = new stepfunctions.Pass(stack, 'Two');
            const three = new stepfunctions.Pass(stack, 'Three');

            // WHEN
            const para = new stepfunctions.Parallel(stack, 'Parallel');
            para.branch(one.next(two));
            para.branch(three);

            // THEN
            test.deepEqual(render(para), {
                StartAt: 'Parallel',
                States: {
                    Parallel: {
                        Type: 'Parallel',
                        End: true,
                        Branches: [
                            {
                                StartAt: 'One',
                                States: {
                                    One: { Type: 'Pass', Next: 'Two' },
                                    Two: { Type: 'Pass', End: true },
                                }
                            },
                            {
                                StartAt: 'Three',
                                States: {
                                    Three: { Type: 'Pass', End: true }
                                }
                            }
                        ]
                    }
                }
            });

            test.done();
        },

        'Parallels can contain instantiated reusable definitions'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const para = new stepfunctions.Parallel(stack, 'Parallel');
            para.branch(new ReusableStateMachine(stack, 'Reusable1'));
            para.branch(new ReusableStateMachine(stack, 'Reusable2'));

            // THEN
            test.deepEqual(render(para), {
                StartAt: 'Parallel',
                States: {
                    Parallel: {
                        Type: 'Parallel',
                        End: true,
                        Branches: [
                            {
                                StartAt: 'Reusable1/Choice',
                                States: {
                                    'Reusable1/Choice': {
                                        Type: 'Choice',
                                        Choices: [
                                            { Variable: '$.branch', StringEquals: 'left', Next: 'Reusable1/Left Branch' },
                                            { Variable: '$.branch', StringEquals: 'right', Next: 'Reusable1/Right Branch' },
                                        ]
                                    },
                                    'Reusable1/Left Branch': { Type: 'Pass', End: true },
                                    'Reusable1/Right Branch': { Type: 'Pass', End: true },
                                }
                            },
                            {
                                StartAt: 'Reusable2/Choice',
                                States: {
                                    'Reusable2/Choice': {
                                        Type: 'Choice',
                                        Choices: [
                                            { Variable: '$.branch', StringEquals: 'left', Next: 'Reusable2/Left Branch' },
                                            { Variable: '$.branch', StringEquals: 'right', Next: 'Reusable2/Right Branch' },
                                        ]
                                    },
                                    'Reusable2/Left Branch': { Type: 'Pass', End: true },
                                    'Reusable2/Right Branch': { Type: 'Pass', End: true },
                                }
                            },
                        ]
                    }
                }
            });

            test.done();
        },

        'Chaining onto branched failure state ignores failure state'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const yes = new stepfunctions.Pass(stack, 'Yes');
            const no = new stepfunctions.Fail(stack, 'No', { error: 'Failure', cause: 'Wrong branch' });
            const enfin = new stepfunctions.Pass(stack, 'Finally');
            const choice = new stepfunctions.Choice(stack, 'Choice')
                .on(stepfunctions.Condition.stringEquals('$.foo', 'bar'), yes)
                .otherwise(no);

            // WHEN
            choice.closure().next(enfin);

            // THEN
            test.deepEqual(render(choice), {
                StartAt: 'Choice',
                States: {
                    Choice: {
                        Type: 'Choice',
                        Choices: [
                            { Variable: '$.foo', StringEquals: 'bar', Next: 'Yes' },
                        ],
                        Default: 'No',
                    },
                    Yes: { Type: 'Pass', Next: 'Finally' },
                    No: { Type: 'Fail', Error: 'Failure', Cause: 'Wrong branch' },
                    Finally: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },
    },

    'Goto support': {
        'State machines can have unconstrainted gotos'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const one = new stepfunctions.Pass(stack, 'One');
            const two = new stepfunctions.Pass(stack, 'Two');

            // WHEN
            const chain = one.next(two).next(one);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'One',
                States: {
                    One: { Type: 'Pass', Next: 'Two' },
                    Two: { Type: 'Pass', Next: 'One' },
                }
            });

            test.done();
        },
    },

    'Error handling': {
        'States can have error branches'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            const chain = task1.onError(failure);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        End: true,
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ]
                    },
                    Failed: {
                        Type: 'Fail',
                        Error: 'DidNotWork',
                        Cause: 'We got stuck',
                    }
                }
            });

            test.done();
        },

        'Error branch is attached to all tasks in chain'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { resource: new FakeResource() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.next(task2).onError(errorHandler);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ]
                    },
                    Task2: {
                        Type: 'Task',
                        Resource: 'resource',
                        End: true,
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ]
                    },
                    ErrorHandler: { Type: 'Pass', End: true }
                }
            });

            test.done();
        },

        'Add default retries on all tasks in the chain, but not those outside'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { resource: new FakeResource() });
            const task3 = new stepfunctions.Task(stack, 'Task3', { resource: new FakeResource() });
            const task4 = new stepfunctions.Task(stack, 'Task4', { resource: new FakeResource() });
            const task5 = new stepfunctions.Task(stack, 'Task5', { resource: new FakeResource() });
            const choice = new stepfunctions.Choice(stack, 'Choice');
            const errorHandler1 = new stepfunctions.Task(stack, 'ErrorHandler1', { resource: new FakeResource() });
            const errorHandler2 = new stepfunctions.Task(stack, 'ErrorHandler2', { resource: new FakeResource() });
            const para = new stepfunctions.Parallel(stack, 'Para');

            // WHEN
            task1.next(task2);
            para.onError(errorHandler2);

            task2.onError(errorHandler1)
                .next(choice
                    .on(stepfunctions.Condition.stringEquals('$.var', 'value'),
                        task3.next(task4))
                    .otherwise(para
                        .branch(task5)))
                .defaultRetry();

            // THEN
            const theCatch1 = { Catch: [ { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler1' } ] };
            const theCatch2 = { Catch: [ { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler2' } ] };
            const theRetry = { Retry: [ { ErrorEquals: ['States.ALL'] } ] };

            test.deepEqual(render(task1), {
                StartAt: 'Task1',
                States: {
                    Task1: { Next: 'Task2', Type: 'Task', Resource: 'resource' },
                    Task2: { Next: 'Choice', Type: 'Task', Resource: 'resource', ...theCatch1, ...theRetry },
                    ErrorHandler1: { End: true, Type: 'Task', Resource: 'resource', ...theRetry },
                    Choice: {
                        Type: 'Choice',
                        Choices: [ { Variable: '$.var', StringEquals: 'value', Next: 'Task3' } ],
                        Default: 'Para',
                    },
                    Task3: { Next: 'Task4', Type: 'Task', Resource: 'resource', ...theRetry },
                    Task4: { End: true, Type: 'Task', Resource: 'resource', ...theRetry },
                    Para: {
                        Type: 'Parallel',
                        End: true,
                        Branches: [
                            {
                                StartAt: 'Task5',
                                States: {
                                    Task5: { End: true, Type: 'Task', Resource: 'resource' }
                                }
                            }
                        ],
                        ...theCatch2,
                        ...theRetry
                    },
                    ErrorHandler2: { End: true, Type: 'Task', Resource: 'resource' },
                }
            });

            test.done();
        },

        /*

        ** FIXME: Not implemented at the moment, since we need to make a Construct for this and the
           name and parent aren't obvious.

        'Machine is wrapped in parallel if not all tasks can have catch'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const wait = new stepfunctions.Wait(stack, 'Wait', { seconds: 10 });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            const chain = task1.next(wait).onError(errorHandler);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Para',
                States: {
                    Para: {
                        Type: 'Parallel',
                        End: true,
                        Branches: [
                            {
                                StartAt: 'Task1',
                                States: {
                                    Task1: {
                                        Type: 'Task',
                                        Resource: 'resource',
                                        Next: 'Wait',
                                    },
                                    Wait: {
                                        Type: 'Wait',
                                        End: true,
                                        Seconds: 10
                                    },
                                }
                            }
                        ],
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ]
                    },
                    ErrorHandler: { Type: 'Pass', End: true }
                }
            });

            test.done();
        },
        */

        'Chaining does not chain onto error handler state'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { resource: new FakeResource() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.onError(errorHandler).next(task2);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ]
                    },
                    Task2: { Type: 'Task', Resource: 'resource', End: true },
                    ErrorHandler: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'After calling .closure() do chain onto error state'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { resource: new FakeResource() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.onError(errorHandler).closure().next(task2);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ]
                    },
                    ErrorHandler: { Type: 'Pass', Next: 'Task2' },
                    Task2: { Type: 'Task', Resource: 'resource', End: true },
                }
            });

            test.done();
        },

        'Can merge state machines with shared states'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { resource: new FakeResource() });
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            task1.onError(failure);
            task2.onError(failure);

            task1.next(task2);

            // THEN
            test.deepEqual(render(task1), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ]
                    },
                    Task2: {
                        Type: 'Task',
                        Resource: 'resource',
                        End: true,
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ]
                    },
                    Failed: {
                        Type: 'Fail',
                        Error: 'DidNotWork',
                        Cause: 'We got stuck',
                    }
                }
            });

            test.done();
        }
    }
};

class ReusableStateMachine extends stepfunctions.StateMachineFragment {
    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        this.start(
            new stepfunctions.Choice(this, 'Choice')
                .on(stepfunctions.Condition.stringEquals('$.branch', 'left'), new stepfunctions.Pass(this, 'Left Branch'))
                .on(stepfunctions.Condition.stringEquals('$.branch', 'right'), new stepfunctions.Pass(this, 'Right Branch')));
    }
}

class ReusableStateMachineWithImplicitStartState extends stepfunctions.StateMachineFragment {
    constructor(parent: cdk.Construct, id: string, props: stepfunctions.StateMachineFragmentProps = {}) {
        super(parent, id, props);

        const choice = new stepfunctions.Choice(this, 'Choice');
        choice.on(stepfunctions.Condition.stringEquals('$.branch', 'left'), new stepfunctions.Pass(this, 'Left Branch'));
        choice.on(stepfunctions.Condition.stringEquals('$.branch', 'right'), new stepfunctions.Pass(this, 'Right Branch'));
    }
}

class FakeResource implements stepfunctions.IStepFunctionsTaskResource {
    public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
        return {
            resourceArn: new cdk.Arn('resource')
        };
    }
}

function render(sm: IChainable) {
    return cdk.resolve(sm.toStateChain().renderStateMachine().stateMachineDefinition);
}