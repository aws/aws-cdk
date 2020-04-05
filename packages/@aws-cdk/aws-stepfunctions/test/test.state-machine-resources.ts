import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
  'Tasks can add permissions to the execution role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      task: {
        bind: () => ({
          resourceArn: 'resource',
          policyStatements: [new iam.PolicyStatement({
            actions: ['resource:Everything'],
            resources: ['resource']
          })],
        })
      }
    });

    // WHEN
    new stepfunctions.StateMachine(stack, 'SM', {
      definition: task
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'resource:Everything',
            Effect: 'Allow',
            Resource: 'resource'
          }
        ],
      }
    }));

    test.done();
  },

  'Tasks hidden inside a Parallel state are also included'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      task: {
        bind: () => ({
          resourceArn: 'resource',
          policyStatements: [
            new iam.PolicyStatement({
              actions: ['resource:Everything'],
              resources: ['resource']
            })
          ]
        })
      }
    });

    const para = new stepfunctions.Parallel(stack, 'Para');
    para.branch(task);

    // WHEN
    new stepfunctions.StateMachine(stack, 'SM', {
      definition: para
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'resource:Everything',
            Effect: 'Allow',
            Resource: 'resource'
          }
        ],
      }
    }));

    test.done();
  },

  'Task should render InputPath / Parameters / OutputPath correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      inputPath: '$',
      outputPath: '$.state',
      task: {
        bind: () => ({
          resourceArn: 'resource',
          parameters: {
            'input.$': '$',
            'stringArgument': 'inital-task',
            'numberArgument': 123,
            'booleanArgument': true,
            'arrayArgument': ['a', 'b', 'c']
          }
        })
      }
    });

    // WHEN
    const taskState = task.toStateJson();

    // THEN
    test.deepEqual(taskState, { End: true,
      Retry: undefined,
      Catch: undefined,
      InputPath: '$',
      Parameters:
             { 'input.$': '$',
               'stringArgument': 'inital-task',
               'numberArgument': 123,
               'booleanArgument': true,
               'arrayArgument': [ 'a', 'b', 'c' ] },
      OutputPath: '$.state',
      Type: 'Task',
      Comment: undefined,
      Resource: 'resource',
      ResultPath: undefined,
      TimeoutSeconds: undefined,
      HeartbeatSeconds: undefined
    });

    test.done();
  },

  'Task combines taskobject parameters with direct parameters'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      inputPath: '$',
      outputPath: '$.state',
      task: {
        bind: () => ({
          resourceArn: 'resource',
          parameters: {
            a: 'aa',
          }
        })
      },
      parameters: {
        b: 'bb'
      }
    });

    // WHEN
    const taskState = task.toStateJson();

    // THEN
    test.deepEqual(taskState, { End: true,
      Retry: undefined,
      Catch: undefined,
      InputPath: '$',
      Parameters:
             { a: 'aa',
               b: 'bb', },
      OutputPath: '$.state',
      Type: 'Task',
      Comment: undefined,
      Resource: 'resource',
      ResultPath: undefined,
      TimeoutSeconds: undefined,
      HeartbeatSeconds: undefined
    });

    test.done();
  },

  'Created state machine can grant start execution to a role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      task: {
        bind: () => ({ resourceArn: 'resource' })
      }
    });
    const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
      definition: task
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    // WHEN
    stateMachine.grantStartExecution(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'StateMachine2E01A3A5'
            }
          }
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'RoleDefaultPolicy5FFB7DAB',
      Roles: [
        {
          Ref: 'Role1ABCC5F0'
        }
      ]
    }));

    test.done();
  },

  'Imported state machine can grant start execution to a role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const stateMachineArn = 'arn:aws:states:::my-state-machine';
    const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    // WHEN
    stateMachine.grantStartExecution(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: stateMachineArn
          }
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'RoleDefaultPolicy5FFB7DAB',
      Roles: [
        {
          Ref: 'Role1ABCC5F0'
        }
      ]
    }));

    test.done();
  },

  'Pass should render InputPath / Parameters / OutputPath correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Pass(stack, 'Pass', {
      inputPath: '$',
      outputPath: '$.state',
      parameters: {
        'input.$': '$',
        'stringArgument': 'inital-task',
        'numberArgument': 123,
        'booleanArgument': true,
        'arrayArgument': ['a', 'b', 'c']
      }
    });

    // WHEN
    const taskState = task.toStateJson();

    // THEN
    test.deepEqual(taskState, { End: true,
      InputPath: '$',
      OutputPath: '$.state',
      Parameters:
             { 'input.$': '$',
               'stringArgument': 'inital-task',
               'numberArgument': 123,
               'booleanArgument': true,
               'arrayArgument': [ 'a', 'b', 'c' ] },
      Type: 'Pass',
      Comment: undefined,
      Result: undefined,
      ResultPath: undefined,
    });

    test.done();
  },

  'State machines must depend on their roles'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const task = new stepfunctions.Task(stack, 'Task', {
      task: {
        bind: () => ({
          resourceArn: 'resource',
          policyStatements: [
            new iam.PolicyStatement({
              resources: ['resource'],
              actions: ['lambda:InvokeFunction'],
            })
          ],
        })
      }
    });
    new stepfunctions.StateMachine(stack, 'StateMachine', {
      definition: task
    });

    // THEN
    expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
      DependsOn: [
        'StateMachineRoleDefaultPolicyDF1E6607',
        'StateMachineRoleB840431D'
      ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

};
