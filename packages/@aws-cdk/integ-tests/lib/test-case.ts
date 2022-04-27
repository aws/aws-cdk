import { IntegManifest, TestCase, TestOptions } from '@aws-cdk/cloud-assembly-schema';
import { attachCustomSynthesis, ISynthesisSession, Stack } from '@aws-cdk/core';
import { IntegManifestWriter } from './manifest-writer';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Properties of an integration test case
 */
export interface IntegTestCaseProps extends TestOptions {
  /**
   * Stacks to be deployed during the test
   */
  readonly stacks: Stack[];
}

/**
 * An integration test case. Allows the definition of test properties that
 * apply to all stacks under this case.
 */
export class IntegTestCase extends Construct {
  constructor(scope: Construct, id: string, props: IntegTestCaseProps) {
    super(scope, id);

    attachCustomSynthesis(this, {
      onSynthesize: (session: ISynthesisSession) => {
        const snapshotDir = session.assembly.outdir;
        const manifest: IntegManifest = {
          version: '',
          testCases: { [id]: toTestCase(props) },
        };

        IntegManifestWriter.write(manifest, snapshotDir);
      },
    });
  }
}

function toTestCase(props: IntegTestCaseProps): TestCase {
  return {
    ...props,
    stacks: props.stacks.map(s => s.artifactId),
  };
}
