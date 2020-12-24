import * as cp from '@aws-cdk/aws-codepipeline';
import { ExecutionArtifact } from '../../graph';

/**
 * Translate Graph Artifacts to CodePipeline Artifacts
 */
export class ArtifactMap {
  private artifacts = new Map<ExecutionArtifact, cp.Artifact>();

  public toCodePipeline(x: ExecutionArtifact): cp.Artifact {
    let ret = this.artifacts.get(x);
    if (!ret) {
      this.artifacts.set(x, ret = new cp.Artifact());
    }
    return ret;
  }
}