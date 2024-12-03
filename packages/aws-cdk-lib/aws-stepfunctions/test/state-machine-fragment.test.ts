import { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as stepfunctions from '../lib';

describe('State Machine Fragment', () => {
  test('Prefix applied correctly on Fragments with Parallel states', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const fragment1 = new ParallelMachineFragment(stack, 'Fragment 1').prefixStates();
    const fragment2 = new ParallelMachineFragment(stack, 'Fragment 2').prefixStates();

    new stepfunctions.StateMachine(stack, 'State Machine', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(fragment1.next(fragment2)),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: Match.serializedJson({
        StartAt: 'Fragment 1: Parallel State',
        States: {
          'Fragment 1: Parallel State': Match.objectLike({
            Branches: [Match.objectLike({
              States: {
                'Fragment 1: Step 1': Match.anyValue(),
              },
            })],
          }),
          'Fragment 2: Parallel State': Match.objectLike({
            Branches: [Match.objectLike({
              States: {
                'Fragment 2: Step 1': Match.anyValue(),
              },
            })],
          }),
        },
      }),
    });
  });
});

class ParallelMachineFragment extends stepfunctions.StateMachineFragment {
  public readonly startState: stepfunctions.State;
  public readonly endStates: stepfunctions.INextable[];

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const step1 = new stepfunctions.Pass(this, 'Step 1');
    const parallelState = new stepfunctions.Parallel(this, 'Parallel State');
    const chain = parallelState.branch(step1);
    this.startState = parallelState;
    this.endStates = [chain];
  }
}
