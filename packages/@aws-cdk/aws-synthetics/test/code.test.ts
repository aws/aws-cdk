import '@aws-cdk/assert/jest';
import * as path from 'path';
import { App, Stack } from '@aws-cdk/core';
import * as synthetics from '../lib';

let stack: Stack;
let app: App;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'canaries');
});

describe('Code.fromInline', () => {
  test('basic use case', () => {
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
      }),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'index.handler',
        Script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
      },
    });
  });

  test('fails if size exceeds 460800 bytes', () => {
    expect(() => new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(generateRandomString(460801)),
      }),
    }))
      .toThrowError('Canary source is too large, must be <= 460800 but is 460801');
  });

  test('fails if empty', () => {
    expect(() => new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(''),
      }),
    }))
      .toThrowError('Canary inline code cannot be empty');
  });
});

describe('Code.fromAsset', () => {
  test('basic use case', () => {
    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Synthetics::Canary', {
      Code: {
        Handler: 'canary.handler',
        S3Bucket: stack.resolve(directoryAsset.bind(stack, 'canary.handler').s3Location?.bucketName),
        S3Key: stack.resolve(directoryAsset.bind(stack, 'canary.handler').s3Location?.objectKey),
      },
    });
  });

  test('only one Asset object gets created even if multiple canaries use the same AssetCode', () => {
    // WHEN
    const directoryAsset = synthetics.Code.fromAsset(path.join(__dirname, 'canaries'));
    new synthetics.Canary(stack, 'Canary1', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
    });
    new synthetics.Canary(stack, 'Canary2', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: directoryAsset,
      }),
    });

    // THEN
    const assembly = app.synth();
    const synthesized = assembly.stacks[0];

    expect(synthesized.assets.length).toEqual(1);
  });

  test('fails if non-zip asset is used', () => {
    expect(() => new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries', 'nodejs', 'node_modules', 'canary.js')),
      }),
    }))
      .toThrowError(`Asset must be a .zip file or a directory (${path.join(__dirname, 'canaries', 'nodejs', 'node_modules', 'canary.js')})`);
  });

  test(`fails if \'nodejs${path.sep}node_modules\' folder structure not used`, () => {
    expect(() => new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries', 'nodejs', 'node_modules')),
      }),
    }))
      .toThrowError(`The canary resource requires that the directory contains nodejs${path.sep}node_modules${path.sep}<filename> and that <filename> matches the handler (canary.js)`);
  });
});

function generateRandomString(bytes: number) {
  let s = '';
  for (let i = 0; i < bytes; ++i) {
    s += String.fromCharCode(Math.round(Math.random() * 256));
  }
  return s;
}