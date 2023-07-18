import { filterLogicalId, matchSection, formatSectionMatchFailure } from './section';
import { Template } from './template';

export function findParameters(template: Template, logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string] : {} } = template.Parameters ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasParameter(template: Template, logicalId: string, props: any): string | void {
  const section: { [key: string] : {} } = template.Parameters ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  return formatSectionMatchFailure(`parameters with logicalId '${logicalId}'`, result);
}
