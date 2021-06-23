import * as fs from 'fs';
import * as path from 'path';
import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { Staging } from '../lib';

export = {
  'base case'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    test.deepEqual(staging.assetHash, '2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    test.deepEqual(staging.sourcePath, sourcePath);
    test.deepEqual(staging.relativeStagedPath(stack), 'asset.2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    test.done();
  },

  'staging can be disabled through context'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    test.deepEqual(staging.assetHash, '2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    test.deepEqual(staging.sourcePath, sourcePath);
    test.deepEqual(staging.absoluteStagedPath, sourcePath);
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
      'asset.2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00',
      'asset.af10ac04b3b607b0f8659c8f0cee8c343025ee75baf0b146f10f0e5311d2c46b.gz',
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
    test.notEqual(withoutExtra.assetHash, withExtra.assetHash);
    test.deepEqual(withoutExtra.assetHash, '2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    test.deepEqual(withExtra.assetHash, 'c95c915a5722bb9019e2c725d11868e5a619b55f36172f76bcbcaa8bb2d10c5f');
    test.done();
  },
};
