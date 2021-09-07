import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';

export type MatchSuccess = { match: true, matches: any[] };
export type MatchFailure = { match: false, closestResult?: MatchResult, analyzedCount: number };

export function matchSection(section: any, props: any): MatchSuccess | MatchFailure {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
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
    return { match: false, closestResult, analyzedCount: count };
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

export function filterLogicalId(section: { [key: string]: {} }, outputName: string): { [key: string]: {} } {
  // default signal for all outputs is '*'
  if (outputName === '*') return section;

  return Object.entries(section ?? {})
    .filter(([k, _]) => k === outputName)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}