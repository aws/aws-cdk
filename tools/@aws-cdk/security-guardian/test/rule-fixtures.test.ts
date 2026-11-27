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

// The world access rules check the Principal or NotPrincipal of each Allow statement in a resource policy.
// Beyond its fixture pair, each rule runs on one-resource templates, one per statement
// shape, so that each shape is shown to fire, pass or skip on its own.
interface WorldAccessRule {
  readonly ruleName: string;
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly resource: string;
  /** The Action of each Principal and NotPrincipal shape's statement; the S3 rules check string and list Actions separately */
  readonly actions: unknown[];
  /** Actions the rule checks, and actions it ignores, in an Allow statement with Principal { AWS: "*" } or with NotPrincipal */
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

/** A resource type and the property of it that holds the policy document */
interface PolicyResource {
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly policyProperty: string;
}

interface PolicyShape {
  readonly title: string;
  readonly statement: Record<string, unknown>;
  /** The rule's status in each scan, where "fail" means the rule fires */
  readonly status: Record<string, string>;
  /** The resource that holds the statement, when it is not the rule's own resource */
  readonly resource?: PolicyResource;
  /** The resource's Metadata, such as Metadata.guard.SuppressedRules */
  readonly metadata?: Record<string, unknown>;
  /** Statements placed before `statement` in the same policy */
  readonly otherStatements?: Array<Record<string, unknown>>;
}

const fires = { static: 'fail', resolved: 'fail' };
const passes = { static: 'pass', resolved: 'pass' };
const skips = { static: 'skip', resolved: 'skip' };
const outcomes: Record<string, string> = { fail: 'fires on', pass: 'evaluates and passes on', skip: 'skips' };

const roleArn = 'arn:aws:iam::123456789012:role/Example';
const rootArn = 'arn:aws:iam::123456789012:root';
// CDK writes ARNs as intrinsic functions, which only the resolved scan turns into strings
const roleArnJoin = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':role/Example']] };
// CDK's enforceSSL option adds a Deny of { AWS: "*" } with this Condition beside a policy's other statements
const secureTransportFalse = { Bool: { 'aws:SecureTransport': 'false' } };

// A rule skips a resource whose Metadata.guard.SuppressedRules lists the rule's name, and still checks
// a resource that suppresses only other rules
const anotherRuleName = 'EC2_NO_OPEN_SECURITY_GROUPS';
function suppressionShapes(ruleName: string, shape: PolicyShape): PolicyShape[] {
  return [
    {
      ...shape,
      title: `${shape.title} with the rule suppressed`,
      metadata: { guard: { SuppressedRules: [anotherRuleName, ruleName] } },
      status: skips,
    },
    { ...shape, title: `${shape.title} with another rule suppressed`, metadata: { guard: { SuppressedRules: [anotherRuleName] } } },
  ];
}

function principalShapes(rule: WorldAccessRule, action: unknown): PolicyShape[] {
  const grant = (Effect: string, Principal: unknown, Condition?: unknown) => ({ Effect, Principal, Action: action, Resource: rule.resource, Condition });
  // IAM supports NotPrincipal only with Deny, so the rules fire on an Allow with NotPrincipal whatever it lists
  const withNotPrincipal = (Effect: string, NotPrincipal: unknown, Condition?: unknown) =>
    ({ Effect, NotPrincipal, Action: action, Resource: rule.resource, Condition });
  const worldGrant: PolicyShape = { title: 'Principal "*"', statement: grant('Allow', '*'), status: fires };
  const tlsDeny = grant('Deny', { AWS: '*' }, secureTransportFalse);
  const shapes: PolicyShape[] = [
    worldGrant,
    ...suppressionShapes(rule.ruleName, worldGrant),
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
    {
      title: 'an Allow of Principal { AWS: "*" } after a Deny of Principal { AWS: "*" }',
      otherStatements: [tlsDeny],
      statement: grant('Allow', { AWS: '*' }),
      status: fires,
    },
    {
      title: 'an Allow of Principal { AWS: role ARN } after a Deny of Principal { AWS: "*" }',
      otherStatements: [tlsDeny],
      statement: grant('Allow', { AWS: roleArn }),
      status: passes,
    },
    { title: 'NotPrincipal "*"', statement: withNotPrincipal('Allow', '*'), status: fires },
    { title: 'NotPrincipal { AWS: role ARN }', statement: withNotPrincipal('Allow', { AWS: roleArn }), status: fires },
    { title: 'NotPrincipal { AWS: [role ARN, account ID] }', statement: withNotPrincipal('Allow', { AWS: [roleArn, '123456789012'] }), status: fires },
    { title: 'NotPrincipal { AWS: Fn::Join }', statement: withNotPrincipal('Allow', { AWS: roleArnJoin }), status: fires },
    { title: 'NotPrincipal { Service }', statement: withNotPrincipal('Allow', { Service: 'sns.amazonaws.com' }), status: fires },
    {
      title: 'NotPrincipal { AWS: role ARN } with an aws:PrincipalOrgID Condition',
      statement: withNotPrincipal('Allow', { AWS: roleArn }, { StringEquals: { 'aws:PrincipalOrgID': 'o-exampleorgid' } }),
      status: fires,
    },
    { title: 'a Deny of NotPrincipal { AWS: role ARN }', statement: withNotPrincipal('Deny', { AWS: roleArn }), status: skips },
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

// Principal and NotPrincipal elements the S3 rules check the same way for each Action
const actionElements = [
  { title: 'Principal { AWS: "*" }', element: { Principal: { AWS: '*' } } },
  { title: 'NotPrincipal { AWS: account ID }', element: { NotPrincipal: { AWS: '123456789012' } } },
];

function actionShapes(rule: WorldAccessRule, actions: unknown[], status: Record<string, string>): PolicyShape[] {
  return actionElements.flatMap(({ title, element }) => actions.map(action => ({
    title: `${title} for Action ${JSON.stringify(action)}`,
    statement: { Effect: 'Allow', ...element, Action: action, Resource: rule.resource },
    status,
  })));
}

function worldAccessShapes(rule: WorldAccessRule): PolicyShape[] {
  return [
    ...rule.actions.flatMap(action => principalShapes(rule, action)),
    ...actionShapes(rule, rule.matchingActions ?? [], fires),
    ...actionShapes(rule, rule.otherActions ?? [], skips),
  ];
}

// Two more rules judge the principals of a resource policy. Each also fires on an Allow statement
// with NotPrincipal, whatever it lists and whatever its Condition, since IAM supports NotPrincipal only with Deny.
interface PolicyTarget {
  readonly resource: PolicyResource;
  readonly action: string;
  readonly arn: string;
}

const bucketPolicyTarget: PolicyTarget = {
  resource: { type: 'AWS::S3::BucketPolicy', properties: { Bucket: 'example-bucket' }, policyProperty: 'PolicyDocument' },
  action: 's3:GetObject',
  arn: 'arn:aws:s3:::example-bucket/*',
};

const notPrincipalValues: Array<[string, unknown]> = [
  ['{ AWS: account root ARN }', { AWS: rootArn }],
  ['{ AWS: role ARN }', { AWS: roleArn }],
  ['{ AWS: [role ARN, account ID] }', { AWS: [roleArn, '123456789012'] }],
  ['{ AWS: Fn::Join }', { AWS: roleArnJoin }],
  ['{ Service }', { Service: 'logging.s3.amazonaws.com' }],
  ['"*"', '*'],
];

/**
 * Shapes for a rule that checks a Principal and its Condition: `principal` with each of `conditions`
 * passes, an Allow with the `ignored` Principal skips, and an Allow with NotPrincipal fires with or
 * without those conditions. Each keeps its status after a Deny of { AWS: "*" } in the same policy, and
 * a Deny with NotPrincipal before a passing Allow leaves it passing.
 */
function notPrincipalShapes(
  ruleName: string,
  target: PolicyTarget,
  principal: [string, unknown],
  conditions: Array<[string, unknown]>,
  ignored: [string, unknown],
): PolicyShape[] {
  const statement = (Effect: string, element: Record<string, unknown>, Condition?: unknown) =>
    ({ Effect, ...element, Action: target.action, Resource: target.arn, Condition });
  const [principalTitle, principalValue] = principal;
  const [ignoredTitle, ignoredValue] = ignored;
  const [conditionTitle, condition] = conditions[0];
  const tlsDeny = statement('Deny', { Principal: { AWS: '*' } }, secureTransportFalse);
  const afterDeny = 'after a Deny of Principal { AWS: "*" }';
  const valueShapes = notPrincipalValues.map(([title, value]): PolicyShape =>
    ({ title: `NotPrincipal ${title}`, statement: statement('Allow', { NotPrincipal: value }), status: fires }));
  const multiStatementShapes: PolicyShape[] = [
    {
      title: `an Allow of NotPrincipal ${principalTitle} ${afterDeny}`,
      otherStatements: [tlsDeny],
      statement: statement('Allow', { NotPrincipal: principalValue }),
      status: fires,
    },
    {
      title: `an Allow of Principal ${principalTitle} with ${conditionTitle} ${afterDeny}`,
      otherStatements: [tlsDeny],
      statement: statement('Allow', { Principal: principalValue }, condition),
      status: passes,
    },
    {
      title: `an Allow of Principal ${ignoredTitle} ${afterDeny}`,
      otherStatements: [tlsDeny],
      statement: statement('Allow', { Principal: ignoredValue }),
      status: skips,
    },
    {
      title: `an Allow of Principal ${principalTitle} with ${conditionTitle} after a Deny of NotPrincipal ${principalTitle}`,
      otherStatements: [statement('Deny', { NotPrincipal: principalValue }, secureTransportFalse)],
      statement: statement('Allow', { Principal: principalValue }, condition),
      status: passes,
    },
  ];
  const shapes: PolicyShape[] = [
    ...conditions.map(([title, condition]): PolicyShape =>
      ({ title: `Principal ${principalTitle} with ${title}`, statement: statement('Allow', { Principal: principalValue }, condition), status: passes })),
    { title: `Principal ${ignoredTitle}`, statement: statement('Allow', { Principal: ignoredValue }), status: skips },
    ...valueShapes,
    ...conditions.map(([title, condition]): PolicyShape =>
      ({ title: `NotPrincipal ${principalTitle} with ${title}`, statement: statement('Allow', { NotPrincipal: principalValue }, condition), status: fires })),
    { title: `a Deny of NotPrincipal ${principalTitle}`, statement: statement('Deny', { NotPrincipal: principalValue }), status: skips },
    ...suppressionShapes(ruleName, valueShapes[0]),
    ...multiStatementShapes,
  ];
  return shapes.map(shape => ({ ...shape, resource: target.resource }));
}

// RESOURCE_POLICY_ROOT_PRINCIPAL_NEEDS_CONDITIONS reads each of these properties on every resource type it does not exclude
const rootPrincipalTargets: PolicyTarget[] = [
  bucketPolicyTarget,
  {
    resource: { type: 'AWS::Events::EventBus', properties: { Name: 'example-bus' }, policyProperty: 'Policy' },
    action: 'events:PutEvents',
    arn: 'arn:aws:events:us-west-2:123456789012:event-bus/example-bus',
  },
  {
    resource: {
      type: 'AWS::SecretsManager::ResourcePolicy',
      properties: { SecretId: 'arn:aws:secretsmanager:us-west-2:123456789012:secret:example' },
      policyProperty: 'ResourcePolicy',
    },
    action: 'secretsmanager:GetSecretValue',
    arn: '*',
  },
];

function rootPrincipalShapes(ruleName: string): PolicyShape[] {
  const conditions: Array<[string, unknown]> = [
    ['an ArnEquals Condition', { ArnEquals: { 'aws:PrincipalArn': roleArn } }],
    ['a StringEquals Condition', { StringEquals: { 'aws:PrincipalOrgID': 'o-exampleorgid' } }],
  ];
  return [
    ...rootPrincipalTargets.flatMap(target => notPrincipalShapes(
      ruleName, target, ['{ AWS: account root ARN }', { AWS: rootArn }], conditions, ['{ Service }', { Service: 'logging.s3.amazonaws.com' }],
    ).map(shape => ({ ...shape, title: `${shape.title} in ${target.resource.type} ${target.resource.policyProperty}` }))),
    // AWS::KMS::Key holds its policy in KeyPolicy, which the rule does not read. The statement sits under
    // PolicyDocument instead, so that only the excluded type keeps the rule from firing.
    {
      title: 'NotPrincipal { AWS: account root ARN } in the excluded type AWS::KMS::Key',
      resource: { type: 'AWS::KMS::Key', properties: {}, policyProperty: 'PolicyDocument' },
      statement: { Effect: 'Allow', NotPrincipal: { AWS: rootArn }, Action: 'kms:Decrypt', Resource: '*' },
      status: skips,
    },
  ];
}

/** One policy-shape suite: the rule, the resource that holds each statement unless a shape names its own, and the shapes */
interface ShapeSuite {
  readonly ruleName: string;
  readonly resource: PolicyResource;
  readonly shapes: PolicyShape[];
}

const shapeSuites: Record<string, ShapeSuite> = {
  ...Object.fromEntries(Object.entries(worldAccessRules).map(([ruleId, rule]): [string, ShapeSuite] => [ruleId, {
    ruleName: rule.ruleName,
    resource: { type: rule.type, properties: rule.properties, policyProperty: 'PolicyDocument' },
    shapes: worldAccessShapes(rule),
  }])),
  'resource-policies/resource-policy-root-principal-needs-conditions': {
    ruleName: 'RESOURCE_POLICY_ROOT_PRINCIPAL_NEEDS_CONDITIONS',
    resource: bucketPolicyTarget.resource,
    shapes: rootPrincipalShapes('RESOURCE_POLICY_ROOT_PRINCIPAL_NEEDS_CONDITIONS'),
  },
  's3/s3-no-confused-deputy': {
    ruleName: 'S3_NO_CONFUSED_DEPUTY',
    resource: bucketPolicyTarget.resource,
    shapes: notPrincipalShapes(
      'S3_NO_CONFUSED_DEPUTY',
      bucketPolicyTarget,
      ['{ Service }', { Service: 'logging.s3.amazonaws.com' }],
      [['an aws:SourceAccount Condition', { StringEquals: { 'aws:SourceAccount': '123456789012' } }]],
      ['{ AWS: role ARN }', { AWS: roleArn }],
    ),
  },
};

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
    const isSkipped = (scan: string, fixture: string) => scan === 'static' && fixturesTheStaticScanSkips.includes(`${ruleId}/${fixture}`);
    const fixtures = [...requiredFixtures, ...extraFixtures];
    const cases = scans.flatMap(scan => fixtures.map(fixture => [scan, fixture]));
    const skipCases = cases.filter(([scan, fixture]) => isSkipped(scan, fixture));
    const fireCases = cases.filter(([scan, fixture]) => !isSkipped(scan, fixture) && fixture.startsWith('non-'));
    const passCases = cases.filter(([scan, fixture]) => !isSkipped(scan, fixture) && !fixture.startsWith('non-'));
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

  describe.each(Object.keys(shapeSuites))('rules/%s.guard policy shapes', (ruleId) => {
    const rule = shapeSuites[ruleId];
    const ruleFile = path.join(rulesDir, `${ruleId}.guard`);
    const shapesDir = path.join(outputDir, 'policy-shapes', ruleId);
    const shapes = rule.shapes;

    beforeAll(() => {
      fs.mkdirSync(path.join(shapesDir, 'static'), { recursive: true });
      shapes.forEach((shape, index) => {
        const resource = shape.resource ?? rule.resource;
        const template = {
          Resources: {
            Policy: {
              Type: resource.type,
              ...(shape.metadata ? { Metadata: shape.metadata } : {}),
              Properties: { ...resource.properties, [resource.policyProperty]: { Version: '2012-10-17', Statement: [...(shape.otherStatements ?? []), shape.statement] } },
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
