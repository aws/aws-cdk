import { Artifacts } from './artifacts';
/**
 * CodePipeline Artifact definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export declare class CodePipelineArtifacts extends Artifacts {
    readonly type = "CODEPIPELINE";
    constructor();
}
