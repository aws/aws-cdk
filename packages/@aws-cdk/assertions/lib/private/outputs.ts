import { filterLogicalId, formatFailure, matchSection } from './section';
import { Template } from './template';

export function findOutputs(template: Template, logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section = template.Outputs ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasOutput(template: Template, logicalId: string, props: any): string | void {
  const section: { [key: string]: {} } = template.Outputs ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No outputs named ${logicalId} found in the template (found: ${Object.keys(section).join(', ')})`;
  }

  return [
    `Template has ${result.analyzedCount} outputs named ${logicalId}, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}
