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
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * List of parameter names and values for SageMaker Model Building Pipeline execution.
   *
   * The Name/Value pairs are passed to start execution of the pipeline.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsagemakerpipelineparameters.html#cfn-pipes-pipe-pipetargetsagemakerpipelineparameters-pipelineparameterlist
   * @default - none
   */
  readonly pipelineParameters?: Record<string, string>;
}

/**
 * An EventBridge Pipes target that sends messages to a SageMaker pipeline.
 */
export class SageMakerTarget implements ITarget {
  private pipeline: IPipeline;
  private sageMakerParameters?: SageMakerTargetParameters;
  private pipelineParameters?: Record<string, string>;
  public readonly targetArn: string;

  constructor(pipeline: IPipeline, parameters?: SageMakerTargetParameters) {
    this.pipeline = pipeline;
    this.targetArn = pipeline.pipelineArn;
    this.sageMakerParameters = parameters;
    this.pipelineParameters = this.sageMakerParameters?.pipelineParameters;
  }

  grantPush(grantee: IRole): void {
    this.pipeline.grantStartPipelineExecution(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.sageMakerParameters) {
      return { targetParameters: {} };
    }

    return {
      targetParameters: {
        inputTemplate: this.sageMakerParameters.inputTransformation?.bind(pipe).inputTemplate,
        sageMakerPipelineParameters: {
          pipelineParameterList: this.pipelineParameters ?
            Object.entries(this.pipelineParameters).map(([key, value]) => ({
              name: key,
              value: value,
            })) : undefined,
        },
      },
    };
  }
}
