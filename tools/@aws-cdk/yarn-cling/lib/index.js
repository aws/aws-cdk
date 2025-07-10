"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShrinkwrap = generateShrinkwrap;
exports.formatPackageLock = formatPackageLock;
exports.checkRequiredVersions = checkRequiredVersions;
const fs_1 = require("fs");
const path = require("path");
const lockfile = require("@yarnpkg/lockfile");
const semver = require("semver");
const hoisting_1 = require("./hoisting");
async function generateShrinkwrap(options) {
    // No args (yet)
    const packageJsonFile = options.packageJsonFile;
    const packageJsonDir = path.dirname(packageJsonFile);
    const yarnLockLoc = await findYarnLock(packageJsonDir);
    const yarnLock = lockfile.parse(await fs_1.promises.readFile(yarnLockLoc, { encoding: 'utf8' }));
    const pkgJson = await loadPackageJson(packageJsonFile);
    const lock = await generateLockFile(pkgJson, yarnLock, packageJsonDir);
    if (options.hoist ?? true) {
        (0, hoisting_1.hoistDependencies)({ version: '*', dependencies: lock.dependencies });
    }
    validateTree(lock);
    if (options.outputFile) {
        // Write the shrinkwrap file
        await fs_1.promises.writeFile(options.outputFile, JSON.stringify(lock, undefined, 2), { encoding: 'utf8' });
    }
    return lock;
}
async function generateLockFile(pkgJson, yarnLock, rootDir) {
    const lockFile = {
        name: pkgJson.name,
        version: pkgJson.version,
        lockfileVersion: 1,
        requires: true,
        dependencies: await dependenciesFor(pkgJson.dependencies || {}, yarnLock, rootDir, [pkgJson.name]),
    };
    checkRequiredVersions(lockFile);
    return lockFile;
}
const CYCLES_REPORTED = new Set();
// eslint-disable-next-line max-len
async function dependenciesFor(deps, yarnLock, rootDir, dependencyPath) {
    const ret = {};
    // Get rid of any monorepo symlinks
    rootDir = await fs_1.promises.realpath(rootDir);
    for (const [depName, versionRange] of Object.entries(deps)) {
        if (dependencyPath.includes(depName)) {
            const index = dependencyPath.indexOf(depName);
            const beforeCycle = dependencyPath.slice(0, index);
            const inCycle = [...dependencyPath.slice(index), depName];
            const cycleString = inCycle.join(' => ');
            if (!CYCLES_REPORTED.has(cycleString)) {
                // eslint-disable-next-line no-console
                console.warn(`Dependency cycle: ${beforeCycle.join(' => ')} => [ ${cycleString} ]. Dropping dependency '${inCycle.slice(-2).join(' => ')}'.`);
                CYCLES_REPORTED.add(cycleString);
            }
            continue;
        }
        const depDir = await findPackageDir(depName, rootDir);
        const depPkgJsonFile = path.join(depDir, 'package.json');
        const depPkgJson = await loadPackageJson(depPkgJsonFile);
        const yarnKey = `${depName}@${versionRange}`;
        // Sanity check
        if (depPkgJson.name !== depName) {
            throw new Error(`Looking for '${depName}' from ${rootDir}, but found '${depPkgJson.name}' in ${depDir}`);
        }
        const yarnResolved = yarnLock.object[yarnKey];
        if (yarnResolved) {
            // Resolved by Yarn
            ret[depName] = {
                version: yarnResolved.version,
                integrity: yarnResolved.integrity,
                resolved: yarnResolved.resolved,
                requires: depPkgJson.dependencies,
                dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir, [...dependencyPath, depName]),
            };
        }
        else {
            // Comes from monorepo, just use whatever's in package.json
            ret[depName] = {
                version: depPkgJson.version,
                requires: depPkgJson.dependencies,
                dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir, [...dependencyPath, depName]),
            };
        }
        // Simplify by removing useless entries
        if (Object.keys(ret[depName].requires ?? {}).length === 0) {
            delete ret[depName].requires;
        }
        if (Object.keys(ret[depName].dependencies ?? {}).length === 0) {
            delete ret[depName].dependencies;
        }
    }
    return ret;
}
async function findYarnLock(start) {
    return findUp('yarn.lock', start);
}
async function findUp(fileName, start) {
    start = path.resolve(start);
    let dir = start;
    const yarnLockHere = () => path.join(dir, fileName);
    while (!await fileExists(yarnLockHere())) {
        const parent = path.dirname(dir);
        if (parent === dir) {
            throw new Error(`No ${fileName} found upwards from ${start}`);
        }
        dir = parent;
    }
    return yarnLockHere();
}
async function loadPackageJson(fileName) {
    return JSON.parse(await fs_1.promises.readFile(fileName, { encoding: 'utf8' }));
}
async function fileExists(fullPath) {
    try {
        await fs_1.promises.stat(fullPath);
        return true;
    }
    catch (e) {
        if (e.code === 'ENOENT' || e.code === 'ENOTDIR') {
            return false;
        }
        throw e;
    }
}
function formatPackageLock(entry) {
    const lines = new Array();
    recurse([], entry);
    return lines.join('\n');
    function recurse(names, thisEntry) {
        if (names.length > 0) {
            // eslint-disable-next-line no-console
            lines.push(`${names.join(' -> ')} @ ${thisEntry.version}`);
        }
        for (const [depName, depEntry] of Object.entries(thisEntry.dependencies || {})) {
            recurse([...names, depName], depEntry);
        }
    }
}
/**
 * Find package directory
 *
 * Do this by walking upwards in the directory tree until we find
 * `<dir>/node_modules/<package>/package.json`.
 *
 * -------
 *
 * Things that we tried but don't work:
 *
 * 1.    require.resolve(`${depName}/package.json`, { paths: [rootDir] });
 *
 * Breaks with ES Modules if `package.json` has not been exported, which is
 * being enforced starting Node >= 12.
 *
 * 2.    findPackageJsonUpwardFrom(require.resolve(depName, { paths: [rootDir] }))
 *
 * Breaks if a built-in NodeJS package name conflicts with an NPM package name
 * (in Node15 `string_decoder` is introduced...)
 */
async function findPackageDir(depName, rootDir) {
    let prevDir;
    let dir = rootDir;
    while (dir !== prevDir) {
        const candidateDir = path.join(dir, 'node_modules', depName);
        if (await new Promise(ok => (0, fs_1.exists)(path.join(candidateDir, 'package.json'), ok))) {
            return candidateDir;
        }
        prevDir = dir;
        dir = path.dirname(dir); // dirname('/') -> '/', dirname('c:\\') -> 'c:\\'
    }
    throw new Error(`Did not find '${depName}' upwards of '${rootDir}'`);
}
/**
 * We may sometimes try to adjust a package version to a version that's incompatible with the declared requirement.
 *
 * For example, this recently happened for 'netmask', where the package we
 * depend on has `{ requires: { netmask: '^1.0.6', } }`, but we need to force-substitute in version `2.0.1`.
 *
 * If NPM processes the shrinkwrap and encounters the following situation:
 *
 * ```
 * {
 *   netmask: { version: '2.0.1' },
 *   resolver: {
 *     requires: {
 *       netmask: '^1.0.6'
 *     }
 *   }
 * }
 * ```
 *
 * NPM is going to disregard the swhinkrwap and still give `resolver` its own private
 * copy of netmask `^1.0.6`.
 *
 * We tried overriding the `requires` version, and that works for `npm install` (yay)
 * but if anyone runs `npm ls` afterwards, `npm ls` is going to check the actual source
 * `package.jsons` against the actual `node_modules` file tree, and complain that the
 * versions don't match.
 *
 * We run `npm ls` in our tests to make sure our dependency tree is sane, and our customers
 * might too, so this is not a great solution.
 *
 * To cut any discussion short in the future, we're going to detect this situation and
 * tell our future selves that is cannot and will not work, and we should find another
 * solution.
 */
function checkRequiredVersions(root) {
    recurse(root, []);
    function recurse(entry, parentChain) {
        // On the root, 'requires' is the value 'true', for God knows what reason. Don't care about those.
        if (typeof entry.requires === 'object') {
            // For every 'requires' dependency, find the version it actually got resolved to and compare.
            for (const [name, range] of Object.entries(entry.requires)) {
                const resolvedPackage = findResolved(name, [entry, ...parentChain]);
                if (!resolvedPackage) {
                    continue;
                }
                if (!semver.satisfies(resolvedPackage.version, range)) {
                    // Ruh-roh.
                    throw new Error(`Looks like we're trying to force '${name}' to version '${resolvedPackage.version}', but the dependency `
                        + `is specified as '${range}'. This can never properly work via shrinkwrapping. Try vendoring a patched `
                        + 'version of the intermediary dependencies instead.');
                }
            }
        }
        for (const dep of Object.values(entry.dependencies ?? {})) {
            recurse(dep, [entry, ...parentChain]);
        }
    }
    /**
     * Find a package name in a package lock tree.
     */
    function findResolved(name, chain) {
        for (const level of chain) {
            if (level.dependencies?.[name]) {
                return level.dependencies?.[name];
            }
        }
        return undefined;
    }
}
/**
 * Check that all packages still resolve their dependencies to the right versions
 *
 * We have manipulated the tree a bunch. Do a sanity check to ensure that all declared
 * dependencies are satisfied.
 */
function validateTree(lock) {
    let failed = false;
    recurse(lock, [lock]);
    if (failed) {
        throw new Error('Could not satisfy one or more dependencies');
    }
    function recurse(pkg, rootPath) {
        for (const pack of Object.values(pkg.dependencies ?? {})) {
            const p = [pack, ...rootPath];
            checkRequiresOf(pack, p);
            recurse(pack, p);
        }
    }
    // rootPath: most specific one first
    function checkRequiresOf(pack, rootPath) {
        for (const [name, declaredRange] of Object.entries(pack.requires ?? {})) {
            const foundVersion = rootPath.map((p) => p.dependencies?.[name]?.version).find(isDefined);
            if (!foundVersion) {
                // eslint-disable-next-line no-console
                console.error(`Dependency on ${name} not satisfied: not found`);
                failed = true;
            }
            else if (!semver.satisfies(foundVersion, declaredRange)) {
                // eslint-disable-next-line no-console
                console.error(`Dependency on ${name} not satisfied: declared range '${declaredRange}', found '${foundVersion}'`);
                failed = true;
            }
        }
    }
}
function isDefined(x) {
    return x !== undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTRCQSxnREF1QkM7QUE2R0QsOENBY0M7QUF3RUQsc0RBcUNDO0FBM1JELDJCQUE0QztBQUM1Qyw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLGlDQUFpQztBQUNqQyx5Q0FBK0M7QUF3QnhDLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUEwQjtJQUNqRSxnQkFBZ0I7SUFDaEIsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztJQUNoRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sV0FBVyxHQUFHLE1BQU0sWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFhLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxhQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEcsTUFBTSxPQUFPLEdBQUcsTUFBTSxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFdkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRXZFLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUMxQixJQUFBLDRCQUFpQixFQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVuQixJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2Qiw0QkFBNEI7UUFDNUIsTUFBTSxhQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxV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SCxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBSSxDQUFJO0lBQ3hCLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUN6QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMsIGV4aXN0cyB9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsb2NrZmlsZSBmcm9tICdAeWFybnBrZy9sb2NrZmlsZSc7XG5pbXBvcnQgKiBhcyBzZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCB7IGhvaXN0RGVwZW5kZW5jaWVzIH0gZnJvbSAnLi9ob2lzdGluZyc7XG5pbXBvcnQgeyBQYWNrYWdlSnNvbiwgUGFja2FnZUxvY2ssIFBhY2thZ2VMb2NrRW50cnksIFBhY2thZ2VMb2NrUGFja2FnZSwgWWFybkxvY2sgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBTaHJpbmt3cmFwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGFja2FnZS5qc29uIGZpbGUgdG8gc3RhcnQgc2Nhbm5pbmcgZm9yIGRlcGVuZGVuY2llc1xuICAgKi9cbiAgcGFja2FnZUpzb25GaWxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRwdXQgbG9ja2ZpbGUgdG8gZ2VuZXJhdGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEb24ndCBnZW5lcmF0ZSB0aGUgZmlsZSwganVzdCByZXR1cm4gdGhlIGNhbGN1bGF0ZWQgb3V0cHV0XG4gICAqL1xuICBvdXRwdXRGaWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGhvaXN0IGRlcGVuZGVuY2llc1xuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBob2lzdD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVNocmlua3dyYXAob3B0aW9uczogU2hyaW5rd3JhcE9wdGlvbnMpOiBQcm9taXNlPFBhY2thZ2VMb2NrPiB7XG4gIC8vIE5vIGFyZ3MgKHlldClcbiAgY29uc3QgcGFja2FnZUpzb25GaWxlID0gb3B0aW9ucy5wYWNrYWdlSnNvbkZpbGU7XG4gIGNvbnN0IHBhY2thZ2VKc29uRGlyID0gcGF0aC5kaXJuYW1lKHBhY2thZ2VKc29uRmlsZSk7XG5cbiAgY29uc3QgeWFybkxvY2tMb2MgPSBhd2FpdCBmaW5kWWFybkxvY2socGFja2FnZUpzb25EaXIpO1xuICBjb25zdCB5YXJuTG9jazogWWFybkxvY2sgPSBsb2NrZmlsZS5wYXJzZShhd2FpdCBmcy5yZWFkRmlsZSh5YXJuTG9ja0xvYywgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgY29uc3QgcGtnSnNvbiA9IGF3YWl0IGxvYWRQYWNrYWdlSnNvbihwYWNrYWdlSnNvbkZpbGUpO1xuXG4gIGNvbnN0IGxvY2sgPSBhd2FpdCBnZW5lcmF0ZUxvY2tGaWxlKHBrZ0pzb24sIHlhcm5Mb2NrLCBwYWNrYWdlSnNvbkRpcik7XG5cbiAgaWYgKG9wdGlvbnMuaG9pc3QgPz8gdHJ1ZSkge1xuICAgIGhvaXN0RGVwZW5kZW5jaWVzKHsgdmVyc2lvbjogJyonLCBkZXBlbmRlbmNpZXM6IGxvY2suZGVwZW5kZW5jaWVzIH0pO1xuICB9XG5cbiAgdmFsaWRhdGVUcmVlKGxvY2spO1xuXG4gIGlmIChvcHRpb25zLm91dHB1dEZpbGUpIHtcbiAgICAvLyBXcml0ZSB0aGUgc2hyaW5rd3JhcCBmaWxlXG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKG9wdGlvbnMub3V0cHV0RmlsZSwgSlNPTi5zdHJpbmdpZnkobG9jaywgdW5kZWZpbmVkLCAyKSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxvY2s7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlTG9ja0ZpbGUocGtnSnNvbjogUGFja2FnZUpzb24sIHlhcm5Mb2NrOiBZYXJuTG9jaywgcm9vdERpcjogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlTG9jaz4ge1xuICBjb25zdCBsb2NrRmlsZSA9IHtcbiAgICBuYW1lOiBwa2dKc29uLm5hbWUsXG4gICAgdmVyc2lvbjogcGtnSnNvbi52ZXJzaW9uLFxuICAgIGxvY2tmaWxlVmVyc2lvbjogMSxcbiAgICByZXF1aXJlczogdHJ1ZSxcbiAgICBkZXBlbmRlbmNpZXM6IGF3YWl0IGRlcGVuZGVuY2llc0Zvcihwa2dKc29uLmRlcGVuZGVuY2llcyB8fCB7fSwgeWFybkxvY2ssIHJvb3REaXIsIFtwa2dKc29uLm5hbWVdKSxcbiAgfTtcblxuICBjaGVja1JlcXVpcmVkVmVyc2lvbnMobG9ja0ZpbGUpO1xuXG4gIHJldHVybiBsb2NrRmlsZTtcbn1cblxuY29uc3QgQ1lDTEVTX1JFUE9SVEVEID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG5hc3luYyBmdW5jdGlvbiBkZXBlbmRlbmNpZXNGb3IoZGVwczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgeWFybkxvY2s6IFlhcm5Mb2NrLCByb290RGlyOiBzdHJpbmcsIGRlcGVuZGVuY3lQYXRoOiBzdHJpbmdbXSk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgUGFja2FnZUxvY2tQYWNrYWdlPj4ge1xuICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIFBhY2thZ2VMb2NrUGFja2FnZT4gPSB7fTtcblxuICAvLyBHZXQgcmlkIG9mIGFueSBtb25vcmVwbyBzeW1saW5rc1xuICByb290RGlyID0gYXdhaXQgZnMucmVhbHBhdGgocm9vdERpcik7XG5cbiAgZm9yIChjb25zdCBbZGVwTmFtZSwgdmVyc2lvblJhbmdlXSBvZiBPYmplY3QuZW50cmllcyhkZXBzKSkge1xuICAgIGlmIChkZXBlbmRlbmN5UGF0aC5pbmNsdWRlcyhkZXBOYW1lKSkge1xuICAgICAgY29uc3QgaW5kZXggPSBkZXBlbmRlbmN5UGF0aC5pbmRleE9mKGRlcE5hbWUpO1xuICAgICAgY29uc3QgYmVmb3JlQ3ljbGUgPSBkZXBlbmRlbmN5UGF0aC5zbGljZSgwLCBpbmRleCk7XG4gICAgICBjb25zdCBpbkN5Y2xlID0gWy4uLmRlcGVuZGVuY3lQYXRoLnNsaWNlKGluZGV4KSwgZGVwTmFtZV07XG4gICAgICBjb25zdCBjeWNsZVN0cmluZyA9IGluQ3ljbGUuam9pbignID0+ICcpO1xuICAgICAgaWYgKCFDWUNMRVNfUkVQT1JURUQuaGFzKGN5Y2xlU3RyaW5nKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLndhcm4oYERlcGVuZGVuY3kgY3ljbGU6ICR7YmVmb3JlQ3ljbGUuam9pbignID0+ICcpfSA9PiBbICR7Y3ljbGVTdHJpbmd9IF0uIERyb3BwaW5nIGRlcGVuZGVuY3kgJyR7aW5DeWNsZS5zbGljZSgtMikuam9pbignID0+ICcpfScuYCk7XG4gICAgICAgIENZQ0xFU19SRVBPUlRFRC5hZGQoY3ljbGVTdHJpbmcpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwRGlyID0gYXdhaXQgZmluZFBhY2thZ2VEaXIoZGVwTmFtZSwgcm9vdERpcik7XG4gICAgY29uc3QgZGVwUGtnSnNvbkZpbGUgPSBwYXRoLmpvaW4oZGVwRGlyLCAncGFja2FnZS5qc29uJyk7XG4gICAgY29uc3QgZGVwUGtnSnNvbiA9IGF3YWl0IGxvYWRQYWNrYWdlSnNvbihkZXBQa2dKc29uRmlsZSk7XG4gICAgY29uc3QgeWFybktleSA9IGAke2RlcE5hbWV9QCR7dmVyc2lvblJhbmdlfWA7XG5cbiAgICAvLyBTYW5pdHkgY2hlY2tcbiAgICBpZiAoZGVwUGtnSnNvbi5uYW1lICE9PSBkZXBOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYExvb2tpbmcgZm9yICcke2RlcE5hbWV9JyBmcm9tICR7cm9vdERpcn0sIGJ1dCBmb3VuZCAnJHtkZXBQa2dKc29uLm5hbWV9JyBpbiAke2RlcERpcn1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB5YXJuUmVzb2x2ZWQgPSB5YXJuTG9jay5vYmplY3RbeWFybktleV07XG4gICAgaWYgKHlhcm5SZXNvbHZlZCkge1xuICAgICAgLy8gUmVzb2x2ZWQgYnkgWWFyblxuICAgICAgcmV0W2RlcE5hbWVdID0ge1xuICAgICAgICB2ZXJzaW9uOiB5YXJuUmVzb2x2ZWQudmVyc2lvbixcbiAgICAgICAgaW50ZWdyaXR5OiB5YXJuUmVzb2x2ZWQuaW50ZWdyaXR5LFxuICAgICAgICByZXNvbHZlZDogeWFyblJlc29sdmVkLnJlc29sdmVkLFxuICAgICAgICByZXF1aXJlczogZGVwUGtnSnNvbi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIGRlcGVuZGVuY2llczogYXdhaXQgZGVwZW5kZW5jaWVzRm9yKGRlcFBrZ0pzb24uZGVwZW5kZW5jaWVzIHx8IHt9LCB5YXJuTG9jaywgZGVwRGlyLCBbLi4uZGVwZW5kZW5jeVBhdGgsIGRlcE5hbWVdKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENvbWVzIGZyb20gbW9ub3JlcG8sIGp1c3QgdXNlIHdoYXRldmVyJ3MgaW4gcGFja2FnZS5qc29uXG4gICAgICByZXRbZGVwTmFtZV0gPSB7XG4gICAgICAgIHZlcnNpb246IGRlcFBrZ0pzb24udmVyc2lvbixcbiAgICAgICAgcmVxdWlyZXM6IGRlcFBrZ0pzb24uZGVwZW5kZW5jaWVzLFxuICAgICAgICBkZXBlbmRlbmNpZXM6IGF3YWl0IGRlcGVuZGVuY2llc0ZvcihkZXBQa2dKc29uLmRlcGVuZGVuY2llcyB8fCB7fSwgeWFybkxvY2ssIGRlcERpciwgWy4uLmRlcGVuZGVuY3lQYXRoLCBkZXBOYW1lXSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIFNpbXBsaWZ5IGJ5IHJlbW92aW5nIHVzZWxlc3MgZW50cmllc1xuICAgIGlmIChPYmplY3Qua2V5cyhyZXRbZGVwTmFtZV0ucmVxdWlyZXMgPz8ge30pLmxlbmd0aCA9PT0gMCkgeyBkZWxldGUgcmV0W2RlcE5hbWVdLnJlcXVpcmVzOyB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHJldFtkZXBOYW1lXS5kZXBlbmRlbmNpZXMgPz8ge30pLmxlbmd0aCA9PT0gMCkgeyBkZWxldGUgcmV0W2RlcE5hbWVdLmRlcGVuZGVuY2llczsgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmluZFlhcm5Mb2NrKHN0YXJ0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZpbmRVcCgneWFybi5sb2NrJywgc3RhcnQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaW5kVXAoZmlsZU5hbWU6IHN0cmluZywgc3RhcnQ6IHN0cmluZykge1xuICBzdGFydCA9IHBhdGgucmVzb2x2ZShzdGFydCk7XG4gIGxldCBkaXIgPSBzdGFydDtcbiAgY29uc3QgeWFybkxvY2tIZXJlID0gKCkgPT4gcGF0aC5qb2luKGRpciwgZmlsZU5hbWUpO1xuICB3aGlsZSAoIWF3YWl0IGZpbGVFeGlzdHMoeWFybkxvY2tIZXJlKCkpKSB7XG4gICAgY29uc3QgcGFyZW50ID0gcGF0aC5kaXJuYW1lKGRpcik7XG4gICAgaWYgKHBhcmVudCA9PT0gZGlyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vICR7ZmlsZU5hbWV9IGZvdW5kIHVwd2FyZHMgZnJvbSAke3N0YXJ0fWApO1xuICAgIH1cbiAgICBkaXIgPSBwYXJlbnQ7XG4gIH1cblxuICByZXR1cm4geWFybkxvY2tIZXJlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYWNrYWdlSnNvbihmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlSnNvbj4ge1xuICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCBmcy5yZWFkRmlsZShmaWxlTmFtZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZUV4aXN0cyhmdWxsUGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHRyeSB7XG4gICAgYXdhaXQgZnMuc3RhdChmdWxsUGF0aCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnIHx8IGUuY29kZSA9PT0gJ0VOT1RESVInKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFBhY2thZ2VMb2NrKGVudHJ5OiBQYWNrYWdlTG9ja0VudHJ5KSB7XG4gIGNvbnN0IGxpbmVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgcmVjdXJzZShbXSwgZW50cnkpO1xuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZShuYW1lczogc3RyaW5nW10sIHRoaXNFbnRyeTogUGFja2FnZUxvY2tFbnRyeSkge1xuICAgIGlmIChuYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgbGluZXMucHVzaChgJHtuYW1lcy5qb2luKCcgLT4gJyl9IEAgJHt0aGlzRW50cnkudmVyc2lvbn1gKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBbZGVwTmFtZSwgZGVwRW50cnldIG9mIE9iamVjdC5lbnRyaWVzKHRoaXNFbnRyeS5kZXBlbmRlbmNpZXMgfHwge30pKSB7XG4gICAgICByZWN1cnNlKFsuLi5uYW1lcywgZGVwTmFtZV0sIGRlcEVudHJ5KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kIHBhY2thZ2UgZGlyZWN0b3J5XG4gKlxuICogRG8gdGhpcyBieSB3YWxraW5nIHVwd2FyZHMgaW4gdGhlIGRpcmVjdG9yeSB0cmVlIHVudGlsIHdlIGZpbmRcbiAqIGA8ZGlyPi9ub2RlX21vZHVsZXMvPHBhY2thZ2U+L3BhY2thZ2UuanNvbmAuXG4gKlxuICogLS0tLS0tLVxuICpcbiAqIFRoaW5ncyB0aGF0IHdlIHRyaWVkIGJ1dCBkb24ndCB3b3JrOlxuICpcbiAqIDEuICAgIHJlcXVpcmUucmVzb2x2ZShgJHtkZXBOYW1lfS9wYWNrYWdlLmpzb25gLCB7IHBhdGhzOiBbcm9vdERpcl0gfSk7XG4gKlxuICogQnJlYWtzIHdpdGggRVMgTW9kdWxlcyBpZiBgcGFja2FnZS5qc29uYCBoYXMgbm90IGJlZW4gZXhwb3J0ZWQsIHdoaWNoIGlzXG4gKiBiZWluZyBlbmZvcmNlZCBzdGFydGluZyBOb2RlID49IDEyLlxuICpcbiAqIDIuICAgIGZpbmRQYWNrYWdlSnNvblVwd2FyZEZyb20ocmVxdWlyZS5yZXNvbHZlKGRlcE5hbWUsIHsgcGF0aHM6IFtyb290RGlyXSB9KSlcbiAqXG4gKiBCcmVha3MgaWYgYSBidWlsdC1pbiBOb2RlSlMgcGFja2FnZSBuYW1lIGNvbmZsaWN0cyB3aXRoIGFuIE5QTSBwYWNrYWdlIG5hbWVcbiAqIChpbiBOb2RlMTUgYHN0cmluZ19kZWNvZGVyYCBpcyBpbnRyb2R1Y2VkLi4uKVxuICovXG5hc3luYyBmdW5jdGlvbiBmaW5kUGFja2FnZURpcihkZXBOYW1lOiBzdHJpbmcsIHJvb3REaXI6IHN0cmluZykge1xuICBsZXQgcHJldkRpcjtcbiAgbGV0IGRpciA9IHJvb3REaXI7XG4gIHdoaWxlIChkaXIgIT09IHByZXZEaXIpIHtcbiAgICBjb25zdCBjYW5kaWRhdGVEaXIgPSBwYXRoLmpvaW4oZGlyLCAnbm9kZV9tb2R1bGVzJywgZGVwTmFtZSk7XG4gICAgaWYgKGF3YWl0IG5ldyBQcm9taXNlKG9rID0+IGV4aXN0cyhwYXRoLmpvaW4oY2FuZGlkYXRlRGlyLCAncGFja2FnZS5qc29uJyksIG9rKSkpIHtcbiAgICAgIHJldHVybiBjYW5kaWRhdGVEaXI7XG4gICAgfVxuXG4gICAgcHJldkRpciA9IGRpcjtcbiAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZGlyKTsgLy8gZGlybmFtZSgnLycpIC0+ICcvJywgZGlybmFtZSgnYzpcXFxcJykgLT4gJ2M6XFxcXCdcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgRGlkIG5vdCBmaW5kICcke2RlcE5hbWV9JyB1cHdhcmRzIG9mICcke3Jvb3REaXJ9J2ApO1xufVxuXG4vKipcbiAqIFdlIG1heSBzb21ldGltZXMgdHJ5IHRvIGFkanVzdCBhIHBhY2thZ2UgdmVyc2lvbiB0byBhIHZlcnNpb24gdGhhdCdzIGluY29tcGF0aWJsZSB3aXRoIHRoZSBkZWNsYXJlZCByZXF1aXJlbWVudC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhpcyByZWNlbnRseSBoYXBwZW5lZCBmb3IgJ25ldG1hc2snLCB3aGVyZSB0aGUgcGFja2FnZSB3ZVxuICogZGVwZW5kIG9uIGhhcyBgeyByZXF1aXJlczogeyBuZXRtYXNrOiAnXjEuMC42JywgfSB9YCwgYnV0IHdlIG5lZWQgdG8gZm9yY2Utc3Vic3RpdHV0ZSBpbiB2ZXJzaW9uIGAyLjAuMWAuXG4gKlxuICogSWYgTlBNIHByb2Nlc3NlcyB0aGUgc2hyaW5rd3JhcCBhbmQgZW5jb3VudGVycyB0aGUgZm9sbG93aW5nIHNpdHVhdGlvbjpcbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgbmV0bWFzazogeyB2ZXJzaW9uOiAnMi4wLjEnIH0sXG4gKiAgIHJlc29sdmVyOiB7XG4gKiAgICAgcmVxdWlyZXM6IHtcbiAqICAgICAgIG5ldG1hc2s6ICdeMS4wLjYnXG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBOUE0gaXMgZ29pbmcgdG8gZGlzcmVnYXJkIHRoZSBzd2hpbmtyd2FwIGFuZCBzdGlsbCBnaXZlIGByZXNvbHZlcmAgaXRzIG93biBwcml2YXRlXG4gKiBjb3B5IG9mIG5ldG1hc2sgYF4xLjAuNmAuXG4gKlxuICogV2UgdHJpZWQgb3ZlcnJpZGluZyB0aGUgYHJlcXVpcmVzYCB2ZXJzaW9uLCBhbmQgdGhhdCB3b3JrcyBmb3IgYG5wbSBpbnN0YWxsYCAoeWF5KVxuICogYnV0IGlmIGFueW9uZSBydW5zIGBucG0gbHNgIGFmdGVyd2FyZHMsIGBucG0gbHNgIGlzIGdvaW5nIHRvIGNoZWNrIHRoZSBhY3R1YWwgc291cmNlXG4gKiBgcGFja2FnZS5qc29uc2AgYWdhaW5zdCB0aGUgYWN0dWFsIGBub2RlX21vZHVsZXNgIGZpbGUgdHJlZSwgYW5kIGNvbXBsYWluIHRoYXQgdGhlXG4gKiB2ZXJzaW9ucyBkb24ndCBtYXRjaC5cbiAqXG4gKiBXZSBydW4gYG5wbSBsc2AgaW4gb3VyIHRlc3RzIHRvIG1ha2Ugc3VyZSBvdXIgZGVwZW5kZW5jeSB0cmVlIGlzIHNhbmUsIGFuZCBvdXIgY3VzdG9tZXJzXG4gKiBtaWdodCB0b28sIHNvIHRoaXMgaXMgbm90IGEgZ3JlYXQgc29sdXRpb24uXG4gKlxuICogVG8gY3V0IGFueSBkaXNjdXNzaW9uIHNob3J0IGluIHRoZSBmdXR1cmUsIHdlJ3JlIGdvaW5nIHRvIGRldGVjdCB0aGlzIHNpdHVhdGlvbiBhbmRcbiAqIHRlbGwgb3VyIGZ1dHVyZSBzZWx2ZXMgdGhhdCBpcyBjYW5ub3QgYW5kIHdpbGwgbm90IHdvcmssIGFuZCB3ZSBzaG91bGQgZmluZCBhbm90aGVyXG4gKiBzb2x1dGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmVxdWlyZWRWZXJzaW9ucyhyb290OiBQYWNrYWdlTG9jayB8IFBhY2thZ2VMb2NrUGFja2FnZSkge1xuICByZWN1cnNlKHJvb3QsIFtdKTtcblxuICBmdW5jdGlvbiByZWN1cnNlKGVudHJ5OiBQYWNrYWdlTG9jayB8IFBhY2thZ2VMb2NrUGFja2FnZSwgcGFyZW50Q2hhaW46IFBhY2thZ2VMb2NrRW50cnlbXSkge1xuICAgIC8vIE9uIHRoZSByb290LCAncmVxdWlyZXMnIGlzIHRoZSB2YWx1ZSAndHJ1ZScsIGZvciBHb2Qga25vd3Mgd2hhdCByZWFzb24uIERvbid0IGNhcmUgYWJvdXQgdGhvc2UuXG4gICAgaWYgKHR5cGVvZiBlbnRyeS5yZXF1aXJlcyA9PT0gJ29iamVjdCcpIHtcblxuICAgICAgLy8gRm9yIGV2ZXJ5ICdyZXF1aXJlcycgZGVwZW5kZW5jeSwgZmluZCB0aGUgdmVyc2lvbiBpdCBhY3R1YWxseSBnb3QgcmVzb2x2ZWQgdG8gYW5kIGNvbXBhcmUuXG4gICAgICBmb3IgKGNvbnN0IFtuYW1lLCByYW5nZV0gb2YgT2JqZWN0LmVudHJpZXMoZW50cnkucmVxdWlyZXMpKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkUGFja2FnZSA9IGZpbmRSZXNvbHZlZChuYW1lLCBbZW50cnksIC4uLnBhcmVudENoYWluXSk7XG4gICAgICAgIGlmICghcmVzb2x2ZWRQYWNrYWdlKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgaWYgKCFzZW12ZXIuc2F0aXNmaWVzKHJlc29sdmVkUGFja2FnZS52ZXJzaW9uLCByYW5nZSkpIHtcbiAgICAgICAgICAvLyBSdWgtcm9oLlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTG9va3MgbGlrZSB3ZSdyZSB0cnlpbmcgdG8gZm9yY2UgJyR7bmFtZX0nIHRvIHZlcnNpb24gJyR7cmVzb2x2ZWRQYWNrYWdlLnZlcnNpb259JywgYnV0IHRoZSBkZXBlbmRlbmN5IGBcbiAgICAgICAgICAgICsgYGlzIHNwZWNpZmllZCBhcyAnJHtyYW5nZX0nLiBUaGlzIGNhbiBuZXZlciBwcm9wZXJseSB3b3JrIHZpYSBzaHJpbmt3cmFwcGluZy4gVHJ5IHZlbmRvcmluZyBhIHBhdGNoZWQgYFxuICAgICAgICAgICAgKyAndmVyc2lvbiBvZiB0aGUgaW50ZXJtZWRpYXJ5IGRlcGVuZGVuY2llcyBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBkZXAgb2YgT2JqZWN0LnZhbHVlcyhlbnRyeS5kZXBlbmRlbmNpZXMgPz8ge30pKSB7XG4gICAgICByZWN1cnNlKGRlcCwgW2VudHJ5LCAuLi5wYXJlbnRDaGFpbl0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGEgcGFja2FnZSBuYW1lIGluIGEgcGFja2FnZSBsb2NrIHRyZWUuXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kUmVzb2x2ZWQobmFtZTogc3RyaW5nLCBjaGFpbjogUGFja2FnZUxvY2tFbnRyeVtdKSB7XG4gICAgZm9yIChjb25zdCBsZXZlbCBvZiBjaGFpbikge1xuICAgICAgaWYgKGxldmVsLmRlcGVuZGVuY2llcz8uW25hbWVdKSB7XG4gICAgICAgIHJldHVybiBsZXZlbC5kZXBlbmRlbmNpZXM/LltuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHRoYXQgYWxsIHBhY2thZ2VzIHN0aWxsIHJlc29sdmUgdGhlaXIgZGVwZW5kZW5jaWVzIHRvIHRoZSByaWdodCB2ZXJzaW9uc1xuICpcbiAqIFdlIGhhdmUgbWFuaXB1bGF0ZWQgdGhlIHRyZWUgYSBidW5jaC4gRG8gYSBzYW5pdHkgY2hlY2sgdG8gZW5zdXJlIHRoYXQgYWxsIGRlY2xhcmVkXG4gKiBkZXBlbmRlbmNpZXMgYXJlIHNhdGlzZmllZC5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVUcmVlKGxvY2s6IFBhY2thZ2VMb2NrKSB7XG4gIGxldCBmYWlsZWQgPSBmYWxzZTtcbiAgcmVjdXJzZShsb2NrLCBbbG9ja10pO1xuICBpZiAoZmFpbGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc2F0aXNmeSBvbmUgb3IgbW9yZSBkZXBlbmRlbmNpZXMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY3Vyc2UocGtnOiBQYWNrYWdlTG9ja0VudHJ5LCByb290UGF0aDogUGFja2FnZUxvY2tFbnRyeVtdKSB7XG4gICAgZm9yIChjb25zdCBwYWNrIG9mIE9iamVjdC52YWx1ZXMocGtnLmRlcGVuZGVuY2llcyA/PyB7fSkpIHtcbiAgICAgIGNvbnN0IHAgPSBbcGFjaywgLi4ucm9vdFBhdGhdO1xuICAgICAgY2hlY2tSZXF1aXJlc09mKHBhY2ssIHApO1xuICAgICAgcmVjdXJzZShwYWNrLCBwKTtcbiAgICB9XG4gIH1cblxuICAvLyByb290UGF0aDogbW9zdCBzcGVjaWZpYyBvbmUgZmlyc3RcbiAgZnVuY3Rpb24gY2hlY2tSZXF1aXJlc09mKHBhY2s6IFBhY2thZ2VMb2NrUGFja2FnZSwgcm9vdFBhdGg6IFBhY2thZ2VMb2NrRW50cnlbXSkge1xuICAgIGZvciAoY29uc3QgW25hbWUsIGRlY2xhcmVkUmFuZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHBhY2sucmVxdWlyZXMgPz8ge30pKSB7XG4gICAgICBjb25zdCBmb3VuZFZlcnNpb24gPSByb290UGF0aC5tYXAoKHApID0+IHAuZGVwZW5kZW5jaWVzPy5bbmFtZV0/LnZlcnNpb24pLmZpbmQoaXNEZWZpbmVkKTtcbiAgICAgIGlmICghZm91bmRWZXJzaW9uKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYERlcGVuZGVuY3kgb24gJHtuYW1lfSBub3Qgc2F0aXNmaWVkOiBub3QgZm91bmRgKTtcbiAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXNlbXZlci5zYXRpc2ZpZXMoZm91bmRWZXJzaW9uLCBkZWNsYXJlZFJhbmdlKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKGBEZXBlbmRlbmN5IG9uICR7bmFtZX0gbm90IHNhdGlzZmllZDogZGVjbGFyZWQgcmFuZ2UgJyR7ZGVjbGFyZWRSYW5nZX0nLCBmb3VuZCAnJHtmb3VuZFZlcnNpb259J2ApO1xuICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQ8QT4oeDogQSk6IHggaXMgTm9uTnVsbGFibGU8QT4ge1xuICByZXR1cm4geCAhPT0gdW5kZWZpbmVkO1xufVxuIl19