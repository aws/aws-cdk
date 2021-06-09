import * as cp from '@aws-cdk/aws-codepipeline';
import { FileSet } from '../blueprint';

/**
 * Translate Graph Artifacts to CodePipeline Artifacts
 */
export class ArtifactMap {
  private artifacts = new Map<FileSet, cp.Artifact>();
  private usedNames = new Set<string>();

  public toCodePipeline(x: FileSet): cp.Artifact {
    let ret = this.artifacts.get(x);
    if (!ret) {
      // They all need a name
      const artifactName = this.makeUniqueName(`${x.producer.id}.${x.id}`);
      this.usedNames.add(artifactName);
      this.artifacts.set(x, ret = new cp.Artifact(artifactName));
    }
    return ret;
  }

  private makeUniqueName(baseName: string) {
    let i = 1;
    baseName = sanitizeArtifactName(baseName);
    let name = baseName;
    while (this.usedNames.has(name)) {
      name = `${baseName}${++i}`;
    }
    return name;
  }
}

function sanitizeArtifactName(x: string): string {
  // FIXME: Does this REALLY not allow '.'? The docs don't mention it, but action names etc. do!
  return x.replace(/[^A-Za-z0-9@\-_]/g, '_');
}
