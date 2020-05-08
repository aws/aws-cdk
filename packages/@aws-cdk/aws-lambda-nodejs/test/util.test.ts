import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from '../lib/util';

test('findPkgPath', () => {
  expect(util.findPkgPath()).toBe(path.join(__dirname, '..'));
});

test('findGitPath', () => {
  expect(util.findGitPath()).toBe(path.join(__dirname, '../../../..'));
});

test('rmdirRecursive', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dir'));
  fs.mkdirSync(path.join(dir, 'level1'));
  fs.mkdirSync(path.join(dir, 'level1', 'level2'));
  fs.writeFileSync(path.join(dir, 'level1', 'level2', 'test.txt'), 'TEST');
  util.rmdirRecursive(dir);
  expect(fs.existsSync(dir)).toBe(false);
});
