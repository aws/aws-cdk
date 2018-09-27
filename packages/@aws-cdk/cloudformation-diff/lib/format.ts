import colors = require('colors/safe');
import { format } from 'util';
import { Difference, isPropertyDifference, ResourceDifference, ResourceImpact } from './diff-template';
import { TemplateDiff } from './diff/types';
import { deepEqual } from './diff/util';

/**
 * Renders template differences to the process' console.
 *
 * @param templateDiff TemplateDiff to be rendered to the console.
 */
export function formatDifferences(stream: NodeJS.WriteStream, templateDiff: TemplateDiff) {
  function print(fmt: string, ...args: any[]) {
    stream.write(colors.white(format(fmt, ...args)) + '\n');
  }

  const ADDITION = colors.green('[+]');
  const UPDATE   = colors.yellow('[~]');
  const REMOVAL  = colors.red('[-]');

  formatDifference('AWSTemplateFormatVersion', templateDiff.awsTemplateFormatVersion);
  formatDifference('Transform', templateDiff.transform);
  formatDifference('Description', templateDiff.description);
  templateDiff.parameters.forEach(formatDifference);
  templateDiff.metadata.forEach(formatDifference);
  templateDiff.mappings.forEach(formatDifference);
  templateDiff.conditions.forEach(formatDifference);
  templateDiff.resources.forEach(formatResourceDifference);
  templateDiff.outputs.forEach(formatDifference);
  templateDiff.unknown.forEach(formatDifference);

  /**
   * Print a simple difference for a given named entity.
   *
   * @param name the name of the entity that is different.
   * @param diff the difference to be rendered.
   */
  function formatDifference(name: string, diff: Difference<any> | undefined) {
    if (!diff) { return; }
    const oldValue = formatValue(diff.oldValue, colors.red);
    const newValue = formatValue(diff.newValue, colors.green);
    if (diff.isAddition) {
      print('%s Added %s: %s', ADDITION, colors.blue(name), newValue);
    } else if (diff.isUpdate) {
      print('%s Updated %s: %s to %s', UPDATE, colors.blue(name), oldValue, newValue);
    } else if (diff.isRemoval) {
      print('%s Removed %s: %s', REMOVAL, colors.blue(name), oldValue);
    }
  }

  /**
   * Print a resource difference for a given logical ID.
   *
   * @param logicalId the logical ID of the resource that changed.
   * @param diff    the change to be rendered.
   */
  function formatResourceDifference(logicalId: string, diff: ResourceDifference) {
    if (diff.isAddition) {
      print('%s %s %s (type: %s)',
        ADDITION,
        formatImpact(diff.changeImpact),
        colors.blue(logicalId),
        formatValue(diff.resourceType, colors.green));
    } else if (diff.isUpdate) {
      print('%s %s %s (type: %s)',
        UPDATE,
        formatImpact(diff.changeImpact),
        colors.blue(logicalId),
        formatValue(diff.resourceType, colors.green));
      let processedCount = 0;
      diff.forEach((type, name, values) => {
        processedCount += 1;
        if (type === 'Property') { name = `.${name}`; }
        formatTreeDiff(name, values, processedCount === diff.count);
      });
    } else if (diff.isRemoval) {
      print('%s %s %s (type: %s)',
        REMOVAL,
        formatImpact(diff.changeImpact),
        colors.blue(logicalId),
        formatValue(diff.resourceType, colors.green));
    }
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
      return colors.yellow('⚠️ May be replacing');
    case ResourceImpact.WILL_REPLACE:
      return colors.bold(colors.yellow('⚠️ Replacing'));
    case ResourceImpact.WILL_DESTROY:
      return colors.bold(colors.red('☢️ Destroying'));
    case ResourceImpact.WILL_ORPHAN:
      return colors.red('🗑 Orphaning');
    case ResourceImpact.WILL_UPDATE:
      return colors.green('🛠 Updating');
    case ResourceImpact.WILL_CREATE:
      return colors.green('🆕 Creating');
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
    print(' %s─ %s %s%s:', last ? '└' : '├', changeTag(diff.oldValue, diff.newValue), colors.blue(`${name}`), additionalInfo);
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
        print('%s   ├─ %s Old value: %s', linePrefix, REMOVAL, formatValue(oldObject, colors.red));
        print('%s   └─ %s New value: %s', linePrefix, ADDITION, formatValue(newObject, colors.green));
      } else if (oldObject !== undefined /* && newObject === undefined */) {
        print('%s   └─ Old value: %s', linePrefix, formatValue(oldObject, colors.red));
      } else /* if (oldObject === undefined && newObject !== undefined) */ {
        print('%s   └─ New value: %s', linePrefix, formatValue(newObject, colors.green));
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
}
