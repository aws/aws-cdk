import { Match } from '../match';
import { Matcher } from '../matcher';
import { StackInspector } from '../vendored/assert';
import { formatFailure, matchSection } from './section';

export function findMappings(inspector: StackInspector, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string] : {} } = inspector.value.Mappings ?? {};
  const result = matchSection(section, matcher);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasMapping(inspector: StackInspector, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string]: {} } = inspector.value.Mappings ?? {};
  const result = matchSection(section, matcher);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No mappings found in the template';
  }

  return [
    `Template has ${result.analyzedCount} mappings, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}