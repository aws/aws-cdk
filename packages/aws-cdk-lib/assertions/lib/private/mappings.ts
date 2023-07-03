import { filterLogicalId, matchSection, formatSectionMatchFailure } from './section';
import { Template } from './template';

export function findMappings(template: Template, logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string] : {} } = template.Mappings ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasMapping(template: Template, logicalId: string, props: any): string | void {
  const section: { [key: string]: {} } = template.Mappings ?? {};
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  return formatSectionMatchFailure(`mappings with logicalId ${logicalId}`, result);
}