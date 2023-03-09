import { filterLogicalId, matchSection, formatSectionMatchFailure } from './section';
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

  return formatSectionMatchFailure(`outputs named ${logicalId}`, result);
}
