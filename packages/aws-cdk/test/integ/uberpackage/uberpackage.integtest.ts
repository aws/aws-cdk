import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import { withAwsCdkLib, withMonolithicCfnIncludeCdkApp } from '../helpers/cdk';
import { integTest } from '../helpers/test-helpers';

jest.setTimeout(600_000);

describe('uberpackage', () => {
  integTest('works with cloudformation-include', withMonolithicCfnIncludeCdkApp(async (fixture) => {
    fixture.log('Starting test of cfn-include with monolithic CDK');

    //await fixture.cdkSynth();
  })),
  integTest('only the expected modules are included in aws-cdk-lib', withAwsCdkLib(async (fixture) => {
    fixture.log('Starting test of aws-cdk-lib content');
    const root = findWorkspacePath();
    const repoModules = new Set<string>();
    const uberPackageModules = new Set<string>();
    const modulesDir = path.join(root, 'packages', '@aws-cdk');

    for (const dir of await fs.readdir(modulesDir)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pkgJson: PackageJson = require(path.join(modulesDir, dir, 'package.json'));
      if (expectedInMonoPackage(pkgJson)) {
        // add just the module name without the @aws-cdk prefix
        repoModules.add(pkgJson.name.split('/')[1]);
      }
    }

    const distAwsCdkLib = path.join(fixture.integTestDir, 'node_modules', 'aws-cdk-lib', 'lib');
    // check the node_modules of the integtest dir for the aws-cdk-lib lib dir
    for (const dir of await fs.readdir(distAwsCdkLib)) {
      if ((await fs.stat(path.join(distAwsCdkLib, dir))).isDirectory()) {
        uberPackageModules.add(dir);
      }
    }

    expect(uberPackageModules).toEqual(repoModules);

  })),
  integTest('in aws-cdk-lib experimental modules only include L1', withAwsCdkLib(async (fixture) => {
    fixture.log('Starting test of experimental L2 removal from aws-cdk-lib');
    const root = findWorkspacePath();
    const repoExpModules = new Set<string>();
    const modulesDir = path.join(root, 'packages', '@aws-cdk');
    const uberPackageFaults = new Set<string>();

    for (const dir of await fs.readdir(modulesDir)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pkgJson: PackageJson = require(path.join(modulesDir, dir, 'package.json'));

      if (expectedInMonoPackage(pkgJson) && pkgJson.stability === 'experimental') {
        repoExpModules.add(pkgJson.name.split('/')[1]);
      }
    }

    // for every experimental module in the repo, verify that only its L1 is included in aws-cdk-lib
    const distAwsCdkLib = path.join(fixture.integTestDir, 'node_modules', 'aws-cdk-lib', 'lib');
    for (const pkg of repoExpModules) {
      const files = glob.sync(path.join(distAwsCdkLib, pkg, '/**/*'), {
        nodir: true,
      });
      files.forEach(f => {
        // if we found a file that is not allowed in an L1, add the package to the fault list
        if (!isAllowedFile(f)) {
          uberPackageFaults.add(pkg);
          return;
        }
      });
    }

    expect(uberPackageFaults).toEqual(new Set());

    function isAllowedFile(file: string): boolean {
      if (GENERATED_SUFFIX_REGEX.test(file)) {
        return true;
      }
      return ALLOWED_FILES.includes(file);
    }
  }));
});

interface PackageJson {
  stability: string
  name: string;
  ubergen: {
    exclude: boolean,
    deprecated: boolean,
  },
  jsii: {},
  deprecated: string
}

const GENERATED_SUFFIX_REGEX = new RegExp(/generated\.(js|ts|d\.ts)$/);
const ALLOWED_FILES = ['.jsiirc.json', 'index.ts', 'index.js', 'index.d.ts'];

/**
 * According to ubergen logic, is the package expected to be in the monolithic package
 */
function expectedInMonoPackage(pkgJson: PackageJson) {
  if (pkgJson.ubergen?.exclude) {
    return false;
  } else if (pkgJson.jsii == null) {
    return false;;
  } else if (pkgJson.deprecated) {
    return false;;
  }
  return true;
}
/**
 * Find the workspace root path. Walk up the directory tree until you find lerna.json
 */
function findWorkspacePath(): string {

  return _findRootPath(process.cwd());

  function _findRootPath(part: string): string {
    if (process.cwd() === os.homedir()) {
      throw new Error('couldn\'t find a \'lerna.json\' file when walking up the directory tree, are you in a aws-cdk project?');
    }

    if (fs.existsSync(path.resolve(part, 'lerna.json'))) {
      return part;
    }

    return _findRootPath(path.resolve(part, '..'));
  }
}
