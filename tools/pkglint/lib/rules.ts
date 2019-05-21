import caseUtils = require('case');
import fs = require('fs');
import path = require('path');
import semver = require('semver');
import { LICENSE, NOTICE } from './licensing';
import { PackageJson, ValidationRule } from './packagejson';
import {
  deepGet, deepSet,
  expectDevDependency, expectJSON,
  fileShouldBe, fileShouldContain,
  findInnerPackages,
  monoRepoRoot, monoRepoVersion
} from './util';

/**
 * Verify that the package name matches the directory name
 */
export class PackageNameMatchesDirectoryName extends ValidationRule {
  public readonly name = 'naming/package-matches-directory';

  public validate(pkg: PackageJson): void {
    const parts = pkg.packageRoot.split(path.sep);

    const expectedName = parts[parts.length - 2].startsWith('@')
               ? parts.slice(parts.length - 2).join('/')
               : parts[parts.length - 1];

    expectJSON(this.name, pkg, 'name', expectedName);
  }
}

/**
 * Verify that all packages have a description
 */
export class DescriptionIsRequired extends ValidationRule {
  public readonly name = 'package-info/require-description';

  public validate(pkg: PackageJson): void {
    if (!pkg.json.description) {
      pkg.report({ ruleName: this.name, message: 'Description is required' });
    }
  }
}

/**
 * Repository must be our GitHub repo
 */
export class RepositoryCorrect extends ValidationRule {
  public readonly name = 'package-info/repository';

  public validate(pkg: PackageJson): void {
    expectJSON(this.name, pkg, 'repository.type', 'git');
    expectJSON(this.name, pkg, 'repository.url', 'https://github.com/awslabs/aws-cdk.git');
    const pkgDir = path.relative(monoRepoRoot(), pkg.packageRoot);
    expectJSON(this.name, pkg, 'repository.directory', pkgDir);
  }
}

/**
 * Homepage must point to the GitHub repository page.
 */
export class HomepageCorrect extends ValidationRule {
  public readonly name = 'package-info/homepage';

  public validate(pkg: PackageJson): void {
    expectJSON(this.name, pkg, 'homepage', 'https://github.com/awslabs/aws-cdk');
  }
}

/**
 * The license must be Apache-2.0.
 */
export class License extends ValidationRule {
  public readonly name = 'package-info/license';

  public validate(pkg: PackageJson): void {
    expectJSON(this.name, pkg, 'license', 'Apache-2.0');
  }
}

/**
 * There must be a license file that corresponds to the Apache-2.0 license.
 */
export class LicenseFile extends ValidationRule {
  public readonly name = 'license/license-file';

  public validate(pkg: PackageJson): void {
    fileShouldBe(this.name, pkg, 'LICENSE', LICENSE);
  }
}

/**
 * There must be a NOTICE file.
 */
export class NoticeFile extends ValidationRule {
  public readonly name = 'license/notice-file';

  public validate(pkg: PackageJson): void {
    fileShouldBe(this.name, pkg, 'NOTICE', NOTICE);
  }
}

/**
 * Author must be AWS (as an Organization)
 */
export class AuthorAWS extends ValidationRule {
  public readonly name = 'package-info/author';

  public validate(pkg: PackageJson): void {
    expectJSON(this.name, pkg, 'author.name', 'Amazon Web Services');
    expectJSON(this.name, pkg, 'author.url', 'https://aws.amazon.com');
    expectJSON(this.name, pkg, 'author.organization', true);
  }
}

/**
 * There must be a README.md file.
 */
export class ReadmeFile extends ValidationRule {
  public readonly name = 'package-info/README.md';

  public validate(pkg: PackageJson): void {
    const readmeFile = path.join(pkg.packageRoot, 'README.md');
    if (!fs.existsSync(readmeFile)) {
      pkg.report({
        ruleName: this.name,
        message: 'There must be a README.md file at the root of the package',
        fix: () => fs.writeFileSync(
          readmeFile,
          `## ${pkg.json.description}\nThis module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.`
        )
      });
    }
  }
}

/**
 * Keywords must contain CDK keywords and be sorted
 */
export class CDKKeywords extends ValidationRule {
  public readonly name = 'package-info/keywords';

  public validate(pkg: PackageJson): void {
    if (!pkg.json.keywords) {
      pkg.report({
        ruleName: this.name,
        message: 'Must have keywords',
        fix: () => { pkg.json.keywords = []; }
      });
    }

    const keywords = pkg.json.keywords || [];

    if (keywords.indexOf('cdk') === -1) {
      pkg.report({
        ruleName: this.name,
        message: 'Keywords must mention CDK',
        fix: () => { pkg.json.keywords.splice(0, 0, 'cdk'); }
      });
    }

    if (keywords.indexOf('aws') === -1) {
      pkg.report({
        ruleName: this.name,
        message: 'Keywords must mention AWS',
        fix: () => { pkg.json.keywords.splice(0, 0, 'aws'); }
      });
    }
  }
}

/**
 * JSII Java package is required and must look sane
 */
export class JSIIJavaPackageIsRequired extends ValidationRule {
  public readonly name = 'jsii/java';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const moduleName = cdkModuleName(pkg.json.name);

    expectJSON(this.name, pkg, 'jsii.targets.java.maven.groupId', 'software.amazon.awscdk');
    expectJSON(this.name, pkg, 'jsii.targets.java.maven.artifactId', moduleName.mavenArtifactId, /-/g);

    const java = deepGet(pkg.json, ['jsii', 'targets', 'java', 'package']) as string | undefined;
    expectJSON(this.name, pkg, 'jsii.targets.java.package', moduleName.javaPackage, /\./g);
    if (java) {
      const expectedPrefix = moduleName.javaPackage.split('.').slice(0, 3).join('.');
      const actualPrefix = java.split('.').slice(0, 3).join('.');
      if (expectedPrefix !== actualPrefix) {
        pkg.report({
          ruleName: this.name,
          message: `JSII "java" package must share the first 3 elements of the expected one: ${expectedPrefix} vs ${actualPrefix}`,
          fix: () => deepSet(pkg.json, ['jsii', 'targets', 'java', 'package'], moduleName.javaPackage)
        });
      }
    }
  }
}

export class JSIIPythonTarget extends ValidationRule {
  public readonly name = 'jsii/python';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const moduleName = cdkModuleName(pkg.json.name);

    expectJSON(this.name, pkg, 'jsii.targets.python.distName', moduleName.python.distName);
    expectJSON(this.name, pkg, 'jsii.targets.python.module', moduleName.python.module);
  }
}

export class CDKPackage extends ValidationRule {
  public readonly name = 'package-info/scripts/package';

  public validate(pkg: PackageJson): void {
    // skip private packages
    if (pkg.json.private) { return; }

    const merkleMarker = '.LAST_PACKAGE';

    expectJSON(this.name, pkg, 'scripts.package', 'cdk-package');

    const outdir = 'dist';

    // if this is
    if (isJSII(pkg)) {
      expectJSON(this.name, pkg, 'jsii.outdir', outdir);
    }

    fileShouldContain(this.name, pkg, '.npmignore', outdir);
    fileShouldContain(this.name, pkg, '.gitignore', outdir);
    fileShouldContain(this.name, pkg, '.npmignore', merkleMarker);
    fileShouldContain(this.name, pkg, '.gitignore', merkleMarker);
  }
}

export class NoTsBuildInfo extends ValidationRule {
  public readonly name = 'no-tsc-build-info';

  public validate(pkg: PackageJson): void {
    // skip private packages
    if (pkg.json.private) { return; }

    // Stop 'tsconfig.tsbuildinfo' and regular '.tsbuildinfo' files from being
    // published to NPM.
    // We might at some point also want to strip tsconfig.json but for now,
    // the TypeScript DOCS BUILD needs to it to load the typescript source.
    fileShouldContain(this.name, pkg, '.npmignore', '*.tsbuildinfo');
  }
}

/**
 * Verifies there is no dependency on "jsii" since it's defined at the repo
 * level.
 */
export class NoJsiiDep extends ValidationRule {
  public readonly name = 'dependencies/no-jsii';

  public validate(pkg: PackageJson): void {
    const predicate = (s: string) => s.startsWith('jsii');

    if (pkg.getDevDependency(predicate)) {
      pkg.report({
        ruleName: this.name,
        message: 'packages should not have a devDep on jsii since it is defined at the repo level',
        fix: () => pkg.removeDevDependency(predicate)
      });
    }
  }
}

/**
 * Verifies that the expected versions of node will be supported.
 */
export class NodeCompatibility extends ValidationRule {
  public readonly name = 'dependencies/node-version';

  public validate(pkg: PackageJson): void {
    const atTypesNode = pkg.getDevDependency('@types/node');
    if (atTypesNode && !atTypesNode.startsWith('^8.')) {
      pkg.report({
        ruleName: this.name,
        message: `packages must support node version 8 and up, but ${atTypesNode} is declared`,
        fix: () => pkg.addDevDependency('@types/node', '^8.10.38')
      });
    }
  }
}

/**
 * Verifies that the ``@types/`` dependencies are correctly recorded in ``devDependencies`` and not ``dependencies``.
 */
export class NoAtTypesInDependencies extends ValidationRule {
  public readonly name = 'dependencies/at-types';

  public validate(pkg: PackageJson): void {
    const predicate = (s: string) => s.startsWith('@types/');
    for (const dependency of pkg.getDependencies(predicate)) {
      pkg.report({
        ruleName: this.name,
        message: `dependency on ${dependency.name}@${dependency.version} must be in devDependencies`,
        fix: () => {
          pkg.addDevDependency(dependency.name, dependency.version);
          pkg.removeDependency(predicate);
        }
      });
    }
  }
}

/**
 * Computes the module name for various other purposes (java package, ...)
 */
function cdkModuleName(name: string) {
  const isCdkPkg = name === '@aws-cdk/cdk';

  name = name.replace(/^aws-cdk-/, '');
  name = name.replace(/^@aws-cdk\//, '');

  const dotnetSuffix = name.split('-')
    .map(s => s === 'aws' ? 'AWS' : caseUtils.pascal(s))
    .join('.');

  const pythonName = name.replace(/^@/g, "").replace(/\//g, ".").split(".").map(caseUtils.kebab).join(".");

  return {
    javaPackage: `software.amazon.awscdk${isCdkPkg ? '' : `.${name.replace(/^aws-/, 'services-').replace(/-/g, '.')}`}`,
    mavenArtifactId:
      isCdkPkg ? 'cdk'
               : name.startsWith('aws-') || name.startsWith('alexa-') ? name.replace(/^aws-/, '')
                                                                      : `cdk-${name}`,
    dotnetNamespace: `Amazon.CDK${isCdkPkg ? '' : `.${dotnetSuffix}`}`,
    python: {
      distName: `aws-cdk.${pythonName}`,
      module: `aws_cdk.${pythonName.replace(/-/g, "_")}`,
    },
  };
}

/**
 * JSII .NET namespace is required and must look sane
 */
export class JSIIDotNetNamespaceIsRequired extends ValidationRule {
  public readonly name = 'jsii/dotnet';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const dotnet = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'namespace']) as string | undefined;
    const moduleName = cdkModuleName(pkg.json.name);
    expectJSON(this.name, pkg, 'jsii.targets.dotnet.namespace', moduleName.dotnetNamespace, /\./g, /*case insensitive*/ true);

    if (dotnet) {
      const actualPrefix = dotnet.split('.').slice(0, 2).join('.');
      const expectedPrefix = moduleName.dotnetNamespace.split('.').slice(0, 2).join('.');
      if (actualPrefix !== expectedPrefix) {
        pkg.report({
          ruleName: this.name,
          message: `.NET namespace must share the first two segments of the default namespace, '${expectedPrefix}' vs '${actualPrefix}'`,
          fix: () => deepSet(pkg.json, ['jsii', 'targets', 'dotnet', 'namespace'], moduleName.dotnetNamespace)
        });
      }
    }
  }
}

/**
 * Strong-naming all .NET assemblies is required.
 */
export class JSIIDotNetStrongNameIsRequired extends ValidationRule {
  public readonly name = 'jsii/dotnet/strong-name';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const signAssembly = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'signAssembly']) as boolean | undefined;
    const signAssemblyExpected = true;
    if (signAssembly !== signAssemblyExpected) {
      pkg.report({
        ruleName: this.name,
        message: `.NET packages must have strong-name signing enabled.`,
        fix: () => deepSet(pkg.json, ['jsii', 'targets', 'dotnet', 'signAssembly'], signAssemblyExpected)
      });
    }

    const assemblyOriginatorKeyFile = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'assemblyOriginatorKeyFile']) as string | undefined;
    const assemblyOriginatorKeyFileExpected = "../../key.snk";
    if (assemblyOriginatorKeyFile !== assemblyOriginatorKeyFileExpected) {
      pkg.report({
        ruleName: this.name,
        message: `.NET packages must use the strong name key fetched by fetch-dotnet-snk.sh`,
        fix: () => deepSet(pkg.json, ['jsii', 'targets', 'dotnet', 'assemblyOriginatorKeyFile'], assemblyOriginatorKeyFileExpected)
      });
    }
  }
}

/**
 * The package must depend on cdk-build-tools
 */
export class MustDependOnBuildTools extends ValidationRule {
  public readonly name = 'dependencies/build-tools';

  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectDevDependency(this.name, pkg, 'cdk-build-tools', '^' + monoRepoVersion());
  }
}

/**
 * Build script must be 'cdk-build'
 */
export class MustUseCDKBuild extends ValidationRule {
  public readonly name = 'package-info/scripts/build';

  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectJSON(this.name, pkg, 'scripts.build', 'cdk-build');

    // cdk-build will write a hash file that we have to ignore.
    const merkleMarker = '.LAST_BUILD';
    fileShouldContain(this.name, pkg, '.gitignore', merkleMarker);
    fileShouldContain(this.name, pkg, '.npmignore', merkleMarker);
  }
}

/**
 * Dependencies in both regular and peerDependencies must agree in semver
 *
 * In particular, verify that depVersion satisfies peerVersion. This prevents
 * us from instructing NPM to construct impossible closures, where we say:
 *
 *    peerDependency: A@1.0.0
 *    dependency: A@2.0.0
 *
 * There is no version of A that would satisfy this.
 *
 * The other way around is not necessary--the depVersion can be bumped without
 * bumping the peerVersion (if the API didn't change this may be perfectly
 * valid). This prevents us from restricting a user's potential combinations of
 * libraries unnecessarily.
 */
export class RegularDependenciesMustSatisfyPeerDependencies extends ValidationRule {
  public readonly name = 'dependencies/peer-dependencies-satisfied';

  public validate(pkg: PackageJson): void {
    for (const [depName, peerVersion] of Object.entries(pkg.peerDependencies)) {
      const depVersion = pkg.dependencies[depName];
      if (depVersion === undefined) { continue; }

      // Make sure that depVersion satisfies peerVersion.
      if (!semver.intersects(depVersion, peerVersion)) {
        pkg.report({
          ruleName: this.name,
          message: `dependency ${depName}: concrete version ${depVersion} does not match peer version '${peerVersion}'`,
          fix: () => pkg.addPeerDependency(depName, depVersion)
        });
      }
    }
  }
}

export class MustIgnoreSNK extends ValidationRule {
  public readonly name = 'ignore/strong-name-key';

  public validate(pkg: PackageJson): void {
    fileShouldContain(this.name, pkg, '.npmignore', '*.snk');
    fileShouldContain(this.name, pkg, '.gitignore', '*.snk');
  }
}

export class NpmIgnoreForJsiiModules extends ValidationRule {
  public readonly name = 'ignore/jsii';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    fileShouldContain(this.name, pkg, '.npmignore',
      '*.ts',
      '!*.d.ts',
      '!*.js',
      'coverage',
      '.nyc_output',
      '*.tgz',
    );
  }
}

/**
 * nodeunit and @types/nodeunit must appear in devDependencies if
 * the test script uses "nodeunit"
 */
export class GlobalDevDependencies extends ValidationRule {
  public readonly name = 'dependencies/global-dev';

  public validate(pkg: PackageJson): void {

    const deps = [
      'typescript',
      'tslint',
      'nodeunit',
      '@types/nodeunit',
      '@types/node',
      'nyc'
    ];

    for (const dep of deps) {
      if (pkg.getDevDependency(dep)) {
        pkg.report({
          ruleName: this.name,
          message: `devDependency ${dep} is defined at the repo level`,
          fix: () => pkg.removeDevDependency(dep)
        });
      }
    }
  }
}

/**
 * Must use 'cdk-watch' command
 */
export class MustUseCDKWatch extends ValidationRule {
  public readonly name = 'package-info/scripts/watch';

  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectJSON(this.name, pkg, 'scripts.watch', 'cdk-watch');
  }
}

/**
 * Must use 'cdk-test' command
 */
export class MustUseCDKTest extends ValidationRule {
  public readonly name = 'package-info/scripts/test';

  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }
    if (!hasTestDirectory(pkg)) { return; }

    expectJSON(this.name, pkg, 'scripts.test', 'cdk-test');

    // 'cdk-test' will calculate coverage, so have the appropriate
    // files in .gitignore.
    fileShouldContain(this.name, pkg, '.gitignore', '.nyc_output');
    fileShouldContain(this.name, pkg, '.gitignore', 'coverage');
    fileShouldContain(this.name, pkg, '.gitignore', '.nycrc');
  }
}

/**
 * Must declare minimum node version
 */
export class MustHaveNodeEnginesDeclaration extends ValidationRule {
  public readonly name = 'package-info/engines';

  public validate(pkg: PackageJson): void {
    expectJSON(this.name, pkg, 'engines.node', '>= 8.10.0');
  }
}

/**
 * Scripts that run integ tests must also have the individual 'integ' script to update them
 *
 * This commands comes from the dev-dependency cdk-integ-tools.
 */
export class MustHaveIntegCommand extends ValidationRule {
  public readonly name = 'package-info/scripts/integ';

  public validate(pkg: PackageJson): void {
    if (!hasIntegTests(pkg)) { return; }

    expectJSON(this.name, pkg, 'scripts.integ', 'cdk-integ');
    expectDevDependency(this.name, pkg, 'cdk-integ-tools', '^' + monoRepoVersion());
  }
}

export class PkgLintAsScript extends ValidationRule {
  public readonly name = 'package-info/scripts/pkglint';

  public validate(pkg: PackageJson): void {
    const script = 'pkglint -f';

    expectDevDependency(this.name, pkg, 'pkglint', '^' + monoRepoVersion());

    if (!pkg.npmScript('pkglint')) {
      pkg.report({
        ruleName: this.name,
        message: 'a script called "pkglint" must be included to allow fixing package linting issues',
        fix: () => pkg.changeNpmScript('pkglint', () => script)
      });
    }

    if (pkg.npmScript('pkglint') !== script) {
      pkg.report({
        ruleName: this.name,
        message: 'the pkglint script should be: ' + script,
        fix: () => pkg.changeNpmScript('pkglint', () => script)
      });
    }
  }
}

export class NoStarDeps extends ValidationRule {
  public readonly name = 'dependencies/no-star';

  public validate(pkg: PackageJson) {
    reportStarDeps(this.name, pkg.json.depedencies);
    reportStarDeps(this.name, pkg.json.devDependencies);

    function reportStarDeps(ruleName: string, deps?: any) {
      deps = deps || {};
      Object.keys(deps).forEach(d => {
        if (deps[d] === '*') {
          pkg.report({
            ruleName,
            message: `star dependency not allowed for ${d}`
          });
        }
      });
    }
  }
}

interface VersionCount {
  version: string;
  count: number;
}

/**
 * All consumed versions of dependencies must be the same
 *
 * NOTE: this rule will only be useful when validating multiple package.jsons at the same time
 */
export class AllVersionsTheSame extends ValidationRule {
  public readonly name = 'dependencies/versions-consistent';

  private readonly ourPackages: {[pkg: string]: string} = {};
  private readonly usedDeps: {[pkg: string]: VersionCount[]} = {};

  public prepare(pkg: PackageJson): void {
    this.ourPackages[pkg.json.name] = "^" + pkg.json.version;
    this.recordDeps(pkg.json.dependencies);
    this.recordDeps(pkg.json.devDependencies);
  }

  public validate(pkg: PackageJson): void {
    this.validateDeps(pkg, 'dependencies');
    this.validateDeps(pkg, 'devDependencies');
  }

  private recordDeps(deps: {[pkg: string]: string} | undefined) {
    if (!deps) { return; }

    Object.keys(deps).forEach(dep => {
      this.recordDep(dep, deps[dep]);
    });
  }

  private validateDeps(pkg: PackageJson, section: string) {
    if (!pkg.json[section]) { return; }

    Object.keys(pkg.json[section]).forEach(dep => {
      this.validateDep(pkg, section, dep);
    });
  }

  private recordDep(dep: string, version: string) {
    if (version === '*') {
      // '*' does not give us info, so skip
      return;
    }

    if (!(dep in this.usedDeps)) {
      this.usedDeps[dep] = [];
    }

    const i = this.usedDeps[dep].findIndex(vc => vc.version === version);
    if (i === -1) {
      this.usedDeps[dep].push({ version, count: 1 });
    } else {
      this.usedDeps[dep][i].count += 1;
    }
  }

  private validateDep(pkg: PackageJson, depField: string, dep: string) {
    if (dep in this.ourPackages) {
      expectJSON(this.name, pkg, depField + '.' + dep, this.ourPackages[dep]);
      return;
    }

    // Otherwise, must match the majority version declaration. Might be empty if we only
    // have '*', in which case that's fine.
    if (!(dep in this.usedDeps)) { return; }

    const versions = this.usedDeps[dep];
    versions.sort((a, b) => b.count - a.count);
    expectJSON(this.name, pkg, depField + '.' + dep, versions[0].version);
  }
}

export class AwsLint extends ValidationRule {
  public readonly name = 'awslint';

  public validate(pkg: PackageJson) {
    if (!isJSII(pkg)) {
      return;
    }

    if (!isAWS(pkg)) {
      return;
    }

    expectJSON(this.name, pkg, 'scripts.awslint', 'cdk-awslint');
  }
}

export class Cfn2Ts extends ValidationRule {
  public readonly name = 'cfn2ts';

  public validate(pkg: PackageJson) {
    if (!isJSII(pkg)) {
      return;
    }

    if (!isAWS(pkg)) {
      return;
    }

    expectJSON(this.name, pkg, 'scripts.cfn2ts', 'cfn2ts');
  }
}

export class JestCoverageTarget extends ValidationRule {
  public readonly name = 'jest-coverage-target';

  public validate(pkg: PackageJson) {
    if (pkg.json.jest) {
      // We enforce the key exists, but the value is just a default
      const defaults: { [key: string]: number } = {
        branches: 80,
        statements: 80
      };
      for (const key of Object.keys(defaults)) {
        const deepPath = ['coverageThreshold', 'global', key];
        const setting = deepGet(pkg.json.jest, deepPath);
        if (setting == null) {
          pkg.report({
            ruleName: this.name,
            message: `When jest is used, jest.coverageThreshold.global.${key} must be set`,
            fix: () => {
              deepSet(pkg.json.jest, deepPath, defaults[key]);
            },
          });
        }
      }
    }
  }
}

/**
 * Packages inside JSII packages (typically used for embedding Lambda handles)
 * must only have dev dependencies and their node_modules must have been
 * blacklisted for publishing
 *
 * We might loosen this at some point but we'll have to bundle all runtime dependencies
 * and we don't have good transitive license checks.
 */
export class PackageInJsiiPackageNoRuntimeDeps extends ValidationRule {
  public readonly name = 'lambda-packages-no-runtime-deps';

  public validate(pkg: PackageJson) {
    if (!isJSII(pkg)) { return; }

    for (const inner of findInnerPackages(pkg.packageRoot)) {
      const innerPkg = PackageJson.fromDirectory(inner);

      if (Object.keys(innerPkg.dependencies).length > 0) {
        pkg.report({
          ruleName: `${this.name}:1`,
          message: `NPM Package '${innerPkg.packageName}' inside jsii package can only have devDepencencies`
        });
      }

      const nodeModulesRelPath = path.relative(pkg.packageRoot, innerPkg.packageRoot) + '/node_modules';
      fileShouldContain(`${this.name}:2`, pkg, '.npmignore', nodeModulesRelPath);
    }
  }
}

/**
 * Requires packages to have fast-fail build scripts, allowing to combine build, test and package in a single command.
 * This involves two targets: `build:test:pack` and `build:test` (to skip the pack).
 */
export class FastFailingBuildScripts extends ValidationRule {
  public readonly name = 'fast-failing-build-scripts';

  public validate(pkg: PackageJson) {
    const scripts = pkg.json.scripts || {};

    const hasTest = 'test' in scripts;
    const hasPack = 'package' in scripts;

    const cmdBuild = 'npm run build';
    expectJSON(this.name, pkg, 'scripts.build:test', hasTest ? [cmdBuild, 'npm test'].join(' && ') : cmdBuild);

    const cmdBuildTest = 'npm run build:test';
    expectJSON(this.name, pkg, 'scripts.build:test:package', hasPack ? [cmdBuildTest, 'npm run package'].join(' && ') : cmdBuildTest);
  }
}

/**
 * Determine whether this is a JSII package
 *
 * A package is a JSII package if there is 'jsii' section in the package.json
 */
function isJSII(pkg: PackageJson): boolean {
  return pkg.json.jsii;
}

/**
 * Indicates that this is an "AWS" package (i.e. that it it has a cloudformation source)
 * @param pkg
 */
function isAWS(pkg: PackageJson): boolean {
  return pkg.json['cdk-build'] && pkg.json['cdk-build'].cloudformation;
}

/**
 * Determine whether the package has tests
 *
 * A package has tests if the root/test directory exists
 */
function hasTestDirectory(pkg: PackageJson) {
  return fs.existsSync(path.join(pkg.packageRoot, 'test'));
}

/**
 * Whether this package has integ tests
 *
 * A package has integ tests if it mentions 'cdk-integ' in the "test" script.
 */
function hasIntegTests(pkg: PackageJson) {
  if (!hasTestDirectory(pkg)) { return false; }

  const files = fs.readdirSync(path.join(pkg.packageRoot, 'test'));
  return files.some(p => p.startsWith('integ.'));
}

/**
 * Return whether this package should use CDK build tools
 */
function shouldUseCDKBuildTools(pkg: PackageJson) {
  // The packages that DON'T use CDKBuildTools are the package itself
  // and the packages used by it.
  return pkg.packageName !== 'cdk-build-tools' && pkg.packageName !== 'merkle-build';
}
