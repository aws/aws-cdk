import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import * as cxapi from '../../../cx-api';
import * as core from '../../lib';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { return true; });
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('validations', () => {
  test('validation failure writes report with violations', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          severity: 'medium',
          ruleMetadata: {
            id: 'abcdefg',
          },
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });

    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    expect(report.pluginReports).toHaveLength(1);
    expect(report.pluginReports[0].pluginName).toEqual('test-plugin');
    expect(report.pluginReports[0].conclusion).toEqual('failure');
    expect(report.pluginReports[0].violations[0]).toEqual(expect.objectContaining({
      ruleName: 'test-rule',
      description: 'test recommendation',
      severity: 'custom',
      customSeverity: 'medium',
      ruleMetadata: { id: 'abcdefg' },
    }));
    expect(report.pluginReports[0].violations[0].violatingConstructs[0]).toEqual(expect.objectContaining({
      constructPath: 'Default/Fake',
      cloudFormationResource: {
        templatePath: '/path/to/Default.template.json',
        logicalId: 'Fake',
        propertyPaths: ['test-location'],
      },
    }));
  });

  test('validation success writes no plugin reports', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', []),
        new FakePlugin('test-plugin2', []),
        new FakePlugin('test-plugin3', []),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'success',
      },
    });

    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    expect(report.pluginReports).toHaveLength(0);
  });

  test('multiple stacks - only violating stack appears in report', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource',
            templatePath: '/path/to/stack1.template.json',
          }],
        }]),
      ],
    });
    const stack1 = new core.Stack(app, 'stack1');
    new core.CfnResource(stack1, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack2 = new core.Stack(app, 'stack2');
    new core.CfnResource(stack2, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });

    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const cfnResource = report.pluginReports[0].violations[0].violatingConstructs[0].cloudFormationResource;
    expect(cfnResource.templatePath).toEqual('/path/to/stack1.template.json');
  });

  test('multiple stages', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin1', [{
          description: 'do something',
          ruleName: 'test-rule1',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource',
            templatePath: '/path/to/Stage1stack1DDED8B6C.template.json',
          }],
        }]),
      ],
    });
    const stage1 = new core.Stage(app, 'Stage1', {
      policyValidationBeta1: [
        new FakePlugin('test-plugin2', [{
          description: 'do something',
          ruleName: 'test-rule2',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource',
            templatePath: '/path/to/Stage1stack1DDED8B6C.template.json',
          }],
        }], '1.2.3'),
      ],
    });
    const stage2 = new core.Stage(app, 'Stage2', {
      policyValidationBeta1: [
        new FakePlugin('test-plugin3', [{
          description: 'do something',
          ruleName: 'test-rule3',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource',
            templatePath: '/path/to/Stage2stack259BA718E.template.json',
          }],
        }]),
      ],
    });
    const stage3 = new core.Stage(stage2, 'Stage3', {
      policyValidationBeta1: [
        new FakePlugin('test-plugin4', [{
          description: 'do something',
          ruleName: 'test-rule4',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource',
            templatePath: '/path/to/Stage2Stage3stack10CD36915.template.json',
          }],
        }]),
      ],
    });
    const stack3 = new core.Stack(stage3, 'stack1');
    new core.CfnResource(stack3, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack1 = new core.Stack(stage1, 'stack1');
    new core.CfnResource(stack1, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack2 = new core.Stack(stage2, 'stack2');
    new core.CfnResource(stack2, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });

    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const pluginNames = report.pluginReports.map((r: any) => r.pluginName);
    expect(pluginNames).toContain('test-plugin1');
    expect(pluginNames).toContain('test-plugin2');
    expect(pluginNames).toContain('test-plugin3');
    expect(pluginNames).toContain('test-plugin4');
  });

  test('multiple stages, multiple plugins', () => {
    const mockValidate = jest.fn().mockImplementation(() => {
      return {
        success: true,
        violations: [],
      };
    });
    const app = new core.App({
      policyValidationBeta1: [
        {
          name: 'test-plugin',
          validate: mockValidate,
        },
      ],
    });
    const stage1 = new core.Stage(app, 'Stage1', { });
    const stage2 = new core.Stage(app, 'Stage2', {
      policyValidationBeta1: [
        {
          name: 'test-plugin2',
          validate: mockValidate,
        },
      ],
    });
    const stage3 = new core.Stage(stage2, 'Stage3', { });
    const stack3 = new core.Stack(stage3, 'stack1');
    new core.CfnResource(stack3, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack1 = new core.Stack(stage1, 'stack1');
    new core.CfnResource(stack1, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack2 = new core.Stack(stage2, 'stack2');
    new core.CfnResource(stack2, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();

    expect(mockValidate).toHaveBeenCalledTimes(2);
    expect(mockValidate).toHaveBeenNthCalledWith(2, expect.objectContaining({
      templatePaths: [
        expect.stringMatching(/assembly-Stage1\/Stage1stack1DDED8B6C.template.json/),
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    }));
    expect(mockValidate).toHaveBeenNthCalledWith(1, expect.objectContaining({
      templatePaths: [
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    }));
  });

  test('multiple stages, single plugin', () => {
    const mockValidate = jest.fn().mockImplementation(() => {
      return {
        success: true,
        violations: [],
      };
    });
    const app = new core.App({
      policyValidationBeta1: [
        {
          name: 'test-plugin',
          validate: mockValidate,
        },
      ],
    });
    const stage1 = new core.Stage(app, 'Stage1', { });
    const stage2 = new core.Stage(app, 'Stage2', { });
    const stage3 = new core.Stage(stage2, 'Stage3', { });
    const stack3 = new core.Stack(stage3, 'stack1');
    new core.CfnResource(stack3, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack1 = new core.Stack(stage1, 'stack1');
    new core.CfnResource(stack1, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack2 = new core.Stack(stage2, 'stack2');
    new core.CfnResource(stack2, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();

    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledWith(expect.objectContaining({
      templatePaths: [
        expect.stringMatching(/assembly-Stage1\/Stage1stack1DDED8B6C.template.json/),
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    }));
  });

  test('multiple constructs - only violating construct in report', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'SomeResource317FDD71',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });
    const stack = new core.Stack(app);
    new LevelTwoConstruct(stack, 'SomeResource');
    new LevelTwoConstruct(stack, 'AnotherResource');
    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const constructPath = report.pluginReports[0].violations[0].violatingConstructs[0].constructPath;
    expect(constructPath).toEqual('Default/SomeResource/Resource');
  });

  test('multiple plugins', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('plugin1', [{
          description: 'do something',
          ruleName: 'rule-1',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
        new FakePlugin('plugin2', [{
          description: 'do another thing',
          ruleName: 'rule-2',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    expect(report.pluginReports).toHaveLength(2);
    expect(report.pluginReports[0].pluginName).toEqual('plugin1');
    expect(report.pluginReports[0].violations[0].ruleName).toEqual('rule-1');
    expect(report.pluginReports[1].pluginName).toEqual('plugin2');
    expect(report.pluginReports[1].violations[0].ruleName).toEqual('rule-2');
  });

  test('plugin throws an error', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new BrokenPlugin(),
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });

    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'success',
      },
    });

    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const brokenReport = report.pluginReports.find((r: any) => r.pluginName === 'broken-plugin');
    expect(brokenReport.conclusion).toEqual('failure');
    expect(brokenReport.metadata.error).toContain("Validation plugin 'broken-plugin' failed: Something went wrong");
  });

  test('plugin tries to modify a template', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new RoguePlugin(),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'success',
      },
    });
    expect(() => {
      app.synth();
    }).toThrow(/Illegal operation: validation plugin 'rogue-plugin' modified the cloud assembly/);
  });

  test('plugin that writes new files to assembly is allowed', () => {
    const app = new core.App({
      policyValidationBeta1: [
        {
          name: 'file-writer-plugin',
          validate(context: core.IPolicyValidationContextBeta1) {
            const assemblyDir = path.dirname(context.templatePaths[0]);
            fs.writeFileSync(path.join(assemblyDir, 'plugin-output.json'), '{"result":"ok"}');
            return { success: true, violations: [] };
          },
        },
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: { result: 'success' },
    });
    expect(() => app.synth()).not.toThrow();
    const outputFile = path.join(app.outdir, 'plugin-output.json');
    expect(fs.existsSync(outputFile)).toBe(true);
    expect(JSON.parse(fs.readFileSync(outputFile, 'utf-8'))).toEqual({ result: 'ok' });
  });

  test('plugin that deletes pre-existing file is caught', () => {
    const app = new core.App({
      policyValidationBeta1: [
        {
          name: 'deleter-plugin',
          validate(context: core.IPolicyValidationContextBeta1) {
            fs.unlinkSync(context.templatePaths[0]);
            return { success: true, violations: [] };
          },
        },
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'DefaultResource', {
      type: 'Test::Resource::Fake',
      properties: { result: 'success' },
    });
    expect(() => app.synth()).toThrow(/Illegal operation: validation plugin 'deleter-plugin' modified the cloud assembly/);
  });

  test('validation report JSON is written with correct structure', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          ruleMetadata: {
            id: 'abcdefg',
          },
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();

    const file = path.join(app.outdir, 'validation-report.json');
    const report = JSON.parse(fs.readFileSync(file).toString('utf-8'));
    expect(report).toEqual(expect.objectContaining({
      version: expect.any(String),
      title: 'Validation Report',
      pluginReports: [
        {
          pluginName: 'test-plugin',
          conclusion: 'failure',
          violations: [
            {
              ruleName: 'test-rule',
              description: 'test recommendation',
              severity: 'error',
              ruleMetadata: { id: 'abcdefg' },
              violatingConstructs: [
                {
                  constructPath: 'Default/Fake',
                  constructFqn: expect.stringMatching(/(aws-cdk-lib.CfnResource|Construct)/),
                  libraryVersion: expect.any(String),
                  cloudFormationResource: {
                    templatePath: '/path/to/Default.template.json',
                    logicalId: 'Fake',
                    propertyPaths: ['test-location'],
                  },
                  stackTraces: expect.any(Array),
                },
              ],
            },
          ],
        },
      ],
    }));
  });

  test('validationReportJson=true writes legacy report alongside new report', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
      context: {
        '@aws-cdk/core:validationReportJson': true,
      },
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: { result: 'failure' },
    });
    app.synth();

    // New format is always written
    const newFile = path.join(app.outdir, 'validation-report.json');
    expect(fs.existsSync(newFile)).toBe(true);
    const newReport = JSON.parse(fs.readFileSync(newFile, 'utf-8'));
    expect(newReport.version).toBeDefined();
    expect(newReport.pluginReports[0].conclusion).toEqual('failure');

    // Legacy format is also written when opted in
    const legacyFile = path.join(app.outdir, 'policy-validation-report.json');
    expect(fs.existsSync(legacyFile)).toBe(true);
    const legacyReport = JSON.parse(fs.readFileSync(legacyFile, 'utf-8'));
    expect(legacyReport.pluginReports[0].summary.status).toEqual('failure');
    expect(legacyReport.pluginReports[0].summary.pluginName).toEqual('test-plugin');
  });

  test('legacy report is NOT written by default', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      ],
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: { result: 'failure' },
    });
    app.synth();

    // New format written
    expect(fs.existsSync(path.join(app.outdir, 'validation-report.json'))).toBe(true);

    // Legacy format NOT written
    expect(fs.existsSync(path.join(app.outdir, 'policy-validation-report.json'))).toBe(false);
  });

  test('a plugin implementing Beta1 is assignable to IPolicyValidationPlugin', () => {
    // GIVEN
    const beta1Plugin: core.IPolicyValidationPluginBeta1 = new FakePlugin('beta1-plugin', []);

    // WHEN
    const plugin: core.IPolicyValidationPlugin = beta1Plugin;

    // THEN
    expect(plugin.name).toEqual('beta1-plugin');
  });

  describe('annotation report integration', () => {
    const annotationReportContext = { [cxapi.ANNOTATIONS_IN_VALIDATION_REPORT]: true };

    test('annotation warnings appear in validation report', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addWarningV2('my-lib:SomeWarning', 'This is a warning');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      expect(annotationPlugin).toBeDefined();
      expect(annotationPlugin.violations[0].ruleName).toContain('my-lib:SomeWarning');
    });

    test('annotation errors appear in validation report as errors', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addError('Something is broken');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      expect(annotationPlugin).toBeDefined();
      expect(annotationPlugin.conclusion).toEqual('failure');
    });

    test('acknowledged warnings are excluded from annotation report', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addWarningV2('my-lib:AckedWarning', 'This warning is acknowledged');
      core.Annotations.of(construct).acknowledgeWarning('my-lib:AckedWarning');

      app.synth();

      // No annotations left, so no report file has plugin entries
      const file = path.join(app.outdir, 'validation-report.json');
      expect(fs.existsSync(file)).toBe(false);
    });

    test('partial acknowledgment only excludes acknowledged warnings', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(construct).addWarning('AckedRule', 'This one is acknowledged');
      core.Validations.of(construct).addWarning('KeptRule', 'This one is not');
      core.Validations.of(construct).acknowledge({ id: 'AckedRule', reason: 'Accepted risk' });

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      expect(annotationPlugin).toBeDefined();
      const ruleNames = annotationPlugin.violations.map((v: any) => v.ruleName);
      expect(ruleNames).not.toContain('annotation::AckedRule');
      expect(ruleNames).toContain('annotation::KeptRule');
    });

    test('annotation report works alongside plugin reports', () => {
      const app = new core.App({
        context: annotationReportContext,
        policyValidationBeta1: [
          new FakePlugin('test-plugin', [{
            description: 'plugin violation',
            ruleName: 'plugin-rule',
            violatingResources: [{
              locations: ['test-location'],
              resourceLogicalId: 'Fake',
              templatePath: '/path/to/Default.template.json',
            }],
          }]),
        ],
      });
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(stack).addWarningV2('my-lib:StackWarning', 'Stack-level warning');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginNames = report.pluginReports.map((r: any) => r.pluginName);
      expect(pluginNames).toContain('test-plugin');
      expect(pluginNames).toContain('Construct Annotations');
    });

    test('annotation report with no plugins registered still produces report', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addError('Error without plugins');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      expect(report.pluginReports[0].pluginName).toEqual('Construct Annotations');
      expect(report.pluginReports[0].conclusion).toEqual('failure');
    });

    test('annotations on constructs without CfnResource use construct path', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'Orphan');

      core.Annotations.of(construct).addWarningV2('my-lib:OrphanWarning', 'Warning on orphan');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      const violatingConstruct = annotationPlugin.violations[0].violatingConstructs[0];
      expect(violatingConstruct.constructPath).toEqual('MyStack/Orphan');
    });

    test('Validations.of().addWarning appears in annotation report', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(construct).addWarning('MyRule', 'Validation warning');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      const ruleNames = annotationPlugin.violations.map((v: any) => v.ruleName);
      expect(ruleNames).toContain('annotation::MyRule');
    });

    test('Validations.of().addError appears in annotation report as failure', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(construct).addError('MyError', 'Validation error');

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      expect(annotationPlugin.conclusion).toEqual('failure');
    });

    test('extractRuleName regex matches addWarningV2 ack tag format', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addWarningV2('my-lib:TestId', 'Test message');

      // Verify the metadata contains the expected tag format
      const warning = construct.node.metadata.find(m => m.type === 'aws:cdk:warning');
      expect(warning?.data).toContain('[ack: my-lib:TestId]');

      // Verify the report extracts the ID correctly
      app.synth();
      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const annotationPlugin = report.pluginReports.find((r: any) => r.pluginName === 'Construct Annotations');
      const ruleNames = annotationPlugin.violations.map((v: any) => v.ruleName);
      expect(ruleNames).toContain('my-lib:TestId');
    });

    test('plugin violations can be suppressed via Validations.acknowledge()', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'MyBucket', {
        type: 'AWS::S3::Bucket',
        properties: {},
      });

      core.Validations.of(app).addPlugins(
        new FakePlugin('test-plugin', [{
          description: 'S3 Bucket should have versioning enabled',
          ruleName: 'S3_BUCKET_VERSIONING_ENABLED',
          severity: 'error',
          violatingResources: [{
            locations: ['Properties/VersioningConfiguration'],
            resourceLogicalId: 'MyBucket',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      );

      core.Validations.of(stack).acknowledge({ id: 'test-plugin::S3_BUCKET_VERSIONING_ENABLED', reason: 'Not needed for this bucket' });

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginReport = report.pluginReports.find((r: any) => r.pluginName === 'test-plugin');
      expect(pluginReport.violations).toHaveLength(0);
      expect(pluginReport.suppressedViolations).toHaveLength(1);
    });

    test('suppressed violations appear in validation-report.json', () => {
      const app = new core.App({
        context: annotationReportContext,
      });
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'MyBucket', {
        type: 'AWS::S3::Bucket',
        properties: {},
      });

      core.Validations.of(app).addPlugins(
        new FakePlugin('test-plugin', [{
          description: 'S3 Bucket should have versioning enabled',
          ruleName: 'S3_BUCKET_VERSIONING_ENABLED',
          severity: 'error',
          violatingResources: [{
            locations: ['Properties/VersioningConfiguration'],
            resourceLogicalId: 'MyBucket',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      );

      core.Validations.of(stack).acknowledge({ id: 'test-plugin::S3_BUCKET_VERSIONING_ENABLED', reason: 'Not needed for this bucket' });

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      expect(report.pluginReports).toHaveLength(1);
      expect(report.pluginReports[0].violations).toHaveLength(0);
      expect(report.pluginReports[0].suppressedViolations).toHaveLength(1);
      const sv = report.pluginReports[0].suppressedViolations[0];
      expect(sv).toEqual(expect.objectContaining({
        ruleName: 'S3_BUCKET_VERSIONING_ENABLED',
        description: 'S3 Bucket should have versioning enabled',
        acknowledgedId: 'test-plugin::S3_BUCKET_VERSIONING_ENABLED',
        reason: 'Not needed for this bucket',
        acknowledgedAt: 'Default',
      }));
      expect(sv.violatingConstructs[0].stackTraces).toBeDefined();
      expect(sv.acknowledgedStackTrace).toBeDefined();
      expect(sv.acknowledgedStackTrace).toContain('validation.test.ts');
    });

    test('fatal plugin violations cannot be suppressed', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'AWS::S3::Bucket',
        properties: {},
      });

      core.Validations.of(app).addPlugins(
        new FakePlugin('test-plugin', [{
          description: 'Unknown resource type',
          ruleName: 'E9001',
          severity: 'fatal',
          violatingResources: [{
            locations: [],
            resourceLogicalId: 'BadResource',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      );

      core.Validations.of(stack).acknowledge({ id: 'test-plugin::E9001', reason: 'Trying to suppress fatal' });

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginReport = report.pluginReports.find((r: any) => r.pluginName === 'test-plugin');
      // Fatal violations remain despite acknowledgment
      expect(pluginReport.violations[0].ruleName).toEqual('E9001');
    });

    test('plugin names with spaces use dashes in suppression IDs', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'AWS::S3::Bucket',
        properties: {},
      });

      core.Validations.of(app).addPlugins(
        new FakePlugin('My Plugin', [{
          description: 'Some violation',
          ruleName: 'MY RULE',
          severity: 'error',
          violatingResources: [{
            locations: [],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/Default.template.json',
          }],
        }]),
      );

      core.Validations.of(stack).acknowledge({ id: 'My-Plugin::MY-RULE', reason: 'OK' });

      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginReport = report.pluginReports.find((r: any) => r.pluginName === 'My Plugin');
      expect(pluginReport.violations).toHaveLength(0);
    });

    test('validation report JSON is always written to assembly directory', () => {
      const app = new core.App({
        context: annotationReportContext,
      });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addWarningV2('my-lib:AlwaysWritten', 'Report always in assembly');

      const assembly = app.synth();

      const reportPath = path.join(assembly.directory, 'validation-report.json');
      expect(fs.existsSync(reportPath)).toBe(true);
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      expect(report.pluginReports[0].pluginName).toEqual('Construct Annotations');
    });
  });

  describe('Validations.of()', () => {
    test('addPlugins adds plugin to enclosing stage', () => {
      const app = new core.App();
      const plugin = new FakePlugin('test-plugin', []);

      core.Validations.of(app).addPlugins(plugin);

      expect(app.policyValidationBeta1.map(p => p.name)).toContain('test-plugin');
    });

    test('addPlugins from nested construct resolves to enclosing stage', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const plugin = new FakePlugin('test-plugin', []);

      core.Validations.of(stack).addPlugins(plugin);

      expect(app.policyValidationBeta1.map(p => p.name)).toContain('test-plugin');
    });

    test('throws when addPlugins called without enclosing stage', () => {
      const construct = new Construct(undefined as any, '');

      expect(() => core.Validations.of(construct).addPlugins(new FakePlugin('test', []))).toThrow(/without an enclosing Stage/);
    });

    test('plugin added via addPlugins runs during synth', () => {
      const app = new core.App();
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: { result: 'success' },
      });

      core.Validations.of(app).addPlugins(new FakePlugin('added-plugin', [{
        description: 'test recommendation',
        ruleName: 'test-rule',
        violatingResources: [{
          locations: ['test-location'],
          resourceLogicalId: 'Fake',
          templatePath: '/path/to/Default.template.json',
        }],
      }]));
      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      expect(report.pluginReports[0].pluginName).toEqual('added-plugin');
      expect(report.pluginReports[0].conclusion).toEqual('failure');
    });

    test('addWarning adds warning metadata to construct', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      core.Validations.of(construct).addWarning('my-lib:MyWarning', 'Something is off');

      const warnings = construct.node.metadata.filter(m => m.type === 'aws:cdk:warning');
      expect(warnings).toHaveLength(1);
      expect(warnings[0].data).toContain('Something is off');
      expect(warnings[0].data).toContain('[ack: annotation::my-lib:MyWarning]');
    });

    test('addError adds error metadata with id to construct', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      core.Validations.of(construct).addError('my-lib:MyError', 'Something is wrong');

      const errors = construct.node.metadata.filter(m => m.type === 'aws:cdk:error');
      expect(errors).toHaveLength(1);
      expect(errors[0].data).toBe('Something is wrong (annotation::my-lib:MyError)');
    });

    test('acknowledge routes annotation rules to Annotations.acknowledgeWarning', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      core.Validations.of(construct).addWarning('SomeWarning', 'This is a warning');

      core.Validations.of(construct).acknowledge({ id: 'SomeWarning', reason: 'Accepted risk' });

      const warningsAfterAck = construct.node.metadata.filter(m => m.type === 'aws:cdk:warning');
      expect(warningsAfterAck).toHaveLength(0);
    });

    test('acknowledge records to construct metadata', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      core.Validations.of(construct).acknowledge(
        { id: 'annotation::SomeWarning', reason: 'Accepted risk per team review' },
        { id: 'some-plugin::RuleX', reason: 'Not applicable' },
      );

      const ackEntries = construct.node.metadata.filter(
        m => m.type === core.Validations.ACKNOWLEDGED_RULES_METADATA_KEY,
      );
      expect(ackEntries).toHaveLength(2);
      expect(ackEntries[0].data).toEqual({ 'annotation::SomeWarning': 'Accepted risk per team review' });
      expect(ackEntries[1].data).toEqual({ 'some-plugin::RuleX': 'Not applicable' });
      expect(ackEntries[0].trace).toBeDefined();
    });

    test('multiple acknowledge calls accumulate in metadata', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      core.Validations.of(construct).acknowledge({ id: 'RuleA', reason: 'reason A' });
      core.Validations.of(construct).acknowledge({ id: 'RuleB', reason: 'reason B' });

      const ackEntries = construct.node.metadata.filter(
        m => m.type === core.Validations.ACKNOWLEDGED_RULES_METADATA_KEY,
      );
      expect(ackEntries).toHaveLength(2);
      expect(ackEntries[0].data).toEqual({ 'annotation::RuleA': 'reason A' });
      expect(ackEntries[1].data).toEqual({ 'annotation::RuleB': 'reason B' });
    });

    test('throws on invalid ID with multiple delimiters', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      expect(() => {
        core.Validations.of(construct).acknowledge({ id: 'a::b::c', reason: 'reason' });
      }).toThrow(/Invalid validation rule ID 'a::b::c'/);
    });

    test('throws on invalid ID with empty prefix', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      expect(() => {
        core.Validations.of(construct).acknowledge({ id: '::foo', reason: 'reason' });
      }).toThrow(/Invalid validation rule ID '::foo'/);
    });

    test('validate context includes appConstruct as the root construct', () => {
      let capturedAppConstruct: any;
      const plugin: core.IPolicyValidationPlugin = {
        name: 'scope-capture-plugin',
        validate(context) {
          capturedAppConstruct = context.appConstruct;
          return { success: true, violations: [] };
        },
      };
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: {},
      });
      core.Validations.of(app).addPlugins(plugin);
      app.synth();

      expect(capturedAppConstruct).toBe(app);
    });

    test('non-Beta1 plugin with constructPath runs through synth', () => {
      const app = new core.App();
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(app).addPlugins(new FakeNonBeta1Plugin('non-beta1-plugin', [{
        description: 'construct-level violation',
        ruleName: 'construct-rule',
        violatingResources: [{
          constructPath: 'Default/Fake',
          locations: ['Properties'],
        }],
      }]));
      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginReport = report.pluginReports.find((r: any) => r.pluginName === 'non-beta1-plugin');
      expect(pluginReport.conclusion).toEqual('failure');
      expect(pluginReport.violations[0].ruleName).toEqual('construct-rule');
      expect(pluginReport.violations[0].violatingConstructs[0].constructPath).toEqual('Default/Fake');
    });

    test('non-Beta1 plugin accessed via policyValidationBeta1 getter has defaults for optional fields', () => {
      const app = new core.App();
      core.Validations.of(app).addPlugins(new FakeNonBeta1Plugin('non-beta1-plugin', [{
        description: 'test',
        ruleName: 'test-rule',
        violatingResources: [{
          constructPath: 'Default/Foo',
          locations: ['Props'],
        }],
      }]));

      const beta1Plugins = app.policyValidationBeta1;
      const report = beta1Plugins[0].validate({ templatePaths: ['/tmp/test.template.json'], appConstruct: app });

      expect(report.violations[0].violatingResources[0].resourceLogicalId).toEqual('');
      expect(report.violations[0].violatingResources[0].templatePath).toEqual('');
    });

    test('non-Beta1 plugin with all fields populated works identically to Beta1', () => {
      const app = new core.App();
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(app).addPlugins(new FakeNonBeta1Plugin('full-fields-plugin', [{
        description: 'full violation',
        ruleName: 'full-rule',
        violatingResources: [{
          resourceLogicalId: 'Fake',
          templatePath: '/path/to/Default.template.json',
          locations: ['Properties/Result'],
        }],
      }]));
      app.synth();

      const file = path.join(app.outdir, 'validation-report.json');
      const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const pluginReport = report.pluginReports.find((r: any) => r.pluginName === 'full-fields-plugin');
      expect(pluginReport.conclusion).toEqual('failure');
      expect(pluginReport.violations[0].violatingConstructs[0].cloudFormationResource.logicalId).toEqual('Fake');
    });
  });
});

class FakePlugin implements core.IPolicyValidationPluginBeta1 {
  constructor(
    public readonly name: string,
    private readonly violations: core.PolicyViolationBeta1[],
    public readonly version?: string,
    public readonly ruleIds?: string []) {
  }

  validate(_context: core.IPolicyValidationContextBeta1): core.PolicyValidationPluginReportBeta1 {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
      pluginVersion: this.version,
    };
  }
}

class RoguePlugin implements core.IPolicyValidationPluginBeta1 {
  public readonly name = 'rogue-plugin';

  validate(context: core.IPolicyValidationContextBeta1): core.PolicyValidationPluginReportBeta1 {
    const templatePath = context.templatePaths[0];
    fs.writeFileSync(templatePath, 'malicious data');
    return {
      success: true,
      violations: [],
    };
  }
}

class BrokenPlugin implements core.IPolicyValidationPluginBeta1 {
  public readonly name = 'broken-plugin';

  validate(_context: core.IPolicyValidationContextBeta1): core.PolicyValidationPluginReportBeta1 {
    throw new Error('Something went wrong');
  }
}

class FakeNonBeta1Plugin implements core.IPolicyValidationPlugin {
  constructor(
    public readonly name: string,
    private readonly violations: core.PolicyViolation[],
  ) {}

  validate(_context: core.IPolicyValidationContext): core.PolicyValidationPluginReport {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
    };
  }
}

class LevelTwoConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new core.CfnResource(this, 'Resource', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'success',
      },
    });
  }
}
