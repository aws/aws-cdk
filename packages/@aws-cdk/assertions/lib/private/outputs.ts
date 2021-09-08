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

export function hasOutput(inspector: StackInspector, props: any): string | void {
  const section: { [key: string]: {} } = inspector.value.Outputs;
  const result = matchSection(section, props);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No outputs found in the template';
  }

  return [
    `Template has ${result.analyzedCount} outputs, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}