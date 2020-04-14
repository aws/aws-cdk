import { Grant, IGrantable, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, Construct, Duration } from '@aws-cdk/core';

export interface StateMachineProps {
  readonly isCompleteHandler: IFunction;

  readonly timeoutHandler: IFunction;

  readonly interval: Duration;

  readonly maxAttempts: number;

  readonly backoffRate: number;
}

/**
 * A very simple StateMachine construct highly customized to the provider framework.
 * This is so that this package does not need to depend on aws-stepfunctions module.
 */
export class StateMachine extends Construct {
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: StateMachineProps) {
    super(scope, id);

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('states.amazonaws.com'),
    });
    role.addToPolicy(new PolicyStatement({
      actions: [ 'lambda:InvokeFunction' ],
      resources: [ props.isCompleteHandler.functionArn, props.timeoutHandler.functionArn ],
    }));

    const definition = JSON.stringify({
      StartAt: 'framework-isComplete-task',
      States: {
        'framework-isComplete-task': {
          End: true,
          Retry: [{
            ErrorEquals: [ 'States.ALL' ],
            IntervalSeconds: props.interval.toSeconds(),
            MaxAttempts: props.maxAttempts,
            BackoffRate: props.backoffRate
          }],
          Catch: [{
            ErrorEquals: [ 'States.ALL' ],
            Next: 'framework-onTimeout-task'
          }],
          Type: 'Task',
          Resource: props.isCompleteHandler.functionArn,
        },
        'framework-onTimeout-task': {
          End: true,
          Type: 'Task',
          Resource: props.timeoutHandler.functionArn
        }
      }
    });

    const resource = new CfnResource(this, 'Resource', {
      type: 'AWS::StepFunctions::StateMachine',
      properties: {
        DefinitionString: definition,
        RoleArn: role.roleArn,
      }
    });
    resource.addDependsOn(role.node.defaultChild as CfnResource);

    this.stateMachineArn = resource.ref;
  }

  public grantStartExecution(identity: IGrantable) {
    return Grant.addToPrincipal({
      grantee: identity,
      actions: [ 'states:StartExecution' ],
      resourceArns: [ this.stateMachineArn ]
    });
  }
}