import { Match } from '../match';
import { Matcher } from '../matcher';
import { StackInspector } from '../vendored/assert';
import { formatFailure, matchSection } from './section';

export function findOutputs(inspector: StackInspector, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string] : {} } = inspector.value.Outputs ?? {};
  const result = matchSection(section, matcher);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasOutput(inspector: StackInspector, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string]: {} } = inspector.value.Outputs ?? {};
  const result = matchSection(section, matcher);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No outputs found in the template';
  }

  return [
    `${result.analyzedCount} outputs found, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}