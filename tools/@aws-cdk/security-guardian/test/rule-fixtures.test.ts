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

// The world access rules check the Principal of each Allow statement in a resource policy.
// Beyond its fixture pair, each rule runs on one-resource templates, one per statement
// shape, so that each shape is shown to fire, pass or skip on its own.
interface WorldAccessRule {
  readonly ruleName: string;
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly resource: string;
  /** Actions to grant each Principal shape; the S3 rules check string and list Actions separately */
  readonly actions: unknown[];
  /** Actions the rule checks, and actions it ignores, when granted to { AWS: "*" } */
  readonly matchingActions?: unknown[];
  readonly otherActions?: unknown[];
}

// Ways to write an S3 action whose name starts with one of the words, other than with a leading *:
// the word itself, and for each of its letters, ? in place of the letter or, after the first
// letter, the letters before it followed by *. "Get" gives s3:GetObject, s3:?etObject,
// s3:G?tObject, s3:Ge?Object, s3:G* and s3:Ge*.
function spellingsOf(words: string[]): string[] {
  return words.flatMap(word => [
    `s3:${word}Object`,
    ...[...word].map((_, i) => `s3:${word.slice(0, i)}?${word.slice(i + 1)}Object`),
    ...[...word].slice(1).map((_, i) => `s3:${word.slice(0, i + 1)}*`),
  ]);
}

const s3ReadSpellings = spellingsOf(['Get', 'List']);
const s3WriteSpellings = spellingsOf(['Put', 'Delete']);

const worldAccessRules: Record<string, WorldAccessRule> = {
  's3/s3-no-world-readable': {
    ruleName: 'S3_NO_WORLD_READABLE',
    type: 'AWS::S3::BucketPolicy',
    properties: { Bucket: 'example-bucket' },
    resource: 'arn:aws:s3:::example-bucket/*',
    actions: ['s3:GetObject', ['s3:GetObject']],
    matchingActions: [
      '*', 's3:*', 's3:Get*', 's3:List*', 's3:GetBucketPolicy', 's3:*Object', 'S3:getobject', ...s3ReadSpellings,
      ['s3:PutObject', 's3:GetObject'], ['s3:PutObject', 's3:List*'],
    ],
    otherActions: ['s3:Put*', 's3:?estoreObject', ...s3WriteSpellings, ['s3:PutObject', 's3:DeleteObject']],
  },
  's3/s3-no-world-writable': {
    ruleName: 'S3_NO_WORLD_WRITABLE',
    type: 'AWS::S3::BucketPolicy',
    properties: { Bucket: 'example-bucket' },
    resource: 'arn:aws:s3:::example-bucket/*',
    actions: ['s3:PutObject', ['s3:PutObject']],
    matchingActions: [
      '*', 's3:*', 's3:Put*', 's3:Delete*', 's3:PutBucketPolicy', 's3:*Object', 'S3:putobject', ...s3WriteSpellings,
      ['s3:GetObject', 's3:PutObject'], ['s3:GetObject', 's3:Delete*'],
    ],
    otherActions: ['s3:Get*', 's3:?estoreObject', ...s3ReadSpellings, ['s3:GetObject', 's3:ListBucket']],
  },
  'sns/sns-no-world-accessible': {
    ruleName: 'SNS_NO_WORLD_ACCESSIBLE',
    type: 'AWS::SNS::TopicPolicy',
    properties: { Topics: ['arn:aws:sns:us-west-2:123456789012:example-topic'] },
    resource: 'arn:aws:sns:us-west-2:123456789012:example-topic',
    actions: ['sns:Publish'],
  },
  'sns/sns-no-world-accessible-inline': {
    ruleName: 'SNS_NO_WORLD_ACCESSIBLE_INLINE',
    type: 'AWS::SNS::TopicInlinePolicy',
    properties: { TopicArn: 'arn:aws:sns:us-west-2:123456789012:example-topic' },
    resource: 'arn:aws:sns:us-west-2:123456789012:example-topic',
    actions: ['sns:Publish'],
  },
  'sqs/sqs-no-world-accessible': {
    ruleName: 'SQS_NO_WORLD_ACCESSIBLE',
    type: 'AWS::SQS::QueuePolicy',
    properties: { Queues: ['https://sqs.us-west-2.amazonaws.com/123456789012/example-queue'] },
    resource: 'arn:aws:sqs:us-west-2:123456789012:example-queue',
    actions: ['sqs:SendMessage'],
  },
  'sqs/sqs-no-world-accessible-inline': {
    ruleName: 'SQS_NO_WORLD_ACCESSIBLE_INLINE',
    type: 'AWS::SQS::QueueInlinePolicy',
    properties: { Queue: 'https://sqs.us-west-2.amazonaws.com/123456789012/example-queue' },
    resource: 'arn:aws:sqs:us-west-2:123456789012:example-queue',
    actions: ['sqs:SendMessage'],
  },
};

interface PolicyShape {
  readonly title: string;
  readonly statement: Record<string, unknown>;
  /** The rule's status in each scan, where "fail" means the rule fires */
  readonly status: Record<string, string>;
}

const fires = { static: 'fail', resolved: 'fail' };
const passes = { static: 'pass', resolved: 'pass' };
const skips = { static: 'skip', resolved: 'skip' };
const outcomes: Record<string, string> = { fail: 'fires on', pass: 'evaluates and passes on', skip: 'skips' };

const roleArn = 'arn:aws:iam::123456789012:role/Example';
// CDK writes ARNs as intrinsic functions, which only the resolved scan turns into strings
const roleArnJoin = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':role/Example']] };

function principalShapes(rule: WorldAccessRule, action: unknown): PolicyShape[] {
  const grant = (Effect: string, Principal: unknown, Condition?: unknown) => ({ Effect, Principal, Action: action, Resource: rule.resource, Condition });
  const shapes: PolicyShape[] = [
    { title: 'Principal "*"', statement: grant('Allow', '*'), status: fires },
    {
      title: 'Principal { AWS: "*" } with an aws:PrincipalOrgID Condition',
      statement: grant('Allow', { AWS: '*' }, { StringEquals: { 'aws:PrincipalOrgID': 'o-exampleorgid' } }),
      status: fires,
    },
    { title: 'Principal { AWS: ["*"] }', statement: grant('Allow', { AWS: ['*'] }), status: fires },
    { title: 'Principal { AWS: [role ARN, "*"] }', statement: grant('Allow', { AWS: [roleArn, '*'] }), status: fires },
    { title: 'Principal { AWS: [Fn::Join, "*"] }', statement: grant('Allow', { AWS: [roleArnJoin, '*'] }), status: fires },
    { title: 'Principal { AWS: "*", Service }', statement: grant('Allow', { AWS: '*', Service: 'sns.amazonaws.com' }), status: fires },
    { title: 'Principal { AWS: [role ARN, account ID] }', statement: grant('Allow', { AWS: [roleArn, '123456789012'] }), status: passes },
    { title: 'Principal { AWS: [Fn::Join] }', statement: grant('Allow', { AWS: [roleArnJoin] }), status: { static: 'skip', resolved: 'pass' } },
    {
      title: 'Principal { AWS: Fn::GetAtt }',
      statement: grant('Allow', { AWS: { 'Fn::GetAtt': ['Role', 'Arn'] } }),
      status: { static: 'skip', resolved: 'pass' },
    },
    { title: 'Principal { Service }', statement: grant('Allow', { Service: 'sns.amazonaws.com' }), status: skips },
    { title: 'a Deny of Principal { AWS: "*" }', statement: grant('Deny', { AWS: '*' }), status: skips },
  ];
  // Of these policy types, only bucket policies accept CanonicalUser principals
  if (rule.type === 'AWS::S3::BucketPolicy') {
    shapes.push({
      title: 'Principal { CanonicalUser }',
      statement: grant('Allow', { CanonicalUser: '79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be' }),
      status: skips,
    });
  }
  return shapes.map(shape => ({ ...shape, title: `${shape.title} for Action ${JSON.stringify(action)}` }));
}

function actionShapes(rule: WorldAccessRule, actions: unknown[], status: Record<string, string>): PolicyShape[] {
  return actions.map(action => ({
    title: `Principal { AWS: "*" } for Action ${JSON.stringify(action)}`,
    statement: { Effect: 'Allow', Principal: { AWS: '*' }, Action: action, Resource: rule.resource },
    status,
  }));
}

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

  describe.each(Object.keys(worldAccessRules))('rules/%s.guard policy shapes', (ruleId) => {
    const rule = worldAccessRules[ruleId];
    const ruleFile = path.join(rulesDir, `${ruleId}.guard`);
    const shapesDir = path.join(outputDir, 'policy-shapes', ruleId);
    const shapes = [
      ...rule.actions.flatMap(action => principalShapes(rule, action)),
      ...actionShapes(rule, rule.matchingActions ?? [], fires),
      ...actionShapes(rule, rule.otherActions ?? [], skips),
    ];

    beforeAll(() => {
      fs.mkdirSync(path.join(shapesDir, 'static'), { recursive: true });
      shapes.forEach((shape, index) => {
        const template = {
          Resources: {
            Policy: {
              Type: rule.type,
              Properties: { ...rule.properties, PolicyDocument: { Version: '2012-10-17', Statement: [shape.statement] } },
            },
          },
        };
        fs.writeFileSync(path.join(shapesDir, 'static', `${index}.json`), JSON.stringify(template, null, 2));
      });
      preprocessTemplates(path.join(shapesDir, 'static'), path.join(shapesDir, 'resolved'));
    });

    const cases = scans.flatMap(scan => shapes.map((shape, index): [string, string, number] =>
      [`${scan}: ${outcomes[shape.status[scan]]} ${shape.title}`, scan, index]));

    test.each(cases)('%s', async (_name, scan, index) => {
      const status = shapes[index].status[scan];
      const report = path.join(shapesDir, `${scan}-${index}.xml`);
      const success = await runCfnGuardValidation(path.join(shapesDir, scan, `${index}.json`), ruleFile, report, scan, new Map(), false);

      expect(testCases(report)).toEqual([{ ruleFile: path.basename(ruleFile), status }]);
      expect(failedRules(report)).toEqual(status === 'fail' ? [rule.ruleName] : []);
      expect(success).toBe(status !== 'fail');
    });
  });
});
