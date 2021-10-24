import { PackageJson, ValidationRule } from './packagejson';
/**
 * Verify that the package name matches the directory name
 */
export declare class PackageNameMatchesDirectoryName extends ValidationRule {
    readonly name = "naming/package-matches-directory";
    validate(pkg: PackageJson): void;
}
/**
 * Verify that all packages have a description
 */
export declare class DescriptionIsRequired extends ValidationRule {
    readonly name = "package-info/require-description";
    validate(pkg: PackageJson): void;
}
/**
 * Verify that all packages have a publishConfig with a publish tag set.
 */
export declare class PublishConfigTagIsRequired extends ValidationRule {
    readonly name = "package-info/publish-config-tag";
    validate(pkg: PackageJson): void;
}
/**
 * Verify cdk.out directory is included in npmignore since we should not be
 * publishing it.
 */
export declare class CdkOutMustBeNpmIgnored extends ValidationRule {
    readonly name = "package-info/npm-ignore-cdk-out";
    validate(pkg: PackageJson): void;
}
/**
 * Repository must be our GitHub repo
 */
export declare class RepositoryCorrect extends ValidationRule {
    readonly name = "package-info/repository";
    validate(pkg: PackageJson): void;
}
/**
 * Homepage must point to the GitHub repository page.
 */
export declare class HomepageCorrect extends ValidationRule {
    readonly name = "package-info/homepage";
    validate(pkg: PackageJson): void;
}
/**
 * The license must be Apache-2.0.
 */
export declare class License extends ValidationRule {
    readonly name = "package-info/license";
    validate(pkg: PackageJson): void;
}
/**
 * There must be a license file that corresponds to the Apache-2.0 license.
 */
export declare class LicenseFile extends ValidationRule {
    readonly name = "license/license-file";
    validate(pkg: PackageJson): void;
}
/**
 * There must be a NOTICE file.
 */
export declare class NoticeFile extends ValidationRule {
    readonly name = "license/notice-file";
    validate(pkg: PackageJson): void;
}
/**
 * NOTICE files must contain 3rd party attributions
 */
export declare class ThirdPartyAttributions extends ValidationRule {
    readonly name = "license/3p-attributions";
    validate(pkg: PackageJson): void;
}
/**
 * Author must be AWS (as an Organization)
 */
export declare class AuthorAWS extends ValidationRule {
    readonly name = "package-info/author";
    validate(pkg: PackageJson): void;
}
/**
 * There must be a README.md file.
 */
export declare class ReadmeFile extends ValidationRule {
    readonly name = "package-info/README.md";
    validate(pkg: PackageJson): void;
}
/**
 * All packages must have a "maturity" declaration.
 *
 * The banner in the README must match the package maturity.
 *
 * As a way to seed the settings, if 'maturity' is missing but can
 * be auto-derived from 'stability', that will be the fix (otherwise
 * there is no fix).
 */
export declare class MaturitySetting extends ValidationRule {
    readonly name = "package-info/maturity";
    validate(pkg: PackageJson): void;
    private validateReadmeHasBanner;
    private readmeBadge;
    private determinePackageLevels;
}
/**
 * There must be a stability setting, and it must match the package maturity.
 *
 * Maturity setting is leading here (as there are more options than the
 * stability setting), but the stability setting must be present for `jsii`
 * to properly read and encode it into the assembly.
 */
export declare class StabilitySetting extends ValidationRule {
    readonly name = "package-info/stability";
    validate(pkg: PackageJson): void;
}
export declare class FeatureStabilityRule extends ValidationRule {
    readonly name = "package-info/feature-stability";
    private readonly badges;
    validate(pkg: PackageJson): void;
    private featureEntries;
    private bannerNotices;
}
/**
 * Keywords must contain CDK keywords and be sorted
 */
export declare class CDKKeywords extends ValidationRule {
    readonly name = "package-info/keywords";
    validate(pkg: PackageJson): void;
}
/**
 * Requires projectReferences to be set in the jsii configuration.
 */
export declare class JSIIProjectReferences extends ValidationRule {
    readonly name = "jsii/project-references";
    validate(pkg: PackageJson): void;
}
export declare class NoPeerDependenciesMonocdk extends ValidationRule {
    readonly name = "monocdk/no-peer";
    private readonly allowedPeer;
    private readonly modules;
    validate(pkg: PackageJson): void;
}
/**
 * Validates that the same version of `constructs` is used wherever a dependency
 * is specified, so that they must all be udpated at the same time (through an
 * update to this rule).
 *
 * Note: v1 and v2 use different versions respectively.
 */
export declare class ConstructsVersion extends ValidationRule {
    readonly name = "deps/constructs";
    private readonly expectedRange;
    validate(pkg: PackageJson): void;
}
/**
 * JSII Java package is required and must look sane
 */
export declare class JSIIJavaPackageIsRequired extends ValidationRule {
    readonly name = "jsii/java";
    validate(pkg: PackageJson): void;
}
export declare class JSIIPythonTarget extends ValidationRule {
    readonly name = "jsii/python";
    validate(pkg: PackageJson): void;
}
export declare class CDKPackage extends ValidationRule {
    readonly name = "package-info/scripts/package";
    validate(pkg: PackageJson): void;
}
export declare class NoTsBuildInfo extends ValidationRule {
    readonly name = "npmignore/tsbuildinfo";
    validate(pkg: PackageJson): void;
}
export declare class NoTestsInNpmPackage extends ValidationRule {
    readonly name = "npmignore/test";
    validate(pkg: PackageJson): void;
}
export declare class NoTsConfig extends ValidationRule {
    readonly name = "npmignore/tsconfig";
    validate(pkg: PackageJson): void;
}
export declare class IncludeJsiiInNpmTarball extends ValidationRule {
    readonly name = "npmignore/jsii-included";
    validate(pkg: PackageJson): void;
}
/**
 * Verifies there is no dependency on "jsii" since it's defined at the repo
 * level.
 */
export declare class NoJsiiDep extends ValidationRule {
    readonly name = "dependencies/no-jsii";
    validate(pkg: PackageJson): void;
}
/**
 * Verifies that the expected versions of node will be supported.
 */
export declare class NodeCompatibility extends ValidationRule {
    readonly name = "dependencies/node-version";
    validate(pkg: PackageJson): void;
}
/**
 * Verifies that the ``@types/`` dependencies are correctly recorded in ``devDependencies`` and not ``dependencies``.
 */
export declare class NoAtTypesInDependencies extends ValidationRule {
    readonly name = "dependencies/at-types";
    validate(pkg: PackageJson): void;
}
/**
 * JSII .NET namespace is required and must look sane
 */
export declare class JSIIDotNetNamespaceIsRequired extends ValidationRule {
    readonly name = "jsii/dotnet";
    validate(pkg: PackageJson): void;
}
/**
 * JSII .NET namespace is required and must look sane
 */
export declare class JSIIDotNetIconUrlIsRequired extends ValidationRule {
    readonly name = "jsii/dotnet/icon-url";
    validate(pkg: PackageJson): void;
}
/**
 * The package must depend on cdk-build-tools
 */
export declare class MustDependOnBuildTools extends ValidationRule {
    readonly name = "dependencies/build-tools";
    validate(pkg: PackageJson): void;
}
/**
 * Build script must be 'cdk-build'
 */
export declare class MustUseCDKBuild extends ValidationRule {
    readonly name = "package-info/scripts/build";
    validate(pkg: PackageJson): void;
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
export declare class RegularDependenciesMustSatisfyPeerDependencies extends ValidationRule {
    readonly name = "dependencies/peer-dependencies-satisfied";
    validate(pkg: PackageJson): void;
}
/**
 * Check that dependencies on @aws-cdk/ packages use point versions (not version ranges)
 * and that they are also defined in `peerDependencies`.
 */
export declare class MustDependonCdkByPointVersions extends ValidationRule {
    readonly name = "dependencies/cdk-point-dependencies";
    validate(pkg: PackageJson): void;
}
export declare class MustIgnoreSNK extends ValidationRule {
    readonly name = "ignore/strong-name-key";
    validate(pkg: PackageJson): void;
}
export declare class MustIgnoreJunitXml extends ValidationRule {
    readonly name = "ignore/junit";
    validate(pkg: PackageJson): void;
}
export declare class NpmIgnoreForJsiiModules extends ValidationRule {
    readonly name = "ignore/jsii";
    validate(pkg: PackageJson): void;
}
/**
 * Must use 'cdk-watch' command
 */
export declare class MustUseCDKWatch extends ValidationRule {
    readonly name = "package-info/scripts/watch";
    validate(pkg: PackageJson): void;
}
/**
 * Must have 'rosetta:extract' command if this package is JSII-enabled.
 */
export declare class MustHaveRosettaExtract extends ValidationRule {
    readonly name = "package-info/scripts/rosetta:extract";
    validate(pkg: PackageJson): void;
}
/**
 * Must use 'cdk-test' command
 */
export declare class MustUseCDKTest extends ValidationRule {
    readonly name = "package-info/scripts/test";
    validate(pkg: PackageJson): void;
}
/**
 * Must declare minimum node version
 */
export declare class MustHaveNodeEnginesDeclaration extends ValidationRule {
    readonly name = "package-info/engines";
    validate(pkg: PackageJson): void;
}
/**
 * Scripts that run integ tests must also have the individual 'integ' script to update them
 *
 * This commands comes from the dev-dependency cdk-integ-tools.
 */
export declare class MustHaveIntegCommand extends ValidationRule {
    readonly name = "package-info/scripts/integ";
    validate(pkg: PackageJson): void;
}
/**
 * Checks API backwards compatibility against the latest released version.
 */
export declare class CompatScript extends ValidationRule {
    readonly name = "package-info/scripts/compat";
    validate(pkg: PackageJson): void;
}
export declare class PkgLintAsScript extends ValidationRule {
    readonly name = "package-info/scripts/pkglint";
    validate(pkg: PackageJson): void;
}
export declare class NoStarDeps extends ValidationRule {
    readonly name = "dependencies/no-star";
    validate(pkg: PackageJson): void;
}
/**
 * All consumed versions of dependencies must be the same
 *
 * NOTE: this rule will only be useful when validating multiple package.jsons at the same time
 */
export declare class AllVersionsTheSame extends ValidationRule {
    readonly name = "dependencies/versions-consistent";
    private readonly ourPackages;
    private readonly usedDeps;
    prepare(pkg: PackageJson): void;
    validate(pkg: PackageJson): void;
    private recordDeps;
    private validateDeps;
    private recordDep;
    private validateDep;
}
export declare class AwsLint extends ValidationRule {
    readonly name = "awslint";
    validate(pkg: PackageJson): void;
}
export declare class Cfn2Ts extends ValidationRule {
    readonly name = "cfn2ts";
    validate(pkg: PackageJson): void;
}
/**
 * Packages inside JSII packages (typically used for embedding Lambda handles)
 * must only have dev dependencies and their node_modules must have been
 * blacklisted for publishing
 *
 * We might loosen this at some point but we'll have to bundle all runtime dependencies
 * and we don't have good transitive license checks.
 */
export declare class PackageInJsiiPackageNoRuntimeDeps extends ValidationRule {
    readonly name = "lambda-packages-no-runtime-deps";
    validate(pkg: PackageJson): void;
}
/**
 * Requires packages to have fast-fail build scripts, allowing to combine build, test and package in a single command.
 * This involves two targets: `build+test:pack` and `build+test` (to skip the pack).
 */
export declare class FastFailingBuildScripts extends ValidationRule {
    readonly name = "fast-failing-build-scripts";
    validate(pkg: PackageJson): void;
}
export declare class YarnNohoistBundledDependencies extends ValidationRule {
    readonly name = "yarn/nohoist-bundled-dependencies";
    validate(pkg: PackageJson): void;
}
export declare class ConstructsDependency extends ValidationRule {
    readonly name = "constructs/dependency";
    validate(pkg: PackageJson): void;
}
/**
 * Do not announce new versions of AWS CDK modules in awscdk.io because it is very very spammy
 * and actually causes the @awscdkio twitter account to be blocked.
 *
 * https://github.com/construct-catalog/catalog/issues/24
 * https://github.com/construct-catalog/catalog/pull/22
 */
export declare class DoNotAnnounceInCatalog extends ValidationRule {
    readonly name = "catalog/no-announce";
    validate(pkg: PackageJson): void;
}
export declare class EslintSetup extends ValidationRule {
    readonly name = "package-info/eslint";
    validate(pkg: PackageJson): void;
}
export declare class JestSetup extends ValidationRule {
    readonly name = "package-info/jest.config";
    validate(pkg: PackageJson): void;
}
export declare class UbergenPackageVisibility extends ValidationRule {
    readonly name = "ubergen/package-visibility";
    private readonly publicPackages;
    validate(pkg: PackageJson): void;
}
