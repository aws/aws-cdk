#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Find JSII packages that have a certain field in their package.json. Outputs the directories containing
// jsii.json.
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
/* eslint-disable @typescript-eslint/no-shadow */
const argv = yargs
    .usage('$0')
    .option('verbose', { alias: 'v', type: 'boolean', desc: 'Turn on verbose logging' })
    .option('key', {
    alias: 'k',
    type: 'string',
    desc: 'Return only packages that have a truthy value in package.json for the given (dot-recursive) key.',
    requiresArg: true,
})
    .epilogue([
    'Outputs the JSII directories for all JSII packages that are found.',
].join('\n'))
    .argv;
main();
function main() {
    const objectPath = argv.key ? argv.key.split('.') : [];
    // Find the package directories
    const packages = enumeratePackages(process.cwd(), (packageJson) => {
        const isJsii = packageJson.jsii;
        const matches = deepGet(packageJson, objectPath);
        return isJsii && matches;
    });
    // Output the JSII directories
    for (const pkg of packages) {
        process.stdout.write(pkg.directory + '\n');
    }
}
/**
 * Return all packages from a given root if they match a given predicate
 *
 * Returns list of package directories.
 *
 * (Includes devDependencies only for the root package)
 */
function enumeratePackages(root, pred) {
    const ret = [];
    const seen = new Set();
    function recurse(directory, includeDevDependencies) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const packageJson = require(path.join(directory, '/package.json'));
        // Make sure we don't keep on doing the same packages over and over.
        // (Use name instead of dir so we dedupe even if they live in different directories).
        if (seen.has(packageJson.name)) {
            return;
        }
        seen.add(packageJson.name);
        debug(`Checking directory: ${directory}`);
        if (pred(packageJson)) {
            debug('Matches predicate.');
            ret.push({ directory, packageJson });
        }
        const depNames = Object.keys(packageJson.dependencies || {});
        if (includeDevDependencies) {
            depNames.push(...Object.keys(packageJson.devDependencies || {}));
        }
        debug(`Found dependencies: ${depNames}`);
        for (const depName of depNames) {
            const mainFilePath = findPackageFrom(depName, directory);
            if (!mainFilePath) {
                continue; // skip
            }
            // Result of findPackageFrom() is the 'index.js' file for this library.
            // Find the corresponding package root and recurse from there.
            recurse(findPackageRoot(mainFilePath), false);
        }
    }
    recurse(root, true);
    return ret;
}
/**
 * Emulate require.resolve() with a starting search path
 *
 * For some reason, the actual require.resolve() does not seem to do what I expect
 * it to do on my machine--it seems to ignore 'paths' and always uses the
 * current module scope. That's not good enough, and I've been spending 2 hours
 * on this already.
 *
 * We get the behavior that we want by dregging around in the innards of
 * NodeJS. Probalby not great to depend on private APIs, but since this is
 * a build tool and not shipped, I'm fine with it for now.
 */
function findPackageFrom(packageName, relativeTo) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Module = module.constructor;
    const searchDirs = Module._nodeModulePaths(relativeTo).concat(Module.globalPaths);
    const ret = Module._findPath(packageName, searchDirs, false);
    if (ret === false) {
        /* eslint-disable-next-line no-console */
        console.warn(`Could not find package ${packageName} in scope of ${relativeTo}`);
        return undefined;
    }
    return ret;
}
/**
 * Find the package.json up the tree for the given root file
 */
function findPackageRoot(rootFile) {
    let dir = path.dirname(rootFile);
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
        const newdir = path.dirname(dir);
        if (newdir === dir) {
            throw new Error(`Did not find a package.json for ${rootFile}`);
        }
        dir = newdir;
    }
    return dir;
}
/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
function deepGet(x, keyPath) {
    keyPath = keyPath.slice();
    while (keyPath.length > 0 && typeof x === 'object' && x !== null) {
        const key = keyPath.shift();
        x = x[key];
    }
    return keyPath.length === 0 ? x : undefined;
}
function debug(s) {
    if (argv.verbose) {
        process.stderr.write(`[find-jsii-packages] ${s}\n`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1qc2lpLXBhY2thZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmluZC1qc2lpLXBhY2thZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlHQUF5RztBQUN6RyxhQUFhO0FBQ2IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFFL0IsaURBQWlEO0FBQ2pELE1BQU0sSUFBSSxHQUFHLEtBQUs7S0FDZixLQUFLLENBQUMsSUFBSSxDQUFDO0tBQ1gsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsQ0FBQztLQUNuRixNQUFNLENBQUMsS0FBSyxFQUFFO0lBQ2IsS0FBSyxFQUFFLEdBQUc7SUFDVixJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxrR0FBa0c7SUFDeEcsV0FBVyxFQUFFLElBQUk7Q0FDbEIsQ0FBQztLQUNELFFBQVEsQ0FBQztJQUNSLG9FQUFvRTtDQUNyRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNaLElBQUksQ0FBQztBQUVSLElBQUksRUFBRSxDQUFDO0FBRVAsU0FBUyxJQUFJO0lBQ1gsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUV2RCwrQkFBK0I7SUFDL0IsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDaEUsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sTUFBTSxJQUFJ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QUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFO1FBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDaEU7UUFDRCxHQUFHLEdBQUcsTUFBTSxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsT0FBTyxDQUFDLENBQU0sRUFBRSxPQUFpQjtJQUN4QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDaEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRyxDQUFDO1FBQzdCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDWjtJQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzlDLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxDQUFTO0lBQ3RCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNoQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyRDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vLyBGaW5kIEpTSUkgcGFja2FnZXMgdGhhdCBoYXZlIGEgY2VydGFpbiBmaWVsZCBpbiB0aGVpciBwYWNrYWdlLmpzb24uIE91dHB1dHMgdGhlIGRpcmVjdG9yaWVzIGNvbnRhaW5pbmdcbi8vIGpzaWkuanNvbi5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3cgKi9cbmNvbnN0IGFyZ3YgPSB5YXJnc1xuICAudXNhZ2UoJyQwJylcbiAgLm9wdGlvbigndmVyYm9zZScsIHsgYWxpYXM6ICd2JywgdHlwZTogJ2Jvb2xlYW4nLCBkZXNjOiAnVHVybiBvbiB2ZXJib3NlIGxvZ2dpbmcnIH0pXG4gIC5vcHRpb24oJ2tleScsIHtcbiAgICBhbGlhczogJ2snLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlc2M6ICdSZXR1cm4gb25seSBwYWNrYWdlcyB0aGF0IGhhdmUgYSB0cnV0aHkgdmFsdWUgaW4gcGFja2FnZS5qc29uIGZvciB0aGUgZ2l2ZW4gKGRvdC1yZWN1cnNpdmUpIGtleS4nLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICB9KVxuICAuZXBpbG9ndWUoW1xuICAgICdPdXRwdXRzIHRoZSBKU0lJIGRpcmVjdG9yaWVzIGZvciBhbGwgSlNJSSBwYWNrYWdlcyB0aGF0IGFyZSBmb3VuZC4nLFxuICBdLmpvaW4oJ1xcbicpKVxuICAuYXJndjtcblxubWFpbigpO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBvYmplY3RQYXRoID0gYXJndi5rZXkgPyBhcmd2LmtleS5zcGxpdCgnLicpIDogW107XG5cbiAgLy8gRmluZCB0aGUgcGFja2FnZSBkaXJlY3Rvcmllc1xuICBjb25zdCBwYWNrYWdlcyA9IGVudW1lcmF0ZVBhY2thZ2VzKHByb2Nlc3MuY3dkKCksIChwYWNrYWdlSnNvbikgPT4ge1xuICAgIGNvbnN0IGlzSnNpaSA9IHBhY2thZ2VKc29uLmpzaWk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGRlZXBHZXQocGFja2FnZUpzb24sIG9iamVjdFBhdGgpO1xuICAgIHJldHVybiBpc0pzaWkgJiYgbWF0Y2hlcztcbiAgfSk7XG5cbiAgLy8gT3V0cHV0IHRoZSBKU0lJIGRpcmVjdG9yaWVzXG4gIGZvciAoY29uc3QgcGtnIG9mIHBhY2thZ2VzKSB7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocGtnLmRpcmVjdG9yeSArICdcXG4nKTtcbiAgfVxufVxuXG50eXBlIFBhY2thZ2VQcmVkaWNhdGUgPSAoeDogYW55KSA9PiBib29sZWFuO1xuXG5pbnRlcmZhY2UgSlNJSVBhY2thZ2Uge1xuICBkaXJlY3Rvcnk6IHN0cmluZztcbiAgcGFja2FnZUpzb246IGFueTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIHBhY2thZ2VzIGZyb20gYSBnaXZlbiByb290IGlmIHRoZXkgbWF0Y2ggYSBnaXZlbiBwcmVkaWNhdGVcbiAqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgcGFja2FnZSBkaXJlY3Rvcmllcy5cbiAqXG4gKiAoSW5jbHVkZXMgZGV2RGVwZW5kZW5jaWVzIG9ubHkgZm9yIHRoZSByb290IHBhY2thZ2UpXG4gKi9cbmZ1bmN0aW9uIGVudW1lcmF0ZVBhY2thZ2VzKHJvb3Q6IHN0cmluZywgcHJlZDogUGFja2FnZVByZWRpY2F0ZSk6IEpTSUlQYWNrYWdlW10ge1xuICBjb25zdCByZXQ6IEpTSUlQYWNrYWdlW10gPSBbXTtcbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGZ1bmN0aW9uIHJlY3Vyc2UoZGlyZWN0b3J5OiBzdHJpbmcsIGluY2x1ZGVEZXZEZXBlbmRlbmNpZXM6IGJvb2xlYW4pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gcmVxdWlyZShwYXRoLmpvaW4oZGlyZWN0b3J5LCAnL3BhY2thZ2UuanNvbicpKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBrZWVwIG9uIGRvaW5nIHRoZSBzYW1lIHBhY2thZ2VzIG92ZXIgYW5kIG92ZXIuXG4gICAgLy8gKFVzZSBuYW1lIGluc3RlYWQgb2YgZGlyIHNvIHdlIGRlZHVwZSBldmVuIGlmIHRoZXkgbGl2ZSBpbiBkaWZmZXJlbnQgZGlyZWN0b3JpZXMpLlxuICAgIGlmIChzZWVuLmhhcyhwYWNrYWdlSnNvbi5uYW1lKSkgeyByZXR1cm47IH1cbiAgICBzZWVuLmFkZChwYWNrYWdlSnNvbi5uYW1lKTtcblxuICAgIGRlYnVnKGBDaGVja2luZyBkaXJlY3Rvcnk6ICR7ZGlyZWN0b3J5fWApO1xuXG4gICAgaWYgKHByZWQocGFja2FnZUpzb24pKSB7XG4gICAgICBkZWJ1ZygnTWF0Y2hlcyBwcmVkaWNhdGUuJyk7XG4gICAgICByZXQucHVzaCh7IGRpcmVjdG9yeSwgcGFja2FnZUpzb24gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwTmFtZXMgPSBPYmplY3Qua2V5cyhwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgfHwge30pO1xuICAgIGlmIChpbmNsdWRlRGV2RGVwZW5kZW5jaWVzKSB7XG4gICAgICBkZXBOYW1lcy5wdXNoKC4uLk9iamVjdC5rZXlzKHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyB8fCB7fSkpO1xuICAgIH1cblxuICAgIGRlYnVnKGBGb3VuZCBkZXBlbmRlbmNpZXM6ICR7ZGVwTmFtZXN9YCk7XG4gICAgZm9yIChjb25zdCBkZXBOYW1lIG9mIGRlcE5hbWVzKSB7XG4gICAgICBjb25zdCBtYWluRmlsZVBhdGggPSBmaW5kUGFja2FnZUZyb20oZGVwTmFtZSwgZGlyZWN0b3J5KTtcbiAgICAgIGlmICghbWFpbkZpbGVQYXRoKSB7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBza2lwXG4gICAgICB9XG5cbiAgICAgIC8vIFJlc3VsdCBvZiBmaW5kUGFja2FnZUZyb20oKSBpcyB0aGUgJ2luZGV4LmpzJyBmaWxlIGZvciB0aGlzIGxpYnJhcnkuXG4gICAgICAvLyBGaW5kIHRoZSBjb3JyZXNwb25kaW5nIHBhY2thZ2Ugcm9vdCBhbmQgcmVjdXJzZSBmcm9tIHRoZXJlLlxuICAgICAgcmVjdXJzZShmaW5kUGFja2FnZVJvb3QobWFpbkZpbGVQYXRoKSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2Uocm9vdCwgdHJ1ZSk7XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogRW11bGF0ZSByZXF1aXJlLnJlc29sdmUoKSB3aXRoIGEgc3RhcnRpbmcgc2VhcmNoIHBhdGhcbiAqXG4gKiBGb3Igc29tZSByZWFzb24sIHRoZSBhY3R1YWwgcmVxdWlyZS5yZXNvbHZlKCkgZG9lcyBub3Qgc2VlbSB0byBkbyB3aGF0IEkgZXhwZWN0XG4gKiBpdCB0byBkbyBvbiBteSBtYWNoaW5lLS1pdCBzZWVtcyB0byBpZ25vcmUgJ3BhdGhzJyBhbmQgYWx3YXlzIHVzZXMgdGhlXG4gKiBjdXJyZW50IG1vZHVsZSBzY29wZS4gVGhhdCdzIG5vdCBnb29kIGVub3VnaCwgYW5kIEkndmUgYmVlbiBzcGVuZGluZyAyIGhvdXJzXG4gKiBvbiB0aGlzIGFscmVhZHkuXG4gKlxuICogV2UgZ2V0IHRoZSBiZWhhdmlvciB0aGF0IHdlIHdhbnQgYnkgZHJlZ2dpbmcgYXJvdW5kIGluIHRoZSBpbm5hcmRzIG9mXG4gKiBOb2RlSlMuIFByb2JhbGJ5IG5vdCBncmVhdCB0byBkZXBlbmQgb24gcHJpdmF0ZSBBUElzLCBidXQgc2luY2UgdGhpcyBpc1xuICogYSBidWlsZCB0b29sIGFuZCBub3Qgc2hpcHBlZCwgSSdtIGZpbmUgd2l0aCBpdCBmb3Igbm93LlxuICovXG5mdW5jdGlvbiBmaW5kUGFja2FnZUZyb20ocGFja2FnZU5hbWU6IHN0cmluZywgcmVsYXRpdmVUbzogc3RyaW5nKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cbiAgY29uc3QgTW9kdWxlID0gbW9kdWxlLmNvbnN0cnVjdG9yIGFzIGFueTtcblxuICBjb25zdCBzZWFyY2hEaXJzOiBzdHJpbmdbXSA9IE1vZHVsZS5fbm9kZU1vZHVsZVBhdGhzKHJlbGF0aXZlVG8pLmNvbmNhdChNb2R1bGUuZ2xvYmFsUGF0aHMpO1xuICBjb25zdCByZXQgPSBNb2R1bGUuX2ZpbmRQYXRoKHBhY2thZ2VOYW1lLCBzZWFyY2hEaXJzLCBmYWxzZSk7XG4gIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUgKi9cbiAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBmaW5kIHBhY2thZ2UgJHtwYWNrYWdlTmFtZX0gaW4gc2NvcGUgb2YgJHtyZWxhdGl2ZVRvfWApO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBwYWNrYWdlLmpzb24gdXAgdGhlIHRyZWUgZm9yIHRoZSBnaXZlbiByb290IGZpbGVcbiAqL1xuZnVuY3Rpb24gZmluZFBhY2thZ2VSb290KHJvb3RGaWxlOiBzdHJpbmcpIHtcbiAgbGV0IGRpciA9IHBhdGguZGlybmFtZShyb290RmlsZSk7XG5cbiAgd2hpbGUgKCFmcy5leGlzdHNTeW5jKHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKSkpIHtcbiAgICBjb25zdCBuZXdkaXIgPSBwYXRoLmRpcm5hbWUoZGlyKTtcbiAgICBpZiAobmV3ZGlyID09PSBkaXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRGlkIG5vdCBmaW5kIGEgcGFja2FnZS5qc29uIGZvciAke3Jvb3RGaWxlfWApO1xuICAgIH1cbiAgICBkaXIgPSBuZXdkaXI7XG4gIH1cblxuICByZXR1cm4gZGlyO1xufVxuXG4vKipcbiAqIERlZXAgZ2V0IGEgdmFsdWUgZnJvbSBhIHRyZWUgb2YgbmVzdGVkIG9iamVjdHNcbiAqXG4gKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBhbnkgcGFydCBvZiB0aGUgcGF0aCB3YXMgdW5zZXQgb3JcbiAqIG5vdCBhbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGRlZXBHZXQoeDogYW55LCBrZXlQYXRoOiBzdHJpbmdbXSk6IGFueSB7XG4gIGtleVBhdGggPSBrZXlQYXRoLnNsaWNlKCk7XG5cbiAgd2hpbGUgKGtleVBhdGgubGVuZ3RoID4gMCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGtleSA9IGtleVBhdGguc2hpZnQoKSE7XG4gICAgeCA9IHhba2V5XTtcbiAgfVxuICByZXR1cm4ga2V5UGF0aC5sZW5ndGggPT09IDAgPyB4IDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWJ1ZyhzOiBzdHJpbmcpIHtcbiAgaWYgKGFyZ3YudmVyYm9zZSkge1xuICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGBbZmluZC1qc2lpLXBhY2thZ2VzXSAke3N9XFxuYCk7XG4gIH1cbn1cbiJdfQ==