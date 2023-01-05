import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunction from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';

/**
 * Represents the input for the StateMachine.
 */
export class StateMachineInput {
  /**
   * When the input type is FilePath, input artifact and
   * filepath must be specified.
   */
  public static filePath(inputFile: codepipeline.ArtifactPath): StateMachineInput {
    return new StateMachineInput(inputFile.location, inputFile.artifact, 'FilePath');
  }

  /**
   * When the input type is Literal, input value is passed
   * directly to the state machine input.
   */
  public static literal(object: object): StateMachineInput {
    return new StateMachineInput(JSON.stringify(object), undefined, 'Literal');
  }

  /**
   * The optional input Artifact of the Action.
   * If InputType is set to FilePath, this artifact is required
   * and is used to source the input for the state machine execution.
   *
   * @default - the Action will not have any inputs
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-StepFunctions.html#action-reference-StepFunctions-example
   */
  public readonly inputArtifact?: codepipeline.Artifact;

  /**
   * Optional StateMachine InputType
   * InputType can be Literal or FilePath
   *
   * @default - Literal
   */
  public readonly inputType?: string;

  /**
   * When InputType is set to Literal (default), the Input field is used
   * directly as the input for the state machine execution.
   * Otherwise, the state machine is invoked with an empty JSON object {}.
   *
   * When InputType is set to FilePath, this field is required.
   * An input artifact is also required when InputType is set to FilePath.
   *
   * @default - none
   */
  public readonly input: any;

  private constructor(input: any, inputArtifact: codepipeline.Artifact | undefined, inputType: string) {
    this.input = input;
    this.inputArtifact = inputArtifact;
    this.inputType = inputType;
  }
}

/**
 * Construction properties of the `StepFunctionsInvokeAction StepFunction Invoke Action`.
 */
export interface StepFunctionsInvokeActionProps extends codepipeline.CommonAwsActionProps {
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
   * Represents the input to the StateMachine.
   * This includes input artifact, input type and the statemachine input.
   *
   * @default - none
   */
  readonly stateMachineInput?: StateMachineInput;

  /**
   * Prefix (optional)
   *
   * By default, the action execution ID is used as the state machine execution name.
   * If a prefix is provided, it is prepended to the action execution ID with a hyphen and
   * together used as the state machine execution name.
   *
   * @default - action execution ID
   */
  readonly executionNamePrefix?: string;
}

/**
 * StepFunctionInvokeAction that is provided by an AWS CodePipeline.
 */
export class StepFunctionInvokeAction extends Action {
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
      inputs: (props.stateMachineInput && props.stateMachineInput.inputArtifact) ? [props.stateMachineInput.inputArtifact] : [],
      outputs: (props.output) ? [props.output] : [],
    });
    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // allow pipeline to invoke this step function
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['states:StartExecution', 'states:DescribeStateMachine'],
      resources: [this.props.stateMachine.stateMachineArn],
    }));

    // allow state machine executions to be inspected
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['states:DescribeExecution'],
      resources: [cdk.Stack.of(this.props.stateMachine).formatArn({
        service: 'states',
        resource: 'execution',
        resourceName: `${cdk.Stack.of(this.props.stateMachine).splitArn(this.props.stateMachine.stateMachineArn, cdk.ArnFormat.COLON_RESOURCE_NAME).resourceName}:${this.props.executionNamePrefix ?? ''}*`,
        arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
      })],
    }));

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs ?? []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    return {
      configuration: {
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Input: this.props.stateMachineInput?.input,
        InputType: this.props.stateMachineInput?.inputType,
        ExecutionNamePrefix: this.props.executionNamePrefix,
      },
    };
  }
}
