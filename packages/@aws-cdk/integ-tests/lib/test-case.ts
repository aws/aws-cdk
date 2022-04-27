import { IntegManifest, Manifest, TestCase, TestOptions } from '@aws-cdk/cloud-assembly-schema';
import { attachCustomSynthesis, Stack, ISynthesisSession } from '@aws-cdk/core';
import { IntegManifestSynthesizer } from './manifest-synthesizer';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
  constructor(scope: Construct, private readonly id: string, private readonly props: IntegTestCaseProps) {
    super(scope, id);
  }

  /**
   * The integration test manifest for this test case. Manifests are used
   * by the integration test runner.
   */
  get manifest(): IntegManifest {
    return {
      version: Manifest.version(),
      testCases: { [this.id]: toTestCase(this.props) },
    };
  }
}

/**
 * Integration test properties
 */
export interface IntegTestProps {
  /**
   * List of test cases that make up this test
   */
  readonly testCases: IntegTestCase[];
}

/**
 * A collection of test cases. Each test case file should contain exactly one
 * instance of this class.
 */
export class IntegTest extends Construct {
  constructor(scope: Construct, id: string, private readonly props: IntegTestProps) {
    super(scope, id);
  }

  protected onPrepare(): void {
    attachCustomSynthesis(this, {
      onSynthesize: (session: ISynthesisSession) => {
        const synthesizer = new IntegManifestSynthesizer(this.props.testCases);
        synthesizer.synthesize(session);
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
