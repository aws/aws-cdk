import { findModulePath, moduleStability } from '../module';
import * as path from 'path';

const repoRoot = path.join(__dirname, '..', '..', '..', '..');

describe('findModulePath', () => {
  beforeAll(() => {
    process.env.REPO_ROOT = repoRoot;
  });

  afterAll(() => {
    process.env.REPO_ROOT = undefined;
  });

  test('single fuzzy match', () => {
    expect(relative(findModulePath('lambda'))).toEqual('packages/@aws-cdk/aws-lambda');
    expect(relative(findModulePath('s3'))).toEqual('packages/@aws-cdk/aws-s3');
    expect(relative(findModulePath('cdk-build-tools'))).toEqual('tools/@aws-cdk/cdk-build-tools');
  });

  test('multiple fuzzy matches', () => {
    // also matches 'packages/aws-cdk' and 'tools/eslint-plugin-cdk'
    expect(relative(findModulePath('cdk'))).toEqual('packages/cdk');
  });

  test('no matches', () => {
    expect(() => findModulePath('doesnotexist')).toThrow(/No module/);
  });

  function relative(loc: string) {
    return path.relative(repoRoot, loc);
  }
});

describe('moduleStability', () => {
  test('happy', () => {
    expect(moduleStability(absolute('packages/@aws-cdk/aws-lambda'))).toEqual('stable');
    expect(moduleStability(absolute('packages/@aws-cdk/aws-s3'))).toEqual('stable');

    // The list of experimental modules is constantly changing. Comment out the assertion.
    // expect(moduleStability(absolute('packages/@aws-cdk/aws-apigatewayv2'))).toEqual('experimental');

    expect(moduleStability(absolute('tools/@aws-cdk/cdk-build-tools'))).toBeUndefined();
  });

  test('error', () => {
    expect(() => moduleStability(absolute('tools'))).toThrow(/no package.json found/);
  });

  function absolute(loc: string) {
    return path.join(repoRoot, loc);
  }
})
