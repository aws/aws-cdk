import * as fs from 'fs';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType } from '@aws-cdk/core';
import { bundle, bundleDependencies } from '../lib/bundling';

jest.mock('@aws-cdk/aws-lambda');
const existsSyncOriginal = fs.existsSync;
const existsSyncMock = jest.spyOn(fs, 'existsSync');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Bundling', () => {
  bundle({
    entry: '/project/folder',
    runtime: Runtime.PYTHON_3_7,
    installDependencies: true,
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    assetHashType: AssetHashType.BUNDLE,
    exclude: ['*.pyc'],
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'cp -au . /asset-output',
      ],
    }),
  });

  // Searches for requirements.txt in entry
  expect(existsSyncMock).toHaveBeenCalledWith('/project/folder/requirements.txt');
});

test('Bundling with requirements.txt installed', () => {
  existsSyncMock.mockImplementation((p: fs.PathLike) => {
    if (/requirements.txt/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  bundle({
    entry: '/project/folder',
    runtime: Runtime.PYTHON_3_7,
    installDependencies: true,
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    assetHashType: AssetHashType.BUNDLE,
    exclude: ['*.pyc'],
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'pip3 install -r requirements.txt -t /asset-output && cp -au . /asset-output',
      ],
    }),
  });
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  existsSyncMock.mockImplementation((p: fs.PathLike) => {
    if (/requirements.txt/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  bundle({
    entry: '/project/folder',
    runtime: Runtime.PYTHON_2_7,
    installDependencies: true,
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    assetHashType: AssetHashType.BUNDLE,
    exclude: ['*.pyc'],
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output',
      ],
    }),
  });
});

test('Bundling can dependencies can be switched off', () => {
  existsSyncMock.mockImplementation((p: fs.PathLike) => {
    if (/requirements.txt/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  bundle({
    entry: '/project/folder',
    runtime: Runtime.PYTHON_3_7,
    installDependencies: false,
  });

  // Does not install dependencies when instructed not to.
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    assetHashType: AssetHashType.BUNDLE,
    exclude: ['*.pyc'],
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'cp -au . /asset-output',
      ],
    }),
  });
});

test('Bundling dependencies for a lambda layer', () => {

  bundleDependencies({
    entry: '/project/folder',
    runtime: Runtime.PYTHON_3_7,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    assetHashType: AssetHashType.BUNDLE,
    exclude: ['*.pyc'],
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'pip3 install -r requirements.txt -t /asset-output/python',
      ],
    }),
  });
});
