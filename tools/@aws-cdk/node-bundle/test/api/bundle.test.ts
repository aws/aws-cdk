import * as path from 'path';
import * as fs from 'fs-extra';
import { Bundle } from '../../src';
import { Package } from '../_package';

test('validate', () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'], circular: true });
  const dep1 = pkg.addDependency({ name: 'dep1', licenses: ['INVALID'] });
  const dep2 = pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0', 'MIT'] });

  pkg.write();
  pkg.install();

  const bundle = new Bundle({
    packageDir: pkg.dir,
    entryPoints: [pkg.entrypoint],
    resources: { missing: 'bin/missing' },
    allowedLicenses: ['Apache-2.0'],
  });
  const actual = new Set(bundle.validate().violations.map(v => `${v.type}: ${v.message}`));
  const expected = new Set([
    'circular-import: lib/bar.js -> lib/foo.js',
    'missing-resource: Unable to find resource (missing) relative to the package directory',
    'outdated-attributions: THIRD_PARTY_LICENSES is outdated',
    `invalid-license: Dependency ${dep1.name}@${dep2.version} has an invalid license: UNKNOWN`,
    `multiple-license: Dependency ${dep2.name}@${dep2.version} has multiple licenses: Apache-2.0,MIT`,
  ]);

  expect(actual).toEqual(expected);
});

test('write', () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  pkg.write();
  pkg.install();

  const bundle = new Bundle({
    packageDir: pkg.dir,
    entryPoints: [pkg.entrypoint],
    allowedLicenses: ['Apache-2.0', 'MIT'],
  });

  const bundleDir = bundle.write();

  expect(fs.existsSync(path.join(bundleDir, pkg.entrypoint))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'package.json'))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'THIRD_PARTY_LICENSES'))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'lib', 'foo.js'))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'lib', 'bar.js'))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'node_modules'))).toBeFalsy();
  expect(fs.existsSync(path.join(bundleDir, '.git'))).toBeFalsy();

  const manifest = fs.readJSONSync(path.join(bundleDir, 'package.json'));

  expect(manifest.dependencies).toEqual({});

});

test('pack', () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  const dep1 = pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  const dep2 = pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  const attributions = [
    'The consumer package includes the following third-party software/licensing:',
    '',
    `** ${dep1.name}@${dep1.version} - https://www.npmjs.com/package/${dep1.name}/v/${dep1.version} | MIT`,
    '',
    '----------------',
    '',
    `** ${dep2.name}@${dep2.version} - https://www.npmjs.com/package/${dep2.name}/v/${dep2.version} | Apache-2.0`,
    '',
    '----------------',
    '',
  ];

  pkg.attributions = attributions.join('\n');

  pkg.write();
  pkg.install();

  const bundle = new Bundle({
    packageDir: pkg.dir,
    entryPoints: [pkg.entrypoint],
    allowedLicenses: ['Apache-2.0', 'MIT'],
  });

  bundle.pack();

  const tarball = path.join(pkg.dir, `${pkg.name}-${pkg.version}.tgz`);
  expect(fs.existsSync(tarball)).toBeTruthy();

});

test('validate and fix', () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  pkg.write();
  pkg.install();

  const bundle = new Bundle({
    packageDir: pkg.dir,
    entryPoints: [pkg.entrypoint],
    allowedLicenses: ['Apache-2.0', 'MIT'],
  });

  try {
    bundle.pack();
    throw new Error('Expected packing to fail before fixing');
  } catch {
    // this should fix the fact we don't generate
    // the project with the correct notice
    bundle.validate({ fix: true });
  }

  bundle.pack();
  const tarball = path.join(pkg.dir, `${pkg.name}-${pkg.version}.tgz`);
  expect(fs.existsSync(tarball)).toBeTruthy();

});

test('write ignores only .git and node_modules directories', () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  pkg.write();
  pkg.install();

  const bundle = new Bundle({
    packageDir: pkg.dir,
    entryPoints: [pkg.entrypoint],
    allowedLicenses: ['Apache-2.0', 'MIT'],
  });

  // add a gitignore file to the package - it should be included
  fs.writeFileSync(path.join(pkg.dir, '.gitignore'), 'something');

  // add a silly node_modules_file to the package - it should be included
  fs.writeFileSync(path.join(pkg.dir, 'node_modules_file'), 'something');

  const bundleDir = bundle.write();

  expect(fs.existsSync(path.join(bundleDir, '.gitignore'))).toBeTruthy();
  expect(fs.existsSync(path.join(bundleDir, 'node_modules_file'))).toBeTruthy();

});
