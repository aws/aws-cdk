import * as path from 'path';
import * as fs from 'fs-extra';
import { cliMain } from '../src/cli-main';
import { Package } from './_package';
import * as util from 'util';

test('validate', async () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'], circular: true });
  const dep1 = pkg.addDependency({ name: 'dep1', licenses: ['INVALID'] });
  const dep2 = pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0', 'MIT'] });

  pkg.write();
  pkg.install();

  try {
    const command = [
      '--entrypoint', pkg.entrypoint,
      '--resource', 'missing:bin/missing',
      '--allowed-license', 'Apache-2.0',
      'validate',
    ];
    await runCliMain(pkg.dir, command);
  } catch (e: any) {
    const violations = new Set(e.message.trim().split('\n').filter((l: string) => l.startsWith('-')));
    const expected = new Set([
      `- invalid-license: Dependency ${dep1.name}@${dep1.version} has an invalid license: UNKNOWN`,
      `- multiple-license: Dependency ${dep2.name}@${dep2.version} has multiple licenses: Apache-2.0,MIT`,
      '- outdated-attributions: THIRD_PARTY_LICENSES is outdated (fixable)',
      '- missing-resource: Unable to find resource (missing) relative to the package directory',
      '- circular-import: lib/bar.js -> lib/foo.js',
    ]);
    expect(violations).toEqual(expected);
  }

});

test('write', async () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  pkg.write();
  pkg.install();

  const command = [
    '--entrypoint', pkg.entrypoint,
    '--allowed-license', 'Apache-2.0',
    '--allowed-license', 'MIT',
    'write',
  ];
  const bundleDir = await runCliMain(pkg.dir, command);

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

test('validate and fix', async () => {

  const pkg = Package.create({ name: 'consumer', licenses: ['Apache-2.0'] });
  pkg.addDependency({ name: 'dep1', licenses: ['MIT'] });
  pkg.addDependency({ name: 'dep2', licenses: ['Apache-2.0'] });

  pkg.write();
  pkg.install();

  const run = (sub: string[]) => {
    const command = [
      '--entrypoint', pkg.entrypoint,
      '--allowed-license', 'Apache-2.0',
      '--allowed-license', 'MIT',
      ...sub,
    ];
    return runCliMain(pkg.dir, command);
  };

  try {
    await run(['pack']);
    throw new Error('Expected packing to fail before fixing');
  } catch {
    // this should fix the fact we don't generate
    // the project with the correct attributions
    await run(['validate', '--fix']);
  }

  await run(['pack']);
  const tarball = path.join(pkg.dir, `${pkg.name}-${pkg.version}.tgz`);
  expect(fs.existsSync(tarball)).toBeTruthy();

});

test('pack', async () => {

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

  const command = [
    '--entrypoint', pkg.entrypoint,
    '--allowed-license', 'Apache-2.0',
    '--allowed-license', 'MIT',
    'pack',
  ];
  await runCliMain(pkg.dir, command);

  const tarball = path.join(pkg.dir, `${pkg.name}-${pkg.version}.tgz`);
  expect(fs.existsSync(tarball)).toBeTruthy();

});

async function runCliMain(cwd: string, command: string[]): Promise<string> {
  const log: string[] = []
  const spy = jest
    .spyOn(console, 'log')
    .mockImplementation((...args) => {
      log.push(util.format(...args));
    });

  const curdir = process.cwd();
  process.chdir(cwd);
  try {
    await cliMain(command);

    return log.join('\n');
  } finally {
    process.chdir(curdir);
    spy.mockRestore();
  }
}