import { IPipelineRef } from '../../../interfaces/generated/aws-codepipeline-interfaces.generated';
import { CfnPipeline } from '../codepipeline.generated';
import { IPipeline } from '../action';

/**
 * Get the pipeline ARN from an IPipelineRef.
 * If the object is actually an IPipeline with a concrete pipelineArn, use that.
 * Otherwise, construct the ARN from the pipeline name.
 */
export function getPipelineArn(pipeline: IPipelineRef): string {
  // Check if this is actually an IPipeline with a pipelineArn property
  if (isIPipeline(pipeline)) {
    return pipeline.pipelineArn;
  }
  
  // Fall back to constructing the ARN
  return CfnPipeline.arnForPipeline(pipeline);
}

/**
 * Type guard to check if an IPipelineRef is actually an IPipeline
 */
function isIPipeline(pipeline: IPipelineRef): pipeline is IPipeline {
  return 'pipelineArn' in pipeline && typeof (pipeline as any).pipelineArn === 'string';
}
