import { enhanceXmlWithFormattedFailures, postProcessXml, runCfnGuardValidation } from '../src/cfn-guard-runner';
import { preprocessTemplates } from '../src/template-preprocessor';
import { judgeTemplateFiles } from '../src/scan';
import { failures, ReportElement, reportTree } from './junit-report';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type ScanType = 'Static' | 'Resolved';

describe('cfn-guard report post-processing', () => {
  const templatesDir = path.join(__dirname, 'templates');
  const rulesDir = path.join(__dirname, '..', 'rules');
  const repoPath = 'test/aws-iam/test/integ.role.js.snapshot/RoleStack.template.json';
  const anyTime = expect.any(String);
  let workDir: string;

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfn-guard-runner-'));
  });

  afterEach(() => {
    fs.rmSync(workDir, { recursive: true });
  });

  function fixture(name: string): string {
    return fs.readFileSync(path.join(templatesDir, name), 'utf8');
  }

  function element(name: string, attributes: Record<string, string>, children: (ReportElement | string)[] = []): ReportElement {
    return { name, attributes, children };
  }

  /**
   * Scans changed templates the way the action does and returns the report path.
   *
   * The static scan reads a copy of each template named after its repository path and
   * the resolved scan reads the preprocessed copies; both reports map back to those paths.
   * `rules` is a path in the rules folder, or an absolute path.
   */
  async function scan(scanType: ScanType, changed: { repoPath: string; template: string }[], rules: string, enhanceXml: boolean): Promise<string> {
    const changedDir = path.join(workDir, 'changed_templates');
    const resolvedDir = path.join(workDir, 'changed_templates_resolved');
    fs.mkdirSync(changedDir);
    fs.mkdirSync(resolvedDir);
    const fileMapping = new Map<string, string>();
    for (const { repoPath: changedPath, template } of changed) {
      const changedFile = path.join(changedDir, changedPath.replace(/\//g, '_'));
      fs.writeFileSync(changedFile, template);
      fileMapping.set(changedFile, changedPath);
    }
    const { mapping } = preprocessTemplates(changedDir, resolvedDir);

    const report = path.join(workDir, 'report.xml');
    await runCfnGuardValidation(
      scanType === 'Static' ? changedDir : resolvedDir,
      path.resolve(rulesDir, rules),
      report,
      scanType,
      new Map([...fileMapping, ...mapping]),
      enhanceXml,
    );
    return report;
  }

  describe('a report with a failure', () => {
    const template = fixture('world-accessible-trust-policy.template.json');
    const errorText = "IAM role trust policy must not use broadly scoped principals. Remove '*' from Principal and scope to specific accounts or roles.";
    // The checks cfn-guard reports for the rule, at the template positions each scan reads
    const checks: Record<ScanType, string[]> = {
      Static: [
        'Check was not compliant as property value [Path=/Resources/WorldAccessibleRole/Properties/AssumeRolePolicyDocument/Statement/0/Principal[L:10,C:27] Value="*"] equal to value [Path=[L:0,C:0] Value="*"].',
        'Check was not compliant as property value [Path=/Resources/WorldAccessibleRoleAwsList/Properties/AssumeRolePolicyDocument/Statement/0/Principal/AWS/0[L:26,C:24] Value="*"] equal to value [Path=[L:0,C:0] Value="*"].',
      ],
      Resolved: [
        'Check was not compliant as property value [Path=/Resources/WorldAccessibleRole/Properties/AssumeRolePolicyDocument/Statement/0/Principal[L:10,C:27] Value="*"] equal to value [Path=[L:0,C:0] Value="*"].',
        'Check was not compliant as property value [Path=/Resources/WorldAccessibleRoleAwsList/Properties/AssumeRolePolicyDocument/Statement/0/Principal/AWS/0[L:27,C:18] Value="*"] equal to value [Path=[L:0,C:0] Value="*"].',
      ],
    };

    function findingReport(message: string, text: string): ReportElement {
      return element('testsuites', { name: 'cfn-guard validate report', tests: '1', failures: '1', errors: '0', time: anyTime }, [
        element('testsuite', { name: repoPath, file: repoPath, errors: '0', failures: '1', time: anyTime }, [
          element('testcase', { name: 'iam-role-no-broad-principals.guard', time: anyTime }, [
            element('failure', { message }, [text]),
          ]),
        ]),
      ]);
    }

    test.each<ScanType>(['Static', 'Resolved'])('%s scan: maps the testsuite to the changed file and prefixes the failure message with the scan type', async (scanType) => {
      const report = await scan(scanType, [{ repoPath, template }], 'iam/iam-role-no-broad-principals.guard', false);

      expect(reportTree(report)).toEqual(findingReport(
        `[Type: ${scanType}] IAM_ROLE_NO_BROAD_PRINCIPALS`,
        checks[scanType].map(check => `##ERROR:${errorText}##${check}`).join(''),
      ));
    });

    test.each<ScanType>(['Static', 'Resolved'])('%s scan with enhanceXml: uses the rule\'s ##ERROR text as the failure message and starts each check on a new line', async (scanType) => {
      const report = await scan(scanType, [{ repoPath, template }], 'iam/iam-role-no-broad-principals.guard', true);

      expect(reportTree(report)).toEqual(findingReport(
        `[Type: ${scanType}] ${errorText}`,
        checks[scanType].map(check => `\n${check}`).join(''),
      ));
    });
  });

  describe('a report with several testsuites and failures', () => {
    const rolePath = 'test/aws-iam/test/integ.role.js.snapshot/RoleStack.template.json';
    const pipelinePath = 'test/aws-codepipeline/test/integ.pipeline.js.snapshot/PipelineStack.template.json';
    const changed = [
      { repoPath: rolePath, template: fixture('world-accessible-trust-policy.template.json') },
      { repoPath: pipelinePath, template: fixture('codepipelinenestedstackPipelineCrossRegionStack37C990C7.nested.template.json') },
    ];
    const errorTexts: Record<string, string> = {
      IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY: "IAM role trust policy must not be world-accessible. Remove '*' from Principal and scope to specific accounts, roles, or services.",
      IAM_ROLE_NO_BROAD_PRINCIPALS: "IAM role trust policy must not use broadly scoped principals. Remove '*' from Principal and scope to specific accounts or roles.",
      IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS: 'Root principal requires a strict condition (ArnEquals or StringEquals) to scope down who can assume this role. ArnLike/StringLike are not accepted as they allow wildcards.',
    };
    // The rules that fail, in report order: the pipeline template's testsuite comes first
    const failedRules = ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS', 'IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY', 'IAM_ROLE_NO_BROAD_PRINCIPALS', 'IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'];

    test.each<[ScanType, boolean]>([['Static', false], ['Resolved', false], ['Static', true], ['Resolved', true]])('%s scan, enhanceXml %s: maps every testsuite and edits every failure message', async (scanType, enhanceXml) => {
      const report = await scan(scanType, changed, 'iam', enhanceXml);

      const testsuites = reportTree(report).children as ReportElement[];
      expect(testsuites.map(testsuite => [testsuite.attributes.name, testsuite.attributes.file])).toEqual([
        [pipelinePath, pipelinePath],
        [rolePath, rolePath],
      ]);
      expect(failures(report).map(failure => failure.message)).toEqual(
        failedRules.map(rule => `[Type: ${scanType}] ${enhanceXml ? errorTexts[rule] : rule}`),
      );
    });
  });

  test('with enhanceXml, keeps the rule name as the message of a failure without ##ERROR text', async () => {
    const rules = path.join(workDir, 'role-description.guard');
    fs.writeFileSync(rules, [
      'rule ROLE_HAS_DESCRIPTION {',
      "  Resources.*[ Type == 'AWS::IAM::Role' ] {",
      '    Properties.Description exists',
      '    Properties.MaxSessionDuration exists',
      '  }',
      '}',
      '',
    ].join('\n'));
    const template = JSON.stringify({ Resources: { Role: { Type: 'AWS::IAM::Role', Properties: { RoleName: 'app' } } } }, null, 2);

    const report = await scan('Static', [{ repoPath, template }], rules, true);

    expect(reportTree(report)).toEqual(
      element('testsuites', { name: 'cfn-guard validate report', tests: '1', failures: '1', errors: '0', time: anyTime }, [
        element('testsuite', { name: repoPath, file: repoPath, errors: '0', failures: '1', time: anyTime }, [
          element('testcase', { name: 'role-description.guard', time: anyTime }, [
            element('failure', { message: '[Type: Static] ROLE_HAS_DESCRIPTION' }, [
              ['Description', 'MaxSessionDuration']
                .map(property => `\nCheck was not compliant as property [${property}] is missing. Value traversed to [Path=/Resources/Role/Properties[L:4,C:20] Value={"RoleName":"app"}].`)
                .join(''),
            ]),
          ]),
        ]),
      ]),
    );
  });

  test.each<ScanType>(['Static', 'Resolved'])('%s scan of rules that pass: maps the testsuite to the changed file and changes nothing else', async (scanType) => {
    const report = await scan(scanType, [{ repoPath, template: fixture('compliant-secure.template.json') }], 'ec2', true);

    expect(reportTree(report)).toEqual(
      element('testsuites', { name: 'cfn-guard validate report', tests: '2', failures: '0', errors: '0', time: anyTime }, [
        element('testsuite', { name: repoPath, file: repoPath, errors: '0', failures: '0', time: anyTime }, [
          element('testcase', { name: 'ec2-ebs-encryption-enabled.guard', time: anyTime, status: 'pass' }),
          element('testcase', { name: 'ec2-no-open-security-groups.guard', time: anyTime, status: 'pass' }),
        ]),
      ]),
    );
  });

  test.each<ScanType>(['Static', 'Resolved'])('%s scan of rules that skip: maps the testsuite to the changed file and changes nothing else', async (scanType) => {
    const report = await scan(scanType, [{ repoPath, template: fixture('compliant-secure.template.json') }], 'sns', true);

    expect(reportTree(report)).toEqual(
      element('testsuites', { name: 'cfn-guard validate report', tests: '2', failures: '0', errors: '0', time: anyTime }, [
        element('testsuite', { name: repoPath, file: repoPath, errors: '0', failures: '0', time: anyTime }, [
          element('testcase', { name: 'sns-no-world-accessible-inline.guard', time: anyTime, status: 'skip' }),
          element('testcase', { name: 'sns-no-world-accessible.guard', time: anyTime, status: 'skip' }),
        ]),
      ]),
    );
  });

  test('leaves the report empty when cfn-guard writes none', async () => {
    const report = await scan('Static', [{ repoPath, template: '{ "Resources": ' }], 'ec2', true);

    expect(fs.readFileSync(report, 'utf8')).toBe('');
  });

  test.each([
    ['markup', 'arn:aws:iam::123456789012:</failure><x a="&amp;">\'</x>:root'],
    ['carriage returns', 'arn:aws:iam::123456789012:cr\rcrlf\r\nend:root'],
  ])('keeps %s from a template value unchanged in the failure text', async (_, principal) => {
    const template = JSON.stringify({
      Resources: {
        Role: {
          Type: 'AWS::IAM::Role',
          Properties: { AssumeRolePolicyDocument: { Statement: [{ Effect: 'Allow', Principal: { AWS: principal }, Action: 'sts:AssumeRole' }] } },
        },
      },
    }, null, 2);

    const report = await scan('Static', [{ repoPath, template }], 'iam/iam-role-root-principal-needs-conditions.guard', true);

    const statement = `[Path=/Resources/Role/Properties/AssumeRolePolicyDocument/Statement/0[L:7,C:12] Value={"Effect":"Allow","Principal":{"AWS":"${principal}"},"Action":"sts:AssumeRole"}]`;
    expect(reportTree(report)).toEqual(
      element('testsuites', { name: 'cfn-guard validate report', tests: '1', failures: '1', errors: '0', time: anyTime }, [
        element('testsuite', { name: repoPath, file: repoPath, errors: '0', failures: '1', time: anyTime }, [
          element('testcase', { name: 'iam-role-root-principal-needs-conditions.guard', time: anyTime }, [
            element('failure', { message: '[Type: Static] Root principal requires a strict condition (ArnEquals or StringEquals) to scope down who can assume this role. ArnLike/StringLike are not accepted as they allow wildcards.' }, [
              ['Condition', 'Condition.ArnEquals', 'Condition.StringEquals']
                .map(property => `\nCheck was not compliant as property [${property}] is missing. Value traversed to ${statement}.`)
                .join(''),
            ]),
          ]),
        ]),
      ]),
    );
  });

  test('maps a changed file whose name has XML special characters', async () => {
    const specialRepoPath = "test/integ.app.js.snapshot/R&D'<Stack>.template.json";

    const report = await scan('Static', [{ repoPath: specialRepoPath, template: fixture('compliant-secure.template.json') }], 'ec2/ec2-ebs-encryption-enabled.guard', true);

    const [testsuite] = reportTree(report).children as ReportElement[];
    expect(testsuite.attributes).toEqual({ name: specialRepoPath, file: specialRepoPath, errors: '0', failures: '0', time: anyTime });
  });

  describe('a report that cannot be parsed', () => {
    const truncated = '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites name="cfn-guard validate report" tests="1" failures="0" errors="0" time="0">\n';

    test.each([
      ['is truncated after a start tag', truncated, 'unclosed xml tag(s): testsuites'],
      ['is truncated inside a start tag', '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites name="cfn-guard validate report"', 'unexpected end of input'],
      ['holds only whitespace', '\n  \n', 'missing root element'],
    ])('fails when the report %s, naming the report and the cause, and leaves it unchanged', (_, content, cause) => {
      const report = path.join(workDir, 'report.xml');
      fs.writeFileSync(report, content);

      expect(() => enhanceXmlWithFormattedFailures(report)).toThrow(`Could not parse the cfn-guard report ${report}: ${cause}`);
      expect(() => postProcessXml(report, new Map(), 'Static')).toThrow(`Could not parse the cfn-guard report ${report}: ${cause}`);
      expect(fs.readFileSync(report, 'utf8')).toBe(content);
    });

    test.each<[number, string[]]>([
      [0, []],
      [19, ['::warning::⚠️ CFN-Guard (Static) validation found issues', "::debug::The process '/usr/bin/sh' failed with exit code 19"]],
    ])('fails the scan once when cfn-guard exits %i with such a report, without reporting it as a finding', async (exitCode, expectedCommands) => {
      const report = path.join(workDir, 'report.xml');
      // Stands in for the cfn-guard run: writes a truncated report and exits with the given code
      const run = jest.spyOn(exec, 'exec').mockImplementation(async () => {
        fs.writeFileSync(report, truncated);
        if (exitCode !== 0) {
          throw new Error(`The process '/usr/bin/sh' failed with exit code ${exitCode}`);
        }
        return 0;
      });
      const commands: string[] = [];
      const write = jest.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
        commands.push(...String(chunk).split(/\r?\n/).filter(line => line.startsWith('::')));
        return true;
      });

      try {
        await expect(runCfnGuardValidation(templatesDir, rulesDir, report, 'Static', new Map(), true))
          .rejects.toThrow(`Could not parse the cfn-guard report ${report}: unclosed xml tag(s): testsuites`);
      } finally {
        write.mockRestore();
        run.mockRestore();
      }
      expect(commands).toEqual(expectedCommands);
      expect(fs.readFileSync(report, 'utf8')).toBe(truncated);
    });
  });
});

describe('cfn-guard report with Condition verdicts', () => {
  const rulesDir = path.join(__dirname, '..', 'rules');
  const templatesDir = path.join(__dirname, 'templates');
  let workDir: string;
  let dataDir: string;

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfn-guard-runner-verdicts-'));
    dataDir = path.join(workDir, 'data');
    fs.mkdirSync(dataDir);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fs.rmSync(workDir, { recursive: true });
  });

  // A bucket policy that lets any principal read objects only through the VPC endpoint of the template
  const endpointBucketPolicy = {
    Endpoint: { Type: 'AWS::EC2::VPCEndpoint', Properties: { ServiceName: 'com.amazonaws.us-west-2.s3', VpcId: 'vpc-1a2b3c4d' } },
    EndpointBucketPolicy: {
      Type: 'AWS::S3::BucketPolicy',
      Properties: {
        Bucket: 'example-bucket',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Action: 's3:GetObject',
            Resource: 'arn:aws:s3:::example-bucket/*',
            Condition: { StringEquals: { 'aws:SourceVpce': { Ref: 'Endpoint' } } },
          }],
        },
      },
    },
  };
  const worldTrustRoles = JSON.parse(fs.readFileSync(path.join(templatesDir, 'world-accessible-trust-policy.template.json'), 'utf8')).Resources;

  function writeTemplate(name: string, resources: Record<string, unknown>): void {
    fs.writeFileSync(path.join(dataDir, name), JSON.stringify({ Resources: resources }, null, 2));
  }

  /** Runs the static scan of the data folder with and without the verdicts of its templates */
  async function scanBoth(rules: string): Promise<{ passed: boolean; report: string; passedWithout: boolean; reportWithout: string }> {
    const reportWithout = path.join(workDir, 'without-verdicts.xml');
    const passedWithout = await runCfnGuardValidation(dataDir, rules, reportWithout, 'Static', new Map(), false);
    const report = path.join(workDir, 'with-verdicts.xml');
    const passed = await runCfnGuardValidation(dataDir, rules, report, 'Static', new Map(), false, judgeTemplateFiles(dataDir));
    return { passed, report, passedWithout, reportWithout };
  }

  /** The report without its time attributes, which differ between runs */
  function timeless(report: string): ReportElement {
    const strip = (element: ReportElement): ReportElement => ({
      name: element.name,
      attributes: Object.fromEntries(Object.entries(element.attributes).filter(([name]) => name !== 'time')),
      children: element.children.map(child => (typeof child === 'string' ? child : strip(child))),
    });
    return strip(reportTree(report));
  }

  test('turns the failure of a world access rule on a limited statement into a passing test case and lowers the failure counts', async () => {
    writeTemplate('template.json', { ...endpointBucketPolicy, ...worldTrustRoles });

    const { passed, report, passedWithout, reportWithout } = await scanBoth(rulesDir);

    const without = timeless(reportWithout);
    const [suiteWithout] = without.children as ReportElement[];
    const readable = (suite: ReportElement) => (suite.children as ReportElement[]).findIndex(testCase => testCase.attributes.name === 's3-no-world-readable.guard');
    expect((suiteWithout.children as ReportElement[])[readable(suiteWithout)].children).toEqual([
      element('failure', { message: '[Type: Static] S3_NO_WORLD_READABLE' }, [expect.stringContaining('EndpointBucketPolicy/Properties/PolicyDocument/Statement/0/Principal/AWS')]),
    ]);
    const failuresWithout = Number(suiteWithout.attributes.failures);
    expect(failuresWithout).toBeGreaterThan(1);
    expect(without.attributes.failures).toBe(String(failuresWithout));

    const testCasesWith = [...suiteWithout.children as ReportElement[]];
    testCasesWith[readable(suiteWithout)] = element('testcase', { name: 's3-no-world-readable.guard', status: 'pass' });
    expect(timeless(report)).toEqual({
      ...without,
      attributes: { ...without.attributes, failures: String(failuresWithout - 1) },
      children: [{ ...suiteWithout, attributes: { ...suiteWithout.attributes, failures: String(failuresWithout - 1) }, children: testCasesWith }],
    });
    expect([passedWithout, passed]).toEqual([false, false]);
  });

  test('passes once no failure remains', async () => {
    writeTemplate('template.json', endpointBucketPolicy);

    const { passed, report, passedWithout } = await scanBoth(path.join(rulesDir, 's3'));

    expect(failures(report)).toEqual([]);
    expect(reportTree(report).attributes.failures).toBe('0');
    expect([passedWithout, passed]).toEqual([false, true]);
  });

  test('leaves the report as cfn-guard wrote it and fails when cfn-guard exits with another status', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    // cfn-guard cannot parse this data file and exits with 255
    fs.writeFileSync(path.join(dataDir, 'truncated.json'), '{ "Resources": ');

    const { passed, report, passedWithout, reportWithout } = await scanBoth(rulesDir);

    expect(fs.readFileSync(report, 'utf8')).toBe(fs.readFileSync(reportWithout, 'utf8'));
    expect([passedWithout, passed]).toEqual([false, false]);
  });

  test('leaves the report as cfn-guard wrote it when the cfn-guard run exits 1', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const reportWithout = path.join(workDir, 'without-verdicts.xml');
    await runCfnGuardValidation(dataDir, rulesDir, reportWithout, 'Static', new Map(), false);
    const written = path.join(workDir, 'written.xml');
    await exec.exec('sh', ['-c', `cfn-guard validate --data "${dataDir}" --rules "${rulesDir}" --output-format junit --structured --show-summary none > "${written}"`], { ignoreReturnCode: true });
    const report = path.join(workDir, 'with-verdicts.xml');
    // Stands in for the cfn-guard run: writes the report cfn-guard writes, with exit status 1
    jest.spyOn(exec, 'exec').mockImplementation(async () => {
      fs.copyFileSync(written, report);
      return 1;
    });

    const passed = await runCfnGuardValidation(dataDir, rulesDir, report, 'Static', new Map(), false, judgeTemplateFiles(dataDir));

    expect(timeless(report)).toEqual(timeless(reportWithout));
    expect(passed).toBe(false);
  });

  test('leaves the report as cfn-guard wrote it when its JSON output cannot be read', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    jest.spyOn(exec, 'getExecOutput').mockResolvedValue({ exitCode: 19, stdout: 'not JSON', stderr: '' });

    const { passed, report, reportWithout } = await scanBoth(rulesDir);

    expect(timeless(report)).toEqual(timeless(reportWithout));
    expect(passed).toBe(false);
  });

  type JsonResult = { name: string; not_compliant?: { Rule: { name: string; checks: any[] } }[] };
  const readableChecks = (result: JsonResult) => result.not_compliant!.find(entry => entry.Rule.name === 'S3_NO_WORLD_READABLE')!.Rule.checks;

  test.each<[string, (results: JsonResult[]) => void]>([
    ['the JSON output has no result for the data file', results => results.splice(0, results.length)],
    ['the JSON result of the rule has no failed check', results => readableChecks(results[0]).splice(0)],
    ['the JSON result does not name the rule', results => {
      results[0].not_compliant = results[0].not_compliant!.filter(entry => entry.Rule.name !== 'S3_NO_WORLD_READABLE');
    }],
    ['a failed check has another form', results => readableChecks(results[0]).push({ Unknown: {} })],
    ['a failed check has no path', results => {
      delete readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path;
    }],
    ['a failed check is on another statement', results => {
      readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path = '/Resources/EndpointBucketPolicy/Properties/PolicyDocument/Statement/1/Principal/AWS';
    }],
    ['a failed check is on another property of the statement', results => {
      readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path = '/Resources/EndpointBucketPolicy/Properties/PolicyDocument/Statement/0/NotPrincipal';
    }],
    ['a failed check is on the statement list', results => {
      readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path = '/Resources/EndpointBucketPolicy/Properties/PolicyDocument/Statement';
    }],
    ['a failed check names the statement without its index', results => {
      readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path = '/Resources/EndpointBucketPolicy/Properties/PolicyDocument/Statement/Principal/AWS';
    }],
    ['a failed check is under another key of the Principal', results => {
      readableChecks(results[0])[0].Clause.Binary.check.Resolved.from.path = '/Resources/EndpointBucketPolicy/Properties/PolicyDocument/Statement/0/Principal/Service';
    }],
    ['the JSON result names another rule of the data file that the report does not', results => {
      results[0].not_compliant!.push({ Rule: { name: 'S3_SECURE_TRANSPORT', checks: [...readableChecks(results[0])] } });
    }],
  ])('keeps the failure when %s', async (_, edit) => {
    writeTemplate('template.json', endpointBucketPolicy);
    const getExecOutput = exec.getExecOutput;
    jest.spyOn(exec, 'getExecOutput').mockImplementation(async (command, args, options) => {
      const output = await getExecOutput(command, args, options);
      const results: JsonResult[] = JSON.parse(output.stdout);
      expect(readableChecks(results[0]).length).toBeGreaterThan(0);
      edit(results);
      return { ...output, stdout: JSON.stringify(results) };
    });

    const { passed, report, reportWithout } = await scanBoth(path.join(rulesDir, 's3'));

    expect(timeless(report)).toEqual(timeless(reportWithout));
    expect(failures(report).map(failure => failure.message)).toEqual(['[Type: Static] S3_NO_WORLD_READABLE']);
    expect(passed).toBe(false);
  });

  test('keeps the failure of a rule other than the world access rules on a limited statement', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const rules = path.join(workDir, 'bucket-principal.guard');
    fs.writeFileSync(rules, [
      "rule BUCKET_PRINCIPAL_NOT_STAR when Resources.*[ Type == 'AWS::S3::BucketPolicy' ] !empty {",
      "  Resources.*[ Type == 'AWS::S3::BucketPolicy' ].Properties.PolicyDocument.Statement[*] {",
      '    Principal.AWS != "*"',
      '  }',
      '}',
      '',
    ].join('\n'));

    const { passed, report, reportWithout } = await scanBoth(rules);

    expect(timeless(report)).toEqual(timeless(reportWithout));
    expect(failures(report).map(failure => failure.message)).toEqual(['[Type: Static] BUCKET_PRINCIPAL_NOT_STAR']);
    expect(passed).toBe(false);
  });

  test('fails when the JSON output names a failed data file that the report does not', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const getExecOutput = exec.getExecOutput;
    jest.spyOn(exec, 'getExecOutput').mockImplementation(async (command, args, options) => {
      const output = await getExecOutput(command, args, options);
      const results: JsonResult[] = JSON.parse(output.stdout);
      results.push({ ...results[0], name: path.join(dataDir, 'other.json') });
      return { ...output, stdout: JSON.stringify(results) };
    });

    const { passed, report } = await scanBoth(path.join(rulesDir, 's3'));

    expect(failures(report)).toEqual([]);
    expect(passed).toBe(false);
  });

  test('fails when cfn-guard exits with its not-compliant status but neither output names a failure', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const rules = path.join(rulesDir, 'ec2');
    const written = path.join(workDir, 'written.xml');
    await exec.exec('sh', ['-c', `cfn-guard validate --data "${dataDir}" --rules "${rules}" --output-format junit --structured --show-summary none > "${written}"`]);
    expect(failures(written)).toEqual([]);
    const report = path.join(workDir, 'with-verdicts.xml');
    // Stands in for both cfn-guard runs: their outputs name no failure, but each exits with the not-compliant status
    jest.spyOn(exec, 'exec').mockImplementation(async () => {
      fs.copyFileSync(written, report);
      return 19;
    });
    const getExecOutput = exec.getExecOutput;
    jest.spyOn(exec, 'getExecOutput').mockImplementation(async (command, args, options) => ({ ...await getExecOutput(command, args, options), exitCode: 19 }));

    const passed = await runCfnGuardValidation(dataDir, rules, report, 'Static', new Map(), false, judgeTemplateFiles(dataDir));

    expect(failures(report)).toEqual([]);
    expect(passed).toBe(false);
  });

  test('logs no warning when every failure is reported as passed', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const warnings: string[] = [];
    const write = jest.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
      warnings.push(...String(chunk).split(/\r?\n/).filter(line => line.startsWith('::warning::')));
      return true;
    });

    let passed: boolean;
    try {
      passed = await runCfnGuardValidation(dataDir, path.join(rulesDir, 's3'), path.join(workDir, 'report.xml'), 'Static', new Map(), false, judgeTemplateFiles(dataDir));
    } finally {
      write.mockRestore();
    }

    expect(warnings).toEqual([]);
    expect(passed).toBe(true);
  });

  test('keeps a test case with more than one failure', async () => {
    writeTemplate('template.json', endpointBucketPolicy);
    const rules = path.join(rulesDir, 's3', 's3-no-world-readable.guard');
    const written = path.join(workDir, 'written.xml');
    await exec.exec('sh', ['-c', `cfn-guard validate --data "${dataDir}" --rules "${rules}" --output-format junit --structured --show-summary none > "${written}"`], { ignoreReturnCode: true });
    const twoFailures = fs.readFileSync(written, 'utf8').replace('</failure>', '</failure><failure message="S3_NO_WORLD_READABLE">another failure</failure>');
    expect(twoFailures).not.toBe(fs.readFileSync(written, 'utf8'));
    const expected = path.join(workDir, 'expected.xml');
    fs.writeFileSync(expected, twoFailures);
    postProcessXml(expected, new Map(), 'Static');
    const report = path.join(workDir, 'with-verdicts.xml');
    // Stands in for the cfn-guard run: writes a report whose test case has two failures, with the not-compliant exit status
    jest.spyOn(exec, 'exec').mockImplementation(async () => {
      fs.writeFileSync(report, twoFailures);
      return 19;
    });

    const passed = await runCfnGuardValidation(dataDir, rules, report, 'Static', new Map(), false, judgeTemplateFiles(dataDir));

    expect(timeless(report)).toEqual(timeless(expected));
    expect(passed).toBe(false);
  });

  // cfn-guard reports a rule file with several rules as one test case with one failure, named after
  // the last rule that failed and holding the checks of all of them
  test.each([
    ['last', ['BUCKET_NAMED', 'S3_NO_WORLD_READABLE']],
    ['first', ['S3_NO_WORLD_READABLE', 'BUCKET_NAMED']],
  ])('keeps the failure of a rule file whose world access rule comes %s beside another failing rule', async (_, order) => {
    writeTemplate('template.json', endpointBucketPolicy);
    const ruleTexts: Record<string, string[]> = {
      S3_NO_WORLD_READABLE: [
        "rule S3_NO_WORLD_READABLE when Resources.*[ Type == 'AWS::S3::BucketPolicy' ] !empty {",
        "  Resources.*[ Type == 'AWS::S3::BucketPolicy' ].Properties.PolicyDocument.Statement[*] {",
        '    Principal.AWS != "*"',
        '  }',
        '}',
      ],
      BUCKET_NAMED: [
        "rule BUCKET_NAMED when Resources.*[ Type == 'AWS::S3::BucketPolicy' ] !empty {",
        "  Resources.*[ Type == 'AWS::S3::BucketPolicy' ].Properties.Bucket != \"example-bucket\"",
        '}',
      ],
    };
    const rules = path.join(workDir, 'two-rules.guard');
    fs.writeFileSync(rules, [...order.flatMap(rule => ruleTexts[rule]), ''].join('\n'));

    const { passed, report, reportWithout } = await scanBoth(rules);

    expect(timeless(report)).toEqual(timeless(reportWithout));
    expect(failures(report)).toHaveLength(1);
    expect(passed).toBe(false);
  });

  function element(name: string, attributes: Record<string, string>, children: (ReportElement | string)[] = []): ReportElement {
    return { name, attributes, children };
  }
});
