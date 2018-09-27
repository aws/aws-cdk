import caseUtils = require('case');
import fs = require('fs');
import path = require('path');
import { LICENSE, NOTICE } from './licensing';
import { PackageJson, ValidationRule } from './packagejson';
import { deepGet, deepSet, expectDevDependency, expectJSON, fileShouldBe, fileShouldContain, monoRepoVersion } from './util';

/**
 * Verify that the package name matches the directory name
 */
export class PackageNameMatchesDirectoryName extends ValidationRule {
  public validate(pkg: PackageJson): void {
    const parts = pkg.packageRoot.split(path.sep);

    const expectedName = parts[parts.length - 2].startsWith('@')
               ? parts.slice(parts.length - 2).join('/')
               : parts[parts.length - 1];

    expectJSON(pkg, 'name', expectedName);
  }
}

/**
 * Verify that all packages have a description
 */
export class DescriptionIsRequired extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!pkg.json.description) {
      pkg.report({ message: 'Description is required' });
    }
  }
}

/**
 * Repository must be our GitHub repo
 */
export class RepositoryCorrect extends ValidationRule {
  public validate(pkg: PackageJson): void {
    expectJSON(pkg, 'repository.type', 'git');
    expectJSON(pkg, 'repository.url', 'https://github.com/awslabs/aws-cdk.git');
  }
}

/**
 * Homepage must point to the GitHub repository page.
 */
export class HomepageCorrect extends ValidationRule {
  public validate(pkg: PackageJson): void {
    expectJSON(pkg, 'homepage', 'https://github.com/awslabs/aws-cdk');
  }
}

/**
 * The license must be Apache-2.0.
 */
export class License extends ValidationRule {
  public validate(pkg: PackageJson): void {
    expectJSON(pkg, 'license', 'Apache-2.0');
  }
}

/**
 * There must be a license file that corresponds to the Apache-2.0 license.
 */
export class LicenseFile extends ValidationRule {
  public validate(pkg: PackageJson): void {
    fileShouldBe(pkg, 'LICENSE', LICENSE);
  }
}

/**
 * There must be a NOTICE file.
 */
export class NoticeFile extends ValidationRule {
  public validate(pkg: PackageJson): void {
    fileShouldBe(pkg, 'NOTICE', NOTICE);
  }
}

/**
 * Author must be AWS (as an Organization)
 */
export class AuthorAWS extends ValidationRule {
  public validate(pkg: PackageJson): void {
    expectJSON(pkg, 'author.name', 'Amazon Web Services');
    expectJSON(pkg, 'author.url', 'https://aws.amazon.com');
    expectJSON(pkg, 'author.organization', true);
  }
}

/**
 * There must be a README.md file.
 */
export class ReadmeFile extends ValidationRule {
  public validate(pkg: PackageJson): void {
    const readmeFile = path.join(pkg.packageRoot, 'README.md');
    if (!fs.existsSync(readmeFile)) {
      pkg.report({
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
  public validate(pkg: PackageJson): void {
    if (!pkg.json.keywords) {
      pkg.report({
        message: 'Must have keywords',
        fix: () => { pkg.json.keywords = []; }
      });
    }

    const keywords = pkg.json.keywords || [];

    if (keywords.indexOf('cdk') === -1) {
      pkg.report({
        message: 'Keywords must mention CDK',
        fix: () => { pkg.json.keywords.splice(0, 0, 'cdk'); }
      });
    }

    if (keywords.indexOf('aws') === -1) {
      pkg.report({
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
  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const moduleName = cdkModuleName(pkg.json.name);

    expectJSON(pkg, 'jsii.targets.java.maven.groupId', 'software.amazon.awscdk');
    expectJSON(pkg, 'jsii.targets.java.maven.artifactId', moduleName.mavenArtifactId, /-/g);

    const java = deepGet(pkg.json, ['jsii', 'targets', 'java', 'package']) as string | undefined;
    expectJSON(pkg, 'jsii.targets.java.package', moduleName.javaPackage, /\./g);
    if (java) {
      const expectedPrefix = moduleName.javaPackage.split('.').slice(0, 3).join('.');
      const actualPrefix = java.split('.').slice(0, 3).join('.');
      if (expectedPrefix !== actualPrefix) {
        pkg.report({
          message: `JSII "java" package must share the first 3 elements of the expected one: ${expectedPrefix} vs ${actualPrefix}`,
          fix: () => deepSet(pkg.json, ['jsii', 'targets', 'java', 'package'], moduleName.javaPackage)
        });
      }
    }
  }
}

export class JSIISphinxTarget extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }
    expectJSON(pkg, 'jsii.targets.sphinx', { });
  }
}

export class CDKPackage extends ValidationRule {
  public validate(pkg: PackageJson): void {
    // skip private packages
    if (pkg.json.private) { return; }

    const merkleMarker = '.LAST_PACKAGE';

    expectJSON(pkg, 'scripts.package', 'cdk-package');

    const outdir = 'dist';

    // if this is
    if (isJSII(pkg)) {
      expectJSON(pkg, 'jsii.outdir', outdir);
    }

    fileShouldContain(pkg, '.npmignore', outdir);
    fileShouldContain(pkg, '.gitignore', outdir);
    fileShouldContain(pkg, '.npmignore', merkleMarker);
    fileShouldContain(pkg, '.gitignore', merkleMarker);
  }
}

/**
 * Verifies there is no dependency on "jsii" since it's defined at the repo
 * level.
 */
export class NoJsiiDep extends ValidationRule {
  public validate(pkg: PackageJson): void {
    const predicate = (s: string) => s.startsWith('jsii');

    if (pkg.getDevDependency(predicate)) {
      pkg.report({
        message: 'packages should not have a devDep on jsii since it is defined at the repo level',
        fix: () => pkg.removeDevDependency(predicate)
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

  return {
    javaPackage: `software.amazon.awscdk${isCdkPkg ? '' : `.${name.replace(/^aws-/, 'services-').replace(/-/g, '.')}`}`,
    mavenArtifactId: isCdkPkg ? 'cdk'
                  : name.startsWith('aws-') ? name.replace(/^aws-/, '')
                              : `cdk-${name}`,
    dotnetNamespace: `Amazon.CDK${isCdkPkg ? '' : `.${dotnetSuffix}`}`
  };
}

/**
 * JSII .NET namespace is required and must look sane
 */
export class JSIIDotNetNamespaceIsRequired extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const dotnet = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'namespace']) as string | undefined;
    const moduleName = cdkModuleName(pkg.json.name);
    expectJSON(pkg, 'jsii.targets.dotnet.namespace', moduleName.dotnetNamespace, /\./g, /*case insensitive*/ true);

    if (dotnet) {
      const actualPrefix = dotnet.split('.').slice(0, 2).join('.');
      const expectedPrefix = moduleName.dotnetNamespace.split('.').slice(0, 2).join('.');
      if (actualPrefix !== expectedPrefix) {
        pkg.report({
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
  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const signAssembly = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'signAssembly']) as boolean | undefined;
    const signAssemblyExpected = true;
    if (signAssembly !== signAssemblyExpected) {
      pkg.report({
        message: `.NET packages must have strong-name signing enabled.`,
        fix: () => deepSet(pkg.json, ['jsii', 'targets', 'dotnet', 'signAssembly'], signAssemblyExpected)
      });
    }

    const assemblyOriginatorKeyFile = deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'assemblyOriginatorKeyFile']) as string | undefined;
    const assemblyOriginatorKeyFileExpected = "../../key.snk";
    if (assemblyOriginatorKeyFile !== assemblyOriginatorKeyFileExpected) {
      pkg.report({
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
  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectDevDependency(pkg, 'cdk-build-tools', '^' + monoRepoVersion());
  }
}

/**
 * Build script must be 'cdk-build'
 */
export class MustUseCDKBuild extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectJSON(pkg, 'scripts.build', 'cdk-build');

    // cdk-build will write a hash file that we have to ignore.
    const merkleMarker = '.LAST_BUILD';
    fileShouldContain(pkg, '.gitignore', merkleMarker);
    fileShouldContain(pkg, '.npmignore', merkleMarker);
  }
}

export class NpmIgnoreForJsiiModules extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    fileShouldContain(pkg, '.npmignore',
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
  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }

    expectJSON(pkg, 'scripts.watch', 'cdk-watch');
  }
}

/**
 * Must use 'cdk-test' command
 */
export class MustUseCDKTest extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!shouldUseCDKBuildTools(pkg)) { return; }
    if (!hasTestDirectory(pkg)) { return; }

    expectJSON(pkg, 'scripts.test', 'cdk-test');

    // 'cdk-test' will calculate coverage, so have the appropriate
    // files in .gitignore.
    fileShouldContain(pkg, '.gitignore', '.nyc_output');
    fileShouldContain(pkg, '.gitignore', 'coverage');
    fileShouldContain(pkg, '.gitignore', '.nycrc');
  }
}

/**
 * Scripts that run integ tests must also have the individual 'integ' script to update them
 *
 * This commands comes from the dev-dependency cdk-integ-tools.
 */
export class MustHaveIntegCommand extends ValidationRule {
  public validate(pkg: PackageJson): void {
    if (!hasIntegTests(pkg)) { return; }

    expectJSON(pkg, 'scripts.integ', 'cdk-integ');
    expectDevDependency(pkg, 'cdk-integ-tools', '^' + monoRepoVersion());
  }
}

export class PkgLintAsScript extends ValidationRule {
  public validate(pkg: PackageJson): void {
    const script = 'pkglint -f';

    expectDevDependency(pkg, 'pkglint', '^' + monoRepoVersion());

    if (!pkg.npmScript('pkglint')) {
      pkg.report({
        message: 'a script called "pkglint" must be included to allow fixing package linting issues',
        fix: () => pkg.changeNpmScript('pkglint', () => script)
      });
    }

    if (pkg.npmScript('pkglint') !== script) {
      pkg.report({
        message: 'the pkglint script should be: ' + script,
        fix: () => pkg.changeNpmScript('pkglint', () => script)
      });
    }
  }
}

export class NoStarDeps extends ValidationRule {
  public validate(pkg: PackageJson) {
    reportStarDeps(pkg.json.depedencies);
    reportStarDeps(pkg.json.devDependencies);

    function reportStarDeps(deps?: any) {
      deps = deps || {};
      Object.keys(deps).forEach(d => {
        if (deps[d] === '*') {
          pkg.report({
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
  private readonly ourPackages: {[pkg: string]: string} = {};
  private readonly usedDeps: {[pkg: string]: VersionCount[]} = {};

  constructor() {
    super();
  }

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
      expectJSON(pkg, depField + '.' + dep, this.ourPackages[dep]);
      return;
    }

    // Otherwise, must match the majority version declaration. Might be empty if we only
    // have '*', in which case that's fine.
    if (!(dep in this.usedDeps)) { return; }

    const versions = this.usedDeps[dep];
    versions.sort((a, b) => b.count - a.count);
    expectJSON(pkg, depField + '.' + dep, versions[0].version);
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
