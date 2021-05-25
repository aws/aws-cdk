import { findModulePaths, moduleStability } from '../module';
import * as path from 'path';

const repoRoot = path.join(__dirname, '..', '..', '..');

describe('findModulePaths', () => {
  test('single match', () => {
    expect(relative(findModulePaths('lambda'))).toEqual(['packages/@aws-cdk/aws-lambda']);
    expect(relative(findModulePaths('s3'))).toEqual(['packages/@aws-cdk/aws-s3']);
    expect(relative(findModulePaths('cdk-build-tools'))).toEqual(['tools/cdk-build-tools']);
  });

  test('multiple matches', () => {
    expect(relative(findModulePaths('assert'))).toEqual([
      'packages/@aws-cdk/assert',
      'packages/@monocdk-experiment/assert'
    ]);

    expect(relative(findModulePaths('cdk'))).toEqual([
      'packages/aws-cdk',
      'packages/cdk',
      'tools/eslint-plugin-cdk'
    ]);
  })

  function relative(paths: string[]): string[] {
    return paths.map(p => path.relative(repoRoot, p));
  }
});

describe('moduleStability', () => {
  test('default', () => {
    expect(moduleStability(absolute('packages/@aws-cdk/aws-lambda'))).toEqual('stable');
    expect(moduleStability(absolute('packages/@aws-cdk/aws-s3'))).toEqual('stable');

    expect(moduleStability(absolute('packages/@aws-cdk/aws-apigatewayv2'))).toEqual('experimental');
    expect(moduleStability(absolute('packages/@aws-cdk/assert'))).toEqual('experimental');

    expect(moduleStability(absolute('tools/cdk-build-tools'))).toBeUndefined();
  });

  function absolute(loc: string) {
    return path.join(repoRoot, loc);
  }
})