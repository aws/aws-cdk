import * as fs from 'fs';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as dependencies from '../lib/dependencies';

jest.mock('@aws-cdk/aws-lambda');
const existsSyncOriginal = fs.existsSync;
const existsSyncMock = jest.spyOn(fs, 'existsSync');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Dependency detection', () => {
  test('Detects pipenv', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => {
      if (/Pipfile/.test(p.toString())) {
        return true;
      }
      return existsSyncOriginal(p);
    });

    expect(dependencies.hasDependencies('/asset-input')).toEqual(true);
    expect(dependencies.getDependenciesType('/asset-input')).toEqual(dependencies.DependencyType.PIPENV);
  });

  test('Detects requirements.txt', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => {
      if (/requirements.txt/.test(p.toString())) {
        return true;
      }
      return existsSyncOriginal(p);
    });

    expect(dependencies.hasDependencies('/asset-input')).toEqual(true);
    expect(dependencies.getDependenciesType('/asset-input')).toEqual(dependencies.DependencyType.REQUIREMENTS);
  });

  test('No known dependencies', () => {
    existsSyncMock.mockImplementation(() => false);
    expect(dependencies.hasDependencies('/asset-input')).toEqual(false);
    expect(dependencies.getDependenciesType('/asset-input')).toEqual(dependencies.DependencyType.NONE);
  });
});

describe('Dependency installation commands', () => {
  const entry = '/asset-input';
  const runtime = Runtime.PYTHON_3_8;
  const outputPath = '/asset-output';

  test('Pipenv commands are run for pipenv dependencies', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => /Pipfile/.test(p.toString()));

    expect(dependencies.installDependenciesCommands({ entry, runtime, outputPath }))
      .toEqual(expect.arrayContaining([ expect.stringContaining('pipenv') ]));
  });

  test('Pip commands are run for requirements.txt dependencies', () => {
    existsSyncMock.mockImplementation((p: fs.PathLike) => /requirements.txt/.test(p.toString()));

    expect(dependencies.installDependenciesCommands({ entry, runtime, outputPath }))
      .toEqual(expect.arrayContaining([ expect.stringContaining('install -r requirements.txt') ]));
  });
});
