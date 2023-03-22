/* eslint-disable quote-props */
import * as fs from 'fs';
import { Construct } from 'constructs';
import * as core from '../../lib';
import { PolicyValidationPluginReport, PolicyViolationResourceAware } from '../../lib';


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
      policyValidation: [
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
      ruleMetadata: {
        id: 'abcdefg',
      },
      severity: 'medium',
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
      policyValidation: [
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
      policyValidation: [
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
      policyValidation: [
        new FakePlugin('test-plugin1', [{
          description: 'do something',
          ruleName: 'test-rule1',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource1',
            templatePath: '/path/to/stack1.template.json',
          }],
        }]),
      ],
    });
    const stage1 = new core.Stage(app, 'Stage1', {
      policyValidation: [
        new FakePlugin('test-plugin2', [{
          description: 'do something',
          ruleName: 'test-rule2',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource1',
            templatePath: '/path/to/stack1.template.json',
          }],
        }]),
      ],
    });
    const stage2 = new core.Stage(app, 'Stage2', {
      policyValidation: [
        new FakePlugin('test-plugin3', [{
          description: 'do something',
          ruleName: 'test-rule3',
          violatingResources: [{
            locations: ['test-location'],
            resourceLogicalId: 'DefaultResource2',
            templatePath: '/path/to/stack2.template.json',
          }],
        }]),
      ],
    });
    const stack1 = new core.Stack(stage1, 'stack1');
    new core.CfnResource(stack1, 'DefaultResource1', {
      type: 'Test::Resource::Fake',
      properties: {
        result: 'failure',
      },
    });
    const stack2 = new core.Stack(stage2, 'stack2');
    new core.CfnResource(stack2, 'DefaultResource2', {
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

(Summary)

╔════════╤══════════════╗
║ Status │ failure      ║
╟────────┼──────────────╢
║ Plugin │ test-plugin2 ║
╚════════╧══════════════╝


(Violations)

${reset(red(bright('test-rule2 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage1/stack1/DefaultResource1
    - Template Path: /path/to/stack1.template.json
    - Creation Stack:
\t└──  Stage1 (Stage1)
\t     │ Library: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack1 (Stage1/stack1)
\t          │ Library: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource1 (Stage1/stack1/DefaultResource1)
\t               │ Library: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource1
    - Template Locations:
      > test-location

  Description: do something

(Summary)

╔════════╤══════════════╗
║ Status │ failure      ║
╟────────┼──────────────╢
║ Plugin │ test-plugin3 ║
╚════════╧══════════════╝


(Violations)

${reset(red(bright('test-rule3 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage2/stack2/DefaultResource2
    - Template Path: /path/to/stack2.template.json
    - Creation Stack:
\t└──  Stage2 (Stage2)
\t     │ Library: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack2 (Stage2/stack2)
\t          │ Library: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource2 (Stage2/stack2/DefaultResource2)
\t               │ Library: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource2
    - Template Locations:
      > test-location

  Description: do something

(Summary)

╔════════╤══════════════╗
║ Status │ failure      ║
╟────────┼──────────────╢
║ Plugin │ test-plugin1 ║
╚════════╧══════════════╝


(Violations)

${reset(red(bright('test-rule1 (1 occurrences)')))}

  Occurrences:

    - Construct Path: Stage1/stack1/DefaultResource1
    - Template Path: /path/to/stack1.template.json
    - Creation Stack:
\t└──  Stage1 (Stage1)
\t     │ Library: @aws-cdk/core.Stage
\t     │ Library Version: 0.0.0
\t     │ Location: Run with '--debug' to include location info
\t     └──  stack1 (Stage1/stack1)
\t          │ Library: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: Run with '--debug' to include location info
\t          └──  DefaultResource1 (Stage1/stack1/DefaultResource1)
\t               │ Library: @aws-cdk/core.CfnResource
\t               │ Library Version: 0.0.0
\t               │ Location: Run with '--debug' to include location info
    - Resource ID: DefaultResource1
    - Template Locations:
      > test-location

  Description: do something`);
  });

  test('multiple constructs', () => {
    const app = new core.App({
      policyValidation: [
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
      policyValidation: [
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
    - Template Locations:
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
    - Template Locations:
      > test-location

  Description: do another thing`);
  });

  test('multiple plugins with mixed results', () => {
    const app = new core.App({
      policyValidation: [
        new FakePlugin('plugin1', []),
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
    - Template Locations:
      > test-location

  Description: do another thing`);
  });

  test('plugin throws an error', () => {
    const app = new core.App({
      policyValidation: [
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
      policyValidation: [
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
      policyValidation: [
        new FakePlugin('test-plugin', [{
          description: 'test recommendation',
          ruleName: 'test-rule',
          ruleMetadata: {
            id: 'abcdefg',
          },
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
              ruleMetadata: { id: 'abcdefg' },
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

class FakePlugin implements core.IPolicyValidationPlugin {
  // public readonly name = 'test-plugin';

  constructor(
    public readonly name: string,
    private readonly violations: PolicyViolationResourceAware[]) {}

  validate(_context: core.IPolicyValidationContext): PolicyValidationPluginReport {
    return {
      success: this.violations.length === 0,
      violations: this.violations,
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
  templatePath: string,
  title: string,
  constructPath: string,
  creationStack?: string,
  resourceLogicalId: string,
  severity?: string,
  ruleMetadata?: { [key: string]: string };
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
