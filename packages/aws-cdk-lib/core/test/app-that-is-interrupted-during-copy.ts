/**
 * This is a CDK app that is guaranteed to kill itself while copying an asset into the cloud assembly
 */
import fs from 'fs';
import * as path from 'path';
import { App, AssetStaging, Stack } from '../lib';

// Die right after the first file has been copied, so the copy is left half-done
const copyFileSync = fs.copyFileSync;
fs.copyFileSync = (...args: Parameters<typeof fs.copyFileSync>) => {
  copyFileSync(...args);
  process.kill(process.pid, 'SIGTERM');
  // Signal delivery is asynchronous; make sure we don't get to copy anything else in the meantime
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10_000);
};

const app = new App();
const stack = new Stack(app, 'stack');

new AssetStaging(stack, 'Asset', {
  sourcePath: path.join(__dirname, 'fs', 'fixtures', 'test1'),
});

app.synth();
