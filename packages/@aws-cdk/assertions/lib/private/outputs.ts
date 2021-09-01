import { StackInspector } from '../vendored/assert';
import { formatFailure, matchSection } from './section';

export function findOutputs(inspector: StackInspector, props: any = {}): { [key: string]: any }[] {
  const section: { [key: string] : {} } = inspector.value.Outputs;
  const result = matchSection(section, props);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasOutput(inspector: StackInspector, outputName: string, props: any): string | void {
  const section: { [key: string]: {} } = inspector.value.Outputs;
  const result = matchSection(filterName(section, outputName), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No outputs named ${outputName} found in the template.`;
  }

  return [
    `Template has ${result.analyzedCount} outputs named ${outputName}, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}

function filterName(section: { [key: string]: {} }, outputName: string): { [key: string]: {} } {
  return Object.entries(section ?? {})
    .filter(([k, _]) => k === outputName)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}