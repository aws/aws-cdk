"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInnerPackages = exports.monoRepoRoot = exports.findUpward = exports.deepSet = exports.deepGet = exports.isObject = exports.expectDevDependency = exports.fileShouldBeginWith = exports.fileShouldBe = exports.fileShouldNotContain = exports.fileShouldContain = exports.expectJSON = void 0;
const fs = require("fs");
const path = require("path");
const packagejson_1 = require("./packagejson");
/**
 * Expect a particular JSON key to be a given value
 */
function expectJSON(ruleName, pkg, jsonPath, expected, ignore, caseInsensitive = false) {
    const parts = jsonPath.split('.');
    const actual = deepGet(pkg.json, parts);
    if (applyCaseInsensitive(applyIgnore(actual)) !== applyCaseInsensitive(applyIgnore(expected))) {
        pkg.report({
            ruleName,
            message: `${jsonPath} should be ${JSON.stringify(expected)}${ignore ? ` (ignoring ${ignore})` : ''}, is ${JSON.stringify(actual)}`,
            fix: () => { deepSet(pkg.json, parts, expected); },
        });
    }
    function applyIgnore(val) {
        if (!ignore || val == null) {
            return JSON.stringify(val);
        }
        const str = JSON.stringify(val);
        return str.replace(ignore, '');
    }
    function applyCaseInsensitive(val) {
        if (!caseInsensitive || val == null) {
            return JSON.stringify(val);
        }
        const str = JSON.stringify(val);
        return str.toLowerCase();
    }
}
exports.expectJSON = expectJSON;
/**
 * Export a package-level file to contain a given line
 */
function fileShouldContain(ruleName, pkg, fileName, ...lines) {
    for (const line of lines) {
        const doesContain = pkg.fileContainsSync(fileName, line);
        if (!doesContain) {
            pkg.report({
                ruleName,
                message: `${fileName} should contain '${line}'`,
                fix: () => pkg.addToFileSync(fileName, line),
            });
        }
    }
}
exports.fileShouldContain = fileShouldContain;
function fileShouldNotContain(ruleName, pkg, fileName, ...lines) {
    for (const line of lines) {
        const doesContain = pkg.fileContainsSync(fileName, line);
        if (doesContain) {
            pkg.report({
                ruleName,
                message: `${fileName} should NOT contain '${line}'`,
                fix: () => pkg.removeFromFileSync(fileName, line),
            });
        }
    }
}
exports.fileShouldNotContain = fileShouldNotContain;
/**
 * Export a package-level file to contain specific content
 */
function fileShouldBe(ruleName, pkg, fileName, content) {
    const isContent = pkg.fileIsSync(fileName, content);
    if (!isContent) {
        pkg.report({
            ruleName,
            message: `${fileName} should contain exactly '${content}'`,
            fix: () => pkg.writeFileSync(fileName, content),
        });
    }
}
exports.fileShouldBe = fileShouldBe;
/**
 * Export a package-level file to contain specific content
 */
function fileShouldBeginWith(ruleName, pkg, fileName, ...lines) {
    const isContent = pkg.fileBeginsWith(fileName, ...lines);
    if (!isContent) {
        pkg.report({
            ruleName,
            message: `${fileName} does NOT begin with ${lines}'`,
        });
    }
}
exports.fileShouldBeginWith = fileShouldBeginWith;
/**
 * Enforce a dev dependency
 */
function expectDevDependency(ruleName, pkg, packageName, version) {
    const actualVersion = pkg.getDevDependency(packageName);
    if (version !== actualVersion) {
        pkg.report({
            ruleName,
            message: `Missing devDependency: ${packageName} @ ${version}`,
            fix: () => pkg.addDevDependency(packageName, version),
        });
    }
}
exports.expectDevDependency = expectDevDependency;
/**
 * Return whether the given value is an object
 *
 * Even though arrays technically are objects, we usually want to treat them differently,
 * so we return false in those cases.
 */
function isObject(x) {
    return x !== null && typeof x === 'object' && !Array.isArray(x);
}
exports.isObject = isObject;
/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
function deepGet(x, jsonPath) {
    jsonPath = jsonPath.slice();
    while (jsonPath.length > 0 && isObject(x)) {
        const key = jsonPath.shift();
        x = x[key];
    }
    return jsonPath.length === 0 ? x : undefined;
}
exports.deepGet = deepGet;
/**
 * Deep set a value in a tree of nested objects
 *
 * Throws an error if any part of the path is not an object.
 */
function deepSet(x, jsonPath, value) {
    jsonPath = jsonPath.slice();
    if (jsonPath.length === 0) {
        throw new Error('Path may not be empty');
    }
    while (jsonPath.length > 1 && isObject(x)) {
        const key = jsonPath.shift();
        if (!(key in x)) {
            x[key] = {};
        }
        x = x[key];
    }
    if (!isObject(x)) {
        throw new Error(`Expected an object, got '${x}'`);
    }
    x[jsonPath[0]] = value;
}
exports.deepSet = deepSet;
function findUpward(dir, pred) {
    while (true) {
        if (pred(dir)) {
            return dir;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            return undefined;
        }
        dir = parent;
    }
}
exports.findUpward = findUpward;
function monoRepoRoot() {
    const ret = findUpward(process.cwd(), d => fs.existsSync(path.join(d, 'lerna.json')));
    if (!ret) {
        throw new Error('Could not find lerna.json');
    }
    return ret;
}
exports.monoRepoRoot = monoRepoRoot;
function* findInnerPackages(dir) {
    for (const fname of fs.readdirSync(dir, { encoding: 'utf8' })) {
        try {
            const stat = fs.statSync(path.join(dir, fname));
            if (!stat.isDirectory()) {
                continue;
            }
        }
        catch (e) {
            // Survive invalid symlinks
            if (e.code !== 'ENOENT') {
                throw e;
            }
            continue;
        }
        if (packagejson_1.PKGLINT_IGNORES.includes(fname)) {
            continue;
        }
        if (fs.existsSync(path.join(dir, fname, 'package.json'))) {
            yield path.join(dir, fname);
        }
        yield* findInnerPackages(path.join(dir, fname));
    }
}
exports.findInnerPackages = findInnerPackages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwrQ0FBNkQ7QUFFN0Q7O0dBRUc7QUFDSCxTQUFnQixVQUFVLENBQUMsUUFBZ0IsRUFBRSxHQUFnQixFQUFFLFFBQWdCLEVBQUUsUUFBYSxFQUFFLE1BQWUsRUFBRSxrQkFBMkIsS0FBSztJQUMvSSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksb0JBQW9CLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssb0JBQW9CLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDN0YsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNULFFBQVE7WUFDUixPQUFPLEVBQUUsR0FBRyxRQUFRLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25ELENBQUMsQ0FBQztLQUNKO0lBRUQsU0FBUyxXQUFXLENBQUMsR0FBUTtRQUMzQixJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtRQUMzRCxNQUFNLEdBQUcsR0FB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