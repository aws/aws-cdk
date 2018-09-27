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
  const attributeChanges = new Array<string>();
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

  line('## Attribute Changes');
  line();
  attributeChanges.forEach(x => line(x));
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

    pushDownFirstAdditions(update);
    for (const key of Object.keys(update)) {
      switch (key) {
      case 'Properties':
        for (const prop of Object.keys(update.Properties)) {
          describeChanges(resourceType, prop, update.Properties[prop]).forEach(change => {
            propertyChanges.push(change);
          });
        }
        break;
      case 'Attributes':
        for (const attr of Object.keys(update.Attributes)) {
          describeChanges(resourceType, attr, update.Attributes[attr]).forEach(change => {
            attributeChanges.push(change);
          });
        }
        break;
      default:
        throw new Error(`Unexpected update to ${resourceType}: ${key}`);
      }
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

  function pushDownFirstAdditions(update: any) {
    for (const key of Object.keys(update)) {
      const added = isAdded(key);
      if (!added) { continue; }
      const data = update[key];
      delete update[key];
      update[added] = {};
      for (const subKey of Object.keys(data)) {
        update[added][`${subKey}__added`] = data[subKey];
      }
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
    }

    if ('__old' in update && '__new' in update) {
      changes.push(`* ${namespace} ${prefix} (__changed__)`);
      changes.push(`  * Old: ${update.__old}`);
      changes.push(`  * New: ${update.__new}`);
      return changes;
    }

    if (Array.isArray(update)) {
      changes.push(`* ${namespace} ${prefix} (__changed__)`);
      for (const entry of update) {
        if (entry.length !== 2) {
          throw new Error(`Unexpected array diff entry: ${JSON.stringify(entry)}`);
        }
        switch (entry[0]) {
        case '+':
          changes.push(`  * Added ${entry[1]}`);
          break;
        case '-':
          throw new Error(`Something awkward happened: ${entry[1]} was deleted from ${namespace} ${prefix}!`);
        case ' ':
          // This entry is "context"
          break;
        default:
          throw new Error(`Unexpected array diff entry: ${JSON.stringify(entry)}`);
        }
      }
    } else {
      for (const key of Object.keys(update)) {
        for (const change of describeChanges(namespace, `${prefix}.${key}`, update[key])) {
          changes.push(change);
        }
      }
    }

    return changes;
  }
}

main().catch(e => {
  process.stderr.write(e.stack);
  process.stderr.write('\n');
  process.exit(1);
});
