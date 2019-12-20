import * as codepipeline from '@aws-cdk/aws-codepipeline';

/**
 * The ArtifactBounds that make sense for source Actions -
 * they don't have any inputs, and have exactly one output.
 */
export function sourceArtifactBounds(): codepipeline.ActionArtifactBounds {
  return {
    minInputs: 0,
    maxInputs: 0,
    minOutputs: 1,
    maxOutputs: 1,
  };
}

/**
 * The ArtifactBounds that make sense for deploy Actions -
 * they have exactly one input, and don't produce any outputs.
 */
export function deployArtifactBounds(): codepipeline.ActionArtifactBounds {
  return {
    minInputs: 1,
    maxInputs: 1,
    minOutputs: 0,
    maxOutputs: 0,
  };
}
