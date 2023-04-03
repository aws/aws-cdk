import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as stepfunction from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Represents the input for the StateMachine.
 */
export declare class StateMachineInput {
    /**
     * When the input type is FilePath, input artifact and
     * filepath must be specified.
     */
    static filePath(inputFile: codepipeline.ArtifactPath): StateMachineInput;
    /**
     * When the input type is Literal, input value is passed
     * directly to the state machine input.
     */
    static literal(object: object): StateMachineInput;
    /**
     * The optional input Artifact of the Action.
     * If InputType is set to FilePath, this artifact is required
     * and is used to source the input for the state machine execution.
     *
     * @default - the Action will not have any inputs
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-StepFunctions.html#action-reference-StepFunctions-example
     */
    readonly inputArtifact?: codepipeline.Artifact;
    /**
     * Optional StateMachine InputType
     * InputType can be Literal or FilePath
     *
     * @default - Literal
     */
    readonly inputType?: string;
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
    readonly input: any;
    private constructor();
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
export declare class StepFunctionInvokeAction extends Action {
    private readonly props;
    constructor(props: StepFunctionsInvokeActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
