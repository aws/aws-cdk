import * as path from 'path';
import * as awsCdkMigration from 'aws-cdk-migration';
import * as fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');

/**
 * @aws-cdk/ scoped packages that may be present in devDependencies and need to
 * be retained (or else pkglint might declare the package unworthy).
 */
const REQUIRED_TOOLS = new Set([
  '@aws-cdk/cdk-build-tools',
  '@aws-cdk/cdk-integ-tools',
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
        // Change the default configuration of the import/no-extraneous-dependencies rule
        // (as the unstable packages don't use direct dependencies,
        // but instead a combination of devDependencies + peerDependencies)
        const esLintRcLines = fs.readFileSync(source).toString().split('\n');
        const resultFileLines = [];
        for (const line of esLintRcLines) {
          resultFileLines.push(line);
          // put our new line right after the parserOptions.project setting line,
          // as some files export a copy of this object,
          // in which case putting it at the end doesn't work
          if (line.startsWith('baseConfig.parserOptions.project')) {
            resultFileLines.push("\nbaseConfig.rules['import/no-extraneous-dependencies'] = ['error', " +
              '{ devDependencies: true, peerDependencies: true } ];\n');
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
      } else if (sourceFileName.endsWith('.ts') && !sourceFileName.endsWith('.d.ts')) {
        const sourceCode = fs.readFileSync(source).toString();
        const sourceCodeOutput = awsCdkMigration.rewriteImports(sourceCode, sourceFileName, {
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
  packageJson.repository.directory = `packages/individual-packages/${pkgUnscopedName}`;

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
  // moduleName is needed; packageName will be automatically derived by from the package name.
  jsiiTargets.go = {
    moduleName: 'github.com/aws/aws-cdk-go',
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
          alphaDependencies[alphaPackages[dependency]] = pkg.version;
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
      case '@aws-cdk/assert-internal':
      case '@aws-cdk/assert':
        devDependencies['@aws-cdk/assert'] = packageJson.devDependencies[v1DevDependency];
        break;
      default:
        if (alphaPackages[v1DevDependency]) {
          alphaDevDependencies[alphaPackages[v1DevDependency]] = pkg.version;
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
  // and those that are JSII-enabled (so no @aws-cdk/assert)
  return pkg.name.startsWith('@aws-cdk/') && !!pkg.get('jsii');
}

function isRequiredTool(name: string) {
  return REQUIRED_TOOLS.has(name);
}
