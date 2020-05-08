import * as path from 'path';
import * as util from '../lib/util';

test('findPkgPath', () => {
  expect(util.findPkgPath()).toBe(path.join(__dirname, '..'));
});

test('findGitPath', () => {
  expect(util.findGitPath()).toBe(path.join(__dirname, '../../../..'));
});
