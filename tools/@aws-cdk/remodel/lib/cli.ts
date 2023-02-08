import yargs from 'yargs/yargs';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as cp from 'child_process';
import { findLibrariesToPackage, verifyDependencies, copySubmoduleExports, transformPackage } from '@aws-cdk/ubergen';
import type { Config, Export, LibraryReference, PackageJson as ubgPkgJson } from '@aws-cdk/ubergen';

interface PackageJson extends ubgPkgJson {
  readonly scripts: { [key: string]: string };
}

const exec = (cmd: string, opts?: cp.ExecOptions) => new Promise((ok, ko) => {
  const proc = cp.exec(cmd, opts, (err: cp.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => {
    if (err) {
      return ko(err);
    }

    return ok({stdout, stderr});
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
    )
    .argv;

    const { 'tmp-dir': tmpDir, REPO_ROOT: repoRoot, clean } = args;

    const targetDir = path.resolve(tmpDir ?? await fs.mkdtemp('remodel-'));

    if (fs.existsSync(targetDir)){
      await fs.remove(targetDir);
    }
    await fs.mkdir(targetDir);

    // Clone all source files from the current repo to our new working
    // directory. The entire copy including the .git directory ensures git can
    // be aware of all source file moves if needed via `git move`.
    await exec(`git clone ${repoRoot} ${targetDir}`);

    const templateDir = path.join(__dirname, '..', 'lib', 'template');

    await copyTemplateFiles(templateDir, targetDir);
    await makeAwsCdkLib(targetDir);

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
  const libRoot = path.join(awsCdkLibDir, 'lib');
  const pkgJson: PackageJson = await fs.readJson(pkgJsonPath);

  // Update lib root for ubergen so we can nest in 'lib'
  const newPkgJson = {
    ...pkgJson,
    ubergen: {
      ...pkgJson.ubergen,
      libRoot,
    }
  };
  const pkgJsonExports = newPkgJson.exports ?? {};
  await fs.writeFile(pkgJsonPath, JSON.stringify(newPkgJson, null, 2));


  const excludeBundled = [
    'cdk-build-tools',
    'pkglint',
    'ubergen',
  ].map(x => `@aws-cdk/${x}`);

  const ubgConfig: Config = {
    monoPackageRoot: awsCdkLibDir,
    rootPath: target,
    uberPackageJsonPath: pkgJsonPath,
    excludedPackages: ['@aws-cdk/example-construct-library', ...excludeBundled],
  };

  const devDependencies = newPkgJson?.devDependencies ?? {};
  const packagesToBundle = await findLibrariesToPackage(newPkgJson, ubgConfig);
  const deprecatedPackages = await findDeprecatedPackages(newPkgJson, ubgConfig);
    
  await verifyDependencies(newPkgJson, packagesToBundle, ubgConfig);

  const indexStatements = new Array<string>();
  const lazyExports = new Array<string>();

  await createIfNoDir(libRoot);
  // Copy each packages source to new location and copy submodule exports
  for (const library of packagesToBundle) {
    const libDir = path.join(libRoot, library.shortName);

    // May already exist as a result of codegen
    await createIfNoDir(libDir);

    // Only copy stable modules source code, L1s are built during codegen
    if (library.packageJson.stability !== 'experimental') {
      await transformPackage(library, newPkgJson, libDir, packagesToBundle, ubgConfig.monoPackageRoot);
    }

    if (library.shortName === 'core') {
      indexStatements.push(`export * from './${library.shortName}';`);
      lazyExports.unshift(`export * from './${library.shortName}';`);
    } else {
      const exportName = library.shortName.replace(/-/g, '_');

      indexStatements.push(`export * as ${exportName} from './${library.shortName}';`);
      lazyExports.push(`Object.defineProperty(exports, '${exportName}', { get: function () { return require('./${library.shortName}'); } });`);
    }
    copySubmoduleExports(pkgJsonExports, library, library.shortName);
  }

  // make the exports.ts file pass linting
  lazyExports.unshift('/* eslint-disable @typescript-eslint/no-require-imports */');

  await fs.writeFile(path.join(libRoot, 'index.ts'), indexStatements.join('\n'), { encoding: 'utf8' });
  await fs.writeFile(path.join(libRoot, 'lazy-index.ts'), lazyExports.join('\n'), { encoding: 'utf8' });

  // Filter out packages we are bundling from dev dependencies
  const packagesToBundleName = packagesToBundle.map(p => p.packageJson.name);
  const deprecatedPackagesName = deprecatedPackages.map(p => p.packageJson.name);

  // Filter out all of the stuff we don't want in devDeps anymore
  const filteredDevDepsEntries = Object.entries(devDependencies)
    .filter(
      ([p]) => !(
        packagesToBundleName.includes(p)
        || deprecatedPackagesName.includes(p)
        || p === '@aws-cdk/ubergen'
      )
    );
  const filteredDevDeps = Object.fromEntries(filteredDevDepsEntries);

  const newPkgJsonExports = formatPkgJsonExports(pkgJsonExports);

  await fs.writeFile(pkgJsonPath, JSON.stringify({
    ...pkgJson,
    exports: {
      ...newPkgJsonExports,
    },
    ubergen: {
      ...pkgJson.ubergen,
      libRoot,
    },
    scripts: {
      ...pkgJson.scripts,
      'gen': 'ts-node scripts/gen.ts',
      'build': 'yarn gen && cdk-build',
    },
    devDependencies: {
      ...filteredDevDeps,
      '@aws-cdk/cfn2ts': '0.0.0',
    },
  }, null, 2));

  const rootFiles = await fs.readdir(awsCdkLibDir);
  await Promise.all(rootFiles.map((file: string) => {
    if (file.endsWith('.ts')) {
      return fs.unlink(path.join(awsCdkLibDir, file));
    }

    return Promise.resolve();
  }));

  // await cleanupPackages(packagesToBundle);
  // await cleanupPackages(deprecatedPackages);
}

// async function cleanupPackages(libraries: readonly LibraryReference[]) {
//   for (const library of libraries) {
//     await fs.remove(library.root);
//   }
// }

function formatPkgJsonExports(exports: Record<string, Export>): Record<string, Export> {
  const format = (str: string) => {
    const split = str.split(/.(.*)/s);
    const newVal = ['./lib', split[1]].join('');
    return newVal;
  }

  const dontFormat = ['./package.json', './.jsii', './warnings.jsii.js'];
  const entries = Object.entries(exports).map(([k, v]) => {
    if (typeof v === 'string') {
      const newValue = dontFormat.includes(v) ? v : format(v);
      return [k, newValue]
    }

    const nested = Object.entries(v).map(([k, v]) => {
      if (v) {
        return [k, format(v)]
      }

      else return [k, v];
    });

    return [k, Object.fromEntries(nested)];
  });

  return Object.fromEntries(entries);
}

export async function runBuild(target: string) {
  const awsCdkLibDir = path.join(target, 'packages', 'aws-cdk-lib');

  await exec('yarn install', { cwd: target });

  await exec('npx lerna run build --scope aws-cdk-lib --include-dependencies', { cwd: awsCdkLibDir });
  await exec('yarn gen', { cwd: awsCdkLibDir });
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
      }
    })
  );
}

async function findDeprecatedPackages(pkgJson: PackageJson, config: Config): Promise<LibraryReference[]> {
  const deprecatedPackages = pkgJson.ubergen?.deprecatedPackages;
  const allPackages = await findAllPackages(config);

  return allPackages.filter(p => {
    if (config.excludedPackages.includes(p.packageJson.name)) return false;
    else if (
      deprecatedPackages
      && deprecatedPackages.some(packageName => packageName === p.packageJson.name)
    ) return true;
    return p.packageJson.deprecated;
  });
}

async function createIfNoDir(dir: string) {
  if (!fs.existsSync(dir)) {
    await fs.mkdir(dir);
  }
}
