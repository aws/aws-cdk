import cxapi = require('@aws-cdk/cx-api');
import Table = require('cli-table');
import colors = require('colors/safe');
import { format } from 'util';
import { Difference, isPropertyDifference, ResourceDifference, ResourceImpact } from './diff-template';
import { DifferenceCollection, TemplateDiff } from './diff/types';
import { deepEqual } from './diff/util';
import { IamChanges } from './iam/iam-changes';
import { SecurityGroupChanges } from './network/security-group-changes';

/**
 * Renders template differences to the process' console.
 *
 * @param templateDiff TemplateDiff to be rendered to the console.
 * @param logicalToPathMap A map from logical ID to construct path. Useful in
 *                         case there is no aws:cdk:path metadata in the template.
 */
export function formatDifferences(stream: NodeJS.WriteStream, templateDiff: TemplateDiff, logicalToPathMap: { [logicalId: string]: string } = { }) {
  const formatter = new Formatter(stream, logicalToPathMap);

  formatter.readConstructPathsFrom(templateDiff);

  if (templateDiff.awsTemplateFormatVersion || templateDiff.transform || templateDiff.description) {
    formatter.printSectionHeader('Template');
    formatter.formatDifference('AWSTemplateFormatVersion', 'AWSTemplateFormatVersion', templateDiff.awsTemplateFormatVersion);
    formatter.formatDifference('Transform', 'Transform', templateDiff.transform);
    formatter.formatDifference('Description', 'Description', templateDiff.description);
    formatter.printSectionFooter();
  }

  formatSecurityChangesWithBanner(formatter, templateDiff);

  formatter.formatSection('Parameters', 'Parameter', templateDiff.parameters);
  formatter.formatSection('Metadata', 'Metadata', templateDiff.metadata);
  formatter.formatSection('Mappings', 'Mapping', templateDiff.mappings);
  formatter.formatSection('Conditions', 'Condition', templateDiff.conditions);
  formatter.formatSection('Resources', 'Resource', templateDiff.resources, formatter.formatResourceDifference.bind(formatter));
  formatter.formatSection('Outputs', 'Output', templateDiff.outputs);
  formatter.formatSection('Other Changes', 'Unknown', templateDiff.unknown);
}

/**
 * Renders a diff of security changes to the given stream
 */
export function formatSecurityChanges(stream: NodeJS.WriteStream, templateDiff: TemplateDiff, logicalToPathMap: {[logicalId: string]: string} = {}) {
  const formatter = new Formatter(stream, logicalToPathMap);
  formatter.readConstructPathsFrom(templateDiff);

  formatSecurityChangesWithBanner(formatter, templateDiff);
}

function formatSecurityChangesWithBanner(formatter: Formatter, templateDiff: TemplateDiff) {
  // if (templateDiff.iamChanges.
  formatter.formatIamChanges(templateDiff.iamChanges);
  formatter.formatSecurityGroupChanges(templateDiff.securityGroupChanges);
}

const ADDITION = colors.green('[+]');
const UPDATE   = colors.yellow('[~]');
const REMOVAL  = colors.red('[-]');

class Formatter {
  constructor(private readonly stream: NodeJS.WriteStream, private readonly logicalToPathMap: { [logicalId: string]: string }) {
  }

  public print(fmt: string, ...args: any[]) {
    this.stream.write(colors.white(format(fmt, ...args)) + '\n');
  }

  public formatSection<V, T extends Difference<V>>(
      title: string,
      entryType: string,
      collection: DifferenceCollection<V, T>,
      formatter: (type: string, id: string, diff: T) => void = this.formatDifference.bind(this)) {

    if (collection.count === 0) {
      return;
    }

    this.printSectionHeader(title);
    collection.forEach((id, diff) => formatter(entryType, id, diff));
    this.printSectionFooter();
  }

  public printSectionHeader(title: string) {
    this.print(colors.underline(colors.bold(title)));
  }

  public printSectionFooter() {
    this.print('');
  }

  /**
   * Print a simple difference for a given named entity.
   *
   * @param logicalId the name of the entity that is different.
   * @param diff the difference to be rendered.
   */
  public formatDifference(type: string, logicalId: string, diff: Difference<any> | undefined) {
    if (!diff) { return; }

    let value;

    const oldValue = this.formatValue(diff.oldValue, colors.red);
    const newValue = this.formatValue(diff.newValue, colors.green);
    if (diff.isAddition) {
      value = newValue;
    } else if (diff.isUpdate) {
      value = `${oldValue} to ${newValue}`;
    } else if (diff.isRemoval) {
      value = oldValue;
    }

    this.print(`${this.formatPrefix(diff)} ${colors.cyan(type)} ${this.formatLogicalId(logicalId)}: ${value}`);
  }

  /**
   * Print a resource difference for a given logical ID.
   *
   * @param logicalId the logical ID of the resource that changed.
   * @param diff    the change to be rendered.
   */
  public formatResourceDifference(_type: string, logicalId: string, diff: ResourceDifference) {
    const resourceType = diff.isRemoval ? diff.oldResourceType : diff.newResourceType;

    // tslint:disable-next-line:max-line-length
    this.print(`${this.formatPrefix(diff)} ${this.formatValue(resourceType, colors.cyan)} ${this.formatLogicalId(logicalId)} ${this.formatImpact(diff.changeImpact)}`);

    if (diff.isUpdate) {
      let processedCount = 0;
      diff.forEach((_, name, values) => {
        processedCount += 1;
        this.formatTreeDiff(name, values, processedCount === diff.count);
      });
    }
  }

  public formatPrefix<T>(diff: Difference<T>) {
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
  public formatValue(value: any, color: (str: string) => string) {
    if (value == null) { return undefined; }
    if (typeof value === 'string') { return color(value); }
    return color(JSON.stringify(value));
  }

  /**
   * @param impact the impact to be formatted
   * @returns a user-friendly, colored string representing the impact.
   */
  public formatImpact(impact: ResourceImpact) {
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
  public formatTreeDiff(name: string, diff: Difference<any>, last: boolean) {
    let additionalInfo = '';
    if (isPropertyDifference(diff)) {
      if (diff.changeImpact === ResourceImpact.MAY_REPLACE) {
        additionalInfo = ' (may cause replacement)';
      } else if (diff.changeImpact ===  ResourceImpact.WILL_REPLACE) {
        additionalInfo = ' (requires replacement)';
      }
    }
    this.print(' %s─ %s %s%s', last ? '└' : '├', this.changeTag(diff.oldValue, diff.newValue), name, additionalInfo);
    return this.formatObjectDiff(diff.oldValue, diff.newValue, ` ${last ? ' ' : '│'}`);
  }

  /**
   * Renders the difference between two objects, looking for the differences as deep as possible,
   * and rendering a tree graph of the path until the difference is found.
   *
   * @param oldObject  the old object.
   * @param newObject  the new object.
   * @param linePrefix a prefix (indent-like) to be used on every line.
   */
  public formatObjectDiff(oldObject: any, newObject: any, linePrefix: string) {
    if ((typeof oldObject !== typeof newObject) || Array.isArray(oldObject) || typeof oldObject === 'string' || typeof oldObject === 'number') {
      if (oldObject !== undefined && newObject !== undefined) {
        this.print('%s   ├─ %s %s', linePrefix, REMOVAL, this.formatValue(oldObject, colors.red));
        this.print('%s   └─ %s %s', linePrefix, ADDITION, this.formatValue(newObject, colors.green));
      } else if (oldObject !== undefined /* && newObject === undefined */) {
        this.print('%s   └─ %s', linePrefix, this.formatValue(oldObject, colors.red));
      } else /* if (oldObject === undefined && newObject !== undefined) */ {
        this.print('%s   └─ %s', linePrefix, this.formatValue(newObject, colors.green));
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
        this.print('%s   %s─ %s %s:', linePrefix, treePrefix, this.changeTag(oldValue, newValue), colors.blue(`.${key}`));
        this.formatObjectDiff(oldValue, newValue, `${linePrefix}   ${key === lastKey ? ' ' : '│'}`);
      } else if (oldValue !== undefined /* && newValue === undefined */) {
        this.print('%s   %s─ %s Removed: %s', linePrefix, treePrefix, REMOVAL, colors.blue(`.${key}`));
      } else /* if (oldValue === undefined && newValue !== undefined */ {
        this.print('%s   %s─ %s Added: %s', linePrefix, treePrefix, ADDITION, colors.blue(`.${key}`));
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
  public changeTag(oldValue: any | undefined, newValue: any | undefined): string {
    if (oldValue !== undefined && newValue !== undefined) {
      return UPDATE;
    } else if (oldValue !== undefined /* && newValue === undefined*/) {
      return REMOVAL;
    } else /* if (oldValue === undefined && newValue !== undefined) */ {
      return ADDITION;
    }
  }

  /**
   * Find 'aws:cdk:path' metadata in the diff and add it to the logicalToPathMap
   *
   * There are multiple sources of logicalID -> path mappings: synth metadata
   * and resource metadata, and we combine all sources into a single map.
   */
  public readConstructPathsFrom(templateDiff: TemplateDiff) {
    for (const [logicalId, resourceDiff] of Object.entries(templateDiff.resources)) {
      if (!resourceDiff) { continue; }

      const oldPathMetadata = resourceDiff.oldValue && resourceDiff.oldValue.Metadata && resourceDiff.oldValue.Metadata[cxapi.PATH_METADATA_KEY];
      if (oldPathMetadata && !(logicalId in this.logicalToPathMap)) {
        this.logicalToPathMap[logicalId] = oldPathMetadata;
      }

      const newPathMetadata = resourceDiff.newValue && resourceDiff.newValue.Metadata && resourceDiff.newValue.Metadata[cxapi.PATH_METADATA_KEY];
      if (newPathMetadata && !(logicalId in this.logicalToPathMap)) {
        this.logicalToPathMap[logicalId] = newPathMetadata;
      }
    }
  }

  public formatLogicalId(logicalId: string) {
    // if we have a path in the map, return it
    const normalized = this.normalizedLogicalIdPath(logicalId);

    if (normalized) {
      return `${normalized} ${colors.gray(logicalId)}`;
    }

    return logicalId;
  }

  public normalizedLogicalIdPath(logicalId: string): string | undefined {
    // if we have a path in the map, return it
    const path = this.logicalToPathMap[logicalId];
    return path ? normalizePath(path) : undefined;

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
      return p;
    }
  }

  public formatIamChanges(changes: IamChanges) {
    if (!changes.hasChanges) { return; }

    if (changes.statements.hasChanges) {
      this.printSectionHeader('IAM Statement Changes');
      this.print(renderTable(this.deepSubstituteBracedLogicalIds(changes.summarizeStatements())));
    }

    if (changes.managedPolicies.hasChanges) {
      this.printSectionHeader('IAM Policy Changes');
      this.print(renderTable(this.deepSubstituteBracedLogicalIds(changes.summarizeManagedPolicies())));
    }

    this.printSectionFooter();
  }

  public formatSecurityGroupChanges(changes: SecurityGroupChanges) {
    if (!changes.hasChanges) { return; }

    this.printSectionHeader('Summary of Security Group Changes');
    this.print(renderTable(this.deepSubstituteBracedLogicalIds(changes.summarize())));
    this.printSectionFooter();
  }

  public deepSubstituteBracedLogicalIds(rows: string[][]): string[][] {
    return rows.map(row => row.map(this.substituteBracedLogicalIds.bind(this)));
  }

  /**
   * Substitute all strings like ${LogId.xxx} with the path instead of the logical ID
   */
  public substituteBracedLogicalIds(source: string): string {
    return source.replace(/\$\{([^.}]+)(.[^}]+)?\}/ig, (_match, logId, suffix) => {
      return '${' + (this.normalizedLogicalIdPath(logId) || logId) + (suffix || '') + '}';
  });
  }
}

/**
 * Render a two-dimensional array to a visually attractive table
 *
 * First row is considered the table header.
 */
function renderTable(cells: string[][]): string {
  const head = cells.splice(0, 1)[0];

  const table = new Table({ head, style: { head: [] } });
  table.push(...cells);
  return stripHorizontalLines(table.toString());
}

/**
 * Strip horizontal lines in the table rendering if the second-column values are the same
 *
 * We couldn't find a table library that BOTH does newlines-in-cells correctly AND
 * has an option to enable/disable separator lines on a per-row basis. So we're
 * going to do some character post-processing on the table instead.
 */
function stripHorizontalLines(tableRendering: string) {
  const lines = tableRendering.split('\n');

  let i = 3;
  while (i < lines.length - 3) {
    if (secondColumnValue(lines[i]) === secondColumnValue(lines[i + 2])) {
      lines.splice(i + 1, 1);
      i += 1;
    } else {
      i += 2;
    }
  }

  return lines.join('\n');

  function secondColumnValue(line: string) {
    const cols = colors.stripColors(line).split('│').filter(x => x !== '');
    return cols[1];
  }
}
