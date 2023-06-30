import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';
import { ArnFormat, Stack } from 'aws-cdk-lib';

/**
 * Configuration properties of an action for the Step Functions State Machine.
 */
export interface StepFunctionsStateMachineActionProps extends CommonActionProps {
  /**
   * Name of the state machine execution prefix.
   * The name given to the state machine execution consists of this prefix followed by a UUID. Step Functions creates a unique name for each state machine execution if one is not provided.
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/stepfunctions-rule-action.html#stepfunctions-rule-action-parameters
   *
   * @default: None - Step Functions creates a unique name for each state machine execution if one is not provided.
   */
  readonly executionNamePrefix?: string;
}

/**
 * The action to put the record from an MQTT message to the Step Functions State Machine.
 */
export class StepFunctionsStateMachineAction implements iot.IAction {
  private readonly executionNamePrefix?: string;
  private readonly role?: iam.IRole;

  /**
   * @param stateMachine The Step Functions Start Machine which shoud be executed.
   * @param props Optional properties to not use default
   */
  constructor(private readonly stateMachine: stepfunctions.IStateMachine, props?: StepFunctionsStateMachineActionProps) {
    this.executionNamePrefix = props?.executionNamePrefix;
    this.role = props?.role;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    const stateMachineName = Stack.of(this.stateMachine).splitArn(this.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName;

    if (!stateMachineName) {
      throw new Error(`No state machine name found in ARN: '${this.stateMachine.stateMachineArn}'`);
    }

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['states:StartExecution'],
      resources: [this.stateMachine.stateMachineArn],
    }));

    return {
      configuration: {
        stepFunctions: {
          stateMachineName,
          executionNamePrefix: this.executionNamePrefix,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
