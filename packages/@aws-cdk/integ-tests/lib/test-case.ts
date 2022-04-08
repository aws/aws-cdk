import * as path from 'path';
import { IntegManifest, TestCase } from '@aws-cdk/cloud-assembly-schema';
import { attachCustomSynthesis, ISynthesisSession, Stack, StackProps } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { IntegManifestWriter } from './manifest-writer';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export interface IntegTestCaseProps extends StackProps, TestCase {
  testFileName: string;
}

// TODO Find a better name for this class
class IntegTestCaseConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IntegTestCaseProps) {
    super(scope, id);

    attachCustomSynthesis(this, {
      onSynthesize: (_session: ISynthesisSession) => {

        // TODO This code snippet is duplicated from integ-runner. Consider refactoring
        const parsed = path.parse(props.testFileName);
        const directory = parsed.dir;
        const testName = parsed.name.slice(6);
        const snapshotDir = path.join(directory, `${testName}.integ.snapshot`);

        const { testFileName, ...testCase } = props;
        const manifest: IntegManifest = {
          version: '',
          testCases: { [id]: testCase },
        };

        fs.ensureDirSync(snapshotDir);
        IntegManifestWriter.write(manifest, snapshotDir);
      },
    });
  }
}

export class IntegTestCase extends Stack {
  constructor(scope: Construct, id: string, props: IntegTestCaseProps) {
    super(scope, id, props);

    new IntegTestCaseConstruct(this, 'integ', props);
  }
}