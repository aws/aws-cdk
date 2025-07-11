import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';

/**
 * Parameters for the SfnStateMachine target
 */
export interface SfnStateMachineParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * Specify whether to invoke the State Machine synchronously (`REQUEST_RESPONSE`) or asynchronously (`FIRE_AND_FORGET`).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagededuplicationid
   * @default StateMachineInvocationType.FIRE_AND_FORGET
   */
  readonly invocationType?: StateMachineInvocationType;
}

/**
 * InvocationType for invoking the State Machine.
 * @see https://docs.aws.amazon.com/eventbridge/latest/pipes-reference/API_PipeTargetStateMachineParameters.html
 */
export enum StateMachineInvocationType {
  /**
   * Invoke StepFunction asynchronously (`StartExecution`). See https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html for more details.
   */
  FIRE_AND_FORGET = 'FIRE_AND_FORGET',

  /**
   * Invoke StepFunction synchronously (`StartSyncExecution`) and wait for the execution to complete. See https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartSyncExecution.html for more details.
   */
  REQUEST_RESPONSE = 'REQUEST_RESPONSE',
}

/**
 * An EventBridge Pipes target that sends messages to an AWS Step Functions State Machine.
 */
export class SfnStateMachine implements ITarget {
  public readonly targetArn: string;

  private readonly stateMachine: sfn.IStateMachine;
  private readonly invocationType: StateMachineInvocationType;
  private readonly inputTemplate?: IInputTransformation;

  constructor(stateMachine: sfn.IStateMachine, parameters: SfnStateMachineParameters) {
    this.stateMachine = stateMachine;
    this.targetArn = stateMachine.stateMachineArn;
    this.invocationType = parameters.invocationType?? StateMachineInvocationType.FIRE_AND_FORGET;
    this.inputTemplate = parameters.inputTransformation;

    if (this.stateMachine instanceof StateMachine
      && this.stateMachine.stateMachineType === StateMachineType.STANDARD
      && this.invocationType === StateMachineInvocationType.REQUEST_RESPONSE) {
      throw new Error('STANDARD state machine workflows do not support the REQUEST_RESPONSE invocation type. Use FIRE_AND_FORGET instead.');
    }
  }

  grantPush(grantee: IRole): void {
    if (this.invocationType === StateMachineInvocationType.FIRE_AND_FORGET) {
      this.stateMachine.grantStartExecution(grantee);
    } else {
      this.stateMachine.grantStartSyncExecution(grantee);
    }
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTemplate?.bind(pipe).inputTemplate,
        stepFunctionStateMachineParameters: {
          invocationType: this.invocationType,
        },
      },
    };
  }
}
