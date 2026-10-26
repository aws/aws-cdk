import { enhanceXmlWithFormattedFailures, postProcessXml, runCfnGuardValidation } from '../src/cfn-guard-runner';
import { preprocessTemplates } from '../src/template-preprocessor';
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
      [19, ['::warning::⚠️ CFN-Guard (Static) validation found issues']],
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
