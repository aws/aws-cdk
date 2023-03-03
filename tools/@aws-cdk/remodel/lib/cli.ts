/* eslint-disable no-console */
import * as cp from 'child_process';
import * as path from 'path';
import {
  main as ubergen,
  Config,
  LibraryReference,
  PackageJson as UbgPkgJson,
} from '@aws-cdk/ubergen';
import * as fs from 'fs-extra';
import yargs from 'yargs/yargs';
import { addTypesReference, findIntegFiles, rewriteIntegTestImports, fixUnitTests } from './util';

interface PackageJson extends UbgPkgJson {
  readonly scripts: { [key: string]: string };
}

const exec = (cmd: string, opts?: cp.ExecOptions) => new Promise((ok, ko) => {
  const proc = cp.exec(cmd, opts, (err: cp.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => {
    if (err) {
      return ko(err);
    }

    return ok({ stdout, stderr });
  });

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);
});

export async function main() {
  const args = yargs(process.argv.slice(2))
    .command('$0 [REPO_ROOT]', 'Magically restructure cdk repository', argv =>
      argv
        .positional('REPO_ROOT', {
          type: 'string',
          desc: 'The root of the cdk repo to be magicked',
          default: '.',
          normalize: true,
        })
        .option('dry-run', {
          type: 'boolean',
          default: false,
          desc: 'don\'t replace files in working directory',
          defaultDescription: 'replace files in working directory, will delete old package files and directories in favor of new structure.',
        })
        .option('clean', {
          type: 'boolean',
          default: true,
          desc: 'remove intermediary directory with new structure, negate with --no-clean',
        })
        .option('tmp-dir', {
          type: 'string',
          desc: 'temporary intermediate directory, removed unless --no-clean is specified',
        })
        .option('full-build', {
          type: 'boolean',
          default: true,
          desc: 'do a full build (remove existing directory and start over)',
        }),
    ).argv;

  const { 'tmp-dir': tmpDir, REPO_ROOT: repoRoot, clean, 'full-build': fullBuild } = args;

  const targetDir = path.resolve(tmpDir ?? await fs.mkdtemp('remodel-'));
  console.log(repoRoot);

  if (fullBuild) {
    if (fs.existsSync(targetDir)) {
      await fs.remove(targetDir);
    }
    await fs.mkdir(targetDir);
    await exec(`git clone ${repoRoot} ${targetDir}`);
  } else {
    const srcCdkLibDir = path.join(__dirname, '../../../../packages/aws-cdk-lib');
    const cdkLibDir = path.join(targetDir, 'packages', 'aws-cdk-lib');
    const integFrameworkDir = path.join(targetDir, 'packages', '@aws-cdk-testing', 'framework-integ');
    if (fs.existsSync(cdkLibDir)) {
      await fs.remove(cdkLibDir);
      await fs.copy(srcCdkLibDir, cdkLibDir, { overwrite: true });
    }

    if (fs.existsSync(integFrameworkDir)) {
      await fs.remove(integFrameworkDir);
      await fs.mkdir(integFrameworkDir);
    }
  }

  // Clone all source files from the current repo to our new working
  // directory. The entire copy including the .git directory ensures git can
  // be aware of all source file moves if needed via `git move`.

  const templateDir = path.join(__dirname, '..', 'lib', 'template');
  await copyTemplateFiles(templateDir, targetDir);
  await makeAwsCdkLib(targetDir);
  await makeAwsCdkLibInteg(targetDir);

  if (fullBuild) await runBuild(targetDir);
  await cleanup(targetDir);

  if (clean) {
    await fs.remove(path.resolve(targetDir));
  }

  console.log('Successs!');
}

async function copyTemplateFiles(src: string, target: string) {
  console.log('Copying template files');
  console.log(`Source: ${src}`);
  console.log(`Destination: ${target}`);
  await fs.copy(src, target, { overwrite: true });
}

async function makeAwsCdkLib(target: string) {
  console.log('Formatting aws-cdk-lib package');
  const awsCdkLibDir = path.join(target, 'packages', 'aws-cdk-lib');
  const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
  const pkgJson: PackageJson = await fs.readJson(pkgJsonPath);

  // Local packages that remain unbundled as dev dependencies
  const localDevDeps = [
    'cdk-build-tools',
    'pkglint',
    'ubergen',
    'integ-tests',
  ].map(x => `@aws-cdk/${x}`);

  console.log('Calling Ubergen');
  const ubgConfig: Config = {
    monoPackageRoot: awsCdkLibDir,
    rootPath: target,
    uberPackageJsonPath: pkgJsonPath,
    excludedPackages: ['@aws-cdk/example-construct-library', ...localDevDeps],
    // Don't do codegen because we do it as part of the build of the package
    skipCodeGen: true,
    // Include tests in copied artifacts
    ignoreTests: false,
  };

  // Call ubergen to copy all package source files and rewrite import statements
  // as needed.
  const packagesToBundle = await ubergen(ubgConfig);
  console.log('Ubergen complete');

  const devDependencies = pkgJson?.devDependencies ?? {};
  const allPackages = await findAllPackages(ubgConfig);
  const deprecatedPackages = await getDeprecatedPackages(allPackages, ubgConfig);
  const experimentalPackages = await getExperimentalPackages(allPackages);
  const deprecatedPackagesName = getPackageNames(deprecatedPackages);
  const experimentalPackagesName = getPackageNames(experimentalPackages);

  const packagesToBundleName = packagesToBundle.map(p => p.packageJson.name);

  // Filter out all of the stuff we don't want in devDeps anymore
  const filteredDevDepsEntries = Object.entries(devDependencies)
    .filter(
      ([p]) => !(
        packagesToBundleName.includes(p)
        || deprecatedPackagesName.includes(p)
        || experimentalPackagesName.includes(p)
        || p === '@aws-cdk/ubergen'
      ),
    );

  const filteredDevDeps = filteredDevDepsEntries.reduce((accum, [key, val]) => {
    return {
      ...accum,
      [key]: val,
    };
  }, {});

  // Create scope map for codegen usage
  console.log('Creating scope-map.json in scripts directory');
  await fs.writeJson(
    path.join(awsCdkLibDir, 'scripts', 'scope-map.json'),
    makeScopeMap(allPackages),
    { spaces: 2 },
  );

  // Explicitly copy some missing files that ubergen doesn't bring over for various reasons
  // Ubergen ignores some of these contents because they are within nested `node_modules` directories
  // for testing purposes
  console.log('Copying some files needed for testing');
  await fs.copy(
    path.resolve(target, 'packages', '@aws-cdk', 'aws-synthetics', 'test', 'canaries'),
    path.resolve(target, 'packages', 'aws-cdk-lib', 'aws-synthetics', 'test', 'canaries'),
    { overwrite: true },
  );

  // Fix some problems with unit tests that ubergen wasn't built to handle
  console.log('Fixing unit tests');
  await fixUnitTests(awsCdkLibDir);

  console.log('Writing new package.json');
  await fs.writeJson(pkgJsonPath, {
    ...pkgJson,
    'jsii': {
      ...pkgJson.jsii,
      excludeTypescript: [
        // Don't include pkgJson.jsii.excludeTypescript because it contains `build-tools` which we do want included
        // because of nested build-tools dirs used by tests =(
        'scripts',
      ],
    },
    'ubergen': {
      ...pkgJson.ubergen,
      libRoot: awsCdkLibDir,
    },
    'scripts': {
      ...pkgJson.scripts,
      gen: 'ts-node scripts/gen.ts',
      build: 'cdk-build',
      test: 'jest',
    },
    'cdk-build': {
      ...pkgJson['cdk-build'],
      pre: [
        'npx ts-node region-info/build-tools/generate-static-data.ts',
        '(cp -f $(node -p \'require.resolve(\"aws-sdk/apis/metadata.json\")\') custom-resources/lib/aws-custom-resource/sdk-api-metadata.json && rm -rf custom-resources/test/aws-custom-resource/cdk.out)',
        '(rm -rf core/test/fs/fixtures && cd core/test/fs && tar -xzf fixtures.tar.gz)',
        '(rm -rf assets/test/fs/fixtures && cd assets/test/fs && tar -xzvf fixtures.tar.gz)',
      ],
      post: [
        'ts-node ./scripts/verify-imports-resolve-same.ts',
        'ts-node ./scripts/verify-imports-shielded.ts',
      ],
    },
    'devDependencies': {
      ...filteredDevDeps,
      '@aws-cdk/cfn2ts': '0.0.0',
    },
  }, { spaces: 2 });

  await fs.remove(path.join(awsCdkLibDir, 'integ-tests'));

  // TODO: Cleanup
  // 1. lib/aws-events-targets/build-tools, moved to gen.ts step
  // 2. All bundled and deprecated packages
}

async function makeAwsCdkLibInteg(dir: string) {
  const source = path.join(dir, 'packages', 'aws-cdk-lib');
  const target = path.join(dir, 'packages', '@aws-cdk-testing', 'framework-integ', 'test');

  console.log('Finding integ test files and snapshots to move');
  const integFiles = await findIntegFiles(source);

  if (!fs.existsSync(target)) {
    await fs.mkdir(target);
  }

  const sourceRegex = new RegExp(`${source}(.+)`);

  console.log('Moving integ and snapshot files to @aws-cdk-testing/framework-integ');
  const copied = await Promise.all(
    integFiles.map(async (item) => {
      let fullPath = item.path;
      let relativeDest = sourceRegex.exec(fullPath)?.[1];
      if (!item.path.startsWith(source)) {
        if (fs.existsSync(path.join(source, item.path))) {
          fullPath = path.join(source, item.path);
          relativeDest = sourceRegex.exec(fullPath)?.[1];
        } else {
          fullPath = path.join(dir, 'packages/@aws-cdk', item.path);
          relativeDest = sourceRegex.exec(path.join(source, item.path))?.[1];
        }
      }
      if (!relativeDest) throw new Error(`No destination folder parsed for ${fullPath}`);

      const dest = path.join(target, relativeDest);

      if (item.copy) {
        await fs.copy(fullPath, dest);
      } else {
        await fs.move(fullPath, dest);
      }
      return dest;
    }),
  );

  // await rewriteCdkLibTestImports(source);

  console.log('Rewriting relative imports in integration test files');
  // Go through source files and rewrite the imports
  const targetRegex = new RegExp(`${target}(.+)`);
  // copied.push(path.join(target, 'aws-lambda-nodejs/test/integ-handlers/ts-handler.ts'));
  await Promise.all(copied.map(async (item) => {
    const stat = await fs.stat(item);
    // Leave snapshots we copied alone
    if (!stat.isFile()) return;


    const relativePath = targetRegex.exec(item)?.[1];
    if (!relativePath) throw new Error(`Cannot calculate relative path for ${item}`);
    // depth of file relative to top of module, used for telling which relative paths
    // need to change to reference 'aws-cdk-lib'. IE if import path is '../../another-module'
    // and the relative depth is 2, that import used to reference `aws-cdk-lib/another-module'
    const relativeDepth = relativePath.split(path.sep).length - 2;
    await rewriteIntegTestImports(item, relativeDepth);
  }));


  // Add reference to ambient types needed in test
  const crFileTarget = path.join(target, 'custom-resources', 'test', 'provider-framework', 'integration-test-fixtures', 's3-file-handler', 'index.ts');
  await addTypesReference(crFileTarget);
}

async function runBuild(dir: string) {
  const e = (cmd: string, opts: cp.ExecOptions = {}) => exec(cmd, { cwd: dir, ...opts });

  await e('yarn install');

  // Running the full build is necessary for ./transform.sh to work correctly
  await e('./build.sh --skip-prereqs --skip-compat --skip-tests');

  // Generate the alpha packages
  // await e('./scripts/transform.sh');
}

async function cleanup(dir: string) {
  const awsCdkLibDir = path.join(dir, 'packages', 'aws-cdk-lib');

  // Remove the `build.js` file within aws-cloudformation-include because this functionality is now
  // handled during codegen
  const cfnIncludeMapBuildPath = path.join(awsCdkLibDir, 'cloudformation-include', 'build.js');
  await fs.remove(cfnIncludeMapBuildPath);

  // Remove the .gitignore file in packages/individual-packages so that the alpha modules we
  // generated are included
  const alphaModulesGitignorePath = path.join(dir, 'packages', 'individual-packages', '.gitignore');
  await fs.remove(alphaModulesGitignorePath);
}

// Creates a map of directories to the cloudformations scopes that should be
// generated within that directory. Preserves information such as the "core"
// module including the AWS:CloudFormation resources, in addition to the
// "aws-cloudformation" module also having them. Also "kinesis-analytics"
// contains "AWS::KinesisAnalytics" and "AWS::KinesisAnalyticsV2" AND
// "kinesis-analyticsv2" contains "AWS:KinesisAnalyticsV2".
function makeScopeMap(pkgs: LibraryReference[]) {
  return pkgs.reduce((accum: Record<string, string[]>, { packageJson, shortName }) => {
    const scopes = packageJson?.['cdk-build']?.cloudformation ?? [];
    const newScopes = [
      ...(accum[shortName] ?? []),
      ...(typeof scopes === 'string' ? [scopes] : scopes),
    ];

    return newScopes.length ? {
      ...accum,
      [shortName]: newScopes,
    } : accum;
  }, {});
}

// Lists all directories in "packages/@aws-cdk" directory
async function findAllPackages(config: Config): Promise<LibraryReference[]> {
  const librariesRoot = path.resolve(config.rootPath, 'packages', '@aws-cdk');

  const dirs = await fs.readdir(librariesRoot);
  return Promise.all(
    dirs.map(async dir => {
      const packageJson = await fs.readJson(path.resolve(librariesRoot, dir, 'package.json'));
      return {
        packageJson,
        root: path.join(librariesRoot, dir),
        shortName: packageJson.name.slice('@aws-cdk/'.length),
      };
    }),
  );
}

// List all packages marked as deprecated in their package.json
async function getDeprecatedPackages(pkgs: LibraryReference[], config: Config) {
  const pkgJson: PackageJson = await fs.readJson(config.uberPackageJsonPath);
  const deprecatedPackages = pkgJson.ubergen?.deprecatedPackages;
  return pkgs.filter(p => {
    if (
      deprecatedPackages
      && deprecatedPackages.some((packageName: string) => packageName === p.packageJson.name)
    ) return true;
    return p.packageJson.deprecated || p.packageJson.stability === 'deprecated';
  });
}

// List all packages with experimental stability in package.json
function getExperimentalPackages(pkgs: LibraryReference[]) {
  return pkgs.filter(p => p.packageJson.stability === 'experimental');
}

// Return just list of package names from library reference
function getPackageNames(pkgs: LibraryReference[]) {
  return pkgs.map(p => p.packageJson.name);
}
