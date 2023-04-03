"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const stepfunctions = require("../lib");
describe('States Language', () => {
    test('A single task is a State Machine', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const chain = new stepfunctions.Pass(stack, 'Some State');
        // THEN
        expect(render(chain)).toStrictEqual({
            StartAt: 'Some State',
            States: {
                'Some State': { Type: 'Pass', End: true },
            },
        });
    }),
        test('A sequence of two tasks is a State Machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');
            const chain = stepfunctions.Chain
                .start(task1)
                .next(task2);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', End: true },
                },
            });
        }),
        test('You dont need to hold on to the state to render the entire state machine correctly', () => {
            const stack = new cdk.Stack();
            // WHEN
            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');
            task1.next(task2);
            // THEN
            expect(render(task1)).toStrictEqual({
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', End: true },
                },
            });
        }),
        test('A chain can be appended to', () => {
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
            expect(render(chain)).toStrictEqual({
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', Next: 'State Three' },
                    'State Three': { Type: 'Pass', End: true },
                },
            });
        }),
        test('A state machine can be appended to another state machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new stepfunctions.Pass(stack, 'State One');
            const task2 = new stepfunctions.Pass(stack, 'State Two');
            const task3 = new stepfunctions.Wait(stack, 'State Three', {
                time: stepfunctions.WaitTime.duration(cdk.Duration.seconds(10)),
            });
            // WHEN
            const chain = stepfunctions.Chain
                .start(task1)
                .next(stepfunctions.Chain.start(task2).next(task3));
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'State One',
                States: {
                    'State One': { Type: 'Pass', Next: 'State Two' },
                    'State Two': { Type: 'Pass', Next: 'State Three' },
                    'State Three': { Type: 'Wait', End: true, Seconds: 10 },
                },
            });
        }),
        test('A state machine definition can be instantiated and chained', () => {
            const stack = new cdk.Stack();
            const before = new stepfunctions.Pass(stack, 'Before');
            const after = new stepfunctions.Pass(stack, 'After');
            // WHEN
            const chain = before.next(new ReusableStateMachine(stack, 'Reusable')).next(after);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'Before',
                States: {
                    'Before': { Type: 'Pass', Next: 'Choice' },
                    'Choice': {
                        Type: 'Choice',
                        Choices: [
                            { Variable: '$.branch', StringEquals: 'left', Next: 'Left Branch' },
                            { Variable: '$.branch', StringEquals: 'right', Next: 'Right Branch' },
                        ],
                    },
                    'Left Branch': { Type: 'Pass', Next: 'After' },
                    'Right Branch': { Type: 'Pass', Next: 'After' },
                    'After': { Type: 'Pass', End: true },
                },
            });
        }),
        test('A success state cannot be chained onto', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const succeed = new stepfunctions.Succeed(stack, 'Succeed');
            const pass = new stepfunctions.Pass(stack, 'Pass');
            // WHEN
            expect(() => pass.next(succeed).next(pass)).toThrow();
        }),
        test('A failure state cannot be chained onto', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fail = new stepfunctions.Fail(stack, 'Fail', { error: 'X', cause: 'Y' });
            const pass = new stepfunctions.Pass(stack, 'Pass');
            // WHEN
            expect(() => pass.next(fail).next(pass)).toThrow();
        }),
        test('Parallels can contain direct states', () => {
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
            expect(render(para)).toStrictEqual({
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
                                },
                            },
                            {
                                StartAt: 'Three',
                                States: {
                                    Three: { Type: 'Pass', End: true },
                                },
                            },
                        ],
                    },
                },
            });
        }),
        test('Parallels can contain instantiated reusable definitions', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const para = new stepfunctions.Parallel(stack, 'Parallel');
            para.branch(new ReusableStateMachine(stack, 'Reusable1').prefixStates('Reusable1/'));
            para.branch(new ReusableStateMachine(stack, 'Reusable2').prefixStates('Reusable2/'));
            // THEN
            expect(render(para)).toStrictEqual({
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
                                        ],
                                    },
                                    'Reusable1/Left Branch': { Type: 'Pass', End: true },
                                    'Reusable1/Right Branch': { Type: 'Pass', End: true },
                                },
                            },
                            {
                                StartAt: 'Reusable2/Choice',
                                States: {
                                    'Reusable2/Choice': {
                                        Type: 'Choice',
                                        Choices: [
                                            { Variable: '$.branch', StringEquals: 'left', Next: 'Reusable2/Left Branch' },
                                            { Variable: '$.branch', StringEquals: 'right', Next: 'Reusable2/Right Branch' },
                                        ],
                                    },
                                    'Reusable2/Left Branch': { Type: 'Pass', End: true },
                                    'Reusable2/Right Branch': { Type: 'Pass', End: true },
                                },
                            },
                        ],
                    },
                },
            });
        }),
        test('State Machine Fragments can be wrapped in a single state', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const reusable = new SimpleChain(stack, 'Hello');
            const state = reusable.toSingleState();
            expect(render(state)).toStrictEqual({
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
                                },
                            },
                        ],
                    },
                },
            });
        }),
        test('Chaining onto branched failure state ignores failure state', () => {
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
            expect(render(choice)).toStrictEqual({
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
                },
            });
        }),
        test('Can include OTHERWISE transition for Choice in afterwards()', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const chain = new stepfunctions.Choice(stack, 'Choice')
                .when(stepfunctions.Condition.stringEquals('$.foo', 'bar'), new stepfunctions.Pass(stack, 'Yes'))
                .afterwards({ includeOtherwise: true })
                .next(new stepfunctions.Pass(stack, 'Finally'));
            // THEN
            expect(render(chain)).toStrictEqual({
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
                },
            });
        }),
        test('State machines can have unconstrainted gotos', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const one = new stepfunctions.Pass(stack, 'One');
            const two = new stepfunctions.Pass(stack, 'Two');
            // WHEN
            const chain = one.next(two).next(one);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'One',
                States: {
                    One: { Type: 'Pass', Next: 'Two' },
                    Two: { Type: 'Pass', Next: 'One' },
                },
            });
        }),
        test('States can have error branches', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });
            // WHEN
            const chain = task1.addCatch(failure);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        End: true,
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ],
                    },
                    Failed: {
                        Type: 'Fail',
                        Error: 'DidNotWork',
                        Cause: 'We got stuck',
                    },
                },
            });
        }),
        test('Retries and errors with a result path', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });
            // WHEN
            const chain = task1.addRetry({ errors: ['HTTPError'], maxAttempts: 2 }).addCatch(failure, { resultPath: '$.some_error' }).next(failure);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Catch: [{ ErrorEquals: ['States.ALL'], Next: 'Failed', ResultPath: '$.some_error' }],
                        Retry: [{ ErrorEquals: ['HTTPError'], MaxAttempts: 2 }],
                        Next: 'Failed',
                    },
                    Failed: {
                        Type: 'Fail',
                        Error: 'DidNotWork',
                        Cause: 'We got stuck',
                    },
                },
            });
        }),
        test('Can wrap chain and attach error handler', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const task2 = new FakeTask(stack, 'Task2');
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');
            // WHEN
            const chain = task1.next(task2).toSingleState('Wrapped').addCatch(errorHandler);
            // THEN
            expect(render(chain)).toStrictEqual({
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
                                },
                            },
                        ],
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ],
                        End: true,
                    },
                    ErrorHandler: { Type: 'Pass', End: true },
                },
            });
        }),
        test('Chaining does not chain onto error handler state', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const task2 = new FakeTask(stack, 'Task2');
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');
            // WHEN
            const chain = task1.addCatch(errorHandler).next(task2);
            // THEN
            expect(render(chain)).toStrictEqual({
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' },
                        ],
                    },
                    Task2: { Type: 'Task', Resource: 'resource', End: true },
                    ErrorHandler: { Type: 'Pass', End: true },
                },
            });
        }),
        test('Chaining does not chain onto error handler, extended', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const task2 = new FakeTask(stack, 'Task2');
            const task3 = new FakeTask(stack, 'Task3');
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');
            // WHEN
            const chain = task1.addCatch(errorHandler)
                .next(task2.addCatch(errorHandler))
                .next(task3.addCatch(errorHandler));
            // THEN
            const sharedTaskProps = { Type: 'Task', Resource: 'resource', Catch: [{ ErrorEquals: ['States.ALL'], Next: 'ErrorHandler' }] };
            expect(render(chain)).toStrictEqual({
                StartAt: 'Task1',
                States: {
                    Task1: { Next: 'Task2', ...sharedTaskProps },
                    Task2: { Next: 'Task3', ...sharedTaskProps },
                    Task3: { End: true, ...sharedTaskProps },
                    ErrorHandler: { Type: 'Pass', End: true },
                },
            });
        }),
        test('Error handler with a fragment', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const task2 = new FakeTask(stack, 'Task2');
            const errorHandler = new stepfunctions.Pass(stack, 'ErrorHandler');
            // WHEN
            task1.addCatch(errorHandler)
                .next(new SimpleChain(stack, 'Chain').catch(errorHandler))
                .next(task2.addCatch(errorHandler));
        }),
        test('Can merge state machines with shared states', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task1 = new FakeTask(stack, 'Task1');
            const task2 = new FakeTask(stack, 'Task2');
            const failure = new stepfunctions.Fail(stack, 'Failed', { error: 'DidNotWork', cause: 'We got stuck' });
            // WHEN
            task1.addCatch(failure);
            task2.addCatch(failure);
            task1.next(task2);
            // THEN
            expect(render(task1)).toStrictEqual({
                StartAt: 'Task1',
                States: {
                    Task1: {
                        Type: 'Task',
                        Resource: 'resource',
                        Next: 'Task2',
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ],
                    },
                    Task2: {
                        Type: 'Task',
                        Resource: 'resource',
                        End: true,
                        Catch: [
                            { ErrorEquals: ['States.ALL'], Next: 'Failed' },
                        ],
                    },
                    Failed: {
                        Type: 'Fail',
                        Error: 'DidNotWork',
                        Cause: 'We got stuck',
                    },
                },
            });
        }),
        test('No duplicate state IDs', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const intermediateParent = new constructs_1.Construct(stack, 'Parent');
            const state1 = new stepfunctions.Pass(stack, 'State');
            const state2 = new stepfunctions.Pass(intermediateParent, 'State');
            state1.next(state2);
            // WHEN
            expect(() => render(state1)).toThrow();
        }),
        test('No duplicate state IDs even across Parallel branches', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const intermediateParent = new constructs_1.Construct(stack, 'Parent');
            const state1 = new stepfunctions.Pass(stack, 'State');
            const state2 = new stepfunctions.Pass(intermediateParent, 'State');
            const parallel = new stepfunctions.Parallel(stack, 'Parallel')
                .branch(state1)
                .branch(state2);
            // WHEN
            expect(() => render(parallel)).toThrow();
        }),
        test('No cross-parallel jumps', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const state1 = new stepfunctions.Pass(stack, 'State1');
            const state2 = new stepfunctions.Pass(stack, 'State2');
            const parallel = new stepfunctions.Parallel(stack, 'Parallel')
                .branch(state1.next(state2))
                .branch(state2);
            // WHEN
            expect(() => render(parallel)).toThrow();
        }),
        describe('findReachableStates', () => {
            test('Can retrieve possible states from initial state', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const state1 = new stepfunctions.Pass(stack, 'State1');
                const state2 = new stepfunctions.Pass(stack, 'State2');
                const state3 = new stepfunctions.Pass(stack, 'State3');
                const definition = state1
                    .next(state2)
                    .next(state3);
                // WHEN
                const states = stepfunctions.State.findReachableStates(definition.startState);
                // THEN
                expect(state1.id).toStrictEqual(states[0].id);
                expect(state2.id).toStrictEqual(states[1].id);
                expect(state3.id).toStrictEqual(states[2].id);
            });
            test('Does not retrieve unreachable states', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const state1 = new stepfunctions.Pass(stack, 'State1');
                const state2 = new stepfunctions.Pass(stack, 'State2');
                const state3 = new stepfunctions.Pass(stack, 'State3');
                state1.next(state2).next(state3);
                // WHEN
                const states = stepfunctions.State.findReachableStates(state2);
                // THEN
                expect(state2.id).toStrictEqual(states[0].id);
                expect(state3.id).toStrictEqual(states[1].id);
                expect(states.length).toStrictEqual(2);
            });
            test('Works with Choice and Parallel states', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const state1 = new stepfunctions.Choice(stack, 'MainChoice');
                const stateCA = new stepfunctions.Pass(stack, 'StateA');
                const stateCB = new stepfunctions.Pass(stack, 'StateB');
                const statePA = new stepfunctions.Pass(stack, 'ParallelA');
                const statePB = new stepfunctions.Pass(stack, 'ParallelB');
                const state2 = new stepfunctions.Parallel(stack, 'RunParallel');
                const state3 = new stepfunctions.Pass(stack, 'FinalState');
                state2.branch(statePA);
                state2.branch(statePB);
                state1.when(stepfunctions.Condition.stringEquals('$.myInput', 'A'), stateCA);
                state1.when(stepfunctions.Condition.stringEquals('$.myInput', 'B'), stateCB);
                stateCA.next(state2);
                state2.next(state3);
                const definition = state1.otherwise(stateCA);
                // WHEN
                const statesFromStateCB = stepfunctions.State.findReachableStates(stateCB);
                const statesFromState1 = stepfunctions.State.findReachableStates(definition);
                // THEN
                const expectedFromState1 = [state1, stateCA, stateCB, state2, state3];
                for (let i = 0; i < expectedFromState1.length; i++) {
                    expect(statesFromState1[i].id).toStrictEqual(expectedFromState1[i].id);
                }
                expect(statesFromStateCB[0].id).toStrictEqual(stateCB.id);
            });
        });
});
class ReusableStateMachine extends stepfunctions.StateMachineFragment {
    constructor(scope, id) {
        super(scope, id);
        const choice = new stepfunctions.Choice(this, 'Choice')
            .when(stepfunctions.Condition.stringEquals('$.branch', 'left'), new stepfunctions.Pass(this, 'Left Branch'))
            .when(stepfunctions.Condition.stringEquals('$.branch', 'right'), new stepfunctions.Pass(this, 'Right Branch'));
        this.startState = choice;
        this.endStates = choice.afterwards().endStates;
    }
}
class SimpleChain extends stepfunctions.StateMachineFragment {
    constructor(scope, id) {
        super(scope, id);
        const task1 = new FakeTask(this, 'Task1');
        this.task2 = new FakeTask(this, 'Task2');
        task1.next(this.task2);
        this.startState = task1;
        this.endStates = [this.task2];
    }
    catch(state, props) {
        this.task2.addCatch(state, props);
        return this;
    }
}
function render(sm) {
    return new cdk.Stack().resolve(new stepfunctions.StateGraph(sm.startState, 'Test Graph').toGraphJson());
}
class FakeTask extends stepfunctions.TaskStateBase {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.taskPolicies = props.policies;
    }
    _renderTask() {
        return {
            Resource: 'resource',
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVzLWxhbmd1YWdlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0ZXMtbGFuZ3VhZ2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxQztBQUNyQywyQ0FBdUM7QUFDdkMsd0NBQXdDO0FBRXhDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFMUQsT0FBTztRQUNQLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDbEMsT0FBTyxFQUFFLFlBQVk7WUFDckIsTUFBTSxFQUFFO2dCQUNOLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTthQUMxQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDdEQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFekQsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUs7aUJBQzlCLEtBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ1os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R0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMvQjtJQUVNLEtBQUssQ0FBQyxLQUErQixFQUFFLEtBQWdDO1FBQzVFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQztLQUNiO0NBQ0Y7QUFFRCxTQUFTLE1BQU0sQ0FBQyxFQUE0QjtJQUMxQyxPQUFPLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzFHLENBQUM7QUFNRCxNQUFNLFFBQVMsU0FBUSxhQUFhLENBQUMsYUFBYTtJQUloRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0tBQ3BDO0lBRVMsV0FBVztRQUNuQixPQUFPO1lBQ0wsUUFBUSxFQUFFLFVBQVU7U0FDckIsQ0FBQztLQUNIO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHN0ZXBmdW5jdGlvbnMgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ1N0YXRlcyBMYW5ndWFnZScsICgpID0+IHtcbiAgdGVzdCgnQSBzaW5nbGUgdGFzayBpcyBhIFN0YXRlIE1hY2hpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjaGFpbiA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTb21lIFN0YXRlJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihjaGFpbikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1NvbWUgU3RhdGUnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdTb21lIFN0YXRlJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnQSBzZXF1ZW5jZSBvZiB0d28gdGFza3MgaXMgYSBTdGF0ZSBNYWNoaW5lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFzazEgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUgT25lJyk7XG4gICAgY29uc3QgdGFzazIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUgVHdvJyk7XG5cbiAgICBjb25zdCBjaGFpbiA9IHN0ZXBmdW5jdGlvbnMuQ2hhaW5cbiAgICAgIC5zdGFydCh0YXNrMSlcbiAgICAgIC5uZXh0KHRhc2syKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNoYWluKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnU3RhdGUgT25lJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnU3RhdGUgT25lJzogeyBUeXBlOiAnUGFzcycsIE5leHQ6ICdTdGF0ZSBUd28nIH0sXG4gICAgICAgICdTdGF0ZSBUd28nOiB7IFR5cGU6ICdQYXNzJywgRW5kOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdZb3UgZG9udCBuZWVkIHRvIGhvbGQgb24gdG8gdGhlIHN0YXRlIHRvIHJlbmRlciB0aGUgZW50aXJlIHN0YXRlIG1hY2hpbmUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRhc2sxID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlIE9uZScpO1xuICAgIGNvbnN0IHRhc2syID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlIFR3bycpO1xuXG4gICAgdGFzazEubmV4dCh0YXNrMik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcih0YXNrMSkpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1N0YXRlIE9uZScsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ1N0YXRlIE9uZSc6IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnU3RhdGUgVHdvJyB9LFxuICAgICAgICAnU3RhdGUgVHdvJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnQSBjaGFpbiBjYW4gYmUgYXBwZW5kZWQgdG8nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHRhc2sxID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlIE9uZScpO1xuICAgIGNvbnN0IHRhc2syID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlIFR3bycpO1xuICAgIGNvbnN0IHRhc2szID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlIFRocmVlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hhaW4gPSBzdGVwZnVuY3Rpb25zLkNoYWluXG4gICAgICAuc3RhcnQodGFzazEpXG4gICAgICAubmV4dCh0YXNrMilcbiAgICAgIC5uZXh0KHRhc2szKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNoYWluKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnU3RhdGUgT25lJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnU3RhdGUgT25lJzogeyBUeXBlOiAnUGFzcycsIE5leHQ6ICdTdGF0ZSBUd28nIH0sXG4gICAgICAgICdTdGF0ZSBUd28nOiB7IFR5cGU6ICdQYXNzJywgTmV4dDogJ1N0YXRlIFRocmVlJyB9LFxuICAgICAgICAnU3RhdGUgVGhyZWUnOiB7IFR5cGU6ICdQYXNzJywgRW5kOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdBIHN0YXRlIG1hY2hpbmUgY2FuIGJlIGFwcGVuZGVkIHRvIGFub3RoZXIgc3RhdGUgbWFjaGluZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgdGFzazEgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUgT25lJyk7XG4gICAgY29uc3QgdGFzazIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUgVHdvJyk7XG4gICAgY29uc3QgdGFzazMgPSBuZXcgc3RlcGZ1bmN0aW9ucy5XYWl0KHN0YWNrLCAnU3RhdGUgVGhyZWUnLCB7XG4gICAgICB0aW1lOiBzdGVwZnVuY3Rpb25zLldhaXRUaW1lLmR1cmF0aW9uKGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hhaW4gPSBzdGVwZnVuY3Rpb25zLkNoYWluXG4gICAgICAuc3RhcnQodGFzazEpXG4gICAgICAubmV4dChzdGVwZnVuY3Rpb25zLkNoYWluLnN0YXJ0KHRhc2syKS5uZXh0KHRhc2szKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihjaGFpbikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1N0YXRlIE9uZScsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ1N0YXRlIE9uZSc6IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnU3RhdGUgVHdvJyB9LFxuICAgICAgICAnU3RhdGUgVHdvJzogeyBUeXBlOiAnUGFzcycsIE5leHQ6ICdTdGF0ZSBUaHJlZScgfSxcbiAgICAgICAgJ1N0YXRlIFRocmVlJzogeyBUeXBlOiAnV2FpdCcsIEVuZDogdHJ1ZSwgU2Vjb25kczogMTAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSksXG5cbiAgdGVzdCgnQSBzdGF0ZSBtYWNoaW5lIGRlZmluaXRpb24gY2FuIGJlIGluc3RhbnRpYXRlZCBhbmQgY2hhaW5lZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBiZWZvcmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnQmVmb3JlJyk7XG4gICAgY29uc3QgYWZ0ZXIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnQWZ0ZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjaGFpbiA9IGJlZm9yZS5uZXh0KG5ldyBSZXVzYWJsZVN0YXRlTWFjaGluZShzdGFjaywgJ1JldXNhYmxlJykpLm5leHQoYWZ0ZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXIoY2hhaW4pKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdCZWZvcmUnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdCZWZvcmUnOiB7IFR5cGU6ICdQYXNzJywgTmV4dDogJ0Nob2ljZScgfSxcbiAgICAgICAgJ0Nob2ljZSc6IHtcbiAgICAgICAgICBUeXBlOiAnQ2hvaWNlJyxcbiAgICAgICAgICBDaG9pY2VzOiBbXG4gICAgICAgICAgICB7IFZhcmlhYmxlOiAnJC5icmFuY2gnLCBTdHJpbmdFcXVhbHM6ICdsZWZ0JywgTmV4dDogJ0xlZnQgQnJhbmNoJyB9LFxuICAgICAgICAgICAgeyBWYXJpYWJsZTogJyQuYnJhbmNoJywgU3RyaW5nRXF1YWxzOiAncmlnaHQnLCBOZXh0OiAnUmlnaHQgQnJhbmNoJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdMZWZ0IEJyYW5jaCc6IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnQWZ0ZXInIH0sXG4gICAgICAgICdSaWdodCBCcmFuY2gnOiB7IFR5cGU6ICdQYXNzJywgTmV4dDogJ0FmdGVyJyB9LFxuICAgICAgICAnQWZ0ZXInOiB7IFR5cGU6ICdQYXNzJywgRW5kOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdBIHN1Y2Nlc3Mgc3RhdGUgY2Fubm90IGJlIGNoYWluZWQgb250bycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3Qgc3VjY2VlZCA9IG5ldyBzdGVwZnVuY3Rpb25zLlN1Y2NlZWQoc3RhY2ssICdTdWNjZWVkJyk7XG4gICAgY29uc3QgcGFzcyA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdQYXNzJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHBhc3MubmV4dChzdWNjZWVkKS5uZXh0KHBhc3MpKS50b1Rocm93KCk7XG4gIH0pLFxuXG4gIHRlc3QoJ0EgZmFpbHVyZSBzdGF0ZSBjYW5ub3QgYmUgY2hhaW5lZCBvbnRvJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZmFpbCA9IG5ldyBzdGVwZnVuY3Rpb25zLkZhaWwoc3RhY2ssICdGYWlsJywgeyBlcnJvcjogJ1gnLCBjYXVzZTogJ1knIH0pO1xuICAgIGNvbnN0IHBhc3MgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnUGFzcycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiBwYXNzLm5leHQoZmFpbCkubmV4dChwYXNzKSkudG9UaHJvdygpO1xuICB9KSxcblxuICB0ZXN0KCdQYXJhbGxlbHMgY2FuIGNvbnRhaW4gZGlyZWN0IHN0YXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3Qgb25lID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ09uZScpO1xuICAgIGNvbnN0IHR3byA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdUd28nKTtcbiAgICBjb25zdCB0aHJlZSA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdUaHJlZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBhcmEgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXJhbGxlbChzdGFjaywgJ1BhcmFsbGVsJyk7XG4gICAgcGFyYS5icmFuY2gob25lLm5leHQodHdvKSk7XG4gICAgcGFyYS5icmFuY2godGhyZWUpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXIocGFyYSkpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1BhcmFsbGVsJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICBQYXJhbGxlbDoge1xuICAgICAgICAgIFR5cGU6ICdQYXJhbGxlbCcsXG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIEJyYW5jaGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFN0YXJ0QXQ6ICdPbmUnLFxuICAgICAgICAgICAgICBTdGF0ZXM6IHtcbiAgICAgICAgICAgICAgICBPbmU6IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnVHdvJyB9LFxuICAgICAgICAgICAgICAgIFR3bzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgU3RhcnRBdDogJ1RocmVlJyxcbiAgICAgICAgICAgICAgU3RhdGVzOiB7XG4gICAgICAgICAgICAgICAgVGhyZWU6IHsgVHlwZTogJ1Bhc3MnLCBFbmQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ1BhcmFsbGVscyBjYW4gY29udGFpbiBpbnN0YW50aWF0ZWQgcmV1c2FibGUgZGVmaW5pdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwYXJhID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFyYWxsZWwoc3RhY2ssICdQYXJhbGxlbCcpO1xuICAgIHBhcmEuYnJhbmNoKG5ldyBSZXVzYWJsZVN0YXRlTWFjaGluZShzdGFjaywgJ1JldXNhYmxlMScpLnByZWZpeFN0YXRlcygnUmV1c2FibGUxLycpKTtcbiAgICBwYXJhLmJyYW5jaChuZXcgUmV1c2FibGVTdGF0ZU1hY2hpbmUoc3RhY2ssICdSZXVzYWJsZTInKS5wcmVmaXhTdGF0ZXMoJ1JldXNhYmxlMi8nKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihwYXJhKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnUGFyYWxsZWwnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgIFBhcmFsbGVsOiB7XG4gICAgICAgICAgVHlwZTogJ1BhcmFsbGVsJyxcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgQnJhbmNoZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgU3RhcnRBdDogJ1JldXNhYmxlMS9DaG9pY2UnLFxuICAgICAgICAgICAgICBTdGF0ZXM6IHtcbiAgICAgICAgICAgICAgICAnUmV1c2FibGUxL0Nob2ljZSc6IHtcbiAgICAgICAgICAgICAgICAgIFR5cGU6ICdDaG9pY2UnLFxuICAgICAgICAgICAgICAgICAgQ2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7IFZhcmlhYmxlOiAnJC5icmFuY2gnLCBTdHJpbmdFcXVhbHM6ICdsZWZ0JywgTmV4dDogJ1JldXNhYmxlMS9MZWZ0IEJyYW5jaCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBWYXJpYWJsZTogJyQuYnJhbmNoJywgU3RyaW5nRXF1YWxzOiAncmlnaHQnLCBOZXh0OiAnUmV1c2FibGUxL1JpZ2h0IEJyYW5jaCcgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmV1c2FibGUxL0xlZnQgQnJhbmNoJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICdSZXVzYWJsZTEvUmlnaHQgQnJhbmNoJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgU3RhcnRBdDogJ1JldXNhYmxlMi9DaG9pY2UnLFxuICAgICAgICAgICAgICBTdGF0ZXM6IHtcbiAgICAgICAgICAgICAgICAnUmV1c2FibGUyL0Nob2ljZSc6IHtcbiAgICAgICAgICAgICAgICAgIFR5cGU6ICdDaG9pY2UnLFxuICAgICAgICAgICAgICAgICAgQ2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7IFZhcmlhYmxlOiAnJC5icmFuY2gnLCBTdHJpbmdFcXVhbHM6ICdsZWZ0JywgTmV4dDogJ1JldXNhYmxlMi9MZWZ0IEJyYW5jaCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBWYXJpYWJsZTogJyQuYnJhbmNoJywgU3RyaW5nRXF1YWxzOiAncmlnaHQnLCBOZXh0OiAnUmV1c2FibGUyL1JpZ2h0IEJyYW5jaCcgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmV1c2FibGUyL0xlZnQgQnJhbmNoJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICdSZXVzYWJsZTIvUmlnaHQgQnJhbmNoJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnU3RhdGUgTWFjaGluZSBGcmFnbWVudHMgY2FuIGJlIHdyYXBwZWQgaW4gYSBzaW5nbGUgc3RhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHJldXNhYmxlID0gbmV3IFNpbXBsZUNoYWluKHN0YWNrLCAnSGVsbG8nKTtcbiAgICBjb25zdCBzdGF0ZSA9IHJldXNhYmxlLnRvU2luZ2xlU3RhdGUoKTtcblxuICAgIGV4cGVjdChyZW5kZXIoc3RhdGUpKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdIZWxsbycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgSGVsbG86IHtcbiAgICAgICAgICBUeXBlOiAnUGFyYWxsZWwnLFxuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBCcmFuY2hlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBTdGFydEF0OiAnSGVsbG86IFRhc2sxJyxcbiAgICAgICAgICAgICAgU3RhdGVzOiB7XG4gICAgICAgICAgICAgICAgJ0hlbGxvOiBUYXNrMSc6IHsgVHlwZTogJ1Rhc2snLCBOZXh0OiAnSGVsbG86IFRhc2syJywgUmVzb3VyY2U6ICdyZXNvdXJjZScgfSxcbiAgICAgICAgICAgICAgICAnSGVsbG86IFRhc2syJzogeyBUeXBlOiAnVGFzaycsIEVuZDogdHJ1ZSwgUmVzb3VyY2U6ICdyZXNvdXJjZScgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ0NoYWluaW5nIG9udG8gYnJhbmNoZWQgZmFpbHVyZSBzdGF0ZSBpZ25vcmVzIGZhaWx1cmUgc3RhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHllcyA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdZZXMnKTtcbiAgICBjb25zdCBubyA9IG5ldyBzdGVwZnVuY3Rpb25zLkZhaWwoc3RhY2ssICdObycsIHsgZXJyb3I6ICdGYWlsdXJlJywgY2F1c2U6ICdXcm9uZyBicmFuY2gnIH0pO1xuICAgIGNvbnN0IGVuZmluID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ0ZpbmFsbHknKTtcbiAgICBjb25zdCBjaG9pY2UgPSBuZXcgc3RlcGZ1bmN0aW9ucy5DaG9pY2Uoc3RhY2ssICdDaG9pY2UnKVxuICAgICAgLndoZW4oc3RlcGZ1bmN0aW9ucy5Db25kaXRpb24uc3RyaW5nRXF1YWxzKCckLmZvbycsICdiYXInKSwgeWVzKVxuICAgICAgLm90aGVyd2lzZShubyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2hvaWNlLmFmdGVyd2FyZHMoKS5uZXh0KGVuZmluKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNob2ljZSkpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ0Nob2ljZScsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgQ2hvaWNlOiB7XG4gICAgICAgICAgVHlwZTogJ0Nob2ljZScsXG4gICAgICAgICAgQ2hvaWNlczogW1xuICAgICAgICAgICAgeyBWYXJpYWJsZTogJyQuZm9vJywgU3RyaW5nRXF1YWxzOiAnYmFyJywgTmV4dDogJ1llcycgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIERlZmF1bHQ6ICdObycsXG4gICAgICAgIH0sXG4gICAgICAgIFllczogeyBUeXBlOiAnUGFzcycsIE5leHQ6ICdGaW5hbGx5JyB9LFxuICAgICAgICBObzogeyBUeXBlOiAnRmFpbCcsIEVycm9yOiAnRmFpbHVyZScsIENhdXNlOiAnV3JvbmcgYnJhbmNoJyB9LFxuICAgICAgICBGaW5hbGx5OiB7IFR5cGU6ICdQYXNzJywgRW5kOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdDYW4gaW5jbHVkZSBPVEhFUldJU0UgdHJhbnNpdGlvbiBmb3IgQ2hvaWNlIGluIGFmdGVyd2FyZHMoKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoYWluID0gbmV3IHN0ZXBmdW5jdGlvbnMuQ2hvaWNlKHN0YWNrLCAnQ2hvaWNlJylcbiAgICAgIC53aGVuKHN0ZXBmdW5jdGlvbnMuQ29uZGl0aW9uLnN0cmluZ0VxdWFscygnJC5mb28nLCAnYmFyJyksXG4gICAgICAgIG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdZZXMnKSlcbiAgICAgIC5hZnRlcndhcmRzKHsgaW5jbHVkZU90aGVyd2lzZTogdHJ1ZSB9KVxuICAgICAgLm5leHQobmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ0ZpbmFsbHknKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihjaGFpbikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ0Nob2ljZScsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgQ2hvaWNlOiB7XG4gICAgICAgICAgVHlwZTogJ0Nob2ljZScsXG4gICAgICAgICAgQ2hvaWNlczogW1xuICAgICAgICAgICAgeyBWYXJpYWJsZTogJyQuZm9vJywgU3RyaW5nRXF1YWxzOiAnYmFyJywgTmV4dDogJ1llcycgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIERlZmF1bHQ6ICdGaW5hbGx5JyxcbiAgICAgICAgfSxcbiAgICAgICAgWWVzOiB7IFR5cGU6ICdQYXNzJywgTmV4dDogJ0ZpbmFsbHknIH0sXG4gICAgICAgIEZpbmFsbHk6IHsgVHlwZTogJ1Bhc3MnLCBFbmQ6IHRydWUgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSksXG5cbiAgdGVzdCgnU3RhdGUgbWFjaGluZXMgY2FuIGhhdmUgdW5jb25zdHJhaW50ZWQgZ290b3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG9uZSA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdPbmUnKTtcbiAgICBjb25zdCB0d28gPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnVHdvJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hhaW4gPSBvbmUubmV4dCh0d28pLm5leHQob25lKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNoYWluKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnT25lJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICBPbmU6IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnVHdvJyB9LFxuICAgICAgICBUd286IHsgVHlwZTogJ1Bhc3MnLCBOZXh0OiAnT25lJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnU3RhdGVzIGNhbiBoYXZlIGVycm9yIGJyYW5jaGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzazEgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrMScpO1xuICAgIGNvbnN0IGZhaWx1cmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5GYWlsKHN0YWNrLCAnRmFpbGVkJywgeyBlcnJvcjogJ0RpZE5vdFdvcmsnLCBjYXVzZTogJ1dlIGdvdCBzdHVjaycgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hhaW4gPSB0YXNrMS5hZGRDYXRjaChmYWlsdXJlKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNoYWluKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnVGFzazEnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgIFRhc2sxOiB7XG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBDYXRjaDogW1xuICAgICAgICAgICAgeyBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sIE5leHQ6ICdGYWlsZWQnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgRmFpbGVkOiB7XG4gICAgICAgICAgVHlwZTogJ0ZhaWwnLFxuICAgICAgICAgIEVycm9yOiAnRGlkTm90V29yaycsXG4gICAgICAgICAgQ2F1c2U6ICdXZSBnb3Qgc3R1Y2snLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnUmV0cmllcyBhbmQgZXJyb3JzIHdpdGggYSByZXN1bHQgcGF0aCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sxID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnVGFzazEnKTtcbiAgICBjb25zdCBmYWlsdXJlID0gbmV3IHN0ZXBmdW5jdGlvbnMuRmFpbChzdGFjaywgJ0ZhaWxlZCcsIHsgZXJyb3I6ICdEaWROb3RXb3JrJywgY2F1c2U6ICdXZSBnb3Qgc3R1Y2snIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoYWluID0gdGFzazEuYWRkUmV0cnkoeyBlcnJvcnM6IFsnSFRUUEVycm9yJ10sIG1heEF0dGVtcHRzOiAyIH0pLmFkZENhdGNoKGZhaWx1cmUsIHsgcmVzdWx0UGF0aDogJyQuc29tZV9lcnJvcicgfSkubmV4dChmYWlsdXJlKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyKGNoYWluKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBTdGFydEF0OiAnVGFzazEnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgIFRhc2sxOiB7XG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgICAgIENhdGNoOiBbeyBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sIE5leHQ6ICdGYWlsZWQnLCBSZXN1bHRQYXRoOiAnJC5zb21lX2Vycm9yJyB9XSxcbiAgICAgICAgICBSZXRyeTogW3sgRXJyb3JFcXVhbHM6IFsnSFRUUEVycm9yJ10sIE1heEF0dGVtcHRzOiAyIH1dLFxuICAgICAgICAgIE5leHQ6ICdGYWlsZWQnLFxuICAgICAgICB9LFxuICAgICAgICBGYWlsZWQ6IHtcbiAgICAgICAgICBUeXBlOiAnRmFpbCcsXG4gICAgICAgICAgRXJyb3I6ICdEaWROb3RXb3JrJyxcbiAgICAgICAgICBDYXVzZTogJ1dlIGdvdCBzdHVjaycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdDYW4gd3JhcCBjaGFpbiBhbmQgYXR0YWNoIGVycm9yIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHRhc2sxID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnVGFzazEnKTtcbiAgICBjb25zdCB0YXNrMiA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2syJyk7XG4gICAgY29uc3QgZXJyb3JIYW5kbGVyID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ0Vycm9ySGFuZGxlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoYWluID0gdGFzazEubmV4dCh0YXNrMikudG9TaW5nbGVTdGF0ZSgnV3JhcHBlZCcpLmFkZENhdGNoKGVycm9ySGFuZGxlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihjaGFpbikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1dyYXBwZWQnLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgIFdyYXBwZWQ6IHtcbiAgICAgICAgICBUeXBlOiAnUGFyYWxsZWwnLFxuICAgICAgICAgIEJyYW5jaGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFN0YXJ0QXQ6ICdUYXNrMScsXG4gICAgICAgICAgICAgIFN0YXRlczoge1xuICAgICAgICAgICAgICAgIFRhc2sxOiB7XG4gICAgICAgICAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgICAgICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgIE5leHQ6ICdUYXNrMicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBUYXNrMjoge1xuICAgICAgICAgICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6ICdyZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBDYXRjaDogW1xuICAgICAgICAgICAgeyBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sIE5leHQ6ICdFcnJvckhhbmRsZXInIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIEVycm9ySGFuZGxlcjogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnQ2hhaW5pbmcgZG9lcyBub3QgY2hhaW4gb250byBlcnJvciBoYW5kbGVyIHN0YXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0YXNrMSA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2sxJyk7XG4gICAgY29uc3QgdGFzazIgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrMicpO1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdFcnJvckhhbmRsZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjaGFpbiA9IHRhc2sxLmFkZENhdGNoKGVycm9ySGFuZGxlcikubmV4dCh0YXNrMik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihjaGFpbikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1Rhc2sxJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICBUYXNrMToge1xuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICAgICAgICBOZXh0OiAnVGFzazInLFxuICAgICAgICAgIENhdGNoOiBbXG4gICAgICAgICAgICB7IEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSwgTmV4dDogJ0Vycm9ySGFuZGxlcicgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBUYXNrMjogeyBUeXBlOiAnVGFzaycsIFJlc291cmNlOiAncmVzb3VyY2UnLCBFbmQ6IHRydWUgfSxcbiAgICAgICAgRXJyb3JIYW5kbGVyOiB7IFR5cGU6ICdQYXNzJywgRW5kOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdDaGFpbmluZyBkb2VzIG5vdCBjaGFpbiBvbnRvIGVycm9yIGhhbmRsZXIsIGV4dGVuZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0YXNrMSA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2sxJyk7XG4gICAgY29uc3QgdGFzazIgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrMicpO1xuICAgIGNvbnN0IHRhc2szID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnVGFzazMnKTtcbiAgICBjb25zdCBlcnJvckhhbmRsZXIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnRXJyb3JIYW5kbGVyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hhaW4gPSB0YXNrMS5hZGRDYXRjaChlcnJvckhhbmRsZXIpXG4gICAgICAubmV4dCh0YXNrMi5hZGRDYXRjaChlcnJvckhhbmRsZXIpKVxuICAgICAgLm5leHQodGFzazMuYWRkQ2F0Y2goZXJyb3JIYW5kbGVyKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgc2hhcmVkVGFza1Byb3BzID0geyBUeXBlOiAnVGFzaycsIFJlc291cmNlOiAncmVzb3VyY2UnLCBDYXRjaDogW3sgRXJyb3JFcXVhbHM6IFsnU3RhdGVzLkFMTCddLCBOZXh0OiAnRXJyb3JIYW5kbGVyJyB9XSB9O1xuICAgIGV4cGVjdChyZW5kZXIoY2hhaW4pKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdUYXNrMScsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgVGFzazE6IHsgTmV4dDogJ1Rhc2syJywgLi4uc2hhcmVkVGFza1Byb3BzIH0sXG4gICAgICAgIFRhc2syOiB7IE5leHQ6ICdUYXNrMycsIC4uLnNoYXJlZFRhc2tQcm9wcyB9LFxuICAgICAgICBUYXNrMzogeyBFbmQ6IHRydWUsIC4uLnNoYXJlZFRhc2tQcm9wcyB9LFxuICAgICAgICBFcnJvckhhbmRsZXI6IHsgVHlwZTogJ1Bhc3MnLCBFbmQ6IHRydWUgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ0Vycm9yIGhhbmRsZXIgd2l0aCBhIGZyYWdtZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0YXNrMSA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2sxJyk7XG4gICAgY29uc3QgdGFzazIgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrMicpO1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdFcnJvckhhbmRsZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrMS5hZGRDYXRjaChlcnJvckhhbmRsZXIpXG4gICAgICAubmV4dChuZXcgU2ltcGxlQ2hhaW4oc3RhY2ssICdDaGFpbicpLmNhdGNoKGVycm9ySGFuZGxlcikpXG4gICAgICAubmV4dCh0YXNrMi5hZGRDYXRjaChlcnJvckhhbmRsZXIpKTtcbiAgfSksXG5cbiAgdGVzdCgnQ2FuIG1lcmdlIHN0YXRlIG1hY2hpbmVzIHdpdGggc2hhcmVkIHN0YXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgdGFzazEgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrMScpO1xuICAgIGNvbnN0IHRhc2syID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnVGFzazInKTtcbiAgICBjb25zdCBmYWlsdXJlID0gbmV3IHN0ZXBmdW5jdGlvbnMuRmFpbChzdGFjaywgJ0ZhaWxlZCcsIHsgZXJyb3I6ICdEaWROb3RXb3JrJywgY2F1c2U6ICdXZSBnb3Qgc3R1Y2snIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2sxLmFkZENhdGNoKGZhaWx1cmUpO1xuICAgIHRhc2syLmFkZENhdGNoKGZhaWx1cmUpO1xuXG4gICAgdGFzazEubmV4dCh0YXNrMik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcih0YXNrMSkpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ1Rhc2sxJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICBUYXNrMToge1xuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICAgICAgICBOZXh0OiAnVGFzazInLFxuICAgICAgICAgIENhdGNoOiBbXG4gICAgICAgICAgICB7IEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSwgTmV4dDogJ0ZhaWxlZCcgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBUYXNrMjoge1xuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgQ2F0Y2g6IFtcbiAgICAgICAgICAgIHsgRXJyb3JFcXVhbHM6IFsnU3RhdGVzLkFMTCddLCBOZXh0OiAnRmFpbGVkJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZhaWxlZDoge1xuICAgICAgICAgIFR5cGU6ICdGYWlsJyxcbiAgICAgICAgICBFcnJvcjogJ0RpZE5vdFdvcmsnLFxuICAgICAgICAgIENhdXNlOiAnV2UgZ290IHN0dWNrJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ05vIGR1cGxpY2F0ZSBzdGF0ZSBJRHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBpbnRlcm1lZGlhdGVQYXJlbnQgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnUGFyZW50Jyk7XG5cbiAgICBjb25zdCBzdGF0ZTEgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUnKTtcbiAgICBjb25zdCBzdGF0ZTIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKGludGVybWVkaWF0ZVBhcmVudCwgJ1N0YXRlJyk7XG5cbiAgICBzdGF0ZTEubmV4dChzdGF0ZTIpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoc3RhdGUxKSkudG9UaHJvdygpO1xuICB9KSxcblxuICB0ZXN0KCdObyBkdXBsaWNhdGUgc3RhdGUgSURzIGV2ZW4gYWNyb3NzIFBhcmFsbGVsIGJyYW5jaGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgaW50ZXJtZWRpYXRlUGFyZW50ID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ1BhcmVudCcpO1xuXG4gICAgY29uc3Qgc3RhdGUxID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlJyk7XG4gICAgY29uc3Qgc3RhdGUyID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhpbnRlcm1lZGlhdGVQYXJlbnQsICdTdGF0ZScpO1xuXG4gICAgY29uc3QgcGFyYWxsZWwgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXJhbGxlbChzdGFjaywgJ1BhcmFsbGVsJylcbiAgICAgIC5icmFuY2goc3RhdGUxKVxuICAgICAgLmJyYW5jaChzdGF0ZTIpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiByZW5kZXIocGFyYWxsZWwpKS50b1Rocm93KCk7XG4gIH0pLFxuXG4gIHRlc3QoJ05vIGNyb3NzLXBhcmFsbGVsIGp1bXBzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc3RhdGUxID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1N0YXRlMScpO1xuICAgIGNvbnN0IHN0YXRlMiA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTdGF0ZTInKTtcblxuICAgIGNvbnN0IHBhcmFsbGVsID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFyYWxsZWwoc3RhY2ssICdQYXJhbGxlbCcpXG4gICAgICAuYnJhbmNoKHN0YXRlMS5uZXh0KHN0YXRlMikpXG4gICAgICAuYnJhbmNoKHN0YXRlMik7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHJlbmRlcihwYXJhbGxlbCkpLnRvVGhyb3coKTtcbiAgfSksXG5cbiAgZGVzY3JpYmUoJ2ZpbmRSZWFjaGFibGVTdGF0ZXMnLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCdDYW4gcmV0cmlldmUgcG9zc2libGUgc3RhdGVzIGZyb20gaW5pdGlhbCBzdGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHN0YXRlMSA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTdGF0ZTEnKTtcbiAgICAgIGNvbnN0IHN0YXRlMiA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTdGF0ZTInKTtcbiAgICAgIGNvbnN0IHN0YXRlMyA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTdGF0ZTMnKTtcblxuICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IHN0YXRlMVxuICAgICAgICAubmV4dChzdGF0ZTIpXG4gICAgICAgIC5uZXh0KHN0YXRlMyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN0YXRlcyA9IHN0ZXBmdW5jdGlvbnMuU3RhdGUuZmluZFJlYWNoYWJsZVN0YXRlcyhkZWZpbml0aW9uLnN0YXJ0U3RhdGUpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhdGUxLmlkKS50b1N0cmljdEVxdWFsKHN0YXRlc1swXS5pZCk7XG4gICAgICBleHBlY3Qoc3RhdGUyLmlkKS50b1N0cmljdEVxdWFsKHN0YXRlc1sxXS5pZCk7XG4gICAgICBleHBlY3Qoc3RhdGUzLmlkKS50b1N0cmljdEVxdWFsKHN0YXRlc1syXS5pZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdEb2VzIG5vdCByZXRyaWV2ZSB1bnJlYWNoYWJsZSBzdGF0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBzdGF0ZTEgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUxJyk7XG4gICAgICBjb25zdCBzdGF0ZTIgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUyJyk7XG4gICAgICBjb25zdCBzdGF0ZTMgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGUzJyk7XG5cbiAgICAgIHN0YXRlMS5uZXh0KHN0YXRlMikubmV4dChzdGF0ZTMpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdGF0ZXMgPSBzdGVwZnVuY3Rpb25zLlN0YXRlLmZpbmRSZWFjaGFibGVTdGF0ZXMoc3RhdGUyKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN0YXRlMi5pZCkudG9TdHJpY3RFcXVhbChzdGF0ZXNbMF0uaWQpO1xuICAgICAgZXhwZWN0KHN0YXRlMy5pZCkudG9TdHJpY3RFcXVhbChzdGF0ZXNbMV0uaWQpO1xuICAgICAgZXhwZWN0KHN0YXRlcy5sZW5ndGgpLnRvU3RyaWN0RXF1YWwoMik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdXb3JrcyB3aXRoIENob2ljZSBhbmQgUGFyYWxsZWwgc3RhdGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgc3RhdGUxID0gbmV3IHN0ZXBmdW5jdGlvbnMuQ2hvaWNlKHN0YWNrLCAnTWFpbkNob2ljZScpO1xuICAgICAgY29uc3Qgc3RhdGVDQSA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdTdGF0ZUEnKTtcbiAgICAgIGNvbnN0IHN0YXRlQ0IgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnU3RhdGVCJyk7XG4gICAgICBjb25zdCBzdGF0ZVBBID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyhzdGFjaywgJ1BhcmFsbGVsQScpO1xuICAgICAgY29uc3Qgc3RhdGVQQiA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdQYXJhbGxlbEInKTtcbiAgICAgIGNvbnN0IHN0YXRlMiA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhcmFsbGVsKHN0YWNrLCAnUnVuUGFyYWxsZWwnKTtcbiAgICAgIGNvbnN0IHN0YXRlMyA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdGaW5hbFN0YXRlJyk7XG4gICAgICBzdGF0ZTIuYnJhbmNoKHN0YXRlUEEpO1xuICAgICAgc3RhdGUyLmJyYW5jaChzdGF0ZVBCKTtcbiAgICAgIHN0YXRlMS53aGVuKHN0ZXBmdW5jdGlvbnMuQ29uZGl0aW9uLnN0cmluZ0VxdWFscygnJC5teUlucHV0JywgJ0EnICksIHN0YXRlQ0EpO1xuICAgICAgc3RhdGUxLndoZW4oc3RlcGZ1bmN0aW9ucy5Db25kaXRpb24uc3RyaW5nRXF1YWxzKCckLm15SW5wdXQnLCAnQicpLCBzdGF0ZUNCKTtcbiAgICAgIHN0YXRlQ0EubmV4dChzdGF0ZTIpO1xuICAgICAgc3RhdGUyLm5leHQoc3RhdGUzKTtcblxuICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IHN0YXRlMS5vdGhlcndpc2Uoc3RhdGVDQSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN0YXRlc0Zyb21TdGF0ZUNCID0gc3RlcGZ1bmN0aW9ucy5TdGF0ZS5maW5kUmVhY2hhYmxlU3RhdGVzKHN0YXRlQ0IpO1xuICAgICAgY29uc3Qgc3RhdGVzRnJvbVN0YXRlMSA9IHN0ZXBmdW5jdGlvbnMuU3RhdGUuZmluZFJlYWNoYWJsZVN0YXRlcyhkZWZpbml0aW9uKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgZXhwZWN0ZWRGcm9tU3RhdGUxID0gW3N0YXRlMSwgc3RhdGVDQSwgc3RhdGVDQiwgc3RhdGUyLCBzdGF0ZTNdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHBlY3RlZEZyb21TdGF0ZTEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXhwZWN0KHN0YXRlc0Zyb21TdGF0ZTFbaV0uaWQpLnRvU3RyaWN0RXF1YWwoZXhwZWN0ZWRGcm9tU3RhdGUxW2ldLmlkKTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdChzdGF0ZXNGcm9tU3RhdGVDQlswXS5pZCkudG9TdHJpY3RFcXVhbChzdGF0ZUNCLmlkKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgUmV1c2FibGVTdGF0ZU1hY2hpbmUgZXh0ZW5kcyBzdGVwZnVuY3Rpb25zLlN0YXRlTWFjaGluZUZyYWdtZW50IHtcbiAgcHVibGljIHJlYWRvbmx5IHN0YXJ0U3RhdGU6IHN0ZXBmdW5jdGlvbnMuU3RhdGU7XG4gIHB1YmxpYyByZWFkb25seSBlbmRTdGF0ZXM6IHN0ZXBmdW5jdGlvbnMuSU5leHRhYmxlW107XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgY2hvaWNlID0gbmV3IHN0ZXBmdW5jdGlvbnMuQ2hvaWNlKHRoaXMsICdDaG9pY2UnKVxuICAgICAgLndoZW4oc3RlcGZ1bmN0aW9ucy5Db25kaXRpb24uc3RyaW5nRXF1YWxzKCckLmJyYW5jaCcsICdsZWZ0JyksIG5ldyBzdGVwZnVuY3Rpb25zLlBhc3ModGhpcywgJ0xlZnQgQnJhbmNoJykpXG4gICAgICAud2hlbihzdGVwZnVuY3Rpb25zLkNvbmRpdGlvbi5zdHJpbmdFcXVhbHMoJyQuYnJhbmNoJywgJ3JpZ2h0JyksIG5ldyBzdGVwZnVuY3Rpb25zLlBhc3ModGhpcywgJ1JpZ2h0IEJyYW5jaCcpKTtcblxuICAgIHRoaXMuc3RhcnRTdGF0ZSA9IGNob2ljZTtcbiAgICB0aGlzLmVuZFN0YXRlcyA9IGNob2ljZS5hZnRlcndhcmRzKCkuZW5kU3RhdGVzO1xuICB9XG59XG5cbmNsYXNzIFNpbXBsZUNoYWluIGV4dGVuZHMgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmVGcmFnbWVudCB7XG4gIHB1YmxpYyByZWFkb25seSBzdGFydFN0YXRlOiBzdGVwZnVuY3Rpb25zLlN0YXRlO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBzdGVwZnVuY3Rpb25zLklOZXh0YWJsZVtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdGFzazI6IHN0ZXBmdW5jdGlvbnMuVGFza1N0YXRlQmFzZTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB0YXNrMSA9IG5ldyBGYWtlVGFzayh0aGlzLCAnVGFzazEnKTtcbiAgICB0aGlzLnRhc2syID0gbmV3IEZha2VUYXNrKHRoaXMsICdUYXNrMicpO1xuXG4gICAgdGFzazEubmV4dCh0aGlzLnRhc2syKTtcblxuICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHRhc2sxO1xuICAgIHRoaXMuZW5kU3RhdGVzID0gW3RoaXMudGFzazJdO1xuICB9XG5cbiAgcHVibGljIGNhdGNoKHN0YXRlOiBzdGVwZnVuY3Rpb25zLklDaGFpbmFibGUsIHByb3BzPzogc3RlcGZ1bmN0aW9ucy5DYXRjaFByb3BzKTogU2ltcGxlQ2hhaW4ge1xuICAgIHRoaXMudGFzazIuYWRkQ2F0Y2goc3RhdGUsIHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoc206IHN0ZXBmdW5jdGlvbnMuSUNoYWluYWJsZSkge1xuICByZXR1cm4gbmV3IGNkay5TdGFjaygpLnJlc29sdmUobmV3IHN0ZXBmdW5jdGlvbnMuU3RhdGVHcmFwaChzbS5zdGFydFN0YXRlLCAnVGVzdCBHcmFwaCcpLnRvR3JhcGhKc29uKCkpO1xufVxuXG5pbnRlcmZhY2UgRmFrZVRhc2tQcm9wcyBleHRlbmRzIHN0ZXBmdW5jdGlvbnMuVGFza1N0YXRlQmFzZVByb3BzIHtcbiAgcmVhZG9ubHkgcG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG59XG5cbmNsYXNzIEZha2VUYXNrIGV4dGVuZHMgc3RlcGZ1bmN0aW9ucy5UYXNrU3RhdGVCYXNlIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhc2tNZXRyaWNzPzogc3RlcGZ1bmN0aW9ucy5UYXNrTWV0cmljc0NvbmZpZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhc2tQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRmFrZVRhc2tQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgdGhpcy50YXNrUG9saWNpZXMgPSBwcm9wcy5wb2xpY2llcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVuZGVyVGFzaygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=