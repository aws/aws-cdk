import { Grant, IGrantable } from '../../aws-iam';
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

  /**
   * Permits an IAM principal to start this pipeline execution
   * @param grantee The principal to grant access to
   */
  grantStartPipelineExecution(grantee: IGrantable): Grant;
}
