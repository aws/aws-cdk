/* eslint-disable @stylistic/quote-props */
import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { table } from 'table';
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

describe('validations', () => {
  test('validation failure', () => {
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
    expect(process.exitCode).toEqual(1);

    expect(consoleErrorMock.mock.calls[1][0].split('\n')).toEqual(expect.arrayContaining(validationReport([{
      templatePath: '/path/to/Default.template.json',
      constructPath: 'Default/Fake',
      title: 'test-rule',
      pluginName: 'test-plugin',
      status: 'failure',
      ruleMetadata: {
        id: 'abcdefg',
      },
      severity: 'medium',
      creationStack: [
        expect.stringMatching(/Default \(Default\)/),
        expect.stringMatching(/│ Construct: (aws-cdk-lib.Stack|constructs.Construct)/),
        expect.stringMatching(/│ Library Version: .*/),
        expect.stringMatching(/│ Location:/),
        expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
        expect.stringMatching(/│ Construct: (aws-cdk-lib.CfnResource|constructs.Construct)/),
        expect.stringMatching(/│ Library Version: .*/),
        expect.stringMatching(/│ Location:/),
      ],
      resourceLogicalId: 'Fake',
    }])));
  });

  test('validation success', () => {
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
    expect(process.exitCode).toBeUndefined();

    expect(consoleErrorMock.mock.calls[0]).toEqual([
      expect.stringMatching(/Performing Policy Validations/),
    ]);
    expect(consoleErrorMock.mock.calls[1][0]).toEqual(`Validation Report
-----------------

Policy Validation Report Summary

╔══════════════╤═════════╗
║ Source       │ Status  ║
╟──────────────┼─────────╢
║ test-plugin  │ success ║
╟──────────────┼─────────╢
║ test-plugin2 │ success ║
╟──────────────┼─────────╢
║ test-plugin3 │ success ║
╚══════════════╧═════════╝
`);
  });

  test('multiple stacks', () => {
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
    expect(process.exitCode).toEqual(1);

    const report = consoleErrorMock.mock.calls[1][0];
    // Assuming the rest of the report's content is checked by another test
    expect(report).toContain('- Template Path: /path/to/stack1.template.json');
    expect(report).not.toContain('- Template Path: /path/to/stack2.template.json');
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
    expect(process.exitCode).toEqual(1);

    const report = consoleErrorMock.mock.calls[1][0].split('\n');
    // Assuming the rest of the report's content is checked by another test
    expect(report).toEqual(expect.arrayContaining(
      validationReport([
        {
          pluginName: 'test-plugin2',
          status: 'failure',
          templatePath: '/path/to/Stage1stack1DDED8B6C.template.json',
          constructPath: 'Stage1/stack1/DefaultResource',
          title: 'test-rule2',
          creationStack: [
            expect.stringMatching(/Stage1 \(Stage1\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.Stage|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
            expect.stringMatching(/└──  stack1 \(Stage1\/stack1\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.Stack|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
            expect.stringMatching(/└──  DefaultResource \(Stage1\/stack1\/DefaultResource\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.CfnResource|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
          ],
          resourceLogicalId: 'DefaultResource',
          description: 'do something',
          version: '1.2.3',
        },
        {
          pluginName: 'test-plugin4',
          status: 'failure',
          templatePath: '/path/to/Stage2Stage3stack10CD36915.template.json',
          constructPath: 'Stage2/Stage3/stack1/DefaultResource',
          description: 'do something',
          title: 'test-rule4',
          resourceLogicalId: 'DefaultResource',
        },
        {
          pluginName: 'test-plugin3',
          status: 'failure',
          templatePath: '/path/to/Stage2stack259BA718E.template.json',
          constructPath: 'Stage2/stack2/DefaultResource',
          title: 'test-rule3',
          resourceLogicalId: 'DefaultResource',
          description: 'do something',
        },
        {
          pluginName: 'test-plugin1',
          status: 'failure',
          templatePath: '/path/to/Stage1stack1DDED8B6C.template.json',
          constructPath: 'Stage1/stack1/DefaultResource',
          title: 'test-rule1',
          resourceLogicalId: 'DefaultResource',
          description: 'do something',
        },
      ]),
    ));
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
    expect(mockValidate).toHaveBeenNthCalledWith(2, {
      templatePaths: [
        expect.stringMatching(/assembly-Stage1\/Stage1stack1DDED8B6C.template.json/),
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    });
    expect(mockValidate).toHaveBeenNthCalledWith(1, {
      templatePaths: [
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    });
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
    expect(mockValidate).toHaveBeenCalledWith({
      templatePaths: [
        expect.stringMatching(/assembly-Stage1\/Stage1stack1DDED8B6C.template.json/),
        expect.stringMatching(/assembly-Stage2\/Stage2stack259BA718E.template.json/),
        expect.stringMatching(/assembly-Stage2\/assembly-Stage2-Stage3\/Stage2Stage3stack10CD36915.template.json/),
      ],
    });
  });

  test('multiple constructs', () => {
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
    expect(process.exitCode).toEqual(1);

    const report = consoleErrorMock.mock.calls[1][0];
    // Assuming the rest of the report's content is checked by another test
    expect(report).toContain('- Construct Path: Default/SomeResource');
    expect(report).not.toContain('- Construct Path: Default/AnotherResource');
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
    expect(process.exitCode).toEqual(1);

    const report = consoleErrorMock.mock.calls[1][0].split('\n');
    expect(report).toEqual(expect.arrayContaining(
      validationReport([
        {
          pluginName: 'plugin1',
          status: 'failure',
          templatePath: '/path/to/Default.template.json',
          constructPath: 'Default/Fake',
          title: 'rule-1',
          creationStack: [
            expect.stringMatching(/Default \(Default\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.Stack|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
            expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.CfnResource|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
          ],
          description: 'do something',
          resourceLogicalId: 'Fake',
        },
        {
          pluginName: 'plugin2',
          status: 'failure',
          templatePath: '/path/to/Default.template.json',
          constructPath: 'Default/Fake',
          title: 'rule-2',
          description: 'do another thing',
          resourceLogicalId: 'Fake',
        },
      ]),
    ));
  });

  test('multiple plugins with mixed results', () => {
    const app = new core.App({
      policyValidationBeta1: [
        new FakePlugin('plugin1', []),
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

    const report = consoleErrorMock.mock.calls[1][0].split('\n');
    expect(report).toEqual(expect.arrayContaining(
      validationReport([
        {
          pluginName: 'plugin1',
          status: 'success',
          constructPath: '',
          resourceLogicalId: '',
          templatePath: '',
          title: '',
        },
        {
          pluginName: 'plugin2',
          status: 'failure',
          templatePath: '/path/to/Default.template.json',
          constructPath: 'Default/Fake',
          title: 'rule-2',
          creationStack: [
            expect.stringMatching(/Default \(Default\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.Stack|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
            expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
            expect.stringMatching(/│ Construct: (aws-cdk-lib.CfnResource|constructs.Construct)/),
            expect.stringMatching(/│ Library Version: .*/),
            expect.stringMatching(/│ Location:/),
          ],
          description: 'do another thing',
          resourceLogicalId: 'Fake',
        },
      ]),
    ));
  });

  test('plugin throws an error', () => {
    const app = new core.App({
      policyValidationBeta1: [
        // This plugin will throw an error
        new BrokenPlugin(),

        // But this one should still run
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
    expect(process.exitCode).toEqual(1);

    const report = consoleErrorMock.mock.calls[1][0];
    expect(report).toContain('error: Validation plugin \'broken-plugin\' failed: Something went wrong');
    expect(report).toContain(generateTable('test-plugin', 'failure', 'N/A'));
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

  test('failSynthOnValidationErrors=false writes JSON but does not print or fail', () => {
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
      context: {
        '@aws-cdk/core:failSynthOnValidationErrors': false,
      },
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();

    // No exit code set
    expect(process.exitCode).toBeUndefined();

    // JSON file is written in the new v2 format
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

    // No console output about validation
    const allOutput = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(allOutput).not.toContain('Validation failed');
    expect(allOutput).not.toContain('Validation Report');
  });

  test('Pretty print as default', () => {
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
      context: {
      },
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    app.synth();
    expect(process.exitCode).toEqual(1);
    const consoleOut = consoleErrorMock.mock.calls[2][0];
    expect(consoleOut).toContain('Validation failed. A copy of this report can be found in');
    const consoleReport = consoleErrorMock.mock.calls[1][0];
    expect(consoleReport).toContain('Validation Report');
  });

  test('both formats enabled by default', () => {
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
    expect(process.exitCode).toEqual(1);

    // JSON file written
    const file = path.join(app.outdir, 'validation-report.json');
    expect(fs.existsSync(file)).toBe(true);

    // Pretty print also output
    const consoleReport = consoleErrorMock.mock.calls[1][0];
    expect(consoleReport).toContain('Validation Report');
  });

  test('failSynthOnValidationErrors=false succeeds even with validation failures', () => {
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
        '@aws-cdk/core:failSynthOnValidationErrors': false,
      },
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: { result: 'failure' },
    });
    app.synth();

    // No failure exit code
    expect(process.exitCode).toBeUndefined();

    // JSON file is still written
    const file = path.join(app.outdir, 'validation-report.json');
    expect(fs.existsSync(file)).toBe(true);
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    expect(report.pluginReports[0].conclusion).toEqual('failure');
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

  test('Multi format', () => {
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
    expect(process.exitCode).toEqual(1);
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
    const consoleOut = consoleErrorMock.mock.calls[2][0];
    expect(consoleOut).toContain(`Validation failed. A copy of this report can be found in '${file}'`);
    const consoleReport = consoleErrorMock.mock.calls[1][0];
    expect(consoleReport).toContain('Validation Report');
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

      // Warnings alone should not fail
      expect(process.exitCode).toBeUndefined();

      // Should show the annotation report
      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('my-lib:SomeWarning');
    });

    test('annotation errors cause validation failure', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addError('Something is broken');

      app.synth();

      expect(process.exitCode).toEqual(1);

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('Something is broken');
      expect(output).toContain('Severity: error');
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

      // No annotations left, so no report at all
      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).not.toContain('Construct Annotations');
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

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).not.toContain('annotation::AckedRule');
      expect(output).toContain('annotation::KeptRule');
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

      expect(process.exitCode).toEqual(1);

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      // Both plugin and annotation reports should appear
      expect(output).toContain('test-plugin');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('plugin-rule');
      expect(output).toContain('my-lib:StackWarning');
    });

    test('annotation report with no plugins registered still produces output', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Annotations.of(construct).addError('Error without plugins');

      app.synth();

      expect(process.exitCode).toEqual(1);

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('Error without plugins');
    });

    test('annotations on constructs without CfnResource use construct path', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'Orphan');
      // No CfnResource child

      core.Annotations.of(construct).addWarningV2('my-lib:OrphanWarning', 'Warning on orphan');

      app.synth();

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('my-lib:OrphanWarning');
      // Construct path is provided directly
      expect(output).toContain('Construct Path: MyStack/Orphan');
      // Resource ID is N/A for annotation-sourced violations
      expect(output).toContain('Resource ID: N/A');
      // templatePath should still resolve via Stack.of()
      expect(output).toContain('Template Path:');
      expect(output).toContain('MyStack.template.json');
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

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('annotation::MyRule');
    });

    test('Validations.of().addError appears in annotation report and fails', () => {
      const app = new core.App({ context: annotationReportContext });
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      new core.CfnResource(construct, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      core.Validations.of(construct).addError('MyError', 'Validation error');

      app.synth();

      expect(process.exitCode).toEqual(1);

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('Construct Annotations');
      expect(output).toContain('Severity: error');
    });

    test('extractRuleName regex matches addWarningV2 ack tag format', () => {
      // This test verifies the coupling between the [ack: <id>] tag format
      // produced by Annotations.addWarningV2 and the regex in extractRuleName.
      // If the tag format in annotations.ts changes, this test should fail.
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
      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('my-lib:TestId (');
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

      // Suppress the error-level violation using <pluginName>::<ruleId>
      core.Validations.of(stack).acknowledge({ id: 'test-plugin::S3_BUCKET_VERSIONING_ENABLED', reason: 'Not needed for this bucket' });

      app.synth();

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).not.toContain('S3_BUCKET_VERSIONING_ENABLED');
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

      // Attempt to suppress the fatal violation
      core.Validations.of(stack).acknowledge({ id: 'test-plugin::E9001', reason: 'Trying to suppress fatal' });

      app.synth();

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      // Fatal violations remain despite acknowledgment
      expect(output).toContain('E9001');
      expect(output).toContain('Unknown resource type');
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

      // Suppress using dashes instead of spaces
      core.Validations.of(stack).acknowledge({ id: 'My-Plugin::MY-RULE', reason: 'OK' });

      app.synth();

      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).not.toContain('MY RULE');
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
      // GIVEN
      const app = new core.App();
      const plugin = new FakePlugin('test-plugin', []);

      // WHEN
      core.Validations.of(app).addPlugins(plugin);

      // THEN
      expect(app.policyValidationBeta1.map(p => p.name)).toContain('test-plugin');
    });

    test('addPlugins from nested construct resolves to enclosing stage', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const plugin = new FakePlugin('test-plugin', []);

      // WHEN
      core.Validations.of(stack).addPlugins(plugin);

      // THEN - plugin is registered on the app (enclosing stage), not the stack
      expect(app.policyValidationBeta1.map(p => p.name)).toContain('test-plugin');
    });

    test('throws when addPlugins called without enclosing stage', () => {
      // GIVEN
      const construct = new Construct(undefined as any, '');

      // THEN
      expect(() => core.Validations.of(construct).addPlugins(new FakePlugin('test', []))).toThrow(/without an enclosing Stage/);
    });

    test('plugin added via addPlugins runs during synth', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: { result: 'success' },
      });

      // WHEN
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

      // THEN - exitCode 1 means the plugin ran and reported violations
      expect(process.exitCode).toEqual(1);
    });

    test('addWarning adds warning metadata to construct', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      // WHEN
      core.Validations.of(construct).addWarning('my-lib:MyWarning', 'Something is off');

      // THEN
      const warnings = construct.node.metadata.filter(m => m.type === 'aws:cdk:warning');
      expect(warnings).toHaveLength(1);
      expect(warnings[0].data).toContain('Something is off');
      expect(warnings[0].data).toContain('[ack: annotation::my-lib:MyWarning]');
    });

    test('addError adds error metadata with id to construct', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      // WHEN
      core.Validations.of(construct).addError('my-lib:MyError', 'Something is wrong');

      // THEN
      const errors = construct.node.metadata.filter(m => m.type === 'aws:cdk:error');
      expect(errors).toHaveLength(1);
      expect(errors[0].data).toBe('Something is wrong (annotation::my-lib:MyError)');
    });

    test('acknowledge routes annotation rules to Annotations.acknowledgeWarning', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');
      core.Validations.of(construct).addWarning('SomeWarning', 'This is a warning');

      // WHEN - no prefix defaults to annotation rule
      core.Validations.of(construct).acknowledge({ id: 'SomeWarning', reason: 'Accepted risk' });

      // THEN - existing warning is removed
      const warningsAfterAck = construct.node.metadata.filter(m => m.type === 'aws:cdk:warning');
      expect(warningsAfterAck).toHaveLength(0);
    });

    test('acknowledge records to construct metadata', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      // WHEN
      core.Validations.of(construct).acknowledge(
        { id: 'annotation::SomeWarning', reason: 'Accepted risk per team review' },
        { id: 'some-plugin::RuleX', reason: 'Not applicable' },
      );

      // THEN
      const ackEntries = construct.node.metadata.filter(
        m => m.type === core.Validations.ACKNOWLEDGED_RULES_METADATA_KEY,
      );
      // Last entry contains all acknowledged rules
      const lastEntry = ackEntries[ackEntries.length - 1];
      expect(lastEntry.data).toEqual({
        'annotation::SomeWarning': 'Accepted risk per team review',
        'some-plugin::RuleX': 'Not applicable',
      });
    });

    test('multiple acknowledge calls accumulate in metadata', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const construct = new Construct(stack, 'MyConstruct');

      // WHEN - two separate calls
      core.Validations.of(construct).acknowledge({ id: 'RuleA', reason: 'reason A' });
      core.Validations.of(construct).acknowledge({ id: 'RuleB', reason: 'reason B' });

      // THEN - last metadata entry has both rules
      const ackEntries = construct.node.metadata.filter(
        m => m.type === core.Validations.ACKNOWLEDGED_RULES_METADATA_KEY,
      );
      const lastEntry = ackEntries[ackEntries.length - 1];
      expect(lastEntry.data).toEqual({
        'annotation::RuleA': 'reason A',
        'annotation::RuleB': 'reason B',
      });
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

    test('non-Beta1 plugin with constructPath runs through synth', () => {
      // GIVEN - a plugin returning violations with optional fields (constructPath instead of resourceLogicalId)
      const app = new core.App();
      const stack = new core.Stack(app);
      new core.CfnResource(stack, 'Fake', {
        type: 'Test::Resource::Fake',
        properties: {},
      });

      // WHEN
      core.Validations.of(app).addPlugins(new FakeNonBeta1Plugin('non-beta1-plugin', [{
        description: 'construct-level violation',
        ruleName: 'construct-rule',
        violatingResources: [{
          constructPath: 'Default/Fake',
          locations: ['Properties'],
        }],
      }]));
      app.synth();

      // THEN
      expect(process.exitCode).toEqual(1);
      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('non-beta1-plugin');
      expect(output).toContain('construct-rule');
      expect(output).toContain('Default/Fake');
    });

    test('non-Beta1 plugin accessed via policyValidationBeta1 getter has defaults for optional fields', () => {
      // GIVEN - a plugin returning violations without resourceLogicalId or templatePath
      const app = new core.App();
      core.Validations.of(app).addPlugins(new FakeNonBeta1Plugin('non-beta1-plugin', [{
        description: 'test',
        ruleName: 'test-rule',
        violatingResources: [{
          constructPath: 'Default/Foo',
          locations: ['Props'],
        }],
      }]));

      // WHEN - access via Beta1 getter
      const beta1Plugins = app.policyValidationBeta1;
      const report = beta1Plugins[0].validate({ templatePaths: ['/tmp/test.template.json'] });

      // THEN - optional fields are filled with defaults
      expect(report.violations[0].violatingResources[0].resourceLogicalId).toEqual('');
      expect(report.violations[0].violatingResources[0].templatePath).toEqual('');
    });

    test('non-Beta1 plugin with all fields populated works identically to Beta1', () => {
      // GIVEN - a non-Beta1 plugin that provides all fields (same as Beta1 would)
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

      // THEN
      expect(process.exitCode).toEqual(1);
      const output = consoleErrorMock.mock.calls.map((c: any[]) => c[0]).join('\n');
      expect(output).toContain('full-fields-plugin');
      expect(output).toContain('full-rule');
      expect(output).toContain('Resource ID: Fake');
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

interface ValidationReportData {
  templatePath: string;
  title: string;
  status: string;
  pluginName: string;
  constructPath: string;
  creationStack?: string[];
  description?: string;
  resourceLogicalId: string;
  severity?: string;
  version?: string;
  ruleMetadata?: { [key: string]: string };
}

function generateTable(pluginName: string, status: string, pluginVersion: string): string {
  return table([
    [`Source: ${pluginName}`],
    [`Version: ${pluginVersion}`],
    [`Status: ${status}`],
  ], {
    header: { content: 'Validation Report' },
    singleLine: true,
    columns: [{
      paddingLeft: 3,
      paddingRight: 3,
    }],
  });
}

const validationReport = (data: ValidationReportData[]) => {
  const result = data.flatMap(d => {
    if (d.status === 'failure') {
      const title = reset(red(bright(`${d.title} (1 occurrences)`)));
      return [
        expect.stringMatching(new RegExp('Validation Report')),
        expect.stringMatching(new RegExp('-----------------')),
        expect.stringMatching(new RegExp(`Source: ${d.pluginName}`)),
        expect.stringMatching(new RegExp(`Version: ${d.version ?? 'N/A'}`)),
        expect.stringMatching(new RegExp(`Status: ${d.status}`)),
        expect.stringMatching(new RegExp('\\(Violations\\)')),
        title,
        ...d.severity ? [expect.stringMatching(new RegExp(`Severity: ${d.severity}`))] : [],
        expect.stringMatching(new RegExp('  Occurrences:')),
        expect.stringMatching(new RegExp(`    - Construct Path: ${d.constructPath}`)),
        expect.stringMatching(new RegExp(`    - Template Path: ${d.templatePath}`)),
        expect.stringMatching(new RegExp('    - Creation Stack:')),
        ...d.creationStack ?? [],
        expect.stringMatching(new RegExp(`    - Resource ID: ${d.resourceLogicalId}`)),
        expect.stringMatching(new RegExp('    - Template Locations:')),
        expect.stringMatching(new RegExp('      > test-location')),
        expect.stringMatching(new RegExp(`  Description: ${d.description ?? 'test recommendation'}`)),
        ...d.ruleMetadata ? [expect.stringMatching('  Rule Metadata:'), ...Object.entries(d.ruleMetadata).flatMap(([key, value]) => expect.stringMatching(`${key}: ${value}`))] : [],
      ];
    }
    return [];
  });
  result.push(
    expect.stringMatching(new RegExp('Policy Validation Report Summary')),
    ...data.map(d => expect.stringMatching(new RegExp(`.*${d.pluginName}.*${d.status}.*`))),
  );
  return result;
};

function reset(s: string) {
  return `${s}\x1b[0m`;
}

function red(s: string) {
  return `\x1b[31m${s}`;
}

function bright(s: string) {
  return `\x1b[1m${s}`;
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
