"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const awsCdkMigration = require("aws-cdk-migration");
const fs = require("fs-extra");
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
function transformPackages() {
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
    function copyOrTransformFiles(pkg, srcDir, destDir, ignoredFiles) {
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
            }
            else if (sourceFileName === '.gitignore') {
                // ignore everything, otherwise there are uncommitted files present in testing,
                // because the module's .gitignore file has entries like !.eslintrc.js
                const gitIgnoreContents = fs.readFileSync(source);
                fs.outputFileSync(destination, Buffer.concat([gitIgnoreContents, Buffer.from('\n*\n')]));
            }
            else if (sourceFileName === '.eslintrc.js') {
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
            }
            else if (sourceFileName === 'index.ts') {
                // Remove any exports for generated L1s, e.g.:
                // export * from './apigatewayv2.generated';
                const indexLines = fs.readFileSync(source, 'utf8')
                    .split('\n')
                    .filter(line => !line.match(/export \* from '.*\.generated'/))
                    .join('\n');
                fs.outputFileSync(destination, indexLines);
            }
            else if (sourceFileName.endsWith('.ts') && !sourceFileName.endsWith('.d.ts') || sourceFileName.endsWith('.ts-fixture')) {
                const sourceCode = fs.readFileSync(source).toString();
                const sourceCodeOutput = awsCdkMigration.rewriteMonoPackageImports(sourceCode, 'aws-cdk-lib', sourceFileName, {
                    customModules: alphaPackages,
                    rewriteCfnImports: true,
                    packageUnscopedName: `${pkg.name.substring('@aws-cdk/'.length)}`,
                });
                fs.outputFileSync(destination, sourceCodeOutput);
            }
            else if (sourceFileName === 'README.md') {
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
            }
            else {
                const stat = fs.statSync(source);
                if (stat.isDirectory()) {
                    // we only ignore files on the top level in the package,
                    // as some subdirectories we do want to copy over
                    // (for example, synthetics contains a node_modules/ in the test/ directory
                    // that is needed for running the tests)
                    copyOrTransformFiles(pkg, source, destination, []);
                }
                else {
                    fs.copySync(source, destination);
                }
            }
        }
    }
}
function transformPackageJson(pkg, source, destination, alphaPackages) {
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
function transformPackageJsonDependencies(packageJson, pkg, alphaPackages) {
    // regular dependencies
    const alphaDependencies = {};
    const constructsAndCdkLibDevDeps = {};
    const bundledDependencies = {};
    const v1BundledDependencies = packageJson.bundledDependencies || [];
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
                }
                else if (v1BundledDependencies.indexOf(dependency) !== -1) {
                    // ...other than third-party dependencies, which are in bundledDependencies
                    bundledDependencies[dependency] = packageJson.dependencies[dependency];
                }
        }
    }
    packageJson.dependencies = bundledDependencies;
    // devDependencies
    const alphaDevDependencies = {};
    const devDependencies = {};
    for (const v1DevDependency of Object.keys(packageJson.devDependencies || {})) {
        switch (v1DevDependency) {
            // @core corresponds to aws-cdk-lib
            // this is needed for packages that only have a dev dependency on @core
            case '@aws-cdk/core':
                devDependencies['aws-cdk-lib'] = pkg.version;
                break;
            case '@aws-cdk/assert-internal':
            case '@aws-cdk/assert':
                devDependencies['@aws-cdk/assert'] = packageJson.devDependencies[v1DevDependency];
                break;
            default:
                if (alphaPackages[v1DevDependency]) {
                    alphaDevDependencies[alphaPackages[v1DevDependency]] = packageJson.version;
                }
                else if (!v1DevDependency.startsWith('@aws-cdk/') || isRequiredTool(v1DevDependency)) {
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
        }, {})),
        ...(Object.entries(constructsAndCdkLibDevDeps)
            .reduce((acc, [depName, depVersion]) => {
            acc[depName] = `${depVersion.startsWith('^') ? '' : '^'}${depVersion}`;
            return acc;
        }, {})),
    };
    packageJson.peerDependencies = undefined;
    return finalPackageJson;
}
function getAlphaPackages(packages) {
    return packages
        .filter(packageIsAlpha)
        .reduce((acc, pkg) => {
        acc[pkg.name] = `${pkg.name}-alpha`;
        return acc;
    }, {});
}
function packageIsAlpha(pkg) {
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
    // Also, don't re-transform already alpha-ed packages
    return pkg.name.startsWith('@aws-cdk/') && !!pkg.get('jsii') && !pkg.name.endsWith('-alpha');
}
function isRequiredTool(name) {
    return REQUIRED_TOOLS.has(name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLXBhY2thZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJhbnNmb3JtLXBhY2thZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHFEQUFxRDtBQUNyRCwrQkFBK0I7QUFDL0IsaUVBQWlFO0FBQ2pFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hELGlFQUFpRTtBQUNqRSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUV4RCxNQUFNLG9CQUFvQixHQUFHLEdBQUc7SUFDOUIsOEdBQThHO0lBQzlHLEVBQUU7SUFDRix5R0FBeUc7SUFDekcsR0FBRztJQUNILGdHQUFnRztDQUNqRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBRW5CLE1BQU0sNEJBQTRCLEdBQUc7OzsrR0FHMEUsQ0FBQztBQUVoSCxNQUFNLDBCQUEwQixHQUFHLGtIQUFrSCxDQUFDO0FBRXRKOzs7R0FHRztBQUNILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzdCLDBCQUEwQjtJQUMxQix1QkFBdUI7SUFDdkIsaUJBQWlCO0lBQ2pCLHdCQUF3QjtJQUN4QixrQkFBa0I7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCLEVBQUUsQ0FBQztBQUVwQixTQUFTLGlCQUFpQjtJQUN4Qix5RkFBeUY7SUFDekYsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqRCxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRTtRQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hC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QUFFRCxTQUFTLGdCQUFnQixDQUFDLFFBQWU7SUFDdkMsT0FBTyxRQUFRO1NBQ1osTUFBTSxDQUFDLGNBQWMsQ0FBQztTQUN0QixNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBUSxFQUFFLEVBQUU7UUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQztRQUNwQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUFRO0lBQzlCLGdGQUFnRjtJQUNoRixNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEQsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFFO1FBQ2hDLE9BQU8sY0FBYyxDQUFDO0tBQ3ZCO0lBRUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyQyxJQUFJLFFBQVEsS0FBSyxjQUFjLElBQUksUUFBUSxLQUFLLG1CQUFtQixFQUFFO1FBQ25FLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxpREFBaUQ7SUFDakQsMERBQTBEO0lBQzFELHFEQUFxRDtJQUNyRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0YsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLElBQVk7SUFDbEMsT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgYXdzQ2RrTWlncmF0aW9uIGZyb20gJ2F3cy1jZGstbWlncmF0aW9uJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCBsZXJuYV9wcm9qZWN0ID0gcmVxdWlyZSgnQGxlcm5hL3Byb2plY3QnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCB2ZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9zY3JpcHRzL3Jlc29sdmUtdmVyc2lvbicpO1xuXG5jb25zdCBDRk5fU1RBQklMSVRZX0JBTk5FUiA9IGAke1tcbiAgJyFbY2ZuLXJlc291cmNlczogU3RhYmxlXShodHRwczovL2ltZy5zaGllbGRzLmlvL2JhZGdlL2Nmbi0tcmVzb3VyY2VzLXN0YWJsZS1zdWNjZXNzLnN2Zz9zdHlsZT1mb3ItdGhlLWJhZGdlKScsXG4gICcnLFxuICAnPiBBbGwgY2xhc3NlcyB3aXRoIHRoZSBgQ2ZuYCBwcmVmaXggaW4gdGhpcyBtb2R1bGUgKFtDRk4gUmVzb3VyY2VzXSkgYXJlIGFsd2F5cyBzdGFibGUgYW5kIHNhZmUgdG8gdXNlLicsXG4gICc+JyxcbiAgJz4gW0NGTiBSZXNvdXJjZXNdOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9jb25zdHJ1Y3RzLmh0bWwjY29uc3RydWN0c19saWInLFxuXS5qb2luKCdcXG4nKX1cXG5cXG5gO1xuXG5jb25zdCBGRUFUVVJFX0NGTl9TVEFCSUxJVFlfQkFOTkVSID0gYD4gKipDRk4gUmVzb3VyY2VzOioqIEFsbCBjbGFzc2VzIHdpdGggdGhlIFxcYENmblxcYCBwcmVmaXggaW4gdGhpcyBtb2R1bGUgKFtDRk4gUmVzb3VyY2VzXSkgYXJlIGFsd2F5c1xuPiBzdGFibGUgYW5kIHNhZmUgdG8gdXNlLlxuPlxuPiBbQ0ZOIFJlc291cmNlc106IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnN0cnVjdHMuaHRtbCNjb25zdHJ1Y3RzX2xpYlxcblxcbjwhLS0gLS0+XFxuXFxuYDtcblxuY29uc3QgRkVBVFVSRV9DRk5fU1RBQklMSVRZX0xJTkUgPSAvQ0ZOIFJlc291cmNlc1xccytcXHwgIVxcW1N0YWJsZV1cXChodHRwczpcXC9cXC9pbWdcXC5zaGllbGRzXFwuaW9cXC9iYWRnZVxcL3N0YWJsZS1zdWNjZXNzXFwuc3ZnXFw/c3R5bGU9Zm9yLXRoZS1iYWRnZVxcKVxcbi9nbTtcblxuLyoqXG4gKiBAYXdzLWNkay8gc2NvcGVkIHBhY2thZ2VzIHRoYXQgbWF5IGJlIHByZXNlbnQgaW4gZGV2RGVwZW5kZW5jaWVzIGFuZCBuZWVkIHRvXG4gKiBiZSByZXRhaW5lZCAob3IgZWxzZSBwa2dsaW50IG1pZ2h0IGRlY2xhcmUgdGhlIHBhY2thZ2UgdW53b3J0aHkpLlxuICovXG5jb25zdCBSRVFVSVJFRF9UT09MUyA9IG5ldyBTZXQoW1xuICAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJyxcbiAgJ0Bhd3MtY2RrL2ludGVnLXJ1bm5lcicsXG4gICdAYXdzLWNkay9jZm4ydHMnLFxuICAnQGF3cy1jZGsvZXNsaW50LXBsdWdpbicsXG4gICdAYXdzLWNkay9wa2dsaW50Jyxcbl0pO1xuXG50cmFuc2Zvcm1QYWNrYWdlcygpO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1QYWNrYWdlcygpOiB2b2lkIHtcbiAgLy8gdGhlcmUgaXMgYSBsZXJuYS5qc29uIGluIHRoZSBpbmRpdmlkdWFsLXBhY2thZ2VzIGRpcmVjdG9yeSwgd2hlcmUgdGhpcyBzY3JpcHQgZXhlY3V0ZXNcbiAgY29uc3QgcHJvamVjdCA9IG5ldyBsZXJuYV9wcm9qZWN0LlByb2plY3QoX19kaXJuYW1lKTtcbiAgY29uc3QgcGFja2FnZXMgPSBwcm9qZWN0LmdldFBhY2thZ2VzU3luYygpO1xuICBjb25zdCBhbHBoYVBhY2thZ2VzID0gZ2V0QWxwaGFQYWNrYWdlcyhwYWNrYWdlcyk7XG5cbiAgZm9yIChjb25zdCBwa2cgb2YgcGFja2FnZXMpIHtcbiAgICBpZiAoIXBhY2thZ2VJc0FscGhhKHBrZykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHNyY0RpciA9IHBrZy5sb2NhdGlvbjtcbiAgICBjb25zdCBwYWNrYWdlVW5zY29wZWROYW1lID0gYCR7cGtnLm5hbWUuc3Vic3RyaW5nKCdAYXdzLWNkay8nLmxlbmd0aCl9YDtcbiAgICBjb25zdCBkZXN0RGlyID0gcGF0aC5qb2luKCcuJywgcGFja2FnZVVuc2NvcGVkTmFtZSk7XG4gICAgZnMubWtkaXJwU3luYyhkZXN0RGlyKTtcblxuICAgIGNvcHlPclRyYW5zZm9ybUZpbGVzKHBrZywgc3JjRGlyLCBkZXN0RGlyLCBbXG4gICAgICAvLyBsaXN0IG9mIGZpbGVzIHRvIF9ub3RfIGNvcHkgZnJvbSB0aGUgVjEgcGFja2FnZSByb290XG4gICAgICAvLyAuZ2l0aWdub3JlIGlzIG5vdCBvbiB0aGUgbGlzdCwgYmVjYXVzZSBwa2dsaW50IGNoZWNrcyBpdFxuICAgICAgJ2Rpc3QnLFxuICAgICAgJ25vZGVfbW9kdWxlcycsXG4gICAgICAnY292ZXJhZ2UnLFxuICAgICAgJy5ueWNfb3V0cHV0JyxcbiAgICAgICdueWMuY29uZmlnLmpzJyxcbiAgICAgICcuanNpaScsXG4gICAgICAndHNjb25maWcuanNvbicsXG4gICAgICAndHNjb25maWcudHNidWlsZGluZm8nLFxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY29weU9yVHJhbnNmb3JtRmlsZXMocGtnOiBhbnksIHNyY0Rpcjogc3RyaW5nLCBkZXN0RGlyOiBzdHJpbmcsIGlnbm9yZWRGaWxlczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHNyY0Rpcik7XG4gICAgZm9yIChjb25zdCBzb3VyY2VGaWxlTmFtZSBvZiBzb3VyY2VGaWxlcykge1xuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5pbmNsdWRlcyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlcnZpY2VOYW1lID0gcGtnLm5hbWUuc3Vic3RyaW5nKCdAYXdzLWNkay9hd3MtJy5sZW5ndGgpO1xuICAgICAgaWYgKHNvdXJjZUZpbGVOYW1lLnN0YXJ0c1dpdGgoYCR7c2VydmljZU5hbWV9LmdlbmVyYXRlZGApKSB7XG4gICAgICAgIC8vIFNraXAgY29weWluZyB0aGUgZ2VuZXJhdGVkIEwxIGZpbGVzOiBmb28uZ2VuZXJhdGVkLipcbiAgICAgICAgLy8gRG9uJ3Qgc2tpcCB0aGUgYXVnbWVudGF0aW9ucyBhbmQgY2FubmVkIG1ldHJpY3M6IGZvby1hdWdtZW50YXRpb25zLmdlbmVyYXRlZC4qLCBmb28tY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLiosXG4gICAgICAgIC8vIG9yIGFueSBvdGhlciBuZXcgZm9vLXguZ2VuZXJhdGVkLiogZm9ybWF0IHRoYXQgbWlnaHQgYmUgaW50cm9kdWNlZC5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhdGguam9pbihzcmNEaXIsIHNvdXJjZUZpbGVOYW1lKTtcbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gcGF0aC5qb2luKGRlc3REaXIsIHNvdXJjZUZpbGVOYW1lKTtcblxuICAgICAgaWYgKHNyY0RpciA9PT0gcGtnLmxvY2F0aW9uICYmIHNvdXJjZUZpbGVOYW1lID09PSAncGFja2FnZS5qc29uJykge1xuICAgICAgICAvLyBPbmx5IHRyYW5zZm9ybSBwYWNrYWdlSnNvbnMgYXQgdGhlIHBhY2thZ2Ugcm9vdCwgbm90IGluIGFueSBuZXN0ZWQgcGFja2FnZXMuXG4gICAgICAgIHRyYW5zZm9ybVBhY2thZ2VKc29uKHBrZywgc291cmNlLCBkZXN0aW5hdGlvbiwgYWxwaGFQYWNrYWdlcyk7XG4gICAgICB9IGVsc2UgaWYgKHNvdXJjZUZpbGVOYW1lID09PSAnLmdpdGlnbm9yZScpIHtcbiAgICAgICAgLy8gaWdub3JlIGV2ZXJ5dGhpbmcsIG90aGVyd2lzZSB0aGVyZSBhcmUgdW5jb21taXR0ZWQgZmlsZXMgcHJlc2VudCBpbiB0ZXN0aW5nLFxuICAgICAgICAvLyBiZWNhdXNlIHRoZSBtb2R1bGUncyAuZ2l0aWdub3JlIGZpbGUgaGFzIGVudHJpZXMgbGlrZSAhLmVzbGludHJjLmpzXG4gICAgICAgIGNvbnN0IGdpdElnbm9yZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZSk7XG4gICAgICAgIGZzLm91dHB1dEZpbGVTeW5jKGRlc3RpbmF0aW9uLCBCdWZmZXIuY29uY2F0KFtnaXRJZ25vcmVDb250ZW50cywgQnVmZmVyLmZyb20oJ1xcbipcXG4nKV0pKTtcbiAgICAgIH0gZWxzZSBpZiAoc291cmNlRmlsZU5hbWUgPT09ICcuZXNsaW50cmMuanMnKSB7XG4gICAgICAgIC8vIENoYW5nZSB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIG9mIHRoZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgcnVsZVxuICAgICAgICAvLyAoYXMgdGhlIHVuc3RhYmxlIHBhY2thZ2VzIGRvbid0IHVzZSBkaXJlY3QgZGVwZW5kZW5jaWVzLFxuICAgICAgICAvLyBidXQgaW5zdGVhZCBhIGNvbWJpbmF0aW9uIG9mIGRldkRlcGVuZGVuY2llcyArIHBlZXJEZXBlbmRlbmNpZXMpXG4gICAgICAgIGNvbnN0IGVzTGludFJjTGluZXMgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlKS50b1N0cmluZygpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgY29uc3QgcmVzdWx0RmlsZUxpbmVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBlc0xpbnRSY0xpbmVzKSB7XG4gICAgICAgICAgcmVzdWx0RmlsZUxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgLy8gcHV0IG91ciBuZXcgbGluZSByaWdodCBhZnRlciB0aGUgcGFyc2VyT3B0aW9ucy5wcm9qZWN0IHNldHRpbmcgbGluZSxcbiAgICAgICAgICAvLyBhcyBzb21lIGZpbGVzIGV4cG9ydCBhIGNvcHkgb2YgdGhpcyBvYmplY3QsXG4gICAgICAgICAgLy8gaW4gd2hpY2ggY2FzZSBwdXR0aW5nIGl0IGF0IHRoZSBlbmQgZG9lc24ndCB3b3JrXG4gICAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnYmFzZUNvbmZpZy5wYXJzZXJPcHRpb25zLnByb2plY3QnKSkge1xuICAgICAgICAgICAgcmVzdWx0RmlsZUxpbmVzLnB1c2goXCJcXG5iYXNlQ29uZmlnLnJ1bGVzWydpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMnXSA9IFsnZXJyb3InLCBcIiArXG4gICAgICAgICAgICAgICd7IGRldkRlcGVuZGVuY2llczogdHJ1ZSwgcGVlckRlcGVuZGVuY2llczogdHJ1ZSB9IF07XFxuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZzLm91dHB1dEZpbGVTeW5jKGRlc3RpbmF0aW9uLCByZXN1bHRGaWxlTGluZXMuam9pbignXFxuJykpO1xuICAgICAgfSBlbHNlIGlmIChzb3VyY2VGaWxlTmFtZSA9PT0gJ2luZGV4LnRzJykge1xuICAgICAgICAvLyBSZW1vdmUgYW55IGV4cG9ydHMgZm9yIGdlbmVyYXRlZCBMMXMsIGUuZy46XG4gICAgICAgIC8vIGV4cG9ydCAqIGZyb20gJy4vYXBpZ2F0ZXdheXYyLmdlbmVyYXRlZCc7XG4gICAgICAgIGNvbnN0IGluZGV4TGluZXMgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLCAndXRmOCcpXG4gICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgIC5maWx0ZXIobGluZSA9PiAhbGluZS5tYXRjaCgvZXhwb3J0IFxcKiBmcm9tICcuKlxcLmdlbmVyYXRlZCcvKSlcbiAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICAgIGZzLm91dHB1dEZpbGVTeW5jKGRlc3RpbmF0aW9uLCBpbmRleExpbmVzKTtcbiAgICAgIH0gZWxzZSBpZiAoc291cmNlRmlsZU5hbWUuZW5kc1dpdGgoJy50cycpICYmICFzb3VyY2VGaWxlTmFtZS5lbmRzV2l0aCgnLmQudHMnKSB8fCBzb3VyY2VGaWxlTmFtZS5lbmRzV2l0aCgnLnRzLWZpeHR1cmUnKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VDb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZSkudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc291cmNlQ29kZU91dHB1dCA9IGF3c0Nka01pZ3JhdGlvbi5yZXdyaXRlTW9ub1BhY2thZ2VJbXBvcnRzKHNvdXJjZUNvZGUsICdhd3MtY2RrLWxpYicsIHNvdXJjZUZpbGVOYW1lLCB7XG4gICAgICAgICAgY3VzdG9tTW9kdWxlczogYWxwaGFQYWNrYWdlcyxcbiAgICAgICAgICByZXdyaXRlQ2ZuSW1wb3J0czogdHJ1ZSxcbiAgICAgICAgICBwYWNrYWdlVW5zY29wZWROYW1lOiBgJHtwa2cubmFtZS5zdWJzdHJpbmcoJ0Bhd3MtY2RrLycubGVuZ3RoKX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgZnMub3V0cHV0RmlsZVN5bmMoZGVzdGluYXRpb24sIHNvdXJjZUNvZGVPdXRwdXQpO1xuICAgICAgfSBlbHNlIGlmIChzb3VyY2VGaWxlTmFtZSA9PT0gJ1JFQURNRS5tZCcpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBzdGFiaWxpdHkgYmFubmVyIGZvciBDZm4gY29uc3RydWN0cywgc2luY2UgdGhleSBkb24ndCBleGlzdCBpbiB0aGUgYWxwaGEgbW9kdWxlc1xuICAgICAgICBsZXQgc291cmNlQ29kZSA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2UpLnRvU3RyaW5nKCk7XG4gICAgICAgIFtDRk5fU1RBQklMSVRZX0JBTk5FUiwgRkVBVFVSRV9DRk5fU1RBQklMSVRZX0JBTk5FUiwgRkVBVFVSRV9DRk5fU1RBQklMSVRZX0xJTkVdLmZvckVhY2gocGF0dGVybiA9PiB7XG4gICAgICAgICAgc291cmNlQ29kZSA9IHNvdXJjZUNvZGUucmVwbGFjZShwYXR0ZXJuLCAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VDb2RlT3V0cHV0ID0gYXdzQ2RrTWlncmF0aW9uLnJld3JpdGVSZWFkbWVJbXBvcnRzKHNvdXJjZUNvZGUsICdhd3MtY2RrLWxpYicsIHNvdXJjZUZpbGVOYW1lLCB7XG4gICAgICAgICAgY3VzdG9tTW9kdWxlczogYWxwaGFQYWNrYWdlcyxcbiAgICAgICAgICByZXdyaXRlQ2ZuSW1wb3J0czogdHJ1ZSxcbiAgICAgICAgICBwYWNrYWdlVW5zY29wZWROYW1lOiBgJHtwa2cubmFtZS5zdWJzdHJpbmcoJ0Bhd3MtY2RrLycubGVuZ3RoKX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgZnMub3V0cHV0RmlsZVN5bmMoZGVzdGluYXRpb24sIHNvdXJjZUNvZGVPdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKHNvdXJjZSk7XG4gICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAvLyB3ZSBvbmx5IGlnbm9yZSBmaWxlcyBvbiB0aGUgdG9wIGxldmVsIGluIHRoZSBwYWNrYWdlLFxuICAgICAgICAgIC8vIGFzIHNvbWUgc3ViZGlyZWN0b3JpZXMgd2UgZG8gd2FudCB0byBjb3B5IG92ZXJcbiAgICAgICAgICAvLyAoZm9yIGV4YW1wbGUsIHN5bnRoZXRpY3MgY29udGFpbnMgYSBub2RlX21vZHVsZXMvIGluIHRoZSB0ZXN0LyBkaXJlY3RvcnlcbiAgICAgICAgICAvLyB0aGF0IGlzIG5lZWRlZCBmb3IgcnVubmluZyB0aGUgdGVzdHMpXG4gICAgICAgICAgY29weU9yVHJhbnNmb3JtRmlsZXMocGtnLCBzb3VyY2UsIGRlc3RpbmF0aW9uLCBbXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuY29weVN5bmMoc291cmNlLCBkZXN0aW5hdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtUGFja2FnZUpzb24ocGtnOiBhbnksIHNvdXJjZTogc3RyaW5nLCBkZXN0aW5hdGlvbjogc3RyaW5nLCBhbHBoYVBhY2thZ2VzOiB7IFtkZXA6IHN0cmluZ106IHN0cmluZzsgfSkge1xuICBjb25zdCBwYWNrYWdlSnNvbiA9IGZzLnJlYWRKc29uU3luYyhzb3VyY2UpO1xuICBjb25zdCBwa2dVbnNjb3BlZE5hbWUgPSBgJHtwa2cubmFtZS5zdWJzdHJpbmcoJ0Bhd3MtY2RrLycubGVuZ3RoKX1gO1xuXG4gIHBhY2thZ2VKc29uLm5hbWUgKz0gJy1hbHBoYSc7XG4gIGlmICh2ZXIuYWxwaGFWZXJzaW9uKSB7XG4gICAgcGFja2FnZUpzb24udmVyc2lvbiA9IHZlci5hbHBoYVZlcnNpb247XG4gIH1cbiAgcGFja2FnZUpzb24ucmVwb3NpdG9yeS5kaXJlY3RvcnkgPSBgcGFja2FnZXMvaW5kaXZpZHVhbC1wYWNrYWdlcy8ke3BrZ1Vuc2NvcGVkTmFtZX1gO1xuXG4gIC8vIEFsbCBpbmRpdmlkdWFsIHBhY2thZ2VzIGFyZSBwdWJsaWMgYnkgZGVmYXVsdCBvbiB2MSwgYW5kIHByaXZhdGUgYnkgZGVmYXVsdCBvbiB2Mi5cbiAgLy8gV2UgbmVlZCB0byBmbGlwIHRoZXNlIGFyb3VuZCwgc28gd2UgZG9uJ3QgcHVibGlzaCBhbHBoYXMgb24gdjEsIGJ1dCAqZG8qIG9uIHYyLlxuICAvLyBXZSBhbHNvIHNob3VsZCBvbmx5IGRvIHRoaXMgZm9yIHBhY2thZ2VzIHdlIGludGVuZCB0byBwdWJsaXNoICh0aG9zZSB3aXRoIGEgYHB1Ymxpc2hDb25maWdgKVxuICBpZiAocGFja2FnZUpzb24ucHVibGlzaENvbmZpZykge1xuICAgIHBhY2thZ2VKc29uLnByaXZhdGUgPSAhcGFja2FnZUpzb24ucHJpdmF0ZTtcbiAgICBwYWNrYWdlSnNvbi5wdWJsaXNoQ29uZmlnLnRhZyA9ICdsYXRlc3QnO1xuICAgIGlmIChwYWNrYWdlSnNvbi5wcml2YXRlKSB7XG4gICAgICBwYWNrYWdlSnNvbi51YmVyZ2VuID0geyBleGNsdWRlOiB0cnVlIH07XG4gICAgfVxuICB9XG5cbiAgLy8gZGlzYWJsZSB0aGUgJ2Nsb3VkZm9ybWF0aW9uJyBkaXJlY3RpdmUgc2luY2UgYWxwaGEgbW9kdWxlcyBkb24ndCBjb250YWluIEwxIHJlc291cmNlcy5cbiAgY29uc3QgY2RrQnVpbGQgPSBwYWNrYWdlSnNvblsnY2RrLWJ1aWxkJ107XG4gIGlmIChjZGtCdWlsZCkge1xuICAgIGRlbGV0ZSBjZGtCdWlsZC5jbG91ZGZvcm1hdGlvbjtcbiAgICBwYWNrYWdlSnNvblsnY2RrLWJ1aWxkJ10gPSBjZGtCdWlsZDtcbiAgfVxuXG4gIC8vIGRpc2FibGUgYGNmbjJ0c2Agc2NyaXB0IHNpbmNlIGFscGhhIG1vZHVsZXMgZG9uJ3QgY29udGFpbiBMMSByZXNvdXJjZXMuXG4gIGRlbGV0ZSBwYWNrYWdlSnNvbi5zY3JpcHRzLmNmbjJ0cztcblxuICAvLyBkaXNhYmxlIGF3c2xpbnQgKHNvbWUgcnVsZXMgYXJlIGhhcmQtY29kZWQgdG8gQGF3cy1jZGsvY29yZSlcbiAgcGFja2FnZUpzb24uYXdzbGludCA9IHtcbiAgICBleGNsdWRlOiBbJyo6KiddLFxuICB9O1xuXG4gIC8vIGFkZCBhIHBrZ2xpbnQgZXhlbXB0aW9uIGZvciB0aGUgJ3BhY2thZ2UgbmFtZSA9IGRpciBuYW1lJyBydWxlXG4gIGNvbnN0IHBrZ2xpbnQgPSBwYWNrYWdlSnNvbi5wa2dsaW50IHx8IHt9O1xuICBwa2dsaW50LmV4Y2x1ZGUgPSBbXG4gICAgLi4uKHBrZ2xpbnQuZXhjbHVkZSB8fCBbXSksXG4gICAgJ25hbWluZy9wYWNrYWdlLW1hdGNoZXMtZGlyZWN0b3J5JyxcbiAgICAvLyB0aGUgZXhwZXJpbWVudGFsIHBhY2thZ2VzIG5lZWQgdGhlIFwicmVhbFwiIGFzc2VydCBkZXBlbmRlbmN5XG4gICAgJ2Fzc2VydC9hc3NlcnQtZGVwZW5kZW5jeScsXG4gIF07XG4gIHBhY2thZ2VKc29uLnBrZ2xpbnQgPSBwa2dsaW50O1xuXG4gIC8vIHR1cm4gb2ZmIHRoZSBMMSBnZW5lcmF0aW9uLCB3aGljaCB1c2VzIEBhd3MtY2RrLyBtb2R1bGVzXG4gIGlmIChwYWNrYWdlSnNvbi5zY3JpcHRzPy5nZW4gPT09ICdjZm4ydHMnKSB7XG4gICAgZGVsZXRlIHBhY2thZ2VKc29uLnNjcmlwdHMuZ2VuO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNTU3NlxuICBjb25zdCBqc2lpVGFyZ2V0cyA9IHBhY2thZ2VKc29uLmpzaWkudGFyZ2V0cztcbiAganNpaVRhcmdldHMuZG90bmV0Lm5hbWVzcGFjZSArPSAnLkFscGhhJztcbiAganNpaVRhcmdldHMuZG90bmV0LnBhY2thZ2VJZCArPSAnLkFscGhhJztcbiAganNpaVRhcmdldHMuamF2YS5wYWNrYWdlICs9ICcuYWxwaGEnO1xuICBqc2lpVGFyZ2V0cy5qYXZhLm1hdmVuLmFydGlmYWN0SWQgKz0gJy1hbHBoYSc7XG4gIGpzaWlUYXJnZXRzLnB5dGhvbi5kaXN0TmFtZSArPSAnLWFscGhhJztcbiAganNpaVRhcmdldHMucHl0aG9uLm1vZHVsZSArPSAnX2FscGhhJztcbiAgLy8gVHlwaWNhbGx5LCBvbmx5IG91ciB0b3AtbGV2ZWwgcGFja2FnZXMgaGF2ZSBhIEdvIHRhcmdldC5cbiAgLy8gcGFja2FnZU5hbWUgaGFzIHVudXNhYmxlIGNoYXJzIGFuZCByZWR1bmRhbnQgJ2F3cycgc3RyaXBwZWQuXG4gIC8vIFRoaXMgZ2VuZXJhdGVzIG5hbWVzIGxpa2UgJ2F3c2Nka2Zvb2JhcmFscGhhJyAocmF0aGVyIHRoYW4gJ2F3c2Nka2F3c2Zvb2JhcmFscGhhJykuXG4gIGpzaWlUYXJnZXRzLmdvID0ge1xuICAgIG1vZHVsZU5hbWU6ICdnaXRodWIuY29tL2F3cy9hd3MtY2RrLWdvJyxcbiAgICBwYWNrYWdlTmFtZTogcGFja2FnZUpzb24ubmFtZS5yZXBsYWNlKCcvYXdzLScsICcnKS5yZXBsYWNlKC9bXmEtejAtOS5dL2dpLCAnJykudG9Mb3dlckNhc2UoKSxcbiAgfTtcblxuICBjb25zdCBmaW5hbFBhY2thZ2VKc29uID0gdHJhbnNmb3JtUGFja2FnZUpzb25EZXBlbmRlbmNpZXMocGFja2FnZUpzb24sIHBrZywgYWxwaGFQYWNrYWdlcyk7XG5cbiAgZnMud3JpdGVKc29uU3luYyhkZXN0aW5hdGlvbiwgcGFja2FnZUpzb24sIHsgc3BhY2VzOiAyIH0pO1xuICBmcy53cml0ZUpzb25TeW5jKHBhdGguam9pbihwYXRoLmRpcm5hbWUoZGVzdGluYXRpb24pLCAnX3BhY2thZ2UuanNvbicpLCBmaW5hbFBhY2thZ2VKc29uLCB7IHNwYWNlczogMiB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtUGFja2FnZUpzb25EZXBlbmRlbmNpZXMocGFja2FnZUpzb246IGFueSwgcGtnOiBhbnksIGFscGhhUGFja2FnZXM6IHsgW2RlcDogc3RyaW5nXTogc3RyaW5nOyB9KSB7XG4gIC8vIHJlZ3VsYXIgZGVwZW5kZW5jaWVzXG4gIGNvbnN0IGFscGhhRGVwZW5kZW5jaWVzOiB7IFtkZXA6IHN0cmluZ106IHN0cmluZzsgfSA9IHt9O1xuICBjb25zdCBjb25zdHJ1Y3RzQW5kQ2RrTGliRGV2RGVwczogeyBbZGVwOiBzdHJpbmddOiBzdHJpbmc7IH0gPSB7fTtcbiAgY29uc3QgYnVuZGxlZERlcGVuZGVuY2llczogeyBbZGVwOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBjb25zdCB2MUJ1bmRsZWREZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gcGFja2FnZUpzb24uYnVuZGxlZERlcGVuZGVuY2llcyB8fCBbXTtcbiAgZm9yIChjb25zdCBkZXBlbmRlbmN5IG9mIE9iamVjdC5rZXlzKHBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyB8fCB7fSkpIHtcbiAgICAvLyBhbGwgJ3JlZ3VsYXInIGRlcGVuZGVuY2llcyBvbiBhbHBoYSBtb2R1bGVzIHdpbGwgYmUgY29udmVydGVkIHRvXG4gICAgLy8gYSBwYWlyIG9mIGRldkRlcGVuZGVuY3kgb24gJzAuMC4wJyBhbmQgcGVlckRlcGVuZGVuY3kgb24gJ14wLjAuMCcsXG4gICAgLy8gYW5kIHRoZSBwYWNrYWdlIHdpbGwgaGF2ZSBubyByZWd1bGFyIGRlcGVuZGVuY2llcyBhbnltb3JlXG4gICAgc3dpdGNoIChkZXBlbmRlbmN5KSB7XG4gICAgICAvLyBAY29yZSBjb3JyZXNwb25kcyB0byBhd3MtY2RrLWxpYlxuICAgICAgY2FzZSAnQGF3cy1jZGsvY29yZSc6XG4gICAgICAgIGNvbnN0cnVjdHNBbmRDZGtMaWJEZXZEZXBzWydhd3MtY2RrLWxpYiddID0gcGtnLnZlcnNpb247XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29uc3RydWN0cyc6XG4gICAgICAgIGNvbnN0cnVjdHNBbmRDZGtMaWJEZXZEZXBzLmNvbnN0cnVjdHMgPSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMuY29uc3RydWN0cztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoYWxwaGFQYWNrYWdlc1tkZXBlbmRlbmN5XSkge1xuICAgICAgICAgIGFscGhhRGVwZW5kZW5jaWVzW2FscGhhUGFja2FnZXNbZGVwZW5kZW5jeV1dID0gcGFja2FnZUpzb24udmVyc2lvbjtcbiAgICAgICAgfSBlbHNlIGlmICh2MUJ1bmRsZWREZXBlbmRlbmNpZXMuaW5kZXhPZihkZXBlbmRlbmN5KSAhPT0gLTEpIHtcbiAgICAgICAgICAvLyAuLi5vdGhlciB0aGFuIHRoaXJkLXBhcnR5IGRlcGVuZGVuY2llcywgd2hpY2ggYXJlIGluIGJ1bmRsZWREZXBlbmRlbmNpZXNcbiAgICAgICAgICBidW5kbGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldID0gcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuICAgICAgICB9XG4gICAgfVxuICB9XG4gIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyA9IGJ1bmRsZWREZXBlbmRlbmNpZXM7XG5cbiAgLy8gZGV2RGVwZW5kZW5jaWVzXG4gIGNvbnN0IGFscGhhRGV2RGVwZW5kZW5jaWVzOiB7IFtkZXA6IHN0cmluZ106IHN0cmluZzsgfSA9IHt9O1xuICBjb25zdCBkZXZEZXBlbmRlbmNpZXM6IHsgW2RlcDogc3RyaW5nXTogc3RyaW5nOyB9ID0ge307XG4gIGZvciAoY29uc3QgdjFEZXZEZXBlbmRlbmN5IG9mIE9iamVjdC5rZXlzKHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyB8fCB7fSkpIHtcbiAgICBzd2l0Y2ggKHYxRGV2RGVwZW5kZW5jeSkge1xuICAgICAgLy8gQGNvcmUgY29ycmVzcG9uZHMgdG8gYXdzLWNkay1saWJcbiAgICAgIC8vIHRoaXMgaXMgbmVlZGVkIGZvciBwYWNrYWdlcyB0aGF0IG9ubHkgaGF2ZSBhIGRldiBkZXBlbmRlbmN5IG9uIEBjb3JlXG4gICAgICBjYXNlICdAYXdzLWNkay9jb3JlJzpcbiAgICAgICAgZGV2RGVwZW5kZW5jaWVzWydhd3MtY2RrLWxpYiddID0gcGtnLnZlcnNpb247XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQGF3cy1jZGsvYXNzZXJ0LWludGVybmFsJzpcbiAgICAgIGNhc2UgJ0Bhd3MtY2RrL2Fzc2VydCc6XG4gICAgICAgIGRldkRlcGVuZGVuY2llc1snQGF3cy1jZGsvYXNzZXJ0J10gPSBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbdjFEZXZEZXBlbmRlbmN5XTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoYWxwaGFQYWNrYWdlc1t2MURldkRlcGVuZGVuY3ldKSB7XG4gICAgICAgICAgYWxwaGFEZXZEZXBlbmRlbmNpZXNbYWxwaGFQYWNrYWdlc1t2MURldkRlcGVuZGVuY3ldXSA9IHBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgICAgIH0gZWxzZSBpZiAoIXYxRGV2RGVwZW5kZW5jeS5zdGFydHNXaXRoKCdAYXdzLWNkay8nKSB8fCBpc1JlcXVpcmVkVG9vbCh2MURldkRlcGVuZGVuY3kpKSB7XG4gICAgICAgICAgZGV2RGVwZW5kZW5jaWVzW3YxRGV2RGVwZW5kZW5jeV0gPSBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbdjFEZXZEZXBlbmRlbmN5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuICBjb25zdCBmaW5hbFBhY2thZ2VKc29uID0geyAuLi5wYWNrYWdlSnNvbiB9O1xuICAvLyB3ZSBzYXZlIHRoZSBkZXZEZXBlbmRlbmNpZXMgaW4gYSB0ZW1wb3JhcnkgX3BhY2thZ2UuanNvblxuICBmaW5hbFBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyA9IHtcbiAgICAuLi5kZXZEZXBlbmRlbmNpZXMsXG4gICAgLi4uY29uc3RydWN0c0FuZENka0xpYkRldkRlcHMsXG4gICAgLi4uYWxwaGFEZXZEZXBlbmRlbmNpZXMsXG4gICAgLi4uYWxwaGFEZXBlbmRlbmNpZXMsXG4gIH07XG4gIHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyA9IHtcbiAgICAuLi5hbHBoYURldkRlcGVuZGVuY2llcyxcbiAgICAuLi5hbHBoYURlcGVuZGVuY2llcyxcbiAgfTtcblxuICAvLyBwZWVyIGRlcGVuZGVuY2llc1xuICBmaW5hbFBhY2thZ2VKc29uLnBlZXJEZXBlbmRlbmNpZXMgPSB7XG4gICAgLi4uKE9iamVjdC5lbnRyaWVzKGFscGhhRGVwZW5kZW5jaWVzKVxuICAgICAgLy8gZm9yIG90aGVyIGFscGhhIGRlcGVuZGVuY2llcywgd2UgbmVlZCB0byBkZXBlbmQgb24gZXhhY3QgdmVyc2lvbnNcbiAgICAgIC8vIChiZWNhdXNlIG9mIHRoZSBicmFraW5nIGNoYW5nZXMgYmV0d2VlbiB0aGVtKVxuICAgICAgLnJlZHVjZSgoYWNjLCBbZGVwTmFtZSwgZGVwVmVyc2lvbl0pID0+IHtcbiAgICAgICAgYWNjW2RlcE5hbWVdID0gZGVwVmVyc2lvbjtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9IGFzIHsgW2RlcDogc3RyaW5nXTogc3RyaW5nOyB9KSksXG4gICAgLi4uKE9iamVjdC5lbnRyaWVzKGNvbnN0cnVjdHNBbmRDZGtMaWJEZXZEZXBzKVxuICAgICAgLnJlZHVjZSgoYWNjLCBbZGVwTmFtZSwgZGVwVmVyc2lvbl0pID0+IHtcbiAgICAgICAgYWNjW2RlcE5hbWVdID0gYCR7ZGVwVmVyc2lvbi5zdGFydHNXaXRoKCdeJykgPyAnJyA6ICdeJ30ke2RlcFZlcnNpb259YDtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9IGFzIHsgW2RlcDogc3RyaW5nXTogc3RyaW5nOyB9KSksXG4gIH07XG4gIHBhY2thZ2VKc29uLnBlZXJEZXBlbmRlbmNpZXMgPSB1bmRlZmluZWQ7XG4gIHJldHVybiBmaW5hbFBhY2thZ2VKc29uO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYVBhY2thZ2VzKHBhY2thZ2VzOiBhbnlbXSk6IHsgW2RlcDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICByZXR1cm4gcGFja2FnZXNcbiAgICAuZmlsdGVyKHBhY2thZ2VJc0FscGhhKVxuICAgIC5yZWR1Y2UoKGFjYywgcGtnOiBhbnkpID0+IHtcbiAgICAgIGFjY1twa2cubmFtZV0gPSBgJHtwa2cubmFtZX0tYWxwaGFgO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHBhY2thZ2VJc0FscGhhKHBrZzogYW55KTogYm9vbGVhbiB7XG4gIC8vIGFsbG93IG1vZHVsZXMgdG8gZGVjaWRlIHRoZW1zZWx2ZXMgd2hldGhlciB0aGV5IHNob3VsZCBiZSBwYWNrYWdlZCBzZXBhcmF0ZWx5XG4gIGNvbnN0IHNlcGFyYXRlTW9kdWxlID0gcGtnLmdldCgnc2VwYXJhdGUtbW9kdWxlJyk7XG4gIGlmIChzZXBhcmF0ZU1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNlcGFyYXRlTW9kdWxlO1xuICB9XG5cbiAgY29uc3QgbWF0dXJpdHkgPSBwa2cuZ2V0KCdtYXR1cml0eScpO1xuICBpZiAobWF0dXJpdHkgIT09ICdleHBlcmltZW50YWwnICYmIG1hdHVyaXR5ICE9PSAnZGV2ZWxvcGVyLXByZXZpZXcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIHdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiAnQGF3cy1jZGsvJyBwYWNrYWdlcyxcbiAgLy8gYW5kIHRob3NlIHRoYXQgYXJlIEpTSUktZW5hYmxlZCAoc28gbm8gQGF3cy1jZGsvYXNzZXJ0KVxuICAvLyBBbHNvLCBkb24ndCByZS10cmFuc2Zvcm0gYWxyZWFkeSBhbHBoYS1lZCBwYWNrYWdlc1xuICByZXR1cm4gcGtnLm5hbWUuc3RhcnRzV2l0aCgnQGF3cy1jZGsvJykgJiYgISFwa2cuZ2V0KCdqc2lpJykgJiYgIXBrZy5uYW1lLmVuZHNXaXRoKCctYWxwaGEnKTtcbn1cblxuZnVuY3Rpb24gaXNSZXF1aXJlZFRvb2wobmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBSRVFVSVJFRF9UT09MUy5oYXMobmFtZSk7XG59XG4iXX0=