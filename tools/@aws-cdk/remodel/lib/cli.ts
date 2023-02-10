import * as cp from 'child_process';
import * as path from 'path';
import {
  main as ubergen,
  // findLibrariesToPackage,
  // verifyDependencies,
  // copySubmoduleExports,
  // transformPackage,
  Config,
  Export,
  LibraryReference,
  PackageJson as UbgPkgJson,
} from '@aws-cdk/ubergen';
import * as fs from 'fs-extra';
import yargs from 'yargs/yargs';

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
        }),
    ).argv;

  const { 'tmp-dir': tmpDir, REPO_ROOT: repoRoot, clean } = args;

  const targetDir = path.resolve(tmpDir ?? await fs.mkdtemp('remodel-'));

  if (fs.existsSync(targetDir)) {
    await fs.remove(targetDir);
  }
  await fs.mkdir(targetDir);

  // Clone all source files from the current repo to our new working
  // directory. The entire copy including the .git directory ensures git can
  // be aware of all source file moves if needed via `git move`.
  await exec(`git clone ${repoRoot} ${targetDir}`);


  await makeAwsCdkLib(targetDir);

  const templateDir = path.join(__dirname, '..', 'lib', 'template');
  await copyTemplateFiles(templateDir, targetDir);

  // await runBuild(targetDir);

  if (clean) {
    await fs.remove(path.resolve(targetDir));
  }
}

async function copyTemplateFiles(src: string, target: string) {
  await fs.copy(src, target, { overwrite: true });
}

async function makeAwsCdkLib(target: string) {
  const awsCdkLibDir = path.join(target, 'packages', 'aws-cdk-lib');
  const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
  const libRoot = awsCdkLibDir;
  // const libRoot = path.join(awsCdkLibDir, 'lib');
  const pkgJson: PackageJson = await fs.readJson(pkgJsonPath);

  const pkgJsonExports = pkgJson.exports ?? {};


  // Local packages that remain unbundled as dev dependencies
  const localDevDeps = [
    'cdk-build-tools',
    'pkglint',
    'ubergen',
  ].map(x => `@aws-cdk/${x}`);

  const ubgConfig: Config = {
    monoPackageRoot: awsCdkLibDir,
    rootPath: target,
    uberPackageJsonPath: pkgJsonPath,
    excludedPackages: ['@aws-cdk/example-construct-library', ...localDevDeps],
    // Don't do codegen because we do it as part of the build of the package
    skipCodeGen: true,
  };

  const devDependencies = pkgJson?.devDependencies ?? {};
  const allPackages = await findAllPackages(ubgConfig);
  const deprecatedPackages = await getDeprecatedPackages(allPackages, ubgConfig);
  const experimentalPackages = await getExperimentalPackages(allPackages);
  const deprecatedPackagesName = getPackageNames(deprecatedPackages);
  const experimentalPackagesName = getPackageNames(experimentalPackages);

  // Call ubergen excluding all of the packages we don't want bundled. Excludes 
  // experimental packages explicitly so it doesn't try to extract L1s from those
  // libraries since these are handled during codegen/build.
  const packagesToBundle = await ubergen(ubgConfig);
  // const packagesToBundle = await ubergen({
  //   ...ubgConfig,
  //   excludedPackages: [
  //     ...ubgConfig.excludedPackages,
  //     ...deprecatedPackagesName,
  //     ...experimentalPackagesName,
  //   ],
  // });

  // Filter out packages we are bundling from dev dependencies
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
  const filteredDevDeps = Object.fromEntries(filteredDevDepsEntries);

  const newPkgJsonExports = formatPkgJsonExports(pkgJsonExports);

  // Move all source files into 'lib' to make working on package easier
  // Exclude stuff like package.json and other config files
  const rootFiles = await fs.readdir(awsCdkLibDir);
  const excludeNesting = [
    'tsconfig.json',
    '.eslintrc.js',
    '.gitignore',
    '.npmignore',
    'LICENSE',
    'NOTICE',
    'package.json',
    'README.md',
    'tsconfig.json',
    'scripts',
  ];

  await Promise.all(rootFiles.map((file: string) => {
    if (excludeNesting.includes(file)) {
      return Promise.resolve();
    }

    const old = path.join(awsCdkLibDir, file);
    return fs.move(old, path.join(awsCdkLibDir, 'lib', file));
  }));

  // Create scope map for codegen usage
  await fs.writeJson(
    path.join(awsCdkLibDir, 'scripts', 'scope-map.json'),
    makeScopeMap(allPackages),
    { spaces: 2 },
  );

  await fs.writeJson(pkgJsonPath, {
    ...pkgJson,
    main: 'lib/index.js',
    types: 'lib/index.d.ts',
    exports: {
      ...newPkgJsonExports,
    },
    ubergen: {
      ...pkgJson.ubergen,
      libRoot,
    },
    scripts: {
      ...pkgJson.scripts,
      gen: 'ts-node scripts/gen.ts',
      build: 'yarn gen && cdk-build',
    },
    devDependencies: {
      ...filteredDevDeps,
      '@aws-cdk/cfn2ts': '0.0.0',
    },
  }, { spaces: 2 });

  // TODO: Cleanup
  // 1. lib/aws-events-targets/build-tools, moved to gen.ts step
  // 2. All bundled and deprecated packages
}

function pathReformat(str: string): string {
  const split = str.split(/.(.*)/s);
  const newVal = ['./lib', split[1]].join('');
  return newVal;
}

function formatPkgJsonExports(exports: Record<string, Export>): Record<string, Export> {
  const dontFormat = ['./package.json', './.jsii', './.warnings.jsii.js'];
  const entries = Object.entries(exports).map(([k, v]) => {
    if (typeof v === 'string') {
      const newValue = dontFormat.includes(v) ? v : pathReformat(v);
      return [k, newValue];
    }

    const nested = Object.entries(v).map(([nk, nv]) => {
      if (nv) {
        return [nk, pathReformat(nv)];
      } else {return [nk, nv];}
    });

    return [k, Object.fromEntries(nested)];
  });

  return Object.fromEntries(entries);
}

function makeScopeMap(pkgs: LibraryReference[]) {
  return pkgs.reduce((accum: Record<string, string[]>, { packageJson, shortName }) => {
    const scopes = packageJson?.['cdk-build']?.cloudformation ?? [];
    const newScopes = [
      ...(accum[shortName] ?? []),
      ...(typeof scopes === 'string' ? [scopes] : scopes),
    ];

    return {
      ...accum,
      [shortName]: newScopes,
    }
  }, {});
}

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

function getExperimentalPackages(pkgs: LibraryReference[]) {
  return pkgs.filter(p => p.packageJson.stability === 'experimental');
}

function getPackageNames(pkgs: LibraryReference[]) {
  return pkgs.map(p => p.packageJson.name);
}
