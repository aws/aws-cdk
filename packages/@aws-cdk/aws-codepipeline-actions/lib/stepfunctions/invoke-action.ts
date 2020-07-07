import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunction from '@aws-cdk/aws-stepfunctions';
import { Construct} from '@aws-cdk/core';
import { Action } from '../action';

/**
 * Represents the input type for the StateMachine.
 */
export enum StateMachineInputType {
  /**
   * When specified, the value in the Input field is passed
   * directly to the state machine input.
   */
  LITERAL = 'Literal',

  /**
   * The contents of a file in the input artifact specified by the Input field
   * is used as the input for the state machine execution.
   * Input artifact and FilePath is required when InputType is set to FilePath.
   */
  FILEPATH = 'FilePath',
}

/**
 * Construction properties of the {@link StepFunctionsInvokeAction StepFunction Invoke Action}.
 */
export interface StepFunctionsInvokeActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The optional input Artifact of the Action.
   * If InputType is set to FilePath, this artifact is required
   * and is used to source the input for the state machine execution.
   *
   * @default the Action will not have any inputs
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-StepFunctions.html#action-reference-StepFunctions-example
   */
  readonly input?: codepipeline.Artifact;

  /**
   * The optional output Artifact of the Action.
   *
   * @default the Action will not have any outputs
   */
  readonly output?: codepipeline.Artifact;

  /**
   * The state machine to invoke.
   */
  readonly stateMachine: stepfunction.IStateMachine;

  /**
   * Optional StateMachine InputType
   * InputType can be Literal or FilePath
   *
   * @default - Literal
   */
  readonly stateMachineInputType?: StateMachineInputType;

  /**y
   * When InputType is set to Literal (default), this field is optional.
   * If provided, the Input field is used directly as the input for the state machine execution.
   * Otherwise, the state machine is invoked with an empty JSON object {}.
   *
   * When InputType is set to FilePath, this field is required.
   * An input artifact is also required when InputType is set to FilePath.
   *
   * @default - none
   */
  readonly stateMachineInput?: string | object;

  /**
   * Prefix (optinoal)
   *
   * By default, the action execution ID is used as the state machine execution name.
   * If a prefix is provided, it is prepended to the action execution ID with a hyphen and
   * together used as the state machine execution name.
   *
   * @default - action execution ID
   */
  readonly executionPrefixName?: string;
}

/**
 * CodePipeline invoke Action that is provided by an AWS Step Function.
 */
export class StepFunctionsInvokeAction extends Action {
  private readonly props: StepFunctionsInvokeActionProps;

  constructor(props: StepFunctionsInvokeActionProps) {
    super({
      ...props,
      resource: props.stateMachine,
      category: codepipeline.ActionCategory.INVOKE,
      provider: 'StepFunctions',
      artifactBounds: {
        minInputs: 0,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 1,
      },
    });

    // StateMachineInput is required when the StateMachineInputType is set as FilePath
    if ( props.stateMachineInputType === StateMachineInputType.FILEPATH && (!props.stateMachineInput)) {
      throw new Error('Input type FilePath was specified, but no filepath was provided');
    }

    // Input Artifact is required when the StateMachineInputType is set as FilePath
    if ( props.stateMachineInputType === StateMachineInputType.FILEPATH && (!this.actionProperties.inputs)) {
      throw new Error('Input type FilePath was specified, but no input artifact was provided');
    }

    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // allow pipeline to invoke this step function
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['states:StartExecution', 'states:DescribeStateMachine'],
      resources: [this.props.stateMachine.stateMachineArn],
    }));

    // allow action executions to be inspected and invoked
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['states:DescribeExecution'],
      // TODO: find statemachinename from arn. ARN is part of interface IStateMachine which doesn't have the name property. Confirm with Matt
      resources: [`arn:aws:states:*:*:execution:${this.props.stateMachine.stateMachineArn}:${this.props.executionPrefixName || ''}*`],
    }));

    this.props.stateMachine.grantStartExecution(options.role);

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs || []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    return {
      configuration: {
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Input: this.props.stateMachineInput,
        InputType: this.props.stateMachineInputType,
        ExecutionNamePrefix: this.props.executionPrefixName,
      },
    };
  }
}