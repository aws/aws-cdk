import { StackInspector } from '../vendored/assert';
import { filterLogicalId, formatFailure, matchSection } from './section';

export function findOutputs(inspector: StackInspector, logicalId: string, props: any = {}): { [key: string]: any } {
  const section: { [key: string] : {} } = inspector.value.Outputs;
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasOutput(inspector: StackInspector, logicalId: string, props: any): string | void {
  const section: { [key: string]: {} } = inspector.value.Outputs;
  const result = matchSection(filterLogicalId(section, logicalId), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No outputs named ${logicalId} found in the template.`;
  }

  return [
    `Template has ${result.analyzedCount} outputs named ${logicalId}, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}
