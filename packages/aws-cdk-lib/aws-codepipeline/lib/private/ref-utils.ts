import { Stack } from '../../../core';
import { IPipelineRef } from '../../../interfaces/generated/aws-codepipeline-interfaces.generated';
import { IPipeline } from '../action';

/**
 * Get the pipeline ARN from a pipeline reference
 * @internal
 */
export function getPipelineArn(pipeline: IPipelineRef): string {
  // If this is a full IPipeline, use its pipelineArn directly
  if ('pipelineArn' in pipeline && typeof (pipeline as any).pipelineArn === 'string') {
    return (pipeline as IPipeline).pipelineArn;
  }

  // Otherwise, construct it from the reference
  return Stack.of(pipeline).formatArn({
    service: 'codepipeline',
    resource: pipeline.pipelineRef.pipelineName,
  });
}
