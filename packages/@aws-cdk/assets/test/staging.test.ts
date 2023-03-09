import * as fs from 'fs';
import * as path from 'path';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Staging } from '../lib';

describeDeprecated('staging', () => {
  test('base case', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    expect(staging.assetHash).toEqual('2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    expect(staging.sourcePath).toEqual(sourcePath);
    expect(staging.relativeStagedPath(stack)).toEqual('asset.2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
  });

  test('staging can be disabled through context', () => {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
    const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const staging = new Staging(stack, 's1', { sourcePath });

    expect(staging.assetHash).toEqual('2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    expect(staging.sourcePath).toEqual(sourcePath);
    expect(staging.absoluteStagedPath).toEqual(sourcePath);
  });

  test('files are copied to the output directory during synth', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
    const file = path.join(__dirname, 'fs', 'fixtures.tar.gz');

    // WHEN
    new Staging(stack, 's1', { sourcePath: directory });
    new Staging(stack, 'file', { sourcePath: file });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00',
      'asset.af10ac04b3b607b0f8659c8f0cee8c343025ee75baf0b146f10f0e5311d2c46b.tar.gz',
      'cdk.out',
      'manifest.json',
      'stack.template.json',
      'tree.json',
    ]);
  });

  test('allow specifying extra data to include in the source hash', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    const withoutExtra = new Staging(stack, 'withoutExtra', { sourcePath: directory });
    const withExtra = new Staging(stack, 'withExtra', { sourcePath: directory, extraHash: 'boom' });

    // THEN
    expect(withoutExtra.assetHash).not.toEqual(withExtra.assetHash);
    expect(withoutExtra.assetHash).toEqual('2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00');
    expect(withExtra.assetHash).toEqual('c95c915a5722bb9019e2c725d11868e5a619b55f36172f76bcbcaa8bb2d10c5f');
  });
});
