import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { PolicyValidationReportJson } from '@aws-cdk/cloud-assembly-schema';
import { Construct } from 'constructs';
import * as cxapi from '../../../cx-api';
import * as core from '../../lib';

let consoleErrorMock: jest.SpyInstance;
beforeEach(() => {
  consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { return true; });
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
  process.exitCode = undefined;
});

afterEach(() => {
  jest.clearAllMocks();
});

const originalContextJson = process.env.CDK_CONTEXT_JSON;

beforeAll(() => {
  // These tests validate the plugin's own behavior — strict mode would mask the signals
  // by throwing before tests can assert on warnings/errors.
  process.env.CDK_CONTEXT_JSON = JSON.stringify({
    ...JSON.parse(originalContextJson ?? '{}'),
    '@aws-cdk/core:strictCfnValidateErrors': false,
  });
});

afterAll(() => {
  jest.resetAllMocks();
  process.env.CDK_CONTEXT_JSON = originalContextJson;
});

describe('CloudFormationValidatePlugin', () => {
  test('reports schema violations for invalid properties', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
      properties: {
        BogusProperty: 'invalid-value',
      },
    });

    expect(() => app.synth()).toThrow(/BogusProperty/);
  });

  test('downgrades errors to warnings when flag is not explicitly enabled', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
      properties: {
        BogusProperty: 'invalid-value',
      },
    });

    app.synth();

    expect(process.exitCode).toBeUndefined();
    const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(output).toContain('Template validation found issues in your templates');
    expect(output).toContain(cxapi.VALIDATE_AGAINST_DEFAULT_RULES);
  });

  test('template paths are assembly-relative, also for nested assemblies', () => {
    const app = new core.App({
      context: {
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
      properties: { BogusProperty: 'invalid-value' },
    });
    const stage = new core.Stage(app, 'MyStage');
    const stack2 = new core.Stack(stage, 'TestStack2');
    new core.CfnResource(stack2, 'MyBucket2', {
      type: 'AWS::S3::Bucket',
      properties: { BogusProperty: 'invalid-value' },
    });

    const asm = app.synth();

    // THEN
    const validationReport = loadValidationReport(asm);
    const report = validationReport.pluginReports.find((r: any) => r.pluginName === 'CloudFormation Validate');
    expect(report?.violations).toEqual([
      expect.objectContaining({
        ruleName: 'F3002',
        violatingConstructs: [
          expect.objectContaining({
            cloudFormationResource: expect.objectContaining({
              logicalId: 'MyBucket2',
              templatePath: 'assembly-MyStage/MyStageTestStack242E16257.template.json',
            }),
          }),
          expect.objectContaining({
            cloudFormationResource: expect.objectContaining({
              logicalId: 'MyBucket',
              templatePath: 'TestStack.template.json',
            }),
          }),
        ],
      }),
    ]);
  });

  test('succeeds with valid template', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
    });

    app.synth();

    expect(process.exitCode).toBeUndefined();
  });

  test('correctly reports errors at stack level instead of resource level', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    // REmove any acknowledgements for this test, since we want to see the errors
    (app.node as any)._metadata = [];

    // F0001 missing resources
    new core.Stack(app, 'TestStack');

    const report = loadValidationReport(app.synth());
    expect(report).toEqual(expect.objectContaining({
      pluginReports: expect.arrayContaining([
        expect.objectContaining({
          pluginName: 'CloudFormation Validate',
          violations: expect.arrayContaining([
            expect.objectContaining({
              ruleName: 'F0001',
              violatingConstructs: expect.arrayContaining([
                expect.objectContaining({
                  constructPath: 'TestStack',
                }),
              ]),
            }),
          ]),
        }),
      ]),

    }));
  });

  test('correctly reports errors for non-resources (e.g. Parameters) instead of resource level', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
      },
    });
    // REmove any acknowledgements for this test, since we want to see the errors
    (app.node as any)._metadata = [];

    const stack = new core.Stack(app, 'TestStack');
    new core.CfnParameter(stack, 'MyParam', {
      type: 'Blimp',
    });

    const report = loadValidationReport(app.synth());
    expect(report).toEqual(expect.objectContaining({
      pluginReports: expect.arrayContaining([
        expect.objectContaining({
          pluginName: 'CloudFormation Validate',
          violations: expect.arrayContaining([
            expect.objectContaining({
              ruleName: 'F0001',
              violatingConstructs: expect.arrayContaining([
                expect.objectContaining({
                  // TODO: Currently this references the stack, in the future perhaps we have more information
                  // to reference the actual Parameter construct: <https://github.com/aws-cloudformation/cloudformation-validate/issues/201>
                  constructPath: 'TestStack',
                }),
              ]),
            }),
          ]),
        }),
      ]),

    }));
  });

  test('plugin can be instantiated directly with custom rules', () => {
    const plugin = new core.CloudFormationValidatePlugin({
      regoRules: [{ name: 'my-rule', content: 'package main' }],
    });

    expect(plugin.name).toBe('CloudFormation Validate');
    expect(plugin.version).toBeDefined();
    expect(plugin.ruleIds).toBeDefined();
  });

  test('user-registered instance replaces the auto-registered one', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin());
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
    });

    app.synth();

    expect(process.exitCode).toBeUndefined();
  });

  test('fails when registering more than one CloudFormationValidatePlugin', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin());
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin());

    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
    });

    expect(() => app.synth()).toThrow(/only one instance of CloudFormationValidatePlugin can be registered/);
  });

  test('fails when registered on a Stage instead of App', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    const stage = new core.Stage(app, 'MyStage');
    core.Validations.of(stage).addPlugins(new core.CloudFormationValidatePlugin());
    const stack = new core.Stack(stage, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
    });

    expect(() => app.synth()).toThrow(/CloudFormationValidatePlugin can only be registered at the App level/);
  });

  test('plugin validates a template file directly', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-validate-'));
    const templatePath = path.join(tmpDir, 'template.json');
    fs.writeFileSync(templatePath, JSON.stringify({
      Resources: {
        MyBucket: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            InvalidProp: 'bad',
          },
        },
      },
    }));

    const plugin = new core.CloudFormationValidatePlugin();
    const report = plugin.validate({
      templatePaths: [templatePath],
      stackTemplates: [{ stackConstructPath: 'TestStack', templatePath }],
      appConstruct: new Construct(undefined as any, ''),
      accountId: undefined,
      region: undefined,
    });

    expect(report.success).toBe(false);
    expect(report.violations.length).toBeGreaterThan(0);
    const schemaViolation = report.violations.find(v => v.description.includes('InvalidProp'));
    expect(schemaViolation).toBeDefined();

    fs.rmSync(tmpDir, { recursive: true });
  });

  describe('ICMP E9002 false positive suppression', () => {
    function validateTemplate(resources: Record<string, unknown>) {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-validate-'));
      const templatePath = path.join(tmpDir, 'template.json');
      fs.writeFileSync(templatePath, JSON.stringify({ Resources: resources }));
      try {
        return new core.CloudFormationValidatePlugin().validate({
          templatePaths: [templatePath],
          stackTemplates: [{ stackConstructPath: 'TestStack', templatePath }],
          appConstruct: new Construct(undefined as any, ''),
          accountId: undefined,
          region: undefined,
        });
      } finally {
        fs.rmSync(tmpDir, { recursive: true });
      }
    }

    // For ICMP rules, FromPort/ToPort are the ICMP type/code (with -1 meaning "all"), not an ordered
    // port range, so the engine's generic "FromPort > ToPort" check (E9002) is a false positive.
    test.each([
      ['icmp', 8],
      ['icmpv6', 128],
      ['1', 8], // IANA protocol number for ICMP
    ])('does not report E9002 for an ICMP rule (IpProtocol: %s)', (ipProtocol, fromPort) => {
      const report = validateTemplate({
        IcmpSg: {
          Type: 'AWS::EC2::SecurityGroup',
          Properties: {
            GroupDescription: 'test',
            SecurityGroupIngress: [
              { CidrIp: '0.0.0.0/0', FromPort: fromPort, IpProtocol: ipProtocol, ToPort: -1 },
            ],
          },
        },
      });

      expect(report.violations.find(v => v.ruleName === 'E9002')).toBeUndefined();
    });

    test('still reports E9002 for a genuine TCP range error', () => {
      const report = validateTemplate({
        BadTcpSg: {
          Type: 'AWS::EC2::SecurityGroup',
          Properties: {
            GroupDescription: 'test',
            SecurityGroupIngress: [
              { CidrIp: '0.0.0.0/0', FromPort: 443, IpProtocol: 'tcp', ToPort: 80 },
            ],
          },
        },
      });

      expect(report.violations.find(v => v.ruleName === 'E9002')).toBeDefined();
    });

    test('suppresses only the ICMP finding when a resource mixes ICMP and a bad TCP range', () => {
      const report = validateTemplate({
        MixedSg: {
          Type: 'AWS::EC2::SecurityGroup',
          Properties: {
            GroupDescription: 'test',
            SecurityGroupIngress: [
              { CidrIp: '0.0.0.0/0', FromPort: 8, IpProtocol: 'icmp', ToPort: -1 },
              { CidrIp: '0.0.0.0/0', FromPort: 443, IpProtocol: 'tcp', ToPort: 80 },
            ],
          },
        },
      });

      const e9002 = report.violations.filter(v => v.ruleName === 'E9002');
      expect(e9002).toHaveLength(1);
      expect(e9002[0].description).toContain('FromPort 443 is greater than ToPort 80');
    });
  });
});

describe('CDK_VALIDATION environment variable', () => {
  const originalCdkValidation = process.env.CDK_VALIDATION;

  afterEach(() => {
    if (originalCdkValidation === undefined) {
      delete process.env.CDK_VALIDATION;
    } else {
      process.env.CDK_VALIDATION = originalCdkValidation;
    }
  });

  function appWithInvalidResource() {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: true,
        [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: true,
      },
    });
    const stack = new core.Stack(app, 'TestStack');
    new core.CfnResource(stack, 'MyBucket', {
      type: 'AWS::S3::Bucket',
      properties: {
        BogusProperty: 'invalid-value',
      },
    });
    return app;
  }

  test('CDK_VALIDATION=false disables the auto-registered validation engine', () => {
    process.env.CDK_VALIDATION = 'false';
    const app = appWithInvalidResource();

    // Would throw on BogusProperty if the default engine ran
    expect(() => app.synth()).not.toThrow();
    expect(process.exitCode).toBeUndefined();
  });

  test('CDK_VALIDATION=false does not disable explicitly registered plugins', () => {
    process.env.CDK_VALIDATION = 'false';
    const app = appWithInvalidResource();
    core.Validations.of(app).addPlugins(new core.CloudFormationValidatePlugin());

    expect(() => app.synth()).toThrow(/BogusProperty/);
  });

  test('CDK_VALIDATION=true keeps the default validation engine enabled', () => {
    process.env.CDK_VALIDATION = 'true';
    const app = appWithInvalidResource();

    expect(() => app.synth()).toThrow(/BogusProperty/);
  });

  test('unset CDK_VALIDATION keeps the default validation engine enabled', () => {
    delete process.env.CDK_VALIDATION;
    const app = appWithInvalidResource();

    expect(() => app.synth()).toThrow(/BogusProperty/);
  });
});

function loadValidationReport(asm: cxapi.CloudAssembly) {
  const p = path.join(asm.directory, 'validation-report.json');
  return JSON.parse(fs.readFileSync(p, { encoding: 'utf-8' })) as PolicyValidationReportJson;
}
