import { filterLogicalId, formatFailure, matchSection } from './section';
import { Template, Condition } from './template';

export function findConditions(template: Template, logicalId: string, props: any = {}): { [key: string]: Condition } {
  const section = template.Conditions ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasCondition(template: Template, logicalId: string, props: any): string | void {
  const section = template.Conditions ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No conditions found in the template';
  }

  return [
    `Template has ${result.analyzedCount} conditions, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}
