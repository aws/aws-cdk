import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';

export type MatchSuccess = { match: true, matches: {[key: string]: any} };
export type MatchFailure = { match: false, closestResult?: MatchResult, analyzedCount: number };

export function matchSection(section: any, props: any): MatchSuccess | MatchFailure {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  let closestResult: MatchResult | undefined = undefined;
  let matching: {[key: string]: any} = {};
  let count = 0;

  eachEntryInSection(
    section,

    (logicalId, entry) => {
      const result = matcher.test(entry);
      result.finished();
      if (!result.hasFailed()) {
        matching[logicalId] = entry;
      } else {
        count++;
        if (closestResult === undefined || closestResult.failCount > result.failCount) {
          closestResult = result;
        }
      }
    },
  );
  if (Object.keys(matching).length > 0) {
    return { match: true, matches: matching };
  } else {
    return { match: false, closestResult, analyzedCount: count };
  }
}

function eachEntryInSection(
  section: any,
  cb: (logicalId: string, entry: {[key: string]: any}) => void): void {

  for (const logicalId of Object.keys(section ?? {})) {
    const resource: { [key: string]: any } = section[logicalId];
    cb(logicalId, resource);
  }
}

export function formatAllMatches(matches: {[key: string]: any}): string {
  return [
    leftPad(JSON.stringify(matches, undefined, 2)),
  ].join('\n');
}

export function formatFailure(closestResult: MatchResult): string {
  return [
    'The closest result is:',
    leftPad(JSON.stringify(closestResult.target, undefined, 2)),
    'with the following mismatches:',
    ...closestResult.toHumanStrings().map(s => `\t${s}`),
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
