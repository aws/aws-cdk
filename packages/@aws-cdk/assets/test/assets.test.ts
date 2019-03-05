import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib';

const SAMPLE_ASSET_DIRECTORY = path.join(__dirname, 'fixtures', 'test1');

test('file assets', () => {
  // GIVEN
  const app = new cdk.App({
    context: {
      [cxapi.DISABLE_STACK_TRACE]: 'true',
      [cxapi.DISABLE_VERSION_REPORTING]: 'true'
    }
  });
  const stack = new cdk.Stack(app, 'stack1');

  // WHEN
  new FileAsset(stack, 'my-first-modern-file-asset', {
    path: path.join(SAMPLE_ASSET_DIRECTORY, 'file1.txt')
  });

  // THEN
  const session = app.run();
  expect(snapshotDirectory(session.path)).toMatchSnapshot();
});

test('zip directory assets', () => {
  // GIVEN
  const app = new cdk.App({ context: { [cxapi.DISABLE_STACK_TRACE]: 'true' } });
  const stack = new cdk.Stack(app, 'stack1');

  // WHEN
  new ZipDirectoryAsset(stack, 'my-first-zip-dir-asset', {
    path: SAMPLE_ASSET_DIRECTORY
  });

  // THEN
  expect(snapshotDirectory(app.run().path)).toMatchSnapshot();
});

test('two assets with the same source will result in a single artifact', () => {
  // GIVEN
  const app = new cdk.App({ context: { [cxapi.DISABLE_STACK_TRACE]: 'true' } });
  const stack = new cdk.Stack(app, 'stack1');

  // WHEN
  new ZipDirectoryAsset(stack, 'asset1', { path: SAMPLE_ASSET_DIRECTORY });
  new ZipDirectoryAsset(stack, 'asset2', { path: SAMPLE_ASSET_DIRECTORY });

  // THEN
  expect(snapshotDirectory(app.run().path)).toMatchSnapshot();
});

function snapshotDirectory(dir: string) {
  const entries: { [name: string]: any } = { };
  for (const file of fs.readdirSync(dir)) {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) {
      entries[file] = snapshotDirectory(fp);
    } else if (path.extname(file) === '.json') {
      entries[file] = JSON.parse(fs.readFileSync(fp).toString());
    } else {
      entries[file] = fs.readFileSync(fp).toString().trim();
    }
  }
  return entries;
}