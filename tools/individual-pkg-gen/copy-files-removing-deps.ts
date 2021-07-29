import * as path from 'path';
import * as awsCdkMigration from 'aws-cdk-migration';
import * as fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');

copyFilesRemovingDependencies();

function copyFilesRemovingDependencies(): void {
  // there is a lerna.json in the individual-packages directory, where this script executes
  const project = new lerna_project.Project(__dirname);
  const packages = project.getPackagesSync();
  const alphaPackages = getAlphaPackages(packages);
  const jsiiRosettaVersion = project.manifest.devDependencies['jsii-rosetta'];
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

      let fileProcessed = false;
      if (sourceFileName === 'package.json') {
        const phase1PackageJson = fs.readJsonSync(source);
        if (phase1PackageJson.name === pkg.name) {
          const pkgUnscopedName = `${pkg.name.substring('@aws-cdk/'.length)}`;

          phase1PackageJson.name = `@aws-cdk-lib-alpha/${pkgUnscopedName}`;
          phase1PackageJson.repository.directory = `packages/individual-packages/${pkgUnscopedName}`;

          // disable awslint (some rules are hard-coded to @aws-cdk/core)
          phase1PackageJson.awslint = {
            exclude: ['*:*'],
          };

          // add a pkglint exemption for the 'package name = dir name' rule
          const pkglint = phase1PackageJson.pkglint || {};
          pkglint.exclude = [
            ...(pkglint.exclude || []),
            'naming/package-matches-directory',
            // the experimental packages need the "real" assert dependency
            'assert/assert-dependency',
          ];
          phase1PackageJson.pkglint = pkglint;

          // turn off the L1 generation, which uses @aws-cdk/ modules
          if (phase1PackageJson.scripts?.gen === 'cfn2ts') {
            delete phase1PackageJson.scripts.gen;
          }

          /* ****** handle dependencies ****** */

          // regular dependencies
          const alphaDependencies: { [dep: string]: string } = {};
          for (const dependency of Object.keys(phase1PackageJson.dependencies || {})) {
            // all 'regular' dependencies on alpha modules will be converted to
            // a pair of devDependency on '0.0.0' and peerDependency on '^0.0.0',
            // and the package will have no regular dependencies anymore
            if (alphaPackages[dependency]) {
              alphaDependencies[alphaPackages[dependency]] = pkg.version;
            }
          }
          phase1PackageJson.dependencies = undefined;

          const finalPackageJson = { ...phase1PackageJson };
          // devDependencies
          const alphaDevDependencies: { [dep: string]: string } = {
            // we need jsii-rosetta in the dependencies,
            // otherwise the binary cannot be found when running the 'extract' script
            'jsii-rosetta': jsiiRosettaVersion,
          };
          const devDependencies = phase1PackageJson.devDependencies || {};
          for (const devDependency of Object.keys(devDependencies)) {
            if (devDependency.startsWith('@aws-cdk/')) {
              delete devDependencies[devDependency];
            }
            if (alphaPackages[devDependency]) {
              alphaDevDependencies[alphaPackages[devDependency]] = pkg.version;
            }
          }
          devDependencies['@aws-cdk/assert'] = pkg.version;
          devDependencies['aws-cdk-lib'] = pkg.version;
          devDependencies.constructs = '^10.0.0';
          // we save the devDependencies in a temporary key in package.json
          finalPackageJson.devDependencies = {
            ...devDependencies,
            ...alphaDevDependencies,
            ...alphaDependencies,
          };
          phase1PackageJson.devDependencies = {
            ...alphaDevDependencies,
            ...alphaDependencies,
          };

          // peer dependencies
          finalPackageJson.peerDependencies = {
            'aws-cdk-lib': `^${pkg.version}`,
            'constructs': '^10.0.0',
            ...(Object.keys(alphaDependencies)
              .reduce((acc, alphaDependency) => {
                acc[alphaDependency] = `^${pkg.version}`;
                return acc;
              }, {} as { [dep: string]: string })),
          };
          phase1PackageJson.peerDependencies = undefined;

          fileProcessed = true;
          fs.writeJsonSync(destination, phase1PackageJson, { spaces: 2 });
          fs.writeJsonSync(path.join(destDir, '_package.json'), finalPackageJson, { spaces: 2 });
        }
      } else if (sourceFileName === '.gitignore') {
        // ignore everything, otherwise there are uncommitted files present in testing,
        // because the module's .gitignore file has entries like !.eslintrc.js
        fileProcessed = true;
        const gitIgnoreContents = fs.readFileSync(source);
        fs.outputFileSync(destination, Buffer.concat([gitIgnoreContents, Buffer.from('\n*\n')]));
      } else if (sourceFileName === '.eslintrc.js') {
        // Our ESLint configuration prevents importing libraries not in 'dependencies',
        // which is against our philosophy for experimental modules (which use peerDependencies).
        // Given that, remove that rule from the ESLint configuration of that module
        fileProcessed = true;
        const esLintRcContents = fs.readFileSync(source);
        fs.outputFileSync(destination, Buffer.concat([esLintRcContents,
          Buffer.from("\ndelete baseConfig.rules['import/no-extraneous-dependencies'];\n")]));
      } else if (sourceFileName.endsWith('.ts') && !sourceFileName.endsWith('.d.ts')) {
        fileProcessed = true;
        const sourceCode = fs.readFileSync(source).toString();
        const sourceCodeOutput = awsCdkMigration.rewriteImports(sourceCode, sourceFileName, {
          customModules: alphaPackages,
        });
        fs.outputFileSync(destination, sourceCodeOutput);
      }

      if (fileProcessed) {
        continue;
      }

      const stat = fs.statSync(source);
      if (stat.isDirectory()) {
        copyOrTransformFiles(pkg, source, destination);
      } else {
        fs.copySync(source, destination);
      }
    }
  }
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
