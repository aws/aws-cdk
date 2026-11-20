import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { checkPeerDependencies } from '../lib';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'peer-deps-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writePackageJson(pkg: unknown) {
  fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg));
}

function writeDep(name: string, depPkg: unknown) {
  const depDir = path.join(tmpDir, 'node_modules', name);
  fs.mkdirSync(depDir, { recursive: true });
  fs.writeFileSync(path.join(depDir, 'package.json'), JSON.stringify(depPkg));
}

test('passes when no bundled dependencies', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', dependencies: {} });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});

test('passes when bundled dependency has no peer dependencies', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0' });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});

test('passes when peer dependency is satisfied', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: '^2.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});

test('fails when peer dependency is missing', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([
    'foo requires peer bar@>=2.0.0, but test-package does not include it',
  ]);
});

test('fails when peer dependency version is incompatible', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: '^1.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([
    'foo requires peer bar@>=2.0.0, but test-package has ^1.0.0 (min: 1.0.0)',
  ]);
});

test('reports invalid installed range', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: 'not-a-range' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([
    'foo requires peer bar@>=2.0.0, but test-package has invalid range not-a-range',
  ]);
});

test('handles prerelease versions correctly', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: '^2.0.0-alpha.1' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0-alpha.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});

test('throws when package.json not found', () => {
  expect(() => checkPeerDependencies(tmpDir)).toThrow(/package.json not found/);
});

test('skips bundled dependency not in node_modules', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['missing-package'], dependencies: { 'missing-package': '^1.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});

test('reports multiple peer dependency issues', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: '^1.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0', baz: '>=1.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([
    'foo requires peer bar@>=2.0.0, but test-package has ^1.0.0 (min: 1.0.0)',
    'foo requires peer baz@>=1.0.0, but test-package does not include it',
  ]);
});

test('handles bundledDependencies spelling variant', () => {
  writePackageJson({ name: 'test-package', version: '1.0.0', bundledDependencies: ['foo'], dependencies: { foo: '^1.0.0', bar: '^2.0.0' } });
  writeDep('foo', { name: 'foo', version: '1.0.0', peerDependencies: { bar: '>=2.0.0' } });
  expect(checkPeerDependencies(tmpDir)).toEqual([]);
});
