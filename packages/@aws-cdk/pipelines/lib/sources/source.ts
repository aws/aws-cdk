import * as codepipeline from '@aws-cdk/aws-codepipeline';

/**
 * Interface for a CDK Pipeline source provider.
 * This object is called by the pipeline to generate a CodePipeline action to provide the source code of the pipeline.
 */
export interface ISource {
  /**
   * Called lazily by CDK pipelines with a provided or generated source artifact.
   *
   * @param sourceArtifact the source artifact to use for the CodePipeline source action
   */
  provideSourceAction(sourceArtifact: codepipeline.Artifact): codepipeline.IAction;
}