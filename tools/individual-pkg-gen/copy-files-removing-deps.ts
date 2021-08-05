import * as path from 'path';
import * as awsCdkMigration from 'aws-cdk-migration';
import * as fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');

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

    copyOrTransformFiles(pkg, srcDir, destDir);
  }

  function copyOrTransformFiles(pkg: any, srcDir: string, destDir: string): void {
    const sourceFiles = fs.readdirSync(srcDir);
    for (const sourceFileName of sourceFiles) {
      if (shouldIgnoreFile(sourceFileName)) {
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
        const esLintRcContents = fs.readFileSync(source);
        fs.outputFileSync(destination, Buffer.concat([esLintRcContents,
          Buffer.from("\nbaseConfig.rules['import/no-extraneous-dependencies'] = ['error', " +
              '{ devDependencies: true, peerDependencies: true } ];\n')]));
      } else if (sourceFileName.endsWith('.ts') && !sourceFileName.endsWith('.d.ts')) {
        const sourceCode = fs.readFileSync(source).toString();
        const sourceCodeOutput = awsCdkMigration.rewriteImports(sourceCode, sourceFileName, {
          customModules: alphaPackages,
        });
        fs.outputFileSync(destination, sourceCodeOutput);
      } else {
        const stat = fs.statSync(source);
        if (stat.isDirectory()) {
          copyOrTransformFiles(pkg, source, destination);
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

  packageJson.name = `@aws-cdk-lib-alpha/${pkgUnscopedName}`;
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

  const jsiiTargets = packageJson.jsii.targets;
  jsiiTargets.dotnet.namespace = jsiiTargets.dotnet.namespace.replace(
    /^Amazon\.CDK\./, 'Amazon.CDK.Alpha.');
  jsiiTargets.java.package = jsiiTargets.java.package.replace(
    /^software\.amazon\.awscdk\./, 'software.amazon.awscdk.alpha.');
  jsiiTargets.java.maven.artifactId = jsiiTargets.java.maven.artifactId.startsWith('cdk-')
    ? jsiiTargets.java.maven.artifactId.replace(/cdk-/, 'cdk-alpha.')
    : 'cdk-alpha.aws-' + jsiiTargets.java.maven.artifactId;
  jsiiTargets.python.distName = jsiiTargets.python.distName.replace(
    /^aws-cdk\./, 'aws-cdk.alpha.');
  jsiiTargets.python.module = jsiiTargets.python.module.replace(
    /^aws_cdk\./, 'aws_cdk.alpha.');

  const finalPackageJson = transformPackageJsonDependencies(packageJson, pkg, alphaPackages);

  fs.writeJsonSync(destination, packageJson, { spaces: 2 });
  fs.writeJsonSync(path.join(path.dirname(destination), '_package.json'), finalPackageJson, { spaces: 2 });
}

function transformPackageJsonDependencies(packageJson: any, pkg: any, alphaPackages: { [dep: string]: string; }) {
  // regular dependencies
  const alphaDependencies: { [dep: string]: string; } = {};
  const constructsAndCdkLibDevDeps: { [dep: string]: string; } = {};
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
        }
    }
  }
  packageJson.dependencies = undefined;

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
        } else if (!v1DevDependency.startsWith('@aws-cdk/')) {
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

function shouldIgnoreFile(name: string): boolean {
  // .gitignore is not on the list, because pkglint checks it
  return [
    'dist',
    'node_modules',
    'coverage',
    '.nyc_output',
    'nyc.config.js',
    '.jsii',
    'tsconfig.json',
    'tsconfig.tsbuildinfo',
  ].indexOf(name) !== -1;
}

function getAlphaPackages(packages: any[]): { [dep: string]: string } {
  return packages
    .filter(packageIsAlpha)
    .reduce((acc, pkg: any) => {
      acc[pkg.name] = pkg.name.replace(/^@aws-cdk\//, '@aws-cdk-lib-alpha/');
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
