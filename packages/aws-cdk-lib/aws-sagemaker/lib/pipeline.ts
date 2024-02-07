import { IResource } from '../../core';

/**
 * The interface for a SageMaker Pipeline resource.
 */
export interface IPipeline extends IResource {
  /**
   * The ARN of the pipeline.
   *
   * @attribute
   */
  readonly pipelineArn: string;

  /**
   * The name of the pipeline.
   *
   * @attribute
   */
  readonly pipelineName: string;
}
