import * as cp from '@aws-cdk/aws-codepipeline';
import { ExecutionArtifact } from '../../graph';

/**
 * Translate Graph Artifacts to CodePipeline Artifacts
 */
export class ArtifactMap {
  private artifacts = new Map<ExecutionArtifact, cp.Artifact>();
  private usedNames = new Set<string>();

  public toCodePipeline(x: ExecutionArtifact): cp.Artifact {
    let ret = this.artifacts.get(x);
    if (!ret) {
      // They all need a name
      const artifactName = this.makeUniqueName(`${x.producer.name}.${x.name}`);
      this.usedNames.add(artifactName);
      this.artifacts.set(x, ret = new cp.Artifact(artifactName));
    }
    return ret;
  }

  private makeUniqueName(baseName: string) {
    // just to shut up the compiler about sanitizeName() being unused
    sanitizeName('a');

    let i = 1;
    let name = baseName;
    while (this.usedNames.has(name)) {
      name = `${baseName}${++i}`;
    }
    return name;
  }
}

function sanitizeName(x: string): string {
  return x.replace(/[^A-Za-z0-9.@\-_]/g, '_');
}
