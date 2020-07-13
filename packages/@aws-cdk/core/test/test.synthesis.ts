import * as fs from 'fs';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import * as cdk from '../lib';

function createModernApp() {
  return new cdk.App({
    context: {
      [cxapi.DISABLE_VERSION_REPORTING]: 'true', // for test reproducibility
    },
  });
}

export = {
  'synthesis with an empty app'(test: Test) {
    // GIVEN
    const app = createModernApp();

    // WHEN
    const session = app.synth();

    // THEN
    test.same(app.synth(), session); // same session if we synth() again
    test.deepEqual(list(session.directory), [ 'cdk.out', 'manifest.json', 'tree.json' ]);
    test.deepEqual(readJson(session.directory, 'manifest.json').artifacts, {
      Tree: {
        type: 'cdk:tree',
        properties: { file: 'tree.json' },
      },
    });
    test.deepEqual(readJson(session.directory, 'tree.json'), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: {
          Tree: { id: 'Tree', path: 'Tree' },
        },
      },
    });
    test.done();
  },

  'synthesis respects disabling tree metadata'(test: Test) {
    const app = new cdk.App({
      treeMetadata: false,
    });
    const assembly = app.synth();
    test.deepEqual(list(assembly.directory), [ 'cdk.out', 'manifest.json' ]);
    test.done();
  },

  'single empty stack'(test: Test) {
    // GIVEN
    const app = createModernApp();
    new cdk.Stack(app, 'one-stack');

    // WHEN
    const session = app.synth();

    // THEN
    test.ok(list(session.directory).includes('one-stack.template.json'));
    test.done();
  },

};

function list(outdir: string) {
  return fs.readdirSync(outdir).sort();
}

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
