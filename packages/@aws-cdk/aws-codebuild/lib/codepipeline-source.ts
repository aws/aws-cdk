import { Source } from './source';
import { CODEPIPELINE_SOURCE_ARTIFACTS_TYPE } from './source-types';

/**
 * CodePipeline Source definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 */
export class CodePipelineSource extends Source {
  public readonly type = CODEPIPELINE_SOURCE_ARTIFACTS_TYPE;

  constructor() {
    super({});
  }
}
