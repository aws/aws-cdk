import * as assertions from '../../assertions';
import * as cdk from '../../core';
import * as stepfunctions from '../lib';

describe('State Graph', () => {
  test('bind adds execution permissions to state machine when distributed map is used within the primary graph', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = createMap(stack);
    const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(map),
    });
    const stateMachineLogicalId = stack.getLogicalId(stateMachine.node.defaultChild as stepfunctions.CfnStateMachine);
    const template = assertions.Template.fromStack(stack);

    // THEN
    template.hasResource('AWS::IAM::Policy', createPolicyProps(stateMachineLogicalId));
  });

  test('bind adds execution permissions to state machine when distributed map is used within a child graph', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = createMap(stack);
    const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(new stepfunctions.Parallel(stack, 'Parallel', {
        resultPath: '$.result',
      }).branch(
        map,
      )),
    });
    const stateMachineLogicalId = stack.getLogicalId(stateMachine.node.defaultChild as stepfunctions.CfnStateMachine);
    const template = assertions.Template.fromStack(stack);

    // THEN
    template.hasResource('AWS::IAM::Policy', createPolicyProps(stateMachineLogicalId));
  });

  test('looping child states do not create recursion', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = createMap(stack);
    const start = new stepfunctions.Parallel(stack, 'Parallel', {
      resultPath: '$.result',
    }).branch(
      map.next(map),
    );
    const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(start.next(start)),
    });
    const stateMachineLogicalId = stack.getLogicalId(stateMachine.node.defaultChild as stepfunctions.CfnStateMachine);
    const template = assertions.Template.fromStack(stack);

    // THEN
    // might as well check policy since this is around distributed map perms; however, the actual thing under test here
    // is that our permissions adding doesn't create infinite recursion as we iterate through all nested graphs.
    // a failure in this test case (for the thing it is meant to test) would present as a stack overflow ("maximum call
    // stack size exceeded" error.)
    template.hasResource('AWS::IAM::Policy', createPolicyProps(stateMachineLogicalId));
  });
});

function createMap(stack: cdk.Stack) {
  return new stepfunctions.DistributedMap(stack, 'Map', {
    maxConcurrency: 1,
    itemsPath: stepfunctions.JsonPath.stringAt('$.inputForMap'),
    itemSelector: {
      foo: 'foo',
      bar: stepfunctions.JsonPath.stringAt('$.bar'),
    },
  }).itemProcessor(new stepfunctions.Pass(this, 'Pass State'));
}

function createPolicyProps(stateMachineLogicalId: string) {
  return {
    Properties: {
      PolicyDocument: {
        // ensure that self-starting permission is added which is necessary for distributed maps
        Statement: [
          {
            Action: 'states:StartExecution',
            Resource: {
              Ref: stateMachineLogicalId,
            },
          },
          {
            Action: ['states:DescribeExecution', 'states:StopExecution'],
            Resource: {
              'Fn::Join': ['', [{ Ref: stateMachineLogicalId }, ':*']],
            },
          },
        ],
      },
    },
  };
}