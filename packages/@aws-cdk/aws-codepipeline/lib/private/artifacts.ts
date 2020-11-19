import { Artifact } from '../artifact';
import { CfnPipeline } from '../codepipeline.generated';

export function renderArtifacts(artifacts: Artifact[]): CfnPipeline.InputArtifactProperty[] | undefined {
  return noEmptyArray(artifacts
    .filter(a => a.artifactName)
    .map(a => ({ name: a.artifactName! })));
}

export function deduplicateArtifacts(artifacts?: Artifact[]): Artifact[] {
  const ret = new Array<Artifact>();
  for (const artifact of artifacts || []) {
    if (artifact.artifactName) {
      if (ret.find(a => a.artifactName === artifact.artifactName)) {
        continue;
      }
    } else {
      if (ret.find(a => a === artifact)) {
        continue;
      }
    }

    ret.push(artifact);
  }
  return ret;
}

function noEmptyArray<A>(xs: A[]): A[] | undefined {
  return xs.length > 0 ? xs : undefined;
}