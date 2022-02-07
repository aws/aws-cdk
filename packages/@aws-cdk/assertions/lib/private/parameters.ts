import { filterLogicalId, formatFailure, matchSection } from './section';
import { Template, Parameter } from './template';

export function findParameters(template: Template, logicalId: string, props: any = {}): { [key: string]: Parameter } {
  const section = template.Parameters ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasParameter(template: Template, logicalId: string, props: any): string | void {
  const section = template.Parameters ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No parameters found in the template';
  }

  return [
    `Template has ${result.analyzedCount} parameters, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}
