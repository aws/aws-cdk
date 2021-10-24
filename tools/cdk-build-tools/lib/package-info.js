"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configFilePath = exports.genScript = exports.packageCompiler = exports.hasIntegTests = exports.unitTestFiles = exports.listFiles = exports.isJsii = exports.cdkBuildOptions = exports.currentPackageJson = void 0;
const fs = require("fs");
const path = require("path");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
/**
 * Return the package JSON for the current package
 */
function currentPackageJson() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path.join(process.cwd(), 'package.json'));
}
exports.currentPackageJson = currentPackageJson;
/**
 * Return the CDK build options
 */
function cdkBuildOptions() {
    // These could have been in a separate cdk-build.json but for
    // now it's easiest to just read them from the package JSON.
    // Our package directories are littered with .json files enough
    // already.
    return currentPackageJson()['cdk-build'] || {};
}
exports.cdkBuildOptions = cdkBuildOptions;
/**
 * Whether this is a jsii package
 */
function isJsii() {
    return currentPackageJson().jsii !== undefined;
}
exports.isJsii = isJsii;
async function listFiles(dirName, predicate) {
    try {
        const files = (await readdir(dirName)).map(filename => ({ filename, path: path.join(dirName, filename) }));
        const ret = [];
        for (const file of files) {
            const s = await stat(file.path);
            if (s.isDirectory()) {
                // Recurse
                ret.push(...await listFiles(file.path, predicate));
            }
            else {
                if (predicate(file)) {
                    ret.push(file);
                }
            }
        }
        return ret;
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            return [];
        }
        throw e;
    }
}
exports.listFiles = listFiles;
/**
 * Return the unit test files for this package
 */
async function unitTestFiles() {
    return listFiles('test', f => f.filename.startsWith('test.') && f.filename.endsWith('.js'));
}
exports.unitTestFiles = unitTestFiles;
async function hasIntegTests() {
    const files = await listFiles('test', f => f.filename.startsWith('integ.') && f.filename.endsWith('.js'));
    return files.length > 0;
}
exports.hasIntegTests = hasIntegTests;
/**
 * Return the compiler for this package (either tsc or jsii)
 */
function packageCompiler(compilers) {
    if (isJsii()) {
        return [compilers.jsii || require.resolve('jsii/bin/jsii'), '--silence-warnings=reserved-word'];
    }
    else {
        return [compilers.tsc || require.resolve('typescript/bin/tsc'), '--build'];
    }
}
exports.packageCompiler = packageCompiler;
/**
 * Return the command defined in scripts.gen if exists
 */
function genScript() {
    var _a;
    return (_a = currentPackageJson().scripts) === null || _a === void 0 ? void 0 : _a.gen;
}
exports.genScript = genScript;
/**
 * Return a full path to the config file in this package
 *
 * The addressed file is cdk-build-tools/config/FILE.
 */
function configFilePath(fileName) {
    return path.resolve(__dirname, '..', 'config', fileName);
}
exports.configFilePath = configFilePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFja2FnZS1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBRTdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXJDOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCO0lBQ2hDLGlFQUFpRTtJQUNqRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFIRCxnREFHQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZUFBZTtJQUM3Qiw2REFBNkQ7SUFDN0QsNERBQTREO0lBQzVELCtEQUErRDtJQUMvRCxXQUFXO0lBQ1gsT0FBTyxrQkFBa0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRCxDQUFDO0FBTkQsMENBTUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLE1BQU07SUFDcEIsT0FBTyxrQkFBa0IsRUFBRSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUM7QUFDakQsQ0FBQztBQUZELHdCQUVDO0FBT00sS0FBSyxVQUFVLFNBQVMsQ0FBQyxPQUFlLEVBQUUsU0FBK0I7SUFDOUUsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRyxNQUFNLEdBQUcsR0FBVyxFQUFFLENBQUM7UUFDdkIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDeEIsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUNuQixVQUFVO2dCQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDcEQ7aUJBQU07Z0JBQ0wsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hCO2FBQ0Y7U0FDRjtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFBRSxPQUFPLEVBQUUsQ0FBQztTQUFFO1FBQ3ZDLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBdEJELDhCQXNCQztBQUVEOztHQUVHO0FBQ0ksS0FBSyxVQUFVLGFBQWE7SUFDakMsT0FBTyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRkQsc0NBRUM7QUFFTSxLQUFLLFVBQVUsYUFBYTtJQUNqQyxNQUFNLEtBQUssR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFHLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUhELHNDQUdDO0FBUUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlLENBQUMsU0FBNEI7SUFDMUQsSUFBSSxNQUFNLEVBQUUsRUFBRTtRQUNaLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztLQUNqRztTQUFNO1FBQ0wsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzVFO0FBQ0gsQ0FBQztBQU5ELDBDQU1DO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixTQUFTOztJQUN2QixhQUFPLGtCQUFrQixFQUFFLENBQUMsT0FBTywwQ0FBRSxHQUFHLENBQUM7QUFDM0MsQ0FBQztBQUZELDhCQUVDO0FBd0REOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsUUFBZ0I7SUFDN0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFGRCx3Q0FFQyJ9