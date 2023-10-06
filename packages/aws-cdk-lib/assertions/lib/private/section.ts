import { sortKeyComparator } from './sorting';
import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';

export type MatchSuccess = { match: true, matches: { [key: string]: any }, analyzed: { [key: string]: any }, analyzedCount: number };
export type MatchFailure = { match: false, closestResults: Record<string, MatchResult>, analyzed: { [key: string]: any }, analyzedCount: number };

export function matchSection(section: any, props: any): MatchSuccess | MatchFailure {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  const matching: { [key: string]: any } = {};
  const analyzed: { [key: string]: any } = {};
  const failures = new Array<[string, MatchResult]>();

  eachEntryInSection(
    section,
    (logicalId, entry) => {
      analyzed[logicalId] = entry;
      const result = matcher.test(entry);
      result.finished();
      if (!result.hasFailed()) {
        matching[logicalId] = entry;
      } else {
        failures.push([logicalId, result]);
      }
    },
  );
  if (Object.keys(matching).length > 0) {
    return { match: true, matches: matching, analyzedCount: Object.keys(analyzed).length, analyzed: analyzed };
  } else {
    // Sort by cost, use logicalId as a tie breaker. Take the 3 closest
    // matches (helps debugging in case we get the top pick wrong).
    failures.sort(sortKeyComparator(([logicalId, result]) => [result.failCost, logicalId]));
    const closestResults = Object.fromEntries(failures.slice(0, 3));
    return { match: false, closestResults, analyzedCount: Object.keys(analyzed).length, analyzed: analyzed };
  }
}

function eachEntryInSection(
  section: any,
  cb: (logicalId: string, entry: { [key: string]: any }) => void): void {

  for (const logicalId of Object.keys(section ?? {})) {
    const resource: { [key: string]: any } = section[logicalId];
    cb(logicalId, resource);
  }
}

export function formatAllMatches(matches: { [key: string]: any }): string {
  return [
    leftPad(JSON.stringify(matches, undefined, 2)),
  ].join('\n');
}

export function formatAllMismatches(analyzed: { [key: string]: any }, matches: { [key: string]: any } = {}): string {
  return [
    'The following resources do not match the given definition:',
    ...Object.keys(analyzed).filter(id => !(id in matches)).map(id => `\t${id}`),
  ].join('\n');
}

export function formatSectionMatchFailure(qualifier: string, result: MatchFailure, what='Template'): string {
  return [
    `${what} has ${result.analyzedCount} ${qualifier}`,
    result.analyzedCount > 0 ? ', but none match as expected' : '',
    '.\n',
    formatFailure(result.closestResults),
  ].join('');
}

export function formatFailure(closestResults: Record<string, MatchResult>): string {
  const keys = Object.keys(closestResults);
  if (keys.length === 0) {
    return 'No matches found';
  }

  return [
    `The ${keys.length} closest matches:`,
    ...keys.map(key => `${key} :: ${closestResults[key].renderMismatch()}`),
  ].join('\n');
}

function leftPad(x: string, indent: number = 2): string {
  const pad = ' '.repeat(indent);
  return pad + x.split('\n').join(`\n${pad}`);
}

export function filterLogicalId(section: { [key: string]: {} }, logicalId: string): { [key: string]: {} } {
  // default signal for all logicalIds is '*'
  if (logicalId === '*') return section;

  return Object.entries(section ?? {})
    .filter(([k, _]) => k === logicalId)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}
