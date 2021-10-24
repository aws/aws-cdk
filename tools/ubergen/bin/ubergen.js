"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console = require("console");
const os = require("os");
const path = require("path");
const process = require("process");
const fs = require("fs-extra");
const ts = require("typescript");
const LIB_ROOT = path.resolve(process.cwd(), 'lib');
const ROOT_PATH = findWorkspacePath();
const UBER_PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');
async function main() {
    console.log(`🌴  workspace root path is: ${ROOT_PATH}`);
    const uberPackageJson = await fs.readJson(UBER_PACKAGE_JSON_PATH);
    const libraries = await findLibrariesToPackage(uberPackageJson);
    await verifyDependencies(uberPackageJson, libraries);
    await prepareSourceFiles(libraries, uberPackageJson);
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
        if (process.cwd() === os.homedir()) {
            throw new Error('couldn\'t find a \'lerna.json\' file when walking up the directory tree, are you in a aws-cdk project?');
        }
        if (fs.existsSync(path.resolve(part, 'lerna.json'))) {
            return part;
        }
        return _findRootPath(path.resolve(part, '..'));
    }
}
async function findLibrariesToPackage(uberPackageJson) {
    var _a, _b;
    console.log('🔍 Discovering libraries that need packaging...');
    const deprecatedPackages = (_a = uberPackageJson.ubergen) === null || _a === void 0 ? void 0 : _a.deprecatedPackages;
    const result = new Array();
    const librariesRoot = path.resolve(ROOT_PATH, 'packages', '@aws-cdk');
    for (const dir of await fs.readdir(librariesRoot)) {
        const packageJson = await fs.readJson(path.resolve(librariesRoot, dir, 'package.json'));
        if ((_b = packageJson.ubergen) === null || _b === void 0 ? void 0 : _b.exclude) {
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
            shortName: packageJson.name.substr('@aws-cdk/'.length),
        });
    }
    console.log(`\tℹ️ Found ${result.length} relevant packages!`);
    return result;
}
async function verifyDependencies(packageJson, libraries) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    console.log('🧐 Verifying dependencies are complete...');
    let changed = false;
    const toBundle = {};
    for (const library of libraries) {
        for (const depName of (_b = (_a = library.packageJson.bundleDependencies) !== null && _a !== void 0 ? _a : library.packageJson.bundledDependencies) !== null && _b !== void 0 ? _b : []) {
            const requiredVersion = (_f = (_d = (_c = library.packageJson.devDependencies) === null || _c === void 0 ? void 0 : _c[depName]) !== null && _d !== void 0 ? _d : (_e = library.packageJson.dependencies) === null || _e === void 0 ? void 0 : _e[depName]) !== null && _f !== void 0 ? _f : '*';
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
            ...(_g = packageJson.devDependencies) !== null && _g !== void 0 ? _g : {},
            [library.packageJson.name]: library.packageJson.version,
        });
    }
    const workspacePath = path.resolve(ROOT_PATH, 'package.json');
    const workspace = await fs.readJson(workspacePath);
    let workspaceChanged = false;
    const spuriousBundledDeps = new Set((_h = packageJson.bundledDependencies) !== null && _h !== void 0 ? _h : []);
    for (const [name, version] of Object.entries(toBundle)) {
        spuriousBundledDeps.delete(name);
        const nohoist = `${packageJson.name}/${name}`;
        if (!((_j = workspace.workspaces.nohoist) === null || _j === void 0 ? void 0 : _j.includes(nohoist))) {
            console.log(`\t⚠️ Missing yarn workspace nohoist: ${nohoist}`);
            workspace.workspaces.nohoist = Array.from(new Set([
                ...(_k = workspace.workspaces.nohoist) !== null && _k !== void 0 ? _k : [],
                nohoist,
                `${nohoist}/**`,
            ])).sort();
            workspaceChanged = true;
        }
        if (!((_l = packageJson.bundledDependencies) === null || _l === void 0 ? void 0 : _l.includes(name))) {
            console.log(`\t⚠️ Missing bundled dependency: ${name} at ${version}`);
            packageJson.bundledDependencies = [
                ...(_m = packageJson.bundledDependencies) !== null && _m !== void 0 ? _m : [],
                name,
            ].sort();
            changed = true;
        }
        if (((_o = packageJson.dependencies) === null || _o === void 0 ? void 0 : _o[name]) !== version) {
            console.log(`\t⚠️ Missing or incorrect dependency: ${name} at ${version}`);
            packageJson.dependencies = sortObject({
                ...(_p = packageJson.dependencies) !== null && _p !== void 0 ? _p : {},
                [name]: version,
            });
            changed = true;
        }
    }
    packageJson.bundledDependencies = (_q = packageJson.bundledDependencies) === null || _q === void 0 ? void 0 : _q.filter((dep) => !spuriousBundledDeps.has(dep));
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
    await fs.remove(LIB_ROOT);
    const indexStatements = new Array();
    for (const library of libraries) {
        const libDir = path.join(LIB_ROOT, library.shortName);
        await transformPackage(library, packageJson, libDir, libraries);
        if (library.shortName === 'core') {
            indexStatements.push(`export * from './${library.shortName}';`);
        }
        else {
            indexStatements.push(`export * as ${library.shortName.replace(/-/g, '_')} from './${library.shortName}';`);
        }
    }
    await fs.writeFile(path.join(LIB_ROOT, 'index.ts'), indexStatements.join('\n'), { encoding: 'utf8' });
    console.log('\t🍺 Success!');
}
async function transformPackage(library, uberPackageJson, destination, allLibraries) {
    await fs.mkdirp(destination);
    await copyOrTransformFiles(library.root, destination, allLibraries, uberPackageJson);
    await fs.writeFile(path.join(destination, 'index.ts'), `export * from './${library.packageJson.types.replace(/(\/index)?(\.d)?\.ts$/, '')}';\n`, { encoding: 'utf8' });
    if (library.shortName !== 'core') {
        const config = uberPackageJson.jsii.targets;
        await fs.writeJson(path.join(destination, '.jsiirc.json'), {
            targets: transformTargets(config, library.packageJson.jsii.targets),
        }, { spaces: 2 });
        await fs.writeFile(path.resolve(LIB_ROOT, '..', `${library.shortName}.ts`), `export * from './lib/${library.shortName}';\n`, { encoding: 'utf8' });
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
                if ((monoConfig === null || monoConfig === void 0 ? void 0 : monoConfig.dotnet) != null) {
                    result[language] = {
                        namespace: config.namespace,
                    };
                }
                break;
            case 'java':
                if ((monoConfig === null || monoConfig === void 0 ? void 0 : monoConfig.java) != null) {
                    result[language] = {
                        package: config.package,
                    };
                }
                break;
            case 'python':
                if ((monoConfig === null || monoConfig === void 0 ? void 0 : monoConfig.python) != null) {
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
            return fs.writeFile(destination, await rewriteImports(source, to, libraries), { encoding: 'utf8' });
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
        else {
            return fs.copyFile(source, destination);
        }
    });
    await Promise.all(promises);
}
async function rewriteImports(fromFile, targetDir, libraries) {
    const sourceFile = ts.createSourceFile(fromFile, await fs.readFile(fromFile, { encoding: 'utf8' }), ts.ScriptTarget.ES2018, true, ts.ScriptKind.TS);
    const transformResult = ts.transform(sourceFile, [importRewriter]);
    const transformedSource = transformResult.transformed[0];
    const printer = ts.createPrinter();
    return printer.printFile(transformedSource);
    function importRewriter(ctx) {
        function visitor(node) {
            if (ts.isExternalModuleReference(node) && ts.isStringLiteral(node.expression)) {
                const newTarget = rewrittenImport(node.expression.text);
                if (newTarget != null) {
                    return addRewrittenNote(ts.updateExternalModuleReference(node, newTarget), node.expression);
                }
            }
            else if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
                const newTarget = rewrittenImport(node.moduleSpecifier.text);
                if (newTarget != null) {
                    return addRewrittenNote(ts.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, newTarget), node.moduleSpecifier);
                }
            }
            return ts.visitEachChild(node, visitor, ctx);
        }
        return visitor;
    }
    function addRewrittenNote(node, original) {
        return ts.addSyntheticTrailingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, ` Automatically re-written from ${original.getText()}`, false);
    }
    function rewrittenImport(moduleSpecifier) {
        const sourceLibrary = libraries.find(lib => moduleSpecifier === lib.packageJson.name ||
            moduleSpecifier.startsWith(`${lib.packageJson.name}/`));
        if (sourceLibrary == null) {
            return undefined;
        }
        const importedFile = moduleSpecifier === sourceLibrary.packageJson.name
            ? path.join(LIB_ROOT, sourceLibrary.shortName)
            : path.join(LIB_ROOT, sourceLibrary.shortName, moduleSpecifier.substr(sourceLibrary.packageJson.name.length + 1));
        return ts.createStringLiteral(path.relative(targetDir, importedFile));
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWJlcmdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInViZXJnZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixtQ0FBbUM7QUFDbkMsK0JBQStCO0FBQy9CLGlDQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFM0UsS0FBSyxVQUFVLElBQUk7SUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUV4RCxNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUVsRSxNQUFNLFNBQVMsR0FBRyxNQUFNLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sa0JBQWtCLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sa0JBQWtCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQ1QsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDckIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUNGLENBQUM7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Q0FBQyxJQUFZO0lBQ3BDLE9BQU8sa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBSSxHQUFzQjtJQUMzQyxNQUFNLE1BQU0sR0FBc0IsRUFBRSxDQUFDO0lBRXJDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN2RixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvbnNvbGUgZnJvbSAnY29uc29sZSc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdwcm9jZXNzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5jb25zdCBMSUJfUk9PVCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnbGliJyk7XG5jb25zdCBST09UX1BBVEggPSBmaW5kV29ya3NwYWNlUGF0aCgpO1xuY29uc3QgVUJFUl9QQUNLQUdFX0pTT05fUEFUSCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnNvbGUubG9nKGDwn4y0ICB3b3Jrc3BhY2Ugcm9vdCBwYXRoIGlzOiAke1JPT1RfUEFUSH1gKTtcblxuICBjb25zdCB1YmVyUGFja2FnZUpzb24gPSBhd2FpdCBmcy5yZWFkSnNvbihVQkVSX1BBQ0tBR0VfSlNPTl9QQVRIKTtcblxuICBjb25zdCBsaWJyYXJpZXMgPSBhd2FpdCBmaW5kTGlicmFyaWVzVG9QYWNrYWdlKHViZXJQYWNrYWdlSnNvbik7XG4gIGF3YWl0IHZlcmlmeURlcGVuZGVuY2llcyh1YmVyUGFja2FnZUpzb24sIGxpYnJhcmllcyk7XG4gIGF3YWl0IHByZXBhcmVTb3VyY2VGaWxlcyhsaWJyYXJpZXMsIHViZXJQYWNrYWdlSnNvbik7XG59XG5cbm1haW4oKS50aGVuKFxuICAoKSA9PiBwcm9jZXNzLmV4aXQoMCksXG4gIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKCfinYwgQW4gZXJyb3Igb2NjdXJyZWQ6ICcsIGVyci5zdGFjayk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9LFxuKTtcblxuaW50ZXJmYWNlIExpYnJhcnlSZWZlcmVuY2Uge1xuICByZWFkb25seSBwYWNrYWdlSnNvbjogUGFja2FnZUpzb247XG4gIHJlYWRvbmx5IHJvb3Q6IHN0cmluZztcbiAgcmVhZG9ubHkgc2hvcnROYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBQYWNrYWdlSnNvbiB7XG4gIHJlYWRvbmx5IGJ1bmRsZURlcGVuZGVuY2llcz86IHJlYWRvbmx5IHN0cmluZ1tdO1xuICByZWFkb25seSBidW5kbGVkRGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgc3RyaW5nW107XG4gIHJlYWRvbmx5IGRlcGVuZGVuY2llcz86IHsgcmVhZG9ubHkgW25hbWU6IHN0cmluZ106IHN0cmluZyB9O1xuICByZWFkb25seSBkZXZEZXBlbmRlbmNpZXM/OiB7IHJlYWRvbmx5IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgcmVhZG9ubHkganNpaToge1xuICAgIHJlYWRvbmx5IHRhcmdldHM/OiB7XG4gICAgICByZWFkb25seSBkb3RuZXQ/OiB7XG4gICAgICAgIHJlYWRvbmx5IG5hbWVzcGFjZTogc3RyaW5nO1xuICAgICAgICByZWFkb25seSBba2V5OiBzdHJpbmddOiB1bmtub3duO1xuICAgICAgfSxcbiAgICAgIHJlYWRvbmx5IGphdmE/OiB7XG4gICAgICAgIHJlYWRvbmx5IHBhY2thZ2U6IHN0cmluZztcbiAgICAgICAgcmVhZG9ubHkgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgICAgIH0sXG4gICAgICByZWFkb25seSBweXRob24/OiB7XG4gICAgICAgIHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nO1xuICAgICAgICByZWFkb25seSBba2V5OiBzdHJpbmddOiB1bmtub3duO1xuICAgICAgfSxcbiAgICAgIHJlYWRvbmx5IFtsYW5ndWFnZTogc3RyaW5nXTogdW5rbm93bixcbiAgICB9LFxuICB9O1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHR5cGVzOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcbiAgcmVhZG9ubHkgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgcmVhZG9ubHkgdWJlcmdlbj86IHtcbiAgICByZWFkb25seSBkZXByZWNhdGVkUGFja2FnZXM/OiByZWFkb25seSBzdHJpbmdbXTtcbiAgfTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSB3b3Jrc3BhY2Ugcm9vdCBwYXRoLiBXYWxrIHVwIHRoZSBkaXJlY3RvcnkgdHJlZSB1bnRpbCB5b3UgZmluZCBsZXJuYS5qc29uXG4gKi9cbmZ1bmN0aW9uIGZpbmRXb3Jrc3BhY2VQYXRoKCk6IHN0cmluZyB7XG5cbiAgcmV0dXJuIF9maW5kUm9vdFBhdGgocHJvY2Vzcy5jd2QoKSk7XG5cbiAgZnVuY3Rpb24gX2ZpbmRSb290UGF0aChwYXJ0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChwcm9jZXNzLmN3ZCgpID09PSBvcy5ob21lZGlyKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuXFwndCBmaW5kIGEgXFwnbGVybmEuanNvblxcJyBmaWxlIHdoZW4gd2Fsa2luZyB1cCB0aGUgZGlyZWN0b3J5IHRyZWUsIGFyZSB5b3UgaW4gYSBhd3MtY2RrIHByb2plY3Q/Jyk7XG4gICAgfVxuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKHBhcnQsICdsZXJuYS5qc29uJykpKSB7XG4gICAgICByZXR1cm4gcGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gX2ZpbmRSb290UGF0aChwYXRoLnJlc29sdmUocGFydCwgJy4uJykpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRMaWJyYXJpZXNUb1BhY2thZ2UodWJlclBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbik6IFByb21pc2U8cmVhZG9ubHkgTGlicmFyeVJlZmVyZW5jZVtdPiB7XG4gIGNvbnNvbGUubG9nKCfwn5SNIERpc2NvdmVyaW5nIGxpYnJhcmllcyB0aGF0IG5lZWQgcGFja2FnaW5nLi4uJyk7XG5cbiAgY29uc3QgZGVwcmVjYXRlZFBhY2thZ2VzID0gdWJlclBhY2thZ2VKc29uLnViZXJnZW4/LmRlcHJlY2F0ZWRQYWNrYWdlcztcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PExpYnJhcnlSZWZlcmVuY2U+KCk7XG4gIGNvbnN0IGxpYnJhcmllc1Jvb3QgPSBwYXRoLnJlc29sdmUoUk9PVF9QQVRILCAncGFja2FnZXMnLCAnQGF3cy1jZGsnKTtcblxuICBmb3IgKGNvbnN0IGRpciBvZiBhd2FpdCBmcy5yZWFkZGlyKGxpYnJhcmllc1Jvb3QpKSB7XG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBhd2FpdCBmcy5yZWFkSnNvbihwYXRoLnJlc29sdmUobGlicmFyaWVzUm9vdCwgZGlyLCAncGFja2FnZS5qc29uJykpO1xuXG4gICAgaWYgKHBhY2thZ2VKc29uLnViZXJnZW4/LmV4Y2x1ZGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gU2tpcHBpbmcgKHViZXJnZW4gZXhjbHVkZWQpOiAgICR7cGFja2FnZUpzb24ubmFtZX1gKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAocGFja2FnZUpzb24uanNpaSA9PSBudWxsICkge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBTa2lwcGluZyAobm90IGpzaWktZW5hYmxlZCk6ICAgJHtwYWNrYWdlSnNvbi5uYW1lfWApO1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmIChkZXByZWNhdGVkUGFja2FnZXMpIHtcbiAgICAgIGlmIChkZXByZWNhdGVkUGFja2FnZXMuc29tZShwYWNrYWdlTmFtZSA9PiBwYWNrYWdlTmFtZSA9PT0gcGFja2FnZUpzb24ubmFtZSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBTa2lwcGluZyAodWJlcmdlbiBkZXByZWNhdGVkKTogJHtwYWNrYWdlSnNvbi5uYW1lfWApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBhY2thZ2VKc29uLmRlcHJlY2F0ZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gU2tpcHBpbmcgKGRlcHJlY2F0ZWQpOiAgICAgICAgICR7cGFja2FnZUpzb24ubmFtZX1gKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICBwYWNrYWdlSnNvbixcbiAgICAgIHJvb3Q6IHBhdGguam9pbihsaWJyYXJpZXNSb290LCBkaXIpLFxuICAgICAgc2hvcnROYW1lOiBwYWNrYWdlSnNvbi5uYW1lLnN1YnN0cignQGF3cy1jZGsvJy5sZW5ndGgpLFxuICAgIH0pO1xuICB9XG5cbiAgY29uc29sZS5sb2coYFxcdOKEue+4jyBGb3VuZCAke3Jlc3VsdC5sZW5ndGh9IHJlbGV2YW50IHBhY2thZ2VzIWApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHZlcmlmeURlcGVuZGVuY2llcyhwYWNrYWdlSnNvbjogYW55LCBsaWJyYXJpZXM6IHJlYWRvbmx5IExpYnJhcnlSZWZlcmVuY2VbXSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zb2xlLmxvZygn8J+nkCBWZXJpZnlpbmcgZGVwZW5kZW5jaWVzIGFyZSBjb21wbGV0ZS4uLicpO1xuXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gIGNvbnN0IHRvQnVuZGxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgZm9yIChjb25zdCBsaWJyYXJ5IG9mIGxpYnJhcmllcykge1xuICAgIGZvciAoY29uc3QgZGVwTmFtZSBvZiBsaWJyYXJ5LnBhY2thZ2VKc29uLmJ1bmRsZURlcGVuZGVuY2llcyA/PyBsaWJyYXJ5LnBhY2thZ2VKc29uLmJ1bmRsZWREZXBlbmRlbmNpZXMgPz8gW10pIHtcbiAgICAgIGNvbnN0IHJlcXVpcmVkVmVyc2lvbiA9IGxpYnJhcnkucGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzPy5bZGVwTmFtZV1cbiAgICAgICAgPz8gbGlicmFyeS5wYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXM/LltkZXBOYW1lXVxuICAgICAgICA/PyAnKic7XG4gICAgICBpZiAodG9CdW5kbGVbZGVwTmFtZV0gIT0gbnVsbCAmJiB0b0J1bmRsZVtkZXBOYW1lXSAhPT0gcmVxdWlyZWRWZXJzaW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWlyZWQgdG8gYnVuZGxlIGRpZmZlcmVudCB2ZXJzaW9ucyBvZiAke2RlcE5hbWV9OiAke3RvQnVuZGxlW2RlcE5hbWVdfSBhbmQgJHtyZXF1aXJlZFZlcnNpb259LmApO1xuICAgICAgfVxuICAgICAgdG9CdW5kbGVbZGVwTmFtZV0gPSByZXF1aXJlZFZlcnNpb247XG4gICAgfVxuXG4gICAgaWYgKGxpYnJhcnkucGFja2FnZUpzb24ubmFtZSBpbiBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmVyc2lvbiA9IHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llc1tsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVdO1xuICAgICAgaWYgKGV4aXN0aW5nVmVyc2lvbiAhPT0gbGlicmFyeS5wYWNrYWdlSnNvbi52ZXJzaW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gSW5jb3JyZWN0IGRlcGVuZGVuY3k6ICR7bGlicmFyeS5wYWNrYWdlSnNvbi5uYW1lfSAoZXhwZWN0ZWQgJHtsaWJyYXJ5LnBhY2thZ2VKc29uLnZlcnNpb259LCBmb3VuZCAke3BhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llc1tsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVdfSlgKTtcbiAgICAgICAgcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzW2xpYnJhcnkucGFja2FnZUpzb24ubmFtZV0gPSBsaWJyYXJ5LnBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBcXHTimqDvuI8gTWlzc2luZyBkZXBlbmRlbmN5OiAke2xpYnJhcnkucGFja2FnZUpzb24ubmFtZX1gKTtcbiAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMgPSBzb3J0T2JqZWN0KHtcbiAgICAgIC4uLnBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyA/PyB7fSxcbiAgICAgIFtsaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVdOiBsaWJyYXJ5LnBhY2thZ2VKc29uLnZlcnNpb24sXG4gICAgfSk7XG4gIH1cbiAgY29uc3Qgd29ya3NwYWNlUGF0aCA9IHBhdGgucmVzb2x2ZShST09UX1BBVEgsICdwYWNrYWdlLmpzb24nKTtcbiAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZnMucmVhZEpzb24od29ya3NwYWNlUGF0aCk7XG4gIGxldCB3b3Jrc3BhY2VDaGFuZ2VkID0gZmFsc2U7XG5cbiAgY29uc3Qgc3B1cmlvdXNCdW5kbGVkRGVwcyA9IG5ldyBTZXQ8c3RyaW5nPihwYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzID8/IFtdKTtcbiAgZm9yIChjb25zdCBbbmFtZSwgdmVyc2lvbl0gb2YgT2JqZWN0LmVudHJpZXModG9CdW5kbGUpKSB7XG4gICAgc3B1cmlvdXNCdW5kbGVkRGVwcy5kZWxldGUobmFtZSk7XG5cbiAgICBjb25zdCBub2hvaXN0ID0gYCR7cGFja2FnZUpzb24ubmFtZX0vJHtuYW1lfWA7XG4gICAgaWYgKCF3b3Jrc3BhY2Uud29ya3NwYWNlcy5ub2hvaXN0Py5pbmNsdWRlcyhub2hvaXN0KSkge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBNaXNzaW5nIHlhcm4gd29ya3NwYWNlIG5vaG9pc3Q6ICR7bm9ob2lzdH1gKTtcbiAgICAgIHdvcmtzcGFjZS53b3Jrc3BhY2VzLm5vaG9pc3QgPSBBcnJheS5mcm9tKG5ldyBTZXQoW1xuICAgICAgICAuLi53b3Jrc3BhY2Uud29ya3NwYWNlcy5ub2hvaXN0ID8/IFtdLFxuICAgICAgICBub2hvaXN0LFxuICAgICAgICBgJHtub2hvaXN0fS8qKmAsXG4gICAgICBdKSkuc29ydCgpO1xuICAgICAgd29ya3NwYWNlQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCEocGFja2FnZUpzb24uYnVuZGxlZERlcGVuZGVuY2llcz8uaW5jbHVkZXMobmFtZSkpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgXFx04pqg77iPIE1pc3NpbmcgYnVuZGxlZCBkZXBlbmRlbmN5OiAke25hbWV9IGF0ICR7dmVyc2lvbn1gKTtcbiAgICAgIHBhY2thZ2VKc29uLmJ1bmRsZWREZXBlbmRlbmNpZXMgPSBbXG4gICAgICAgIC4uLnBhY2thZ2VKc29uLmJ1bmRsZWREZXBlbmRlbmNpZXMgPz8gW10sXG4gICAgICAgIG5hbWUsXG4gICAgICBdLnNvcnQoKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXM/LltuYW1lXSAhPT0gdmVyc2lvbikge1xuICAgICAgY29uc29sZS5sb2coYFxcdOKaoO+4jyBNaXNzaW5nIG9yIGluY29ycmVjdCBkZXBlbmRlbmN5OiAke25hbWV9IGF0ICR7dmVyc2lvbn1gKTtcbiAgICAgIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyA9IHNvcnRPYmplY3Qoe1xuICAgICAgICAuLi5wYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgPz8ge30sXG4gICAgICAgIFtuYW1lXTogdmVyc2lvbixcbiAgICAgIH0pO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHBhY2thZ2VKc29uLmJ1bmRsZWREZXBlbmRlbmNpZXMgPSBwYWNrYWdlSnNvbi5idW5kbGVkRGVwZW5kZW5jaWVzPy5maWx0ZXIoKGRlcDogc3RyaW5nKSA9PiAhc3B1cmlvdXNCdW5kbGVkRGVwcy5oYXMoZGVwKSk7XG4gIGZvciAoY29uc3QgdG9SZW1vdmUgb2YgQXJyYXkuZnJvbShzcHVyaW91c0J1bmRsZWREZXBzKSkge1xuICAgIGRlbGV0ZSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXNbdG9SZW1vdmVdO1xuICAgIGNoYW5nZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHdvcmtzcGFjZUNoYW5nZWQpIHtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUod29ya3NwYWNlUGF0aCwgSlNPTi5zdHJpbmdpZnkod29ya3NwYWNlLCBudWxsLCAyKSArICdcXG4nLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgIGNvbnNvbGUubG9nKCdcXHTinYwgVXBkYXRlZCB0aGUgeWFybiB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbi4gUmUtcnVuIFwieWFybiBpbnN0YWxsXCIsIGFuZCBjb21taXQgdGhlIGNoYW5nZXMuJyk7XG4gIH1cblxuICBpZiAoY2hhbmdlZCkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShVQkVSX1BBQ0tBR0VfSlNPTl9QQVRILCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgMikgKyAnXFxuJywgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXhlZCBkZXBlbmRlbmN5IGluY29uc2lzdGVuY2llcy4gQ29tbWl0IHRoZSB1cGRhdGVkIHBhY2thZ2UuanNvbiBmaWxlLicpO1xuICB9XG4gIGNvbnNvbGUubG9nKCdcXHTinIUgRGVwZW5kZW5jaWVzIGFyZSBjb3JyZWN0IScpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwcmVwYXJlU291cmNlRmlsZXMobGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10sIHBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbikge1xuICBjb25zb2xlLmxvZygn8J+TnSBQcmVwYXJpbmcgc291cmNlIGZpbGVzLi4uJyk7XG5cbiAgYXdhaXQgZnMucmVtb3ZlKExJQl9ST09UKTtcblxuICBjb25zdCBpbmRleFN0YXRlbWVudHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGxpYnJhcnkgb2YgbGlicmFyaWVzKSB7XG4gICAgY29uc3QgbGliRGlyID0gcGF0aC5qb2luKExJQl9ST09ULCBsaWJyYXJ5LnNob3J0TmFtZSk7XG4gICAgYXdhaXQgdHJhbnNmb3JtUGFja2FnZShsaWJyYXJ5LCBwYWNrYWdlSnNvbiwgbGliRGlyLCBsaWJyYXJpZXMpO1xuXG4gICAgaWYgKGxpYnJhcnkuc2hvcnROYW1lID09PSAnY29yZScpIHtcbiAgICAgIGluZGV4U3RhdGVtZW50cy5wdXNoKGBleHBvcnQgKiBmcm9tICcuLyR7bGlicmFyeS5zaG9ydE5hbWV9JztgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5kZXhTdGF0ZW1lbnRzLnB1c2goYGV4cG9ydCAqIGFzICR7bGlicmFyeS5zaG9ydE5hbWUucmVwbGFjZSgvLS9nLCAnXycpfSBmcm9tICcuLyR7bGlicmFyeS5zaG9ydE5hbWV9JztgKTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKExJQl9ST09ULCAnaW5kZXgudHMnKSwgaW5kZXhTdGF0ZW1lbnRzLmpvaW4oJ1xcbicpLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG5cbiAgY29uc29sZS5sb2coJ1xcdPCfjbogU3VjY2VzcyEnKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJhbnNmb3JtUGFja2FnZShcbiAgbGlicmFyeTogTGlicmFyeVJlZmVyZW5jZSxcbiAgdWJlclBhY2thZ2VKc29uOiBQYWNrYWdlSnNvbixcbiAgZGVzdGluYXRpb246IHN0cmluZyxcbiAgYWxsTGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10sXG4pIHtcbiAgYXdhaXQgZnMubWtkaXJwKGRlc3RpbmF0aW9uKTtcblxuICBhd2FpdCBjb3B5T3JUcmFuc2Zvcm1GaWxlcyhsaWJyYXJ5LnJvb3QsIGRlc3RpbmF0aW9uLCBhbGxMaWJyYXJpZXMsIHViZXJQYWNrYWdlSnNvbik7XG5cbiAgYXdhaXQgZnMud3JpdGVGaWxlKFxuICAgIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJ2luZGV4LnRzJyksXG4gICAgYGV4cG9ydCAqIGZyb20gJy4vJHtsaWJyYXJ5LnBhY2thZ2VKc29uLnR5cGVzLnJlcGxhY2UoLyhcXC9pbmRleCk/KFxcLmQpP1xcLnRzJC8sICcnKX0nO1xcbmAsXG4gICAgeyBlbmNvZGluZzogJ3V0ZjgnIH0sXG4gICk7XG5cbiAgaWYgKGxpYnJhcnkuc2hvcnROYW1lICE9PSAnY29yZScpIHtcbiAgICBjb25zdCBjb25maWcgPSB1YmVyUGFja2FnZUpzb24uanNpaS50YXJnZXRzO1xuICAgIGF3YWl0IGZzLndyaXRlSnNvbihcbiAgICAgIHBhdGguam9pbihkZXN0aW5hdGlvbiwgJy5qc2lpcmMuanNvbicpLFxuICAgICAge1xuICAgICAgICB0YXJnZXRzOiB0cmFuc2Zvcm1UYXJnZXRzKGNvbmZpZywgbGlicmFyeS5wYWNrYWdlSnNvbi5qc2lpLnRhcmdldHMpLFxuICAgICAgfSxcbiAgICAgIHsgc3BhY2VzOiAyIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IGZzLndyaXRlRmlsZShcbiAgICAgIHBhdGgucmVzb2x2ZShMSUJfUk9PVCwgJy4uJywgYCR7bGlicmFyeS5zaG9ydE5hbWV9LnRzYCksXG4gICAgICBgZXhwb3J0ICogZnJvbSAnLi9saWIvJHtsaWJyYXJ5LnNob3J0TmFtZX0nO1xcbmAsXG4gICAgICB7IGVuY29kaW5nOiAndXRmOCcgfSxcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVRhcmdldHMobW9ub0NvbmZpZzogUGFja2FnZUpzb25bJ2pzaWknXVsndGFyZ2V0cyddLCB0YXJnZXRzOiBQYWNrYWdlSnNvblsnanNpaSddWyd0YXJnZXRzJ10pOiBQYWNrYWdlSnNvblsnanNpaSddWyd0YXJnZXRzJ10ge1xuICBpZiAodGFyZ2V0cyA9PSBudWxsKSB7IHJldHVybiB0YXJnZXRzOyB9XG5cbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGZvciAoY29uc3QgW2xhbmd1YWdlLCBjb25maWddIG9mIE9iamVjdC5lbnRyaWVzKHRhcmdldHMpKSB7XG4gICAgc3dpdGNoIChsYW5ndWFnZSkge1xuICAgICAgY2FzZSAnZG90bmV0JzpcbiAgICAgICAgaWYgKG1vbm9Db25maWc/LmRvdG5ldCAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0W2xhbmd1YWdlXSA9IHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogKGNvbmZpZyBhcyBhbnkpLm5hbWVzcGFjZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnamF2YSc6XG4gICAgICAgIGlmIChtb25vQ29uZmlnPy5qYXZhICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRbbGFuZ3VhZ2VdID0ge1xuICAgICAgICAgICAgcGFja2FnZTogKGNvbmZpZyBhcyBhbnkpLnBhY2thZ2UsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3B5dGhvbic6XG4gICAgICAgIGlmIChtb25vQ29uZmlnPy5weXRob24gIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdFtsYW5ndWFnZV0gPSB7XG4gICAgICAgICAgICBtb2R1bGU6IGAke21vbm9Db25maWcucHl0aG9uLm1vZHVsZX0uJHsoY29uZmlnIGFzIGFueSkubW9kdWxlLnJlcGxhY2UoL15hd3NfY2RrXFwuLywgJycpfWAsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbGFuZ3VhZ2UgZm9yIHN1Ym1vZHVsZSBjb25maWd1cmF0aW9uIHRyYW5zbGF0aW9uOiAke2xhbmd1YWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvcHlPclRyYW5zZm9ybUZpbGVzKGZyb206IHN0cmluZywgdG86IHN0cmluZywgbGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10sIHViZXJQYWNrYWdlSnNvbjogUGFja2FnZUpzb24pIHtcbiAgY29uc3QgcHJvbWlzZXMgPSAoYXdhaXQgZnMucmVhZGRpcihmcm9tKSkubWFwKGFzeW5jIG5hbWUgPT4ge1xuICAgIGlmIChzaG91bGRJZ25vcmVGaWxlKG5hbWUpKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoJy5kLnRzJykgfHwgbmFtZS5lbmRzV2l0aCgnLmpzJykpIHtcbiAgICAgIGlmIChhd2FpdCBmcy5wYXRoRXhpc3RzKHBhdGguam9pbihmcm9tLCBuYW1lLnJlcGxhY2UoL1xcLihkXFwudHN8anMpJC8sICcudHMnKSkpKSB7XG4gICAgICAgIC8vIFdlIHdvbid0IGNvcHkgLmQudHMgYW5kIC5qcyBmaWxlcyB3aXRoIGEgY29ycmVzcG9uZGluZyAudHMgZmlsZVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlID0gcGF0aC5qb2luKGZyb20sIG5hbWUpO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gcGF0aC5qb2luKHRvLCBuYW1lKTtcblxuICAgIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KHNvdXJjZSk7XG4gICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgYXdhaXQgZnMubWtkaXJwKGRlc3RpbmF0aW9uKTtcbiAgICAgIHJldHVybiBjb3B5T3JUcmFuc2Zvcm1GaWxlcyhzb3VyY2UsIGRlc3RpbmF0aW9uLCBsaWJyYXJpZXMsIHViZXJQYWNrYWdlSnNvbik7XG4gICAgfVxuICAgIGlmIChuYW1lLmVuZHNXaXRoKCcudHMnKSkge1xuICAgICAgcmV0dXJuIGZzLndyaXRlRmlsZShcbiAgICAgICAgZGVzdGluYXRpb24sXG4gICAgICAgIGF3YWl0IHJld3JpdGVJbXBvcnRzKHNvdXJjZSwgdG8sIGxpYnJhcmllcyksXG4gICAgICAgIHsgZW5jb2Rpbmc6ICd1dGY4JyB9LFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdjZm4tdHlwZXMtMi1jbGFzc2VzLmpzb24nKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgc3BlY2lhbCBmaWxlIHVzZWQgYnkgdGhlIGNsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlIHRoYXQgY29udGFpbnMgbWFwcGluZ3NcbiAgICAgIC8vIG9mIENGTiByZXNvdXJjZSB0eXBlcyB0byB0aGUgZnVsbHktcXVhbGlmaWVkIGNsYXNzIG5hbWVzIG9mIHRoZSBDREsgTDEgY2xhc3Nlcy5cbiAgICAgIC8vIFdlIG5lZWQgdG8gcmV3cml0ZSBpdCB0byByZWZlciB0byB0aGUgdWJlcnBhY2thZ2UgaW5zdGVhZCBvZiB0aGUgaW5kaXZpZHVhbCBwYWNrYWdlc1xuICAgICAgY29uc3QgY2ZuVHlwZXMyQ2xhc3NlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IGF3YWl0IGZzLnJlYWRKc29uKHNvdXJjZSk7XG4gICAgICBmb3IgKGNvbnN0IGNmblR5cGUgb2YgT2JqZWN0LmtleXMoY2ZuVHlwZXMyQ2xhc3NlcykpIHtcbiAgICAgICAgY29uc3QgZnFuID0gY2ZuVHlwZXMyQ2xhc3Nlc1tjZm5UeXBlXTtcbiAgICAgICAgLy8gcmVwbGFjZSBAYXdzLWNkay9hd3MtPHNlcnZpY2U+IHdpdGggPHViZXItcGFja2FnZS1uYW1lPi9hd3MtPHNlcnZpY2U+LFxuICAgICAgICAvLyBleGNlcHQgZm9yIEBhd3MtY2RrL2NvcmUsIHdoaWNoIG1hcHMganVzdCB0byB0aGUgbmFtZSBvZiB0aGUgdWJlcnBhY2thZ2VcbiAgICAgICAgY2ZuVHlwZXMyQ2xhc3Nlc1tjZm5UeXBlXSA9IGZxbi5zdGFydHNXaXRoKCdAYXdzLWNkay9jb3JlLicpXG4gICAgICAgICAgPyBmcW4ucmVwbGFjZSgnQGF3cy1jZGsvY29yZScsIHViZXJQYWNrYWdlSnNvbi5uYW1lKVxuICAgICAgICAgIDogZnFuLnJlcGxhY2UoJ0Bhd3MtY2RrJywgdWJlclBhY2thZ2VKc29uLm5hbWUpO1xuICAgICAgfVxuICAgICAgYXdhaXQgZnMud3JpdGVKc29uKGRlc3RpbmF0aW9uLCBjZm5UeXBlczJDbGFzc2VzLCB7IHNwYWNlczogMiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZzLmNvcHlGaWxlKHNvdXJjZSwgZGVzdGluYXRpb24pO1xuICAgIH1cbiAgfSk7XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXdyaXRlSW1wb3J0cyhmcm9tRmlsZTogc3RyaW5nLCB0YXJnZXREaXI6IHN0cmluZywgbGlicmFyaWVzOiByZWFkb25seSBMaWJyYXJ5UmVmZXJlbmNlW10pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICBmcm9tRmlsZSxcbiAgICBhd2FpdCBmcy5yZWFkRmlsZShmcm9tRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pLFxuICAgIHRzLlNjcmlwdFRhcmdldC5FUzIwMTgsXG4gICAgdHJ1ZSxcbiAgICB0cy5TY3JpcHRLaW5kLlRTLFxuICApO1xuXG4gIGNvbnN0IHRyYW5zZm9ybVJlc3VsdCA9IHRzLnRyYW5zZm9ybShzb3VyY2VGaWxlLCBbaW1wb3J0UmV3cml0ZXJdKTtcbiAgY29uc3QgdHJhbnNmb3JtZWRTb3VyY2UgPSB0cmFuc2Zvcm1SZXN1bHQudHJhbnNmb3JtZWRbMF0gYXMgdHMuU291cmNlRmlsZTtcblxuICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICByZXR1cm4gcHJpbnRlci5wcmludEZpbGUodHJhbnNmb3JtZWRTb3VyY2UpO1xuXG4gIGZ1bmN0aW9uIGltcG9ydFJld3JpdGVyKGN0eDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KSB7XG4gICAgZnVuY3Rpb24gdmlzaXRvcihub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSB7XG4gICAgICBpZiAodHMuaXNFeHRlcm5hbE1vZHVsZVJlZmVyZW5jZShub2RlKSAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5leHByZXNzaW9uKSkge1xuICAgICAgICBjb25zdCBuZXdUYXJnZXQgPSByZXdyaXR0ZW5JbXBvcnQobm9kZS5leHByZXNzaW9uLnRleHQpO1xuICAgICAgICBpZiAobmV3VGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWRkUmV3cml0dGVuTm90ZShcbiAgICAgICAgICAgIHRzLnVwZGF0ZUV4dGVybmFsTW9kdWxlUmVmZXJlbmNlKG5vZGUsIG5ld1RhcmdldCksXG4gICAgICAgICAgICBub2RlLmV4cHJlc3Npb24sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgICAgY29uc3QgbmV3VGFyZ2V0ID0gcmV3cml0dGVuSW1wb3J0KG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQpO1xuICAgICAgICBpZiAobmV3VGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWRkUmV3cml0dGVuTm90ZShcbiAgICAgICAgICAgIHRzLnVwZGF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBub2RlLmRlY29yYXRvcnMsXG4gICAgICAgICAgICAgIG5vZGUubW9kaWZpZXJzLFxuICAgICAgICAgICAgICBub2RlLmltcG9ydENsYXVzZSxcbiAgICAgICAgICAgICAgbmV3VGFyZ2V0LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjdHgpO1xuICAgIH1cbiAgICByZXR1cm4gdmlzaXRvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFJld3JpdHRlbk5vdGUobm9kZTogdHMuTm9kZSwgb3JpZ2luYWw6IHRzLlN0cmluZ0xpdGVyYWwpOiB0cy5Ob2RlIHtcbiAgICByZXR1cm4gdHMuYWRkU3ludGhldGljVHJhaWxpbmdDb21tZW50KFxuICAgICAgbm9kZSxcbiAgICAgIHRzLlN5bnRheEtpbmQuU2luZ2xlTGluZUNvbW1lbnRUcml2aWEsXG4gICAgICBgIEF1dG9tYXRpY2FsbHkgcmUtd3JpdHRlbiBmcm9tICR7b3JpZ2luYWwuZ2V0VGV4dCgpfWAsXG4gICAgICBmYWxzZSwgLy8gaGFzVHJhaWxpbmdOZXdsaW5lXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJld3JpdHRlbkltcG9ydChtb2R1bGVTcGVjaWZpZXI6IHN0cmluZyk6IHRzLlN0cmluZ0xpdGVyYWwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHNvdXJjZUxpYnJhcnkgPSBsaWJyYXJpZXMuZmluZChcbiAgICAgIGxpYiA9PlxuICAgICAgICBtb2R1bGVTcGVjaWZpZXIgPT09IGxpYi5wYWNrYWdlSnNvbi5uYW1lIHx8XG4gICAgICAgIG1vZHVsZVNwZWNpZmllci5zdGFydHNXaXRoKGAke2xpYi5wYWNrYWdlSnNvbi5uYW1lfS9gKSxcbiAgICApO1xuICAgIGlmIChzb3VyY2VMaWJyYXJ5ID09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgY29uc3QgaW1wb3J0ZWRGaWxlID0gbW9kdWxlU3BlY2lmaWVyID09PSBzb3VyY2VMaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWVcbiAgICAgID8gcGF0aC5qb2luKExJQl9ST09ULCBzb3VyY2VMaWJyYXJ5LnNob3J0TmFtZSlcbiAgICAgIDogcGF0aC5qb2luKExJQl9ST09ULCBzb3VyY2VMaWJyYXJ5LnNob3J0TmFtZSwgbW9kdWxlU3BlY2lmaWVyLnN1YnN0cihzb3VyY2VMaWJyYXJ5LnBhY2thZ2VKc29uLm5hbWUubGVuZ3RoICsgMSkpO1xuICAgIHJldHVybiB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKFxuICAgICAgcGF0aC5yZWxhdGl2ZSh0YXJnZXREaXIsIGltcG9ydGVkRmlsZSksXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBJR05PUkVEX0ZJTEVfTkFNRVMgPSBuZXcgU2V0KFtcbiAgJy5lc2xpbnRyYy5qcycsXG4gICcuZ2l0aWdub3JlJyxcbiAgJy5qZXN0LmNvbmZpZy5qcycsXG4gICcuanNpaScsXG4gICcubnBtaWdub3JlJyxcbiAgJ25vZGVfbW9kdWxlcycsXG4gICdwYWNrYWdlLmpzb24nLFxuICAndGVzdCcsXG4gICd0c2NvbmZpZy5qc29uJyxcbiAgJ3RzY29uZmlnLnRzYnVpbGRpbmZvJyxcbiAgJ0xJQ0VOU0UnLFxuICAnTk9USUNFJyxcbl0pO1xuZnVuY3Rpb24gc2hvdWxkSWdub3JlRmlsZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIElHTk9SRURfRklMRV9OQU1FUy5oYXMobmFtZSk7XG59XG5cbmZ1bmN0aW9uIHNvcnRPYmplY3Q8VD4ob2JqOiBSZWNvcmQ8c3RyaW5nLCBUPik6IFJlY29yZDxzdHJpbmcsIFQ+IHtcbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBUPiA9IHt9O1xuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikuc29ydCgobCwgcikgPT4gbFswXS5sb2NhbGVDb21wYXJlKHJbMF0pKSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19