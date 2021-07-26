const lerna_project = require('@lerna/project');
const path = require('path');
const fs = require('fs-extra');
const awsCdkMigration = require('aws-cdk-migration');

copyFilesRemovingDependencies();

function copyFilesRemovingDependencies() {
    // there is a lerna.json in the individual-packages directory, where this script executes
    const project = new lerna_project.Project(__dirname);
    const packages = project.getPackagesSync();
    const unstablePackages = getUnstablePackages(packages);
    const jsiiRosettaVersion = project.manifest.devDependencies['jsii-rosetta'];
    for (const pkg of packages) {
        if (!packageIsUnstable(pkg)) {
            continue;
        }

        const srcDir = pkg.location;
        const packageUnscopedName = `${pkg.name.substring('@aws-cdk/'.length)}`;
        const destDir = path.join('.', packageUnscopedName);
        fs.mkdirp(destDir);

        copyOrTransformFiles(pkg, srcDir, destDir, jsiiRosettaVersion, unstablePackages);
    }
}

function copyOrTransformFiles(pkg, srcDir, destDir, jsiiRosettaVersion, unstablePackages) {
    const sourceFiles = fs.readdirSync(srcDir);
    for (const sourceFileName of sourceFiles) {
        if (shouldIgnoreFile(sourceFileName)) {
            continue;
        }

        const source = path.join(srcDir, sourceFileName);
        const destination = path.join(destDir, sourceFileName);

        let fileProcessed = false;
        if (sourceFileName === 'package.json') {
            const srcPackageJson = fs.readJsonSync(source);
            if (srcPackageJson.name === pkg.name) {
                const pkgUnscopedName = `${pkg.name.substring('@aws-cdk/'.length)}`;

                const destPkgName = `@aws-cdk-lib-alpha/${pkgUnscopedName}`;
                srcPackageJson.name = destPkgName;
                srcPackageJson.repository.directory = `packages/individual-packages/${pkgUnscopedName}`;

                // JSII targets
                const jsiiTargets = srcPackageJson.jsii.targets;
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

                // disable awslint (some rules are hard-coded to @aws-cdk/core)
                srcPackageJson.awslint = {
                    exclude: ['*:*']
                };

                // add a pkglint exemption for the 'package name = dir name' rule
                const pkglint = srcPackageJson.pkglint || {};
                pkglint.exclude = [
                    ...(pkglint.exclude || []),
                    'naming/package-matches-directory',
                    // the experimental packages need the "real" assert dependency
                    'assert/assert-dependency',
                ];
                srcPackageJson.pkglint = pkglint;

                // regular dependencies
                const unstableDependencies = {};
                for (const dependency of Object.keys(srcPackageJson.dependencies || {})) {
                    // all 'regular' dependencies on unstable modules will be converted to
                    // a pair of devDependency on '0.0.0' and peerDependency on '^0.0.0',
                    // and the package will have no regular dependencies anymore
                    if (unstablePackages[dependency]) {
                        unstableDependencies[unstablePackages[dependency]] = pkg.version;
                    }
                }
                srcPackageJson.dependencies = undefined;

                // devDependencies
                const unstableDevDependencies = {
                    // we need jsii-rosetta in the dependencies,
                    // otherwise the binary cannot be found when running the 'extract' script
                    'jsii-rosetta': jsiiRosettaVersion,
                };
                const devDependencies = srcPackageJson.devDependencies || {};
                for (const devDependency of Object.keys(devDependencies)) {
                    if (devDependency.startsWith('@aws-cdk/')) {
                        delete devDependencies[devDependency];
                    }
                    if (unstablePackages[devDependency]) {
                        unstableDevDependencies[unstablePackages[devDependency]] = pkg.version;
                    }
                }
                devDependencies['@aws-cdk/assert'] = pkg.version;
                devDependencies['aws-cdk-lib'] = pkg.version;
                devDependencies['constructs'] = '^10.0.0';
                // we save the devDependencies in a temporary key in package.json
                srcPackageJson.tmp_devDependencies = {
                    ...devDependencies,
                    ...unstableDevDependencies,
                    ...unstableDependencies,
                };
                srcPackageJson.devDependencies = {
                    ...unstableDevDependencies,
                    ...unstableDependencies,
                };

                // peer dependencies
                srcPackageJson.tmp_peerDependencies = {
                    'aws-cdk-lib': `^${pkg.version}`,
                    'constructs': '^10.0.0',
                    ...(Object.keys(unstableDependencies)
                        .reduce((acc, unstableDependency) => {
                            acc[unstableDependency] = `^${pkg.version}`;
                            return acc;
                        }, {})),
                };
                srcPackageJson.peerDependencies = undefined;

                // turn off the L1 generation, which uses @aws-cdk/ modules
                delete srcPackageJson.scripts.gen;

                fileProcessed = true;
                fs.writeJsonSync(destination, srcPackageJson, {spaces: 2});
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
                customModules: unstablePackages,
            });
            fs.outputFileSync(destination, sourceCodeOutput);
        }

        if (fileProcessed) {
            continue;
        }

        const stat = fs.statSync(source);
        if (stat.isDirectory()) {
            copyOrTransformFiles(pkg, source, destination, jsiiRosettaVersion, unstablePackages);
        } else {
            fs.copy(source, destination);
        }
    }
}

function shouldIgnoreFile(name) {
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

function getUnstablePackages(packages) {
    return packages
        .filter(packageIsUnstable)
        .reduce((acc, pkg) => {
            acc[pkg.name] = pkg.name.replace(/^@aws-cdk\//, '@aws-cdk-lib-alpha/');
            return acc;
        }, {});
}

function packageIsUnstable(pkg) {
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
