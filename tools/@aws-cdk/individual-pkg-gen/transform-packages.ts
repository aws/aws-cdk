import * as path from 'path';
import * as awsCdkMigration from 'aws-cdk-migration';
import * as fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ver = require('../../../scripts/resolve-version');

const CFN_STABILITY_BANNER = `${[
  '![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)',
  '',
  '> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.',
  '>',
  '> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib',
].join('\n')}\n\n`;

const FEATURE_CFN_STABILITY_BANNER = `> **CFN Resources:** All classes with the \`Cfn\` prefix in this module ([CFN Resources]) are always
> stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib\n\n<!-- -->\n\n`;

const FEATURE_CFN_STABILITY_LINE = /CFN Resources\s+\| !\[Stable]\(https:\/\/img\.shields\.io\/badge\/stable-success\.svg\?style=for-the-badge\)\n/gm;

/**
 * @aws-cdk/ scoped packages that may be present in devDependencies and need to
 * be retained (or else pkglint might declare the package unworthy).
 */
const REQUIRED_TOOLS = new Set([
  '@aws-cdk/cdk-build-tools',
  '@aws-cdk/integ-runner',
  '@aws-cdk/cfn2ts',
  '@aws-cdk/eslint-plugin',
  '@aws-cdk/pkglint',
]);

transformPackages();

function transformPackages(): void {
  // there is a lerna.json in the individual-packages directory, where this script executes
  const project = new lerna_project.Project(__dirname);
  const packages = project.getPackagesSync();
  const alphaPackages = getAlphaPackages(packages);

  for (const pkg of packages) {
    if (!packageIsAlpha(pkg)) {
      continue;
    }

    const srcDir = pkg.location;
    const packageUnscopedName = `${pkg.name.substring('@aws-cdk/'.length)}`;
    const destDir = path.join('.', packageUnscopedName);
    fs.mkdirpSync(destDir);

    copyOrTransformFiles(pkg, srcDir, destDir, [
      // list of files to _not_ copy from the V1 package root
      // .gitignore is not on the list, because pkglint checks it
      'dist',
      'node_modules',
      'coverage',
      '.nyc_output',
      'nyc.config.js',
      '.jsii',
      'tsconfig.json',
      'tsconfig.tsbuildinfo',
    ]);
  }

  function copyOrTransformFiles(pkg: any, srcDir: string, destDir: string, ignoredFiles: string[]): void {
    const sourceFiles = fs.readdirSync(srcDir);
    for (const sourceFileName of sourceFiles) {
      if (ignoredFiles.includes(sourceFileName)) {
        continue;
      }

      const serviceName = pkg.name.substring('@aws-cdk/aws-'.length);
      if (sourceFileName.startsWith(`${serviceName}.generated`)) {
        // Skip copying the generated L1 files: foo.generated.*
        // Don't skip the augmentations and canned metrics: foo-augmentations.generated.*, foo-canned-metrics.generated.*,
        // or any other new foo-x.generated.* format that might be introduced.
        continue;
      }

      const source = path.join(srcDir, sourceFileName);
      const destination = path.join(destDir, sourceFileName);

      if (srcDir === pkg.location && sourceFileName === 'package.json') {
        // Only transform packageJsons at the package root, not in any nested packages.
        transformPackageJson(pkg, source, destination, alphaPackages);
      } else if (sourceFileName === '.gitignore') {
        // ignore everything, otherwise there are uncommitted files present in testing,
        // because the module's .gitignore file has entries like !.eslintrc.js
        const gitIgnoreContents = fs.readFileSync(source);
        fs.outputFileSync(destination, Buffer.concat([gitIgnoreContents, Buffer.from('\n*\n')]));
      } else if (sourceFileName === '.eslintrc.js') {
        // We need to change some eslint rules
        // Unstable packages are generated and it's not required for them to strictly follow our code style guide
        const esLintRcLines = fs.readFileSync(source).toString().split('\n');
        const resultFileLines = [];
        for (const line of esLintRcLines) {
          // put our new lines right after the parserOptions.project setting line,
          // as some files export a copy of this object,
          // in which case putting it at the end doesn't work
          resultFileLines.push(line);
          if (line.startsWith('baseConfig.parserOptions.project')) {
            // Add some extra whitespace before our rule changes
            resultFileLines.push('');

            // Change the default of the import/no-extraneous-dependencies rule:
            // Unstable packages don't use direct dependencies, but instead a combination of devDependencies + peerDependencies
            resultFileLines.push("baseConfig.rules['import/no-extraneous-dependencies'] = ['error', " +
              '{ devDependencies: true, peerDependencies: true } ];');
            // Disable the import/order rule:
            // Imports of the unstable packages are rewritten from an ordered source
            // It's not required and therefore reasonable to ensure order after the imports are rewritten
            resultFileLines.push("baseConfig.rules['import/order'] = 'off';");

            // Add some extra whitespace at the end
            resultFileLines.push('');
          }
        }
        fs.outputFileSync(destination, resultFileLines.join('\n'));
      } else if (sourceFileName === 'index.ts') {
        // Remove any exports for generated L1s, e.g.:
        // export * from './apigatewayv2.generated';
        const indexLines = fs.readFileSync(source, 'utf8')
          .split('\n')
          .filter(line => !line.match(/export \* from '.*\.generated'/))
          .join('\n');
        fs.outputFileSync(destination, indexLines);
      } else if (sourceFileName.endsWith('.ts') && !sourceFileName.endsWith('.d.ts') || sourceFileName.endsWith('.ts-fixture')) {
        const sourceCode = fs.readFileSync(source).toString();
        const sourceCodeOutput = awsCdkMigration.rewriteMonoPackageImports(sourceCode, 'aws-cdk-lib', sourceFileName, {
          customModules: alphaPackages,
          rewriteCfnImports: true,
          packageUnscopedName: `${pkg.name.substring('@aws-cdk/'.length)}`,
        });
        fs.outputFileSync(destination, sourceCodeOutput);
      } else if (sourceFileName === 'README.md') {
        // Remove the stability banner for Cfn constructs, since they don't exist in the alpha modules
        let sourceCode = fs.readFileSync(source).toString();
        [CFN_STABILITY_BANNER, FEATURE_CFN_STABILITY_BANNER, FEATURE_CFN_STABILITY_LINE].forEach(pattern => {
          sourceCode = sourceCode.replace(pattern, '');
        });
        const sourceCodeOutput = awsCdkMigration.rewriteReadmeImports(sourceCode, 'aws-cdk-lib', sourceFileName, {
          customModules: alphaPackages,
          rewriteCfnImports: true,
          packageUnscopedName: `${pkg.name.substring('@aws-cdk/'.length)}`,
        });
        fs.outputFileSync(destination, sourceCodeOutput);
      } else {
        const stat = fs.statSync(source);
        if (stat.isDirectory()) {
          // we only ignore files on the top level in the package,
          // as some subdirectories we do want to copy over
          // (for example, synthetics contains a node_modules/ in the test/ directory
          // that is needed for running the tests)
          copyOrTransformFiles(pkg, source, destination, []);
        } else {
          fs.copySync(source, destination);
        }
      }
    }
  }
}

function transformPackageJson(pkg: any, source: string, destination: string, alphaPackages: { [dep: string]: string; }) {
  const packageJson = fs.readJsonSync(source);
  const pkgUnscopedName = `${pkg.name.substring('@aws-cdk/'.length)}`;

  packageJson.name += '-alpha';
  if (ver.alphaVersion) {
    packageJson.version = ver.alphaVersion;
  }
  packageJson.repository.directory = `packages/individual-packages/${pkgUnscopedName}`;

  // All individual packages are public by default on v1, and private by default on v2.
  // We need to flip these around, so we don't publish alphas on v1, but *do* on v2.
  // We also should only do this for packages we intend to publish (those with a `publishConfig`)
  if (packageJson.publishConfig) {
    packageJson.private = !packageJson.private;
    packageJson.publishConfig.tag = 'latest';
    if (packageJson.private) {
      packageJson.ubergen = { exclude: true };
    }
  }

  // disable the 'cloudformation' directive since alpha modules don't contain L1 resources.
  const cdkBuild = packageJson['cdk-build'];
  if (cdkBuild) {
    delete cdkBuild.cloudformation;
    packageJson['cdk-build'] = cdkBuild;
  }

  // disable `cfn2ts` script since alpha modules don't contain L1 resources.
  delete packageJson.scripts.cfn2ts;

  // disable awslint (some rules are hard-coded to @aws-cdk/core)
  packageJson.awslint = {
    exclude: ['*:*'],
  };

  // add a pkglint exemption for the 'package name = dir name' rule
  const pkglint = packageJson.pkglint || {};
  pkglint.exclude = [
    ...(pkglint.exclude || []),
    'naming/package-matches-directory',
    // the experimental packages need the "real" assert dependency
    'assert/assert-dependency',
  ];
  packageJson.pkglint = pkglint;

  // turn off the L1 generation, which uses @aws-cdk/ modules
  if (packageJson.scripts?.gen === 'cfn2ts') {
    delete packageJson.scripts.gen;
  }

  // https://github.com/aws/aws-cdk/issues/15576
  const jsiiTargets = packageJson.jsii.targets;
  jsiiTargets.dotnet.namespace += '.Alpha';
  jsiiTargets.dotnet.packageId += '.Alpha';
  jsiiTargets.java.package += '.alpha';
  jsiiTargets.java.maven.artifactId += '-alpha';
  jsiiTargets.python.distName += '-alpha';
  jsiiTargets.python.module += '_alpha';
  // Typically, only our top-level packages have a Go target.
  // packageName has unusable chars and redundant 'aws' stripped.
  // This generates names like 'awscdkfoobaralpha' (rather than 'awscdkawsfoobaralpha').
  jsiiTargets.go = {
    moduleName: 'github.com/aws/aws-cdk-go',
    packageName: packageJson.name.replace('/aws-', '').replace(/[^a-z0-9.]/gi, '').toLowerCase(),
  };

  const finalPackageJson = transformPackageJsonDependencies(packageJson, pkg, alphaPackages);

  fs.writeJsonSync(destination, packageJson, { spaces: 2 });
  fs.writeJsonSync(path.join(path.dirname(destination), '_package.json'), finalPackageJson, { spaces: 2 });
}

function transformPackageJsonDependencies(packageJson: any, pkg: any, alphaPackages: { [dep: string]: string; }) {
  // regular dependencies
  const alphaDependencies: { [dep: string]: string; } = {};
  const constructsAndCdkLibDevDeps: { [dep: string]: string; } = {};
  const bundledDependencies: { [dep: string]: string } = {};
  const v1BundledDependencies: string[] = packageJson.bundledDependencies || [];
  for (const dependency of Object.keys(packageJson.dependencies || {})) {
    // all 'regular' dependencies on alpha modules will be converted to
    // a pair of devDependency on '0.0.0' and peerDependency on '^0.0.0',
    // and the package will have no regular dependencies anymore
    switch (dependency) {
      // @core corresponds to aws-cdk-lib
      case '@aws-cdk/core':
        constructsAndCdkLibDevDeps['aws-cdk-lib'] = pkg.version;
        break;
      case 'constructs':
        constructsAndCdkLibDevDeps.constructs = packageJson.dependencies.constructs;
        break;
      default:
        if (alphaPackages[dependency]) {
          alphaDependencies[alphaPackages[dependency]] = packageJson.version;
        } else if (v1BundledDependencies.indexOf(dependency) !== -1) {
          // ...other than third-party dependencies, which are in bundledDependencies
          bundledDependencies[dependency] = packageJson.dependencies[dependency];
        }
    }
  }
  packageJson.dependencies = bundledDependencies;

  // devDependencies
  const alphaDevDependencies: { [dep: string]: string; } = {};
  const devDependencies: { [dep: string]: string; } = {};
  for (const v1DevDependency of Object.keys(packageJson.devDependencies || {})) {
    switch (v1DevDependency) {
      // @core corresponds to aws-cdk-lib
      // this is needed for packages that only have a dev dependency on @core
      case '@aws-cdk/core':
        devDependencies['aws-cdk-lib'] = pkg.version;
        break;
      default:
        if (alphaPackages[v1DevDependency]) {
          alphaDevDependencies[alphaPackages[v1DevDependency]] = packageJson.version;
        } else if (!v1DevDependency.startsWith('@aws-cdk/') || isRequiredTool(v1DevDependency)) {
          devDependencies[v1DevDependency] = packageJson.devDependencies[v1DevDependency];
        }
    }
  }
  const finalPackageJson = { ...packageJson };
  // we save the devDependencies in a temporary _package.json
  finalPackageJson.devDependencies = {
    ...devDependencies,
    ...constructsAndCdkLibDevDeps,
    ...alphaDevDependencies,
    ...alphaDependencies,
  };
  packageJson.devDependencies = {
    ...alphaDevDependencies,
    ...alphaDependencies,
  };

  // peer dependencies
  finalPackageJson.peerDependencies = {
    ...(Object.entries(alphaDependencies)
      // for other alpha dependencies, we need to depend on exact versions
      // (because of the braking changes between them)
      .reduce((acc, [depName, depVersion]) => {
        acc[depName] = depVersion;
        return acc;
      }, {} as { [dep: string]: string; })),
    ...(Object.entries(constructsAndCdkLibDevDeps)
      .reduce((acc, [depName, depVersion]) => {
        acc[depName] = `${depVersion.startsWith('^') ? '' : '^'}${depVersion}`;
        return acc;
      }, {} as { [dep: string]: string; })),
  };
  packageJson.peerDependencies = undefined;
  return finalPackageJson;
}

function getAlphaPackages(packages: any[]): { [dep: string]: string } {
  return packages
    .filter(packageIsAlpha)
    .reduce((acc, pkg: any) => {
      acc[pkg.name] = `${pkg.name}-alpha`;
      return acc;
    }, {});
}

function packageIsAlpha(pkg: any): boolean {
  // allow modules to decide themselves whether they should be packaged separately
  const separateModule = pkg.get('separate-module');
  if (separateModule !== undefined) {
    return separateModule;
  }

  const maturity = pkg.get('maturity');
  if (maturity !== 'experimental' && maturity !== 'developer-preview') {
    return false;
  }
  // we're only interested in '@aws-cdk/' packages,
  // and those that are JSII-enabled
  // Also, don't re-transform already alpha-ed packages
  return pkg.name.startsWith('@aws-cdk/') && !!pkg.get('jsii') && !pkg.name.endsWith('-alpha');
}

function isRequiredTool(name: string) {
  return REQUIRED_TOOLS.has(name);
}
