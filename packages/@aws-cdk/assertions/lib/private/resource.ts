import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';
import { StackInspector } from '../vendored/assert';

export function findResources(inspector: StackInspector, type: string, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string] : any } = inspector.value.Resources ?? {};
  const filteredSection = Object.entries(section)
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
  const result = matchUp(filteredSection, matcher);

  if (!result.match) {
    return [];
  }

  return result.matches;
}

export function hasResource(inspector: StackInspector, type: string, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);

  const section: { [key: string] : any } = inspector.value.Resources ?? {};
  const filteredSection = Object.entries(section)
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
  const result = matchUp(filteredSection, matcher);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No resource with type ${type} found`;
  }

  return [
    `${result.count} resources with type ${type} found, but none match as expected.`,
    formatMessage(
      result.closestResult,
      result.closestResult.target,
    ),
  ].join('\n');
}

type MatchSuccess = { match: true, matches: any[] };
type MatchFailure = { match: false, closestResult?: MatchResult, count: number };

function matchUp(section: any, matcher: Matcher): MatchSuccess | MatchFailure {
  let closestResult: MatchResult | undefined = undefined;
  let matching: any[] = [];
  let count = 0;

  eachEntryInSection(
    section,

    (entry) => {
      const result = matcher.test(entry);
      if (!result.hasFailed()) {
        matching.push(entry);
      } else {
        count++;
        if (closestResult === undefined || closestResult.failCount > result.failCount) {
          closestResult = result;
        }
      }
    },
  );

  if (matching.length > 0) {
    return { match: true, matches: matching };
  } else {
    return { match: false, closestResult, count };
  }
}

function eachEntryInSection(
  section: any,
  cb: (entry: {[key: string]: any}) => void): void {

  for (const logicalId of Object.keys(section ?? {})) {
    const resource: { [key: string]: any } = section[logicalId];
    cb(resource);
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