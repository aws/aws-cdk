import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');
import { IStepFunctionsTask } from '../lib';

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

            const chain = stepfunctions.Chain
                .start(task1)
                .next(task2);

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
            const chain = stepfunctions.Chain
                .start(task1)
                .next(task2)
                .next(task3);

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
            const task3 = new stepfunctions.Wait(stack, 'State Three', {
                time: stepfunctions.WaitTime.duration(cdk.Duration.seconds(10))
            });

            // WHEN
            const chain = stepfunctions.Chain
                .start(task1)
                .next(stepfunctions.Chain.start(task2).next(task3));

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
                    'Before': { Type: 'Pass', Next: 'Choice' },
                    'Choice': {
                        Type: 'Choice',
                        Choices: [
                            { Variable: '$.branch', StringEquals: 'left', Next: 'Left Branch' },
                            { Variable: '$.branch', StringEquals: 'right', Next: 'Right Branch' },
                        ]
                    },
                    'Left Branch': { Type: 'Pass', Next: 'After' },
                    'Right Branch': { Type: 'Pass', Next: 'After' },
                    'After': { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'A success state cannot be chained onto'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const succeed = new stepfunctions.Succeed(stack, 'Succeed');
            const pass = new stepfunctions.Pass(stack, 'Pass');

            // WHEN
            test.throws(() => {
                pass.next(succeed).next(pass);
            });

            test.done();
        },

        'A failure state cannot be chained onto'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const fail = new stepfunctions.Fail(stack, 'Fail', { error: 'X', cause: 'Y' });
            const pass = new stepfunctions.Pass(stack, 'Pass');

            // WHEN
            test.throws(() => {
                pass.next(fail).next(pass);
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
            para.branch(new ReusableStateMachine(stack, 'Reusable1').prefixStates('Reusable1/'));
            para.branch(new ReusableStateMachine(stack, 'Reusable2').prefixStates('Reusable2/'));

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

        'State Machine Fragments can be wrapped in a single state'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const reusable = new SimpleChain(stack, 'Hello');
            const state = reusable.toSingleState();

            test.deepEqual(render(state), {
                StartAt: 'Hello',
                States: {
                    Hello: {
                        Type: 'Parallel',
                        End: true,
                        Branches: [
                            {
                                StartAt: 'Hello: Task1',
                                States: {
                                    'Hello: Task1': { Type: 'Task', Next: 'Hello: Task2', Resource: 'resource' },
                                    'Hello: Task2': { Type: 'Task', End: true, Resource: 'resource' },
                                }
                            }
                        ],
                    },
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
                .when(stepfunctions.Condition.stringEquals('$.foo', 'bar'), yes)
                .otherwise(no);

            // WHEN
            choice.afterwards().next(enfin);

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

        'Can include OTHERWISE transition for Choice in afterwards()'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const chain = new stepfunctions.Choice(stack, 'Choice')
                .when(stepfunctions.Condition.stringEquals('$.foo', 'bar'),
                    new stepfunctions.Pass(stack, 'Yes'))
                .afterwards({ includeOtherwise: true })
                .next(new stepfunctions.Pass(stack, 'Finally'));

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Choice',
                States: {
                    Choice: {
                        Type: 'Choice',
                        Choices: [
                            { Variable: '$.foo', StringEquals: 'bar', Next: 'Yes' },
                        ],
                        Default: 'Finally',
                    },
                    Yes: { Type: 'Pass', Next: 'Finally' },
                    Finally: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'basic dynamic map'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const task1 = new stepfunctions.Map(stack, 'State One', {
                inputPath: "$.shipped"
            });

            const task2 = new stepfunctions.Pass(stack, 'State Two');
            const innerChain = stepfunctions.Chain.start(task2);

            task1.dynamicBranch(innerChain);
            const chain = stepfunctions.Chain
                .start(task1);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', End: true },
                }
            });

            test.done();
        }
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

    'Catches': {
        'States can have error branches'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask()});
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            const chain = task1.addCatch(failure);

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

        'Retries and errors with a result path'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            const chain = task1.addRetry({ errors: ['HTTPError'], maxAttempts: 2 }).addCatch(failure, { resultPath: '$.some_error' }).next(failure);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Catch: [ { ErrorEquals: ['States.ALL'], Next: 'Failed', ResultPath: '$.some_error' } ],
                        Retry: [ { ErrorEquals: ['HTTPError'], MaxAttempts: 2 } ],
                        Next: 'Failed',
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

        'Can wrap chain and attach error handler'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { task: new FakeTask() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.next(task2).toSingleState('Wrapped').addCatch(errorHandler);

            // THEN
            test.deepEqual(render(chain), {
                StartAt: 'Wrapped',
                States: {
                    Wrapped: {
                        Type: 'Parallel',
                        Branches: [
                            {
                                StartAt: 'Task1',
                                States: {
                                    Task1: {
                                        Type: 'Task',
                                        Resource: 'resource',
                                        Next: 'Task2',
                                    },
                                    Task2: {
                                        Type: 'Task',
                                        Resource: 'resource',
                                        End: true,
                                    },
                                }
                            }
                        ],
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ],
                        End: true
                    },
                    ErrorHandler: { Type: 'Pass', End: true }
                },
            });

            test.done();
        },

        'Chaining does not chain onto error handler state'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { task: new FakeTask() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.addCatch(errorHandler).next(task2);

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

        'Chaining does not chain onto error handler, extended'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { task: new FakeTask() });
            const task3 = new stepfunctions.Task(stack, 'Task3', { task: new FakeTask() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            const chain = task1.addCatch(errorHandler)
                .next(task2.addCatch(errorHandler))
                .next(task3.addCatch(errorHandler));

            // THEN
            const sharedTaskProps = { Type: 'Task', Resource: 'resource', Catch: [ { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' } ] };
            test.deepEqual(render(chain), {
                StartAt: 'Task1',
                States: {
                    Task1: { Next: 'Task2', ...sharedTaskProps },
                    Task2: { Next: 'Task3', ...sharedTaskProps },
                    Task3: { End: true, ...sharedTaskProps },
                    ErrorHandler: { Type: 'Pass', End: true },
                }
            });

            test.done();
        },

        'Error handler with a fragment'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { task: new FakeTask() });
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');

            // WHEN
            task1.addCatch(errorHandler)
                .next(new SimpleChain(stack, 'Chain').catch(errorHandler))
                .next(task2.addCatch(errorHandler));

            test.done();
        },

        'Can merge state machines with shared states'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            const task1 = new stepfunctions.Task(stack, 'Task1', { task: new FakeTask() });
            const task2 = new stepfunctions.Task(stack, 'Task2', { task: new FakeTask() });
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });

            // WHEN
            task1.addCatch(failure);
            task2.addCatch(failure);

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
    },

    'State machine validation': {
        'No duplicate state IDs'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const intermediateParent = new cdk.Construct(stack, 'Parent');

            const state1 = new stepfunctions.Pass(stack, 'State');
            const state2 = new stepfunctions.Pass(intermediateParent, 'State');

            state1.next(state2);

            // WHEN
            test.throws(() => {
                render(state1);
            });

            test.done();
        },

        'No duplicate state IDs even across Parallel branches'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const intermediateParent = new cdk.Construct(stack, 'Parent');

            const state1 = new stepfunctions.Pass(stack, 'State');
            const state2 = new stepfunctions.Pass(intermediateParent, 'State');

            const parallel = new stepfunctions.Parallel(stack, 'Parallel')
                .branch(state1)
                .branch(state2);

            // WHEN
            test.throws(() => {
                render(parallel);
            });

            test.done();
        },

        'No cross-parallel jumps'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const state1 = new stepfunctions.Pass(stack, 'State1');
            const state2 = new stepfunctions.Pass(stack, 'State2');

            test.throws(() => {
                new stepfunctions.Parallel(stack, 'Parallel')
                    .branch(state1.next(state2))
                    .branch(state2);
            });

            test.done();
        },
    },
};

class ReusableStateMachine extends stepfunctions.StateMachineFragment {
    public readonly startState: stepfunctions.State;
    public readonly endStates: stepfunctions.INextable[];
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const choice = new stepfunctions.Choice(this, 'Choice')
            .when(stepfunctions.Condition.stringEquals('$.branch', 'left'), new stepfunctions.Pass(this, 'Left Branch'))
            .when(stepfunctions.Condition.stringEquals('$.branch', 'right'), new stepfunctions.Pass(this, 'Right Branch'));

        this.startState = choice;
        this.endStates = choice.afterwards().endStates;
    }
}

class SimpleChain extends stepfunctions.StateMachineFragment {
    public readonly startState: stepfunctions.State;
    public readonly endStates: stepfunctions.INextable[];

    private readonly task2: stepfunctions.Task;
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const task1 = new stepfunctions.Task(this, 'Task1', { task: new FakeTask() });
        this.task2 = new stepfunctions.Task(this, 'Task2', { task: new FakeTask() });

        task1.next(this.task2);

        this.startState = task1;
        this.endStates = [this.task2];
    }

    public catch(state: stepfunctions.IChainable, props?: stepfunctions.CatchProps): SimpleChain {
        this.task2.addCatch(state, props);
        return this;
    }
}

function render(sm: stepfunctions.IChainable) {
    return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}

class FakeTask implements IStepFunctionsTask {
    public bind(_task: stepfunctions.Task): stepfunctions.StepFunctionsTaskConfig {
        return {
            resourceArn: 'resource'
        };
    }
}
