import { preprocessTemplates } from '../src/template-preprocessor';
import { runCfnGuardValidation } from '../src/cfn-guard-runner';
import { failedRules, testCases } from './junit-report';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Every rule file needs a fixture it fires on and a fixture it evaluates and passes,
// at test/rule-fixtures/<rule path without .guard>/{non-compliant,compliant}.json.
// The fixtures are .json rather than .template.json so that the Security Guardian
// action never scans them as changed templates.
const rulesDir = path.join(__dirname, '..', 'rules');
const fixturesDir = path.join(__dirname, 'rule-fixtures');
const fixtures = ['non-compliant.json', 'compliant.json'];
// The action fails a pull request when either scan fails, so compliant.json must pass
// both; non-compliant.json must fail both, so that neither scan stops evaluating a
// rule unnoticed
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

function findFiles(dir: string, extension: string): string[] {
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
    const misplaced = findFiles(fixturesDir, '.json')
      .map(file => path.relative(fixturesDir, file))
      .filter(file => !fixtures.includes(path.basename(file)) || !ruleIds.includes(path.dirname(file)));
    expect(misplaced).toEqual([]);
  });

  describe.each(ruleIds)('rules/%s.guard', (ruleId) => {
    const ruleFile = path.join(rulesDir, `${ruleId}.guard`);
    const fixtureDir = path.join(fixturesDir, ruleId);
    const reportDir = path.join(outputDir, ruleId);
    const resolvedDir = path.join(reportDir, 'resolved');
    let ruleName: string;

    beforeAll(() => {
      const ruleNames = [...fs.readFileSync(ruleFile, 'utf8').matchAll(/^rule\s+(\w+)/gm)].map(match => match[1]);
      if (ruleNames.length !== 1) {
        throw new Error(`rules/${ruleId}.guard must define exactly one rule, found ${JSON.stringify(ruleNames)}`);
      }
      ruleName = ruleNames[0];

      const missing = fixtures.filter(fixture => !fs.existsSync(path.join(fixtureDir, fixture)));
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

    if (rulesThatSkipEveryPolicy.includes(ruleId)) {
      test.each(scans.flatMap(scan => fixtures.map(fixture => [scan, fixture])))('%s: skips %s', async (scan, fixture) => {
        const { report } = await validate(scan, fixture);

        expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'skip' }]);
      });
      return;
    }

    test.each(scans)('%s: fires on non-compliant.json', async (scan) => {
      const { success, report } = await validate(scan, 'non-compliant.json');

      expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'fail' }]);
      expect(failedRules(report)).toEqual([ruleName]);
      expect(success).toBe(false);
    });

    test.each(scans)('%s: evaluates and passes on compliant.json', async (scan) => {
      const { success, report } = await validate(scan, 'compliant.json');

      expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status: 'pass' }]);
      expect(success).toBe(true);
    });
  });
});
