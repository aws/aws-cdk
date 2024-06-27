import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IPipeline } from 'aws-cdk-lib/aws-sagemaker';

/**
 * SageMaker target properties.
 */
export interface SageMakerTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * List of parameter names and values for SageMaker Model Building Pipeline execution.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html#cfn-pipes-pipe-pipetargetsagemakerpipelineparameters-pipelineparameterlist
   * @default - none
   */
  readonly pipelineParameterList?: SageMakerPipelineParameter[];
}

/**
 * The name/value pair of a parameter to start execution of a SageMaker Model Building Pipeline.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html
 */
export interface SageMakerPipelineParameter {
  /**
   * Name of parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-name
   */
  readonly name: string;

  /**
   * Value of parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @ see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-sagemakerpipelineparameter.html#cfn-pipes-pipe-sagemakerpipelineparameter-value
   */
  readonly value: string;
}

/**
 * A EventBridge Pipes target that sends messages to an SageMaker.
 */
export class SageMakerTarget implements ITarget {
  private pipeline: IPipeline;
  private sagemakerParameters?: SageMakerTargetParameters;
  public readonly targetArn: string;

  constructor(pipeline: IPipeline, parameters?: SageMakerTargetParameters) {
    this.pipeline = pipeline;
    this.targetArn = pipeline.pipelineArn;
    this.sagemakerParameters = parameters;
  }

  grantPush(grantee: IRole): void {
    this.pipeline.grantStartPipelineExecution(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.sagemakerParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.sagemakerParameters.inputTransformation?.bind(pipe).inputTemplate,
        sageMakerPipelineParameters: this.sagemakerParameters,
      },
    };
  }
}
