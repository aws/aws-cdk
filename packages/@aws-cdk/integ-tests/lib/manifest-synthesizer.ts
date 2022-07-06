import { IntegManifest, Manifest } from '@aws-cdk/cloud-assembly-schema';
import { ISynthesisSession } from '@aws-cdk/core';
import { IntegManifestWriter } from './manifest-writer';
import { IntegTestCase } from './test-case';

const emptyManifest: IntegManifest = {
  version: '',
  testCases: { },
};

export class IntegManifestSynthesizer {
  constructor(private readonly testCases: IntegTestCase[]) {}

  synthesize(session: ISynthesisSession) {
    const manifest = this.testCases
      .map(tc => tc.manifest)
      .reduce(mergeManifests, emptyManifest);

    const snapshotDir = session.assembly.outdir;

    IntegManifestWriter.write(manifest, snapshotDir);
  }
}

function mergeManifests(m1: IntegManifest, m2: IntegManifest): IntegManifest {
  return {
    version: Manifest.version(),
    testCases: { ...m1.testCases, ...m2.testCases },
  };
}
