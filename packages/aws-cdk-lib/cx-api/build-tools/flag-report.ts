/**
 * Generate FEATURE_FLAGS.md, a report of all current feature flags
 */
import { promises as fs } from 'fs';
import * as path from 'path';
import * as feats from '../lib/features';
import { FlagInfo, FlagType, compareVersions } from '../lib/private/flag-modeling';

async function main() {
  await updateMarkdownFile(path.join(__dirname, '..', 'FEATURE_FLAGS.md'), {
    table: flagsTable(),
    details: flagsDetails(),
    json: recommendedJson(),
    removed: removedFlags(),
    diff: changedFlags(),
    migratejson: migrateJson(),
  });

  // Write to the package root
  await updateRecommendedFlagsFile(path.join(__dirname, '..', '..', 'recommended-feature-flags.json'));
}

function flagsTable() {
  return renderTable([
    ['Flag', 'Summary', 'Since', 'Type'],
    ...v2flags().map(([name, flag]) =>
      [
        renderLink(mdEsc(name), githubHeadingLink(flagDetailsHeading(name, flag))),
        flag.summary,
        flag.introducedIn.v2 ?? '',
        renderType(flag.type),
      ],
    ),
  ]);
}

function removedFlags() {
  const removedInV2 = flags(flag => flag.introducedIn.v2 === undefined && flag.introducedIn.v1 !== undefined);

  return renderTable([
    ['Flag', 'Summary', 'Type', 'Since'],
    ...removedInV2.map(([name, flag]) => [
      renderLink(mdEsc(name), githubHeadingLink(flagDetailsHeading(name, flag))),
      flag.summary,
      renderType(flag.type),
      flag.introducedIn.v1 ?? '',
    ]),
  ]);
}

function changedFlags() {
  const changedInV2 = flags(flag => !!flag.defaults?.v2 && !!flag.introducedIn.v2);

  return renderTable([
    ['Flag', 'Summary', 'Type', 'Since', 'v1 default', 'v2 default'],
    ...changedInV2.map(([name, flag]) => [
      renderLink(mdEsc(name), githubHeadingLink(flagDetailsHeading(name, flag))),
      flag.summary,
      renderType(flag.type),
      flag.introducedIn.v1 ?? '',
      renderValue(false),
      renderValue(flag.defaults?.v2),
    ]),
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
  const allFlags = flags(_ => true);

  return allFlags.flatMap(([name, flag]) => [
    `### ${flagDetailsHeading(name, flag)}`,
    '',
    `*${flag.summary}* ${renderType(flag.type)}`,
    '',
    dedent(flag.detailsMd),
    '',
    renderTable([
      ['Since', 'Default', 'Recommended'],

      // V1
      flag.introducedIn.v1
        ? [flag.introducedIn.v1, renderValue(false), renderValue(flag.recommendedValue)]
        : ['(not in v1)', '', ''],

      // V2
      flag.introducedIn.v2
        ? [flag.introducedIn.v2, renderValue(flag.defaults?.v2 ?? false), renderValue(flag.recommendedValue)]
        : flag.defaults?.v2 !== undefined
          ? ['(default in v2)', renderValue(flag.defaults?.v2), '']
          : ['(not in v2)', '', ''],
    ]),
    ...oldBehavior(flag) ? [
      `**Compatibility with old behavior:** ${oldBehavior(flag)}`,
      '',
    ] : [],
    '',
  ]).join('\n');
}

function oldBehavior(flag: FlagInfo): string | undefined {
  switch (flag.type) {
    case FlagType.ApiDefault: return flag.compatibilityWithOldBehaviorMd;
    case FlagType.BugFix: return flag.compatibilityWithOldBehaviorMd;
    case FlagType.VisibleContext: return undefined;
  }
}

function recommendedJson() {
  return [
    '```json',
    JSON.stringify({ context: feats.CURRENTLY_RECOMMENDED_FLAGS }, undefined, 2),
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
    compareVersions(a[1].introducedIn.v2, b[1].introducedIn.v2),
    compareVersions(a[1].introducedIn.v1, b[1].introducedIn.v1),
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
 * Return the heading that will be used to caption this flag's details
 */
function flagDetailsHeading(name: string, _: FlagInfo) {
  return name;
}

/**
 * Return a link that is valid on GitHub to refer to a heading
 */
function githubHeadingLink(heading: string) {
  return `#${heading.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9_-]/g, '')}`;
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

function renderLink(caption: string, link: string) {
  return `[${caption}](${link})`;
}

function mdEsc(x: string) {
  return x.replace(/_/g, '\\_');
}

async function updateMarkdownFile(filename: string, sections: Record<string, string>) {
  let contents = await fs.readFile(filename, { encoding: 'utf-8' });

  for (const [section, value] of Object.entries(sections)) {
    const re = new RegExp(`<!-- BEGIN ${section} -->(.*)<!-- END ${section} -->`, 's');
    contents = contents.replace(re, `<!-- BEGIN ${section} -->\n${value}\n<!-- END ${section} -->`);
  }

  await fs.writeFile(filename, contents, { encoding: 'utf-8' });
}

async function updateRecommendedFlagsFile(filename: string) {
  await fs.writeFile(filename, JSON.stringify(feats.CURRENTLY_RECOMMENDED_FLAGS, undefined, 2), { encoding: 'utf-8' });
}

function firstCmp(...xs: number[]) {
  return xs.find(x => x !== 0) ?? 0;
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
