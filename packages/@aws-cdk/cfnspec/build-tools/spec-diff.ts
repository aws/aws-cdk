import * as util from 'util';
import * as fs from 'fs-extra';

/* eslint-disable @typescript-eslint/no-require-imports */
const jsonDiff = require('json-diff').diff;
/* eslint-enable */

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

  // Diff operates on PropertyTypes & ResourceTypes
  // Ensure they always exist in the old spec
  if (!oldSpec.PropertyTypes) {
    oldSpec.PropertyTypes = {};
  }
  if (!oldSpec.ResourceTypes) {
    oldSpec.ResourceTypes = {};
  }

  validatePropertyTypeNameConsistency(oldSpec, newSpec);

  const out = jsonDiff(oldSpec, newSpec);

  // Here's the magic output format of this thing
  // If a key ends in __added, it got added, and the value
  //   is the new value.
  // If a key ends in __deleted, it got deleted, and the value
  //   is the old value.
  // If a value got changed, the value object will look like:
  //   { __old: ..., __new: ... }

  if (!out) {
    return; // no diff
  }

  const resourceTypeAdditions = new Set<string>();
  const resourceTypeDeletions = new Set<string>();
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

  if (resourceTypeDeletions.size > 0) {
    line('## Removed Resource Types');
    line();
    resourceTypeDeletions.forEach(type => line(`* ${type}`));
    line();
  }

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
      resourceTypeDeletions.add(deleted);
      return;
    }

    pushDownCompleteChanges(update);

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
        case 'Documentation':
          describeChanges(resourceType, key, update.Documentation).forEach(change => {
            attributeChanges.push(change);
          });
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

    const deleted = isDeleted(propertyType);
    if (deleted) {
      const resourceType = deleted.split('.')[0];
      if (resourceTypeDeletions.has(resourceType)) {
        return; // skipping property for added resource types
      }

      propertyTypeChanges.push(`* ${deleted} (__removed__)`);
      return;
    }

    if (Object.keys(update).length !== 1 && Object.keys(update)[0] === 'Properties') {
      throw new Error('Unexpected update to a resource type. Expecting only "Properties" to change: ' + propertyType);
    }

    for (const prop of Object.keys(update.Properties ?? {})) {
      describeChanges(propertyType, prop, update.Properties[prop]).forEach(change => {
        propertyTypeChanges.push(change);
      });
    }
  }

  /**
   * Push down mass changes to attributes or properties to the individual properties.
   *
   * An example will explain this best. JSON-diff will make the smallest diff, so if there
   * are new properties it will report:
   *
   * "Properties__added": {
   *    "Property1": { ... },
   *    "Property2": { ... },
   * }
   *
   * But we want to see this as:
   *
   * "Properties": {
   *    "Property1__added": { ... },
   *    "Property2__added": { ... },
   * }
   *
   * Same (but in reverse) for deletions.
   */
  function pushDownCompleteChanges(update: Record<string, Record<string, any>>) {
    for (const [category, entries] of Object.entries(update)) {
      const addedKey = isAdded(category);
      if (addedKey) {
        delete update[category];
        update[addedKey] = suffixKeys('__added', entries);
      }

      const deletedKey = isDeleted(category);
      if (deletedKey) {
        delete update[category];
        update[deletedKey] = suffixKeys('__deleted', entries);
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
    return index === -1 ? undefined : key.slice(0, index);
  }

  function suffixKeys(suffix: string, xs: Record<string, any>): Record<string, any> {
    const ret: Record<string, any> = {};
    for (const [key, value] of Object.entries(xs)) {
      ret[key + suffix] = value;
    }
    return ret;
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
        if (entry.length === 1 && entry[0] === ' ') {
          // This means that this element of the array is unchanged
          continue;
        }
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

/**
 * Safeguard check: make sure that all old property type names in the old spec exist in the new spec
 *
 * If not, it's probably because the service team renamed a type between spec
 * version `v(N)` to `v(N+1)`.. In the CloudFormation spec itself, this is not a
 * problem. However, CDK will have generated actual classes and interfaces with
 * the type names at `v(N)`, which people will have written code against. If the
 * classes and interfaces would have a new name at `v(N+1)`, all user code would
 * break.
 */
function validatePropertyTypeNameConsistency(oldSpec: any, newSpec: any) {
  const newPropsTypes = newSpec.PropertyTypes ?? {};
  const disappearedKeys = Object.keys(oldSpec.PropertyTypes ?? {}).filter(k => !(k in newPropsTypes));
  if (disappearedKeys.length === 0) {
    return;
  }

  const exampleJsonPatch = {
    patch: {
      description: 'Undoing upstream property type renames of <SERVICE> because <REASON>',
      operations: disappearedKeys.map((key) => ({
        op: 'move',
        from: `/PropertyTypes/${key.split('.')[0]}.<NEW_TYPE_NAME_HERE>`,
        path: `/PropertyTypes/${key}`,
      })),
    },
  };

  process.stderr.write([
    '┌───────────────────────────────────────────────────────────────────────────────────────┐',
    '│                                                                                       ▐█',
    '│  PROPERTY TYPES HAVE DISAPPEARED                                                      ▐█',
    '│                                                                                       ▐█',
    '│  Some type names have disappeared from the old specification.                         ▐█',
    '│                                                                                       ▐█',
    '│  This probably indicates that the service team renamed one of the types. We have      ▐█',
    '│  to keep the old type names though: renaming them would constitute a breaking change  ▐█',
    '│  to consumers of the L1 resources.                                                    ▐█',
    '│                                                                                       ▐█',
    '└─▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟█',
    '',
    'See what the renames were, check out this PR locally and add a JSON patch file for these types:',
    '',
    '(Example)',
    '',
    JSON.stringify(exampleJsonPatch, undefined, 2),
  ].join('\n'));
  process.exitCode = 1;
}

main().catch(e => {
  process.stderr.write(e.stack);
  process.stderr.write('\n');
  process.exit(1);
});
