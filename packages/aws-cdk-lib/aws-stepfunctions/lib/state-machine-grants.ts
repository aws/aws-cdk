import * as stepfunctions from './stepfunctions.generated';
import * as iam from '../../aws-iam';
import { Arn, ArnFormat, Stack } from '../../core';

/**
 * Properties for StateMachineGrants
 */
export interface StateMachineGrantsProps {
  /**
   * The resource on which actions will be allowed
   */
  readonly resource: stepfunctions.IStateMachineRef;
}

/**
 * Collection of grant methods for a IStateMachineRef
 */
export class StateMachineGrants {
  /**
   * Creates grants for StateMachineGrants
   *
   * @internal
   */
  public static _fromStateMachine(resource: stepfunctions.IStateMachineRef): StateMachineGrants {
    return new StateMachineGrants({
      resource: resource,
    });
  }

  protected readonly resource: stepfunctions.IStateMachineRef;

  private constructor(props: StateMachineGrantsProps) {
    this.resource = props.resource;
  }

  /**
   * Grant the given identity task response permissions on a state machine
   */
  public taskResponse(grantee: iam.IGrantable): iam.Grant {
    const actions = ['states:SendTaskSuccess', 'states:SendTaskFailure', 'states:SendTaskHeartbeat'];
    return iam.Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [stepfunctions.CfnStateMachine.arnForStateMachine(this.resource)],
    });
  }

  /**
   * Grant the given identity permission to redrive the execution of the state machine
   */
  public redriveExecution(grantee: iam.IGrantable): iam.Grant {
    const actions = ['states:RedriveExecution'];
    return iam.Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [stepfunctions.CfnStateMachine.arnForStateMachine(this.resource) + ':*'],
    });
  }

  /**
   * Grant the given identity permissions to read results from state
   * machine.
   */
  public read(grantee: iam.IGrantable): iam.Grant {
    iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: [
        'states:ListExecutions',
        'states:ListStateMachines',
      ],
      resourceArns: [stepfunctions.CfnStateMachine.arnForStateMachine(this.resource)],
    });
    iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: [
        'states:DescribeExecution',
        'states:DescribeStateMachineForExecution',
        'states:GetExecutionHistory',
      ],
      resourceArns: [this.executionArn() + ':*'],
    });
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: [
        'states:ListActivities',
        'states:DescribeStateMachine',
        'states:DescribeActivity',
      ],
      resourceArns: ['*'],
    });
  }

  /**
   * Grant the given identity permissions to start an execution of this state
   * machine.
   *
   * @param grantee The principal
   */
  public startExecution(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: ['states:StartExecution'],
      resourceArns: [this.resource.stateMachineRef.stateMachineArn],
    });
  }

  /**
   * Grant the given identity permissions to start a synchronous execution of
   * this state machine.
   *
   * @param grantee The principal
   */
  public startSyncExecution(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: ['states:StartSyncExecution'],
      resourceArns: [this.resource.stateMachineRef.stateMachineArn],
    });
  }

  /**
   * Grant the given identity permissions to start an execution of
   * this state machine.
   *
   * @param grantee The principal
   */
  public execution(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions,
      resourceArns: [this.executionArn() + ':*'],
    });
  }

  /**
   * Grant the given identity custom permissions
   */
  public actions(identity: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions,
      resourceArns: [this.resource.stateMachineRef.stateMachineArn],
    });
  }

  /**
   * Returns the pattern for the execution ARN's of the state machine
   */
  private executionArn(): string {
    return Stack.of(this.resource).formatArn({
      resource: 'execution',
      service: 'states',
      resourceName: Arn.split(this.resource.stateMachineRef.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }
}
