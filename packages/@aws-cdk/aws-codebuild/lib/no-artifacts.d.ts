import { Artifacts } from './artifacts';
/**
 * A `NO_ARTIFACTS` CodeBuild Project Artifact definition.
 * This is the default artifact type,
 * if none was specified when creating the Project
 * (and the source was not specified to be CodePipeline).
 * *Note*: the `NO_ARTIFACTS` type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 *
 * This class is private to the @aws-codebuild package.
 */
export declare class NoArtifacts extends Artifacts {
    readonly type = "NO_ARTIFACTS";
    constructor();
}
