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
  monoRepoRoot,
  monoRepoVersion,
} from './util';

// tslint:disable-next-line: no-var-requires
const AWS_SERVICE_NAMES = require('./aws-service-official-names.json');

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
    expectJSON(this.name, pkg, 'repository.url', 'https://github.com/aws/aws-cdk.git');
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
    expectJSON(this.name, pkg, 'homepage', 'https://github.com/aws/aws-cdk');
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

    const scopes = pkg.json['cdk-build'] && pkg.json['cdk-build'].cloudformation;
    if (!scopes) {
      return;
    }
    const scope: string = typeof scopes === 'string' ? scopes : scopes[0];
    const serviceName = AWS_SERVICE_NAMES[scope];

    const headline = serviceName && `${serviceName} Construct Library`;

    if (!fs.existsSync(readmeFile)) {
      pkg.report({
        ruleName: this.name,
        message: 'There must be a README.md file at the root of the package',
        fix: () => fs.writeFileSync(
          readmeFile,
          [
            `## ${headline || pkg.json.description}`,
            'This module is part of the[AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.'
          ].join('\n')
        )
      });
    } else if (headline) {
      const requiredFirstLine = `## ${headline}`;
      const [firstLine, ...rest] = fs.readFileSync(readmeFile, { encoding: 'utf8' }).split('\n');
      if (firstLine !== requiredFirstLine) {
        pkg.report({
          ruleName: this.name,
          message: `The title of the README.md file must be "${headline}"`,
          fix: () => fs.writeFileSync(readmeFile, [requiredFirstLine, ...rest].join('\n')),
        });
      }
    }
  }
}

/**
 * There must be a stability setting, and that the appropriate banner is present in the README.md file.
 */
export class StabilitySetting extends ValidationRule {
  public readonly name = 'package-info/stability';

  public validate(pkg: PackageJson): void {
    if (pkg.json.private) {
      // Does not apply to private packages!
      return;
    }

    let stability = pkg.json.stability;
    switch (stability) {
      case 'experimental':
      case 'stable':
      case 'deprecated':
        if (pkg.json.deprecated && stability !== 'deprecated') {
          pkg.report({
            ruleName: this.name,
            message: `Package is deprecated, but is marked with stability "${stability}"`,
            fix: () => pkg.json.stability = 'deprecated',
          });
          stability = 'deprecated';
        }
        break;
      default:
        const defaultStability = pkg.json.deprecated ? 'deprecated' : 'experimental';
        pkg.report({
          ruleName: this.name,
          message: `Invalid stability configuration in package.json: ${JSON.stringify(stability)}`,
          fix: () => pkg.json.stability = defaultStability,
        });
        stability = defaultStability;
    }
    this.validateReadmeHasBanner(pkg, stability);
  }

  private validateReadmeHasBanner(pkg: PackageJson, stability: string) {
    const badge = this.readmeBadge(stability);
    if (!badge) {
      // Somehow, we don't have a badge for this stability level
      return;
    }
    const readmeFile = path.join(pkg.packageRoot, 'README.md');
    if (!fs.existsSync(readmeFile)) {
      // Presence of the file is asserted by another rule
      return;
    }
    const readmeContent = fs.readFileSync(readmeFile, { encoding: 'utf8' });
    const badgeRegex = new RegExp(badge.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\w+/g, '\\w+'));
    if (!badgeRegex.test(readmeContent)) {
      // Removing a possible old, now invalid stability indication from the README.md before adding a new one
      const [title, ...body] = readmeContent.replace(/<!--BEGIN STABILITY BANNER-->(?:.|\n)+<!--END STABILITY BANNER-->\n+/m, '').split('\n');
      pkg.report({
        ruleName: this.name,
        message: `Missing stability banner for ${stability} in README.md file`,
        fix: () => fs.writeFileSync(readmeFile, [title, badge, ...body].join('\n')),
      });
    }
  }

  private readmeBadge(stability: string) {
    switch (stability) {
      case 'deprecated':
        return _div(
          { label: 'Deprecated', color: 'critical' },
          'This API may emit warnings. Backward compatibility is not guaranteed.',
        );
      case 'experimental':
        return _div(
          { label: 'Experimental', color: 'important' },
          '**This is a _developer preview_ (public beta) module. Releases might lack important features and might have',
          'future breaking changes.**',
          '',
          'This API is still under active development and subject to non-backward',
          'compatible changes or removal in any future version. Use of the API is not recommended in production',
          'environments. Experimental APIs are not subject to the Semantic Versioning model.',
        );
      case 'stable':
        return _div(
          { label: 'Stable', color: 'success' },
        );
      default:
        return undefined;
    }

    function _div(badge: { label: string, color: string }, ...messages: string[]) {
      return [
        '<!--BEGIN STABILITY BANNER-->',
        '',
        '---',
        '',
        `![Stability: ${badge.label}](https://img.shields.io/badge/stability-${badge.label}-${badge.color}.svg?style=for-the-badge)`,
        '',
        ...messages.map(message => `> ${message}`.trimRight()),
        '',
        '---',
        '<!--END STABILITY BANNER-->',
        '',
      ].join('\n');
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

export class DeveloperPreviewVersionLabels extends ValidationRule {
  public readonly name = 'jsii/developer-preview-version-label';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    expectJSON(this.name, pkg, 'jsii.targets.java.maven.versionSuffix', '.DEVPREVIEW');
    expectJSON(this.name, pkg, 'jsii.targets.dotnet.versionSuffix', '-devpreview');
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
    if (atTypesNode && !atTypesNode.startsWith('^10.')) {
      pkg.report({
        ruleName: this.name,
        message: `packages must support node version 10 and up, but ${atTypesNode} is declared`,
        fix: () => pkg.addDevDependency('@types/node', '^10.17.5')
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

function isCdkModuleName(name: string) {
  return !!name.match(/^@aws-cdk\//);
}

/**
 * Computes the module name for various other purposes (java package, ...)
 */
function cdkModuleName(name: string) {
  const isCdkPkg = name === '@aws-cdk/core';
  const isLegacyCdkPkg = name === '@aws-cdk/cdk';

  name = name.replace(/^aws-cdk-/, '');
  name = name.replace(/^@aws-cdk\//, '');

  const dotnetSuffix = name.split('-')
    .map(s => s === 'aws' ? 'AWS' : caseUtils.pascal(s))
    .join('.');

  const pythonName = name.replace(/^@/g, "").replace(/\//g, ".").split(".").map(caseUtils.kebab).join(".");

  return {
    javaPackage: `software.amazon.awscdk${isLegacyCdkPkg ? '' : `.${name.replace(/^aws-/, 'services-').replace(/-/g, '.')}`}`,
    mavenArtifactId:
      isLegacyCdkPkg ? 'cdk'
        : isCdkPkg ? 'core'
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

    // skip the legacy @aws-cdk/cdk because we actually did not rename
    // the .NET module, so we are not publishing the deprecated one
    if (pkg.packageName === '@aws-cdk/cdk') { return; }

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
 * JSII .NET namespace is required and must look sane
 */
export class JSIIDotNetIconUrlIsRequired extends ValidationRule {
  public readonly name = 'jsii/dotnet/icon-url';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    const CDK_LOGO_URL = 'https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png';
    expectJSON(this.name, pkg, 'jsii.targets.dotnet.iconUrl', CDK_LOGO_URL);
  }
}

/**
 * Strong-naming all .NET assemblies is required.
 */
export class JSIIDotNetStrongNameIsRequired extends ValidationRule {
  public readonly name = 'jsii/dotnet/strong-name';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return; }

    // skip the legacy @aws-cdk/cdk because we actually did not rename
    // the .NET module, so we are not publishing the deprecated one
    if (pkg.packageName === '@aws-cdk/cdk') { return; }

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

    expectDevDependency(this.name,
      pkg,
      'cdk-build-tools',
      `${require('../../cdk-build-tools/package.json').version}`);
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

/**
 * Check that dependencies on @aws-cdk/ packages use point versions (not version ranges).
 */
export class MustDependonCdkByPointVersions extends ValidationRule {
  public readonly name = 'dependencies/cdk-point-dependencies';

  public validate(pkg: PackageJson): void {
    const expectedVersion = monoRepoVersion();

    for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
      if (isCdkModuleName(depName) && depVersion !== expectedVersion) {

        pkg.report({
          ruleName: this.name,
          message: `dependency ${depName}: dependency version must be ${expectedVersion}`,
          fix: () => pkg.addDependency(depName, expectedVersion)
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
      // '@types/node', // we tend to get @types/node 12.x from transitive closures now, it breaks builds.
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
    expectJSON(this.name, pkg, 'engines.node', '>= 10.3.0');
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
    expectDevDependency(this.name,
      pkg,
      'cdk-integ-tools',
      `${require('../../cdk-integ-tools/package.json').version}`);
  }
}

/**
 * Checks API backwards compatibility against the latest released version.
 */
export class CompatScript extends ValidationRule {
  public readonly name = 'package-info/scripts/compat';

  public validate(pkg: PackageJson): void {
    if (!isJSII(pkg)) { return ; }

    expectJSON(this.name, pkg, 'scripts.compat', 'cdk-compat');
  }
}

export class PkgLintAsScript extends ValidationRule {
  public readonly name = 'package-info/scripts/pkglint';

  public validate(pkg: PackageJson): void {
    const script = 'pkglint -f';

    expectDevDependency(this.name, pkg, 'pkglint', `${require('../package.json').version}`);

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
    this.ourPackages[pkg.json.name] = `^${pkg.json.version}`;
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
 * This involves two targets: `build+test:pack` and `build+test` (to skip the pack).
 */
export class FastFailingBuildScripts extends ValidationRule {
  public readonly name = 'fast-failing-build-scripts';

  public validate(pkg: PackageJson) {
    const scripts = pkg.json.scripts || {};

    const hasTest = 'test' in scripts;
    const hasPack = 'package' in scripts;

    const cmdBuild = 'npm run build';
    expectJSON(this.name, pkg, 'scripts.build+test', hasTest ? [cmdBuild, 'npm test'].join(' && ') : cmdBuild);

    const cmdBuildTest = 'npm run build+test';
    expectJSON(this.name, pkg, 'scripts.build+test+package', hasPack ? [cmdBuildTest, 'npm run package'].join(' && ') : cmdBuildTest);
  }
}

export class YarnNohoistBundledDependencies extends ValidationRule {
  public readonly name = 'yarn/nohoist-bundled-dependencies';

  public validate(pkg: PackageJson) {
    const bundled: string[] = pkg.json.bundleDependencies || pkg.json.bundledDependencies || [];
    if (bundled.length === 0) { return; }

    const repoPackageJson = path.resolve(__dirname, '../../../package.json');

    const nohoist: string[] = require(repoPackageJson).workspaces.nohoist;

    const missing = new Array<string>();
    for (const dep of bundled) {
      for (const entry of [`${pkg.packageName}/${dep}`, `${pkg.packageName}/${dep}/**`]) {
        if (nohoist.indexOf(entry) >= 0) { continue; }
        missing.push(entry);
      }
    }

    if (missing.length > 0) {
      pkg.report({
        ruleName: this.name,
        message: `Repository-level 'workspaces.nohoist' directive is missing: ${missing.join(', ')}`,
        fix: () => {
          const packageJson = require(repoPackageJson);
          packageJson.workspaces.nohoist = [...packageJson.workspaces.nohoist, ...missing].sort();
          fs.writeFileSync(repoPackageJson, `${JSON.stringify(packageJson, null, 2)}\n`, { encoding: 'utf8' });
        },
      });
    }
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
