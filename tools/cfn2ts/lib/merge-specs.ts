import { blue, green } from 'colors/safe';
import { applyPatch } from 'fast-json-patch';
import * as fs from 'fs-extra';
import * as cfn from './cfnspec';

/**
 * Reads a bunch of spec files and returns a hash where key is "module" and value is a spec.
 */
export async function coalesceByModule(specfiles: string[]) {
    const byModule: any = { }; // Ex: { "AWS::Lambda": { "ResourceTypes": { "Function": { ... }}}}

    for (const file of specfiles) {
        const spec = JSON.parse((await fs.readFile(file)).toString());

        mergeByNamespace(file, 'PropertyTypes', spec.PropertyTypes, s => cfn.PropertyAttributeName.parse(s));
        mergeByNamespace(file, 'ResourceTypes', spec.ResourceTypes, s => cfn.SpecName.parse(s));

        // in per-resource specs, the key is "ResourceType" (singular), so we convert it to ResourceTypes (plural)
        mergeByNamespace(file, 'ResourceTypes', spec.ResourceType, s => cfn.SpecName.parse(s));
    }

    return byModule;

    function mergeByNamespace(filename: string, key: string, hash: any, nameFactory: (s: string) => cfn.SpecName) {
        if (!hash) {
            return;
        }

        for (const entity of Object.keys(hash)) {
            const name = nameFactory(entity);

            if (!name.module) {
                // tslint:disable:no-console
                console.warn('WARNING: skipping non-namespaced type: %s', entity);
                // tslint:enable:no-console
                continue;
            }

            if (!(name.module in byModule)) {
                byModule[name.module] = { };
            }

            const moduleTypes = byModule[name.module];
            if (!(key in moduleTypes)) {
                moduleTypes[key] = { };
            }

            const moduleSection = moduleTypes[key];

            const isPatchFile = filename.indexOf('patch') !== -1;
            // Warn about duplicate definitions unless the filename contains the word "patch"
            if (entity in moduleSection && !isPatchFile) {
                throw new Error(`Duplicate entity '${entity}' in module ${name.module}. File: ` + filename);
            }
            if (isPatchFile && hash[entity].patch) {
                // tslint:disable:no-console
                console.log('patching %s: %s\n\tfrom: %s',
                            blue(name.module),
                            green(hash[entity].patch.description || 'no description provided'),
                            blue(filename));
                // tslint:enable:no-console
                applyPatch(moduleSection[entity],
                           hash[entity].patch.operations,
                           true /* Validate patch operations (standard jsonpatch way) */,
                           true /* Mutate the document in-place */);
            } else {
                moduleSection[entity] = mergeObject(moduleSection[entity] || {}, hash[entity]);
            }
        }
    }
}

function mergeObject(a: {[key: string]: any}, b: {[key: string]: any}): {[key: string]: any} {
    for (const key of Object.keys(b)) {
        if (isObject(a[key]) && isObject(b[key])) {
            a[key] = mergeObject(a[key], b[key]);
        } else {
            a[key] = b[key];
        }

        // Be sure to delete nully/undefinedy values
        if (a[key] == null) { delete a[key]; }
    }
    return a;
}

/**
 * Return whether a variable is an object
 *
 * typeof by itself won't work, because 'null'. JavaScript, I'm not a fan.
 */
function isObject(x: any) {
    return typeof(x) === 'object' && x !== null;
}