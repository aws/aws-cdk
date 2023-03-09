import { Grant, IGrantable, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

export interface WaiterStateMachineProps {
  /**
   * The main handler that notifies if the waiter to decide 'complete' or 'incomplete'.
   */
  readonly isCompleteHandler: IFunction;

  /**
   * The handler to call if the waiter times out and is incomplete.
   */
  readonly timeoutHandler: IFunction;

  /**
   * The interval to wait between attempts.
   */
  readonly interval: Duration;

  /**
   * Number of attempts.
   */
  readonly maxAttempts: number;

  /**
   * Backoff between attempts.
   */
  readonly backoffRate: number;
}

/**
 * A very simple StateMachine construct highly customized to the provider framework.
 * This is so that this package does not need to depend on aws-stepfunctions module.
 *
 * The state machine continuously calls the isCompleteHandler, until it succeeds or times out.
 * The handler is called `maxAttempts` times with an `interval` duration and a `backoffRate` rate.
 */
export class WaiterStateMachine extends Construct {
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: WaiterStateMachineProps) {
    super(scope, id);

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('states.amazonaws.com'),
    });
    props.isCompleteHandler.grantInvoke(role);
    props.timeoutHandler.grantInvoke(role);

    const definition = Stack.of(this).toJsonString({
      StartAt: 'framework-isComplete-task',
      States: {
        'framework-isComplete-task': {
          End: true,
          Retry: [{
            ErrorEquals: ['States.ALL'],
            IntervalSeconds: props.interval.toSeconds(),
            MaxAttempts: props.maxAttempts,
            BackoffRate: props.backoffRate,
          }],
          Catch: [{
            ErrorEquals: ['States.ALL'],
            Next: 'framework-onTimeout-task',
          }],
          Type: 'Task',
          Resource: props.isCompleteHandler.functionArn,
        },
        'framework-onTimeout-task': {
          End: true,
          Type: 'Task',
          Resource: props.timeoutHandler.functionArn,
        },
      },
    });

    const resource = new CfnResource(this, 'Resource', {
      type: 'AWS::StepFunctions::StateMachine',
      properties: {
        DefinitionString: definition,
        RoleArn: role.roleArn,
      },
    });
    resource.node.addDependency(role);

    this.stateMachineArn = resource.ref;
  }

  public grantStartExecution(identity: IGrantable) {
    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['states:StartExecution'],
      resourceArns: [this.stateMachineArn],
    });
  }
}
