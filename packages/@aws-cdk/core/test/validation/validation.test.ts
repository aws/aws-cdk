/* eslint-disable quote-props */
import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { table } from 'table';
import * as core from '../../lib';
import { PolicyValidationPluginReportBeta1, PolicyViolationBeta1 } from '../../lib';


let consoleErrorMock: jest.SpyInstance;
let consoleLogMock: jest.SpyInstance;
beforeEach(() => {
  consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { return true; });
  consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});

afterEach(() => {
  consoleErrorMock.mockRestore();
  consoleLogMock.mockRestore();
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    expect(consoleErrorMock.mock.calls[0][0]).toEqual(validationReport({
      templatePath: '/path/to/Default.template.json',
      constructPath: 'Default/Fake',
      title: 'test-rule',
      ruleMetadata: {
        id: 'abcdefg',
      },
      severity: 'medium',
      creationStack: `\t└──  Default (Default)
\t     │ Construct: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Construct: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info`,
      resourceLogicalId: 'Fake',
    }));
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
    expect(() => {
      app.synth();
    }).not.toThrow(/Validation failed/);
    expect(consoleLogMock.mock.calls).toEqual([
      [
        expect.stringMatching(/Performing Policy Validations/),
      ],
      [
        expect.stringMatching(/Policy Validation Successful!/),
      ],
    ]);
    expect(consoleErrorMock.mock.calls[0][0]).toEqual(`Validation Report
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
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
        }]),
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
    // Assuming the rest of the report's content is checked by another test
    expect(report).toEqual(`Validation Report
-----------------

${generateTable('test-plugin2', 'failure')}

(Violations)

${reset(red(bright('test-rule2 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage1/stack1/DefaultResource
    - Template Path: /path/to/Stage1stack1DDED8B6C.template.json
    - Creation Stack:
\t└──  Stage1 (Stage1)
\t     │ Construct: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack1 (Stage1/stack1)
\t          │ Construct: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource (Stage1/stack1/DefaultResource)
\t               │ Construct: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource
    - Template Locations:
      > test-location

  Description: do something

${generateTable('test-plugin4', 'failure')}

(Violations)

${reset(red(bright('test-rule4 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage2/Stage3/stack1/DefaultResource
    - Template Path: /path/to/Stage2Stage3stack10CD36915.template.json
    - Creation Stack:
\t└──  Stage3 (Stage2/Stage3)
\t     │ Construct: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack1 (Stage2/Stage3/stack1)
\t          │ Construct: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource (Stage2/Stage3/stack1/DefaultResource)
\t               │ Construct: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource
    - Template Locations:
      > test-location

  Description: do something

${generateTable('test-plugin3', 'failure')}

(Violations)

${reset(red(bright('test-rule3 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage2/stack2/DefaultResource
    - Template Path: /path/to/Stage2stack259BA718E.template.json
    - Creation Stack:
\t└──  Stage2 (Stage2)
\t     │ Construct: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack2 (Stage2/stack2)
\t          │ Construct: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource (Stage2/stack2/DefaultResource)
\t               │ Construct: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource
    - Template Locations:
      > test-location

  Description: do something

${generateTable('test-plugin1', 'failure')}

(Violations)

${reset(red(bright('test-rule1 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage1/stack1/DefaultResource
    - Template Path: /path/to/Stage1stack1DDED8B6C.template.json
    - Creation Stack:
\t└──  Stage1 (Stage1)
\t     │ Construct: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack1 (Stage1/stack1)
\t          │ Construct: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource (Stage1/stack1/DefaultResource)
\t               │ Construct: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource
    - Template Locations:
      > test-location

  Description: do something

Policy Validation Report Summary

╔══════════════╤═════════╗
║ Plugin       │ Status  ║
╟──────────────┼─────────╢
║ test-plugin2 │ failure ║
╟──────────────┼─────────╢
║ test-plugin4 │ failure ║
╟──────────────┼─────────╢
║ test-plugin3 │ failure ║
╟──────────────┼─────────╢
║ test-plugin1 │ failure ║
╚══════════════╧═════════╝
`);
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
    expect(report).toEqual(`Validation Report
-----------------

${generateTable('plugin1', 'failure')}

(Violations)

${reset(red(bright('rule-1 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Default/Fake
    - Template Path: /path/to/Default.template.json
    - Creation Stack:
\t└──  Default (Default)
\t     │ Construct: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Construct: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
    - Resource ID: Fake
    - Template Locations:
      > test-location

  Description: do something

${generateTable('plugin2', 'failure')}

(Violations)

${reset(red(bright('rule-2 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Default/Fake
    - Template Path: /path/to/Default.template.json
    - Creation Stack:
\t└──  Default (Default)
\t     │ Construct: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Construct: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
    - Resource ID: Fake
    - Template Locations:
      > test-location

  Description: do another thing

Policy Validation Report Summary

${table([
    ['Plugin', 'Status'],
    ['plugin1', 'failure'],
    ['plugin2', 'failure'],
  ], { })}`);
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
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
    expect(report).toEqual(`Validation Report
-----------------

${generateTable('plugin2', 'failure')}

(Violations)

${reset(red(bright('rule-2 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Default/Fake
    - Template Path: /path/to/Default.template.json
    - Creation Stack:
\t└──  Default (Default)
\t     │ Construct: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Construct: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
    - Resource ID: Fake
    - Template Locations:
      > test-location

  Description: do another thing

Policy Validation Report Summary

${table([
    ['Plugin', 'Status'],
    ['plugin1', 'success'],
    ['plugin2', 'failure'],
  ])}`);
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

    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = consoleErrorMock.mock.calls[0][0];
    expect(report).toContain('error: Validation plugin \'broken-plugin\' failed: Something went wrong');
    expect(report).toContain(generateTable('test-plugin', 'failure'));
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
      context: { '@aws-cdk/core:validationReportJson': true },
    });
    const stack = new core.Stack(app);
    new core.CfnResource(stack, 'Fake', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    expect(() => {
      app.synth();
    }).toThrow(/Validation failed/);

    const report = fs.readFileSync(path.join(app.outdir, 'policy-validation-report.json')).toString('utf-8');
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
                    'construct': '@aws-cdk/core.Stack',
                    'libraryVersion': '0.0.0',
                    'location': "Run with '--debug' to include location info",
                    'path': 'Default',
                    'child': {
                      'id': 'Fake',
                      'construct': '@aws-cdk/core.CfnResource',
                      'libraryVersion': '0.0.0',
                      'location': "Run with '--debug' to include location info",
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
  });
});

class FakePlugin implements core.IPolicyValidationPluginBeta1 {
  // public readonly name = 'test-plugin';

  constructor(
    public readonly name: string,
    private readonly violations: PolicyViolationBeta1[]) {}

  validate(_context: core.IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
    };
  }
}

class RoguePlugin implements core.IPolicyValidationPluginBeta1 {
  public readonly name = 'rogue-plugin';

  validate(context: core.IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
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

  validate(_context: core.IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
    throw new Error('Something went wrong');
  }
}

interface ValidationReportData {
  templatePath: string,
  title: string,
  constructPath: string,
  creationStack?: string,
  resourceLogicalId: string,
  severity?: string,
  ruleMetadata?: { [key: string]: string };
}

function generateTable(pluginName: string, status: string): string {
  return table([
    [`Plugin: ${pluginName}`],
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

const validationReport = (data: ValidationReportData) => {
  const title = reset(red(bright(`${data.title} (1 occurrences)`)));
  return [
    'Validation Report',
    '-----------------',
    '',
    '╔═════════════════════════╗',
    '║      Plugin Report      ║',
    '║   Plugin: test-plugin   ║',
    '║   Status: failure       ║',
    '╚═════════════════════════╝',
    '',
    '',
    '(Violations)',
    '',
    title,
    ...data.severity ? [`Severity: ${data.severity}`] : [],
    '',
    '  Occurrences:',
    '',
    `    - Construct Path: ${data.constructPath}`,
    `    - Template Path: ${data.templatePath}`,
    '    - Creation Stack:',
    `${data.creationStack ?? 'Construct trace not available. Rerun with `--debug` to see trace information'}`,
    `    - Resource ID: ${data.resourceLogicalId}`,
    '    - Template Locations:',
    '      > test-location',
    '',
    '  Description: test recommendation',
    ...data.ruleMetadata ? [`  Rule Metadata: \n\t${Object.entries(data.ruleMetadata).flatMap(([key, value]) => `${key}: ${value}`).join('\n\t')}`] : [],
    '',
    'Policy Validation Report Summary',
    '',
    '╔═════════════╤═════════╗',
    '║ Plugin      │ Status  ║',
    '╟─────────────┼─────────╢',
    '║ test-plugin │ failure ║',
    '╚═════════════╧═════════╝',
    '',

  ].join('\n');
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
