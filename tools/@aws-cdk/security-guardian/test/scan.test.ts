import { scanChangedTemplates } from '../src/scan';
import { defaultDoubled, expandingValues } from './expanding-values';
import { ReportElement, reportTree } from './junit-report';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('scanChangedTemplates', () => {
  const rulesDir = path.join(__dirname, '..', 'rules');
  let workDir: string;

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'security-guardian-scan-'));
  });

  afterEach(() => {
    fs.rmSync(workDir, { recursive: true });
  });

  /** Scans templates at their repository paths with every rule, as the action does, and returns each report's statuses */
  async function scan(templates: Record<string, unknown>) {
    const changedDir = path.join(workDir, 'changed_templates');
    const resolvedDir = path.join(workDir, 'changed_templates_resolved');
    fs.mkdirSync(changedDir);
    fs.mkdirSync(resolvedDir);
    const fileMapping = new Map<string, string>();
    for (const [repoPath, template] of Object.entries(templates)) {
      const changedFile = path.resolve(changedDir, repoPath.replace(/\//g, '_'));
      fs.writeFileSync(changedFile, JSON.stringify(template, null, 2));
      fileMapping.set(changedFile, repoPath);
    }
    const staticReport = path.join(workDir, 'cfn-guard-static.xml');
    const resolvedReport = path.join(workDir, 'cfn-guard-resolved.xml');

    const result = await scanChangedTemplates({ changedDir, resolvedDir, ruleSetPath: rulesDir, staticReport, resolvedReport, fileMapping, enhanceXml: true });

    return { result, statuses: { Static: statusesByFile(staticReport), Resolved: statusesByFile(resolvedReport) } };
  }

  /** The status of each rule file's test case, by the testsuite's file */
  function statusesByFile(report: string): Record<string, Record<string, string>> {
    return Object.fromEntries((reportTree(report).children as ReportElement[]).map(testsuite => [
      testsuite.attributes.file,
      Object.fromEntries((testsuite.children as ReportElement[]).map(testCase => [
        testCase.attributes.name,
        testCase.children.some(child => typeof child !== 'string' && child.name === 'failure') ? 'fail' : testCase.attributes.status,
      ])),
    ]));
  }

  function bucketPolicy(condition: unknown, others: Record<string, unknown> = {}) {
    return {
      ...others,
      Resources: {
        Endpoint: { Type: 'AWS::EC2::VPCEndpoint', Properties: { ServiceName: 'com.amazonaws.us-west-2.s3', VpcId: 'vpc-1a2b3c4d' } },
        EgressBucketPolicy: {
          Type: 'AWS::S3::BucketPolicy',
          Properties: {
            Bucket: 'example-bucket',
            PolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                { Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:role/Reader' }, Action: 's3:GetObject', Resource: 'arn:aws:s3:::example-bucket/*' },
                { Effect: 'Allow', Principal: { AWS: '*' }, Action: 's3:GetObject', Resource: 'arn:aws:s3:::example-bucket/*', Condition: condition },
              ],
            },
          },
        },
      },
    };
  }

  test('passes a statement for any principal that a Condition limits to a VPC endpoint of the template, in both reports', async () => {
    const repoPath = 'test/aws-lambda/test/integ.app.js.snapshot/Stack.template.json';

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': { Ref: 'Endpoint' } } }) });

    for (const scanType of ['Static', 'Resolved'] as const) {
      expect(Object.keys(statuses[scanType])).toEqual([repoPath]);
      expect(statuses[scanType][repoPath]['s3-no-world-readable.guard']).toBe('pass');
      expect(Object.values(statuses[scanType][repoPath])).not.toContain('fail');
    }
    expect(result).toEqual({ staticPassed: true, resolvedPassed: true });
  });

  // The preprocessor turns each of these values into a string without wildcards, so only a verdict
  // on the committed template tells that the value is not fixed
  const notFixedValues: Record<string, [string, unknown, Record<string, unknown>?]> = {
    'fn-find-in-map-star-entry': ['StringLike', { 'Fn::FindInMap': ['Endpoints', { Ref: 'AWS::Region' }, 'Endpoint'] }, {
      Mappings: { Endpoints: { 'us-east-1': { Endpoint: 'vpce-1a2b3c4d' }, 'us-west-2': { Endpoint: '*' } } },
    }],
    'fn-find-in-map-undefined-map': ['StringLike', { 'Fn::FindInMap': ['Missing', { Ref: 'AWS::Region' }, 'Endpoint'] }],
    'fn-find-in-map-no-entry': ['StringLike', { 'Fn::FindInMap': ['Endpoints', 'eu-west-1', 'Endpoint'] }, {
      Mappings: { Endpoints: { 'us-east-1': { Endpoint: 'vpce-1a2b3c4d' } } },
    }],
    'fn-select-string-index': ['StringLike', { 'Fn::Select': ['0', ['*']] }],
    'fn-select-ref-index': ['StringLike', { 'Fn::Select': [{ Ref: 'Index' }, ['*']] }, { Parameters: { Index: { Type: 'Number', Default: 0 } } }],
    'fn-select-fn-split': ['StringLike', { 'Fn::Select': ['0', { 'Fn::Split': [',', 'arn:aws:sns:us-west-2:111122223333:t,*'] }] }],
    'fn-sub-unknown-variable': ['StringEquals', { 'Fn::Sub': '${Unknown}' }],
    'parameter-with-default': ['StringEquals', { Ref: 'EndpointId' }, { Parameters: { EndpointId: { Type: 'String', Default: 'vpce-1a2b3c4d' } } }],
    'parameter-without-default': ['StringEquals', { Ref: 'EndpointId' }, { Parameters: { EndpointId: { Type: 'String' } } }],
    'parameter-allowing-star': ['StringEquals', { Ref: 'EndpointId' }, { Parameters: { EndpointId: { Type: 'String', AllowedValues: ['vpce-1a2b3c4d', '*'] } } }],
    'ref-no-value': ['StringEquals', { Ref: 'AWS::NoValue' }],
    'ref-undefined-name': ['StringEquals', { Ref: 'MissingEndpoint' }],
  };

  test('keeps the failure in both reports for a Condition value whose resolved copy looks fixed', async () => {
    const templates = Object.fromEntries(Object.entries(notFixedValues).map(([name, [operator, value, others]]) =>
      [`test/integ.${name}.js.snapshot/Stack.template.json`, bucketPolicy({ [operator]: { 'aws:SourceVpce': value } }, others)]));

    const { result, statuses } = await scan(templates);

    for (const scanType of ['Static', 'Resolved'] as const) {
      expect(Object.fromEntries(Object.entries(statuses[scanType]).map(([file, rules]) => [file, rules['s3-no-world-readable.guard']])))
        .toEqual(Object.fromEntries(Object.keys(templates).map(file => [file, 'fail'])));
    }
    expect(result).toEqual({ staticPassed: false, resolvedPassed: false });
  });

  test('keeps the failure in both reports for a Condition value whose strings outnumber the bound many times over', async () => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';
    const select = { 'Fn::Select': ['0', Array.from({ length: 256 }, (_, i) => `vpce-${i}`)] };
    const value = { 'Fn::Join': ['', [...Array.from({ length: 3000 }, (_, i) => `p${i}`), select, select]] };

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': value } }) });

    expect([statuses.Static[repoPath]['s3-no-world-readable.guard'], statuses.Resolved[repoPath]['s3-no-world-readable.guard']]).toEqual(['fail', 'fail']);
    expect(result).toEqual({ staticPassed: false, resolvedPassed: false });
  });

  test.each<[string, unknown]>([
    ['a Fn::Split over a Fn::Sub with 20,000 references to a 6,500-part Fn::Join', expandingValues.repeatedJoinUnderSplit()],
    ['a Fn::Join of 100,000 literals after a part with 256 strings', expandingValues.longJoinAfterWidePart()],
  ])('keeps the failure in both reports for %s', async (_, value) => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': value } }) });

    expect([statuses.Static[repoPath]['s3-no-world-readable.guard'], statuses.Resolved[repoPath]['s3-no-world-readable.guard']]).toEqual(['fail', 'fail']);
    expect(result).toEqual({ staticPassed: false, resolvedPassed: false });
  }, 60000);

  test('keeps the failure in both reports for a Fn::Sub of 1,000 deploy-time values', async () => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': expandingValues.stackIdRepeats() } }) });

    expect([statuses.Static[repoPath]['s3-no-world-readable.guard'], statuses.Resolved[repoPath]['s3-no-world-readable.guard']]).toEqual(['fail', 'fail']);
    expect(result).toEqual({ staticPassed: false, resolvedPassed: false });
  }, 60000);

  // The preprocessor writes no resolved copy for these, so the template keeps its static failure as in the tool without verdicts
  test.each<[string, () => { value: unknown; others?: Record<string, unknown> }]>([
    ['a Fn::ImportValue doubled 16 times', () => ({ value: expandingValues.importValueDoubled() })],
    ['a Ref to a parameter whose Default is far longer than its AllowedValues, doubled 13 times', () => {
      const { parameters, value } = defaultDoubled();
      return { value, others: { Parameters: parameters } };
    }],
  ])('keeps the static failure of a template the preprocessor cannot resolve: %s', async (_, build) => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';
    const { value, others } = build();

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': value } }, others) });

    expect(statuses.Static[repoPath]['s3-no-world-readable.guard']).toBe('fail');
    expect(statuses.Resolved[repoPath]).toBeUndefined();
    expect(result.staticPassed).toBe(false);
  }, 60000);

  test('keeps the failure in the static report for a literal Fn::Sub that doubles its variable 40 times', async () => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': expandingValues.doublingSub(40) } }) });

    expect(statuses.Static[repoPath]['s3-no-world-readable.guard']).toBe('fail');
    // The preprocessor cannot resolve a string this long and writes no resolved copy, as in the tool without verdicts
    expect(statuses.Resolved[repoPath]).toBeUndefined();
    expect(result.staticPassed).toBe(false);
  }, 60000);

  test('keeps the failure in the static report for a Fn::Split over a Fn::Sub that doubles its variable 26 times', async () => {
    const repoPath = 'test/integ.expanding.js.snapshot/Stack.template.json';

    const { result, statuses } = await scan({ [repoPath]: bucketPolicy({ StringEquals: { 'aws:SourceVpce': expandingValues.nestedSubUnderSplit() } }) });

    expect(statuses.Static[repoPath]['s3-no-world-readable.guard']).toBe('fail');
    // The preprocessor cannot resolve a string this long and writes no resolved copy, as in the tool without verdicts
    expect(statuses.Resolved[repoPath]).toBeUndefined();
    expect(result.staticPassed).toBe(false);
  }, 60000);
});
