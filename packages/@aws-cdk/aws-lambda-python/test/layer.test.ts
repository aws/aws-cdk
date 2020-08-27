import * as fs from 'fs';
import * as path from 'path';
import { Stack, App } from '@aws-cdk/core';
import { PythonLayerVersion, BundlingStrategy } from '../lib/layer';

// Path to a file containing the commandline that docker stub receives
const DOCKER_STUB_INPUT = '/tmp/docker-stub.input';
// The image id that the docker stub emits when building
const DOCKER_STUB_IMAGE_ID = '1234567890abcdef';

// Reads a docker stub and cleans the volume paths out of the stub.
function readAndCleanDockerStubInput() {
  return fs
    .readFileSync(DOCKER_STUB_INPUT, 'utf-8')
    .trim()
    .replace(/-v ([^:]+):\/asset-input/g, '-v /input:/asset-input')
    .replace(/-v ([^:]+):\/asset-output/g, '-v /output:/asset-output')
    .split(/\n/);
}

// this is a way to provide a custom "docker" command for staging.
process.env.CDK_DOCKER = path.join(__dirname, 'docker-stub.sh');

beforeEach(() => {
  // Clean out the docker stub before every test.
  if (fs.existsSync(DOCKER_STUB_INPUT)) {
    fs.unlinkSync(DOCKER_STUB_INPUT);
  }
});

test('bundling a layer from files', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'stack');

  // WHEN
  new PythonLayerVersion(stack, 'layer', {
    entry: path.join(__dirname, 'lambda-handler-project'),
    bundlingStrategy: BundlingStrategy.FILES,
    exclude: [
      '*',
      '!shared',
      '!shared/**',
    ],
  });

  // THEN
  const expectedAsset = 'asset.047a67b3a9eadd5acb42903187d20feef00544ece1fc0d6c0390e582ccaf4272';
  expect(fs.existsSync(path.join(app.outdir, expectedAsset, 'python'))).toBeTruthy();
  expect(fs.readdirSync(path.join(app.outdir, expectedAsset, 'python'))).toEqual([
    'shared',
  ]);
});

test('bundling a layer by building dependencies', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'stack');

  // WHEN
  new PythonLayerVersion(stack, 'layer', {
    entry: path.join(__dirname, 'lambda-handler-project'),
    bundlingStrategy: BundlingStrategy.DEPENDENCIES,
  });

  // THEN
  expect(fs.readdirSync(app.outdir)).toEqual([
    'asset.4c4978c45c8ca21a940eadb88562131ed40c03ea6593f0c60c0d9ce1fe6d10ae',
  ]);

  expect(readAndCleanDockerStubInput()).toEqual([
    // it builds from the layer-bundler image
    expect.stringMatching(/^build.*layer-bundler/),
    // runs the image
    expect.stringMatching(new RegExp(`^run.*${DOCKER_STUB_IMAGE_ID}`)),
  ]);
});


