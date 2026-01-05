import { Grant, IGrantable } from '../../aws-iam';
import { IResource } from '../../core';
import { IPipelineRef } from '../../interfaces/generated/aws-sagemaker-interfaces.generated';

/**
 * The interface for a SageMaker Pipeline resource.
 */
export interface IPipeline extends IResource, IPipelineRef {
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
   * A reference to this Pipeline resource.
   */
  readonly pipelineRef: import('../../interfaces/generated/aws-sagemaker-interfaces.generated').PipelineReference;

  /**
   * Permits an IAM principal to start this pipeline execution
   * @param grantee The principal to grant access to
   */
  grantStartPipelineExecution(grantee: IGrantable): Grant;
}
