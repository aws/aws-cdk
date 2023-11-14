import { filterLogicalId, matchSection, formatSectionMatchFailure } from './section';
import { Template } from './template';

export function findConditions(template: Template, logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string] : {} } = template.Conditions ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasCondition(template: Template, logicalId: string, props: any): string | void {
  const section: { [key: string] : {} } = template.Conditions ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  return formatSectionMatchFailure(`conditions with logicalId ${logicalId}`, result);
}
