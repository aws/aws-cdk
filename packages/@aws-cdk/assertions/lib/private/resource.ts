import { Match } from '../match';
import { Matcher } from '../matcher';
import { StackInspector } from '../vendored/assert';
import { formatFailure, matchSection } from './section';

// Partial type for CloudFormation Resource
type Resource = {
  Type: string;
}

export function findResources(inspector: StackInspector, type: string, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string] : Resource } = inspector.value.Resources ?? {};
  const result = matchSection(filterType(section, type), matcher);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasResource(inspector: StackInspector, type: string, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string]: Resource } = inspector.value.Resources ?? {};
  const result = matchSection(filterType(section, type), matcher);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No resource with type ${type} found`;
  }

  return [
    `${result.analyzedCount} resources with type ${type} found, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}

function filterType(section: { [key: string]: Resource }, type: string): { [key: string]: Resource } {
  return Object.entries(section)
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}