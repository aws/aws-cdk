import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { Staging } from '../lib';

export = {
  'base case'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    test.deepEqual(staging.sourceHash, '7ee2394b37e9721efb4f8c86c8818c37816e3f5126ded36d980bb2ef4103c594');
    test.deepEqual(staging.sourcePath, sourcePath);
    test.deepEqual(stack.resolve(staging.stagedPath), 'asset.7ee2394b37e9721efb4f8c86c8818c37816e3f5126ded36d980bb2ef4103c594');
    test.done();
  },

  'staging can be disabled through context'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    test.deepEqual(staging.sourceHash, '7ee2394b37e9721efb4f8c86c8818c37816e3f5126ded36d980bb2ef4103c594');
    test.deepEqual(staging.sourcePath, sourcePath);
    test.deepEqual(stack.resolve(staging.stagedPath), sourcePath);
    test.done();
  },

  'files are copied to the output directory during synth'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
    const file = path.join(__dirname, 'fs', 'fixtures.tar.gz');

    // WHEN
    new Staging(stack, 's1', { sourcePath: directory });
    new Staging(stack, 'file', { sourcePath: file });

    // THEN
    const assembly = app.synth();
    test.deepEqual(fs.readdirSync(assembly.directory), [
      'asset.0d3b44cd2202f06ede070775a83958085330d8b3cd56b990b381834099cb5854.gz',
      'asset.7ee2394b37e9721efb4f8c86c8818c37816e3f5126ded36d980bb2ef4103c594',
      'cdk.out',
      'manifest.json',
      'stack.template.json',
      'tree.json',
    ]);
    test.done();
  },

  'allow specifying extra data to include in the source hash'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const withoutExtra = new Staging(stack, 'withoutExtra', { sourcePath: directory });
    const withExtra = new Staging(stack, 'withExtra', { sourcePath: directory, extraHash: 'boom' });

    // THEN
    test.notEqual(withoutExtra.sourceHash, withExtra.sourceHash);
    test.deepEqual(withoutExtra.sourceHash, '7ee2394b37e9721efb4f8c86c8818c37816e3f5126ded36d980bb2ef4103c594');
    test.deepEqual(withExtra.sourceHash, 'a35af8e7b62048d35f6928e9445ef2cac507cd0d065c5b36b2d55480bdbc4609');
    test.done();
  }
};
