'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const { builtinModules } = require('module');
const os = require('os');
const path = require('path');
const { checkSkills } = require('../../check-skills');

const SCRIPT = path.join(__dirname, '..', '..', 'check-skills.js');

// ─── Helpers ────────────────────────────────────────────────────────────────────

const tempDirs = [];

afterAll(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function tempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-skills-'));
  tempDirs.push(dir);
  return dir;
}

function writeFiles(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
}

function skillMd({ name, description = 'Reviews one aspect of a change.', frontmatter, body = '# Review\n\nBody text.\n' }) {
  const lines = frontmatter ?? [`name: ${name}`, `description: ${description}`];
  return ['---', ...lines, '---', '', body].join('\n');
}

function readme(folders) {
  const rows = folders.map((f) => `| [\`${f}\`](./${f}/SKILL.md) | Something |`);
  return ['# Skills', '', '| Skill | Reviews |', '|---|---|', ...rows, ''].join('\n');
}

const GROUP = 'skills/cdk-review';
const SKILL = 'cdk-alpha-review';
const SKILL_PATH = `${GROUP}/${SKILL}/SKILL.md`;

/** A repository with two valid skills in one group, plus any extra or replaced files. */
function repo(files = {}) {
  const root = tempDir();
  writeFiles(root, {
    [`${GROUP}/README.md`]: readme([SKILL, 'cdk-beta-principles']),
    [SKILL_PATH]: skillMd({ name: SKILL }),
    [`${GROUP}/cdk-beta-principles/SKILL.md`]: skillMd({ name: 'cdk-beta-principles' }),
    ...files,
  });
  return root;
}

/** The findings without their messages, for exact comparison. */
function located(result) {
  return result.findings.map(({ path: p, line, severity, rule }) => ({ path: p, line, severity, rule }));
}

function oneError(rule, line, p = SKILL_PATH) {
  return [{ path: p, line, severity: 'error', rule }];
}

function withFrontmatter(...lines) {
  return repo({ [SKILL_PATH]: skillMd({ frontmatter: lines }) });
}

// ─── Tests ──────────────────────────────────────────────────────────────────────

describe('check-skills frontmatter and names', () => {
  test('a repository of valid skills has no findings', () => {
    const result = checkSkills(repo());
    expect(result.findings).toEqual([]);
    expect(result.counts.skills).toBe(2);
  });

  test('fails a SKILL.md without frontmatter', () => {
    const result = checkSkills(repo({ [SKILL_PATH]: '# Review\n\nNo frontmatter.\n' }));
    expect(located(result)).toEqual(oneError('frontmatter', 1));
  });

  test('fails frontmatter that is never closed', () => {
    const result = checkSkills(repo({ [SKILL_PATH]: `---\nname: ${SKILL}\ndescription: Reviews.\n\n# Review\n` }));
    expect(located(result)).toEqual(oneError('frontmatter', 1));
  });

  // The Agent Skills spec makes `metadata` a map, which this single-line parser does not support.
  test('fails a metadata map, naming the line and the single-line rule', () => {
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: Reviews.', 'metadata:', '  owner: cdk'));
    expect(located(result)).toEqual(oneError('frontmatter', 5));
    expect(result.findings[0].message).toContain('single-line');
  });

  test.each([
    ['a block scalar', 'description: >'],
    ['a list item', '- item'],
    ['a flow sequence', 'description: [a, b]'],
  ])('fails %s in frontmatter', (_, line) => {
    const lines = line.startsWith('description')
      ? [`name: ${SKILL}`, line]
      : [`name: ${SKILL}`, 'description: Reviews.', line];
    const result = checkSkills(withFrontmatter(...lines));
    expect(located(result)).toEqual(oneError('frontmatter', lines.length + 1));
    expect(result.findings[0].message).toContain('single-line');
  });

  test('fails a duplicate key', () => {
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: Reviews.', 'description: Again.'));
    expect(located(result)).toEqual(oneError('frontmatter', 4));
    expect(result.findings[0].message).toContain('description');
  });

  test('accepts a double-quoted description that contains ":" and "—"', () => {
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: "Reviewer: checks one thing — and `code` too."'));
    expect(result.findings).toEqual([]);
  });

  test('accepts a single-quoted description', () => {
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, "description: 'It''s a reviewer: yes'"));
    expect(result.findings).toEqual([]);
  });

  /** A repository whose first skill is renamed, folder included. */
  function renamedSkill(name) {
    const root = repo({
      [`${GROUP}/README.md`]: readme([name, 'cdk-beta-principles']),
      [`${GROUP}/${name}/SKILL.md`]: skillMd({ name }),
    });
    fs.rmSync(path.join(root, GROUP, SKILL), { recursive: true });
    return { root, skillPath: `${GROUP}/${name}/SKILL.md` };
  }

  test.each([
    ['uppercase', 'cdk-Alpha-review'],
    ['a trailing hyphen', 'cdk-alpha-review-'],
    ['a doubled hyphen', 'cdk--alpha-review'],
    ['an underscore', 'cdk-alpha_review'],
  ])('fails a name with %s', (_, name) => {
    const { root, skillPath } = renamedSkill(name);
    expect(located(checkSkills(root))).toEqual(oneError('name-format', 2, skillPath));
  });

  test('fails a name with a leading hyphen, which also lacks the cdk- prefix', () => {
    const { root, skillPath } = renamedSkill('-cdk-alpha-review');
    expect(located(checkSkills(root))).toEqual([
      ...oneError('name-format', 2, skillPath),
      ...oneError('cdk-prefix', 2, skillPath),
    ]);
  });

  test('accepts a 64-character name and fails a 65-character name', () => {
    const name64 = `cdk-${'a'.repeat(53)}-review`;
    const name65 = `cdk-${'a'.repeat(54)}-review`;
    expect(name64).toHaveLength(64);
    expect(name65).toHaveLength(65);
    expect(checkSkills(renamedSkill(name64).root).findings).toEqual([]);
    const { root, skillPath } = renamedSkill(name65);
    expect(located(checkSkills(root))).toEqual(oneError('name-format', 2, skillPath));
  });

  test('fails a missing name', () => {
    const result = checkSkills(withFrontmatter('description: Reviews.'));
    expect(located(result)).toEqual(oneError('name-format', 1));
  });

  test('fails a well-formed name that differs from its folder', () => {
    const result = checkSkills(withFrontmatter('name: cdk-gamma-review', 'description: Reviews.'));
    expect(located(result)).toEqual(oneError('name-matches-folder', 2));
    expect(result.findings[0].message).toContain('cdk-gamma-review');
    expect(result.findings[0].message).toContain(SKILL);
  });

  test('accepts a 1024-character description and fails a 1025-character one', () => {
    expect(checkSkills(withFrontmatter(`name: ${SKILL}`, `description: ${'d'.repeat(1024)}`)).findings).toEqual([]);
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, `description: ${'d'.repeat(1025)}`));
    expect(located(result)).toEqual(oneError('description-length', 3));
  });

  test('counts description length in characters, not bytes', () => {
    expect(checkSkills(withFrontmatter(`name: ${SKILL}`, `description: ${'é'.repeat(1024)}`)).findings).toEqual([]);
  });

  test('fails an empty name with its length', () => {
    const result = checkSkills(withFrontmatter('name:', 'description: Reviews.'));
    const format = result.findings.filter((f) => f.rule === 'name-format');
    expect(located({ findings: format })).toEqual(oneError('name-format', 2));
    expect(format[0].message).toContain('is 0 characters; it must be 1-64');
  });

  test('fails a missing or empty description', () => {
    expect(located(checkSkills(withFrontmatter(`name: ${SKILL}`)))).toEqual(oneError('description-length', 1));
    expect(located(checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: ""')))).toEqual(oneError('description-length', 3));
  });

  test('accepts every allowed key and fails an unknown key', () => {
    const allowed = [`name: ${SKILL}`, 'description: Reviews.', 'license: Apache-2.0', 'compatibility: any agent', 'allowed-tools: Read'];
    expect(checkSkills(withFrontmatter(...allowed)).findings).toEqual([]);
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: Reviews.', 'version: 1'));
    expect(located(result)).toEqual(oneError('frontmatter-keys', 4));
    expect(result.findings[0].message).toContain('version');
  });

  test('fails an XML-style tag in the description', () => {
    const result = checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: Reviews <b>things</b>.'));
    expect(located(result)).toEqual(oneError('xml-tag', 3));
  });

  test('accepts a description with a bare "<" comparison', () => {
    expect(checkSkills(withFrontmatter(`name: ${SKILL}`, 'description: Flags a < b and 3-7 comments.')).findings).toEqual([]);
  });

  test.each(['anthropic', 'claude'])('fails a name containing the reserved word %s', (word) => {
    const { root, skillPath } = renamedSkill(`cdk-${word}-review`);
    expect(located(checkSkills(root))).toEqual(oneError('reserved-word', 2, skillPath));
  });

  test.each([
    ['without the cdk- prefix', 'alpha-review'],
    ['with a doubled cdk- prefix', 'cdk-cdk-alpha-review'],
  ])('fails a name %s', (_, name) => {
    const { root, skillPath } = renamedSkill(name);
    expect(located(checkSkills(root))).toEqual(oneError('cdk-prefix', 2, skillPath));
  });

  test('applies every rule to a skill in a second group', () => {
    const root = repo({
      'skills/other/README.md': readme(['beta-tools']),
      'skills/other/beta-tools/SKILL.md': skillMd({ name: 'beta-tools' }),
    });
    expect(located(checkSkills(root))).toEqual(oneError('cdk-prefix', 2, 'skills/other/beta-tools/SKILL.md'));
    expect(checkSkills(root).counts.skills).toBe(3);
  });
});

describe('check-skills parsing guards', () => {
  // In order of consequence: a lone quote inside a single-quoted value is invalid YAML that
  // would otherwise pass; a fence line with an info string must not close the fence; a NUL in
  // a link is a finding, not a failure to run; CRLF line endings still parse.
  test.each([
    ['a lone quote in a single-quoted value fails', { [SKILL_PATH]: skillMd({ frontmatter: [`name: ${SKILL}`, "description: 'it's a reviewer'"] }) },
      oneError('frontmatter', 3)],
    ['a fence line with an info string does not close the fence', { [SKILL_PATH]: skillMd({ name: SKILL, body: '```\n```md\n[x](missing.md)\n```\n' }) },
      []],
    ['a NUL in a link target is a finding', { [SKILL_PATH]: skillMd({ name: SKILL, body: '[x](docs%00.md)' }) },
      oneError('link-target', 6)],
    ['CRLF line endings parse', { [SKILL_PATH]: skillMd({ name: SKILL }).replace(/\n/g, '\r\n') },
      []],
  ])('%s', (_, files, expected) => {
    expect(located(checkSkills(repo(files)))).toEqual(expected);
  });
});

describe('check-skills SKILL.md length', () => {
  /** A SKILL.md of exactly `count` lines, ending with a newline that does not add a line. */
  function skillOfLines(count) {
    const head = ['---', `name: ${SKILL}`, 'description: Reviews.', '---'];
    const body = Array.from({ length: count - head.length }, (_, i) => `Line ${i + 1}.`);
    return [...head, ...body].join('\n') + '\n';
  }

  test('a 500-line SKILL.md gets no warning', () => {
    expect(checkSkills(repo({ [SKILL_PATH]: skillOfLines(500) })).findings).toEqual([]);
  });

  test('a 501-line SKILL.md gets a warning and no error', () => {
    const result = checkSkills(repo({ [SKILL_PATH]: skillOfLines(501) }));
    expect(located(result)).toEqual([{ path: SKILL_PATH, line: 501, severity: 'warning', rule: 'skill-length' }]);
    expect(result.findings[0].message).toContain('501');
  });
});

describe('check-skills skill names in text', () => {
  const REF_PATH = `${GROUP}/${SKILL}/references/rules.md`;

  function withReference(...lines) {
    return checkSkills(repo({ [REF_PATH]: ['# Rules', '', ...lines, ''].join('\n') }));
  }

  test('accepts code spans that name real skills', () => {
    expect(withReference('Apply `cdk-beta-principles` and ``cdk-alpha-review`` first.').findings).toEqual([]);
  });

  test('fails a code span naming an unknown skill', () => {
    const result = withReference('See `cdk-perf-review` too.');
    expect(located(result)).toEqual(oneError('skill-reference', 3, REF_PATH));
    expect(result.findings[0].message).toContain('cdk-perf-review');
  });

  test('fails an unknown principles skill', () => {
    expect(located(withReference('', 'Apply `cdk-gamma-principles`.'))).toEqual(oneError('skill-reference', 4, REF_PATH));
  });

  test('warns on a bare pre-rename skill name', () => {
    const result = withReference('Run `alpha-review` next.');
    expect(located(result)).toEqual([{ path: REF_PATH, line: 3, severity: 'warning', rule: 'skill-reference' }]);
    expect(result.findings[0].message).toContain('cdk-alpha-review');
  });

  test('ignores names in fenced blocks, in plain text and in longer code spans', () => {
    const result = withReference(
      '```sh',
      'echo `cdk-perf-review` `alpha-review`',
      '```',
      'Plain cdk-perf-review text and `npx cdk-perf-review --x`.',
      '~~~',
      '`cdk-perf-review`',
      '~~~',
    );
    expect(result.findings).toEqual([]);
  });
});

describe('check-skills README index', () => {
  const README = `${GROUP}/README.md`;

  function withReadme(text) {
    return checkSkills(repo({ [README]: text }));
  }

  test('accepts rows with or without "./", and ignores prose links to a skill', () => {
    const text = [
      '# Skills',
      '',
      '| Skill | Reviews |',
      '|---|---|',
      `| [\`${SKILL}\`](${SKILL}/SKILL.md) | A |`,
      '| [`cdk-beta-principles`](./cdk-beta-principles/SKILL.md) | B |',
      '',
      `Start with [the alpha skill](./${SKILL}/SKILL.md).`,
      '',
    ].join('\n');
    expect(withReadme(text).findings).toEqual([]);
  });

  test('fails a README with a skill row removed', () => {
    const result = withReadme(readme([SKILL]));
    expect(located(result)).toEqual(oneError('readme-index', 1, README));
    expect(result.findings[0].message).toContain('cdk-beta-principles');
  });

  // A row for a folder that is not a skill also links a missing SKILL.md; only the index findings matter here.
  function indexFindings(result) {
    return result.findings.filter((f) => f.rule === 'readme-index');
  }

  test('fails a README with a row for a folder that is not a skill', () => {
    const result = withReadme(readme([SKILL, 'cdk-beta-principles', 'gamma-tools']));
    expect(located({ findings: indexFindings(result) })).toEqual(oneError('readme-index', 7, README));
    expect(indexFindings(result)[0].message).toContain('gamma-tools');
  });

  test('fails a README with the right number of rows but one wrong folder', () => {
    const result = withReadme(readme([SKILL, 'gamma-tools']));
    expect(located({ findings: indexFindings(result) })).toEqual([...oneError('readme-index', 1, README), ...oneError('readme-index', 6, README)]);
  });

  test('fails a README with a duplicate row', () => {
    const result = withReadme(readme([SKILL, 'cdk-beta-principles', SKILL]));
    expect(located(result)).toEqual(oneError('readme-index', 7, README));
    expect(result.findings[0].message).toContain('more than once');
  });

  test('fails a group without a README', () => {
    const root = repo();
    fs.rmSync(path.join(root, README));
    expect(located(checkSkills(root))).toEqual([{ path: README, line: undefined, severity: 'error', rule: 'readme-index' }]);
  });
});

describe('check-skills links', () => {
  const BLOB = 'https://github.com/aws/aws-cdk/blob/main';
  const DOC = [
    '# Guide',
    '',
    '## Backward Compatibility & Deprecation',
    '',
    '## Import (`from*`) Methods',
    '',
    '## Grants / Metrics — Events',
    '',
    '## Notes',
    '',
    '### Notes',
    '',
    '## See [the docs](./other.md) ##',
    '',
    '```md',
    '## Fenced Heading',
    '```',
    '',
    '#notheading',
    '',
    '````md',
    '```',
    '## Inside Long Fence',
    '````',
    '',
    '## Café',
    '',
  ].join('\n');

  /** A repository whose first skill has `body` and whose docs/guide.md is DOC. */
  function withBody(body, files = {}) {
    return repo({ [SKILL_PATH]: skillMd({ name: SKILL, body }), 'docs/guide.md': DOC, ...files });
  }

  // The skill body starts on line 6, after four frontmatter lines and a blank line.
  const BODY_LINE = 6;
  // The README index rows link each of the two skills.
  const README_LINKS = 2;

  test.each([
    ['a relative link', '[guide](../../../docs/guide.md)'],
    ['a relative link with a heading fragment', '[guide](../../../docs/guide.md#notes)'],
    ['a relative image', '![logo](../../../docs/guide.md)'],
    ['a link whose text is a code span', '[`guide`](../../../docs/guide.md)'],
    ['a link with a title', '[guide](../../../docs/guide.md "The guide")'],
    ['a blob/main link', `[guide](${BLOB}/docs/guide.md#guide)`],
    ['a blob/main link to a directory', `[docs](${BLOB}/docs)`],
    ['a fragment on a .ts target, which is not checked', `[code](${BLOB}/lib/code.ts#L10)`],
  ])('accepts %s', (_, link) => {
    const result = checkSkills(withBody(link, { 'lib/code.ts': 'export {};\n' }));
    expect(result.findings).toEqual([]);
    expect(result.counts.links).toBe(README_LINKS + 1);
  });

  test.each([
    ['"&" and "—" and "/"', 'backward-compatibility--deprecation'],
    ['backticks and parentheses', 'import-from-methods'],
    ['"/" and "—"', 'grants--metrics--events'],
    ['a repeated heading, through its -1 slug', 'notes-1'],
    ['link syntax and a closing sequence', 'see-the-docs'],
    ['a letter outside ASCII, through a percent-encoded fragment', 'caf%C3%A9'],
  ])('resolves a heading with %s', (_, slug) => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/guide.md#${slug})`));
    expect(result.findings).toEqual([]);
    expect(result.counts.fragments).toBe(1);
  });

  test('resolves a fragment-only link against the file itself', () => {
    const result = checkSkills(withBody('## Local Heading\n\nSee [above](#local-heading).'));
    expect(result.findings).toEqual([]);
    expect(result.counts).toMatchObject({ links: README_LINKS + 1, fragments: 1 });
  });

  test('fails a missing relative target', () => {
    const result = checkSkills(withBody('See [rules](references/missing.md).'));
    expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
    expect(result.findings[0].message).toContain('references/missing.md');
  });

  test('fails a link whose text is a code span and whose target is missing', () => {
    const result = checkSkills(withBody('[`cdk-beta-principles`](../cdk-beta-principle/SKILL.md)'));
    expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
  });

  test('fails a missing blob/main path', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/missing.md#guide)`));
    expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
    expect(result.counts.fragments).toBe(0);
  });

  test('fails an unknown fragment', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/guide.md#security-rules)`));
    expect(located(result)).toEqual(oneError('link-fragment', BODY_LINE));
    expect(result.findings[0].message).toContain('#security-rules');
    expect(result.findings[0].message).toContain('docs/guide.md');
  });

  test.each([
    ['only inside a fenced block', 'fenced-heading'],
    ['only inside a longer fence that a shorter marker does not close', 'inside-long-fence'],
    ['only a "#" line without a space, which is not a heading', 'notheading'],
  ])('fails a fragment that matches a heading %s', (_, slug) => {
    expect(located(checkSkills(withBody(`[x](${BLOB}/docs/guide.md#${slug})`)))).toEqual(oneError('link-fragment', BODY_LINE));
  });

  test('fails a fragment on a .md target that is not a regular file', () => {
    const root = withBody(`[x](${BLOB}/docs/folder.md#x)`);
    fs.mkdirSync(path.join(root, 'docs/folder.md'));
    const result = checkSkills(root);
    expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
    expect(result.findings[0].message).toContain('not a regular file');
  });

  test.each([
    ['nested brackets in the link text', '[see [this] rule](../../../docs/missing.md)'],
    ['an image inside a link', '[![logo](../../../docs/guide.md)](../../../docs/missing.md)'],
    ['parentheses in the target', '[x](../../../docs/missing(1).md)'],
  ])('warns on %s, which is not checked', (_, link) => {
    const result = checkSkills(withBody(link));
    expect(located(result)).toEqual([{ path: SKILL_PATH, line: BODY_LINE, severity: 'warning', rule: 'link-syntax' }]);
  });

  test('names the closest heading when a fragment is not found', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/guide.md#backward-compatibility)`));
    expect(located(result)).toEqual(oneError('link-fragment', BODY_LINE));
    expect(result.findings[0].message).toContain('the closest heading is #backward-compatibility--deprecation');
  });

  test('gives no closest heading from a file reached through a symlink', () => {
    const root = withBody(`[x](${BLOB}/docs/npmrc.md#tok)`, { '.npmrc': '# token-ab12cd34\nregistry=https://example.com/\n' });
    fs.symlinkSync('../.npmrc', path.join(root, 'docs/npmrc.md'));
    const result = checkSkills(root);
    expect(located(result)).toEqual(oneError('link-fragment', BODY_LINE));
    expect(result.findings[0].message).not.toContain('closest');
    expect(result.findings[0].message).not.toContain('token');
  });

  test('gives no closest heading when none shares a prefix', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/guide.md#security-rules)`));
    expect(result.findings[0].message).not.toContain('closest');
  });

  test('fails a fragment that exists only in a different file', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/other.md#notes)`, { 'docs/other.md': '# Other\n' }));
    expect(located(result)).toEqual(oneError('link-fragment', BODY_LINE));
  });

  test('ignores links inside code spans and fenced blocks, and other URLs', () => {
    const body = [
      'Text `[x](missing.md)` here.',
      '```md',
      '[x](missing.md)',
      '```',
      '[site](https://example.com/missing.md) and [tree](https://github.com/aws/aws-cdk/tree/v1/missing.md).',
    ].join('\n');
    const result = checkSkills(withBody(body));
    expect(result.findings).toEqual([]);
    expect(result.counts.links).toBe(README_LINKS);
  });

  test('fails an undecodable blob/main path', () => {
    const result = checkSkills(withBody(`[x](${BLOB}/docs/%E0%A4%A.md)`));
    expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
    expect(result.findings[0].message).toContain('decode');
  });

  describe('outside the repository', () => {
    let outside;
    let root;
    let spies;

    beforeEach(() => {
      outside = tempDir();
      writeFiles(outside, { 'secret.md': '# Secret\n' });
      root = undefined;
    });

    afterEach(() => {
      for (const spy of spies ?? []) {
        spy.mockRestore();
      }
      spies = undefined;
    });

    /** Runs the check while recording every path given to an fs function, and which function got it. */
    function checkRecordingAccess(repoRoot) {
      const accessed = [];
      const calls = [];
      spies = ['readFileSync', 'readdirSync', 'statSync', 'lstatSync', 'realpathSync', 'readlinkSync', 'existsSync', 'openSync'].map((method) => {
        const original = fs[method];
        return jest.spyOn(fs, method).mockImplementation((p, ...args) => {
          accessed.push(String(p));
          calls.push({ method, path: String(p) });
          return original.call(fs, p, ...args);
        });
      });
      const result = checkSkills(repoRoot);
      return { result, accessed, calls };
    }

    test.each([
      ['a relative link', () => `../../../../${path.basename(outside)}/secret.md#secret`],
      ['a blob/main "../" path', () => `${BLOB}/../${path.basename(outside)}/secret.md#secret`],
      ['a blob/main "%2e%2e" path', () => `${BLOB}/%2e%2e/${path.basename(outside)}/secret.md#secret`],
      ['a blob/main absolute path', () => `${BLOB}/${encodeURIComponent(outside)}/secret.md#secret`],
    ])('fails %s that escapes the root, without touching the target', (_, target) => {
      root = withBody(`[x](${target()})`);
      const { result, accessed } = checkRecordingAccess(root);
      expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
      expect(result.findings[0].message).toContain('outside the repository');
      expect(accessed.filter((p) => p.startsWith(outside))).toEqual([]);
      expect(result.counts.fragments).toBe(0);
    });

    test('fails an in-repo .md symlink whose target is outside the root, without reading it', () => {
      root = withBody(`[x](${BLOB}/docs/evil.md#secret)`);
      fs.symlinkSync(path.join(outside, 'secret.md'), path.join(root, 'docs/evil.md'));
      const { result, accessed } = checkRecordingAccess(root);
      expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
      expect(result.findings[0].message).toContain('outside the repository');
      expect(accessed.filter((p) => p.startsWith(outside))).toEqual([]);
      const reads = fs.readFileSync.mock.calls.map(([p]) => String(p));
      expect(reads.filter((p) => p.endsWith('evil.md'))).toEqual([]);
    });

    test('reports the same error for symlinks to existing and missing paths outside the root, without touching them', () => {
      root = withBody(`[a](${BLOB}/docs/a.md#secret) [b](${BLOB}/docs/b.md#secret)`);
      fs.symlinkSync(path.join(outside, 'secret.md'), path.join(root, 'docs/a.md'));
      fs.symlinkSync(path.join(outside, 'missing.md'), path.join(root, 'docs/b.md'));
      const { result, accessed } = checkRecordingAccess(root);
      expect(located(result)).toEqual([...oneError('link-target', BODY_LINE), ...oneError('link-target', BODY_LINE)]);
      expect(result.findings[0].message.replace('a.md', 'b.md')).toEqual(result.findings[1].message);
      expect(accessed.filter((p) => p.startsWith(outside))).toEqual([]);
    });

    test.each([
      ['a file symlink under skills/', 'notes.md', '[x](notes.md#guide)', () => '../../../docs/guide.md'],
      ['a directory symlink under skills/', 'dir', '[x](dir/guide.md#guide)', () => '../../../docs'],
      ['a file symlink under skills/, from a blob/main link', 'notes.md', `[x](${BLOB}/${GROUP}/${SKILL}/notes.md#guide)`, () => '../../../docs/guide.md'],
    ])('fails a link through %s without following it', (_, name, link, linkTarget) => {
      root = withBody(link);
      const symlink = path.join(root, GROUP, SKILL, name);
      fs.symlinkSync(linkTarget(), symlink);
      const { result, accessed, calls } = checkRecordingAccess(root);
      expect(located(result)).toEqual([
        ...oneError('link-target', BODY_LINE),
        { path: `${GROUP}/${SKILL}/${name}`, line: undefined, severity: 'error', rule: 'symlink' },
      ]);
      expect(result.findings[0].message).toContain('symlink under skills/');
      expect(accessed.filter((p) => p.includes(`${path.sep}docs${path.sep}`))).toEqual([]);
      // Only lstat may look at the symlink itself; nothing may resolve or read through it.
      expect(calls.filter((c) => c.path.startsWith(symlink) && c.method !== 'lstatSync')).toEqual([]);
      expect(result.counts.fragments).toBe(0);
    });

    test('fails a symlink under skills/ without reading it', () => {
      root = repo();
      fs.symlinkSync(path.join(outside, 'secret.md'), path.join(root, GROUP, SKILL, 'notes.md'));
      const { result, accessed } = checkRecordingAccess(root);
      expect(located(result)).toEqual([{ path: `${GROUP}/${SKILL}/notes.md`, line: undefined, severity: 'error', rule: 'symlink' }]);
      expect(accessed.filter((p) => p.startsWith(outside) || p.endsWith('notes.md'))).toEqual([]);
    });

    /** docs/l0.md -> docs/l1.md -> ... -> docs/l<count>.md, which is a regular file. */
    function chain(count) {
      const chained = withBody(`[x](${BLOB}/docs/l0.md#guide)`, { [`docs/l${count}.md`]: '# Guide\n' });
      for (let i = 0; i < count; i++) {
        fs.symlinkSync(`l${i + 1}.md`, path.join(chained, `docs/l${i}.md`));
      }
      return chained;
    }

    test('reads each symlink once for repeated links to the same target', () => {
      root = withBody(`[a](${BLOB}/docs/abs.md#guide) [b](${BLOB}/docs/abs.md#notes)`);
      fs.symlinkSync('guide.md', path.join(root, 'docs/abs.md'));
      const { result, calls } = checkRecordingAccess(root);
      expect(result.findings).toEqual([]);
      expect(calls.filter((c) => c.method === 'readlinkSync')).toHaveLength(1);
    });

    // A chain, not a loop: if the limit stopped working, a loop would never finish.
    test('follows a chain of 40 in-repo symlinks outside skills/ to its target', () => {
      const result = checkSkills(chain(40));
      expect(result.findings).toEqual([]);
      expect(result.counts.fragments).toBe(1);
    });

    test('fails a chain of 41 symlinks with a finding', () => {
      const result = checkSkills(chain(41));
      expect(located(result)).toEqual(oneError('link-target', BODY_LINE));
      expect(result.findings[0].message).toContain('more than 40 symlinks');
    });

    test('follows an absolute in-repo symlink when the root is given through another path', () => {
      const real = withBody(`[x](${BLOB}/docs/abs.md#guide)`);
      fs.symlinkSync(path.join(real, 'docs/guide.md'), path.join(real, 'docs/abs.md'));
      const alias = path.join(tempDir(), 'alias');
      fs.symlinkSync(real, alias);
      const result = checkSkills(alias);
      expect(result.findings).toEqual([]);
      expect(result.counts.fragments).toBe(1);
    });

    test('refuses a symlink under skills/ reached through a differently cased path', () => {
      const casedDir = path.join('Skills', GROUP.slice('skills/'.length), SKILL);
      root = withBody(`[x](../../../${toPosixPath(casedDir)}/notes.md#guide)`);
      // On a case-insensitive filesystem Skills/ is skills/; elsewhere it is a separate directory.
      const caseInsensitive = fs.existsSync(path.join(root, 'SKILLS'));
      fs.mkdirSync(path.join(root, casedDir), { recursive: true });
      fs.symlinkSync('../../../docs/guide.md', path.join(root, casedDir, 'notes.md'));
      const { result, calls } = checkRecordingAccess(root);
      const linkErrors = result.findings.filter((f) => f.rule === 'link-target');
      expect(located({ findings: linkErrors })).toEqual(oneError('link-target', BODY_LINE));
      expect(linkErrors[0].message).toContain('symlink under skills/');
      expect(calls.filter((c) => c.path.endsWith(path.join('docs', 'guide.md')))).toEqual([]);
      expect(result.findings.some((f) => f.rule === 'symlink')).toBe(caseInsensitive);
    });

    test('fails a skills directory that is itself a symlink', () => {
      const real = repo();
      root = tempDir();
      fs.symlinkSync(path.join(real, 'skills'), path.join(root, 'skills'));
      const { result, accessed } = checkRecordingAccess(root);
      expect(located(result)).toEqual([{ path: 'skills', line: undefined, severity: 'error', rule: 'symlink' }]);
      expect(accessed.filter((p) => p.startsWith(real))).toEqual([]);
    });
  });
});

describe('check-skills command line', () => {
  function run(root) {
    const result = spawnSync(process.execPath, [SCRIPT, root], { encoding: 'utf8', timeout: 30_000 });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
  }

  test('exits 0 with a summary when there are no findings', () => {
    const { status, stdout } = run(repo());
    expect(status).toBe(0);
    expect(stdout).toBe('check-skills: skills: 2, markdown files: 3, links checked: 2, fragments checked: 0, errors: 0, warnings: 0\n');
  });

  test('counts every relative and blob/main link and every fragment on a .md target', () => {
    const body = [
      '## Here',
      '[a](#here) [b](references/rules.md#rules) [c](references/rules.md)',
      '[d](https://github.com/aws/aws-cdk/blob/main/lib/code.ts#L1) [e](https://example.com/#x)',
    ].join('\n');
    const root = repo({
      [SKILL_PATH]: skillMd({ name: SKILL, body }),
      [`${GROUP}/${SKILL}/references/rules.md`]: '# Rules\n',
      'lib/code.ts': 'export {};\n',
    });
    const { status, stdout } = run(root);
    expect(status).toBe(0);
    expect(stdout).toContain('skills: 2, markdown files: 4, links checked: 6, fragments checked: 2, errors: 0, warnings: 0');
  });

  test('exits 0 and prints warnings when there are only warnings', () => {
    const root = repo({ [`${GROUP}/${SKILL}/references/rules.md`]: '# Rules\n\nRun `alpha-review`.\n' });
    const { status, stdout } = run(root);
    expect(status).toBe(0);
    expect(stdout).toMatch(new RegExp(`^${GROUP}/${SKILL}/references/rules.md:3: warning skill-reference: .*cdk-alpha-review`, 'm'));
    expect(stdout).toContain('errors: 0, warnings: 1');
    expect(stdout).not.toContain('rerun');
  });

  test('exits 1 on errors, naming each one, and ends with the command to rerun', () => {
    const root = repo({ [SKILL_PATH]: skillMd({ name: 'cdk-gamma-review' }) });
    fs.rmSync(path.join(root, GROUP, 'README.md'));
    const { status, stdout } = run(root);
    expect(status).toBe(1);
    const lines = stdout.trimEnd().split('\n');
    expect(lines).toEqual([
      `${GROUP}/README.md: error readme-index: missing README.md; add one with a table row linking each skill: cdk-alpha-review, cdk-beta-principles`,
      `${SKILL_PATH}:2: error name-matches-folder: name "cdk-gamma-review" must equal its folder name "cdk-alpha-review"`,
      'check-skills: skills: 2, markdown files: 2, links checked: 0, fragments checked: 0, errors: 2, warnings: 0',
      'check-skills found errors. Fix them, then rerun: node scripts/check-skills.js',
    ]);
  });

  test('exits 0 with a notice when there is no skills/ directory', () => {
    const { status, stdout } = run(tempDir());
    expect(status).toBe(0);
    expect(stdout).toBe('check-skills: no skills/ directory, nothing to check\n');
  });

  test('exits 0 with 0 skills for a skills/ directory without skills, and still checks its links', () => {
    const root = tempDir();
    writeFiles(root, { 'skills/notes.md': '# Notes\n\n[self](#notes)\n' });
    const ok = run(root);
    expect(ok.status).toBe(0);
    expect(ok.stdout).toBe('check-skills: skills: 0, markdown files: 1, links checked: 1, fragments checked: 1, errors: 0, warnings: 0\n');

    writeFiles(root, { 'skills/notes.md': '# Notes\n\n[self](#gone)\n' });
    const bad = run(root);
    expect(bad.status).toBe(1);
    expect(bad.stdout).toContain('skills/notes.md:3: error link-fragment');
  });

  test('exits 1 when skills is a file', () => {
    const root = tempDir();
    fs.writeFileSync(path.join(root, 'skills'), '');
    const { status, stdout } = run(root);
    expect(status).toBe(1);
    expect(stdout).toContain('skills: error skills-directory: skills is not a directory');
  });

  test('escapes control characters from the checked files so they cannot forge output lines', () => {
    const root = repo({ [SKILL_PATH]: skillMd({ name: SKILL, body: '[x](a%0a::error%20file=build.sh::forged%1b[31m.md)' }) });
    const { status, stdout } = run(root);
    expect(status).toBe(1);
    expect(stdout).not.toMatch(/^::error/m);
    expect(stdout).not.toContain('\u001b');
    expect(stdout).toContain('a\\x0a::error file=build.sh::forged\\x1b[31m.md not found');
  });

  test('escapes workflow-command prefixes from the checked files', () => {
    const root = repo({
      [SKILL_PATH]: skillMd({ name: SKILL, body: '## Here\n\n[x](#%23%5Berror%5Dx)' }),
      [`${GROUP}/##[error]x/notes.md`]: '[y](missing.md)\n',
    });
    const { status, stdout } = run(root);
    expect(status).toBe(1);
    expect(stdout).toContain(`${GROUP}/\\x23#[error]x/notes.md:1: error link-target`);
    expect(stdout).toContain('\\x23#[error]x is not a heading');
    expect(stdout).not.toContain('##[');
  });

  // Probing by creating a pipe works with both GNU and BSD mkfifo.
  const canMakeFifo = process.platform !== 'win32' && spawnSync('mkfifo', [path.join(tempDir(), 'probe')]).status === 0;
  (canMakeFifo ? test : test.skip)('fails, without blocking, a fragment link to a named pipe', () => {
    const root = repo({ [SKILL_PATH]: skillMd({ name: SKILL, body: '[x](../../../docs/pipe.md#x)' }) });
    fs.mkdirSync(path.join(root, 'docs'));
    expect(spawnSync('mkfifo', [path.join(root, 'docs/pipe.md')]).status).toBe(0);
    const { status, stdout } = run(root);
    expect(status).toBe(1);
    expect(stdout).toContain(`${SKILL_PATH}:6: error link-target: link target "../../../docs/pipe.md#x" is not a regular file`);
  });

  test('exits 2 when the root does not exist', () => {
    const missing = path.join(tempDir(), 'missing');
    const { status, stderr } = run(missing);
    expect(status).toBe(2);
    expect(stderr).toContain(missing);
    expect(stderr).toContain('no such directory');
  });

  test('exits 2 when the root is a file', () => {
    const file = path.join(tempDir(), 'file');
    fs.writeFileSync(file, '');
    const { status, stderr } = run(file);
    expect(status).toBe(2);
    expect(stderr).toContain('not a directory');
  });

  const isRoot = process.getuid && process.getuid() === 0;
  (isRoot ? test.skip : test)('exits 2 when a file cannot be read', () => {
    const root = repo();
    fs.chmodSync(path.join(root, SKILL_PATH), 0o000);
    const { status, stderr } = run(root);
    expect(status).toBe(2);
    expect(stderr).toContain(path.join(root, SKILL_PATH));
    expect(stderr).toContain('EACCES');
  });
});

describe('check-skills safety', () => {
  const source = fs.readFileSync(SCRIPT, 'utf8');

  test('requires only Node builtins, and none that reach the network or start processes', () => {
    const required = [...source.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
    expect(required.length).toBeGreaterThan(0);
    for (const name of required) {
      expect(builtinModules).toContain(name.replace(/^node:/, ''));
      expect(['http', 'https', 'http2', 'net', 'tls', 'dns', 'dgram', 'child_process', 'cluster', 'worker_threads'])
        .not.toContain(name.replace(/^node:/, ''));
    }
    expect(source).not.toMatch(/\bimport\s*\(|\bprocess\.binding\b|\bfetch\s*\(/);
  });

  test('uses only read-only fs functions', () => {
    const used = new Set([...source.matchAll(/\bfs\.([A-Za-z]+)/g)].map((m) => m[1]));
    expect([...used].filter((fn) => !['readFileSync', 'readdirSync', 'statSync', 'lstatSync', 'readlinkSync', 'realpathSync'].includes(fn))).toEqual([]);
    const writes = ['writeFile', 'appendFile', 'write', 'writev', 'rm', 'rmdir', 'unlink', 'mkdir', 'mkdtemp', 'symlink', 'link',
      'copyFile', 'cp', 'rename', 'truncate', 'chmod', 'chown', 'utimes', 'open', 'createWriteStream'];
    expect(source).not.toMatch(new RegExp(`\\b(?:${writes.join('|')})(?:Sync)?\\s*\\(`));
  });

  test('runs in linear time on long adversarial lines', () => {
    const n = 100_000;
    const lines = [
      '`'.repeat(1) + ' ``'.repeat(n / 3),
      '`a` ``b`` ```c'.repeat(n / 14),
      '[]('.repeat(n / 3),
      '[' + 'a'.repeat(n),
      '[x](' + 'a'.repeat(n),
      '<a'.repeat(n / 2),
      'cdk-' + 'a-'.repeat(n / 2),
      '`cdk-' + 'a-'.repeat(n / 2) + 'x`',
      ' '.repeat(n) + 'x',
    ];
    const heading = ['# ' + ' '.repeat(n) + 'x', '# x' + ' '.repeat(n) + '#'.repeat(n) + 'x', '# ' + '[]('.repeat(n / 3)];
    const root = repo({
      [SKILL_PATH]: skillMd({ name: SKILL, description: `${'<a'.repeat(400)}`, body: [...lines, '[x](../../../docs/long.md#x)'].join('\n') }),
      'docs/long.md': heading.join('\n'),
    });
    const start = process.hrtime.bigint();
    checkSkills(root);
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    expect(elapsedMs).toBeLessThan(1000);
  });
});
