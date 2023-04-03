import { Source } from './source';
/**
 * CodePipeline Source definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export declare class CodePipelineSource extends Source {
    readonly type = "CODEPIPELINE";
    constructor();
}
