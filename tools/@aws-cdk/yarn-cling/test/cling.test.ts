import * as path from 'path';
import { checkRequiredVersions, generateShrinkwrap } from '../lib';

test('generate lock for fixture directory', async () => {
  const lockFile = await generateShrinkwrap({
    packageJsonFile: path.join(__dirname, 'test-fixture', 'jsii', 'package.json'),
    hoist: false,
  });

  expect(lockFile).toEqual({
    lockfileVersion: 1,
    name: 'jsii',
    requires: true,
    version: '1.1.1',
    dependencies: {
      'cdk': {
        version: '2.2.2',
      },
      'aws-cdk': {
        dependencies: {
          'aws-cdk-lib': {
            integrity: 'sha512-pineapple',
            resolved: 'https://registry.bla.com/stuff',
            version: '2.3.999',
          },
        },
        integrity: 'sha512-banana',
        requires: {
          'aws-cdk-lib': '^2.3.4',
        },
        resolved: 'https://registry.bla.com/stuff',
        version: '1.2.999',
      },
    },
  });
});

test('generate hoisted lock for fixture directory', async () => {
  const lockFile = await generateShrinkwrap({
    packageJsonFile: path.join(__dirname, 'test-fixture', 'jsii', 'package.json'),
    hoist: true,
  });

  expect(lockFile).toEqual({
    lockfileVersion: 1,
    name: 'jsii',
    requires: true,
    version: '1.1.1',
    dependencies: {
      'cdk': {
        version: '2.2.2',
      },
      'aws-cdk': {
        integrity: 'sha512-banana',
        requires: {
          'aws-cdk-lib': '^2.3.4',
        },
        resolved: 'https://registry.bla.com/stuff',
        version: '1.2.999',
      },
      'aws-cdk-lib': {
        integrity: 'sha512-pineapple',
        resolved: 'https://registry.bla.com/stuff',
        version: '2.3.999',
      },
    },
  });
});

test('fail when requires cannot be satisfied', async () => {
  const lockFile = {
    lockfileVersion: 1,
    name: 'jsii',
    requires: true,
    version: '1.1.1',
    dependencies: {
      jsii: {
        version: '2.2.2',
        requires: {
          cdk: '^3.3.3', // <- this needs to be adjusted
        },
      },
      cdk: {
        version: '4.4.4',
      },
    },
  };

  expect(() => checkRequiredVersions(lockFile)).toThrow(/This can never/);
});
