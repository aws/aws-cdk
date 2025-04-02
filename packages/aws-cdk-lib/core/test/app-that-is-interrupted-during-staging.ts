/**
 * This is a CDK app that is guaranteed to kill itself during bundling
 */
import * as path from 'path';
import { App, AssetStaging, DockerImage, Stack } from '../lib';

const app = new App();
const stack = new Stack(app, 'stack');
const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');

const pid = process.pid;

// WHEN
new AssetStaging(stack, 'Asset', {
  sourcePath: directory,
  bundling: {
    image: DockerImage.fromRegistry('alpine'),
    command: ['DOCKER_STUB_EXEC', 'kill', `${pid}`],
  },
});

app.synth();
