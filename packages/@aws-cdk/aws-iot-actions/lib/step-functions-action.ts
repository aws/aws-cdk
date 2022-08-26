import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for Step Functions
 */
export interface StepFunctionsActionProps extends CommonActionProps {
  /**
   * Specifies which prefix to append to the state machine execution.
   *
   * @default - no prefix
   */
  readonly executionNamePrefix?: string;
}

/**
 * The action to start the execution of a Step Functions state machine
 */
export class StepFunctionsAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly stateMachine: sfn.StateMachine;
  private readonly executionNamePrefix?: string;

  /**
   * @param stateMachine The Step Functions state machine whose execution will be started.
   * @param props Optional properties to not use default
   */
  constructor(
    stateMachine: sfn.StateMachine,
    props: StepFunctionsActionProps = {},
  ) {
    this.stateMachine = stateMachine;
    this.role = props.role;
    this.executionNamePrefix = props.executionNamePrefix;
  }

  /**
   * @internal
   */
  _bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(topicRule);
    role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [this.stateMachine.stateMachineArn],
      }),
    );

    return {
      configuration: {
        stepFunctions: {
          roleArn: role.roleArn,
          stateMachineName: this.stateMachine.stateMachineName,
          executionNamePrefix: this.executionNamePrefix,
        },
      },
    };
  }
}
