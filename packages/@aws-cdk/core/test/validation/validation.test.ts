import * as fs from 'fs';
import { Construct } from 'constructs';
import * as core from '../../lib';
import { ValidationReport, ValidationViolationResourceAware } from '../../lib';


let logMock: jest.SpyInstance;
beforeEach(() => {
  logMock = jest.spyOn(console, 'error').mockImplementation(() => { return true; });
});

afterEach(() => {
  logMock.mockRestore();
});

describe('validations', () => {
  test('validation failure', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin([{
          recommendation: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceName: 'Fake',
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

    expect(logMock.mock.calls[0][0]).toEqual(validationReport({
      templatePath: '/path/to/stack.template.json',
      constructPath: 'Default/Fake',
      title: 'test-rule',
      creationStack: `\t└──  Fake (Default/Fake)
\t     │ Library: @aws-cdk/core.CfnResource
\t     │ Library Version: 0.0.0
\t     │ Location: undefined
\t     └──  Default (Default)
\t          │ Library: @aws-cdk/core.Stack
\t          │ Library Version: 0.0.0
\t          │ Location: undefined`,
      resourceName: 'Fake',
    }));
  });

  test('validation success', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin([]),
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
        new FakePlugin([{
          recommendation: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceName: 'DefaultResource',
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

    const report = logMock.mock.calls[0][0];
    // Assuming the rest of the report's content is checked by another test
    expect(report).toContain('- Template Path: /path/to/stack1.template.json');
    expect(report).not.toContain('- Template Path: /path/to/stack2.template.json');
  });

  test('multiple constructs', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin([{
          recommendation: 'test recommendation',
          ruleName: 'test-rule',
          violatingResources: [{
            locations: ['test-location'],
            resourceName: 'SomeResource317FDD71',
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

    const report = logMock.mock.calls[0][0];
    // Assuming the rest of the report's content is checked by another test
    expect(report).toContain('- Construct Path: Default/SomeResource');
    expect(report).not.toContain('- Construct Path: Default/AnotherResource');
  });

  test('plugin not ready', () => {
    const app = new core.App({
      validationPlugins: [
        new FakePlugin([], false),
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
    }).toThrow(/Validation plugin 'test-plugin' is not ready/);
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
});

class FakePlugin implements core.IValidationPlugin {
  public readonly name = 'test-plugin';

  constructor(
    private readonly violations: ValidationViolationResourceAware[],
    private readonly ready: boolean = true) {}

  validate(_context: core.ValidationContext): ValidationReport {
    return {
      pluginName: this.name,
      success: this.violations.length === 0,
      violations: this.violations,
    };
  }

  isReady(): boolean {
    return this.ready;
  }
}

class RoguePlugin implements core.IValidationPlugin {
  public readonly name = 'rogue-plugin';

  validate(context: core.ValidationContext): ValidationReport {
    const templatePath = context.templatePaths[0];
    fs.writeFileSync(templatePath, 'malicious data');
    return {
      pluginName: this.name,
      success: true,
      violations: [],
    };
  }

  isReady(): boolean {
    return true;
  }
}

interface ValidationReportData {
  templatePath: string,
  title: string,
  constructPath: string,
  creationStack?: string,
  resourceName: string,
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
    `    - Resource Name: ${data.resourceName}`,
    '    - Locations:',
    '      > test-location',
    '',
    '  Recommendation: test recommendation',

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