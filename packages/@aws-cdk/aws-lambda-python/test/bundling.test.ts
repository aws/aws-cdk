import * as fs from 'fs';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { bundle } from '../lib/bundling';

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
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -r . /asset-output',
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
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'pip3 install -r requirements.txt -t /asset-output && rsync -r . /asset-output',
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
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith('/project/folder', {
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'pip install -r requirements.txt -t /asset-output && rsync -r . /asset-output',
      ],
    }),
  });
});
