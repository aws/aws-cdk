import * as codepipeline from '@aws-cdk/aws-codepipeline';
/**
 * The ArtifactBounds that make sense for source Actions -
 * they don't have any inputs, and have exactly one output.
 */
export declare function sourceArtifactBounds(): codepipeline.ActionArtifactBounds;
/**
 * The ArtifactBounds that make sense for deploy Actions -
 * they have exactly one input, and don't produce any outputs.
 */
export declare function deployArtifactBounds(): codepipeline.ActionArtifactBounds;
export declare function validatePercentage(name: string, value?: number): void;
