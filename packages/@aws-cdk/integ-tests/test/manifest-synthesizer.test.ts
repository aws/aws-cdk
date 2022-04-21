import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { App, Stack } from '@aws-cdk/core';
import { CloudAssemblyBuilder } from '@aws-cdk/cx-api';
import { IntegTestCase } from '../lib';
import { IntegManifestSynthesizer } from '../lib/manifest-synthesizer';
import { IntegManifestWriter } from '../lib/manifest-writer';

describe(IntegManifestSynthesizer, () => {
  it('synthesizes a multiple manifests', () => {
    const write = jest.spyOn(IntegManifestWriter, 'write');

    const app = new App();
    const stack = new Stack(app, 'stack');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
    const assembly = new CloudAssemblyBuilder(tmpDir);

    const synthesizer = new IntegManifestSynthesizer([
      new IntegTestCase(stack, 'case1', {
        stacks: [new Stack(app, 'stack-under-test-1')],
      }),
      new IntegTestCase(stack, 'case2', {
        stacks: [new Stack(app, 'stack-under-test-2')],
      }),
    ]);

    synthesizer.synthesize({
      assembly,
      outdir: 'asdas',
    });

    expect(write).toHaveBeenCalledWith({
      version: '17.0.0',
      testCases: {
        case1: {
          stacks: ['stack-under-test-1'],
        },
        case2: {
          stacks: ['stack-under-test-2'],
        },
      },
    }, tmpDir);
  });
});