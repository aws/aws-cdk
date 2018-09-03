import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Basic composition': {
        'A single task is a State Machine'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            // WHEN
            new stepfunctions.Pass(sm, 'Some State');

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            // WHEN
            const task1 = new stepfunctions.Pass(sm, 'State One');
            const task2 = new stepfunctions.Pass(sm, 'State Two');

            task1.then(task2);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Pass(sm, 'State One');
            const task2 = new stepfunctions.Pass(sm, 'State Two');
            const task3 = new stepfunctions.Pass(sm, 'State Three');

            // WHEN
            task1.then(task2).then(task3);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Pass(sm, 'State One');
            const task2 = new stepfunctions.Pass(sm, 'State Two');
            const task3 = new stepfunctions.Pass(sm, 'State Three');

            // WHEN
            task1.then(task2.then(task3));

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', Next: 'State Three' },
                    'State Three': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'Two chained states must be in the same state machine definition'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm1 = new stepfunctions.StateMachineDefinition(stack, 'SM1');
            const sm2 = new stepfunctions.StateMachineDefinition(stack, 'SM2');

            const pass1 = new stepfunctions.Pass(sm1, 'Pass1');
            const pass2 = new stepfunctions.Pass(sm2, 'Pass2');

            // THEN
            test.throws(() => {
                pass1.then(pass2);
            });

            test.done();
        },

        'A state machine definition can be instantiated and chained'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');
            const before = new stepfunctions.Pass(sm, 'Before');
            const after = new stepfunctions.Pass(sm, 'After');

            // WHEN
            before.then(new ReusableStateMachine(stack, 'Reusable')).then(after);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const succeed = new stepfunctions.Succeed(sm, 'Succeed');
            const pass = new stepfunctions.Pass(sm, 'Pass');

            // WHEN
            test.throws(() => {
                succeed.then(pass);
            });

            test.done();
        },

        'A failure state cannot be chained onto'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');
            const fail = new stepfunctions.Fail(sm, 'Fail', { error: 'X', cause: 'Y' });
            const pass = new stepfunctions.Pass(sm, 'Pass');

            // WHEN
            test.throws(() => {
                fail.then(pass);
            });

            test.done();
        },

        'Parallels contains adhoc state machine definitions without scoping names'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            // WHEN
            const para = new stepfunctions.Parallel(sm, 'Parallel');

            // Key: the parent is the same parent as the top-level StateMachineDefinition.
            const branch1 = new stepfunctions.StateMachineDefinition(stack, 'Branch1');
            branch1.start(new stepfunctions.Pass(branch1, 'One'))
                .then(new stepfunctions.Pass(branch1, 'Two'));

            const branch2 = new stepfunctions.StateMachineDefinition(stack, 'Branch1');
            branch2.start(new stepfunctions.Pass(branch2, 'Three'));

            para.parallel(branch1);
            para.parallel(branch2);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            // WHEN
            const para = new stepfunctions.Parallel(sm, 'Parallel');
            para.parallel(new ReusableStateMachine(sm, 'Reusable1'));
            para.parallel(new ReusableStateMachine(sm, 'Reusable2'));

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const yes = new stepfunctions.Pass(sm, 'Yes');
            const no = new stepfunctions.Fail(sm, 'No', { error: 'Failure', cause: 'Wrong branch' });
            const enfin = new stepfunctions.Pass(sm, 'Finally');
            const choice = new stepfunctions.Choice(sm, 'Choice')
                .on(stepfunctions.Condition.stringEquals('$.foo', 'bar'), yes)
                .otherwise(no);

            // WHEN
            choice.then(enfin);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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

    'Elision': {
        'An elidable pass state that is chained onto should disappear'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const first = new stepfunctions.Pass(sm, 'First');
            const success = new stepfunctions.Pass(sm, 'Success', { elidable: true });
            const second = new stepfunctions.Pass(sm, 'Second');

            // WHEN
            first.then(success).then(second);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
                StartAt: 'First',
                States: {
                    First: { Type: 'Pass', Next: 'Second' },
                    Second: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'An elidable pass state at the end of a chain should disappear'(test: Test) {
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const first = new stepfunctions.Pass(sm, 'First');
            const pass = new stepfunctions.Pass(sm, 'Pass', { elidable: true });

            // WHEN
            first.then(pass);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
                StartAt: 'First',
                States: {
                    First: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'An elidable success state at the end of a chain should disappear'(test: Test) {
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const first = new stepfunctions.Pass(sm, 'First');
            const success = new stepfunctions.Succeed(sm, 'Success', { elidable: true });

            // WHEN
            first.then(success);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
                StartAt: 'First',
                States: {
                    First: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },
    },

    'Goto support': {
        'State machines can have unconstrainted gotos'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const one = new stepfunctions.Pass(sm, 'One');
            const two = new stepfunctions.Pass(sm, 'Two');

            // WHEN
            one.then(two).then(one);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Task(sm, 'Task1', { resource: new FakeResource() });
            const failure = new stepfunctions.Fail(sm, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            task1.toStateChain().catch(failure);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Task(sm, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(sm, 'Task2', { resource: new FakeResource() });
            const errorHandler = new stepfunctions.Pass(sm, 'ErrorHandler');

            // WHEN
            task1.then(task2).catch(errorHandler);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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

        'Machine is wrapped in parallel if not all tasks can have catch'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Task(sm, 'Task1', { resource: new FakeResource() });
            const wait = new stepfunctions.Wait(sm, 'Wait', { seconds: 10 });
            const errorHandler = new stepfunctions.Pass(sm, 'ErrorHandler');

            // WHEN
            task1.then(wait).catch(errorHandler);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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

        'Error branch does not count for chaining'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Task(sm, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(sm, 'Task2', { resource: new FakeResource() });
            const errorHandler = new stepfunctions.Pass(sm, 'ErrorHandler');

            // WHEN
            task1.catch(errorHandler).then(task2);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
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

        'Can merge state machines with shared states'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const sm = new stepfunctions.StateMachineDefinition(stack, 'SM');

            const task1 = new stepfunctions.Task(sm, 'Task1', { resource: new FakeResource() });
            const task2 = new stepfunctions.Task(sm, 'Task2', { resource: new FakeResource() });
            const failure = new stepfunctions.Fail(sm, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            task1.catch(failure);
            task2.catch(failure);

            task1.then(task2);

            // THEN
            test.deepEqual(cdk.resolve(sm.renderStateMachine()), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ]
                    },
                    Task2: {
                        Type: 'Task',
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

class ReusableStateMachine extends stepfunctions.StateMachineDefinition {
    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        this.start(
            new stepfunctions.Choice(this, 'Choice')
                .on(stepfunctions.Condition.stringEquals('$.branch', 'left'), new stepfunctions.Pass(this, 'Left Branch'))
                .on(stepfunctions.Condition.stringEquals('$.branch', 'right'), new stepfunctions.Pass(this, 'Right Branch')));
    }
}

class FakeResource implements stepfunctions.IStepFunctionsTaskResource {
    public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
        return {
            resourceArn: new cdk.Arn('resource')
        };
    }
}
