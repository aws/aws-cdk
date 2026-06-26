import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
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
});
