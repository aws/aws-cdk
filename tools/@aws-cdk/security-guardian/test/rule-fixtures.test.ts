import { preprocessTemplates } from '../src/template-preprocessor';
import { runCfnGuardValidation } from '../src/cfn-guard-runner';
import { failedRules, testCases } from './junit-report';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Every rule file needs a fixture it fires on and a fixture it evaluates and passes,
// at test/rule-fixtures/<rule path without .guard>/{non-compliant,compliant}.json.
// Extra fixtures, compliant-<name>.json or non-compliant-<name>.json, are checked like the base pair.
// The fixtures are .json rather than .template.json so that the Security Guardian
// action never scans them as changed templates.
const rulesDir = path.join(__dirname, '..', 'rules');
const fixturesDir = path.join(__dirname, 'rule-fixtures');
const requiredFixtures = ['non-compliant.json', 'compliant.json'];
const fixtureName = /^(non-)?compliant(-[a-z0-9]+)*\.json$/;
// The action fails a PR when either scan fails, so every fixture is checked in both.
const scans = ['static', 'resolved'];

// These rules wrap their checks in `when Principal != "*"`. cfn-guard cannot compare a
// map Principal such as { "AWS": "*" } with a string, and a string Principal has no AWS
// key, so the rules skip every policy and neither fire nor pass on their fixtures.
// Remove a rule from this list once it evaluates its fixtures.
const rulesThatSkipEveryPolicy = [
  's3/s3-no-world-readable',
  's3/s3-no-world-writable',
  'sns/sns-no-world-accessible',
  'sns/sns-no-world-accessible-inline',
  'sqs/sqs-no-world-accessible',
  'sqs/sqs-no-world-accessible-inline',
];

// The static scan skips these: their Resource lists hold only Fn::GetAtt objects. Remove an entry once it evaluates them.
const fixturesTheStaticScanSkips = [
  'iam/iam-no-overly-permissive-passrole/compliant-inline-policy-intrinsic-arn-list.json',
  'iam/iam-no-overly-permissive-passrole/compliant-intrinsic-arn-list.json',
];

function findFiles(dir: string, extension = ''): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

const ruleIds = findFiles(rulesDir, '.guard').map(file => path.relative(rulesDir, file).replace(/\.guard$/, ''));

describe('Guard Rule Fixtures', () => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'security-guardian-rule-fixtures-'));

  afterAll(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  test('every fixture belongs to a rule file', () => {
    // Check every file, since a misnamed one never runs; hidden files such as .DS_Store are never fixtures.
    const misplaced = findFiles(fixturesDir)
      .filter(file => !path.basename(file).startsWith('.'))
      .map(file => path.relative(fixturesDir, file))
      .filter(file => !fixtureName.test(path.basename(file)) || !ruleIds.includes(path.dirname(file)));
    expect(misplaced).toEqual([]);
  });

  describe.each(ruleIds)('rules/%s.guard', (ruleId) => {
    const ruleFile = path.join(rulesDir, `${ruleId}.guard`);
    const fixtureDir = path.join(fixturesDir, ruleId);
    const reportDir = path.join(outputDir, ruleId);
    const resolvedDir = path.join(reportDir, 'resolved');
    const extraFixtures = fs.existsSync(fixtureDir)
      ? fs.readdirSync(fixtureDir).filter(file => fixtureName.test(file) && !requiredFixtures.includes(file)).sort()
      : [];
    const skips = (scan: string, fixture: string) => rulesThatSkipEveryPolicy.includes(ruleId)
      || (scan === 'static' && fixturesTheStaticScanSkips.includes(`${ruleId}/${fixture}`));
    const fixtures = [...requiredFixtures, ...extraFixtures];
    const cases = scans.flatMap(scan => fixtures.map(fixture => [scan, fixture]));
    const skipCases = cases.filter(([scan, fixture]) => skips(scan, fixture));
    const fireCases = cases.filter(([scan, fixture]) => !skips(scan, fixture) && fixture.startsWith('non-'));
    const passCases = cases.filter(([scan, fixture]) => !skips(scan, fixture) && !fixture.startsWith('non-'));
    let ruleName: string;

    beforeAll(() => {
      const ruleNames = [...fs.readFileSync(ruleFile, 'utf8').matchAll(/^rule\s+(\w+)/gm)].map(match => match[1]);
      if (ruleNames.length !== 1) {
        throw new Error(`rules/${ruleId}.guard must define exactly one rule, found ${JSON.stringify(ruleNames)}`);
      }
      ruleName = ruleNames[0];

      const missing = requiredFixtures.filter(fixture => !fs.existsSync(path.join(fixtureDir, fixture)));
      if (missing.length > 0) {
        throw new Error(`missing fixtures for rules/${ruleId}.guard: add ${missing.map(fixture => `test/rule-fixtures/${ruleId}/${fixture}`).join(' and ')}`);
      }

      fs.mkdirSync(reportDir, { recursive: true });
      preprocessTemplates(fixtureDir, resolvedDir);
    });

    async function validate(scan: string, fixture: string) {
      const dataFile = path.join(scan === 'static' ? fixtureDir : resolvedDir, fixture);
      const report = path.join(reportDir, `${scan}-${path.basename(fixture, '.json')}.xml`);
      const success = await runCfnGuardValidation(dataFile, ruleFile, report, scan, new Map(), false);
      return { success, report };
    }

    // test.each rejects an empty table
    if (skipCases.length > 0) {
      test.each(skipCases)('%s: skips %s', async (scan, fixture) => {
        const { report } = await validate(scan, fixture);

        expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'skip' }]);
      });
    }

    if (fireCases.length > 0) {
      test.each(fireCases)('%s: fires on %s', async (scan, fixture) => {
        const { success, report } = await validate(scan, fixture);

        expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'fail' }]);
        expect(failedRules(report)).toEqual([ruleName]);
        expect(success).toBe(false);
      });
    }

    if (passCases.length > 0) {
      test.each(passCases)('%s: evaluates and passes on %s', async (scan, fixture) => {
        const { success, report } = await validate(scan, fixture);

        expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'pass' }]);
        expect(success).toBe(true);
      });
    }
  });
});
