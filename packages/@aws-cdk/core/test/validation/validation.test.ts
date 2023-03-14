/* eslint-disable quote-props */
import * as fs from 'fs';
import { Construct } from 'constructs';
import * as core from '../../lib';
import { ValidationPluginReport, ValidationViolationResourceAware } from '../../lib';


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
      validationPlugins: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/stack.template.json',
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
      templatePath: '/path/to/stack.template.json',
      constructPath: 'Default/Fake',
      title: 'test-rule',
      creationStack: `\t└──  Default (Default)
\t     │ Library: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Library: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info`,
      resourceLogicalId: 'Fake',
    }));
  });

  test('validation success', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin('test-plugin', []),
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
  });

  test('multiple stacks', () => {
    const app = new core.App({
      validationPlugins: [
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

  test('multiple constructs', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'SomeResource317FDD71',
            templatePath: '/path/to/stack.template.json',
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
      validationPlugins: [
        new FakePlugin('plugin1', [{
          description: 'do something',
          ruleName: 'rule-1',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/stack.template.json',
          }],
        }]),
        new FakePlugin('plugin2', [{
          description: 'do another thing',
          ruleName: 'rule-2',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/stack.template.json',
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

(Summary)

╔════════╤═════════╗
║ Status │ failure ║
╟────────┼─────────╢
║ Plugin │ plugin1 ║
╚════════╧═════════╝


(Violations)

${reset(red(bright('rule-1 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Default/Fake
    - Template Path: /path/to/stack.template.json
    - Creation Stack:
\t└──  Default (Default)
\t     │ Library: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Library: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
    - Resource ID: Fake
    - Locations:
      > test-location

  Description: do something

(Summary)

╔════════╤═════════╗
║ Status │ failure ║
╟────────┼─────────╢
║ Plugin │ plugin2 ║
╚════════╧═════════╝


(Violations)

${reset(red(bright('rule-2 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Default/Fake
    - Template Path: /path/to/stack.template.json
    - Creation Stack:
\t└──  Default (Default)
\t     │ Library: @aws-cdk/core.Stack
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  Fake (Default/Fake)
\t          │ Library: @aws-cdk/core.CfnResource
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
    - Resource ID: Fake
    - Locations:
      > test-location

  Description: do another thing`);
  });

  test('plugin throws an error', () => {
    const app = new core.App({
      validationPlugins: [
        // This plugin will throw an error
        new BrokenPlugin(),

        // But this one should still run
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/stack.template.json',
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
    expect(report).toContain('║ error  │ Validation plugin \'broken-plugin\' failed: Something went wrong ║');
    expect(report).toContain('║ Plugin │ test-plugin ║');
  });

  test('plugin tries to modify a template', () => {
    const app = new core.App({
      validationPlugins: [
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
      validationPlugins: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'Fake',
            templatePath: '/path/to/stack.template.json',
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

    const report = consoleLogMock.mock.calls[0][0];
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
              violatingConstructs: [
                {
                  constructStack: {
                    'id': 'Default',
                    'library': '@aws-cdk/core.Stack',
                    'libraryVersion': '0.0.0',
                    'location': "Run with '--debug' to include location info",
                    'path': 'Default',
                    'child': {
                      'id': 'Fake',
                      'library': '@aws-cdk/core.CfnResource',
                      'libraryVersion': '0.0.0',
                      'location': "Run with '--debug' to include location info",
                      'path': 'Default/Fake',
                    },
                  },
                  constructPath: 'Default/Fake',
                  locations: ['test-location'],
                  resourceLogicalId: 'Fake',
                  templatePath: '/path/to/stack.template.json',
                },
              ],
            },
          ],
        },
      ],
    }));
  });
});

class FakePlugin implements core.IValidationPlugin {
  // public readonly name = 'test-plugin';

  constructor(
    public readonly name: string,
    private readonly violations: ValidationViolationResourceAware[]) {}

  validate(_context: core.IValidationContext): ValidationPluginReport {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
    };
  }
}

class RoguePlugin implements core.IValidationPlugin {
  public readonly name = 'rogue-plugin';

  validate(context: core.IValidationContext): ValidationPluginReport {
    const templatePath = context.templatePaths[0];
    fs.writeFileSync(templatePath, 'malicious data');
    return {
      success: true,
      violations: [],
    };
  }
}

class BrokenPlugin implements core.IValidationPlugin {
  public readonly name = 'broken-plugin';

  validate(_context: core.IValidationContext): ValidationPluginReport {
    throw new Error('Something went wrong');
  }
}

interface ValidationReportData {
  templatePath: string,
  title: string,
  constructPath: string,
  creationStack?: string,
  resourceLogicalId: string,
}

const validationReport = (data: ValidationReportData) => {
  const title = reset(red(bright(`${data.title} (1 occurrences)`)));
  return [
    'Validation Report',
    '-----------------',
    '',
    '(Summary)',
    '',
    '╔════════╤═════════════╗',
    '║ Status │ failure     ║',
    '╟────────┼─────────────╢',
    '║ Plugin │ test-plugin ║',
    '╚════════╧═════════════╝',
    '',
    '',
    '(Violations)',
    '',
    title,
    '',
    '  Occurrences:',
    '',
    `    - Construct Path: ${data.constructPath}`,
    `    - Template Path: ${data.templatePath}`,
    '    - Creation Stack:',
    `${data.creationStack ?? 'Construct trace not available. Rerun with `--debug` to see trace information'}`,
    `    - Resource ID: ${data.resourceLogicalId}`,
    '    - Locations:',
    '      > test-location',
    '',
    '  Description: test recommendation',

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
