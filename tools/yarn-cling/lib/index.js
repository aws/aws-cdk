"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPackageLock = exports.generateShrinkwrap = void 0;
const fs_1 = require("fs");
const path = require("path");
const lockfile = require("@yarnpkg/lockfile");
const hoisting_1 = require("./hoisting");
async function generateShrinkwrap(options) {
    var _a;
    // No args (yet)
    const packageJsonFile = options.packageJsonFile;
    const packageJsonDir = path.dirname(packageJsonFile);
    const yarnLockLoc = await findYarnLock(packageJsonDir);
    const yarnLock = lockfile.parse(await fs_1.promises.readFile(yarnLockLoc, { encoding: 'utf8' }));
    const pkgJson = await loadPackageJson(packageJsonFile);
    const lock = await generateLockFile(pkgJson, yarnLock, packageJsonDir);
    if ((_a = options.hoist) !== null && _a !== void 0 ? _a : true) {
        hoisting_1.hoistDependencies(lock.dependencies || {});
    }
    if (options.outputFile) {
        // Write the shrinkwrap file
        await fs_1.promises.writeFile(options.outputFile, JSON.stringify(lock, undefined, 2), { encoding: 'utf8' });
    }
    return lock;
}
exports.generateShrinkwrap = generateShrinkwrap;
async function generateLockFile(pkgJson, yarnLock, rootDir) {
    return {
        name: pkgJson.name,
        version: pkgJson.version,
        lockfileVersion: 1,
        requires: true,
        dependencies: await dependenciesFor(pkgJson.dependencies || {}, yarnLock, rootDir),
    };
}
// eslint-disable-next-line max-len
async function dependenciesFor(deps, yarnLock, rootDir) {
    var _a, _b;
    const ret = {};
    // Get rid of any monorepo symlinks
    rootDir = await fs_1.promises.realpath(rootDir);
    for (const [depName, versionRange] of Object.entries(deps)) {
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
                dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir),
            };
        }
        else {
            // Comes from monorepo, just use whatever's in package.json
            ret[depName] = {
                version: depPkgJson.version,
                requires: depPkgJson.dependencies,
                dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir),
            };
        }
        // Simplify by removing useless entries
        if (Object.keys((_a = ret[depName].requires) !== null && _a !== void 0 ? _a : {}).length === 0) {
            delete ret[depName].requires;
        }
        if (Object.keys((_b = ret[depName].dependencies) !== null && _b !== void 0 ? _b : {}).length === 0) {
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
exports.formatPackageLock = formatPackageLock;
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
 * being enforced starting Node12.
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
        if (await new Promise(ok => fs_1.exists(path.join(candidateDir, 'package.json'), ok))) {
            return candidateDir;
        }
        prevDir = dir;
        dir = path.dirname(dir); // dirname('/') -> '/', dirname('c:\\') -> 'c:\\'
    }
    throw new Error(`Did not find '${depName}' upwards of '${rootDir}'`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQkFBNEM7QUFDNUMsNkJBQTZCO0FBQzdCLDhDQUE4QztBQUM5Qyx5Q0FBK0M7QUF3QnhDLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUEwQjs7SUFDakUsZ0JBQWdCO0lBQ2hCLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFDaEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVyRCxNQUFNLFdBQVcsR0FBRyxNQUFNLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RCxNQUFNLFFBQVEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRXZELE1BQU0sSUFBSSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUV2RSxVQUFJLE9BQU8sQ0FBQyxLQUFLLG1DQUFJLElBQUksRUFBRTtRQUN6Qiw0QkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzVDO0lBRUQsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO1FBQ3RCLDRCQUE0QjtRQUM1QixNQUFNLGFBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUNsRztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2Qs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QUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUNoRixPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUVELE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDZCxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGlEQUFpRDtLQUMzRTtJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLE9BQU8saUJBQWlCLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDdkUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb21pc2VzIGFzIGZzLCBleGlzdHMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbG9ja2ZpbGUgZnJvbSAnQHlhcm5wa2cvbG9ja2ZpbGUnO1xuaW1wb3J0IHsgaG9pc3REZXBlbmRlbmNpZXMgfSBmcm9tICcuL2hvaXN0aW5nJztcbmltcG9ydCB7IFBhY2thZ2VKc29uLCBQYWNrYWdlTG9jaywgUGFja2FnZUxvY2tFbnRyeSwgUGFja2FnZUxvY2tQYWNrYWdlLCBZYXJuTG9jayB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNocmlua3dyYXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYWNrYWdlLmpzb24gZmlsZSB0byBzdGFydCBzY2FubmluZyBmb3IgZGVwZW5kZW5jaWVzXG4gICAqL1xuICBwYWNrYWdlSnNvbkZpbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG91dHB1dCBsb2NrZmlsZSB0byBnZW5lcmF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvbid0IGdlbmVyYXRlIHRoZSBmaWxlLCBqdXN0IHJldHVybiB0aGUgY2FsY3VsYXRlZCBvdXRwdXRcbiAgICovXG4gIG91dHB1dEZpbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaG9pc3QgZGVwZW5kZW5jaWVzXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGhvaXN0PzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlU2hyaW5rd3JhcChvcHRpb25zOiBTaHJpbmt3cmFwT3B0aW9ucyk6IFByb21pc2U8UGFja2FnZUxvY2s+IHtcbiAgLy8gTm8gYXJncyAoeWV0KVxuICBjb25zdCBwYWNrYWdlSnNvbkZpbGUgPSBvcHRpb25zLnBhY2thZ2VKc29uRmlsZTtcbiAgY29uc3QgcGFja2FnZUpzb25EaXIgPSBwYXRoLmRpcm5hbWUocGFja2FnZUpzb25GaWxlKTtcblxuICBjb25zdCB5YXJuTG9ja0xvYyA9IGF3YWl0IGZpbmRZYXJuTG9jayhwYWNrYWdlSnNvbkRpcik7XG4gIGNvbnN0IHlhcm5Mb2NrOiBZYXJuTG9jayA9IGxvY2tmaWxlLnBhcnNlKGF3YWl0IGZzLnJlYWRGaWxlKHlhcm5Mb2NrTG9jLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpO1xuICBjb25zdCBwa2dKc29uID0gYXdhaXQgbG9hZFBhY2thZ2VKc29uKHBhY2thZ2VKc29uRmlsZSk7XG5cbiAgY29uc3QgbG9jayA9IGF3YWl0IGdlbmVyYXRlTG9ja0ZpbGUocGtnSnNvbiwgeWFybkxvY2ssIHBhY2thZ2VKc29uRGlyKTtcblxuICBpZiAob3B0aW9ucy5ob2lzdCA/PyB0cnVlKSB7XG4gICAgaG9pc3REZXBlbmRlbmNpZXMobG9jay5kZXBlbmRlbmNpZXMgfHwge30pO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMub3V0cHV0RmlsZSkge1xuICAgIC8vIFdyaXRlIHRoZSBzaHJpbmt3cmFwIGZpbGVcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUob3B0aW9ucy5vdXRwdXRGaWxlLCBKU09OLnN0cmluZ2lmeShsb2NrLCB1bmRlZmluZWQsIDIpLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gIH1cblxuICByZXR1cm4gbG9jaztcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVMb2NrRmlsZShwa2dKc29uOiBQYWNrYWdlSnNvbiwgeWFybkxvY2s6IFlhcm5Mb2NrLCByb290RGlyOiBzdHJpbmcpOiBQcm9taXNlPFBhY2thZ2VMb2NrPiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogcGtnSnNvbi5uYW1lLFxuICAgIHZlcnNpb246IHBrZ0pzb24udmVyc2lvbixcbiAgICBsb2NrZmlsZVZlcnNpb246IDEsXG4gICAgcmVxdWlyZXM6IHRydWUsXG4gICAgZGVwZW5kZW5jaWVzOiBhd2FpdCBkZXBlbmRlbmNpZXNGb3IocGtnSnNvbi5kZXBlbmRlbmNpZXMgfHwge30sIHlhcm5Mb2NrLCByb290RGlyKSxcbiAgfTtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbmFzeW5jIGZ1bmN0aW9uIGRlcGVuZGVuY2llc0ZvcihkZXBzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCB5YXJuTG9jazogWWFybkxvY2ssIHJvb3REaXI6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgUGFja2FnZUxvY2tQYWNrYWdlPj4ge1xuICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIFBhY2thZ2VMb2NrUGFja2FnZT4gPSB7fTtcblxuICAvLyBHZXQgcmlkIG9mIGFueSBtb25vcmVwbyBzeW1saW5rc1xuICByb290RGlyID0gYXdhaXQgZnMucmVhbHBhdGgocm9vdERpcik7XG5cbiAgZm9yIChjb25zdCBbZGVwTmFtZSwgdmVyc2lvblJhbmdlXSBvZiBPYmplY3QuZW50cmllcyhkZXBzKSkge1xuICAgIGNvbnN0IGRlcERpciA9IGF3YWl0IGZpbmRQYWNrYWdlRGlyKGRlcE5hbWUsIHJvb3REaXIpO1xuICAgIGNvbnN0IGRlcFBrZ0pzb25GaWxlID0gcGF0aC5qb2luKGRlcERpciwgJ3BhY2thZ2UuanNvbicpO1xuICAgIGNvbnN0IGRlcFBrZ0pzb24gPSBhd2FpdCBsb2FkUGFja2FnZUpzb24oZGVwUGtnSnNvbkZpbGUpO1xuICAgIGNvbnN0IHlhcm5LZXkgPSBgJHtkZXBOYW1lfUAke3ZlcnNpb25SYW5nZX1gO1xuXG4gICAgLy8gU2FuaXR5IGNoZWNrXG4gICAgaWYgKGRlcFBrZ0pzb24ubmFtZSAhPT0gZGVwTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBMb29raW5nIGZvciAnJHtkZXBOYW1lfScgZnJvbSAke3Jvb3REaXJ9LCBidXQgZm91bmQgJyR7ZGVwUGtnSnNvbi5uYW1lfScgaW4gJHtkZXBEaXJ9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgeWFyblJlc29sdmVkID0geWFybkxvY2sub2JqZWN0W3lhcm5LZXldO1xuICAgIGlmICh5YXJuUmVzb2x2ZWQpIHtcbiAgICAgIC8vIFJlc29sdmVkIGJ5IFlhcm5cbiAgICAgIHJldFtkZXBOYW1lXSA9IHtcbiAgICAgICAgdmVyc2lvbjogeWFyblJlc29sdmVkLnZlcnNpb24sXG4gICAgICAgIGludGVncml0eTogeWFyblJlc29sdmVkLmludGVncml0eSxcbiAgICAgICAgcmVzb2x2ZWQ6IHlhcm5SZXNvbHZlZC5yZXNvbHZlZCxcbiAgICAgICAgcmVxdWlyZXM6IGRlcFBrZ0pzb24uZGVwZW5kZW5jaWVzLFxuICAgICAgICBkZXBlbmRlbmNpZXM6IGF3YWl0IGRlcGVuZGVuY2llc0ZvcihkZXBQa2dKc29uLmRlcGVuZGVuY2llcyB8fCB7fSwgeWFybkxvY2ssIGRlcERpciksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDb21lcyBmcm9tIG1vbm9yZXBvLCBqdXN0IHVzZSB3aGF0ZXZlcidzIGluIHBhY2thZ2UuanNvblxuICAgICAgcmV0W2RlcE5hbWVdID0ge1xuICAgICAgICB2ZXJzaW9uOiBkZXBQa2dKc29uLnZlcnNpb24sXG4gICAgICAgIHJlcXVpcmVzOiBkZXBQa2dKc29uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgZGVwZW5kZW5jaWVzOiBhd2FpdCBkZXBlbmRlbmNpZXNGb3IoZGVwUGtnSnNvbi5kZXBlbmRlbmNpZXMgfHwge30sIHlhcm5Mb2NrLCBkZXBEaXIpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBTaW1wbGlmeSBieSByZW1vdmluZyB1c2VsZXNzIGVudHJpZXNcbiAgICBpZiAoT2JqZWN0LmtleXMocmV0W2RlcE5hbWVdLnJlcXVpcmVzID8/IHt9KS5sZW5ndGggPT09IDApIHsgZGVsZXRlIHJldFtkZXBOYW1lXS5yZXF1aXJlczsgfVxuICAgIGlmIChPYmplY3Qua2V5cyhyZXRbZGVwTmFtZV0uZGVwZW5kZW5jaWVzID8/IHt9KS5sZW5ndGggPT09IDApIHsgZGVsZXRlIHJldFtkZXBOYW1lXS5kZXBlbmRlbmNpZXM7IH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRZYXJuTG9jayhzdGFydDogc3RyaW5nKSB7XG4gIHJldHVybiBmaW5kVXAoJ3lhcm4ubG9jaycsIHN0YXJ0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmluZFVwKGZpbGVOYW1lOiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcpIHtcbiAgc3RhcnQgPSBwYXRoLnJlc29sdmUoc3RhcnQpO1xuICBsZXQgZGlyID0gc3RhcnQ7XG4gIGNvbnN0IHlhcm5Mb2NrSGVyZSA9ICgpID0+IHBhdGguam9pbihkaXIsIGZpbGVOYW1lKTtcbiAgd2hpbGUgKCFhd2FpdCBmaWxlRXhpc3RzKHlhcm5Mb2NrSGVyZSgpKSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHBhdGguZGlybmFtZShkaXIpO1xuICAgIGlmIChwYXJlbnQgPT09IGRpcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyAke2ZpbGVOYW1lfSBmb3VuZCB1cHdhcmRzIGZyb20gJHtzdGFydH1gKTtcbiAgICB9XG4gICAgZGlyID0gcGFyZW50O1xuICB9XG5cbiAgcmV0dXJuIHlhcm5Mb2NrSGVyZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGFja2FnZUpzb24oZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8UGFja2FnZUpzb24+IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgZnMucmVhZEZpbGUoZmlsZU5hbWUsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbGVFeGlzdHMoZnVsbFBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICB0cnkge1xuICAgIGF3YWl0IGZzLnN0YXQoZnVsbFBhdGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcgfHwgZS5jb2RlID09PSAnRU5PVERJUicpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UGFja2FnZUxvY2soZW50cnk6IFBhY2thZ2VMb2NrRW50cnkpIHtcbiAgY29uc3QgbGluZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICByZWN1cnNlKFtdLCBlbnRyeSk7XG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcblxuICBmdW5jdGlvbiByZWN1cnNlKG5hbWVzOiBzdHJpbmdbXSwgdGhpc0VudHJ5OiBQYWNrYWdlTG9ja0VudHJ5KSB7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBsaW5lcy5wdXNoKGAke25hbWVzLmpvaW4oJyAtPiAnKX0gQCAke3RoaXNFbnRyeS52ZXJzaW9ufWApO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtkZXBOYW1lLCBkZXBFbnRyeV0gb2YgT2JqZWN0LmVudHJpZXModGhpc0VudHJ5LmRlcGVuZGVuY2llcyB8fCB7fSkpIHtcbiAgICAgIHJlY3Vyc2UoWy4uLm5hbWVzLCBkZXBOYW1lXSwgZGVwRW50cnkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZpbmQgcGFja2FnZSBkaXJlY3RvcnlcbiAqXG4gKiBEbyB0aGlzIGJ5IHdhbGtpbmcgdXB3YXJkcyBpbiB0aGUgZGlyZWN0b3J5IHRyZWUgdW50aWwgd2UgZmluZFxuICogYDxkaXI+L25vZGVfbW9kdWxlcy88cGFja2FnZT4vcGFja2FnZS5qc29uYC5cbiAqXG4gKiAtLS0tLS0tXG4gKlxuICogVGhpbmdzIHRoYXQgd2UgdHJpZWQgYnV0IGRvbid0IHdvcms6XG4gKlxuICogMS4gICAgcmVxdWlyZS5yZXNvbHZlKGAke2RlcE5hbWV9L3BhY2thZ2UuanNvbmAsIHsgcGF0aHM6IFtyb290RGlyXSB9KTtcbiAqXG4gKiBCcmVha3Mgd2l0aCBFUyBNb2R1bGVzIGlmIGBwYWNrYWdlLmpzb25gIGhhcyBub3QgYmVlbiBleHBvcnRlZCwgd2hpY2ggaXNcbiAqIGJlaW5nIGVuZm9yY2VkIHN0YXJ0aW5nIE5vZGUxMi5cbiAqXG4gKiAyLiAgICBmaW5kUGFja2FnZUpzb25VcHdhcmRGcm9tKHJlcXVpcmUucmVzb2x2ZShkZXBOYW1lLCB7IHBhdGhzOiBbcm9vdERpcl0gfSkpXG4gKlxuICogQnJlYWtzIGlmIGEgYnVpbHQtaW4gTm9kZUpTIHBhY2thZ2UgbmFtZSBjb25mbGljdHMgd2l0aCBhbiBOUE0gcGFja2FnZSBuYW1lXG4gKiAoaW4gTm9kZTE1IGBzdHJpbmdfZGVjb2RlcmAgaXMgaW50cm9kdWNlZC4uLilcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZmluZFBhY2thZ2VEaXIoZGVwTmFtZTogc3RyaW5nLCByb290RGlyOiBzdHJpbmcpIHtcbiAgbGV0IHByZXZEaXI7XG4gIGxldCBkaXIgPSByb290RGlyO1xuICB3aGlsZSAoZGlyICE9PSBwcmV2RGlyKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlRGlyID0gcGF0aC5qb2luKGRpciwgJ25vZGVfbW9kdWxlcycsIGRlcE5hbWUpO1xuICAgIGlmIChhd2FpdCBuZXcgUHJvbWlzZShvayA9PiBleGlzdHMocGF0aC5qb2luKGNhbmRpZGF0ZURpciwgJ3BhY2thZ2UuanNvbicpLCBvaykpKSB7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlRGlyO1xuICAgIH1cblxuICAgIHByZXZEaXIgPSBkaXI7XG4gICAgZGlyID0gcGF0aC5kaXJuYW1lKGRpcik7IC8vIGRpcm5hbWUoJy8nKSAtPiAnLycsIGRpcm5hbWUoJ2M6XFxcXCcpIC0+ICdjOlxcXFwnXG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYERpZCBub3QgZmluZCAnJHtkZXBOYW1lfScgdXB3YXJkcyBvZiAnJHtyb290RGlyfSdgKTtcbn0iXX0=