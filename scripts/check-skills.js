#!/usr/bin/env node
/**
 * Checks the skills under skills/: their SKILL.md frontmatter and names, the names
 * they use for each other, each group's README index, and their links into the repository.
 *
 * Usage: node scripts/check-skills.js [<repository root>]
 *
 * Exit code: 0 if there are no errors (warnings allowed), 1 if there are errors,
 *            2 if the root or a file cannot be read
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ALLOWED_KEYS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
const MAX_SKILL_LINES = 500;
const MAX_SYMLINKS = 40;
const BLOB_MAIN = 'https://github.com/aws/aws-cdk/blob/main/';

/** Thrown when the check cannot run at all, as opposed to finding problems. */
class CheckError extends Error {}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/**
 * Checks the skills under `<root>/skills`.
 *
 * Returns { findings, counts, hasSkillsDir }, where each finding is
 * { path, line, severity, rule, message } with a root-relative path.
 */
function checkSkills(repoRoot) {
  const root = path.resolve(repoRoot);
  const findings = [];
  const counts = { skills: 0, markdownFiles: 0, links: 0, fragments: 0 };

  const rootStat = statOrUndefined(fs.statSync, root);
  if (!rootStat || !rootStat.isDirectory()) {
    throw new CheckError(`cannot check ${root}: ${rootStat ? 'not a directory' : 'no such directory'}`);
  }

  const report = (absPath, line, severity, rule, message) => {
    findings.push({ path: toPosix(path.relative(root, absPath)), line, severity, rule, message });
  };

  const skillsDir = path.join(root, 'skills');
  const skillsStat = statOrUndefined(fs.lstatSync, skillsDir);
  if (!skillsStat) {
    return { findings, counts, hasSkillsDir: false };
  }
  if (skillsStat.isSymbolicLink()) {
    report(skillsDir, undefined, 'error', 'symlink', 'skills is a symlink, which is not followed; make it a directory');
    return { findings, counts, hasSkillsDir: true };
  }
  if (!skillsStat.isDirectory()) {
    report(skillsDir, undefined, 'error', 'skills-directory', 'skills is not a directory');
    return { findings, counts, hasSkillsDir: true };
  }

  const markdownFiles = [];
  walk(skillsDir, markdownFiles, report);
  const skillDirs = markdownFiles.filter((f) => path.basename(f) === 'SKILL.md').map((f) => path.dirname(f));
  counts.skills = skillDirs.length;
  counts.markdownFiles = markdownFiles.length;

  const texts = new Map(markdownFiles.map((file) => [file, readText(file)]));
  for (const dir of skillDirs) {
    const file = path.join(dir, 'SKILL.md');
    checkSkillMd(file, texts.get(file), path.basename(dir), report);
  }

  const skillNames = new Set(skillDirs.map((dir) => path.basename(dir)));
  const documents = new Map();
  for (const [file, text] of texts) {
    const doc = parseMarkdown(text);
    documents.set(file, doc);
    checkSkillReferences(file, doc, skillNames, report);
  }

  const context = { root, realRoot: fs.realpathSync(root), rootStat, counts, report, slugsByFile: new Map(), resolved: new Map() };
  for (const [file, doc] of documents) {
    for (const { line, links, unparsedLink } of doc) {
      for (const { target } of links) {
        checkLink(file, line, target, context);
      }
      if (unparsedLink) {
        report(file, line, 'warning', 'link-syntax',
          'this line has link syntax the check cannot parse (nested brackets, or parentheses in the target), so its link is not checked');
      }
    }
  }

  const groups = new Map();
  for (const dir of skillDirs) {
    const group = path.dirname(dir);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group).push(path.basename(dir));
  }
  for (const [group, folders] of groups) {
    checkReadmeIndex(path.join(group, 'README.md'), documents, folders, report);
  }

  findings.sort((a, b) => (a.path === b.path ? (a.line ?? 0) - (b.line ?? 0) : a.path < b.path ? -1 : 1));
  return { findings, counts, hasSkillsDir: true };
}

/** Collects the .md files under `dir` in name order, reporting symlinks without following them. */
function walk(dir, markdownFiles, report) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1));
  } catch (e) {
    throw new CheckError(`cannot read ${dir}: ${e.message}`);
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      report(abs, undefined, 'error', 'symlink', 'symlinks are not allowed under skills/; replace it with the file or directory');
    } else if (entry.isDirectory()) {
      walk(abs, markdownFiles, report);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      markdownFiles.push(abs);
    }
  }
}

function checkSkillMd(file, text, folder, report) {
  const lines = splitLines(text);
  // A final newline ends the last line; it does not start another one.
  const lineCount = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  if (lineCount > MAX_SKILL_LINES) {
    report(file, MAX_SKILL_LINES + 1, 'warning', 'skill-length',
      `SKILL.md is ${lineCount} lines; keep it to ${MAX_SKILL_LINES} or fewer and move detail into reference files`);
  }

  const frontmatter = parseFrontmatter(file, lines, report);
  if (!frontmatter) {
    return;
  }

  const name = frontmatter.get('name');
  if (!name) {
    report(file, 1, 'error', 'name-format', 'frontmatter has no name; add `name: <folder name>`');
  } else {
    const problem = nameFormatProblem(name.value);
    if (problem) {
      report(file, name.line, 'error', 'name-format', `name ${JSON.stringify(name.value)} ${problem}`);
    }
    if (name.value !== folder) {
      report(file, name.line, 'error', 'name-matches-folder', `name ${JSON.stringify(name.value)} must equal its folder name ${JSON.stringify(folder)}`);
    }
    for (const word of ['anthropic', 'claude']) {
      if (name.value.includes(word)) {
        report(file, name.line, 'error', 'reserved-word', `name ${JSON.stringify(name.value)} must not contain the reserved word "${word}"`);
      }
    }
    if (!name.value.startsWith('cdk-') || name.value.includes('cdk-cdk-')) {
      report(file, name.line, 'error', 'cdk-prefix', `name ${JSON.stringify(name.value)} must start with "cdk-" exactly once`);
    }
  }

  const description = frontmatter.get('description');
  const descriptionLength = description ? [...description.value].length : 0;
  if (descriptionLength < 1 || descriptionLength > MAX_DESCRIPTION_LENGTH) {
    report(file, description ? description.line : 1, 'error', 'description-length',
      `description is ${descriptionLength} characters; it must be 1-${MAX_DESCRIPTION_LENGTH}`);
  }
  if (description && hasXmlTag(description.value)) {
    report(file, description.line, 'error', 'xml-tag', 'description must not contain an XML-style tag such as <b>');
  }

  for (const [key, { line }] of frontmatter) {
    if (!ALLOWED_KEYS.has(key)) {
      report(file, line, 'error', 'frontmatter-keys', `unknown frontmatter key ${JSON.stringify(key)}; allowed keys are ${[...ALLOWED_KEYS].join(', ')}`);
    }
  }
}

/**
 * A code span whose whole text looks like a skill name must name a discovered skill.
 * A span `X` where `cdk-X` is a skill is the name from before the `cdk-` prefix was added.
 */
function checkSkillReferences(file, doc, skillNames, report) {
  for (const { line, spans } of doc) {
    for (const span of spans) {
      const text = span.content.trim();
      if (/^cdk-[a-z0-9-]+-(?:review|principles)$/.test(text) && !skillNames.has(text)) {
        report(file, line, 'error', 'skill-reference', `\`${text}\` is not a skill; the skills are ${[...skillNames].sort().join(', ')}`);
      } else if (skillNames.has(`cdk-${text}`)) {
        report(file, line, 'warning', 'skill-reference', `\`${text}\` is a former skill name; use \`cdk-${text}\``);
      }
    }
  }
}

/**
 * A link without a URL scheme, or to this repository's blob/main, must resolve to a file or
 * directory inside the root; a fragment on a .md target must be one of its heading slugs.
 * Containment is checked on the path before any filesystem access, then on each symlink
 * before it is followed.
 */
function checkLink(file, line, target, context) {
  const { root, counts, report, slugsByFile } = context;
  const hash = target.indexOf('#');
  const location = hash < 0 ? target : target.slice(0, hash);
  const fragment = hash < 0 ? '' : target.slice(hash + 1);

  let base;
  let encodedPath;
  if (location.startsWith(BLOB_MAIN)) {
    base = root;
    encodedPath = location.slice(BLOB_MAIN.length);
  } else if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(location) || location.startsWith('//')) {
    return;
  } else {
    base = path.dirname(file);
    encodedPath = location;
  }
  counts.links++;

  let decodedPath;
  let decodedFragment;
  try {
    decodedPath = decodeURIComponent(encodedPath);
    decodedFragment = decodeURIComponent(fragment);
  } catch {
    decodedPath = undefined;
  }
  if (decodedPath === undefined || decodedPath.includes('\0')) {
    report(file, line, 'error', 'link-target', `cannot decode the link target ${JSON.stringify(target)}`);
    return;
  }

  const resolved = base === root || decodedPath !== '' ? path.resolve(base, decodedPath) : file;
  if (!isInside(root, resolved)) {
    report(file, line, 'error', 'link-target', `link target ${JSON.stringify(target)} points outside the repository`);
    return;
  }
  const relative = toPosix(path.relative(root, resolved));
  if (!context.resolved.has(resolved)) {
    context.resolved.set(resolved, resolveInRoot(resolved, context));
  }
  const found = context.resolved.get(resolved);
  if (found.problem) {
    report(file, line, 'error', 'link-target', `link target ${JSON.stringify(target)} ${found.problem}`);
    return;
  }

  if (decodedFragment === '' || !resolved.endsWith('.md')) {
    return;
  }
  if (!found.stat.isFile()) {
    report(file, line, 'error', 'link-target', `link target ${JSON.stringify(target)} is not a regular file, so its headings cannot be checked`);
    return;
  }
  counts.fragments++;
  if (!slugsByFile.has(found.path)) {
    slugsByFile.set(found.path, headingSlugs(parseMarkdown(readText(found.path))));
  }
  const slugs = slugsByFile.get(found.path);
  if (!slugs.has(decodedFragment)) {
    // The hint prints a heading, so take it only from a .md file named by the link itself, not
    // from whatever file a symlink with a .md name points to.
    const closest = found.viaSymlink ? undefined : closestSlug(decodedFragment, slugs);
    report(file, line, 'error', 'link-fragment', `#${decodedFragment} is not a heading in ${relative}`
      + `${closest ? `; the closest heading is #${closest}` : ''}; link to an existing heading or update the link after renaming one`);
  }
}

/** The slug that shares the longest prefix with `fragment`, when that prefix is at least 3 characters. */
function closestSlug(fragment, slugs) {
  let closest;
  let longest = 2;
  for (const slug of slugs) {
    let length = 0;
    while (length < slug.length && slug[length] === fragment[length]) {
      length++;
    }
    if (length > longest) {
      closest = slug;
      longest = length;
    }
  }
  return closest;
}

/**
 * Follows `target`, a path lexically inside the root, one component at a time with lstat, so
 * that no path outside the root is ever touched. A symlink under skills/ (in any letter case,
 * for case-insensitive filesystems) is refused, and any other symlink must point inside the
 * root, by its given or its real path, before it is followed.
 * Returns { path, stat, viaSymlink } for the target, or { problem } saying why it cannot be used.
 */
function resolveInRoot(target, { root, realRoot, rootStat }) {
  const pending = components(root, target);
  let current = root;
  let stat = rootStat;
  let symlinks = 0;
  while (pending.length > 0) {
    const next = path.join(current, pending.shift());
    stat = statOrUndefined(fs.lstatSync, next);
    if (!stat) {
      return { problem: `does not exist: ${toPosix(path.relative(root, target))} not found` };
    }
    if (!stat.isSymbolicLink()) {
      current = next;
      continue;
    }
    if (components(root, next)[0].toLowerCase() === 'skills') {
      return { problem: `goes through ${toPosix(path.relative(root, next))}, a symlink under skills/, which is not followed` };
    }
    let linked = path.resolve(path.dirname(next), readLink(next));
    if (!isInside(root, linked) && isInside(realRoot, linked)) {
      linked = path.join(root, path.relative(realRoot, linked));
    }
    if (!isInside(root, linked)) {
      return { problem: 'points outside the repository' };
    }
    if (++symlinks > MAX_SYMLINKS) {
      return { problem: `goes through more than ${MAX_SYMLINKS} symlinks` };
    }
    pending.unshift(...components(root, linked));
    current = root;
  }
  return { path: current, stat, viaSymlink: symlinks > 0 };
}

function components(root, target) {
  return path.relative(root, target).split(path.sep).filter((part) => part !== '');
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

/**
 * The anchors GitHub generates for ATX headings: the heading text with link syntax and any
 * closing `#` sequence removed, lowercased, keeping only letters, marks, digits, `_`, `-` and
 * spaces, with each space then turned into `-`. A repeated slug gets `-1`, `-2`, ... appended.
 * Not modelled, so links to them fail as unknown fragments: setext headings, emphasis or
 * inline HTML inside a heading, and explicit `<a id>` anchors.
 */
function headingSlugs(doc) {
  const occurrences = new Map();
  for (const { text } of doc) {
    const marker = /^ {0,3}#{1,6}(?=[ \t]|$)/.exec(text);
    if (!marker) {
      continue;
    }
    let heading = text.slice(marker[0].length).trim();
    let end = heading.length;
    while (end > 0 && heading[end - 1] === '#') {
      end--;
    }
    if (end === 0 || heading[end - 1] === ' ' || heading[end - 1] === '\t') {
      heading = heading.slice(0, end).trim();
    }
    heading = heading.replace(/\[([^[\]]*)\]\([^()]*\)/g, '$1');
    const base = heading.toLowerCase().replace(/[^\p{L}\p{M}\p{Nd}_ -]/gu, '').replace(/ /g, '-');
    let slug = base;
    while (occurrences.has(slug)) {
      occurrences.set(base, occurrences.get(base) + 1);
      slug = `${base}-${occurrences.get(base)}`;
    }
    occurrences.set(slug, 0);
  }
  return new Set(occurrences.keys());
}

/** The index table rows of a group README must link each skill folder of the group exactly once. */
function checkReadmeIndex(readme, documents, folders, report) {
  const doc = documents.get(readme);
  if (!doc) {
    report(readme, undefined, 'error', 'readme-index', `missing README.md; add one with a table row linking each skill: ${folders.join(', ')}`);
    return;
  }
  const listed = new Set();
  for (const { line, text, links } of doc) {
    if (!text.trimStart().startsWith('|')) {
      continue;
    }
    for (const { target } of links) {
      const match = /^(?:\.\/)?([^/]+)\/SKILL\.md$/.exec(target);
      if (!match) {
        continue;
      }
      const folder = match[1];
      if (listed.has(folder)) {
        report(readme, line, 'error', 'readme-index', `${folder} is listed more than once in the index table`);
      } else if (!folders.includes(folder)) {
        report(readme, line, 'error', 'readme-index', `${folder} is not a skill folder in this group; the skill folders are ${folders.join(', ')}`);
      }
      listed.add(folder);
    }
  }
  for (const folder of folders) {
    if (!listed.has(folder)) {
      report(readme, 1, 'error', 'readme-index', `skill ${folder} has no row in the index table; add one linking ./${folder}/SKILL.md`);
    }
  }
}

/**
 * Splits markdown into the lines outside fenced code blocks. Each line carries its
 * inline code spans and its inline links and images, ignoring `[...](...)` inside code spans.
 */
function parseMarkdown(text) {
  const result = [];
  let fence;
  splitLines(text).forEach((lineText, i) => {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(lineText);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && lineText.trim() === marker[1]) {
        fence = undefined;
      }
      return;
    }
    if (marker && !(marker[1][0] === '`' && lineText.slice(marker[0].length).includes('`'))) {
      fence = marker[1];
      return;
    }
    const spans = codeSpans(lineText);
    const parts = [];
    let from = 0;
    for (const span of spans) {
      parts.push(lineText.slice(from, span.start), 'x'.repeat(span.end - span.start));
      from = span.end;
    }
    parts.push(lineText.slice(from));
    result.push({ line: i + 1, text: lineText, spans, ...inlineLinks(parts.join('')) });
  });
  return result;
}

/** Finds code spans: a backtick run up to the next run of the same length, in one pass. */
function codeSpans(text) {
  const runs = [...text.matchAll(/`+/g)].map((m) => ({ start: m.index, length: m[0].length }));
  // closers[k] is the next run after run k with the same length.
  const closers = [];
  const nextOfLength = new Map();
  for (let k = runs.length - 1; k >= 0; k--) {
    closers[k] = nextOfLength.get(runs[k].length);
    nextOfLength.set(runs[k].length, k);
  }
  const spans = [];
  for (let k = 0; k < runs.length;) {
    const close = closers[k];
    if (close === undefined) {
      k++;
      continue;
    }
    const { start, length } = runs[k];
    spans.push({ start, end: runs[close].start + length, content: text.slice(start + length, runs[close].start) });
    k = close + 1;
  }
  return spans;
}

/**
 * Inline links and images on one line: `[text](target)` with an optional title. `unparsedLink`
 * is true when a `](` remains that is not part of such a link.
 */
function inlineLinks(text) {
  const links = [];
  const rest = text.replace(/\[[^[\]]*\]\(([^()]*)\)/g, (_, destination) => {
    const inner = destination.trim();
    const target = inner.startsWith('<') && inner.includes('>') ? inner.slice(1, inner.indexOf('>')) : inner.split(/\s/)[0];
    links.push({ target });
    return ' ';
  });
  return { links, unparsedLink: rest.includes('](') };
}

/**
 * Parses the flat `key: value` subset of YAML that skills use.
 * Returns a Map of key to { value, line }, or undefined after reporting a missing block or a syntax error.
 */
function parseFrontmatter(file, lines, report) {
  if (lines[0] !== '---') {
    report(file, 1, 'error', 'frontmatter', 'SKILL.md must start with a "---" line that opens the frontmatter');
    return undefined;
  }
  const end = lines.indexOf('---', 1);
  if (end < 0) {
    report(file, 1, 'error', 'frontmatter', 'frontmatter is not closed by a "---" line');
    return undefined;
  }

  const entries = new Map();
  let valid = true;
  for (let i = 1; i < end; i++) {
    const text = lines[i];
    const line = i + 1;
    if (text.trim() === '') {
      continue;
    }
    const entry = parseEntry(text);
    if (!entry) {
      valid = false;
      report(file, line, 'error', 'frontmatter',
        `unsupported frontmatter line ${JSON.stringify(text)}; only single-line \`key: value\` entries with plain or quoted values are supported`);
    } else if (entries.has(entry.key)) {
      valid = false;
      report(file, line, 'error', 'frontmatter', `duplicate frontmatter key ${JSON.stringify(entry.key)}`);
    } else {
      entries.set(entry.key, { value: entry.value, line });
    }
  }
  // The field rules would only repeat a syntax error as a missing or wrong value.
  return valid ? entries : undefined;
}

/** Returns { key, value } for a single-line `key: value` entry, or undefined for any other form. */
function parseEntry(text) {
  const match = /^([A-Za-z0-9_-]+):(?: (.*))?$/.exec(text);
  if (!match) {
    return undefined;
  }
  const key = match[1];
  const raw = (match[2] ?? '').trim();

  if (raw === '') {
    return { key, value: '' };
  }
  if (raw.startsWith('"')) {
    if (raw.length < 2 || !raw.endsWith('"')) {
      return undefined;
    }
    try {
      return { key, value: JSON.parse(raw) };
    } catch {
      return undefined;
    }
  }
  if (raw.startsWith("'")) {
    const inner = raw.slice(1, -1);
    if (raw.length < 2 || !raw.endsWith("'") || inner.replace(/''/g, '').includes("'")) {
      return undefined;
    }
    return { key, value: inner.replace(/''/g, "'") };
  }
  // A plain scalar: anything that YAML would read as a block scalar, collection,
  // alias, tag, comment or nested mapping is outside the supported subset.
  if (/^[|>[\]{}&*!#%@`,]/.test(raw) || /^[-?:]( |$)/.test(raw) || raw.includes(': ') || raw.endsWith(':') || raw.includes(' #')) {
    return undefined;
  }
  return { key, value: raw };
}

function nameFormatProblem(name) {
  if (name.length < 1 || name.length > MAX_NAME_LENGTH) {
    return `is ${name.length} characters; it must be 1-${MAX_NAME_LENGTH}`;
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    return 'must contain only lowercase letters a-z, digits 0-9 and "-"';
  }
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    return 'must not start or end with "-" or contain "--"';
  }
  return undefined;
}

function hasXmlTag(text) {
  return /<\/?[A-Za-z][^<>]*>/.test(text);
}

function splitLines(text) {
  return text.split(/\r?\n/);
}

function statOrUndefined(stat, p) {
  try {
    return stat(p);
  } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'ENOTDIR') {
      return undefined;
    }
    throw new CheckError(`cannot read ${p}: ${e.message}`);
  }
}

function readLink(link) {
  try {
    return fs.readlinkSync(link);
  } catch (e) {
    throw new CheckError(`cannot read ${link}: ${e.message}`);
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    throw new CheckError(`cannot read ${file}: ${e.message}`);
  }
}

/**
 * Escapes control characters, which can come from the checked files, and the `##[` prefix,
 * so that a value can neither break a line nor form a CI command such as `::error` or `##[error]`.
 */
function printable(text) {
  return text
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, (c) => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .replace(/#(?=#\[)/g, '\\x23');
}

function main(root) {
  const { findings, counts, hasSkillsDir } = checkSkills(root);
  if (!hasSkillsDir) {
    console.log('check-skills: no skills/ directory, nothing to check');
    return 0;
  }
  for (const { path: file, line, severity, rule, message } of findings) {
    console.log(printable(`${file}${line === undefined ? '' : `:${line}`}: ${severity} ${rule}: ${message}`));
  }
  const errors = findings.filter((f) => f.severity === 'error').length;
  console.log(`check-skills: skills: ${counts.skills}, markdown files: ${counts.markdownFiles}, `
    + `links checked: ${counts.links}, fragments checked: ${counts.fragments}, `
    + `errors: ${errors}, warnings: ${findings.length - errors}`);
  if (errors > 0) {
    console.log('check-skills found errors. Fix them, then rerun: node scripts/check-skills.js');
    return 1;
  }
  return 0;
}

// Only execute when run directly from command line (skipped when imported by tests)
if (require.main === module) {
  try {
    process.exitCode = main(process.argv[2] ?? path.join(__dirname, '..'));
  } catch (e) {
    if (!(e instanceof CheckError)) {
      throw e;
    }
    console.error(printable(`check-skills: ${e.message}`));
    process.exitCode = 2;
  }
}

module.exports = { checkSkills };
