import fs = require('fs-extra');
import util = require('util');

// tslint:disable-next-line:no-var-requires
const jsonDiff = require('json-diff').diff;

function line(fmt: string = '', ...param: any[]) {
    process.stdout.write(util.format(fmt, ...param));
    process.stdout.write('\n');
}

async function main() {
    const title = process.argv[2];
    const oldSpecFile = process.argv[3];
    const newSpecFile = process.argv[4];

    const newSpec = await fs.readJSON(newSpecFile);
    const oldSpec = await fs.readJSON(oldSpecFile);

    const out = jsonDiff(oldSpec, newSpec);

    if (!out) {
        return; // no diff
    }

    const resourceTypeAdditions = new Set<string>();
    const propertyChanges = new Array<string>();
    const propertyTypeChanges = new Array<string>();

    for (const key of Object.keys(out.ResourceTypes || {})) {
        classifyResourceTypeUpdate(key, out.ResourceTypes[key]);
    }

    for (const key of Object.keys(out.PropertyTypes || {})) {
        classifyPropertyTypeUpdate(key, out.PropertyTypes[key]);
    }

    line(`# ${title} v${newSpec.ResourceSpecificationVersion}`);
    line();

    line('## New Resource Types');
    line();
    resourceTypeAdditions.forEach(type => line(`* ${type}`));
    line();

    line('## Property Changes');
    line();
    propertyChanges.forEach(x => line(x));
    line();

    line('## Property Type Changes');
    line();
    propertyTypeChanges.forEach(x => line(x));

    function classifyResourceTypeUpdate(resourceType: string, update: any) {
        const added = isAdded(resourceType);
        if (added) {
            resourceTypeAdditions.add(added);
            return;
        }

        const deleted = isDeleted(resourceType);
        if (deleted) {
            throw new Error('Something really bad happened. Resource types should never be deleted: ' + deleted);
        }

        if (Object.keys(update).length !== 1 && Object.keys(update)[0] === 'Properties') {
            throw new Error('Unexpected update to a resource type. Expecting only "Properties" to change: ' + resourceType);
        }

        for (const prop of Object.keys(update.Properties)) {
            describeChanges(resourceType, prop, update.Properties[prop]).forEach(change => {
                propertyChanges.push(change);
            });
        }
    }

    function classifyPropertyTypeUpdate(propertyType: string, update: any) {
        const added = isAdded(propertyType);
        if (added) {
            const resourceType = added.split('.')[0];
            if (resourceTypeAdditions.has(resourceType)) {
                return; // skipping property for added resource types
            }

            propertyTypeChanges.push(`* ${added} (__added__)`);
            return;
        }

        if (Object.keys(update).length !== 1 && Object.keys(update)[0] === 'Properties') {
            throw new Error('Unexpected update to a resource type. Expecting only "Properties" to change: ' + propertyType);
        }

        for (const prop of Object.keys(update.Properties)) {
            describeChanges(propertyType, prop, update.Properties[prop]).forEach(change => {
                propertyTypeChanges.push(change);
            });
        }
    }

    function isDeleted(key: string) {
        return isSuffix(key, '__deleted');
    }

    function isAdded(key: string) {
        return isSuffix(key, '__added');
    }

    function isSuffix(key: string, suffix: string) {
        const index = key.indexOf(suffix);
        return index === -1 ? undefined : key.substr(0, index);
    }

    function describeChanges(namespace: string, prefix: string, update: any) {
        const changes = new Array<string>();

        const added = isAdded(prefix);
        if (added) {
            changes.push(`* ${namespace} ${added} (__added__)`);
            return changes;
        }

        const deleted = isDeleted(prefix);
        if (deleted) {
            changes.push(`* ${namespace} ${deleted} (__deleted__)`);
            return changes;
        }

        if (typeof(update) !== 'object') {
            throw new Error(`Unexpected change for ${namespace}.${prefix} ${JSON.stringify(update)}`);
            return changes;
        }

        if ('__old' in update && '__new' in update) {
            changes.push(`* ${namespace} ${prefix} (__changed__)`);
            changes.push(`  * Old: ${update.__old}`);
            changes.push(`  * New: ${update.__new}`);
            return changes;
        }

        for (const key of Object.keys(update)) {
            for (const change of describeChanges(namespace, `${prefix}.${key}`, update[key])) {
                changes.push(change);
            }
        }

        return changes;
    }
}

main().catch(e => {
    process.stderr.write(e.toString());
    process.stderr.write('\n');
    process.exit(1);
});
