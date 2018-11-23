import cxapi = require('@aws-cdk/cx-api');
import Table = require('cli-table');
import colors = require('colors/safe');
import { format } from 'util';
import { Difference, isPropertyDifference, ResourceDifference, ResourceImpact } from './diff-template';
import { DifferenceCollection, TemplateDiff } from './diff/types';
import { deepEqual } from './diff/util';
import { IamChanges } from './iam/iam-changes';

/**
 * Renders template differences to the process' console.
 *
 * @param templateDiff TemplateDiff to be rendered to the console.
 * @param logicalToPathMap A map from logical ID to construct path. Useful in
 *                         case there is no aws:cdk:path metadata in the template.
 */
export function formatDifferences(stream: NodeJS.WriteStream, templateDiff: TemplateDiff, logicalToPathMap: { [logicalId: string]: string } = { }) {
  function print(fmt: string, ...args: any[]) {
    stream.write(colors.white(format(fmt, ...args)) + '\n');
  }

  const ADDITION = colors.green('[+]'); const UPDATE   = colors.yellow('[~]');
  const REMOVAL  = colors.red('[-]');

  if (templateDiff.awsTemplateFormatVersion || templateDiff.transform || templateDiff.description) {
    printSectionHeader('Template');
    formatDifference('AWSTemplateFormatVersion', 'AWSTemplateFormatVersion', templateDiff.awsTemplateFormatVersion);
    formatDifference('Transform', 'Transform', templateDiff.transform);
    formatDifference('Description', 'Description', templateDiff.description);
    printSectionFooter();
  }

  if (!templateDiff.iamChanges.empty) {
    printSectionHeader('Summary of IAM Changes');
    formatIamChanges(templateDiff.iamChanges);
    printSectionFooter();
  }

  formatSection('Parameters', 'Parameter', templateDiff.parameters);
  formatSection('Metadata', 'Metadata', templateDiff.metadata);
  formatSection('Mappings', 'Mapping', templateDiff.mappings);
  formatSection('Conditions', 'Condition', templateDiff.conditions);
  formatSection('Resources', 'Resource', templateDiff.resources, formatResourceDifference);
  formatSection('Outputs', 'Output', templateDiff.outputs);
  formatSection('Other Changes', 'Unknown', templateDiff.unknown);

  function formatSection<V, T extends Difference<V>>(
      title: string,
      entryType: string,
      collection: DifferenceCollection<V, T>,
      formatter: (type: string, id: string, diff: T) => void = formatDifference) {

    if (collection.count === 0) {
      return;
    }

    printSectionHeader(title);
    collection.forEach((id, diff) => formatter(entryType, id, diff));
    printSectionFooter();
  }

  function printSectionHeader(title: string) {
    print(colors.underline(colors.bold(title)));
  }

  function printSectionFooter() {
    print('');
  }

  /**
   * Print a simple difference for a given named entity.
   *
   * @param logicalId the name of the entity that is different.
   * @param diff the difference to be rendered.
   */
  function formatDifference(type: string, logicalId: string, diff: Difference<any> | undefined) {
    if (!diff) { return; }

    let value;

    const oldValue = formatValue(diff.oldValue, colors.red);
    const newValue = formatValue(diff.newValue, colors.green);
    if (diff.isAddition) {
      value = newValue;
    } else if (diff.isUpdate) {
      value = `${oldValue} to ${newValue}`;
    } else if (diff.isRemoval) {
      value = oldValue;
    }

    print(`${formatPrefix(diff)} ${colors.cyan(type)} ${formatLogicalId(logicalId)}: ${value}`);
  }

  /**
   * Print a resource difference for a given logical ID.
   *
   * @param logicalId the logical ID of the resource that changed.
   * @param diff    the change to be rendered.
   */
  function formatResourceDifference(_type: string, logicalId: string, diff: ResourceDifference) {
    const resourceType = diff.isRemoval ? diff.oldResourceType : diff.newResourceType;

    // tslint:disable-next-line:max-line-length
    print(`${formatPrefix(diff)} ${formatValue(resourceType, colors.cyan)} ${formatLogicalId(logicalId, diff)} ${formatImpact(diff.changeImpact)}`);

    if (diff.isUpdate) {
      let processedCount = 0;
      diff.forEach((_, name, values) => {
        processedCount += 1;
        formatTreeDiff(name, values, processedCount === diff.count);
      });
    }
  }

  function formatPrefix<T>(diff: Difference<T>) {
    if (diff.isAddition) { return ADDITION; }
    if (diff.isUpdate) { return UPDATE; }
    if (diff.isRemoval) { return REMOVAL; }
    return colors.white('[?]');
  }

  /**
   * @param value the value to be formatted.
   * @param color the color to be used.
   *
   * @returns the formatted string, with color applied.
   */
  function formatValue(value: any, color: (str: string) => string) {
    if (value == null) { return undefined; }
    if (typeof value === 'string') { return color(value); }
    return color(JSON.stringify(value));
  }

  /**
   * @param impact the impact to be formatted
   * @returns a user-friendly, colored string representing the impact.
   */
  function formatImpact(impact: ResourceImpact) {
    switch (impact) {
    case ResourceImpact.MAY_REPLACE:
      return colors.italic(colors.yellow('may be replaced'));
    case ResourceImpact.WILL_REPLACE:
      return colors.italic(colors.bold(colors.yellow('replace')));
    case ResourceImpact.WILL_DESTROY:
      return colors.italic(colors.bold(colors.red('destroy')));
    case ResourceImpact.WILL_ORPHAN:
      return colors.italic(colors.yellow('orphan'));
    case ResourceImpact.WILL_UPDATE:
    case ResourceImpact.WILL_CREATE:
      return ''; // no extra info is gained here
    }
  }

  /**
   * Renders a tree of differences under a particular name.
   * @param name the name of the root of the tree.
   * @param diff the difference on the tree.
   * @param last whether this is the last node of a parent tree.
   */
  function formatTreeDiff(name: string, diff: Difference<any>, last: boolean) {
    let additionalInfo = '';
    if (isPropertyDifference(diff)) {
      if (diff.changeImpact === ResourceImpact.MAY_REPLACE) {
        additionalInfo = ' (may cause replacement)';
      } else if (diff.changeImpact ===  ResourceImpact.WILL_REPLACE) {
        additionalInfo = ' (requires replacement)';
      }
    }
    print(' %s─ %s %s%s', last ? '└' : '├', changeTag(diff.oldValue, diff.newValue), name, additionalInfo);
    return formatObjectDiff(diff.oldValue, diff.newValue, ` ${last ? ' ' : '│'}`);
  }

  /**
   * Renders the difference between two objects, looking for the differences as deep as possible,
   * and rendering a tree graph of the path until the difference is found.
   *
   * @param oldObject  the old object.
   * @param newObject  the new object.
   * @param linePrefix a prefix (indent-like) to be used on every line.
   */
  function formatObjectDiff(oldObject: any, newObject: any, linePrefix: string) {
    if ((typeof oldObject !== typeof newObject) || Array.isArray(oldObject) || typeof oldObject === 'string' || typeof oldObject === 'number') {
      if (oldObject !== undefined && newObject !== undefined) {
        print('%s   ├─ %s %s', linePrefix, REMOVAL, formatValue(oldObject, colors.red));
        print('%s   └─ %s %s', linePrefix, ADDITION, formatValue(newObject, colors.green));
      } else if (oldObject !== undefined /* && newObject === undefined */) {
        print('%s   └─ %s', linePrefix, formatValue(oldObject, colors.red));
      } else /* if (oldObject === undefined && newObject !== undefined) */ {
        print('%s   └─ %s', linePrefix, formatValue(newObject, colors.green));
      }
      return;
    }
    const keySet = new Set(Object.keys(oldObject));
    Object.keys(newObject).forEach(k => keySet.add(k));
    const keys = new Array(...keySet).filter(k => !deepEqual(oldObject[k], newObject[k])).sort();
    const lastKey = keys[keys.length - 1];
    for (const key of keys) {
      const oldValue = oldObject[key];
      const newValue = newObject[key];
      const treePrefix = key === lastKey ? '└' : '├';
      if (oldValue !== undefined && newValue !== undefined) {
        print('%s   %s─ %s %s:', linePrefix, treePrefix, changeTag(oldValue, newValue), colors.blue(`.${key}`));
        formatObjectDiff(oldValue, newValue, `${linePrefix}   ${key === lastKey ? ' ' : '│'}`);
      } else if (oldValue !== undefined /* && newValue === undefined */) {
        print('%s   %s─ %s Removed: %s', linePrefix, treePrefix, REMOVAL, colors.blue(`.${key}`));
      } else /* if (oldValue === undefined && newValue !== undefined */ {
        print('%s   %s─ %s Added: %s', linePrefix, treePrefix, ADDITION, colors.blue(`.${key}`));
      }
    }
  }

  /**
   * @param oldValue the old value of a difference.
   * @param newValue the new value of a difference.
   *
   * @returns a tag to be rendered in the diff, reflecting whether the difference
   *      was an ADDITION, UPDATE or REMOVAL.
   */
  function changeTag(oldValue: any | undefined, newValue: any | undefined): string {
    if (oldValue !== undefined && newValue !== undefined) {
      return UPDATE;
    } else if (oldValue !== undefined /* && newValue === undefined*/) {
      return REMOVAL;
    } else /* if (oldValue === undefined && newValue !== undefined) */ {
      return ADDITION;
    }
  }

  function formatLogicalId(logicalId: string, diff?: ResourceDifference) {
    // if we have a path in the map, return it
    const path = logicalToPathMap[logicalId];
    if (path) {
      // first component of path is the stack name, so let's remove that
      return normalizePath(path);
    }

    // if we don't have in our map, it might be a deleted resource, so let's try the
    // template metadata
    const oldPathMetadata = diff && diff.oldValue && diff.oldValue.Metadata && diff.oldValue.Metadata[cxapi.PATH_METADATA_KEY];
    if (oldPathMetadata) {
      return normalizePath(oldPathMetadata);
    }

    const newPathMetadata = diff && diff.newValue && diff.newValue.Metadata && diff.newValue.Metadata[cxapi.PATH_METADATA_KEY];
    if (newPathMetadata) {
      return normalizePath(newPathMetadata);
    }

    // couldn't figure out the path, just return the logical ID
    return logicalId;

    /**
     * Path is supposed to start with "/stack-name". If this is the case (i.e. path has more than
     * two components, we remove the first part. Otherwise, we just use the full path.
     * @param p
     */
    function normalizePath(p: string) {
      if (p.startsWith('/')) {
        p = p.substr(1);
      }

      let parts = p.split('/');
      if (parts.length > 1) {
        parts = parts.slice(1);

        // remove the last component if it's "Resource" or "Default" (if we have more than a single component)
        if (parts.length > 1) {
          const last = parts[parts.length - 1];
          if (last === 'Resource' || last === 'Default') {
            parts = parts.slice(0, parts.length - 1);
          }
        }

        p = parts.join('/');
      }

      return `${p} ${colors.gray(logicalId)}`;
    }
  }

  function formatIamChanges(changes: IamChanges) {
    const summary = changes.summarize();
    const head = summary.splice(0, 1)[0];

    const table = new Table({ head, style: { head: [] } });
    table.push(...summary);
    print(table.toString());
  }
}
