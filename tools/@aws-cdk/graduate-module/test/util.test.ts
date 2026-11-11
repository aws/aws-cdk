import * as path from 'path';
import { moduleSpecifier } from '../lib/util';

const R = path.join(path.sep, 'repo', 'packages', 'aws-cdk-lib');

describe('moduleSpecifier', () => {
  test('computes a relative import from a submodule lib file to a sibling module', () => {
    const from = path.join(R, 'aws-glue', 'lib', 'catalog.ts');
    expect(moduleSpecifier(from, path.join(R, 'aws-ec2'))).toBe('../../aws-ec2');
    expect(moduleSpecifier(from, path.join(R, 'core'))).toBe('../../core');
  });

  test('adds an extra level for nested lib directories', () => {
    const from = path.join(R, 'aws-glue', 'lib', 'jobs', 'job.ts');
    expect(moduleSpecifier(from, path.join(R, 'core'))).toBe('../../../core');
    expect(moduleSpecifier(from, path.join(R, 'core', 'lib', 'helpers-internal')))
      .toBe('../../../core/lib/helpers-internal');
  });

  test('resolves a same-directory target to ./', () => {
    const from = path.join(R, 'aws-glue', 'lib', 'catalog.ts');
    expect(moduleSpecifier(from, path.join(R, 'aws-glue', 'lib', 'glue.generated'))).toBe('./glue.generated');
  });

  test('strips a trailing file extension from the target', () => {
    const from = path.join(R, 'aws-glue', 'lib', 'catalog.ts');
    expect(moduleSpecifier(from, path.join(R, 'aws-glue', 'lib', 'glue.generated.ts'))).toBe('./glue.generated');
  });
});
