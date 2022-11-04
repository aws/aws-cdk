import { promises as fs } from 'fs';
import * as path from 'path';
import * as feats from '../lib/features';
import { FlagInfo, FlagType } from '../lib/private/flag-modeling';

async function main() {
  await updateMarkdownFile(path.join(__dirname, '..', 'FEATURE_FLAGS.md'), {
    table: flagsTable(),
    details: flagsDetails(),
    json: recommendedJson(),
    removed: removedFlags(),
    diff: changedFlags(),
    migratejson: migrateJson(),
  });
}

function flagsTable() {
  return renderTable([
    ['Flag', 'Summary', 'Since', 'Type', 'Recommended'],
    ...v2flags().map(([name, flag]) =>
      [name, flag.summary, flag.introducedIn.v2 ?? '', renderType(flag.type), '`' + JSON.stringify(flag.recommendedValue) + '`'],
    ),
  ]);
}

function removedFlags() {
  const removedInV2 = flags(flag => flag.introducedIn.v2 === undefined && flag.introducedIn.v1 !== undefined);

  return renderTable([
    ['Flag', 'Summary', 'Type', 'Since', 'Value in v2'],
    ...removedInV2.map(([name, flag]) =>
      [name, flag.summary, renderType(flag.type), flag.introducedIn.v1 ?? '', renderValue(flag.defaults?.v2)],
    ),
  ]);
}

function changedFlags() {
  const changedInV2 = flags(flag => !!flag.defaults?.v2 && !!flag.introducedIn.v2);

  return renderTable([
    ['Flag', 'Summary', 'Type', 'Since', 'v1 default', 'v2 default'],
    ...changedInV2.map(([name, flag]) =>
      [name, flag.summary, renderType(flag.type), flag.introducedIn.v1 ?? '', renderValue(false), renderValue(flag.defaults?.v2)],
    ),
  ]);
}

function migrateJson() {
  const changedInV2 = flags(flag => !!flag.defaults?.v2 && !!flag.introducedIn.v2);

  const context = Object.fromEntries(changedInV2.map(([name, _]) => [name, false]));

  return [
    '```json',
    JSON.stringify({ context }, undefined, 2),
    '```',
  ].join('\n');
}

function flagsDetails() {
  return v2flags().flatMap(([name, flag]) => [
    `### ${name}`,
    '',
    `${flag.summary} ${renderType(flag.type)}`,
    '',
    dedent(flag.details),
    '',
    `Introduced in **${flag.introducedIn.v2}**, recommended value ${renderValue(flag.recommendedValue)}.`,
    '',
  ]).join('\n');
}

function recommendedJson() {
  return [
    '```json',
    JSON.stringify({ context: feats.NEW_PROJECT_CONTEXT }, undefined, 2),
    '```',
  ].join('\n');
}

function v2flags() {
  return flags(flag => flag.introducedIn.v2 !== undefined);
}

function flags(pred: (x: FlagInfo) => boolean) {
  const entries = Object.entries(feats.FLAGS)
    .filter(([_, flag]) => pred(flag));

  entries.sort((a, b) => firstCmp(
    // Sort by versions first
    cmpVersions(a[1].introducedIn.v2, b[1].introducedIn.v2),
    cmpVersions(a[1].introducedIn.v1, b[1].introducedIn.v1),
    // Then sort by name
    a[0].localeCompare(b[0])));

  return entries;
}

function renderType(type: FlagType): string {
  switch (type) {
    case FlagType.ApiDefault: return '(default)';
    case FlagType.BugFix: return '(fix)';
    case FlagType.VisibleContext: return '(config)';
  }
}

function renderTable(rows: string[][]) {
  return [
    '',
    '| ' + rows[0].join(' | ') + ' |',
    '| ' + rows[0].map(_ => '-----').join(' | ') + ' |',
    ...rows.slice(1).map(row => '| ' + row.join(' | ') + ' |'),
    '',
  ].join('\n');
}

/**
 * Remove shared leading whitespace from all non-empty lines
 */
function dedent(body: string) {
  const lines = body.split('\n').filter((x) => x.trim() !== '');
  const leadingWs = lines.map(x => x.match(/^ */)?.[0].length ?? 0);
  const sharedWs = Math.min(...leadingWs);
  const re = new RegExp('^' + ' '.repeat(sharedWs), 'mg');
  return body.replace(re, '').trim();
}

function renderValue(x: any) {
  return `\`${JSON.stringify(x)}\``;
}

async function updateMarkdownFile(filename: string, sections: Record<string, string>) {
  let contents = await fs.readFile(filename, { encoding: 'utf-8' });

  for (const [section, value] of Object.entries(sections)) {
    const re = new RegExp(`<!-- BEGIN ${section} -->(.*)<!-- END ${section} -->`, 's');
    contents = contents.replace(re, `<!-- BEGIN ${section} -->\n${value}\n<!-- END ${section} -->`);
  }

  await fs.writeFile(filename, contents, { encoding: 'utf-8' });
}

function cmpVersions(a: string | undefined, b: string | undefined): number {
  if (a === undefined && b === undefined) { return 0; }
  if (a === undefined) { return -1; }
  if (b === undefined) { return 1; }

  const as = a.split('.').map(x => parseInt(x, 10));
  const bs = b.split('.').map(x => parseInt(x, 10));

  for (let i = 0; i < Math.min(as.length, bs.length); i++) {
    if (as[i] < bs[i]) { return -1; }
    if (as[i] > bs[i]) { return 1; }
  }
  return as.length - bs.length;
}

function firstCmp(...xs: number[]) {
  return xs.find(x => x !== 0) ?? 0;
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});