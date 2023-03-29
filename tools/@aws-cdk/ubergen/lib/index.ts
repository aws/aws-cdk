import * as console from 'console';
import * as path from 'path';
import * as process from 'process';
import cfn2ts from '@aws-cdk/cfn2ts';
import * as pkglint from '@aws-cdk/pkglint';
import * as awsCdkMigration from 'aws-cdk-migration';
import * as fs from 'fs-extra';

// The directory where our 'package.json' lives
const MONOPACKAGE_ROOT = process.cwd();

const ROOT_PATH = findWorkspacePath();
const UBER_PACKAGE_JSON_PATH = path.join(MONOPACKAGE_ROOT, 'package.json');

const EXCLUDED_PACKAGES = ['@aws-cdk/example-construct-library'];

export async function main() {
  console.log(`🌴  workspace root path is: ${ROOT_PATH}`);
  const uberPackageJson = await fs.readJson(UBER_PACKAGE_JSON_PATH) as PackageJson;
  const libraries = await findLibrariesToPackage(uberPackageJson);
  await verifyDependencies(uberPackageJson, libraries);
  await prepareSourceFiles(libraries, uberPackageJson);
  await combineRosettaFixtures(libraries, uberPackageJson);

  // if explicitExports is set to `false`, remove the "exports" section from package.json
  const explicitExports = uberPackageJson.ubergen?.explicitExports ?? true;
  if (!explicitExports) {
    delete uberPackageJson.exports;
  }

  // Rewrite package.json (exports will have changed)
  await fs.writeJson(UBER_PACKAGE_JSON_PATH, uberPackageJson, { spaces: 2 });
}

interface LibraryReference {
  readonly packageJson: PackageJson;
  readonly root: string;
  readonly shortName: string;
}

type Export = string | {
  readonly types?: string;
  readonly import?: string;
  readonly require?: string;
};

interface PackageJson {
  readonly main?: string;
  readonly description?: string;
  readonly bundleDependencies?: readonly string[];
  readonly bundledDependencies?: readonly string[];
  readonly dependencies?: { readonly [name: string]: string };
  readonly devDependencies?: { readonly [name: string]: string };
  readonly jsii: {
    readonly targets?: {
      readonly dotnet?: {
        readonly namespace: string;
        readonly [key: string]: unknown;
      },
      readonly java?: {
        readonly package: string;
        readonly [key: string]: unknown;
      },
      readonly python?: {
        readonly module: string;
        readonly [key: string]: unknown;
      },
      readonly [language: string]: unknown,
    },
  };
  readonly name: string;
  readonly types: string;
  readonly version: string;
  readonly stability: string;
  readonly [key: string]: unknown;
  readonly 'cdk-build'?: {
    readonly cloudformation: string[] | string;
  };
  readonly ubergen?: {
    readonly deprecatedPackages?: readonly string[];
    readonly excludeExperimentalModules?: boolean;

    /**
     * The directory where we're going to collect all the libraries.
     *
     * @default - root of the ubergen package
     */
    readonly libRoot?: string;

    /**
     * Adds an `exports` section to the ubergen package.json file to ensure that
     * consumers won't be able to accidentally import a private file.
     *
     * @default true
     */
    readonly explicitExports?: boolean;

    /**
     * An exports section that should be ignored for v1 but included for ubergen
     */
    readonly exports?: Record<string, string>;
  };
  exports?: Record<string, Export>;
}

/**
 * Find the workspace root path. Walk up the directory tree until you find lerna.json
 */
function findWorkspacePath(): string {

  return _findRootPath(process.cwd());

  function _findRootPath(part: string): string {
    if (part === path.resolve(part, '..')) {
      throw new Error('couldn\'t find a \'lerna.json\' file when walking up the directory tree, are you in a aws-cdk project?');
    }

    if (fs.existsSync(path.resolve(part, 'lerna.json'))) {
      return part;
    }

    return _findRootPath(path.resolve(part, '..'));
  }
}

async function findLibrariesToPackage(uberPackageJson: PackageJson): Promise<readonly LibraryReference[]> {
  console.log('🔍 Discovering libraries that need packaging...');

  const deprecatedPackages = uberPackageJson.ubergen?.deprecatedPackages;
  const result = new Array<LibraryReference>();
  const librariesRoot = path.resolve(ROOT_PATH, 'packages', '@aws-cdk');

  for (const dir of await fs.readdir(librariesRoot)) {
    const packageJson = await fs.readJson(path.resolve(librariesRoot, dir, 'package.json'));

    if (packageJson.ubergen?.exclude || EXCLUDED_PACKAGES.includes(packageJson.name)) {
      console.log(`\t⚠️ Skipping (ubergen excluded):   ${packageJson.name}`);
      continue;
    } else if (packageJson.jsii == null ) {
      console.log(`\t⚠️ Skipping (not jsii-enabled):   ${packageJson.name}`);
      continue;
    } else if (deprecatedPackages) {
      if (deprecatedPackages.some(packageName => packageName === packageJson.name)) {
        console.log(`\t⚠️ Skipping (ubergen deprecated): ${packageJson.name}`);
        continue;
      }
    } else if (packageJson.deprecated) {
      console.log(`\t⚠️ Skipping (deprecated):         ${packageJson.name}`);
      continue;
    }
    result.push({
      packageJson,
      root: path.join(librariesRoot, dir),
      shortName: packageJson.name.slice('@aws-cdk/'.length),
    });
  }

  console.log(`\tℹ️ Found ${result.length} relevant packages!`);

  return result;
}

async function verifyDependencies(packageJson: any, libraries: readonly LibraryReference[]): Promise<void> {
  console.log('🧐 Verifying dependencies are complete...');

  let changed = false;
  const toBundle: Record<string, string> = {};

  for (const library of libraries) {
    for (const depName of library.packageJson.bundleDependencies ?? library.packageJson.bundledDependencies ?? []) {
      const requiredVersion = library.packageJson.devDependencies?.[depName]
        ?? library.packageJson.dependencies?.[depName]
        ?? '*';
      if (toBundle[depName] != null && toBundle[depName] !== requiredVersion) {
        throw new Error(`Required to bundle different versions of ${depName}: ${toBundle[depName]} and ${requiredVersion}.`);
      }
      toBundle[depName] = requiredVersion;
    }

    if (library.packageJson.name in packageJson.devDependencies) {
      const existingVersion = packageJson.devDependencies[library.packageJson.name];
      if (existingVersion !== library.packageJson.version) {
        console.log(`\t⚠️ Incorrect dependency: ${library.packageJson.name} (expected ${library.packageJson.version}, found ${packageJson.devDependencies[library.packageJson.name]})`);
        packageJson.devDependencies[library.packageJson.name] = library.packageJson.version;
        changed = true;
      }
      continue;
    }
    console.log(`\t⚠️ Missing dependency: ${library.packageJson.name}`);
    changed = true;
    packageJson.devDependencies = sortObject({
      ...packageJson.devDependencies ?? {},
      [library.packageJson.name]: library.packageJson.version,
    });
  }
  const workspacePath = path.resolve(ROOT_PATH, 'package.json');
  const workspace = await fs.readJson(workspacePath);
  let workspaceChanged = false;

  const spuriousBundledDeps = new Set<string>(packageJson.bundledDependencies ?? []);
  for (const [name, version] of Object.entries(toBundle)) {
    spuriousBundledDeps.delete(name);

    const nohoist = `${packageJson.name}/${name}`;
    if (!workspace.workspaces.nohoist?.includes(nohoist)) {
      console.log(`\t⚠️ Missing yarn workspace nohoist: ${nohoist}`);
      workspace.workspaces.nohoist = Array.from(new Set([
        ...workspace.workspaces.nohoist ?? [],
        nohoist,
        `${nohoist}/**`,
      ])).sort();
      workspaceChanged = true;
    }

    if (!(packageJson.bundledDependencies?.includes(name))) {
      console.log(`\t⚠️ Missing bundled dependency: ${name} at ${version}`);
      packageJson.bundledDependencies = [
        ...packageJson.bundledDependencies ?? [],
        name,
      ].sort();
      changed = true;
    }

    if (packageJson.dependencies?.[name] !== version) {
      console.log(`\t⚠️ Missing or incorrect dependency: ${name} at ${version}`);
      packageJson.dependencies = sortObject({
        ...packageJson.dependencies ?? {},
        [name]: version,
      });
      changed = true;
    }
  }
  packageJson.bundledDependencies = packageJson.bundledDependencies?.filter((dep: string) => !spuriousBundledDeps.has(dep));
  for (const toRemove of Array.from(spuriousBundledDeps)) {
    delete packageJson.dependencies[toRemove];
    changed = true;
  }

  if (workspaceChanged) {
    await fs.writeFile(workspacePath, JSON.stringify(workspace, null, 2) + '\n', { encoding: 'utf-8' });
    console.log('\t❌ Updated the yarn workspace configuration. Re-run "yarn install", and commit the changes.');
  }

  if (changed) {
    await fs.writeFile(UBER_PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n', { encoding: 'utf8' });

    throw new Error('Fixed dependency inconsistencies. Commit the updated package.json file.');
  }
  console.log('\t✅ Dependencies are correct!');
}

async function prepareSourceFiles(libraries: readonly LibraryReference[], packageJson: PackageJson) {
  console.log('📝 Preparing source files...');

  if (packageJson.ubergen?.excludeExperimentalModules) {
    console.log('\t 👩🏻‍🔬 \'excludeExperimentalModules\' enabled. Regenerating all experimental modules as L1s using cfn2ts...');
  }

  const libRoot = resolveLibRoot(packageJson);

  // Should not remove collection directory if we're currently in it. The OS would be unhappy.
  if (libRoot !== process.cwd()) {
    await fs.remove(libRoot);
  }

  // Control 'exports' field of the 'package.json'. This will control what kind of 'import' statements are
  // allowed for this package: we only want to allow the exact import statements that we want to support.
  packageJson.exports = {
    '.': {
      types: './index.d.ts',
      import: './index.js',
      require: './lazy-index.js',
    },

    // We need to expose 'package.json' and '.jsii' because 'jsii' and 'jsii-reflect' load them using
    // require(). (-_-). Can be removed after https://github.com/aws/jsii/pull/3205 gets merged.
    './package.json': './package.json',
    './.jsii': './.jsii',

    // This is necessary to support jsii cross-module warnings
    './.warnings.jsii.js': './.warnings.jsii.js',
  };

  // We use the index.ts to compile type definitions.
  //
  // We build two indexes: one for eager loading (used by ESM modules), and one
  // for lazy loading (used by CJS modules). The lazy loading will result in faster
  // loading times, because we don't have to load and parse all submodules right away,
  // but is not compatible with ESM's loading algorithm.
  //
  // This improves AWS CDK app performance by ~400ms.
  const indexStatements = new Array<string>();
  const lazyExports = new Array<string>();

  for (const library of libraries) {
    const libDir = path.join(libRoot, library.shortName);
    const copied = await transformPackage(library, packageJson, libDir, libraries);

    if (!copied) {
      continue;
    }
    if (library.shortName === 'core') {
      indexStatements.push(`export * from './${library.shortName}';`);
      lazyExports.unshift(`export * from './${library.shortName}';`);
    } else {
      const exportName = library.shortName.replace(/-/g, '_');

      indexStatements.push(`export * as ${exportName} from './${library.shortName}';`);
      lazyExports.push(`Object.defineProperty(exports, '${exportName}', { get: function () { return require('./${library.shortName}'); } });`);
    }
    copySubmoduleExports(packageJson.exports, library, library.shortName);
  }

  // make the exports.ts file pass linting
  lazyExports.unshift('/* eslint-disable @typescript-eslint/no-require-imports */');

  await fs.writeFile(path.join(libRoot, 'index.ts'), indexStatements.join('\n'), { encoding: 'utf8' });
  await fs.writeFile(path.join(libRoot, 'lazy-index.ts'), lazyExports.join('\n'), { encoding: 'utf8' });

  console.log('\t🍺 Success!');
}

/**
 * Copy the sublibrary's exports into the 'exports' of the main library.
 *
 * Replace the original 'main' export with an export of the new '<submodule>/index.ts` file we've written
 * in 'transformPackage'.
 */
function copySubmoduleExports(targetExports: Record<string, Export>, library: LibraryReference, subdirectory: string) {
  const visibleName = library.shortName;

  // Do both REAL "exports" section, as well as virtual, ubergen-only "exports" section
  for (const exportSet of [library.packageJson.exports, library.packageJson.ubergen?.exports]) {
    for (const [relPath, relSource] of Object.entries(exportSet ?? {})) {
      targetExports[`./${unixPath(path.join(visibleName, relPath))}`] = resolveExport(relSource);
    }
  }

  function resolveExport<A extends Export>(exp: A): A {
    if (typeof exp === 'string') {
      return `./${unixPath(path.join(subdirectory, exp))}` as any;
    } else {
      return Object.fromEntries(Object.entries(exp).map(([k, v]) => [k, v ? resolveExport(v) : undefined])) as any;
    }
  }

  if (visibleName !== 'core') {
    // If there was an export for '.' in the original submodule, this assignment will overwrite it,
    // which is exactly what we want.
    targetExports[`./${unixPath(visibleName)}`] = `./${unixPath(subdirectory)}/index.js`;
  }
}

async function combineRosettaFixtures(libraries: readonly LibraryReference[], uberPackageJson: PackageJson) {
  console.log('📝 Combining Rosetta fixtures...');

  const uberRosettaDir = path.resolve(MONOPACKAGE_ROOT, 'rosetta');
  await fs.remove(uberRosettaDir);
  await fs.mkdir(uberRosettaDir);

  for (const library of libraries) {
    const packageRosettaDir = path.join(library.root, 'rosetta');
    const uberRosettaTargetDir = library.shortName === 'core' ? uberRosettaDir : path.join(uberRosettaDir, library.shortName.replace(/-/g, '_'));
    if (await fs.pathExists(packageRosettaDir)) {
      if (!fs.existsSync(uberRosettaTargetDir)) {
        await fs.mkdir(uberRosettaTargetDir);
      }
      const files = await fs.readdir(packageRosettaDir);
      for (const file of files) {
        await fs.writeFile(
          path.join(uberRosettaTargetDir, file),
          await rewriteRosettaFixtureImports(
            path.join(packageRosettaDir, file),
            uberPackageJson.name,
          ),
          { encoding: 'utf8' },
        );
      }
    }
  }

  console.log('\t🍺 Success!');
}

async function transformPackage(
  library: LibraryReference,
  uberPackageJson: PackageJson,
  destination: string,
  allLibraries: readonly LibraryReference[],
) {
  await fs.mkdirp(destination);

  if (uberPackageJson.ubergen?.excludeExperimentalModules && library.packageJson.stability === 'experimental') {
    // when stripExperimental is enabled, we only want to add the L1s of experimental modules.
    let cfnScopes = library.packageJson['cdk-build']?.cloudformation;

    if (cfnScopes === undefined) {
      return false;
    }
    cfnScopes = Array.isArray(cfnScopes) ? cfnScopes : [cfnScopes];

    const destinationLib = path.join(destination, 'lib');
    await fs.mkdirp(destinationLib);
    await cfn2ts(cfnScopes, destinationLib);

    // We know what this is going to be, so predict it
    const alphaPackageName = hasL2s(library) ? `${library.packageJson.name}-alpha` : undefined;

    // create a lib/index.ts which only exports the generated files
    fs.writeFileSync(path.join(destinationLib, 'index.ts'),
      /// logic copied from `create-missing-libraries.ts`
      cfnScopes.map(s => (s === 'AWS::Serverless' ? 'AWS::SAM' : s).split('::')[1].toLocaleLowerCase())
        .map(s => `export * from './${s}.generated';`)
        .join('\n'));
    await pkglint.createLibraryReadme(cfnScopes[0], path.join(destination, 'README.md'), alphaPackageName);

    await copyOrTransformFiles(destination, destination, allLibraries, uberPackageJson);
  } else {
    await copyOrTransformFiles(library.root, destination, allLibraries, uberPackageJson);
    await copyLiterateSources(path.join(library.root, 'test'), path.join(destination, 'test'), allLibraries, uberPackageJson);
  }

  await fs.writeFile(
    path.join(destination, 'index.ts'),
    `export * from './${library.packageJson.types.replace(/(\/index)?(\.d)?\.ts$/, '')}';\n`,
    { encoding: 'utf8' },
  );

  if (library.shortName !== 'core') {
    const config = uberPackageJson.jsii.targets;
    await fs.writeJson(
      path.join(destination, '.jsiirc.json'),
      {
        targets: transformTargets(config, library.packageJson.jsii.targets),
      },
      { spaces: 2 },
    );
  }

  // if libRoot is _not_ under the root of the package, generate a file at the
  // root that will refer to the one under lib/ so that users can still import
  // from "aws-cdk-lib/aws-lambda".
  const relativeLibRoot = uberPackageJson.ubergen?.libRoot;
  if (relativeLibRoot && relativeLibRoot !== '.') {
    await fs.writeFile(
      path.resolve(MONOPACKAGE_ROOT, `${library.shortName}.ts`),
      `export * from './${relativeLibRoot}/${library.shortName}';\n`,
      { encoding: 'utf8' },
    );
  }

  return true;
}

/**
 * Return whether a package has L2s
 *
 * We determine this on the cheap: the answer is yes if the package has
 * any .ts files in the `lib` directory other than `index.ts` and `*.generated.ts`.
 */
function hasL2s(library: LibraryReference) {
  try {
    const sourceFiles = fs.readdirSync(path.join(library.root, 'lib')).filter(n => n.endsWith('.ts') && !n.endsWith('.d.ts'));
    return sourceFiles.some(n => n !== 'index.ts' && !n.includes('.generated.'));
  } catch (e: any) {
    if (e.code === 'ENOENT') { return false; }

    throw e;
  }
}

function transformTargets(monoConfig: PackageJson['jsii']['targets'], targets: PackageJson['jsii']['targets']): PackageJson['jsii']['targets'] {
  if (targets == null) { return targets; }

  const result: Record<string, any> = {};
  for (const [language, config] of Object.entries(targets)) {
    switch (language) {
      case 'dotnet':
        if (monoConfig?.dotnet != null) {
          result[language] = {
            namespace: (config as any).namespace,
          };
        }
        break;
      case 'java':
        if (monoConfig?.java != null) {
          result[language] = {
            package: (config as any).package,
          };
        }
        break;
      case 'python':
        if (monoConfig?.python != null) {
          result[language] = {
            module: `${monoConfig.python.module}.${(config as any).module.replace(/^aws_cdk\./, '')}`,
          };
        }
        break;
      default:
        throw new Error(`Unsupported language for submodule configuration translation: ${language}`);
    }
  }

  return result;
}

async function copyOrTransformFiles(from: string, to: string, libraries: readonly LibraryReference[], uberPackageJson: PackageJson) {
  const libRoot = resolveLibRoot(uberPackageJson);
  const promises = (await fs.readdir(from)).map(async name => {
    if (shouldIgnoreFile(name)) { return; }

    if (name.endsWith('.d.ts') || name.endsWith('.js')) {
      if (await fs.pathExists(path.join(from, name.replace(/\.(d\.ts|js)$/, '.ts')))) {
        // We won't copy .d.ts and .js files with a corresponding .ts file
        return;
      }
    }

    const source = path.join(from, name);
    const destination = path.join(to, name);

    const stat = await fs.stat(source);
    if (stat.isDirectory()) {
      await fs.mkdirp(destination);
      return copyOrTransformFiles(source, destination, libraries, uberPackageJson);
    }

    if (name.endsWith('.ts')) {
      return fs.writeFile(
        destination,
        await rewriteLibraryImports(source, to, libRoot, libraries),
        { encoding: 'utf8' },
      );
    } else if (name === 'cfn-types-2-classes.json') {
      // This is a special file used by the cloudformation-include module that contains mappings
      // of CFN resource types to the fully-qualified class names of the CDK L1 classes.
      // We need to rewrite it to refer to the uberpackage instead of the individual packages
      const cfnTypes2Classes: { [key: string]: string } = await fs.readJson(source);
      for (const cfnType of Object.keys(cfnTypes2Classes)) {
        const fqn = cfnTypes2Classes[cfnType];
        // replace @aws-cdk/aws-<service> with <uber-package-name>/aws-<service>,
        // except for @aws-cdk/core, which maps just to the name of the uberpackage
        cfnTypes2Classes[cfnType] = fqn.startsWith('@aws-cdk/core.')
          ? fqn.replace('@aws-cdk/core', uberPackageJson.name)
          : fqn.replace('@aws-cdk', uberPackageJson.name);
      }
      await fs.writeJson(destination, cfnTypes2Classes, { spaces: 2 });
    } else if (name === 'README.md') {
      // Rewrite the README to both adjust imports and remove the redundant stability banner.
      // (All modules included in ubergen-ed packages must be stable, so the banner is unnecessary.)
      const newReadme = (await rewriteReadmeImports(source, uberPackageJson.name))
        .replace(/<!--BEGIN STABILITY BANNER-->[\s\S]+<!--END STABILITY BANNER-->/gm, '');

      return fs.writeFile(
        destination,
        newReadme,
        { encoding: 'utf8' },
      );
    } else {
      return fs.copyFile(source, destination);
    }
  });

  await Promise.all(promises);
}

async function copyLiterateSources(from: string, to: string, libraries: readonly LibraryReference[], uberPackageJson: PackageJson) {
  const libRoot = resolveLibRoot(uberPackageJson);
  await Promise.all((await fs.readdir(from)).flatMap(async name => {
    const source = path.join(from, name);
    const stat = await fs.stat(source);

    if (stat.isDirectory()) {
      await copyLiterateSources(source, path.join(to, name), libraries, uberPackageJson);
      return;
    }

    if (!name.endsWith('.lit.ts')) {
      return [];
    }

    await fs.mkdirp(to);

    return fs.writeFile(
      path.join(to, name),
      await rewriteLibraryImports(path.join(from, name), to, libRoot, libraries),
      { encoding: 'utf8' },
    );
  }));
}

/**
 * Rewrites the imports in README.md from v1 ('@aws-cdk') to v2 ('aws-cdk-lib').
 */
async function rewriteReadmeImports(fromFile: string, libName: string): Promise<string> {
  const sourceCode = await fs.readFile(fromFile, { encoding: 'utf8' });
  return awsCdkMigration.rewriteReadmeImports(sourceCode, libName);
}

/**
 * Rewrites imports in libaries, using the relative path (i.e. '../../assertions').
 */
async function rewriteLibraryImports(fromFile: string, targetDir: string, libRoot: string, libraries: readonly LibraryReference[]): Promise<string> {
  const source = await fs.readFile(fromFile, { encoding: 'utf8' });
  return awsCdkMigration.rewriteImports(source, relativeImport);

  function relativeImport(modulePath: string): string | undefined {
    const sourceLibrary = libraries.find(
      lib =>
        modulePath === lib.packageJson.name ||
        modulePath.startsWith(`${lib.packageJson.name}/`),
    );
    if (sourceLibrary == null) { return undefined; }

    const importedFile = modulePath === sourceLibrary.packageJson.name
      ? path.join(libRoot, sourceLibrary.shortName)
      : path.join(libRoot, sourceLibrary.shortName, modulePath.slice(sourceLibrary.packageJson.name.length + 1));

    return path.relative(targetDir, importedFile);
  }
}

/**
 * Rewrites imports in rosetta fixtures, using the external path (i.e. 'aws-cdk-lib/assertions').
 */
async function rewriteRosettaFixtureImports(fromFile: string, libName: string): Promise<string> {
  const source = await fs.readFile(fromFile, { encoding: 'utf8' });
  return awsCdkMigration.rewriteMonoPackageImports(source, libName);
}

const IGNORED_FILE_NAMES = new Set([
  '.eslintrc.js',
  '.gitignore',
  '.jest.config.js',
  '.jsii',
  '.npmignore',
  'node_modules',
  'package.json',
  'test',
  'tsconfig.json',
  'tsconfig.tsbuildinfo',
  'LICENSE',
  'NOTICE',
]);

function shouldIgnoreFile(name: string): boolean {
  return IGNORED_FILE_NAMES.has(name);
}

function sortObject<T>(obj: Record<string, T>): Record<string, T> {
  const result: Record<string, T> = {};

  for (const [key, value] of Object.entries(obj).sort((l, r) => l[0].localeCompare(r[0]))) {
    result[key] = value;
  }

  return result;
}

/**
 * Turn potential backslashes into forward slashes
 */
function unixPath(x: string) {
  return x.replace(/\\/g, '/');
}

/**
 * Resolves the directory where we're going to collect all the libraries.
 *
 * By default, this is purposely the same as the monopackage root so that our
 * two import styles resolve to the same files but it can be overridden by
 * seeting `ubergen.libRoot` in the package.json of the uber package.
 *
 * @param uberPackageJson package.json contents of the uber package
 * @returns The directory where we should collect all the libraries.
 */
function resolveLibRoot(uberPackageJson: PackageJson): string {
  return path.resolve(uberPackageJson.ubergen?.libRoot ?? MONOPACKAGE_ROOT);
}
