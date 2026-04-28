/* eslint-disable @stylistic/quote-props */
import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { table } from 'table';
import * as core from '../../lib';
import type { PolicyValidationPluginReport, PolicyViolation } from '../../lib';

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
    expect(consoleErrorMock.mock.calls[2]).toEqual([
      expect.stringMatching(/Policy Validation Successful!/),
    ]);
    expect(consoleErrorMock.mock.calls[1][0]).toEqual(`Validation Report
-----------------

Policy Validation Report Summary

╔══════════════╤═════════╗
║ Plugin       │ Status  ║
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

  test('JSON format', () => {
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
        '@aws-cdk/core:validationReportJson': true,
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
    const file = path.join(app.outdir, 'policy-validation-report.json');
    const report = fs.readFileSync(file).toString('utf-8');
    expect(JSON.parse(report)).toEqual(expect.objectContaining({
      title: 'Validation Report',
      pluginReports: [
        {
          summary: {
            pluginName: 'test-plugin',
            status: 'failure',
          },
          violations: [
            {
              ruleName: 'test-rule',
              description: 'test recommendation',
              ruleMetadata: { id: 'abcdefg' },
              violatingResources: [{
                'locations': [
                  'test-location',
                ],
                'resourceLogicalId': 'Fake',
                'templatePath': '/path/to/Default.template.json',
              }],
              violatingConstructs: [
                {
                  constructStack: {
                    'id': 'Default',
                    'construct': expect.stringMatching(/(aws-cdk-lib.Stack|Construct)/),
                    'libraryVersion': expect.any(String),
                    'location': expect.any(String),
                    'path': 'Default',
                    'child': {
                      'id': 'Fake',
                      'construct': expect.stringMatching(/(aws-cdk-lib.CfnResource|Construct)/),
                      'libraryVersion': expect.any(String),
                      'location': expect.any(String),
                      'path': 'Default/Fake',
                    },
                  },
                  constructPath: 'Default/Fake',
                  locations: ['test-location'],
                  resourceLogicalId: 'Fake',
                  templatePath: '/path/to/Default.template.json',
                },
              ],
            },
          ],
        },
      ],
    }));
    const consoleOut = consoleErrorMock.mock.calls[1][0];
    expect(consoleOut).toContain(`Validation failed. See the validation report in \'${file}\' for details`);
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
    expect(consoleOut).toContain('Validation failed. See the validation report above for details');
    const consoleReport = consoleErrorMock.mock.calls[1][0];
    expect(consoleReport).toContain('Validation Report');
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
      context: {
        '@aws-cdk/core:validationReportJson': true,
        '@aws-cdk/core:validationReportPrettyPrint': true,
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
    const file = path.join(app.outdir, 'policy-validation-report.json');
    const report = fs.readFileSync(file).toString('utf-8');
    expect(JSON.parse(report)).toEqual(expect.objectContaining({
      title: 'Validation Report',
      pluginReports: [
        {
          summary: {
            pluginName: 'test-plugin',
            status: 'failure',
          },
          violations: [
            {
              ruleName: 'test-rule',
              description: 'test recommendation',
              ruleMetadata: { id: 'abcdefg' },
              violatingResources: [{
                'locations': [
                  'test-location',
                ],
                'resourceLogicalId': 'Fake',
                'templatePath': '/path/to/Default.template.json',
              }],
              violatingConstructs: [
                {
                  constructStack: {
                    'id': 'Default',
                    'construct': expect.stringMatching(/(aws-cdk-lib.Stack|Construct)/),
                    'libraryVersion': expect.any(String),
                    'location': expect.any(String),
                    'path': 'Default',
                    'child': {
                      'id': 'Fake',
                      'construct': expect.stringMatching(/(aws-cdk-lib.CfnResource|Construct)/),
                      'libraryVersion': expect.any(String),
                      'location': expect.any(String),
                      'path': 'Default/Fake',
                    },
                  },
                  constructPath: 'Default/Fake',
                  locations: ['test-location'],
                  resourceLogicalId: 'Fake',
                  templatePath: '/path/to/Default.template.json',
                },
              ],
            },
          ],
        },
      ],
    }));
    const consoleOut = consoleErrorMock.mock.calls[2][0];
    expect(consoleOut).toContain(`Validation failed. See the validation report in \'${file}\' and above for details`);
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

  describe('Validations.of()', () => {
    test('addPlugins adds plugin to enclosing stage', () => {
      // GIVEN
      const app = new core.App();
      const plugin = new FakePlugin('test-plugin', []);

      // WHEN
      core.Validations.of(app).addPlugins(plugin);

      // THEN
      expect(app.policyValidationBeta1).toContain(plugin);
    });

    test('addPlugins from nested construct resolves to enclosing stage', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app, 'MyStack');
      const plugin = new FakePlugin('test-plugin', []);

      // WHEN
      core.Validations.of(stack).addPlugins(plugin);

      // THEN - plugin is registered on the app (enclosing stage), not the stack
      expect(app.policyValidationBeta1).toContain(plugin);
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
  });
});

class FakePlugin implements core.IPolicyValidationPlugin {
  constructor(
    public readonly name: string,
    private readonly violations: PolicyViolation[],
    public readonly version?: string,
    public readonly ruleIds?: string []) {
  }

  validate(_context: core.IPolicyValidationContext): PolicyValidationPluginReport {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
      pluginVersion: this.version,
    };
  }
}

class RoguePlugin implements core.IPolicyValidationPlugin {
  public readonly name = 'rogue-plugin';

  validate(context: core.IPolicyValidationContext): PolicyValidationPluginReport {
    const templatePath = context.templatePaths[0];
    fs.writeFileSync(templatePath, 'malicious data');
    return {
      success: true,
      violations: [],
    };
  }
}

class BrokenPlugin implements core.IPolicyValidationPlugin {
  public readonly name = 'broken-plugin';

  validate(_context: core.IPolicyValidationContext): PolicyValidationPluginReport {
    throw new Error('Something went wrong');
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
    [`Plugin: ${pluginName}`],
    [`Version: ${pluginVersion}`],
    [`Status: ${status}`],
  ], {
    header: { content: 'Plugin Report' },
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
        expect.stringMatching(new RegExp(`Plugin: ${d.pluginName}`)),
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
