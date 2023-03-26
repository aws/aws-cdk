"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console = require("console");
const path = require("path");
const process = require("process");
const cfn2ts_1 = require("@aws-cdk/cfn2ts");
const pkglint = require("@aws-cdk/pkglint");
const awsCdkMigration = require("aws-cdk-migration");
const fs = require("fs-extra");
// The directory where our 'package.json' lives
const MONOPACKAGE_ROOT = process.cwd();
const ROOT_PATH = findWorkspacePath();
const UBER_PACKAGE_JSON_PATH = path.join(MONOPACKAGE_ROOT, 'package.json');
const EXCLUDED_PACKAGES = ['@aws-cdk/example-construct-library'];
async function main() {
    console.log(`🌴  workspace root path is: ${ROOT_PATH}`);
    const uberPackageJson = await fs.readJson(UBER_PACKAGE_JSON_PATH);
    const libraries = await findLibrariesToPackage(uberPackageJson);
    await verifyDependencies(uberPackageJson, libraries);
    await prepareSourceFiles(libraries, uberPackageJson);
    await combineRosettaFixtures(libraries, uberPackageJson);
    // if explicitExports is set to `false`, remove the "exports" section from package.json
    const explicitExports = uberPackageJson.ubergen?.explicitExports ?? true;
    if (!explicitExports) {
        delete uberPackageJson.exports;
    }
    // Rewrite package.json (exports will have changed)
    await fs.writeJson(UBER_PACKAGE_JSON_PATH, uberPackageJson, { spaces: 2 });
}
main().then(() => process.exit(0), (err) => {
    console.error('❌ An error occurred: ', err.stack);
    process.exit(1);
});
/**
 * Find the workspace root path. Walk up the directory tree until you find lerna.json
 */
function findWorkspacePath() {
    return _findRootPath(process.cwd());
    function _findRootPath(part) {
        if (part === path.resolve(part, '..')) {
            throw new Error('couldn\'t find a \'lerna.json\' file when walking up the directory tree, are you in a aws-cdk project?');
        }
        if (fs.existsSync(path.resolve(part, 'lerna.json'))) {
            return part;
        }
        return _findRootPath(path.resolve(part, '..'));
    }
}
async function findLibrariesToPackage(uberPackageJson) {
    console.log('🔍 Discovering libraries that need packaging...');
    const deprecatedPackages = uberPackageJson.ubergen?.deprecatedPackages;
    const result = new Array();
    const librariesRoot = path.resolve(ROOT_PATH, 'packages', '@aws-cdk');
    for (const dir of await fs.readdir(librariesRoot)) {
        const packageJson = await fs.readJson(path.resolve(librariesRoot, dir, 'package.json'));
        if (packageJson.ubergen?.exclude || EXCLUDED_PACKAGES.includes(packageJson.name)) {
            console.log(`\t⚠️ Skipping (ubergen excluded):   ${packageJson.name}`);
            continue;
        }
        else if (packageJson.jsii == null) {
            console.log(`\t⚠️ Skipping (not jsii-enabled):   ${packageJson.name}`);
            continue;
        }
        else if (deprecatedPackages) {
            if (deprecatedPackages.some(packageName => packageName === packageJson.name)) {
                console.log(`\t⚠️ Skipping (ubergen deprecated): ${packageJson.name}`);
                continue;
            }
        }
        else if (packageJson.deprecated) {
            console.log(`\t⚠️ Skipping (deprecated):         ${packageJson.name}`);
            continue;
        }
        result.push({
            packageJson,
            root: path.join(librariesRoot, dir),
            shortName: packageJson.name.slice('@aws-cdk/'.length),
        });
    }
    console.log(`\tℹ️ Found ${result.length} relevant packages!`);
    return result;
}
async function verifyDependencies(packageJson, libraries) {
    console.log('🧐 Verifying dependencies are complete...');
    let changed = false;
    const toBundle = {};
    for (const library of libraries) {
        for (const depName of library.packageJson.bundleDependencies ?? library.packageJson.bundledDependencies ?? []) {
            const requiredVersion = library.packageJson.devDependencies?.[depName]
                ?? library.packageJson.dependencies?.[depName]
                ?? '*';
            if (toBundle[depName] != null && toBundle[depName] !== requiredVersion) {
                throw new Error(`Required to bundle different versions of ${depName}: ${toBundle[depName]} and ${requiredVersion}.`);
            }
            toBundle[depName] = requiredVersion;
        }
        if (library.packageJson.name in packageJson.devDependencies) {
            const existingVersion = packageJson.devDependencies[library.packageJson.name];
            if (existingVersion !== library.packageJson.version) {
                console.log(`\t⚠️ Incorrect dependency: ${library.packageJson.name} (expected ${library.packageJson.version}, found ${packageJson.devDependencies[library.packageJson.name]})`);
                packageJson.devDependencies[library.packageJson.name] = library.packageJson.version;
                changed = true;
            }
            continue;
        }
        console.log(`\t⚠️ Missing dependency: ${library.packageJson.name}`);
        changed = true;
        packageJson.devDependencies = sortObject({
            ...packageJson.devDependencies ?? {},
            [library.packageJson.name]: library.packageJson.version,
        });
    }
    const workspacePath = path.resolve(ROOT_PATH, 'package.json');
    const workspace = await fs.readJson(workspacePath);
    let workspaceChanged = false;
    const spuriousBundledDeps = new Set(packageJson.bundledDependencies ?? []);
    for (const [name, version] of Object.entries(toBundle)) {
        spuriousBundledDeps.delete(name);
        const nohoist = `${packageJson.name}/${name}`;
        if (!workspace.workspaces.nohoist?.includes(nohoist)) {
            console.log(`\t⚠️ Missing yarn workspace nohoist: ${nohoist}`);
            workspace.workspaces.nohoist = Array.from(new Set([
                ...workspace.workspaces.nohoist ?? [],
                nohoist,
                `${nohoist}/**`,
            ])).sort();
            workspaceChanged = true;
        }
        if (!(packageJson.bundledDependencies?.includes(name))) {
            console.log(`\t⚠️ Missing bundled dependency: ${name} at ${version}`);
            packageJson.bundledDependencies = [
                ...packageJson.bundledDependencies ?? [],
                name,
            ].sort();
            changed = true;
        }
        if (packageJson.dependencies?.[name] !== version) {
            console.log(`\t⚠️ Missing or incorrect dependency: ${name} at ${version}`);
            packageJson.dependencies = sortObject({
                ...packageJson.dependencies ?? {},
                [name]: version,
            });
            changed = true;
        }
    }
    packageJson.bundledDependencies = packageJson.bundledDependencies?.filter((dep) => !spuriousBundledDeps.has(dep));
    for (const toRemove of Array.from(spuriousBundledDeps)) {
        delete packageJson.dependencies[toRemove];
        changed = true;
    }
    if (workspaceChanged) {
        await fs.writeFile(workspacePath, JSON.stringify(workspace, null, 2) + '\n', { encoding: 'utf-8' });
        console.log('\t❌ Updated the yarn workspace configuration. Re-run "yarn install", and commit the changes.');
    }
    if (changed) {
        await fs.writeFile(UBER_PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n', { encoding: 'utf8' });
        throw new Error('Fixed dependency inconsistencies. Commit the updated package.json file.');
    }
    console.log('\t✅ Dependencies are correct!');
}
async function prepareSourceFiles(libraries, packageJson) {
    console.log('📝 Preparing source files...');
    if (packageJson.ubergen?.excludeExperimentalModules) {
        console.log('\t 👩🏻‍🔬 \'excludeExperimentalModules\' enabled. Regenerating all experimental modules as L1s using cfn2ts...');
    }
    const libRoot = resolveLibRoot(packageJson);
    // Should not remove collection directory if we're currently in it. The OS would be unhappy.
    if (libRoot !== process.cwd()) {
        await fs.remove(libRoot);
    }
    // Control 'exports' field of the 'package.json'. This will control what kind of 'import' statements are
    // allowed for this package: we only want to allow the exact import statements that we want to support.
    packageJson.exports = {
        '.': './index.js',
        // We need to expose 'package.json' and '.jsii' because 'jsii' and 'jsii-reflect' load them using
        // require(). (-_-). Can be removed after https://github.com/aws/jsii/pull/3205 gets merged.
        './package.json': './package.json',
        './.jsii': './.jsii',
        // This is necessary to support jsii cross-module warnings
        './.warnings.jsii.js': './.warnings.jsii.js',
    };
    const indexStatements = new Array();
    for (const library of libraries) {
        const libDir = path.join(libRoot, library.shortName);
        const copied = await transformPackage(library, packageJson, libDir, libraries);
        if (!copied) {
            continue;
        }
        if (library.shortName === 'core') {
            indexStatements.push(`export * from './${library.shortName}';`);
        }
        else {
            indexStatements.push(`export * as ${library.shortName.replace(/-/g, '_')} from './${library.shortName}';`);
        }
        copySubmoduleExports(packageJson.exports, library, library.shortName);
    }
    await fs.writeFile(path.join(libRoot, 'index.ts'), indexStatements.join('\n'), { encoding: 'utf8' });
    console.log('\t🍺 Success!');
}
/**
 * Copy the sublibrary's exports into the 'exports' of the main library.
 *
 * Replace the original 'main' export with an export of the new '<submodule>/index.ts` file we've written
 * in 'transformPackage'.
 */
function copySubmoduleExports(targetExports, library, subdirectory) {
    const visibleName = library.shortName;
    // Do both REAL "exports" section, as well as virtual, ubergen-only "exports" section
    for (const exportSet of [library.packageJson.exports, library.packageJson.ubergen?.exports]) {
        for (const [relPath, relSource] of Object.entries(exportSet ?? {})) {
            targetExports[`./${unixPath(path.join(visibleName, relPath))}`] = `./${unixPath(path.join(subdirectory, relSource))}`;
        }
    }
    if (visibleName !== 'core') {
        // If there was an export for '.' in the original submodule, this assignment will overwrite it,
        // which is exactly what we want.
        targetExports[`./${unixPath(visibleName)}`] = `./${unixPath(subdirectory)}/index.js`;
    }
}
async function combineRosettaFixtures(libraries, uberPackageJson) {
    console.log('📝 Combining Rosetta fixtures...');
    const uberRosettaDir = path.resolve(MONOPACKAGE_ROOT, 'rosetta');
    await fs.remove(uberRosettaDir);
    await fs.mkdir(uberRosettaDir);
    for (const library of libraries) {
        const packageRosettaDir = path.join(library.root, 'rosetta');
        const uberRosettaTargetDir = library.shortName === 'core' ? uberRosettaDir : path.join(uberRosettaDir, library.shortName.replace(/-/g, '_'));
        if (await fs.pathExists(packageRosettaDir)) {
            if (!fs.existsSync(uberRosettaTargetDir)) {
                await fs.mkdir(uberRosettaTargetDir);
            }
            const files = await fs.readdir(packageRosettaDir);
            for (const file of files) {
                await fs.writeFile(path.join(uberRosettaTargetDir, file), await rewriteRosettaFixtureImports(path.join(packageRosettaDir, file), uberPackageJson.name), { encoding: 'utf8' });
            }
        }
    }
    console.log('\t🍺 Success!');
}
async function transformPackage(library, uberPackageJson, destination, allLibraries) {
    await fs.mkdirp(destination);
    if (uberPackageJson.ubergen?.excludeExperimentalModules && library.packageJson.stability === 'experimental') {
        // when stripExperimental is enabled, we only want to add the L1s of experimental modules.
        let cfnScopes = library.packageJson['cdk-build']?.cloudformation;
        if (cfnScopes === undefined) {
            return false;
        }
        cfnScopes = Array.isArray(cfnScopes) ? cfnScopes : [cfnScopes];
        const destinationLib = path.join(destination, 'lib');
        await fs.mkdirp(destinationLib);
        await cfn2ts_1.default(cfnScopes, destinationLib);
        // We know what this is going to be, so predict it
        const alphaPackageName = hasL2s(library) ? `${library.packageJson.name}-alpha` : undefined;
        // create a lib/index.ts which only exports the generated files
        fs.writeFileSync(path.join(destinationLib, 'index.ts'), 
        /// logic copied from `create-missing-libraries.ts`
        cfnScopes.map(s => (s === 'AWS::Serverless' ? 'AWS::SAM' : s).split('::')[1].toLocaleLowerCase())
            .map(s => `export * from './${s}.generated';`)
            .join('\n'));
        await pkglint.createLibraryReadme(cfnScopes[0], path.join(destination, 'README.md'), alphaPackageName);
        await copyOrTransformFiles(destination, destination, allLibraries, uberPackageJson);
    }
    else {
        await copyOrTransformFiles(library.root, destination, allLibraries, uberPackageJson);
        await copyLiterateSources(path.join(library.root, 'test'), path.join(destination, 'test'), allLibraries, uberPackageJson);
    }
    await fs.writeFile(path.join(destination, 'index.ts'), `export * from './${library.packageJson.types.replace(/(\/index)?(\.d)?\.ts$/, '')}';\n`, { encoding: 'utf8' });
    if (library.shortName !== 'core') {
        const config = uberPackageJson.jsii.targets;
        await fs.writeJson(path.join(destination, '.jsiirc.json'), {
            targets: transformTargets(config, library.packageJson.jsii.targets),
        }, { spaces: 2 });
    }
    // if libRoot is _not_ under the root of the package, generate a file at the
    // root that will refer to the one under lib/ so that users can still import
    // from "aws-cdk-lib/aws-lambda".
    const relativeLibRoot = uberPackageJson.ubergen?.libRoot;
    if (relativeLibRoot && relativeLibRoot !== '.') {
        await fs.writeFile(path.resolve(MONOPACKAGE_ROOT, `${library.shortName}.ts`), `export * from './${relativeLibRoot}/${library.shortName}';\n`, { encoding: 'utf8' });
    }
    return true;
}
/**
 * Return whether a package has L2s
 *
 * We determine this on the cheap: the answer is yes if the package has
 * any .ts files in the `lib` directory other than `index.ts` and `*.generated.ts`.
 */
function hasL2s(library) {
    try {
        const sourceFiles = fs.readdirSync(path.join(library.root, 'lib')).filter(n => n.endsWith('.ts') && !n.endsWith('.d.ts'));
        return sourceFiles.some(n => n !== 'index.ts' && !n.includes('.generated.'));
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        }
        throw e;
    }
}
function transformTargets(monoConfig, targets) {
    if (targets == null) {
        return targets;
    }
    const result = {};
    for (const [language, config] of Object.entries(targets)) {
        switch (language) {
            case 'dotnet':
                if (monoConfig?.dotnet != null) {
                    result[language] = {
                        namespace: config.namespace,
                    };
                }
                break;
            case 'java':
                if (monoConfig?.java != null) {
                    result[language] = {
                        package: config.package,
                    };
                }
                break;
            case 'python':
                if (monoConfig?.python != null) {
                    result[language] = {
                        module: `${monoConfig.python.module}.${config.module.replace(/^aws_cdk\./, '')}`,
                    };
                }
                break;
            default:
                throw new Error(`Unsupported language for submodule configuration translation: ${language}`);
        }
    }
    return result;
}
async function copyOrTransformFiles(from, to, libraries, uberPackageJson) {
    const libRoot = resolveLibRoot(uberPackageJson);
    const promises = (await fs.readdir(from)).map(async (name) => {
        if (shouldIgnoreFile(name)) {
            return;
        }
        if (name.endsWith('.d.ts') || name.endsWith('.js')) {
            if (await fs.pathExists(path.join(from, name.replace(/\.(d\.ts|js)$/, '.ts')))) {
                // We won't copy .d.ts and .js files with a corresponding .ts file
                return;
            }
        }
        const source = path.join(from, name);
        const destination = path.join(to, name);
        const stat = await fs.stat(source);
        if (stat.isDirectory()) {
            await fs.mkdirp(destination);
            return copyOrTransformFiles(source, destination, libraries, uberPackageJson);
        }
        if (name.endsWith('.ts')) {
            return fs.writeFile(destination, await rewriteLibraryImports(source, to, libRoot, libraries), { encoding: 'utf8' });
        }
        else if (name === 'cfn-types-2-classes.json') {
            // This is a special file used by the cloudformation-include module that contains mappings
            // of CFN resource types to the fully-qualified class names of the CDK L1 classes.
            // We need to rewrite it to refer to the uberpackage instead of the individual packages
            const cfnTypes2Classes = await fs.readJson(source);
            for (const cfnType of Object.keys(cfnTypes2Classes)) {
                const fqn = cfnTypes2Classes[cfnType];
                // replace @aws-cdk/aws-<service> with <uber-package-name>/aws-<service>,
                // except for @aws-cdk/core, which maps just to the name of the uberpackage
                cfnTypes2Classes[cfnType] = fqn.startsWith('@aws-cdk/core.')
                    ? fqn.replace('@aws-cdk/core', uberPackageJson.name)
                    : fqn.replace('@aws-cdk', uberPackageJson.name);
            }
            await fs.writeJson(destination, cfnTypes2Classes, { spaces: 2 });
        }
        else if (name === 'README.md') {
            // Rewrite the README to both adjust imports and remove the redundant stability banner.
            // (All modules included in ubergen-ed packages must be stable, so the banner is unnecessary.)
            const newReadme = (await rewriteReadmeImports(source, uberPackageJson.name))
                .replace(/<!--BEGIN STABILITY BANNER-->[\s\S]+<!--END STABILITY BANNER-->/gm, '');
            return fs.writeFile(destination, newReadme, { encoding: 'utf8' });
        }
        else {
            return fs.copyFile(source, destination);
        }
    });
    await Promise.all(promises);
}
async function copyLiterateSources(from, to, libraries, uberPackageJson) {
    const libRoot = resolveLibRoot(uberPackageJson);
    await Promise.all((await fs.readdir(from)).flatMap(async (name) => {
        const source = path.join(from, name);
        const stat = await fs.stat(source);
        if (stat.isDirectory()) {
            await copyLiterateSources(source, path.join(to, name), libraries, uberPackageJson);
            return;
        }
        if (!name.endsWith('.lit.ts')) {
            return [];
        }
        await fs.mkdirp(to);
        return fs.writeFile(path.join(to, name), await rewriteLibraryImports(path.join(from, name), to, libRoot, libraries), { encoding: 'utf8' });
    }));
}
/**
 * Rewrites the imports in README.md from v1 ('@aws-cdk') to v2 ('aws-cdk-lib').
 */
async function rewriteReadmeImports(fromFile, libName) {
    const sourceCode = await fs.readFile(fromFile, { encoding: 'utf8' });
    return awsCdkMigration.rewriteReadmeImports(sourceCode, libName);
}
/**
 * Rewrites imports in libaries, using the relative path (i.e. '../../assertions').
 */
async function rewriteLibraryImports(fromFile, targetDir, libRoot, libraries) {
    const source = await fs.readFile(fromFile, { encoding: 'utf8' });
    return awsCdkMigration.rewriteImports(source, relativeImport);
    function relativeImport(modulePath) {
        const sourceLibrary = libraries.find(lib => modulePath === lib.packageJson.name ||
            modulePath.startsWith(`${lib.packageJson.name}/`));
        if (sourceLibrary == null) {
            return undefined;
        }
        const importedFile = modulePath === sourceLibrary.packageJson.name
            ? path.join(libRoot, sourceLibrary.shortName)
            : path.join(libRoot, sourceLibrary.shortName, modulePath.slice(sourceLibrary.packageJson.name.length + 1));
        return path.relative(targetDir, importedFile);
    }
}
/**
 * Rewrites imports in rosetta fixtures, using the external path (i.e. 'aws-cdk-lib/assertions').
 */
async function rewriteRosettaFixtureImports(fromFile, libName) {
    const source = await fs.readFile(fromFile, { encoding: 'utf8' });
    return awsCdkMigration.rewriteMonoPackageImports(source, libName);
}
const IGNORED_FILE_NAMES = new Set([
    '.eslintrc.js',
    '.gitignore',
    '.jest.config.js',
    '.jsii',
    '.npmignore',
    'node_modules',
    'package.json',
    'test',
    'tsconfig.json',
    'tsconfig.tsbuildinfo',
    'LICENSE',
    'NOTICE',
]);
function shouldIgnoreFile(name) {
    return IGNORED_FILE_NAMES.has(name);
}
function sortObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj).sort((l, r) => l[0].localeCompare(r[0]))) {
        result[key] = value;
    }
    return result;
}
/**
 * Turn potential backslashes into forward slashes
 */
function unixPath(x) {
    return x.replace(/\\/g, '/');
}
/**
 * Resolves the directory where we're going to collect all the libraries.
 *
 * By default, this is purposely the same as the monopackage root so that our
 * two import styles resolve to the same files but it can be overridden by
 * seeting `ubergen.libRoot` in the package.json of the uber package.
 *
 * @param uberPackageJson package.json contents of the uber package
 * @returns The directory where we should collect all the libraries.
 */
function resolveLibRoot(uberPackageJson) {
    return path.resolve(uberPackageJson.ubergen?.libRoot ?? MONOPACKAGE_ROOT);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWJlcmdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInViZXJnZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQyw0Q0FBcUM7QUFDckMsNENBQTRDO0FBQzVDLHFEQUFxRDtBQUNyRCwrQkFBK0I7QUFHL0IsK0NBQStDO0FBQy9DLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRXZDLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixFQUFFLENBQUM7QUFDdEMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRTNFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBRWpFLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDeEQsTUFBTSxlQUFlLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFnQixDQUFDO0lBQ2pGLE1BQU0sU0FBUyxHQUFHLE1BQU0sc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDaEUsTUFBTSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckQsTUFBTSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDckQsTUFBTSxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFekQsdUZBQXVGO0lBQ3ZGLE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxJQUFJLElBQUksQ0FBQztJQUN6RSxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3BCLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQztLQUNoQztJQUVELG1EQUFtRDtJQUNuRCxNQUFNLEVB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QUFDLGVBQTRCO0lBQ2xELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb25zb2xlIGZyb20gJ2NvbnNvbGUnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHByb2Nlc3MgZnJvbSAncHJvY2Vzcyc7XG5pbXBvcnQgY2ZuMnRzIGZyb20gJ0Bhd3MtY2RrL2NmbjJ0cyc7XG5pbXBvcnQgKiBhcyBwa2dsaW50IGZyb20gJ0Bhd3MtY2RrL3BrZ2xpbnQnO1xuaW1wb3J0ICogYXMgYXdzQ2RrTWlncmF0aW9uIGZyb20gJ2F3cy1jZGstbWlncmF0aW9uJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuXG4vLyBUaGUgZGlyZWN0b3J5IHdoZXJlIG91ciAncGFja2FnZS5qc29uJyBsaXZlc1xuY29uc3QgTU9OT1BBQ0tBR0VfUk9PVCA9IHByb2Nlc3MuY3dkKCk7XG5cbmNvbnN0IFJPT1RfUEFUSCA9IGZpbmRXb3Jrc3BhY2VQYXRoKCk7XG5jb25zdCBVQkVSX1BBQ0tBR0VfSlNPTl9QQVRIID0gcGF0aC5qb2luKE1PTk9QQUNLQUdFX1JPT1QsICdwYWNrYWdlLmpzb24nKTtcblxuY29uc3QgRVhDTFVERURfUEFDS0FHRVMgPSBbJ0Bhd3MtY2RrL2V4YW1wbGUtY29uc3RydWN0LWxpYnJhcnknXTtcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc29sZS5sb2coYPCfjLQgIHdvcmtzcGFjZSByb290IHBhdGggaXM6ICR7Uk9PVF9QQVRIfWApO1xuICBjb25zdCB1YmVyUGFja2FnZUpzb24gPSBhd2FpdCBmcy5yZWFkSnNvbihVQkVSX1BBQ0tBR0VfSlNPTl9QQVRIKSBhcyBQYWNrYWdlSnNvbjtcbiAgY29uc3QgbGlicmFyaWVzID0gYXdhaXQgZmluZExpYnJhcmllc1RvUGFja2FnZSh1YmVyUGFja2FnZUpzb24pO1xuICBhd2FpdCB2ZXJpZnlEZXBlbmRlbmNpZXModWJlclBhY2thZ2VKc29uLCBsaWJyYXJpZXMpO1xuICBhd2FpdCBwcmVwYXJlU291cmNlRmlsZXMobGlicmFyaWVzLCB1YmVyUGFja2FnZUpzb24pO1xuICBhd2FpdCBjb21iaW5lUm9zZXR0YUZpeHR1cmVzKGxpYnJhcmllcywgdWJlclBhY2thZ2VKc29uKTtcblxuICAvLyBpZiBleHBsaWNpdEV4cG9ydHMgaXMgc2V0IHRvIGBmYWxzZWAsIHJlbW92ZSB0aGUgXCJleHBvcnRzXCIgc2VjdGlvbiBmcm9tIHBhY2thZ2UuanNvblxuICBjb25zdCBleHBsaWNpdEV4cG9ydHMgPSB1YmVyUGFja2FnZUpzb24udWJlcmdlbj8uZXhwbGljaXRFeHBvcnRzID8/IHRydWU7XG4gIGlmICghZXhwbGljaXRFeHBvcnRzKSB7XG4gICAgZGVsZXRlIHViZXJQYWNrYWdlSnNvbi5leHBvcnRzO1xuICB9XG5cbiAgLy8gUmV3cml0ZSBwYWNrYWdlLmpzb24gKGV4cG9ydHMgd2lsbCBoYXZlIGNoYW5nZWQpXG4gIGF3YWl0IGZzLndyaXRlSnNvbihVQkVSX1BBQ0tBR0VfSlNPTl9QQVRILCB1YmVyUGFja2FnZUpzb24sIHsgc3BhY2VzOiAyIH0pO1xufVxuXG5tYWluKCkudGhlbihcbiAgKCkgPT4gcHJvY2Vzcy5leGl0KDApLFxuICAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcign4p2MIEFuIGVycm9yIG9jY3VycmVkOiAnLCBlcnIuc3RhY2spO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfSxcbik7XG5cbmludGVyZmFjZSBMaWJyYXJ5UmVmZXJlbmNlIHtcbiAgcmVhZG9ubHkgcGFja2FnZUpzb246IFBhY2thZ2VKc29uO1xuICByZWFkb25seSByb290OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNob3J0TmFtZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUGFja2FnZUpzb24ge1xuICByZWFkb25seSBtYWluPzogc3RyaW5nO1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcmVhZG9ubHkgYnVuZGxlRGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgc3RyaW5nW107XG4gIHJlYWRvbmx5IGJ1bmRsZWREZXBlbmRlbmNpZXM/OiByZWFkb25seSBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgZGVwZW5kZW5jaWVzPzogeyByZWFkb25seSBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG4gIHJlYWRvbmx5IGRldkRlcGVuZGVuY2llcz86IHsgcmVhZG9ubHkgW25hbWU6IHN0cmluZ106IHN0cmluZyB9O1xuICByZWFkb25seSBqc2lpOiB7XG4gICAgcmVhZG9ubHkgdGFyZ2V0cz86IHtcbiAgICAgIHJlYWRvbmx5IGRvdG5ldD86IHtcbiAgICAgICAgcmVhZG9ubHkgbmFtZXNwYWNlOiBzdHJpbmc7XG4gICAgICAgIHJlYWRvbmx5IFtrZXk6IHN0cmluZ106IHVua25vd247XG4gICAgICB9LFxuICAgICAgcmVhZG9ubHkgamF2YT86IHtcbiAgICAgICAgcmVhZG9ubHkgcGFja2FnZTogc3RyaW5nO1xuICAgICAgICByZWFkb25seSBba2V5OiBzdHJpbmddOiB1bmtub3duO1xuICAgICAgfSxcbiAgICAgIHJlYWRvbmx5IHB5dGhvbj86IHtcbiAgICAgICAgcmVhZG9ubHkgbW9kdWxlOiBzdHJpbmc7XG4gICAgICAgIHJlYWRvbmx5IFtrZXk6IHN0cmluZ106IHVua25vd247XG4gICAgICB9LFxuICAgICAgcmVhZG9ubHkgW2xhbmd1YWdlOiBzdHJpbmddOiB1bmtub3duLFxuICAgIH0sXG4gIH07XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgdHlwZXM6IHN0cmluZztcbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuICByZWFkb25seSBzdGFiaWxpdHk6IHN0cmluZztcbiAgcmVhZG9ubHkgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgcmVhZG9ubHkgJ2Nkay1idWlsZCc/OiB7XG4gICAgcmVhZG9ubHkgY2xvdWRmb3JtYXRpb246IHN0cmluZ1tdIHwgc3RyaW5nO1xuICB9O1xuICByZWFkb25seSB1YmVyZ2VuPzoge1xuICAgIHJlYWRvbmx5IGRlcHJlY2F0ZWRQYWNrYWdlcz86IHJlYWRvbmx5IHN0cmluZ1tdO1xuICAgIHJlYWRvbmx5IGV4Y2x1ZGVFeHBlcmltZW50YWxNb2R1bGVzPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkaXJlY3Rvcnkgd2hlcmUgd2UncmUgZ29pbmcgdG8gY29sbGVjdCBhbGwgdGhlIGxpYnJhcmllcy5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0IC0gcm9vdCBvZiB0aGUgdWJlcmdlbiBwYWNrYWdlXG4gICAgICovXG4gICAgcmVhZG9ubHkgbGliUm9vdD86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYW4gYGV4cG9ydHNgIHNlY3Rpb24gdG8gdGhlIHViZXJnZW4gcGFja2FnZS5qc29uIGZpbGUgdG8gZW5zdXJlIHRoYXRcbiAgICAgKiBjb25zdW1lcnMgd29uJ3QgYmUgYWJsZSB0byBhY2NpZGVudGFsbHkgaW1wb3J0IGEgcHJpdmF0ZSBmaWxlLlxuICAgICAqXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGV4cGxpY2l0RXhwb3J0cz86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBbiBleHBvcnRzIHNlY3Rpb24gdGhhdCBzaG91bGQgYmUgaWdub3JlZCBmb3IgdjEgYnV0IGluY2x1ZGVkIGZvciB1YmVyZ2VuXG4gICAgICovXG4gICAgcmVhZG9ubHkgZXhwb3J0cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIH07XG4gIGV4cG9ydHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIHdvcmtzcGFjZSByb290IHBhdGguIFdhbGsgdXAgdGhlIGRpcmVjdG9yeSB0cmVlIHVudGlsIHlvdSBmaW5kIGxlcm5hLmpzb25cbiAqL1xuZnVuY3Rpb24gZmluZFdvcmtzcGFjZVBhdGgoKTogc3RyaW5nIHtcblxuICByZXR1cm4gX2ZpbmRSb290UGF0aChwcm9jZXNzLmN3ZCgpKTtcblxuICBmdW5jdGlvbiBfZmluZFJvb3RQYXRoKHBhcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHBhcnQgPT09IHBhdGgucmVzb2x2ZShwYXJ0LCAnLi4nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG5cXCd0IGZpbmQgYSBcXCdsZXJuYS5qc29uXFwnIGZpbGUgd2hlbiB3YWxraW5nIHVwIHRoZSBkaXJlY3RvcnkgdHJlZSwgYXJlIHlvdSBpbiBhIGF3cy1jZGsgcHJvamVjdD8nKTtcbiAgICB9XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLnJlc29sdmUocGFydCwgJ2xlcm5hLmpzb24nKSkpIHtcbiAgICAgIHJldHVybiBwYXJ0O1xuICAgIH1cblxuICAgIHJldHVybiBfZmluZFJvb3RQYXRoKHBhdGgucmVzb2x2ZShwYXJ0LCAnLi4nKSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZmluZExpYnJhcmllc1RvUGFja2FnZSh1YmVyUGFja2FnZUpzb246IFBhY2thZ2VKc29uKTogUHJvbWlzZTxyZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10+IHtcbiAgY29uc29sZS5sb2coJ/CflI0gRGlzY292ZXJpbmcgbGlicmFyaWVzIHRoYXQgbmVlZCBwYWNrYWdpbmcuLi4nKTtcblxuICBjb25zdCBkZXByZWNhdGVkUGFja2FnZXMgPSB1YmVyUGFja2FnZUpzb24udWJlcmdlbj8uZGVwcmVjYXRlZFBhY2thZ2VzO1xuICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8TGlicmFyeVJlZmVyZW5jZT4oKTtcbiAgY29uc3QgbGlicmFyaWVzUm9vdCA9IHBhdGgucmVzb2x2ZShST09UX1BBVEgsICdwYWNrYWdlcycsICdAYXdzLWNkaycpO1xuXG4gIGZvciAoY29uc3QgZGlyIG9mIGF3YWl0IGZzLnJlYWRkaXIobGlicmFyaWVzUm9vdCkpIHtcbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IGF3YWl0IGZzLnJlYWRKc29uKHBhdGgucmVzb2x2ZShsaWJyYXJpZXNSb290LCBkaXIsICdwYWNrYWdlLmpzb24nKSk7XG5cbiAgICBpZiAocGFja2FnZUpzb24udWJlcmdlbj8uZXhjbHVkZSB8fCBFWENMVURFRF9QQUNLQUdFUy5pbmNsdWRlcyhwYWNrYWdlSnNvbi5uYW1lKSkge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBTa2lwcGluZyAodWJlcmdlbiBleGNsdWRlZCk6ICAgJHtwYWNrYWdlSnNvbi5uYW1lfWApO1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmIChwYWNrYWdlSnNvbi5qc2lpID09IG51bGwgKSB7XG4gICAgICBjb25zb2xlLmxvZyhgXFx04pqg77iPIFNraXBwaW5nIChub3QganNpaS1lbmFibGVkKTogICAke3BhY2thZ2VKc29uLm5hbWV9YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2UgaWYgKGRlcHJlY2F0ZWRQYWNrYWdlcykge1xuICAgICAgaWYgKGRlcHJlY2F0ZWRQYWNrYWdlcy5zb21lKHBhY2thZ2VOYW1lID0+IHBhY2thZ2VOYW1lID09PSBwYWNrYWdlSnNvbi5uYW1lKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgXFx04pqg77iPIFNraXBwaW5nICh1YmVyZ2VuIGRlcHJlY2F0ZWQpOiAke3BhY2thZ2VKc29uLm5hbWV9YCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGFja2FnZUpzb24uZGVwcmVjYXRlZCkge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBTa2lwcGluZyAoZGVwcmVjYXRlZCk6ICAgICAgICAgJHtwYWNrYWdlSnNvbi5uYW1lfWApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHBhY2thZ2VKc29uLFxuICAgICAgcm9vdDogcGF0aC5qb2luKGxpYnJhcmllc1Jvb3QsIGRpciksXG4gICAgICBzaG9ydE5hbWU6IHBhY2thZ2VKc29uLm5hbWUuc2xpY2UoJ0Bhd3MtY2RrLycubGVuZ3RoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGBcXHTihLnvuI8gRm91bmQgJHtyZXN1bHQubGVuZ3RofSByZWxldmFudCBwYWNrYWdlcyFgKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlEZXBlbmRlbmNpZXMocGFja2FnZUpzb246IGFueSwgbGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc29sZS5sb2coJ/Cfp5AgVmVyaWZ5aW5nIGRlcGVuZGVuY2llcyBhcmUgY29tcGxldGUuLi4nKTtcblxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBjb25zdCB0b0J1bmRsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIGZvciAoY29uc3QgbGlicmFyeSBvZiBsaWJyYXJpZXMpIHtcbiAgICBmb3IgKGNvbnN0IGRlcE5hbWUgb2YgbGlicmFyeS5wYWNrYWdlSnNvbi5idW5kbGVEZXBlbmRlbmNpZXMgPz8gbGlicmFyeS5wYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzID8/IFtdKSB7XG4gICAgICBjb25zdCByZXF1aXJlZFZlcnNpb24gPSBsaWJyYXJ5LnBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcz8uW2RlcE5hbWVdXG4gICAgICAgID8/IGxpYnJhcnkucGFja2FnZUpzb24uZGVwZW5kZW5jaWVzPy5bZGVwTmFtZV1cbiAgICAgICAgPz8gJyonO1xuICAgICAgaWYgKHRvQnVuZGxlW2RlcE5hbWVdICE9IG51bGwgJiYgdG9CdW5kbGVbZGVwTmFtZV0gIT09IHJlcXVpcmVkVmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcXVpcmVkIHRvIGJ1bmRsZSBkaWZmZXJlbnQgdmVyc2lvbnMgb2YgJHtkZXBOYW1lfTogJHt0b0J1bmRsZVtkZXBOYW1lXX0gYW5kICR7cmVxdWlyZWRWZXJzaW9ufS5gKTtcbiAgICAgIH1cbiAgICAgIHRvQnVuZGxlW2RlcE5hbWVdID0gcmVxdWlyZWRWZXJzaW9uO1xuICAgIH1cblxuICAgIGlmIChsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWUgaW4gcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzKSB7XG4gICAgICBjb25zdCBleGlzdGluZ1ZlcnNpb24gPSBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbbGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lXTtcbiAgICAgIGlmIChleGlzdGluZ1ZlcnNpb24gIT09IGxpYnJhcnkucGFja2FnZUpzb24udmVyc2lvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhgXFx04pqg77iPIEluY29ycmVjdCBkZXBlbmRlbmN5OiAke2xpYnJhcnkucGFja2FnZUpzb24ubmFtZX0gKGV4cGVjdGVkICR7bGlicmFyeS5wYWNrYWdlSnNvbi52ZXJzaW9ufSwgZm91bmQgJHtwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXNbbGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lXX0pYCk7XG4gICAgICAgIHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llc1tsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVdID0gbGlicmFyeS5wYWNrYWdlSnNvbi52ZXJzaW9uO1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgXFx04pqg77iPIE1pc3NpbmcgZGVwZW5kZW5jeTogJHtsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWV9YCk7XG4gICAgY2hhbmdlZCA9IHRydWU7XG4gICAgcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzID0gc29ydE9iamVjdCh7XG4gICAgICAuLi5wYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMgPz8ge30sXG4gICAgICBbbGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lXTogbGlicmFyeS5wYWNrYWdlSnNvbi52ZXJzaW9uLFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IHdvcmtzcGFjZVBhdGggPSBwYXRoLnJlc29sdmUoUk9PVF9QQVRILCAncGFja2FnZS5qc29uJyk7XG4gIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGZzLnJlYWRKc29uKHdvcmtzcGFjZVBhdGgpO1xuICBsZXQgd29ya3NwYWNlQ2hhbmdlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHNwdXJpb3VzQnVuZGxlZERlcHMgPSBuZXcgU2V0PHN0cmluZz4ocGFja2FnZUpzb24uYnVuZGxlZERlcGVuZGVuY2llcyA/PyBbXSk7XG4gIGZvciAoY29uc3QgW25hbWUsIHZlcnNpb25dIG9mIE9iamVjdC5lbnRyaWVzKHRvQnVuZGxlKSkge1xuICAgIHNwdXJpb3VzQnVuZGxlZERlcHMuZGVsZXRlKG5hbWUpO1xuXG4gICAgY29uc3Qgbm9ob2lzdCA9IGAke3BhY2thZ2VKc29uLm5hbWV9LyR7bmFtZX1gO1xuICAgIGlmICghd29ya3NwYWNlLndvcmtzcGFjZXMubm9ob2lzdD8uaW5jbHVkZXMobm9ob2lzdCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gTWlzc2luZyB5YXJuIHdvcmtzcGFjZSBub2hvaXN0OiAke25vaG9pc3R9YCk7XG4gICAgICB3b3Jrc3BhY2Uud29ya3NwYWNlcy5ub2hvaXN0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFtcbiAgICAgICAgLi4ud29ya3NwYWNlLndvcmtzcGFjZXMubm9ob2lzdCA/PyBbXSxcbiAgICAgICAgbm9ob2lzdCxcbiAgICAgICAgYCR7bm9ob2lzdH0vKipgLFxuICAgICAgXSkpLnNvcnQoKTtcbiAgICAgIHdvcmtzcGFjZUNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghKHBhY2thZ2VKc29uLmJ1bmRsZWREZXBlbmRlbmNpZXM/LmluY2x1ZGVzKG5hbWUpKSkge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBNaXNzaW5nIGJ1bmRsZWQgZGVwZW5kZW5jeTogJHtuYW1lfSBhdCAke3ZlcnNpb259YCk7XG4gICAgICBwYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAuLi5wYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzID8/IFtdLFxuICAgICAgICBuYW1lLFxuICAgICAgXS5zb3J0KCk7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzPy5bbmFtZV0gIT09IHZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gTWlzc2luZyBvciBpbmNvcnJlY3QgZGVwZW5kZW5jeTogJHtuYW1lfSBhdCAke3ZlcnNpb259YCk7XG4gICAgICBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgPSBzb3J0T2JqZWN0KHtcbiAgICAgICAgLi4ucGFja2FnZUpzb24uZGVwZW5kZW5jaWVzID8/IHt9LFxuICAgICAgICBbbmFtZV06IHZlcnNpb24sXG4gICAgICB9KTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBwYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzID0gcGFja2FnZUpzb24uYnVuZGxlZERlcGVuZGVuY2llcz8uZmlsdGVyKChkZXA6IHN0cmluZykgPT4gIXNwdXJpb3VzQnVuZGxlZERlcHMuaGFzKGRlcCkpO1xuICBmb3IgKGNvbnN0IHRvUmVtb3ZlIG9mIEFycmF5LmZyb20oc3B1cmlvdXNCdW5kbGVkRGVwcykpIHtcbiAgICBkZWxldGUgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW3RvUmVtb3ZlXTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICh3b3Jrc3BhY2VDaGFuZ2VkKSB7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKHdvcmtzcGFjZVBhdGgsIEpTT04uc3RyaW5naWZ5KHdvcmtzcGFjZSwgbnVsbCwgMikgKyAnXFxuJywgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICBjb25zb2xlLmxvZygnXFx04p2MIFVwZGF0ZWQgdGhlIHlhcm4gd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24uIFJlLXJ1biBcInlhcm4gaW5zdGFsbFwiLCBhbmQgY29tbWl0IHRoZSBjaGFuZ2VzLicpO1xuICB9XG5cbiAgaWYgKGNoYW5nZWQpIHtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoVUJFUl9QQUNLQUdFX0pTT05fUEFUSCwgSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24sIG51bGwsIDIpICsgJ1xcbicsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcblxuICAgIHRocm93IG5ldyBFcnJvcignRml4ZWQgZGVwZW5kZW5jeSBpbmNvbnNpc3RlbmNpZXMuIENvbW1pdCB0aGUgdXBkYXRlZCBwYWNrYWdlLmpzb24gZmlsZS4nKTtcbiAgfVxuICBjb25zb2xlLmxvZygnXFx04pyFIERlcGVuZGVuY2llcyBhcmUgY29ycmVjdCEnKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJlcGFyZVNvdXJjZUZpbGVzKGxpYnJhcmllczogcmVhZG9ubHkgTGlicmFyeVJlZmVyZW5jZVtdLCBwYWNrYWdlSnNvbjogUGFja2FnZUpzb24pIHtcbiAgY29uc29sZS5sb2coJ/Cfk50gUHJlcGFyaW5nIHNvdXJjZSBmaWxlcy4uLicpO1xuXG4gIGlmIChwYWNrYWdlSnNvbi51YmVyZ2VuPy5leGNsdWRlRXhwZXJpbWVudGFsTW9kdWxlcykge1xuICAgIGNvbnNvbGUubG9nKCdcXHQg8J+RqfCfj7vigI3wn5SsIFxcJ2V4Y2x1ZGVFeHBlcmltZW50YWxNb2R1bGVzXFwnIGVuYWJsZWQuIFJlZ2VuZXJhdGluZyBhbGwgZXhwZXJpbWVudGFsIG1vZHVsZXMgYXMgTDFzIHVzaW5nIGNmbjJ0cy4uLicpO1xuICB9XG5cbiAgY29uc3QgbGliUm9vdCA9IHJlc29sdmVMaWJSb290KHBhY2thZ2VKc29uKTtcblxuICAvLyBTaG91bGQgbm90IHJlbW92ZSBjb2xsZWN0aW9uIGRpcmVjdG9yeSBpZiB3ZSdyZSBjdXJyZW50bHkgaW4gaXQuIFRoZSBPUyB3b3VsZCBiZSB1bmhhcHB5LlxuICBpZiAobGliUm9vdCAhPT0gcHJvY2Vzcy5jd2QoKSkge1xuICAgIGF3YWl0IGZzLnJlbW92ZShsaWJSb290KTtcbiAgfVxuXG4gIC8vIENvbnRyb2wgJ2V4cG9ydHMnIGZpZWxkIG9mIHRoZSAncGFja2FnZS5qc29uJy4gVGhpcyB3aWxsIGNvbnRyb2wgd2hhdCBraW5kIG9mICdpbXBvcnQnIHN0YXRlbWVudHMgYXJlXG4gIC8vIGFsbG93ZWQgZm9yIHRoaXMgcGFja2FnZTogd2Ugb25seSB3YW50IHRvIGFsbG93IHRoZSBleGFjdCBpbXBvcnQgc3RhdGVtZW50cyB0aGF0IHdlIHdhbnQgdG8gc3VwcG9ydC5cbiAgcGFja2FnZUpzb24uZXhwb3J0cyA9IHtcbiAgICAnLic6ICcuL2luZGV4LmpzJyxcblxuICAgIC8vIFdlIG5lZWQgdG8gZXhwb3NlICdwYWNrYWdlLmpzb24nIGFuZCAnLmpzaWknIGJlY2F1c2UgJ2pzaWknIGFuZCAnanNpaS1yZWZsZWN0JyBsb2FkIHRoZW0gdXNpbmdcbiAgICAvLyByZXF1aXJlKCkuICgtXy0pLiBDYW4gYmUgcmVtb3ZlZCBhZnRlciBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvcHVsbC8zMjA1IGdldHMgbWVyZ2VkLlxuICAgICcuL3BhY2thZ2UuanNvbic6ICcuL3BhY2thZ2UuanNvbicsXG4gICAgJy4vLmpzaWknOiAnLi8uanNpaScsXG5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byBzdXBwb3J0IGpzaWkgY3Jvc3MtbW9kdWxlIHdhcm5pbmdzXG4gICAgJy4vLndhcm5pbmdzLmpzaWkuanMnOiAnLi8ud2FybmluZ3MuanNpaS5qcycsXG4gIH07XG5cbiAgY29uc3QgaW5kZXhTdGF0ZW1lbnRzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBsaWJyYXJ5IG9mIGxpYnJhcmllcykge1xuICAgIGNvbnN0IGxpYkRpciA9IHBhdGguam9pbihsaWJSb290LCBsaWJyYXJ5LnNob3J0TmFtZSk7XG4gICAgY29uc3QgY29waWVkID0gYXdhaXQgdHJhbnNmb3JtUGFja2FnZShsaWJyYXJ5LCBwYWNrYWdlSnNvbiwgbGliRGlyLCBsaWJyYXJpZXMpO1xuXG4gICAgaWYgKCFjb3BpZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobGlicmFyeS5zaG9ydE5hbWUgPT09ICdjb3JlJykge1xuICAgICAgaW5kZXhTdGF0ZW1lbnRzLnB1c2goYGV4cG9ydCAqIGZyb20gJy4vJHtsaWJyYXJ5LnNob3J0TmFtZX0nO2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmRleFN0YXRlbWVudHMucHVzaChgZXhwb3J0ICogYXMgJHtsaWJyYXJ5LnNob3J0TmFtZS5yZXBsYWNlKC8tL2csICdfJyl9IGZyb20gJy4vJHtsaWJyYXJ5LnNob3J0TmFtZX0nO2ApO1xuICAgIH1cbiAgICBjb3B5U3VibW9kdWxlRXhwb3J0cyhwYWNrYWdlSnNvbi5leHBvcnRzLCBsaWJyYXJ5LCBsaWJyYXJ5LnNob3J0TmFtZSk7XG4gIH1cblxuICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKGxpYlJvb3QsICdpbmRleC50cycpLCBpbmRleFN0YXRlbWVudHMuam9pbignXFxuJyksIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcblxuICBjb25zb2xlLmxvZygnXFx08J+NuiBTdWNjZXNzIScpO1xufVxuXG4vKipcbiAqIENvcHkgdGhlIHN1YmxpYnJhcnkncyBleHBvcnRzIGludG8gdGhlICdleHBvcnRzJyBvZiB0aGUgbWFpbiBsaWJyYXJ5LlxuICpcbiAqIFJlcGxhY2UgdGhlIG9yaWdpbmFsICdtYWluJyBleHBvcnQgd2l0aCBhbiBleHBvcnQgb2YgdGhlIG5ldyAnPHN1Ym1vZHVsZT4vaW5kZXgudHNgIGZpbGUgd2UndmUgd3JpdHRlblxuICogaW4gJ3RyYW5zZm9ybVBhY2thZ2UnLlxuICovXG5mdW5jdGlvbiBjb3B5U3VibW9kdWxlRXhwb3J0cyh0YXJnZXRFeHBvcnRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBsaWJyYXJ5OiBMaWJyYXJ5UmVmZXJlbmNlLCBzdWJkaXJlY3Rvcnk6IHN0cmluZykge1xuICBjb25zdCB2aXNpYmxlTmFtZSA9IGxpYnJhcnkuc2hvcnROYW1lO1xuXG4gIC8vIERvIGJvdGggUkVBTCBcImV4cG9ydHNcIiBzZWN0aW9uLCBhcyB3ZWxsIGFzIHZpcnR1YWwsIHViZXJnZW4tb25seSBcImV4cG9ydHNcIiBzZWN0aW9uXG4gIGZvciAoY29uc3QgZXhwb3J0U2V0IG9mIFtsaWJyYXJ5LnBhY2thZ2VKc29uLmV4cG9ydHMsIGxpYnJhcnkucGFja2FnZUpzb24udWJlcmdlbj8uZXhwb3J0c10pIHtcbiAgICBmb3IgKGNvbnN0IFtyZWxQYXRoLCByZWxTb3VyY2VdIG9mIE9iamVjdC5lbnRyaWVzKGV4cG9ydFNldCA/PyB7fSkpIHtcbiAgICAgIHRhcmdldEV4cG9ydHNbYC4vJHt1bml4UGF0aChwYXRoLmpvaW4odmlzaWJsZU5hbWUsIHJlbFBhdGgpKX1gXSA9IGAuLyR7dW5peFBhdGgocGF0aC5qb2luKHN1YmRpcmVjdG9yeSwgcmVsU291cmNlKSl9YDtcbiAgICB9XG4gIH1cblxuICBpZiAodmlzaWJsZU5hbWUgIT09ICdjb3JlJykge1xuICAgIC8vIElmIHRoZXJlIHdhcyBhbiBleHBvcnQgZm9yICcuJyBpbiB0aGUgb3JpZ2luYWwgc3VibW9kdWxlLCB0aGlzIGFzc2lnbm1lbnQgd2lsbCBvdmVyd3JpdGUgaXQsXG4gICAgLy8gd2hpY2ggaXMgZXhhY3RseSB3aGF0IHdlIHdhbnQuXG4gICAgdGFyZ2V0RXhwb3J0c1tgLi8ke3VuaXhQYXRoKHZpc2libGVOYW1lKX1gXSA9IGAuLyR7dW5peFBhdGgoc3ViZGlyZWN0b3J5KX0vaW5kZXguanNgO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbWJpbmVSb3NldHRhRml4dHVyZXMobGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10sIHViZXJQYWNrYWdlSnNvbjogUGFja2FnZUpzb24pIHtcbiAgY29uc29sZS5sb2coJ/Cfk50gQ29tYmluaW5nIFJvc2V0dGEgZml4dHVyZXMuLi4nKTtcblxuICBjb25zdCB1YmVyUm9zZXR0YURpciA9IHBhdGgucmVzb2x2ZShNT05PUEFDS0FHRV9ST09ULCAncm9zZXR0YScpO1xuICBhd2FpdCBmcy5yZW1vdmUodWJlclJvc2V0dGFEaXIpO1xuICBhd2FpdCBmcy5ta2Rpcih1YmVyUm9zZXR0YURpcik7XG5cbiAgZm9yIChjb25zdCBsaWJyYXJ5IG9mIGxpYnJhcmllcykge1xuICAgIGNvbnN0IHBhY2thZ2VSb3NldHRhRGlyID0gcGF0aC5qb2luKGxpYnJhcnkucm9vdCwgJ3Jvc2V0dGEnKTtcbiAgICBjb25zdCB1YmVyUm9zZXR0YVRhcmdldERpciA9IGxpYnJhcnkuc2hvcnROYW1lID09PSAnY29yZScgPyB1YmVyUm9zZXR0YURpciA6IHBhdGguam9pbih1YmVyUm9zZXR0YURpciwgbGlicmFyeS5zaG9ydE5hbWUucmVwbGFjZSgvLS9nLCAnXycpKTtcbiAgICBpZiAoYXdhaXQgZnMucGF0aEV4aXN0cyhwYWNrYWdlUm9zZXR0YURpcikpIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyh1YmVyUm9zZXR0YVRhcmdldERpcikpIHtcbiAgICAgICAgYXdhaXQgZnMubWtkaXIodWJlclJvc2V0dGFUYXJnZXREaXIpO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmcy5yZWFkZGlyKHBhY2thZ2VSb3NldHRhRGlyKTtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUoXG4gICAgICAgICAgcGF0aC5qb2luKHViZXJSb3NldHRhVGFyZ2V0RGlyLCBmaWxlKSxcbiAgICAgICAgICBhd2FpdCByZXdyaXRlUm9zZXR0YUZpeHR1cmVJbXBvcnRzKFxuICAgICAgICAgICAgcGF0aC5qb2luKHBhY2thZ2VSb3NldHRhRGlyLCBmaWxlKSxcbiAgICAgICAgICAgIHViZXJQYWNrYWdlSnNvbi5uYW1lLFxuICAgICAgICAgICksXG4gICAgICAgICAgeyBlbmNvZGluZzogJ3V0ZjgnIH0sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5sb2coJ1xcdPCfjbogU3VjY2VzcyEnKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJhbnNmb3JtUGFja2FnZShcbiAgbGlicmFyeTogTGlicmFyeVJlZmVyZW5jZSxcbiAgdWJlclBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbixcbiAgZGVzdGluYXRpb246IHN0cmluZyxcbiAgYWxsTGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10sXG4pIHtcbiAgYXdhaXQgZnMubWtkaXJwKGRlc3RpbmF0aW9uKTtcblxuICBpZiAodWJlclBhY2thZ2VKc29uLnViZXJnZW4/LmV4Y2x1ZGVFeHBlcmltZW50YWxNb2R1bGVzICYmIGxpYnJhcnkucGFja2FnZUpzb24uc3RhYmlsaXR5ID09PSAnZXhwZXJpbWVudGFsJykge1xuICAgIC8vIHdoZW4gc3RyaXBFeHBlcmltZW50YWwgaXMgZW5hYmxlZCwgd2Ugb25seSB3YW50IHRvIGFkZCB0aGUgTDFzIG9mIGV4cGVyaW1lbnRhbCBtb2R1bGVzLlxuICAgIGxldCBjZm5TY29wZXMgPSBsaWJyYXJ5LnBhY2thZ2VKc29uWydjZGstYnVpbGQnXT8uY2xvdWRmb3JtYXRpb247XG5cbiAgICBpZiAoY2ZuU2NvcGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2ZuU2NvcGVzID0gQXJyYXkuaXNBcnJheShjZm5TY29wZXMpID8gY2ZuU2NvcGVzIDogW2NmblNjb3Blc107XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbkxpYiA9IHBhdGguam9pbihkZXN0aW5hdGlvbiwgJ2xpYicpO1xuICAgIGF3YWl0IGZzLm1rZGlycChkZXN0aW5hdGlvbkxpYik7XG4gICAgYXdhaXQgY2ZuMnRzKGNmblNjb3BlcywgZGVzdGluYXRpb25MaWIpO1xuXG4gICAgLy8gV2Uga25vdyB3aGF0IHRoaXMgaXMgZ29pbmcgdG8gYmUsIHNvIHByZWRpY3QgaXRcbiAgICBjb25zdCBhbHBoYVBhY2thZ2VOYW1lID0gaGFzTDJzKGxpYnJhcnkpID8gYCR7bGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lfS1hbHBoYWAgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBjcmVhdGUgYSBsaWIvaW5kZXgudHMgd2hpY2ggb25seSBleHBvcnRzIHRoZSBnZW5lcmF0ZWQgZmlsZXNcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkZXN0aW5hdGlvbkxpYiwgJ2luZGV4LnRzJyksXG4gICAgICAvLy8gbG9naWMgY29waWVkIGZyb20gYGNyZWF0ZS1taXNzaW5nLWxpYnJhcmllcy50c2BcbiAgICAgIGNmblNjb3Blcy5tYXAocyA9PiAocyA9PT0gJ0FXUzo6U2VydmVybGVzcycgPyAnQVdTOjpTQU0nIDogcykuc3BsaXQoJzo6JylbMV0udG9Mb2NhbGVMb3dlckNhc2UoKSlcbiAgICAgICAgLm1hcChzID0+IGBleHBvcnQgKiBmcm9tICcuLyR7c30uZ2VuZXJhdGVkJztgKVxuICAgICAgICAuam9pbignXFxuJykpO1xuICAgIGF3YWl0IHBrZ2xpbnQuY3JlYXRlTGlicmFyeVJlYWRtZShjZm5TY29wZXNbMF0sIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJ1JFQURNRS5tZCcpLCBhbHBoYVBhY2thZ2VOYW1lKTtcblxuICAgIGF3YWl0IGNvcHlPclRyYW5zZm9ybUZpbGVzKGRlc3RpbmF0aW9uLCBkZXN0aW5hdGlvbiwgYWxsTGlicmFyaWVzLCB1YmVyUGFja2FnZUpzb24pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGNvcHlPclRyYW5zZm9ybUZpbGVzKGxpYnJhcnkucm9vdCwgZGVzdGluYXRpb24sIGFsbExpYnJhcmllcywgdWJlclBhY2thZ2VKc29uKTtcbiAgICBhd2FpdCBjb3B5TGl0ZXJhdGVTb3VyY2VzKHBhdGguam9pbihsaWJyYXJ5LnJvb3QsICd0ZXN0JyksIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJ3Rlc3QnKSwgYWxsTGlicmFyaWVzLCB1YmVyUGFja2FnZUpzb24pO1xuICB9XG5cbiAgYXdhaXQgZnMud3JpdGVGaWxlKFxuICAgIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJ2luZGV4LnRzJyksXG4gICAgYGV4cG9ydCAqIGZyb20gJy4vJHtsaWJyYXJ5LnBhY2thZ2VKc29uLnR5cGVzLnJlcGxhY2UoLyhcXC9pbmRleCk/KFxcLmQpP1xcLnRzJC8sICcnKX0nO1xcbmAsXG4gICAgeyBlbmNvZGluZzogJ3V0ZjgnIH0sXG4gICk7XG5cbiAgaWYgKGxpYnJhcnkuc2hvcnROYW1lICE9PSAnY29yZScpIHtcbiAgICBjb25zdCBjb25maWcgPSB1YmVyUGFja2FnZUpzb24uanNpaS50YXJnZXRzO1xuICAgIGF3YWl0IGZzLndyaXRlSnNvbihcbiAgICAgIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJy5qc2lpcmMuanNvbicpLFxuICAgICAge1xuICAgICAgICB0YXJnZXRzOiB0cmFuc2Zvcm1UYXJnZXRzKGNvbmZpZywgbGlicmFyeS5wYWNrYWdlSnNvbi5qc2lpLnRhcmdldHMpLFxuICAgICAgfSxcbiAgICAgIHsgc3BhY2VzOiAyIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIGlmIGxpYlJvb3QgaXMgX25vdF8gdW5kZXIgdGhlIHJvb3Qgb2YgdGhlIHBhY2thZ2UsIGdlbmVyYXRlIGEgZmlsZSBhdCB0aGVcbiAgLy8gcm9vdCB0aGF0IHdpbGwgcmVmZXIgdG8gdGhlIG9uZSB1bmRlciBsaWIvIHNvIHRoYXQgdXNlcnMgY2FuIHN0aWxsIGltcG9ydFxuICAvLyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiLlxuICBjb25zdCByZWxhdGl2ZUxpYlJvb3QgPSB1YmVyUGFja2FnZUpzb24udWJlcmdlbj8ubGliUm9vdDtcbiAgaWYgKHJlbGF0aXZlTGliUm9vdCAmJiByZWxhdGl2ZUxpYlJvb3QgIT09ICcuJykge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShcbiAgICAgIHBhdGgucmVzb2x2ZShNT05PUEFDS0FHRV9ST09ULCBgJHtsaWJyYXJ5LnNob3J0TmFtZX0udHNgKSxcbiAgICAgIGBleHBvcnQgKiBmcm9tICcuLyR7cmVsYXRpdmVMaWJSb290fS8ke2xpYnJhcnkuc2hvcnROYW1lfSc7XFxuYCxcbiAgICAgIHsgZW5jb2Rpbmc6ICd1dGY4JyB9LFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciBhIHBhY2thZ2UgaGFzIEwyc1xuICpcbiAqIFdlIGRldGVybWluZSB0aGlzIG9uIHRoZSBjaGVhcDogdGhlIGFuc3dlciBpcyB5ZXMgaWYgdGhlIHBhY2thZ2UgaGFzXG4gKiBhbnkgLnRzIGZpbGVzIGluIHRoZSBgbGliYCBkaXJlY3Rvcnkgb3RoZXIgdGhhbiBgaW5kZXgudHNgIGFuZCBgKi5nZW5lcmF0ZWQudHNgLlxuICovXG5mdW5jdGlvbiBoYXNMMnMobGlicmFyeTogTGlicmFyeVJlZmVyZW5jZSkge1xuICB0cnkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGVzID0gZnMucmVhZGRpclN5bmMocGF0aC5qb2luKGxpYnJhcnkucm9vdCwgJ2xpYicpKS5maWx0ZXIobiA9PiBuLmVuZHNXaXRoKCcudHMnKSAmJiAhbi5lbmRzV2l0aCgnLmQudHMnKSk7XG4gICAgcmV0dXJuIHNvdXJjZUZpbGVzLnNvbWUobiA9PiBuICE9PSAnaW5kZXgudHMnICYmICFuLmluY2x1ZGVzKCcuZ2VuZXJhdGVkLicpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1UYXJnZXRzKG1vbm9Db25maWc6IFBhY2thZ2VKc29uWydqc2lpJ11bJ3RhcmdldHMnXSwgdGFyZ2V0czogUGFja2FnZUpzb25bJ2pzaWknXVsndGFyZ2V0cyddKTogUGFja2FnZUpzb25bJ2pzaWknXVsndGFyZ2V0cyddIHtcbiAgaWYgKHRhcmdldHMgPT0gbnVsbCkgeyByZXR1cm4gdGFyZ2V0czsgfVxuXG4gIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBmb3IgKGNvbnN0IFtsYW5ndWFnZSwgY29uZmlnXSBvZiBPYmplY3QuZW50cmllcyh0YXJnZXRzKSkge1xuICAgIHN3aXRjaCAobGFuZ3VhZ2UpIHtcbiAgICAgIGNhc2UgJ2RvdG5ldCc6XG4gICAgICAgIGlmIChtb25vQ29uZmlnPy5kb3RuZXQgIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdFtsYW5ndWFnZV0gPSB7XG4gICAgICAgICAgICBuYW1lc3BhY2U6IChjb25maWcgYXMgYW55KS5uYW1lc3BhY2UsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2phdmEnOlxuICAgICAgICBpZiAobW9ub0NvbmZpZz8uamF2YSAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0W2xhbmd1YWdlXSA9IHtcbiAgICAgICAgICAgIHBhY2thZ2U6IChjb25maWcgYXMgYW55KS5wYWNrYWdlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdweXRob24nOlxuICAgICAgICBpZiAobW9ub0NvbmZpZz8ucHl0aG9uICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRbbGFuZ3VhZ2VdID0ge1xuICAgICAgICAgICAgbW9kdWxlOiBgJHttb25vQ29uZmlnLnB5dGhvbi5tb2R1bGV9LiR7KGNvbmZpZyBhcyBhbnkpLm1vZHVsZS5yZXBsYWNlKC9eYXdzX2Nka1xcLi8sICcnKX1gLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGxhbmd1YWdlIGZvciBzdWJtb2R1bGUgY29uZmlndXJhdGlvbiB0cmFuc2xhdGlvbjogJHtsYW5ndWFnZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBjb3B5T3JUcmFuc2Zvcm1GaWxlcyhmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcsIGxpYnJhcmllczogcmVhZG9ubHkgTGlicmFyeVJlZmVyZW5jZVtdLCB1YmVyUGFja2FnZUpzb246IFBhY2thZ2VKc29uKSB7XG4gIGNvbnN0IGxpYlJvb3QgPSByZXNvbHZlTGliUm9vdCh1YmVyUGFja2FnZUpzb24pO1xuICBjb25zdCBwcm9taXNlcyA9IChhd2FpdCBmcy5yZWFkZGlyKGZyb20pKS5tYXAoYXN5bmMgbmFtZSA9PiB7XG4gICAgaWYgKHNob3VsZElnbm9yZUZpbGUobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAobmFtZS5lbmRzV2l0aCgnLmQudHMnKSB8fCBuYW1lLmVuZHNXaXRoKCcuanMnKSkge1xuICAgICAgaWYgKGF3YWl0IGZzLnBhdGhFeGlzdHMocGF0aC5qb2luKGZyb20sIG5hbWUucmVwbGFjZSgvXFwuKGRcXC50c3xqcykkLywgJy50cycpKSkpIHtcbiAgICAgICAgLy8gV2Ugd29uJ3QgY29weSAuZC50cyBhbmQgLmpzIGZpbGVzIHdpdGggYSBjb3JyZXNwb25kaW5nIC50cyBmaWxlXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSBwYXRoLmpvaW4oZnJvbSwgbmFtZSk7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBwYXRoLmpvaW4odG8sIG5hbWUpO1xuXG4gICAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLnN0YXQoc291cmNlKTtcbiAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBhd2FpdCBmcy5ta2RpcnAoZGVzdGluYXRpb24pO1xuICAgICAgcmV0dXJuIGNvcHlPclRyYW5zZm9ybUZpbGVzKHNvdXJjZSwgZGVzdGluYXRpb24sIGxpYnJhcmllcywgdWJlclBhY2thZ2VKc29uKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZS5lbmRzV2l0aCgnLnRzJykpIHtcbiAgICAgIHJldHVybiBmcy53cml0ZUZpbGUoXG4gICAgICAgIGRlc3RpbmF0aW9uLFxuICAgICAgICBhd2FpdCByZXdyaXRlTGlicmFyeUltcG9ydHMoc291cmNlLCB0bywgbGliUm9vdCwgbGlicmFyaWVzKSxcbiAgICAgICAgeyBlbmNvZGluZzogJ3V0ZjgnIH0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2Nmbi10eXBlcy0yLWNsYXNzZXMuanNvbicpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBzcGVjaWFsIGZpbGUgdXNlZCBieSB0aGUgY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUgdGhhdCBjb250YWlucyBtYXBwaW5nc1xuICAgICAgLy8gb2YgQ0ZOIHJlc291cmNlIHR5cGVzIHRvIHRoZSBmdWxseS1xdWFsaWZpZWQgY2xhc3MgbmFtZXMgb2YgdGhlIENESyBMMSBjbGFzc2VzLlxuICAgICAgLy8gV2UgbmVlZCB0byByZXdyaXRlIGl0IHRvIHJlZmVyIHRvIHRoZSB1YmVycGFja2FnZSBpbnN0ZWFkIG9mIHRoZSBpbmRpdmlkdWFsIHBhY2thZ2VzXG4gICAgICBjb25zdCBjZm5UeXBlczJDbGFzc2VzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0gYXdhaXQgZnMucmVhZEpzb24oc291cmNlKTtcbiAgICAgIGZvciAoY29uc3QgY2ZuVHlwZSBvZiBPYmplY3Qua2V5cyhjZm5UeXBlczJDbGFzc2VzKSkge1xuICAgICAgICBjb25zdCBmcW4gPSBjZm5UeXBlczJDbGFzc2VzW2NmblR5cGVdO1xuICAgICAgICAvLyByZXBsYWNlIEBhd3MtY2RrL2F3cy08c2VydmljZT4gd2l0aCA8dWJlci1wYWNrYWdlLW5hbWU+L2F3cy08c2VydmljZT4sXG4gICAgICAgIC8vIGV4Y2VwdCBmb3IgQGF3cy1jZGsvY29yZSwgd2hpY2ggbWFwcyBqdXN0IHRvIHRoZSBuYW1lIG9mIHRoZSB1YmVycGFja2FnZVxuICAgICAgICBjZm5UeXBlczJDbGFzc2VzW2NmblR5cGVdID0gZnFuLnN0YXJ0c1dpdGgoJ0Bhd3MtY2RrL2NvcmUuJylcbiAgICAgICAgICA/IGZxbi5yZXBsYWNlKCdAYXdzLWNkay9jb3JlJywgdWJlclBhY2thZ2VKc29uLm5hbWUpXG4gICAgICAgICAgOiBmcW4ucmVwbGFjZSgnQGF3cy1jZGsnLCB1YmVyUGFja2FnZUpzb24ubmFtZSk7XG4gICAgICB9XG4gICAgICBhd2FpdCBmcy53cml0ZUpzb24oZGVzdGluYXRpb24sIGNmblR5cGVzMkNsYXNzZXMsIHsgc3BhY2VzOiAyIH0pO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ1JFQURNRS5tZCcpIHtcbiAgICAgIC8vIFJld3JpdGUgdGhlIFJFQURNRSB0byBib3RoIGFkanVzdCBpbXBvcnRzIGFuZCByZW1vdmUgdGhlIHJlZHVuZGFudCBzdGFiaWxpdHkgYmFubmVyLlxuICAgICAgLy8gKEFsbCBtb2R1bGVzIGluY2x1ZGVkIGluIHViZXJnZW4tZWQgcGFja2FnZXMgbXVzdCBiZSBzdGFibGUsIHNvIHRoZSBiYW5uZXIgaXMgdW5uZWNlc3NhcnkuKVxuICAgICAgY29uc3QgbmV3UmVhZG1lID0gKGF3YWl0IHJld3JpdGVSZWFkbWVJbXBvcnRzKHNvdXJjZSwgdWJlclBhY2thZ2VKc29uLm5hbWUpKVxuICAgICAgICAucmVwbGFjZSgvPCEtLUJFR0lOIFNUQUJJTElUWSBCQU5ORVItLT5bXFxzXFxTXSs8IS0tRU5EIFNUQUJJTElUWSBCQU5ORVItLT4vZ20sICcnKTtcblxuICAgICAgcmV0dXJuIGZzLndyaXRlRmlsZShcbiAgICAgICAgZGVzdGluYXRpb24sXG4gICAgICAgIG5ld1JlYWRtZSxcbiAgICAgICAgeyBlbmNvZGluZzogJ3V0ZjgnIH0sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnMuY29weUZpbGUoc291cmNlLCBkZXN0aW5hdGlvbik7XG4gICAgfVxuICB9KTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvcHlMaXRlcmF0ZVNvdXJjZXMoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBsaWJyYXJpZXM6IHJlYWRvbmx5IExpYnJhcnlSZWZlcmVuY2VbXSwgdWJlclBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbikge1xuICBjb25zdCBsaWJSb290ID0gcmVzb2x2ZUxpYlJvb3QodWJlclBhY2thZ2VKc29uKTtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoKGF3YWl0IGZzLnJlYWRkaXIoZnJvbSkpLmZsYXRNYXAoYXN5bmMgbmFtZSA9PiB7XG4gICAgY29uc3Qgc291cmNlID0gcGF0aC5qb2luKGZyb20sIG5hbWUpO1xuICAgIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KHNvdXJjZSk7XG5cbiAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBhd2FpdCBjb3B5TGl0ZXJhdGVTb3VyY2VzKHNvdXJjZSwgcGF0aC5qb2luKHRvLCBuYW1lKSwgbGlicmFyaWVzLCB1YmVyUGFja2FnZUpzb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbmFtZS5lbmRzV2l0aCgnLmxpdC50cycpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgYXdhaXQgZnMubWtkaXJwKHRvKTtcblxuICAgIHJldHVybiBmcy53cml0ZUZpbGUoXG4gICAgICBwYXRoLmpvaW4odG8sIG5hbWUpLFxuICAgICAgYXdhaXQgcmV3cml0ZUxpYnJhcnlJbXBvcnRzKHBhdGguam9pbihmcm9tLCBuYW1lKSwgdG8sIGxpYlJvb3QsIGxpYnJhcmllcyksXG4gICAgICB7IGVuY29kaW5nOiAndXRmOCcgfSxcbiAgICApO1xuICB9KSk7XG59XG5cbi8qKlxuICogUmV3cml0ZXMgdGhlIGltcG9ydHMgaW4gUkVBRE1FLm1kIGZyb20gdjEgKCdAYXdzLWNkaycpIHRvIHYyICgnYXdzLWNkay1saWInKS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV3cml0ZVJlYWRtZUltcG9ydHMoZnJvbUZpbGU6IHN0cmluZywgbGliTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc291cmNlQ29kZSA9IGF3YWl0IGZzLnJlYWRGaWxlKGZyb21GaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gIHJldHVybiBhd3NDZGtNaWdyYXRpb24ucmV3cml0ZVJlYWRtZUltcG9ydHMoc291cmNlQ29kZSwgbGliTmFtZSk7XG59XG5cbi8qKlxuICogUmV3cml0ZXMgaW1wb3J0cyBpbiBsaWJhcmllcywgdXNpbmcgdGhlIHJlbGF0aXZlIHBhdGggKGkuZS4gJy4uLy4uL2Fzc2VydGlvbnMnKS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV3cml0ZUxpYnJhcnlJbXBvcnRzKGZyb21GaWxlOiBzdHJpbmcsIHRhcmdldERpcjogc3RyaW5nLCBsaWJSb290OiBzdHJpbmcsIGxpYnJhcmllczogcmVhZG9ubHkgTGlicmFyeVJlZmVyZW5jZVtdKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc291cmNlID0gYXdhaXQgZnMucmVhZEZpbGUoZnJvbUZpbGUsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgcmV0dXJuIGF3c0Nka01pZ3JhdGlvbi5yZXdyaXRlSW1wb3J0cyhzb3VyY2UsIHJlbGF0aXZlSW1wb3J0KTtcblxuICBmdW5jdGlvbiByZWxhdGl2ZUltcG9ydChtb2R1bGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHNvdXJjZUxpYnJhcnkgPSBsaWJyYXJpZXMuZmluZChcbiAgICAgIGxpYiA9PlxuICAgICAgICBtb2R1bGVQYXRoID09PSBsaWIucGFja2FnZUpzb24ubmFtZSB8fFxuICAgICAgICBtb2R1bGVQYXRoLnN0YXJ0c1dpdGgoYCR7bGliLnBhY2thZ2VKc29uLm5hbWV9L2ApLFxuICAgICk7XG4gICAgaWYgKHNvdXJjZUxpYnJhcnkgPT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSBtb2R1bGVQYXRoID09PSBzb3VyY2VMaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVcbiAgICAgID8gcGF0aC5qb2luKGxpYlJvb3QsIHNvdXJjZUxpYnJhcnkuc2hvcnROYW1lKVxuICAgICAgOiBwYXRoLmpvaW4obGliUm9vdCwgc291cmNlTGlicmFyeS5zaG9ydE5hbWUsIG1vZHVsZVBhdGguc2xpY2Uoc291cmNlTGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lLmxlbmd0aCArIDEpKTtcblxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRhcmdldERpciwgaW1wb3J0ZWRGaWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJld3JpdGVzIGltcG9ydHMgaW4gcm9zZXR0YSBmaXh0dXJlcywgdXNpbmcgdGhlIGV4dGVybmFsIHBhdGggKGkuZS4gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnKS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV3cml0ZVJvc2V0dGFGaXh0dXJlSW1wb3J0cyhmcm9tRmlsZTogc3RyaW5nLCBsaWJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzb3VyY2UgPSBhd2FpdCBmcy5yZWFkRmlsZShmcm9tRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICByZXR1cm4gYXdzQ2RrTWlncmF0aW9uLnJld3JpdGVNb25vUGFja2FnZUltcG9ydHMoc291cmNlLCBsaWJOYW1lKTtcbn1cblxuY29uc3QgSUdOT1JFRF9GSUxFX05BTUVTID0gbmV3IFNldChbXG4gICcuZXNsaW50cmMuanMnLFxuICAnLmdpdGlnbm9yZScsXG4gICcuamVzdC5jb25maWcuanMnLFxuICAnLmpzaWknLFxuICAnLm5wbWlnbm9yZScsXG4gICdub2RlX21vZHVsZXMnLFxuICAncGFja2FnZS5qc29uJyxcbiAgJ3Rlc3QnLFxuICAndHNjb25maWcuanNvbicsXG4gICd0c2NvbmZpZy50c2J1aWxkaW5mbycsXG4gICdMSUNFTlNFJyxcbiAgJ05PVElDRScsXG5dKTtcblxuZnVuY3Rpb24gc2hvdWxkSWdub3JlRmlsZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIElHTk9SRURfRklMRV9OQU1FUy5oYXMobmFtZSk7XG59XG5cbmZ1bmN0aW9uIHNvcnRPYmplY3Q8VD4ob2JqOiBSZWNvcmQ8c3RyaW5nLCBUPik6IFJlY29yZDxzdHJpbmcsIFQ+IHtcbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBUPiA9IHt9O1xuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikuc29ydCgobCwgcikgPT4gbFswXS5sb2NhbGVDb21wYXJlKHJbMF0pKSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFR1cm4gcG90ZW50aWFsIGJhY2tzbGFzaGVzIGludG8gZm9yd2FyZCBzbGFzaGVzXG4gKi9cbmZ1bmN0aW9uIHVuaXhQYXRoKHg6IHN0cmluZykge1xuICByZXR1cm4geC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGRpcmVjdG9yeSB3aGVyZSB3ZSdyZSBnb2luZyB0byBjb2xsZWN0IGFsbCB0aGUgbGlicmFyaWVzLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoaXMgaXMgcHVycG9zZWx5IHRoZSBzYW1lIGFzIHRoZSBtb25vcGFja2FnZSByb290IHNvIHRoYXQgb3VyXG4gKiB0d28gaW1wb3J0IHN0eWxlcyByZXNvbHZlIHRvIHRoZSBzYW1lIGZpbGVzIGJ1dCBpdCBjYW4gYmUgb3ZlcnJpZGRlbiBieVxuICogc2VldGluZyBgdWJlcmdlbi5saWJSb290YCBpbiB0aGUgcGFja2FnZS5qc29uIG9mIHRoZSB1YmVyIHBhY2thZ2UuXG4gKlxuICogQHBhcmFtIHViZXJQYWNrYWdlSnNvbiBwYWNrYWdlLmpzb24gY29udGVudHMgb2YgdGhlIHViZXIgcGFja2FnZVxuICogQHJldHVybnMgVGhlIGRpcmVjdG9yeSB3aGVyZSB3ZSBzaG91bGQgY29sbGVjdCBhbGwgdGhlIGxpYnJhcmllcy5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZUxpYlJvb3QodWJlclBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbik6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlc29sdmUodWJlclBhY2thZ2VKc29uLnViZXJnZW4/LmxpYlJvb3QgPz8gTU9OT1BBQ0tBR0VfUk9PVCk7XG59XG4iXX0=