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

afterAll(() => {
  jest.resetAllMocks();
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

    app.synth();

    expect(process.exitCode).toEqual(1);
    const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(output).toContain('BogusProperty');
  });

  test('does not run when feature flag is disabled', () => {
    const app = new core.App({
      context: {
        [cxapi.VALIDATE_AGAINST_DEFAULT_RULES]: false,
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
      customRules: [{ name: 'my-rule', content: 'package main' }],
    });

    expect(plugin.name).toBe('CloudFormation Validate');
    expect(plugin.version).toBeDefined();
    expect(plugin.ruleIds).toBeDefined();
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
    const report = plugin.validate({ templatePaths: [templatePath], appConstruct: new Construct(undefined as any, '') });

    expect(report.success).toBe(false);
    expect(report.violations.length).toBeGreaterThan(0);
    const schemaViolation = report.violations.find(v => v.description.includes('InvalidProp'));
    expect(schemaViolation).toBeDefined();

    fs.rmSync(tmpDir, { recursive: true });
  });
});
