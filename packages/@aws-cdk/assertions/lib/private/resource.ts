import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';
import { StackInspector } from '../vendored/assert';

export function findResources(inspector: StackInspector, type: string, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  let results: { [key: string]: any }[] = [];

  eachEntryInSection(
    inspector.value.Resources,
    (resource) => resource.Type === type,

    (resource) => {
      const result = matcher.test(resource);
      if (!result.hasFailed()) {
        results.push(resource);
      }
    },
  );

  return results;
}

export function hasResource(inspector: StackInspector, type: string, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  let closestResult: MatchResult | undefined = undefined;
  let count: number = 0;

  let match = false;
  eachEntryInSection(
    inspector.value.Resources,
    (resource) => resource.Type === type,

    (resource) => {
      if (match) { return; }
      count++;
      const result = matcher.test(resource);
      if (!result.hasFailed()) {
        match = true;
      }
      if (closestResult === undefined || closestResult.failCount > result.failCount) {
        closestResult = result;
      }
    },
  );

  if (match) {
    return;
  }

  if (closestResult === undefined) {
    return `No resource with type ${type} found`;
  }

  return [
    `${count} resources with type ${type} found, but none match as expected.`,
    formatMessage(
      closestResult,
      // typescript thinks 'closestResult' is never at this point but is not.
      // Not clear why. Force cast.
      (closestResult as unknown as MatchResult).target,
    ),
  ].join('\n');
}

function eachEntryInSection(
  section: any,
  predicate: undefined | ((entry: any) => boolean),
  cb: (resource: {[key: string]: any}) => void): void {

  for (const logicalId of Object.keys(section ?? {})) {
    const resource: { [key: string]: any } = section[logicalId];
    if (predicate === undefined || predicate(resource)) {
      cb(resource);
    }
  }
}

function formatMessage(closestResult: MatchResult, closestResource: {}): string {
  return [
    'The closest result is:',
    reindent(JSON.stringify(closestResource, undefined, 2)),
    'with the following mismatches:',
    ...closestResult.toHumanStrings().map(s => `\t${s}`),
  ].join('\n');
}

function reindent(x: string, indent: number = 2): string {
  const pad = ' '.repeat(indent);
  return pad + x.split('\n').join(`\n${pad}`);
}