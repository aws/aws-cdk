"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UbergenPackageVisibility = exports.JestSetup = exports.EslintSetup = exports.DoNotAnnounceInCatalog = exports.ConstructsDependency = exports.YarnNohoistBundledDependencies = exports.FastFailingBuildScripts = exports.PackageInJsiiPackageNoRuntimeDeps = exports.Cfn2Ts = exports.AwsLint = exports.AllVersionsTheSame = exports.NoStarDeps = exports.PkgLintAsScript = exports.CompatScript = exports.MustHaveIntegCommand = exports.MustHaveNodeEnginesDeclaration = exports.MustUseCDKTest = exports.MustHaveRosettaExtract = exports.MustUseCDKWatch = exports.NpmIgnoreForJsiiModules = exports.MustIgnoreJunitXml = exports.MustIgnoreSNK = exports.MustDependonCdkByPointVersions = exports.RegularDependenciesMustSatisfyPeerDependencies = exports.MustUseCDKBuild = exports.MustDependOnBuildTools = exports.JSIIDotNetIconUrlIsRequired = exports.JSIIDotNetNamespaceIsRequired = exports.NoAtTypesInDependencies = exports.NodeCompatibility = exports.NoJsiiDep = exports.IncludeJsiiInNpmTarball = exports.NoTsConfig = exports.NoTestsInNpmPackage = exports.NoTsBuildInfo = exports.CDKPackage = exports.JSIIPythonTarget = exports.JSIIJavaPackageIsRequired = exports.ConstructsVersion = exports.NoPeerDependenciesMonocdk = exports.JSIIProjectReferences = exports.CDKKeywords = exports.FeatureStabilityRule = exports.StabilitySetting = exports.MaturitySetting = exports.ReadmeFile = exports.AuthorAWS = exports.ThirdPartyAttributions = exports.NoticeFile = exports.LicenseFile = exports.License = exports.HomepageCorrect = exports.RepositoryCorrect = exports.CdkOutMustBeNpmIgnored = exports.PublishConfigTagIsRequired = exports.DescriptionIsRequired = exports.PackageNameMatchesDirectoryName = void 0;
const fs = require("fs");
const path = require("path");
const caseUtils = require("case");
const glob = require("glob");
const semver = require("semver");
const licensing_1 = require("./licensing");
const packagejson_1 = require("./packagejson");
const util_1 = require("./util");
const AWS_SERVICE_NAMES = require('./aws-service-official-names.json'); // eslint-disable-line @typescript-eslint/no-require-imports
/**
 * Verify that the package name matches the directory name
 */
class PackageNameMatchesDirectoryName extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'naming/package-matches-directory';
    }
    validate(pkg) {
        const parts = pkg.packageRoot.split(path.sep);
        const expectedName = parts[parts.length - 2].startsWith('@')
            ? parts.slice(parts.length - 2).join('/')
            : parts[parts.length - 1];
        util_1.expectJSON(this.name, pkg, 'name', expectedName);
    }
}
exports.PackageNameMatchesDirectoryName = PackageNameMatchesDirectoryName;
/**
 * Verify that all packages have a description
 */
class DescriptionIsRequired extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/require-description';
    }
    validate(pkg) {
        if (!pkg.json.description) {
            pkg.report({ ruleName: this.name, message: 'Description is required' });
        }
    }
}
exports.DescriptionIsRequired = DescriptionIsRequired;
/**
 * Verify that all packages have a publishConfig with a publish tag set.
 */
class PublishConfigTagIsRequired extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/publish-config-tag';
    }
    validate(pkg) {
        var _a;
        if (pkg.json.private) {
            return;
        }
        // While v2 is still under development, we publish all v2 packages with the 'next'
        // distribution tag, while still tagging all v1 packages as 'latest'.
        // The one exception is 'aws-cdk-lib', since it's a new package for v2.
        const newV2Packages = ['aws-cdk-lib'];
        const defaultPublishTag = (cdkMajorVersion() === 2 && !newV2Packages.includes(pkg.json.name)) ? 'next' : 'latest';
        if (((_a = pkg.json.publishConfig) === null || _a === void 0 ? void 0 : _a.tag) !== defaultPublishTag) {
            pkg.report({
                ruleName: this.name,
                message: `publishConfig.tag must be ${defaultPublishTag}`,
                fix: (() => {
                    var _a;
                    const publishConfig = (_a = pkg.json.publishConfig) !== null && _a !== void 0 ? _a : {};
                    publishConfig.tag = defaultPublishTag;
                    pkg.json.publishConfig = publishConfig;
                }),
            });
        }
    }
}
exports.PublishConfigTagIsRequired = PublishConfigTagIsRequired;
/**
 * Verify cdk.out directory is included in npmignore since we should not be
 * publishing it.
 */
class CdkOutMustBeNpmIgnored extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/npm-ignore-cdk-out';
    }
    validate(pkg) {
        const npmIgnorePath = path.join(pkg.packageRoot, '.npmignore');
        if (fs.existsSync(npmIgnorePath)) {
            const npmIgnore = fs.readFileSync(npmIgnorePath);
            if (!npmIgnore.includes('**/cdk.out')) {
                pkg.report({
                    ruleName: this.name,
                    message: `${npmIgnorePath}: Must exclude **/cdk.out`,
                    fix: () => fs.writeFileSync(npmIgnorePath, `${npmIgnore}\n# exclude cdk artifacts\n**/cdk.out`),
                });
            }
        }
    }
}
exports.CdkOutMustBeNpmIgnored = CdkOutMustBeNpmIgnored;
/**
 * Repository must be our GitHub repo
 */
class RepositoryCorrect extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/repository';
    }
    validate(pkg) {
        util_1.expectJSON(this.name, pkg, 'repository.type', 'git');
        util_1.expectJSON(this.name, pkg, 'repository.url', 'https://github.com/aws/aws-cdk.git');
        const pkgDir = path.relative(util_1.monoRepoRoot(), pkg.packageRoot);
        util_1.expectJSON(this.name, pkg, 'repository.directory', pkgDir);
    }
}
exports.RepositoryCorrect = RepositoryCorrect;
/**
 * Homepage must point to the GitHub repository page.
 */
class HomepageCorrect extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/homepage';
    }
    validate(pkg) {
        util_1.expectJSON(this.name, pkg, 'homepage', 'https://github.com/aws/aws-cdk');
    }
}
exports.HomepageCorrect = HomepageCorrect;
/**
 * The license must be Apache-2.0.
 */
class License extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/license';
    }
    validate(pkg) {
        util_1.expectJSON(this.name, pkg, 'license', 'Apache-2.0');
    }
}
exports.License = License;
/**
 * There must be a license file that corresponds to the Apache-2.0 license.
 */
class LicenseFile extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'license/license-file';
    }
    validate(pkg) {
        util_1.fileShouldBe(this.name, pkg, 'LICENSE', licensing_1.LICENSE);
    }
}
exports.LicenseFile = LicenseFile;
/**
 * There must be a NOTICE file.
 */
class NoticeFile extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'license/notice-file';
    }
    validate(pkg) {
        util_1.fileShouldBeginWith(this.name, pkg, 'NOTICE', ...licensing_1.NOTICE.split('\n'));
    }
}
exports.NoticeFile = NoticeFile;
/**
 * NOTICE files must contain 3rd party attributions
 */
class ThirdPartyAttributions extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'license/3p-attributions';
    }
    validate(pkg) {
        var _a, _b;
        const alwaysCheck = ['monocdk', 'aws-cdk-lib'];
        if (pkg.json.private && !alwaysCheck.includes(pkg.json.name)) {
            return;
        }
        const bundled = pkg.getAllBundledDependencies().filter(dep => !dep.startsWith('@aws-cdk'));
        const attribution = (_b = (_a = pkg.json.pkglint) === null || _a === void 0 ? void 0 : _a.attribution) !== null && _b !== void 0 ? _b : [];
        const noticePath = path.join(pkg.packageRoot, 'NOTICE');
        const lines = fs.existsSync(noticePath)
            ? fs.readFileSync(noticePath, { encoding: 'utf8' }).split('\n')
            : [];
        const re = /^\*\* (\S+)/;
        const attributions = lines.filter(l => re.test(l)).map(l => l.match(re)[1]);
        for (const dep of bundled) {
            if (!attributions.includes(dep)) {
                pkg.report({
                    message: `Missing attribution for bundled dependency '${dep}' in NOTICE file.`,
                    ruleName: this.name,
                });
            }
        }
        for (const attr of attributions) {
            if (!bundled.includes(attr) && !attribution.includes(attr)) {
                pkg.report({
                    message: `Unnecessary attribution found for dependency '${attr}' in NOTICE file. Attribution is determined from package.json (all "bundledDependencies" or the list in "pkglint.attribution")`,
                    ruleName: this.name,
                });
            }
        }
    }
}
exports.ThirdPartyAttributions = ThirdPartyAttributions;
/**
 * Author must be AWS (as an Organization)
 */
class AuthorAWS extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/author';
    }
    validate(pkg) {
        util_1.expectJSON(this.name, pkg, 'author.name', 'Amazon Web Services');
        util_1.expectJSON(this.name, pkg, 'author.url', 'https://aws.amazon.com');
        util_1.expectJSON(this.name, pkg, 'author.organization', true);
    }
}
exports.AuthorAWS = AuthorAWS;
/**
 * There must be a README.md file.
 */
class ReadmeFile extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/README.md';
    }
    validate(pkg) {
        const readmeFile = path.join(pkg.packageRoot, 'README.md');
        const scopes = pkg.json['cdk-build'] && pkg.json['cdk-build'].cloudformation;
        if (!scopes) {
            return;
        }
        if (pkg.packageName === '@aws-cdk/core') {
            return;
        }
        const scope = typeof scopes === 'string' ? scopes : scopes[0];
        const serviceName = AWS_SERVICE_NAMES[scope];
        const headline = serviceName && `${serviceName} Construct Library`;
        if (!fs.existsSync(readmeFile)) {
            pkg.report({
                ruleName: this.name,
                message: 'There must be a README.md file at the root of the package',
                fix: () => fs.writeFileSync(readmeFile, [
                    `# ${headline || pkg.json.description}`,
                    'This module is part of the[AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.',
                ].join('\n')),
            });
        }
        else if (headline) {
            const requiredFirstLine = `# ${headline}`;
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
exports.ReadmeFile = ReadmeFile;
/**
 * All packages must have a "maturity" declaration.
 *
 * The banner in the README must match the package maturity.
 *
 * As a way to seed the settings, if 'maturity' is missing but can
 * be auto-derived from 'stability', that will be the fix (otherwise
 * there is no fix).
 */
class MaturitySetting extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/maturity';
    }
    validate(pkg) {
        if (pkg.json.private) {
            // Does not apply to private packages!
            return;
        }
        if (pkg.json.features) {
            // Skip this in favour of the FeatureStabilityRule.
            return;
        }
        let maturity = pkg.json.maturity;
        const stability = pkg.json.stability;
        if (!maturity) {
            let fix;
            if (stability && ['stable', 'deprecated'].includes(stability)) {
                // We can autofix!
                fix = () => pkg.json.maturity = stability;
                maturity = stability;
            }
            pkg.report({
                ruleName: this.name,
                message: `Package is missing "maturity" setting (expected one of ${Object.keys(MATURITY_TO_STABILITY)})`,
                fix,
            });
        }
        if (pkg.json.deprecated && maturity !== 'deprecated') {
            pkg.report({
                ruleName: this.name,
                message: `Package is deprecated, but is marked with maturity "${maturity}"`,
                fix: () => pkg.json.maturity = 'deprecated',
            });
            maturity = 'deprecated';
        }
        const packageLevels = this.determinePackageLevels(pkg);
        const hasL1s = packageLevels.some(level => level === 'l1');
        const hasL2s = packageLevels.some(level => level === 'l2');
        if (hasL2s) {
            // validate that a package that contains L2s does not declare a 'cfn-only' maturity
            if (maturity === 'cfn-only') {
                pkg.report({
                    ruleName: this.name,
                    message: "Package that contains any L2s cannot declare a 'cfn-only' maturity",
                    fix: () => pkg.json.maturity = 'experimental',
                });
            }
        }
        else if (hasL1s) {
            // validate that a package that contains only L1s declares a 'cfn-only' maturity
            if (maturity !== 'cfn-only') {
                pkg.report({
                    ruleName: this.name,
                    message: "Package that contains only L1s cannot declare a maturity other than 'cfn-only'",
                    fix: () => pkg.json.maturity = 'cfn-only',
                });
            }
        }
        if (maturity) {
            this.validateReadmeHasBanner(pkg, maturity, packageLevels);
        }
    }
    validateReadmeHasBanner(pkg, maturity, levelsPresent) {
        const badge = this.readmeBadge(maturity, levelsPresent);
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
        const badgeRegex = toRegExp(badge);
        if (!badgeRegex.test(readmeContent)) {
            // Removing a possible old, now invalid stability indication from the README.md before adding a new one
            const [title, ...body] = readmeContent.replace(/<!--BEGIN STABILITY BANNER-->(?:.|\n)+<!--END STABILITY BANNER-->\n+/m, '').split('\n');
            pkg.report({
                ruleName: this.name,
                message: `Missing stability banner for ${maturity} in README.md file`,
                fix: () => fs.writeFileSync(readmeFile, [title, badge, ...body].join('\n')),
            });
        }
    }
    readmeBadge(maturity, levelsPresent) {
        const bannerContents = levelsPresent
            .map(level => fs.readFileSync(path.join(__dirname, 'banners', `${level}.${maturity}.md`), { encoding: 'utf-8' }).trim())
            .join('\n\n')
            .trim();
        const bannerLines = bannerContents.split('\n').map(s => s.trimRight());
        return [
            '<!--BEGIN STABILITY BANNER-->',
            '',
            '---',
            '',
            ...bannerLines,
            '',
            '---',
            '',
            '<!--END STABILITY BANNER-->',
            '',
        ].join('\n');
    }
    determinePackageLevels(pkg) {
        var _a;
        // Used to determine L1 by the presence of a .generated.ts file, but that depends
        // on the source having been built. Much more robust to look at the build INSTRUCTIONS
        // to see if this package has L1s.
        const hasL1 = !!((_a = pkg.json['cdk-build']) === null || _a === void 0 ? void 0 : _a.cloudformation);
        const libFiles = glob.sync('lib/**/*.ts', {
            ignore: 'lib/**/*.d.ts',
        });
        const hasL2 = libFiles.some(f => !f.endsWith('.generated.ts') && !f.endsWith('index.ts'));
        return [
            ...hasL1 ? ['l1'] : [],
            // If we don't have L1, then at least always paste in the L2 banner
            ...hasL2 || !hasL1 ? ['l2'] : [],
        ];
    }
}
exports.MaturitySetting = MaturitySetting;
const MATURITY_TO_STABILITY = {
    'cfn-only': 'experimental',
    'experimental': 'experimental',
    'developer-preview': 'experimental',
    'stable': 'stable',
    'deprecated': 'deprecated',
};
/**
 * There must be a stability setting, and it must match the package maturity.
 *
 * Maturity setting is leading here (as there are more options than the
 * stability setting), but the stability setting must be present for `jsii`
 * to properly read and encode it into the assembly.
 */
class StabilitySetting extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/stability';
    }
    validate(pkg) {
        if (pkg.json.private) {
            // Does not apply to private packages!
            return;
        }
        if (pkg.json.features) {
            // Skip this in favour of the FeatureStabilityRule.
            return;
        }
        const maturity = pkg.json.maturity;
        const stability = pkg.json.stability;
        const expectedStability = maturity ? MATURITY_TO_STABILITY[maturity] : undefined;
        if (!stability || (expectedStability && stability !== expectedStability)) {
            pkg.report({
                ruleName: this.name,
                message: `stability is '${stability}', but based on maturity is expected to be '${expectedStability}'`,
                fix: expectedStability ? (() => pkg.json.stability = expectedStability) : undefined,
            });
        }
    }
}
exports.StabilitySetting = StabilitySetting;
class FeatureStabilityRule extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/feature-stability';
        this.badges = {
            'Not Implemented': 'https://img.shields.io/badge/not--implemented-black.svg?style=for-the-badge',
            'Experimental': 'https://img.shields.io/badge/experimental-important.svg?style=for-the-badge',
            'Developer Preview': 'https://img.shields.io/badge/developer--preview-informational.svg?style=for-the-badge',
            'Stable': 'https://img.shields.io/badge/stable-success.svg?style=for-the-badge',
        };
    }
    validate(pkg) {
        if (pkg.json.private || !pkg.json.features) {
            return;
        }
        const featuresColumnWitdh = Math.max(13, // 'CFN Resources'.length
        ...pkg.json.features.map((feat) => feat.name.length));
        const stabilityBanner = [
            '<!--BEGIN STABILITY BANNER-->',
            '',
            '---',
            '',
            `Features${' '.repeat(featuresColumnWitdh - 8)} | Stability`,
            `--------${'-'.repeat(featuresColumnWitdh - 8)}-|-----------${'-'.repeat(Math.max(0, 100 - featuresColumnWitdh - 13))}`,
            ...this.featureEntries(pkg, featuresColumnWitdh),
            '',
            ...this.bannerNotices(pkg),
            '---',
            '',
            '<!--END STABILITY BANNER-->',
            '',
        ].join('\n');
        const readmeFile = path.join(pkg.packageRoot, 'README.md');
        if (!fs.existsSync(readmeFile)) {
            // Presence of the file is asserted by another rule
            return;
        }
        const readmeContent = fs.readFileSync(readmeFile, { encoding: 'utf8' });
        const stabilityRegex = toRegExp(stabilityBanner);
        if (!stabilityRegex.test(readmeContent)) {
            const [title, ...body] = readmeContent.replace(/<!--BEGIN STABILITY BANNER-->(?:.|\n)+<!--END STABILITY BANNER-->\n+/m, '').split('\n');
            pkg.report({
                ruleName: this.name,
                message: 'Stability banner does not match as expected',
                fix: () => fs.writeFileSync(readmeFile, [title, stabilityBanner, ...body].join('\n')),
            });
        }
    }
    featureEntries(pkg, featuresColumnWitdh) {
        var _a;
        const entries = [];
        if ((_a = pkg.json['cdk-build']) === null || _a === void 0 ? void 0 : _a.cloudformation) {
            entries.push(`CFN Resources${' '.repeat(featuresColumnWitdh - 13)} | ![Stable](${this.badges.Stable})`);
        }
        pkg.json.features.forEach((feature) => {
            const badge = this.badges[feature.stability];
            if (!badge) {
                throw new Error(`Unknown stability - ${feature.stability}`);
            }
            entries.push(`${feature.name}${' '.repeat(featuresColumnWitdh - feature.name.length)} | ![${feature.stability}](${badge})`);
        });
        return entries;
    }
    bannerNotices(pkg) {
        var _a;
        const notices = [];
        if ((_a = pkg.json['cdk-build']) === null || _a === void 0 ? void 0 : _a.cloudformation) {
            notices.push(readBannerFile('features-cfn-stable.md'));
            notices.push('');
        }
        const noticeOrder = ['Experimental', 'Developer Preview', 'Stable'];
        const stabilities = pkg.json.features.map((f) => f.stability);
        const filteredNotices = noticeOrder.filter(v => stabilities.includes(v));
        for (const notice of filteredNotices) {
            if (notices.length !== 0) {
                // This delimiter helps ensure proper parsing & rendering with various parsers
                notices.push('<!-- -->', '');
            }
            const lowerTrainCase = notice.toLowerCase().replace(/\s/g, '-');
            notices.push(readBannerFile(`features-${lowerTrainCase}.md`));
            notices.push('');
        }
        return notices;
    }
}
exports.FeatureStabilityRule = FeatureStabilityRule;
/**
 * Keywords must contain CDK keywords and be sorted
 */
class CDKKeywords extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/keywords';
    }
    validate(pkg) {
        if (!pkg.json.keywords) {
            pkg.report({
                ruleName: this.name,
                message: 'Must have keywords',
                fix: () => { pkg.json.keywords = []; },
            });
        }
        const keywords = pkg.json.keywords || [];
        if (keywords.indexOf('cdk') === -1) {
            pkg.report({
                ruleName: this.name,
                message: 'Keywords must mention CDK',
                fix: () => { pkg.json.keywords.splice(0, 0, 'cdk'); },
            });
        }
        if (keywords.indexOf('aws') === -1) {
            pkg.report({
                ruleName: this.name,
                message: 'Keywords must mention AWS',
                fix: () => { pkg.json.keywords.splice(0, 0, 'aws'); },
            });
        }
    }
}
exports.CDKKeywords = CDKKeywords;
/**
 * Requires projectReferences to be set in the jsii configuration.
 */
class JSIIProjectReferences extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'jsii/project-references';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'jsii.projectReferences', pkg.json.name !== 'monocdk' && pkg.json.name !== 'aws-cdk-lib');
    }
}
exports.JSIIProjectReferences = JSIIProjectReferences;
class NoPeerDependenciesMonocdk extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'monocdk/no-peer';
        this.allowedPeer = ['constructs'];
        this.modules = ['monocdk', 'aws-cdk-lib'];
    }
    validate(pkg) {
        if (!this.modules.includes(pkg.packageName)) {
            return;
        }
        const peers = Object.keys(pkg.peerDependencies).filter(peer => !this.allowedPeer.includes(peer));
        if (peers.length > 0) {
            pkg.report({
                ruleName: this.name,
                message: `Adding a peer dependency to the monolithic package ${pkg.packageName} is a breaking change, and thus not allowed.
         Added ${peers.join(' ')}`,
            });
        }
    }
}
exports.NoPeerDependenciesMonocdk = NoPeerDependenciesMonocdk;
/**
 * Validates that the same version of `constructs` is used wherever a dependency
 * is specified, so that they must all be udpated at the same time (through an
 * update to this rule).
 *
 * Note: v1 and v2 use different versions respectively.
 */
class ConstructsVersion extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'deps/constructs';
        this.expectedRange = cdkMajorVersion() === 2
            ? '10.0.0-pre.5'
            : '^3.2.0';
    }
    validate(pkg) {
        const toCheck = new Array();
        if ('constructs' in pkg.dependencies) {
            toCheck.push('dependencies');
        }
        if ('constructs' in pkg.devDependencies) {
            toCheck.push('devDependencies');
        }
        if ('constructs' in pkg.peerDependencies) {
            toCheck.push('peerDependencies');
        }
        for (const cfg of toCheck) {
            util_1.expectJSON(this.name, pkg, `${cfg}.constructs`, this.expectedRange);
        }
    }
}
exports.ConstructsVersion = ConstructsVersion;
/**
 * JSII Java package is required and must look sane
 */
class JSIIJavaPackageIsRequired extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'jsii/java';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        const moduleName = cdkModuleName(pkg.json.name);
        util_1.expectJSON(this.name, pkg, 'jsii.targets.java.maven.groupId', 'software.amazon.awscdk');
        util_1.expectJSON(this.name, pkg, 'jsii.targets.java.maven.artifactId', moduleName.mavenArtifactId, /-/g);
        const java = util_1.deepGet(pkg.json, ['jsii', 'targets', 'java', 'package']);
        util_1.expectJSON(this.name, pkg, 'jsii.targets.java.package', moduleName.javaPackage, /\./g);
        if (java) {
            const expectedPrefix = moduleName.javaPackage.split('.').slice(0, 3).join('.');
            const actualPrefix = java.split('.').slice(0, 3).join('.');
            if (expectedPrefix !== actualPrefix) {
                pkg.report({
                    ruleName: this.name,
                    message: `JSII "java" package must share the first 3 elements of the expected one: ${expectedPrefix} vs ${actualPrefix}`,
                    fix: () => util_1.deepSet(pkg.json, ['jsii', 'targets', 'java', 'package'], moduleName.javaPackage),
                });
            }
        }
    }
}
exports.JSIIJavaPackageIsRequired = JSIIJavaPackageIsRequired;
class JSIIPythonTarget extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'jsii/python';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        const moduleName = cdkModuleName(pkg.json.name);
        // See: https://github.com/aws/jsii/blob/master/docs/configuration.md#configuring-python
        util_1.expectJSON(this.name, pkg, 'jsii.targets.python.distName', moduleName.python.distName);
        util_1.expectJSON(this.name, pkg, 'jsii.targets.python.module', moduleName.python.module);
        util_1.expectJSON(this.name, pkg, 'jsii.targets.python.classifiers', ['Framework :: AWS CDK', 'Framework :: AWS CDK :: 1']);
    }
}
exports.JSIIPythonTarget = JSIIPythonTarget;
class CDKPackage extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/package';
    }
    validate(pkg) {
        // skip private packages
        if (pkg.json.private) {
            return;
        }
        const merkleMarker = '.LAST_PACKAGE';
        if (!shouldUseCDKBuildTools(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.package', 'cdk-package');
        const outdir = 'dist';
        // if this is
        if (isJSII(pkg)) {
            util_1.expectJSON(this.name, pkg, 'jsii.outdir', outdir);
        }
        util_1.fileShouldContain(this.name, pkg, '.npmignore', outdir);
        util_1.fileShouldContain(this.name, pkg, '.gitignore', outdir);
        util_1.fileShouldContain(this.name, pkg, '.npmignore', merkleMarker);
        util_1.fileShouldContain(this.name, pkg, '.gitignore', merkleMarker);
    }
}
exports.CDKPackage = CDKPackage;
class NoTsBuildInfo extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'npmignore/tsbuildinfo';
    }
    validate(pkg) {
        // skip private packages
        if (pkg.json.private) {
            return;
        }
        // Stop 'tsconfig.tsbuildinfo' and regular '.tsbuildinfo' files from being
        // published to NPM.
        // We might at some point also want to strip tsconfig.json but for now,
        // the TypeScript DOCS BUILD needs to it to load the typescript source.
        util_1.fileShouldContain(this.name, pkg, '.npmignore', '*.tsbuildinfo');
    }
}
exports.NoTsBuildInfo = NoTsBuildInfo;
class NoTestsInNpmPackage extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'npmignore/test';
    }
    validate(pkg) {
        // skip private packages
        if (pkg.json.private) {
            return;
        }
        // Skip the CLI package, as its 'test' subdirectory is used at runtime.
        if (pkg.packageName === 'aws-cdk') {
            return;
        }
        // Exclude 'test/' directories from being packaged
        util_1.fileShouldContain(this.name, pkg, '.npmignore', 'test/');
    }
}
exports.NoTestsInNpmPackage = NoTestsInNpmPackage;
class NoTsConfig extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'npmignore/tsconfig';
    }
    validate(pkg) {
        // skip private packages
        if (pkg.json.private) {
            return;
        }
        util_1.fileShouldContain(this.name, pkg, '.npmignore', 'tsconfig.json');
    }
}
exports.NoTsConfig = NoTsConfig;
class IncludeJsiiInNpmTarball extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'npmignore/jsii-included';
    }
    validate(pkg) {
        // only jsii modules
        if (!isJSII(pkg)) {
            return;
        }
        // skip private packages
        if (pkg.json.private) {
            return;
        }
        util_1.fileShouldNotContain(this.name, pkg, '.npmignore', '.jsii');
        util_1.fileShouldContain(this.name, pkg, '.npmignore', '!.jsii'); // make sure .jsii is included
    }
}
exports.IncludeJsiiInNpmTarball = IncludeJsiiInNpmTarball;
/**
 * Verifies there is no dependency on "jsii" since it's defined at the repo
 * level.
 */
class NoJsiiDep extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/no-jsii';
    }
    validate(pkg) {
        const predicate = (s) => s.startsWith('jsii');
        if (pkg.getDevDependency(predicate)) {
            pkg.report({
                ruleName: this.name,
                message: 'packages should not have a devDep on jsii since it is defined at the repo level',
                fix: () => pkg.removeDevDependency(predicate),
            });
        }
    }
}
exports.NoJsiiDep = NoJsiiDep;
/**
 * Verifies that the expected versions of node will be supported.
 */
class NodeCompatibility extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/node-version';
    }
    validate(pkg) {
        const atTypesNode = pkg.getDevDependency('@types/node');
        if (atTypesNode && !atTypesNode.startsWith('^10.')) {
            pkg.report({
                ruleName: this.name,
                message: `packages must support node version 10 and up, but ${atTypesNode} is declared`,
                fix: () => pkg.addDevDependency('@types/node', '^10.17.5'),
            });
        }
    }
}
exports.NodeCompatibility = NodeCompatibility;
/**
 * Verifies that the ``@types/`` dependencies are correctly recorded in ``devDependencies`` and not ``dependencies``.
 */
class NoAtTypesInDependencies extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/at-types';
    }
    validate(pkg) {
        const predicate = (s) => s.startsWith('@types/');
        for (const dependency of pkg.getDependencies(predicate)) {
            pkg.report({
                ruleName: this.name,
                message: `dependency on ${dependency.name}@${dependency.version} must be in devDependencies`,
                fix: () => {
                    pkg.addDevDependency(dependency.name, dependency.version);
                    pkg.removeDependency(predicate);
                },
            });
        }
    }
}
exports.NoAtTypesInDependencies = NoAtTypesInDependencies;
function isCdkModuleName(name) {
    return !!name.match(/^@aws-cdk\//);
}
/**
 * Computes the module name for various other purposes (java package, ...)
 */
function cdkModuleName(name) {
    const isCdkPkg = name === '@aws-cdk/core';
    const isLegacyCdkPkg = name === '@aws-cdk/cdk';
    name = name.replace(/^aws-cdk-/, '');
    name = name.replace(/^@aws-cdk\//, '');
    const dotnetSuffix = name.split('-')
        .map(s => s === 'aws' ? 'AWS' : caseUtils.pascal(s))
        .join('.');
    const pythonName = name.replace(/^@/g, '').replace(/\//g, '.').split('.').map(caseUtils.kebab).join('.');
    return {
        javaPackage: `software.amazon.awscdk${isLegacyCdkPkg ? '' : `.${name.replace(/^aws-/, 'services-').replace(/-/g, '.')}`}`,
        mavenArtifactId: isLegacyCdkPkg ? 'cdk'
            : isCdkPkg ? 'core'
                : name.startsWith('aws-') || name.startsWith('alexa-') ? name.replace(/^aws-/, '')
                    : name.startsWith('cdk-') ? name
                        : `cdk-${name}`,
        dotnetNamespace: `Amazon.CDK${isCdkPkg ? '' : `.${dotnetSuffix}`}`,
        python: {
            distName: `aws-cdk.${pythonName}`,
            module: `aws_cdk.${pythonName.replace(/-/g, '_')}`,
        },
    };
}
/**
 * JSII .NET namespace is required and must look sane
 */
class JSIIDotNetNamespaceIsRequired extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'jsii/dotnet';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        // skip the legacy @aws-cdk/cdk because we actually did not rename
        // the .NET module, so we are not publishing the deprecated one
        if (pkg.packageName === '@aws-cdk/cdk') {
            return;
        }
        const dotnet = util_1.deepGet(pkg.json, ['jsii', 'targets', 'dotnet', 'namespace']);
        const moduleName = cdkModuleName(pkg.json.name);
        util_1.expectJSON(this.name, pkg, 'jsii.targets.dotnet.namespace', moduleName.dotnetNamespace, /\./g, /*case insensitive*/ true);
        if (dotnet) {
            const actualPrefix = dotnet.split('.').slice(0, 2).join('.');
            const expectedPrefix = moduleName.dotnetNamespace.split('.').slice(0, 2).join('.');
            if (actualPrefix !== expectedPrefix) {
                pkg.report({
                    ruleName: this.name,
                    message: `.NET namespace must share the first two segments of the default namespace, '${expectedPrefix}' vs '${actualPrefix}'`,
                    fix: () => util_1.deepSet(pkg.json, ['jsii', 'targets', 'dotnet', 'namespace'], moduleName.dotnetNamespace),
                });
            }
        }
    }
}
exports.JSIIDotNetNamespaceIsRequired = JSIIDotNetNamespaceIsRequired;
/**
 * JSII .NET namespace is required and must look sane
 */
class JSIIDotNetIconUrlIsRequired extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'jsii/dotnet/icon-url';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        const CDK_LOGO_URL = 'https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png';
        util_1.expectJSON(this.name, pkg, 'jsii.targets.dotnet.iconUrl', CDK_LOGO_URL);
    }
}
exports.JSIIDotNetIconUrlIsRequired = JSIIDotNetIconUrlIsRequired;
/**
 * The package must depend on cdk-build-tools
 */
class MustDependOnBuildTools extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/build-tools';
    }
    validate(pkg) {
        if (!shouldUseCDKBuildTools(pkg)) {
            return;
        }
        util_1.expectDevDependency(this.name, pkg, 'cdk-build-tools', `${require('../../cdk-build-tools/package.json').version}`); // eslint-disable-line @typescript-eslint/no-require-imports
    }
}
exports.MustDependOnBuildTools = MustDependOnBuildTools;
/**
 * Build script must be 'cdk-build'
 */
class MustUseCDKBuild extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/build';
    }
    validate(pkg) {
        if (!shouldUseCDKBuildTools(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.build', 'cdk-build');
        // cdk-build will write a hash file that we have to ignore.
        const merkleMarker = '.LAST_BUILD';
        util_1.fileShouldContain(this.name, pkg, '.gitignore', merkleMarker);
        util_1.fileShouldContain(this.name, pkg, '.npmignore', merkleMarker);
    }
}
exports.MustUseCDKBuild = MustUseCDKBuild;
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
class RegularDependenciesMustSatisfyPeerDependencies extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/peer-dependencies-satisfied';
    }
    validate(pkg) {
        for (const [depName, peerVersion] of Object.entries(pkg.peerDependencies)) {
            const depVersion = pkg.dependencies[depName];
            if (depVersion === undefined) {
                continue;
            }
            // Make sure that depVersion satisfies peerVersion.
            if (!semver.intersects(depVersion, peerVersion)) {
                pkg.report({
                    ruleName: this.name,
                    message: `dependency ${depName}: concrete version ${depVersion} does not match peer version '${peerVersion}'`,
                    fix: () => pkg.addPeerDependency(depName, depVersion),
                });
            }
        }
    }
}
exports.RegularDependenciesMustSatisfyPeerDependencies = RegularDependenciesMustSatisfyPeerDependencies;
/**
 * Check that dependencies on @aws-cdk/ packages use point versions (not version ranges)
 * and that they are also defined in `peerDependencies`.
 */
class MustDependonCdkByPointVersions extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/cdk-point-dependencies';
    }
    validate(pkg) {
        // yes, ugly, but we have a bunch of references to other files in the repo.
        // we use the root package.json to determine what should be the version
        // across the repo: in local builds, this should be 0.0.0 and in CI builds
        // this would be the actual version of the repo after it's been aligned
        // using scripts/align-version.sh
        const expectedVersion = require('../../../package.json').version; // eslint-disable-line @typescript-eslint/no-require-imports
        const ignore = [
            '@aws-cdk/cloudformation-diff',
            '@aws-cdk/cfnspec',
            '@aws-cdk/cx-api',
            '@aws-cdk/cloud-assembly-schema',
            '@aws-cdk/region-info',
            '@aws-cdk/yaml-cfn',
        ];
        for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
            if (!isCdkModuleName(depName) || ignore.includes(depName)) {
                continue;
            }
            const peerDep = pkg.peerDependencies[depName];
            if (!peerDep) {
                pkg.report({
                    ruleName: this.name,
                    message: `dependency ${depName} must also appear in peerDependencies`,
                    fix: () => pkg.addPeerDependency(depName, expectedVersion),
                });
            }
            if (peerDep !== expectedVersion) {
                pkg.report({
                    ruleName: this.name,
                    message: `peer dependency ${depName} should have the version ${expectedVersion}`,
                    fix: () => pkg.addPeerDependency(depName, expectedVersion),
                });
            }
            if (depVersion !== expectedVersion) {
                pkg.report({
                    ruleName: this.name,
                    message: `dependency ${depName}: dependency version must be ${expectedVersion}`,
                    fix: () => pkg.addDependency(depName, expectedVersion),
                });
            }
        }
    }
}
exports.MustDependonCdkByPointVersions = MustDependonCdkByPointVersions;
class MustIgnoreSNK extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'ignore/strong-name-key';
    }
    validate(pkg) {
        util_1.fileShouldContain(this.name, pkg, '.npmignore', '*.snk');
        util_1.fileShouldContain(this.name, pkg, '.gitignore', '*.snk');
    }
}
exports.MustIgnoreSNK = MustIgnoreSNK;
class MustIgnoreJunitXml extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'ignore/junit';
    }
    validate(pkg) {
        util_1.fileShouldContain(this.name, pkg, '.npmignore', 'junit.xml');
        util_1.fileShouldContain(this.name, pkg, '.gitignore', 'junit.xml');
    }
}
exports.MustIgnoreJunitXml = MustIgnoreJunitXml;
class NpmIgnoreForJsiiModules extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'ignore/jsii';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        util_1.fileShouldContain(this.name, pkg, '.npmignore', '*.ts', '!*.d.ts', '!*.js', 'coverage', '.nyc_output', '*.tgz');
    }
}
exports.NpmIgnoreForJsiiModules = NpmIgnoreForJsiiModules;
/**
 * Must use 'cdk-watch' command
 */
class MustUseCDKWatch extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/watch';
    }
    validate(pkg) {
        if (!shouldUseCDKBuildTools(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.watch', 'cdk-watch');
    }
}
exports.MustUseCDKWatch = MustUseCDKWatch;
/**
 * Must have 'rosetta:extract' command if this package is JSII-enabled.
 */
class MustHaveRosettaExtract extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/rosetta:extract';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.rosetta:extract', 'yarn --silent jsii-rosetta extract');
    }
}
exports.MustHaveRosettaExtract = MustHaveRosettaExtract;
/**
 * Must use 'cdk-test' command
 */
class MustUseCDKTest extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/test';
    }
    validate(pkg) {
        if (!shouldUseCDKBuildTools(pkg)) {
            return;
        }
        if (!hasTestDirectory(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.test', 'cdk-test');
        // 'cdk-test' will calculate coverage, so have the appropriate
        // files in .gitignore.
        util_1.fileShouldContain(this.name, pkg, '.gitignore', '.nyc_output');
        util_1.fileShouldContain(this.name, pkg, '.gitignore', 'coverage');
        util_1.fileShouldContain(this.name, pkg, '.gitignore', 'nyc.config.js');
    }
}
exports.MustUseCDKTest = MustUseCDKTest;
/**
 * Must declare minimum node version
 */
class MustHaveNodeEnginesDeclaration extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/engines';
    }
    validate(pkg) {
        util_1.expectJSON(this.name, pkg, 'engines.node', '>= 10.13.0 <13 || >=13.7.0');
    }
}
exports.MustHaveNodeEnginesDeclaration = MustHaveNodeEnginesDeclaration;
/**
 * Scripts that run integ tests must also have the individual 'integ' script to update them
 *
 * This commands comes from the dev-dependency cdk-integ-tools.
 */
class MustHaveIntegCommand extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/integ';
    }
    validate(pkg) {
        if (!hasIntegTests(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.integ', 'cdk-integ');
        util_1.expectDevDependency(this.name, pkg, 'cdk-integ-tools', `${require('../../cdk-integ-tools/package.json').version}`); // eslint-disable-line @typescript-eslint/no-require-imports
    }
}
exports.MustHaveIntegCommand = MustHaveIntegCommand;
/**
 * Checks API backwards compatibility against the latest released version.
 */
class CompatScript extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/compat';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.compat', 'cdk-compat');
    }
}
exports.CompatScript = CompatScript;
class PkgLintAsScript extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/scripts/pkglint';
    }
    validate(pkg) {
        const script = 'pkglint -f';
        util_1.expectDevDependency(this.name, pkg, 'pkglint', `${require('../package.json').version}`); // eslint-disable-line @typescript-eslint/no-require-imports
        if (!pkg.npmScript('pkglint')) {
            pkg.report({
                ruleName: this.name,
                message: 'a script called "pkglint" must be included to allow fixing package linting issues',
                fix: () => pkg.changeNpmScript('pkglint', () => script),
            });
        }
        if (pkg.npmScript('pkglint') !== script) {
            pkg.report({
                ruleName: this.name,
                message: 'the pkglint script should be: ' + script,
                fix: () => pkg.changeNpmScript('pkglint', () => script),
            });
        }
    }
}
exports.PkgLintAsScript = PkgLintAsScript;
class NoStarDeps extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/no-star';
    }
    validate(pkg) {
        reportStarDeps(this.name, pkg.json.depedencies);
        reportStarDeps(this.name, pkg.json.devDependencies);
        function reportStarDeps(ruleName, deps) {
            deps = deps || {};
            Object.keys(deps).forEach(d => {
                if (deps[d] === '*') {
                    pkg.report({
                        ruleName,
                        message: `star dependency not allowed for ${d}`,
                    });
                }
            });
        }
    }
}
exports.NoStarDeps = NoStarDeps;
/**
 * All consumed versions of dependencies must be the same
 *
 * NOTE: this rule will only be useful when validating multiple package.jsons at the same time
 */
class AllVersionsTheSame extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'dependencies/versions-consistent';
        this.ourPackages = {};
        this.usedDeps = {};
    }
    prepare(pkg) {
        this.ourPackages[pkg.json.name] = pkg.json.version;
        this.recordDeps(pkg.json.dependencies);
        this.recordDeps(pkg.json.devDependencies);
    }
    validate(pkg) {
        this.validateDeps(pkg, 'dependencies');
        this.validateDeps(pkg, 'devDependencies');
    }
    recordDeps(deps) {
        if (!deps) {
            return;
        }
        Object.keys(deps).forEach(dep => {
            this.recordDep(dep, deps[dep]);
        });
    }
    validateDeps(pkg, section) {
        if (!pkg.json[section]) {
            return;
        }
        Object.keys(pkg.json[section]).forEach(dep => {
            this.validateDep(pkg, section, dep);
        });
    }
    recordDep(dep, version) {
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
        }
        else {
            this.usedDeps[dep][i].count += 1;
        }
    }
    validateDep(pkg, depField, dep) {
        if (dep in this.ourPackages) {
            util_1.expectJSON(this.name, pkg, depField + '.' + dep, this.ourPackages[dep]);
            return;
        }
        // Otherwise, must match the majority version declaration. Might be empty if we only
        // have '*', in which case that's fine.
        if (!(dep in this.usedDeps)) {
            return;
        }
        const versions = this.usedDeps[dep];
        versions.sort((a, b) => b.count - a.count);
        util_1.expectJSON(this.name, pkg, depField + '.' + dep, versions[0].version);
    }
}
exports.AllVersionsTheSame = AllVersionsTheSame;
class AwsLint extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'awslint';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        if (!isAWS(pkg)) {
            return;
        }
        util_1.expectJSON(this.name, pkg, 'scripts.awslint', 'cdk-awslint');
    }
}
exports.AwsLint = AwsLint;
class Cfn2Ts extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'cfn2ts';
    }
    validate(pkg) {
        if (!isJSII(pkg) || !isAWS(pkg)) {
            return util_1.expectJSON(this.name, pkg, 'scripts.cfn2ts', undefined);
        }
        util_1.expectJSON(this.name, pkg, 'scripts.cfn2ts', 'cfn2ts');
    }
}
exports.Cfn2Ts = Cfn2Ts;
/**
 * Packages inside JSII packages (typically used for embedding Lambda handles)
 * must only have dev dependencies and their node_modules must have been
 * blacklisted for publishing
 *
 * We might loosen this at some point but we'll have to bundle all runtime dependencies
 * and we don't have good transitive license checks.
 */
class PackageInJsiiPackageNoRuntimeDeps extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'lambda-packages-no-runtime-deps';
    }
    validate(pkg) {
        if (!isJSII(pkg)) {
            return;
        }
        for (const inner of util_1.findInnerPackages(pkg.packageRoot)) {
            const innerPkg = packagejson_1.PackageJson.fromDirectory(inner);
            if (Object.keys(innerPkg.dependencies).length > 0) {
                pkg.report({
                    ruleName: `${this.name}:1`,
                    message: `NPM Package '${innerPkg.packageName}' inside jsii package can only have devDepencencies`,
                });
            }
            const nodeModulesRelPath = path.relative(pkg.packageRoot, innerPkg.packageRoot) + '/node_modules';
            util_1.fileShouldContain(`${this.name}:2`, pkg, '.npmignore', nodeModulesRelPath);
        }
    }
}
exports.PackageInJsiiPackageNoRuntimeDeps = PackageInJsiiPackageNoRuntimeDeps;
/**
 * Requires packages to have fast-fail build scripts, allowing to combine build, test and package in a single command.
 * This involves two targets: `build+test:pack` and `build+test` (to skip the pack).
 */
class FastFailingBuildScripts extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'fast-failing-build-scripts';
    }
    validate(pkg) {
        const scripts = pkg.json.scripts || {};
        const hasTest = 'test' in scripts;
        const hasPack = 'package' in scripts;
        const cmdBuild = 'yarn build';
        util_1.expectJSON(this.name, pkg, 'scripts.build+test', hasTest ? [cmdBuild, 'yarn test'].join(' && ') : cmdBuild);
        const cmdBuildTest = 'yarn build+test';
        util_1.expectJSON(this.name, pkg, 'scripts.build+test+package', hasPack ? [cmdBuildTest, 'yarn package'].join(' && ') : cmdBuildTest);
    }
}
exports.FastFailingBuildScripts = FastFailingBuildScripts;
class YarnNohoistBundledDependencies extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'yarn/nohoist-bundled-dependencies';
    }
    validate(pkg) {
        const bundled = pkg.json.bundleDependencies || pkg.json.bundledDependencies || [];
        if (bundled.length === 0) {
            return;
        }
        const repoPackageJson = path.resolve(__dirname, '../../../package.json');
        const nohoist = require(repoPackageJson).workspaces.nohoist; // eslint-disable-line @typescript-eslint/no-require-imports
        const missing = new Array();
        for (const dep of bundled) {
            for (const entry of [`${pkg.packageName}/${dep}`, `${pkg.packageName}/${dep}/**`]) {
                if (nohoist.indexOf(entry) >= 0) {
                    continue;
                }
                missing.push(entry);
            }
        }
        if (missing.length > 0) {
            pkg.report({
                ruleName: this.name,
                message: `Repository-level 'workspaces.nohoist' directive is missing: ${missing.join(', ')}`,
                fix: () => {
                    const packageJson = require(repoPackageJson); // eslint-disable-line @typescript-eslint/no-require-imports
                    packageJson.workspaces.nohoist = [...packageJson.workspaces.nohoist, ...missing].sort();
                    fs.writeFileSync(repoPackageJson, `${JSON.stringify(packageJson, null, 2)}\n`, { encoding: 'utf8' });
                },
            });
        }
    }
}
exports.YarnNohoistBundledDependencies = YarnNohoistBundledDependencies;
class ConstructsDependency extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'constructs/dependency';
    }
    validate(pkg) {
        var _a, _b;
        const REQUIRED_VERSION = '^3.2.0';
        if (((_a = pkg.devDependencies) === null || _a === void 0 ? void 0 : _a.constructs) && ((_b = pkg.devDependencies) === null || _b === void 0 ? void 0 : _b.constructs) !== REQUIRED_VERSION) {
            pkg.report({
                ruleName: this.name,
                message: `"constructs" must have a version requirement ${REQUIRED_VERSION}`,
                fix: () => {
                    pkg.addDevDependency('constructs', REQUIRED_VERSION);
                },
            });
        }
        if (pkg.dependencies.constructs && pkg.dependencies.constructs !== REQUIRED_VERSION) {
            pkg.report({
                ruleName: this.name,
                message: `"constructs" must have a version requirement ${REQUIRED_VERSION}`,
                fix: () => {
                    pkg.addDependency('constructs', REQUIRED_VERSION);
                },
            });
            if (!pkg.peerDependencies.constructs || pkg.peerDependencies.constructs !== REQUIRED_VERSION) {
                pkg.report({
                    ruleName: this.name,
                    message: `"constructs" must have a version requirement ${REQUIRED_VERSION} in peerDependencies`,
                    fix: () => {
                        pkg.addPeerDependency('constructs', REQUIRED_VERSION);
                    },
                });
            }
        }
    }
}
exports.ConstructsDependency = ConstructsDependency;
/**
 * Do not announce new versions of AWS CDK modules in awscdk.io because it is very very spammy
 * and actually causes the @awscdkio twitter account to be blocked.
 *
 * https://github.com/construct-catalog/catalog/issues/24
 * https://github.com/construct-catalog/catalog/pull/22
 */
class DoNotAnnounceInCatalog extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'catalog/no-announce';
    }
    validate(pkg) {
        var _a;
        if (!isJSII(pkg)) {
            return;
        }
        if (((_a = pkg.json.awscdkio) === null || _a === void 0 ? void 0 : _a.announce) !== false) {
            pkg.report({
                ruleName: this.name,
                message: 'missing "awscdkio.announce: false" in package.json',
                fix: () => {
                    var _a;
                    pkg.json.awscdkio = (_a = pkg.json.awscdkio) !== null && _a !== void 0 ? _a : {};
                    pkg.json.awscdkio.announce = false;
                },
            });
        }
    }
}
exports.DoNotAnnounceInCatalog = DoNotAnnounceInCatalog;
class EslintSetup extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/eslint';
    }
    validate(pkg) {
        const eslintrcFilename = '.eslintrc.js';
        if (!fs.existsSync(eslintrcFilename)) {
            pkg.report({
                ruleName: this.name,
                message: 'There must be a .eslintrc.js file at the root of the package',
                fix: () => {
                    const rootRelative = path.relative(pkg.packageRoot, repoRoot(pkg.packageRoot));
                    fs.writeFileSync(eslintrcFilename, [
                        `const baseConfig = require('${rootRelative}/tools/cdk-build-tools/config/eslintrc');`,
                        "baseConfig.parserOptions.project = __dirname + '/tsconfig.json';",
                        'module.exports = baseConfig;',
                    ].join('\n') + '\n');
                },
            });
        }
        util_1.fileShouldContain(this.name, pkg, '.gitignore', '!.eslintrc.js');
        util_1.fileShouldContain(this.name, pkg, '.npmignore', '.eslintrc.js');
    }
}
exports.EslintSetup = EslintSetup;
class JestSetup extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'package-info/jest.config';
    }
    validate(pkg) {
        const cdkBuild = pkg.json['cdk-build'] || {};
        // check whether the package.json contains the "jest" key,
        // which we no longer use
        if (pkg.json.jest) {
            pkg.report({
                ruleName: this.name,
                message: 'Using Jest is set through a flag in the "cdk-build" key in package.json, the "jest" key is ignored',
                fix: () => {
                    delete pkg.json.jest;
                    cdkBuild.jest = true;
                    pkg.json['cdk-build'] = cdkBuild;
                },
            });
        }
        // this rule should only be enforced for packages that use Jest for testing
        if (!cdkBuild.jest) {
            return;
        }
        const jestConfigFilename = 'jest.config.js';
        if (!fs.existsSync(jestConfigFilename)) {
            pkg.report({
                ruleName: this.name,
                message: 'There must be a jest.config.js file at the root of the package',
                fix: () => {
                    const rootRelative = path.relative(pkg.packageRoot, repoRoot(pkg.packageRoot));
                    fs.writeFileSync(jestConfigFilename, [
                        `const baseConfig = require('${rootRelative}/tools/cdk-build-tools/config/jest.config');`,
                        'module.exports = baseConfig;',
                    ].join('\n') + '\n');
                },
            });
        }
        util_1.fileShouldContain(this.name, pkg, '.gitignore', '!jest.config.js');
        util_1.fileShouldContain(this.name, pkg, '.npmignore', 'jest.config.js');
    }
}
exports.JestSetup = JestSetup;
class UbergenPackageVisibility extends packagejson_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.name = 'ubergen/package-visibility';
        // These include dependencies of the CDK CLI (aws-cdk).
        this.publicPackages = [
            '@aws-cdk/cfnspec',
            '@aws-cdk/cloud-assembly-schema',
            '@aws-cdk/cloudformation-diff',
            '@aws-cdk/cx-api',
            '@aws-cdk/region-info',
            '@aws-cdk/yaml-cfn',
            'aws-cdk-lib',
            'aws-cdk',
            'awslint',
            'cdk',
            'cdk-assets',
        ];
    }
    validate(pkg) {
        var _a;
        if (cdkMajorVersion() === 2) {
            // Only packages in the publicPackages list should be "public". Everything else should be private.
            if (this.publicPackages.includes(pkg.json.name) && pkg.json.private === true) {
                pkg.report({
                    ruleName: this.name,
                    message: 'Package must be public',
                    fix: () => {
                        delete pkg.json.private;
                    },
                });
            }
            else if (!this.publicPackages.includes(pkg.json.name) && pkg.json.private !== true) {
                pkg.report({
                    ruleName: this.name,
                    message: 'Package must not be public',
                    fix: () => {
                        delete pkg.json.private;
                        pkg.json.private = true;
                    },
                });
            }
        }
        else {
            if (pkg.json.private && !((_a = pkg.json.ubergen) === null || _a === void 0 ? void 0 : _a.exclude)) {
                pkg.report({
                    ruleName: this.name,
                    message: 'ubergen.exclude must be configured for private packages',
                    fix: () => {
                        pkg.json.ubergen = {
                            exclude: true,
                        };
                    },
                });
            }
        }
    }
}
exports.UbergenPackageVisibility = UbergenPackageVisibility;
/**
 * Determine whether this is a JSII package
 *
 * A package is a JSII package if there is 'jsii' section in the package.json
 */
function isJSII(pkg) {
    return pkg.json.jsii;
}
/**
 * Indicates that this is an "AWS" package (i.e. that it it has a cloudformation source)
 * @param pkg
 */
function isAWS(pkg) {
    var _a;
    return ((_a = pkg.json['cdk-build']) === null || _a === void 0 ? void 0 : _a.cloudformation) != null;
}
/**
 * Determine whether the package has tests
 *
 * A package has tests if the root/test directory exists
 */
function hasTestDirectory(pkg) {
    return fs.existsSync(path.join(pkg.packageRoot, 'test'));
}
/**
 * Whether this package has integ tests
 *
 * A package has integ tests if it mentions 'cdk-integ' in the "test" script.
 */
function hasIntegTests(pkg) {
    if (!hasTestDirectory(pkg)) {
        return false;
    }
    const files = fs.readdirSync(path.join(pkg.packageRoot, 'test'));
    return files.some(p => p.startsWith('integ.'));
}
/**
 * Return whether this package should use CDK build tools
 */
function shouldUseCDKBuildTools(pkg) {
    const exclude = [
        'cdk-build-tools',
        'merkle-build',
        'awslint',
        'script-tests',
    ];
    return !exclude.includes(pkg.packageName);
}
function repoRoot(dir) {
    let root = dir;
    for (let i = 0; i < 50 && !fs.existsSync(path.join(root, 'yarn.lock')); i++) {
        root = path.dirname(root);
    }
    return root;
}
function toRegExp(str) {
    return new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\w+/g, '\\w+'));
}
function readBannerFile(file) {
    return fs.readFileSync(path.join(__dirname, 'banners', file), { encoding: 'utf-8' }).trim();
}
function cdkMajorVersion() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const releaseJson = require(`${__dirname}/../../../release.json`);
    return releaseJson.majorVersion;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJydWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGtDQUFrQztBQUNsQyw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDLDJDQUE4QztBQUM5QywrQ0FBNEQ7QUFDNUQsaUNBT2dCO0FBRWhCLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyw0REFBNEQ7QUFFcEk7O0dBRUc7QUFDSCxNQUFhLCtCQUFnQyxTQUFRLDRCQUFjO0lBQW5FOztRQUNrQixTQUFJLEdBQUcsa0NBQWtDLENBQUM7SUFXNUQsQ0FBQztJQVRRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFOUMsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUMxRCxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDekMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTVCLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDRjtBQVpELDBFQVlDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLDRCQUFjO0lBQXpEOztRQUNrQixTQUFJLEdBQUcsa0NBQWtDLENBQUM7SUFPNUQsQ0FBQztJQUxRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0NBQ0Y7QUFSRCxzREFRQztBQUVEOztHQUVHO0FBQ0gsTUFBYSwwQkFBMkIsU0FBUSw0QkFBYztJQUE5RDs7UUFDa0IsU0FBSSxHQUFHLGlDQUFpQyxDQUFDO0lBdUIzRCxDQUFDO0lBckJRLFFBQVEsQ0FBQyxHQUFnQjs7UUFDOUIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVqQyxrRkFBa0Y7UUFDbEYscUVBQXFFO1FBQ3JFLHVFQUF1RTtRQUN2RSxNQUFNLGFBQWEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFbEgsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSwwQ0FBRSxHQUFHLE1BQUssaUJBQWlCLEVBQUU7WUFDckQsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSw2QkFBNkIsaUJBQWlCLEVBQUU7Z0JBQ3pELEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRTs7b0JBQ1QsTUFBTSxhQUFhLFNBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLG1DQUFJLEVBQUUsQ0FBQztvQkFDbkQsYUFBYSxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQztvQkFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO2dCQUN6QyxDQUFDLENBQUM7YUFDSCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQXhCRCxnRUF3QkM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLHNCQUF1QixTQUFRLDRCQUFjO0lBQTFEOztRQUVrQixTQUFJLEdBQUcsaUNBQWlDLENBQUM7SUF1QjNELENBQUM7SUFyQlEsUUFBUSxDQUFDLEdBQWdCO1FBRTlCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUvRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFFaEMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxHQUFHLGFBQWEsMkJBQTJCO29CQUNwRCxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FDekIsYUFBYSxFQUNiLEdBQUcsU0FBUyx1Q0FBdUMsQ0FDcEQ7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtJQUNILENBQUM7Q0FFRjtBQXpCRCx3REF5QkM7QUFFRDs7R0FFRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsNEJBQWM7SUFBckQ7O1FBQ2tCLFNBQUksR0FBRyx5QkFBeUIsQ0FBQztJQVFuRCxDQUFDO0lBTlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQVksRUFBRSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5RCxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDRjtBQVRELDhDQVNDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsNEJBQWM7SUFBbkQ7O1FBQ2tCLFNBQUksR0FBRyx1QkFBdUIsQ0FBQztJQUtqRCxDQUFDO0lBSFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBTkQsMENBTUM7QUFFRDs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLDRCQUFjO0lBQTNDOztRQUNrQixTQUFJLEdBQUcsc0JBQXNCLENBQUM7SUFLaEQsQ0FBQztJQUhRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0Y7QUFORCwwQkFNQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsNEJBQWM7SUFBL0M7O1FBQ2tCLFNBQUksR0FBRyxzQkFBc0IsQ0FBQztJQUtoRCxDQUFDO0lBSFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLG1CQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLG1CQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0Y7QUFORCxrQ0FNQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsNEJBQWM7SUFBOUM7O1FBQ2tCLFNBQUksR0FBRyxxQkFBcUIsQ0FBQztJQUsvQyxDQUFDO0lBSFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLDBCQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLGtCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNGO0FBTkQsZ0NBTUM7QUFFRDs7R0FFRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsNEJBQWM7SUFBMUQ7O1FBQ2tCLFNBQUksR0FBRyx5QkFBeUIsQ0FBQztJQWtDbkQsQ0FBQztJQWhDUSxRQUFRLENBQUMsR0FBZ0I7O1FBQzlCLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9DLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUQsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLHlCQUF5QixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxXQUFXLGVBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLDBDQUFFLFdBQVcsbUNBQUksRUFBRSxDQUFDO1FBQ3hELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUNyQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQy9ELENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFUCxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUM7UUFDekIsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0UsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUU7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ1QsT0FBTyxFQUFFLCtDQUErQyxHQUFHLG1CQUFtQjtvQkFDOUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUNwQixDQUFDLENBQUM7YUFDSjtTQUNGO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUNULE9BQU8sRUFBRSxpREFBaUQsSUFBSSxnSUFBZ0k7b0JBQzlMLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtpQkFDcEIsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtJQUNILENBQUM7Q0FDRjtBQW5DRCx3REFtQ0M7QUFFRDs7R0FFRztBQUNILE1BQWEsU0FBVSxTQUFRLDRCQUFjO0lBQTdDOztRQUNrQixTQUFJLEdBQUcscUJBQXFCLENBQUM7SUFPL0MsQ0FBQztJQUxRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pFLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDbkUsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0Y7QUFSRCw4QkFRQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsNEJBQWM7SUFBOUM7O1FBQ2tCLFNBQUksR0FBRyx3QkFBd0IsQ0FBQztJQXlDbEQsQ0FBQztJQXZDUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDN0UsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU87U0FDUjtRQUNELElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxlQUFlLEVBQUU7WUFDdkMsT0FBTztTQUNSO1FBQ0QsTUFBTSxLQUFLLEdBQVcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3QyxNQUFNLFFBQVEsR0FBRyxXQUFXLElBQUksR0FBRyxXQUFXLG9CQUFvQixDQUFDO1FBRW5FLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsMkRBQTJEO2dCQUNwRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FDekIsVUFBVSxFQUNWO29CQUNFLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUN2QyxnR0FBZ0c7aUJBQ2pHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNiO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7YUFBTSxJQUFJLFFBQVEsRUFBRTtZQUNuQixNQUFNLGlCQUFpQixHQUFHLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNGLElBQUksU0FBUyxLQUFLLGlCQUFpQixFQUFFO2dCQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsT0FBTyxFQUFFLDRDQUE0QyxRQUFRLEdBQUc7b0JBQ2hFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqRixDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBMUNELGdDQTBDQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLDRCQUFjO0lBQW5EOztRQUNrQixTQUFJLEdBQUcsdUJBQXVCLENBQUM7SUFvSWpELENBQUM7SUFsSVEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEIsc0NBQXNDO1lBQ3RDLE9BQU87U0FDUjtRQUVELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckIsbURBQW1EO1lBQ25ELE9BQU87U0FDUjtRQUVELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBOEIsQ0FBQztRQUN2RCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQStCLENBQUM7UUFDM0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLElBQUksR0FBRyxDQUFDO1lBQ1IsSUFBSSxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUM3RCxrQkFBa0I7Z0JBQ2xCLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7Z0JBQzFDLFFBQVEsR0FBRyxTQUFTLENBQUM7YUFDdEI7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLDBEQUEwRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUc7Z0JBQ3hHLEdBQUc7YUFDSixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksUUFBUSxLQUFLLFlBQVksRUFBRTtZQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLHVEQUF1RCxRQUFRLEdBQUc7Z0JBQzNFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZO2FBQzVDLENBQUMsQ0FBQztZQUNILFFBQVEsR0FBRyxZQUFZLENBQUM7U0FDekI7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkQsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUksTUFBTSxFQUFFO1lBQ1YsbUZBQW1GO1lBQ25GLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxvRUFBb0U7b0JBQzdFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjO2lCQUM5QyxDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU0sSUFBSSxNQUFNLEVBQUU7WUFDakIsZ0ZBQWdGO1lBQ2hGLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxnRkFBZ0Y7b0JBQ3pGLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVO2lCQUMxQyxDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxHQUFnQixFQUFFLFFBQWdCLEVBQUUsYUFBdUI7UUFDekYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLDBEQUEwRDtZQUMxRCxPQUFPO1NBQ1I7UUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsbURBQW1EO1lBQ25ELE9BQU87U0FDUjtRQUVELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDeEUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ25DLHVHQUF1RztZQUN2RyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyx1RUFBdUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEksR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSxnQ0FBZ0MsUUFBUSxvQkFBb0I7Z0JBQ3JFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUUsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLFFBQWdCLEVBQUUsYUFBdUI7UUFDM0QsTUFBTSxjQUFjLEdBQUcsYUFBYTthQUNqQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEtBQUssSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdkgsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNaLElBQUksRUFBRSxDQUFDO1FBRVYsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUV2RSxPQUFPO1lBQ0wsK0JBQStCO1lBQy9CLEVBQUU7WUFDRixLQUFLO1lBQ0wsRUFBRTtZQUNGLEdBQUcsV0FBVztZQUNkLEVBQUU7WUFDRixLQUFLO1lBQ0wsRUFBRTtZQUNGLDZCQUE2QjtZQUM3QixFQUFFO1NBQ0gsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZixDQUFDO0lBRU8sc0JBQXNCLENBQUMsR0FBZ0I7O1FBQzdDLGlGQUFpRjtRQUNqRixzRkFBc0Y7UUFDdEYsa0NBQWtDO1FBQ2xDLE1BQU0sS0FBSyxHQUFHLENBQUMsUUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQ0FBRSxjQUFjLENBQUEsQ0FBQztRQUV0RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN4QyxNQUFNLEVBQUUsZUFBZTtTQUN4QixDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRTFGLE9BQU87WUFDTCxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixtRUFBbUU7WUFDbkUsR0FBRyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDakMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXJJRCwwQ0FxSUM7QUFFRCxNQUFNLHFCQUFxQixHQUEyQjtJQUNwRCxVQUFVLEVBQUUsY0FBYztJQUMxQixjQUFjLEVBQUUsY0FBYztJQUM5QixtQkFBbUIsRUFBRSxjQUFjO0lBQ25DLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFlBQVksRUFBRSxZQUFZO0NBQzNCLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLDRCQUFjO0lBQXBEOztRQUNrQixTQUFJLEdBQUcsd0JBQXdCLENBQUM7SUF5QmxELENBQUM7SUF2QlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEIsc0NBQXNDO1lBQ3RDLE9BQU87U0FDUjtRQUVELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckIsbURBQW1EO1lBQ25ELE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBOEIsQ0FBQztRQUN6RCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQStCLENBQUM7UUFFM0QsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDakYsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLGlCQUFpQixJQUFJLFNBQVMsS0FBSyxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3hFLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsaUJBQWlCLFNBQVMsK0NBQStDLGlCQUFpQixHQUFHO2dCQUN0RyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUNwRixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQTFCRCw0Q0EwQkM7QUFFRCxNQUFhLG9CQUFxQixTQUFRLDRCQUFjO0lBQXhEOztRQUNrQixTQUFJLEdBQUcsZ0NBQWdDLENBQUM7UUFDdkMsV0FBTSxHQUE4QjtZQUNuRCxpQkFBaUIsRUFBRSw2RUFBNkU7WUFDaEcsY0FBYyxFQUFFLDZFQUE2RTtZQUM3RixtQkFBbUIsRUFBRSx1RkFBdUY7WUFDNUcsUUFBUSxFQUFFLHFFQUFxRTtTQUNoRixDQUFDO0lBaUZKLENBQUM7SUEvRVEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMxQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQ2xDLEVBQUUsRUFBRSx5QkFBeUI7UUFDN0IsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUF1QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUN4RSxDQUFDO1FBRUYsTUFBTSxlQUFlLEdBQVc7WUFDOUIsK0JBQStCO1lBQy9CLEVBQUU7WUFDRixLQUFLO1lBQ0wsRUFBRTtZQUNGLFdBQVcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsY0FBYztZQUM1RCxXQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxtQkFBbUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3ZILEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUM7WUFDaEQsRUFBRTtZQUNGLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFDMUIsS0FBSztZQUNMLEVBQUU7WUFDRiw2QkFBNkI7WUFDN0IsRUFBRTtTQUNILENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzlCLG1EQUFtRDtZQUNuRCxPQUFPO1NBQ1I7UUFDRCxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN2QyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyx1RUFBdUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEksR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSw2Q0FBNkM7Z0JBQ3RELEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEYsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRU8sY0FBYyxDQUFDLEdBQWdCLEVBQUUsbUJBQTJCOztRQUNsRSxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsVUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQ0FBRSxjQUFjLEVBQUU7WUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUN6RztRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWtDLEVBQUUsRUFBRTtZQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLE9BQU8sQ0FBQyxTQUFTLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQztRQUM5SCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxhQUFhLENBQUMsR0FBZ0I7O1FBQ3BDLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixVQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDBDQUFFLGNBQWMsRUFBRTtZQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7WUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsQjtRQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQTBCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RixNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssTUFBTSxNQUFNLElBQUksZUFBZSxFQUFFO1lBQ3BDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3hCLDhFQUE4RTtnQkFDOUUsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDOUI7WUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLGNBQWMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBeEZELG9EQXdGQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsNEJBQWM7SUFBL0M7O1FBQ2tCLFNBQUksR0FBRyx1QkFBdUIsQ0FBQztJQTZCakQsQ0FBQztJQTNCUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsb0JBQW9CO2dCQUM3QixHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN2QyxDQUFDLENBQUM7U0FDSjtRQUVELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUV6QyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSwyQkFBMkI7Z0JBQ3BDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEQsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSwyQkFBMkI7Z0JBQ3BDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEQsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0NBQ0Y7QUE5QkQsa0NBOEJDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLDRCQUFjO0lBQXpEOztRQUNrQixTQUFJLEdBQUcseUJBQXlCLENBQUM7SUFjbkQsQ0FBQztJQVpRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUVELGlCQUFVLENBQ1IsSUFBSSxDQUFDLElBQUksRUFDVCxHQUFHLEVBQ0gsd0JBQXdCLEVBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLENBQy9ELENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFmRCxzREFlQztBQUVELE1BQWEseUJBQTBCLFNBQVEsNEJBQWM7SUFBN0Q7O1FBQ2tCLFNBQUksR0FBRyxpQkFBaUIsQ0FBQztRQUN4QixnQkFBVyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0IsWUFBTyxHQUFHLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBZ0J4RCxDQUFDO0lBZFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDM0MsT0FBTztTQUNSO1FBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLHNEQUFzRCxHQUFHLENBQUMsV0FBVztpQkFDckUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTthQUMzQixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQW5CRCw4REFtQkM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLDRCQUFjO0lBQXJEOztRQUNrQixTQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxlQUFlLEVBQUUsS0FBSyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxjQUFjO1lBQ2hCLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFtQmYsQ0FBQztJQWpCUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUVwQyxJQUFJLFlBQVksSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDOUI7UUFDRCxJQUFJLFlBQVksSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUNqQztRQUNELElBQUksWUFBWSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbEM7UUFFRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRTtZQUN6QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztDQUNGO0FBdkJELDhDQXVCQztBQUVEOztHQUVHO0FBQ0gsTUFBYSx5QkFBMEIsU0FBUSw0QkFBYztJQUE3RDs7UUFDa0IsU0FBSSxHQUFHLFdBQVcsQ0FBQztJQXdCckMsQ0FBQztJQXRCUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUU3QixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoRCxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGlDQUFpQyxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDeEYsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRSxVQUFVLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5HLE1BQU0sSUFBSSxHQUFHLGNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQXVCLENBQUM7UUFDN0YsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZGLElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0UsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRCxJQUFJLGNBQWMsS0FBSyxZQUFZLEVBQUU7Z0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixPQUFPLEVBQUUsNEVBQTRFLGNBQWMsT0FBTyxZQUFZLEVBQUU7b0JBQ3hILEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUM7aUJBQzdGLENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUF6QkQsOERBeUJDO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSw0QkFBYztJQUFwRDs7UUFDa0IsU0FBSSxHQUFHLGFBQWEsQ0FBQztJQWF2QyxDQUFDO0lBWFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFN0IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsd0ZBQXdGO1FBRXhGLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsOEJBQThCLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLDRCQUE0QixFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkYsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxpQ0FBaUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLDJCQUEyQixDQUFDLENBQUMsQ0FBQztJQUN2SCxDQUFDO0NBQ0Y7QUFkRCw0Q0FjQztBQUVELE1BQWEsVUFBVyxTQUFRLDRCQUFjO0lBQTlDOztRQUNrQixTQUFJLEdBQUcsOEJBQThCLENBQUM7SUF1QnhELENBQUM7SUFyQlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLHdCQUF3QjtRQUN4QixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRWpDLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQztRQUVyQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDN0MsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU3RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFdEIsYUFBYTtRQUNiLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDbkQ7UUFFRCx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM5RCx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNGO0FBeEJELGdDQXdCQztBQUVELE1BQWEsYUFBYyxTQUFRLDRCQUFjO0lBQWpEOztRQUNrQixTQUFJLEdBQUcsdUJBQXVCLENBQUM7SUFZakQsQ0FBQztJQVZRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVqQywwRUFBMEU7UUFDMUUsb0JBQW9CO1FBQ3BCLHVFQUF1RTtRQUN2RSx1RUFBdUU7UUFDdkUsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDRjtBQWJELHNDQWFDO0FBRUQsTUFBYSxtQkFBb0IsU0FBUSw0QkFBYztJQUF2RDs7UUFDa0IsU0FBSSxHQUFHLGdCQUFnQixDQUFDO0lBWTFDLENBQUM7SUFWUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsd0JBQXdCO1FBQ3hCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFakMsdUVBQXVFO1FBQ3ZFLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFOUMsa0RBQWtEO1FBQ2xELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFiRCxrREFhQztBQUVELE1BQWEsVUFBVyxTQUFRLDRCQUFjO0lBQTlDOztRQUNrQixTQUFJLEdBQUcsb0JBQW9CLENBQUM7SUFROUMsQ0FBQztJQU5RLFFBQVEsQ0FBQyxHQUFnQjtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVqQyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUNGO0FBVEQsZ0NBU0M7QUFFRCxNQUFhLHVCQUF3QixTQUFRLDRCQUFjO0lBQTNEOztRQUNrQixTQUFJLEdBQUcseUJBQXlCLENBQUM7SUFZbkQsQ0FBQztJQVZRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUU3Qix3QkFBd0I7UUFDeEIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVqQywyQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsOEJBQThCO0lBQzNGLENBQUM7Q0FDRjtBQWJELDBEQWFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsNEJBQWM7SUFBN0M7O1FBQ2tCLFNBQUksR0FBRyxzQkFBc0IsQ0FBQztJQWFoRCxDQUFDO0lBWFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRELElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsaUZBQWlGO2dCQUMxRixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQzthQUM5QyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQWRELDhCQWNDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLDRCQUFjO0lBQXJEOztRQUNrQixTQUFJLEdBQUcsMkJBQTJCLENBQUM7SUFZckQsQ0FBQztJQVZRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDeEQsSUFBSSxXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUscURBQXFELFdBQVcsY0FBYztnQkFDdkYsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDO2FBQzNELENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGO0FBYkQsOENBYUM7QUFFRDs7R0FFRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsNEJBQWM7SUFBM0Q7O1FBQ2tCLFNBQUksR0FBRyx1QkFBdUIsQ0FBQztJQWVqRCxDQUFDO0lBYlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELEtBQUssTUFBTSxVQUFVLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN2RCxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLGlCQUFpQixVQUFVLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxPQUFPLDZCQUE2QjtnQkFDNUYsR0FBRyxFQUFFLEdBQUcsRUFBRTtvQkFDUixHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzFELEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEMsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGO0FBaEJELDBEQWdCQztBQUVELFNBQVMsZUFBZSxDQUFDLElBQVk7SUFDbkMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxJQUFZO0lBQ2pDLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxlQUFlLENBQUM7SUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxLQUFLLGNBQWMsQ0FBQztJQUUvQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXZDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ2pDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFYixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV6RyxPQUFPO1FBQ0wsV0FBVyxFQUFFLHlCQUF5QixjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7UUFDekgsZUFBZSxFQUNiLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSztZQUNwQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNO2dCQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7b0JBQ2hGLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO3dCQUM5QixDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUU7UUFDekIsZUFBZSxFQUFFLGFBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFO1lBQ04sUUFBUSxFQUFFLFdBQVcsVUFBVSxFQUFFO1lBQ2pDLE1BQU0sRUFBRSxXQUFXLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1NBQ25EO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQWEsNkJBQThCLFNBQVEsNEJBQWM7SUFBakU7O1FBQ2tCLFNBQUksR0FBRyxhQUFhLENBQUM7SUF5QnZDLENBQUM7SUF2QlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFN0Isa0VBQWtFO1FBQ2xFLCtEQUErRDtRQUMvRCxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssY0FBYyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRW5ELE1BQU0sTUFBTSxHQUFHLGNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQXVCLENBQUM7UUFDbkcsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSwrQkFBK0IsRUFBRSxVQUFVLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUxSCxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0QsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkYsSUFBSSxZQUFZLEtBQUssY0FBYyxFQUFFO2dCQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsT0FBTyxFQUFFLCtFQUErRSxjQUFjLFNBQVMsWUFBWSxHQUFHO29CQUM5SCxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsRUFBRSxVQUFVLENBQUMsZUFBZSxDQUFDO2lCQUNyRyxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBMUJELHNFQTBCQztBQUVEOztHQUVHO0FBQ0gsTUFBYSwyQkFBNEIsU0FBUSw0QkFBYztJQUEvRDs7UUFDa0IsU0FBSSxHQUFHLHNCQUFzQixDQUFDO0lBUWhELENBQUM7SUFOUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUU3QixNQUFNLFlBQVksR0FBRyxnRkFBZ0YsQ0FBQztRQUN0RyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLDZCQUE2QixFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzFFLENBQUM7Q0FDRjtBQVRELGtFQVNDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLDRCQUFjO0lBQTFEOztRQUNrQixTQUFJLEdBQUcsMEJBQTBCLENBQUM7SUFVcEQsQ0FBQztJQVJRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFN0MsMEJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFDM0IsR0FBRyxFQUNILGlCQUFpQixFQUNqQixHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyw0REFBNEQ7SUFDN0gsQ0FBQztDQUNGO0FBWEQsd0RBV0M7QUFFRDs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSw0QkFBYztJQUFuRDs7UUFDa0IsU0FBSSxHQUFHLDRCQUE0QixDQUFDO0lBWXRELENBQUM7SUFWUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRTdDLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXpELDJEQUEyRDtRQUMzRCxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUM7UUFDbkMsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUFiRCwwQ0FhQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQWEsOENBQStDLFNBQVEsNEJBQWM7SUFBbEY7O1FBQ2tCLFNBQUksR0FBRywwQ0FBMEMsQ0FBQztJQWlCcEUsQ0FBQztJQWZRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUN6RSxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFBRSxTQUFTO2FBQUU7WUFFM0MsbURBQW1EO1lBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFBRTtnQkFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxjQUFjLE9BQU8sc0JBQXNCLFVBQVUsaUNBQWlDLFdBQVcsR0FBRztvQkFDN0csR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO2lCQUN0RCxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBbEJELHdHQWtCQztBQUVEOzs7R0FHRztBQUNILE1BQWEsOEJBQStCLFNBQVEsNEJBQWM7SUFBbEU7O1FBQ2tCLFNBQUksR0FBRyxxQ0FBcUMsQ0FBQztJQWlEL0QsQ0FBQztJQS9DUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsMkVBQTJFO1FBQzNFLHVFQUF1RTtRQUN2RSwwRUFBMEU7UUFDMUUsdUVBQXVFO1FBQ3ZFLGlDQUFpQztRQUNqQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyw0REFBNEQ7UUFDOUgsTUFBTSxNQUFNLEdBQUc7WUFDYiw4QkFBOEI7WUFDOUIsa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUNqQixnQ0FBZ0M7WUFDaEMsc0JBQXNCO1lBQ3RCLG1CQUFtQjtTQUNwQixDQUFDO1FBRUYsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDekQsU0FBUzthQUNWO1lBRUQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxjQUFjLE9BQU8sdUNBQXVDO29CQUNyRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7aUJBQzNELENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxPQUFPLEtBQUssZUFBZSxFQUFFO2dCQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDO29CQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsT0FBTyxFQUFFLG1CQUFtQixPQUFPLDRCQUE0QixlQUFlLEVBQUU7b0JBQ2hGLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQztpQkFDM0QsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFJLFVBQVUsS0FBSyxlQUFlLEVBQUU7Z0JBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixPQUFPLEVBQUUsY0FBYyxPQUFPLGdDQUFnQyxlQUFlLEVBQUU7b0JBQy9FLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7aUJBQ3ZELENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFsREQsd0VBa0RDO0FBRUQsTUFBYSxhQUFjLFNBQVEsNEJBQWM7SUFBakQ7O1FBQ2tCLFNBQUksR0FBRyx3QkFBd0IsQ0FBQztJQU1sRCxDQUFDO0lBSlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6RCx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNGO0FBUEQsc0NBT0M7QUFFRCxNQUFhLGtCQUFtQixTQUFRLDRCQUFjO0lBQXREOztRQUNrQixTQUFJLEdBQUcsY0FBYyxDQUFDO0lBTXhDLENBQUM7SUFKUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0Y7QUFQRCxnREFPQztBQUVELE1BQWEsdUJBQXdCLFNBQVEsNEJBQWM7SUFBM0Q7O1FBQ2tCLFNBQUksR0FBRyxhQUFhLENBQUM7SUFjdkMsQ0FBQztJQVpRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRTdCLHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFDNUMsTUFBTSxFQUNOLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLGFBQWEsRUFDYixPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWZELDBEQWVDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsNEJBQWM7SUFBbkQ7O1FBQ2tCLFNBQUksR0FBRyw0QkFBNEIsQ0FBQztJQU90RCxDQUFDO0lBTFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUU3QyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFSRCwwQ0FRQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSw0QkFBYztJQUExRDs7UUFDa0IsU0FBSSxHQUFHLHNDQUFzQyxDQUFDO0lBT2hFLENBQUM7SUFMUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUU3QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLHlCQUF5QixFQUFFLG9DQUFvQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztDQUNGO0FBUkQsd0RBUUM7QUFFRDs7R0FFRztBQUNILE1BQWEsY0FBZSxTQUFRLDRCQUFjO0lBQWxEOztRQUNrQixTQUFJLEdBQUcsMkJBQTJCLENBQUM7SUFjckQsQ0FBQztJQVpRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDN0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRXZDLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXZELDhEQUE4RDtRQUM5RCx1QkFBdUI7UUFDdkIsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1RCx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUNGO0FBZkQsd0NBZUM7QUFFRDs7R0FFRztBQUNILE1BQWEsOEJBQStCLFNBQVEsNEJBQWM7SUFBbEU7O1FBQ2tCLFNBQUksR0FBRyxzQkFBc0IsQ0FBQztJQUtoRCxDQUFDO0lBSFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLDRCQUE0QixDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBTkQsd0VBTUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSw0QkFBYztJQUF4RDs7UUFDa0IsU0FBSSxHQUFHLDRCQUE0QixDQUFDO0lBV3RELENBQUM7SUFUUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVwQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RCwwQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUMzQixHQUFHLEVBQ0gsaUJBQWlCLEVBQ2pCLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLDREQUE0RDtJQUM3SCxDQUFDO0NBQ0Y7QUFaRCxvREFZQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsNEJBQWM7SUFBaEQ7O1FBQ2tCLFNBQUksR0FBRyw2QkFBNkIsQ0FBQztJQU92RCxDQUFDO0lBTFEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFRO1NBQUU7UUFFOUIsaUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0Y7QUFSRCxvQ0FRQztBQUVELE1BQWEsZUFBZ0IsU0FBUSw0QkFBYztJQUFuRDs7UUFDa0IsU0FBSSxHQUFHLDhCQUE4QixDQUFDO0lBdUJ4RCxDQUFDO0lBckJRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUM7UUFFNUIsMEJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLDREQUE0RDtRQUVySixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLG1GQUFtRjtnQkFDNUYsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUN4RCxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDdkMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSxnQ0FBZ0MsR0FBRyxNQUFNO2dCQUNsRCxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO2FBQ3hELENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGO0FBeEJELDBDQXdCQztBQUVELE1BQWEsVUFBVyxTQUFRLDRCQUFjO0lBQTlDOztRQUNrQixTQUFJLEdBQUcsc0JBQXNCLENBQUM7SUFrQmhELENBQUM7SUFoQlEsUUFBUSxDQUFDLEdBQWdCO1FBQzlCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVwRCxTQUFTLGNBQWMsQ0FBQyxRQUFnQixFQUFFLElBQVU7WUFDbEQsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDVCxRQUFRO3dCQUNSLE9BQU8sRUFBRSxtQ0FBbUMsQ0FBQyxFQUFFO3FCQUNoRCxDQUFDLENBQUM7aUJBQ0o7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUFuQkQsZ0NBbUJDO0FBT0Q7Ozs7R0FJRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsNEJBQWM7SUFBdEQ7O1FBQ2tCLFNBQUksR0FBRyxrQ0FBa0MsQ0FBQztRQUV6QyxnQkFBVyxHQUE0QixFQUFFLENBQUM7UUFDMUMsYUFBUSxHQUFvQyxFQUFFLENBQUM7SUE2RGxFLENBQUM7SUEzRFEsT0FBTyxDQUFDLEdBQWdCO1FBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU8sVUFBVSxDQUFDLElBQXlDO1FBQzFELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sWUFBWSxDQUFDLEdBQWdCLEVBQUUsT0FBZTtRQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVuQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFNBQVMsQ0FBQyxHQUFXLEVBQUUsT0FBZTtRQUM1QyxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7WUFDbkIscUNBQXFDO1lBQ3JDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDekI7UUFFRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNoRDthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxHQUFnQixFQUFFLFFBQWdCLEVBQUUsR0FBVztRQUNqRSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzNCLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLE9BQU87U0FDUjtRQUVELG9GQUFvRjtRQUNwRix1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUV4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4RSxDQUFDO0NBQ0Y7QUFqRUQsZ0RBaUVDO0FBRUQsTUFBYSxPQUFRLFNBQVEsNEJBQWM7SUFBM0M7O1FBQ2tCLFNBQUksR0FBRyxTQUFTLENBQUM7SUFhbkMsQ0FBQztJQVhRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDZixPQUFPO1NBQ1I7UUFFRCxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDRjtBQWRELDBCQWNDO0FBRUQsTUFBYSxNQUFPLFNBQVEsNEJBQWM7SUFBMUM7O1FBQ2tCLFNBQUksR0FBRyxRQUFRLENBQUM7SUFTbEMsQ0FBQztJQVBRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLE9BQU8saUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNoRTtRQUVELGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNGO0FBVkQsd0JBVUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxpQ0FBa0MsU0FBUSw0QkFBYztJQUFyRTs7UUFDa0IsU0FBSSxHQUFHLGlDQUFpQyxDQUFDO0lBbUIzRCxDQUFDO0lBakJRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRTdCLEtBQUssTUFBTSxLQUFLLElBQUksd0JBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3RELE1BQU0sUUFBUSxHQUFHLHlCQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWxELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDakQsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJO29CQUMxQixPQUFPLEVBQUUsZ0JBQWdCLFFBQVEsQ0FBQyxXQUFXLHFEQUFxRDtpQkFDbkcsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsZUFBZSxDQUFDO1lBQ2xHLHdCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztTQUM1RTtJQUNILENBQUM7Q0FDRjtBQXBCRCw4RUFvQkM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLHVCQUF3QixTQUFRLDRCQUFjO0lBQTNEOztRQUNrQixTQUFJLEdBQUcsNEJBQTRCLENBQUM7SUFjdEQsQ0FBQztJQVpRLFFBQVEsQ0FBQyxHQUFnQjtRQUM5QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQztRQUNsQyxNQUFNLE9BQU8sR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDO1FBRXJDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQztRQUM5QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1RyxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztRQUN2QyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLDRCQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqSSxDQUFDO0NBQ0Y7QUFmRCwwREFlQztBQUVELE1BQWEsOEJBQStCLFNBQVEsNEJBQWM7SUFBbEU7O1FBQ2tCLFNBQUksR0FBRyxtQ0FBbUMsQ0FBQztJQThCN0QsQ0FBQztJQTVCUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsTUFBTSxPQUFPLEdBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQztRQUM1RixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRXJDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFFekUsTUFBTSxPQUFPLEdBQWEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyw0REFBNEQ7UUFFbkksTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUNwQyxLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRTtZQUN6QixLQUFLLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO2dCQUNqRixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUFFLFNBQVM7aUJBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckI7U0FDRjtRQUVELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSwrREFBK0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUYsR0FBRyxFQUFFLEdBQUcsRUFBRTtvQkFDUixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyw0REFBNEQ7b0JBQzFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN4RixFQUFFLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3ZHLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQS9CRCx3RUErQkM7QUFFRCxNQUFhLG9CQUFxQixTQUFRLDRCQUFjO0lBQXhEOztRQUNrQixTQUFJLEdBQUcsdUJBQXVCLENBQUM7SUFtQ2pELENBQUM7SUFqQ1EsUUFBUSxDQUFDLEdBQWdCOztRQUM5QixNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztRQUVsQyxJQUFJLE9BQUEsR0FBRyxDQUFDLGVBQWUsMENBQUUsVUFBVSxLQUFJLE9BQUEsR0FBRyxDQUFDLGVBQWUsMENBQUUsVUFBVSxNQUFLLGdCQUFnQixFQUFFO1lBQzNGLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsZ0RBQWdELGdCQUFnQixFQUFFO2dCQUMzRSxHQUFHLEVBQUUsR0FBRyxFQUFFO29CQUNSLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztnQkFDdkQsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsS0FBSyxnQkFBZ0IsRUFBRTtZQUNuRixHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLGdEQUFnRCxnQkFBZ0IsRUFBRTtnQkFDM0UsR0FBRyxFQUFFLEdBQUcsRUFBRTtvQkFDUixHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDNUYsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSxnREFBZ0QsZ0JBQWdCLHNCQUFzQjtvQkFDL0YsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDUixHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3hELENBQUM7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtJQUNILENBQUM7Q0FDRjtBQXBDRCxvREFvQ0M7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLDRCQUFjO0lBQTFEOztRQUNrQixTQUFJLEdBQUcscUJBQXFCLENBQUM7SUFnQi9DLENBQUM7SUFkUSxRQUFRLENBQUMsR0FBZ0I7O1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFN0IsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSwwQ0FBRSxRQUFRLE1BQUssS0FBSyxFQUFFO1lBQ3pDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsb0RBQW9EO2dCQUM3RCxHQUFHLEVBQUUsR0FBRyxFQUFFOztvQkFDUixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsU0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsbUNBQUksRUFBRyxDQUFDO29CQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUNyQyxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0NBQ0Y7QUFqQkQsd0RBaUJDO0FBRUQsTUFBYSxXQUFZLFNBQVEsNEJBQWM7SUFBL0M7O1FBQ2tCLFNBQUksR0FBRyxxQkFBcUIsQ0FBQztJQXdCL0MsQ0FBQztJQXRCUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxjQUFjLENBQUM7UUFDeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUNwQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLDhEQUE4RDtnQkFDdkUsR0FBRyxFQUFFLEdBQUcsRUFBRTtvQkFDUixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxFQUFFLENBQUMsYUFBYSxDQUNkLGdCQUFnQixFQUNoQjt3QkFDRSwrQkFBK0IsWUFBWSwyQ0FBMkM7d0JBQ3RGLGtFQUFrRTt3QkFDbEUsOEJBQThCO3FCQUMvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQ3BCLENBQUM7Z0JBQ0osQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBQ0Qsd0JBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2pFLHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0Y7QUF6QkQsa0NBeUJDO0FBRUQsTUFBYSxTQUFVLFNBQVEsNEJBQWM7SUFBN0M7O1FBQ2tCLFNBQUksR0FBRywwQkFBMEIsQ0FBQztJQTRDcEQsQ0FBQztJQTFDUSxRQUFRLENBQUMsR0FBZ0I7UUFDOUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFN0MsMERBQTBEO1FBQzFELHlCQUF5QjtRQUN6QixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixPQUFPLEVBQUUsb0dBQW9HO2dCQUM3RyxHQUFHLEVBQUUsR0FBRyxFQUFFO29CQUNSLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDbkMsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQsMkVBQTJFO1FBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ2xCLE9BQU87U0FDUjtRQUVELE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUM7UUFDNUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLGdFQUFnRTtnQkFDekUsR0FBRyxFQUFFLEdBQUcsRUFBRTtvQkFDUixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxFQUFFLENBQUMsYUFBYSxDQUNkLGtCQUFrQixFQUNsQjt3QkFDRSwrQkFBK0IsWUFBWSw4Q0FBOEM7d0JBQ3pGLDhCQUE4QjtxQkFDL0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUNwQixDQUFDO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtRQUNELHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25FLHdCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDRjtBQTdDRCw4QkE2Q0M7QUFFRCxNQUFhLHdCQUF5QixTQUFRLDRCQUFjO0lBQTVEOztRQUNrQixTQUFJLEdBQUcsNEJBQTRCLENBQUM7UUFFcEQsdURBQXVEO1FBQ3RDLG1CQUFjLEdBQUc7WUFDaEMsa0JBQWtCO1lBQ2xCLGdDQUFnQztZQUNoQyw4QkFBOEI7WUFDOUIsaUJBQWlCO1lBQ2pCLHNCQUFzQjtZQUN0QixtQkFBbUI7WUFDbkIsYUFBYTtZQUNiLFNBQVM7WUFDVCxTQUFTO1lBQ1QsS0FBSztZQUNMLFlBQVk7U0FDYixDQUFDO0lBcUNKLENBQUM7SUFuQ1EsUUFBUSxDQUFDLEdBQWdCOztRQUM5QixJQUFJLGVBQWUsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMzQixrR0FBa0c7WUFDbEcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRTtnQkFDNUUsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLE9BQU8sRUFBRSx3QkFBd0I7b0JBQ2pDLEdBQUcsRUFBRSxHQUFHLEVBQUU7d0JBQ1IsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDMUIsQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtpQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQ3BGLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ1QsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixPQUFPLEVBQUUsNEJBQTRCO29CQUNyQyxHQUFHLEVBQUUsR0FBRyxFQUFFO3dCQUNSLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU07WUFDTCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLDBDQUFFLE9BQU8sQ0FBQSxFQUFFO2dCQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUNULFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsT0FBTyxFQUFFLHlEQUF5RDtvQkFDbEUsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDUixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRzs0QkFDakIsT0FBTyxFQUFFLElBQUk7eUJBQ2QsQ0FBQztvQkFDSixDQUFDO2lCQUNGLENBQUMsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFyREQsNERBcURDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsTUFBTSxDQUFDLEdBQWdCO0lBQzlCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsS0FBSyxDQUFDLEdBQWdCOztJQUM3QixPQUFPLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsMENBQUUsY0FBYyxLQUFJLElBQUksQ0FBQztBQUN2RCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsR0FBZ0I7SUFDeEMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxhQUFhLENBQUMsR0FBZ0I7SUFDckMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUU3QyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHNCQUFzQixDQUFDLEdBQWdCO0lBQzlDLE1BQU0sT0FBTyxHQUFHO1FBQ2QsaUJBQWlCO1FBQ2pCLGNBQWM7UUFDZCxTQUFTO1FBQ1QsY0FBYztLQUNmLENBQUM7SUFFRixPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDM0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQVc7SUFDM0IsT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBWTtJQUNsQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUYsQ0FBQztBQUVELFNBQVMsZUFBZTtJQUN0QixpRUFBaUU7SUFDakUsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsU0FBUyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sV0FBVyxDQUFDLFlBQXNCLENBQUM7QUFDNUMsQ0FBQyJ9