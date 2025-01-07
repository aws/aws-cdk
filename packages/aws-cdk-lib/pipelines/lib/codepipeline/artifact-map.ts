import * as crypto from 'crypto';
import * as cp from '../../../aws-codepipeline';
import { FileSet } from '../blueprint';
import { PipelineGraph } from '../helpers-internal';

/**
 * Translate FileSets to CodePipeline Artifacts
 */
export class ArtifactMap {
  private artifacts = new Map<FileSet, cp.Artifact>();
  private usedNames = new Set<string>();

  /**
   * Return the matching CodePipeline artifact for a FileSet
   */
  public toCodePipeline(x: FileSet): cp.Artifact {
    if (x instanceof CodePipelineFileSet) {
      return x._artifact;
    }

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

/**
 * Sanitize a string to be a valid artifact name
 *
 * This must comport to both the rules of artifacts in CodePipeline, as well
 * as the names of Source Identifiers in CodeBuild.
 *
 * Artifact Name limits aren't documented.
 *
 * Source Identifier limits are documented here:
 * https://docs.aws.amazon.com/codebuild/latest/APIReference/API_ProjectSource.html#CodeBuild-Type-ProjectSource-sourceIdentifier
 */
function sanitizeArtifactName(x: string): string {
  let sani = x.replace(/[^A-Za-z0-9_]/g, '_'); // Charset requirement is imposed by CodeBuild
  const maxLength = 100; // Max length of 100 is imposed by CodePipeline library

  if (sani.length > maxLength) {
    const fingerprint = crypto.createHash('sha256').update(sani).digest('hex').slice(0, 8);
    sani = sani.slice(0, maxLength - fingerprint.length) + fingerprint;
  }

  return sani;
}

/**
 * A FileSet created from a CodePipeline artifact
 *
 * You only need to use this if you want to add CDK Pipeline stages
 * add the end of an existing CodePipeline, which should be very rare.
 */
export class CodePipelineFileSet extends FileSet {
  /**
   * Turn a CodePipeline Artifact into a FileSet
   */
  public static fromArtifact(artifact: cp.Artifact) {
    return new CodePipelineFileSet(artifact);
  }

  /**
   * The artifact this class is wrapping
   *
   * @internal
   */
  public readonly _artifact: cp.Artifact;

  private constructor(artifact: cp.Artifact) {
    super(artifact.artifactName ?? 'Imported', PipelineGraph.NO_STEP);
    this._artifact = artifact;
  }
}
