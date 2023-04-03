"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable quote-props */
const fs = require("fs");
const path = require("path");
const constructs_1 = require("constructs");
const table_1 = require("table");
const core = require("../../lib");
let consoleErrorMock;
let consoleLogMock;
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
        expect(consoleErrorMock.mock.calls[0][0].split('\n')).toEqual(expect.arrayContaining(validationReport([{
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
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.Stack/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                    expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.CfnResource/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
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
                    }], '1.2.3'),
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
        const report = consoleErrorMock.mock.calls[0][0].split('\n');
        // Assuming the rest of the report's content is checked by another test
        expect(report).toEqual(expect.arrayContaining(validationReport([
            {
                pluginName: 'test-plugin2',
                status: 'failure',
                templatePath: '/path/to/Stage1stack1DDED8B6C.template.json',
                constructPath: 'Stage1/stack1/DefaultResource',
                title: 'test-rule2',
                creationStack: [
                    expect.stringMatching(/Stage1 \(Stage1\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.Stage/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                    expect.stringMatching(/└──  stack1 \(Stage1\/stack1\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.Stack/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                    expect.stringMatching(/└──  DefaultResource \(Stage1\/stack1\/DefaultResource\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.CfnResource/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                ],
                resourceLogicalId: 'DefaultResource',
                description: 'do something',
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
        ])));
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
        const stage1 = new core.Stage(app, 'Stage1', {});
        const stage2 = new core.Stage(app, 'Stage2', {
            policyValidationBeta1: [
                {
                    name: 'test-plugin2',
                    validate: mockValidate,
                },
            ],
        });
        const stage3 = new core.Stage(stage2, 'Stage3', {});
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
        const stage1 = new core.Stage(app, 'Stage1', {});
        const stage2 = new core.Stage(app, 'Stage2', {});
        const stage3 = new core.Stage(stage2, 'Stage3', {});
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
        const report = consoleErrorMock.mock.calls[0][0].split('\n');
        expect(report).toEqual(expect.arrayContaining(validationReport([
            {
                pluginName: 'plugin1',
                status: 'failure',
                templatePath: '/path/to/Default.template.json',
                constructPath: 'Default/Fake',
                title: 'rule-1',
                creationStack: [
                    expect.stringMatching(/Default \(Default\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.Stack/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                    expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.CfnResource/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
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
        ])));
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
        const report = consoleErrorMock.mock.calls[0][0].split('\n');
        expect(report).toEqual(expect.arrayContaining(validationReport([
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
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.Stack/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                    expect.stringMatching(/└──  Fake \(Default\/Fake\)/),
                    expect.stringMatching(/│ Construct: @aws-cdk\/core.CfnResource/),
                    expect.stringMatching(/│ Library Version: .*/),
                    expect.stringMatching(/│ Location: Run with '--debug' to include location info/),
                ],
                description: 'do another thing',
                resourceLogicalId: 'Fake',
            },
        ])));
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
                                        'libraryVersion': expect.any(String),
                                        'location': "Run with '--debug' to include location info",
                                        'path': 'Default',
                                        'child': {
                                            'id': 'Fake',
                                            'construct': '@aws-cdk/core.CfnResource',
                                            'libraryVersion': expect.any(String),
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
class FakePlugin {
    constructor(name, violations, version) {
        this.name = name;
        this.violations = violations;
        this.version = version;
        this._version = version;
    }
    validate(_context) {
        return {
            success: this.violations.length === 0,
            violations: this.violations,
            pluginVersion: this._version,
        };
    }
}
class RoguePlugin {
    constructor() {
        this.name = 'rogue-plugin';
    }
    validate(context) {
        const templatePath = context.templatePaths[0];
        fs.writeFileSync(templatePath, 'malicious data');
        return {
            success: true,
            violations: [],
        };
    }
}
class BrokenPlugin {
    constructor() {
        this.name = 'broken-plugin';
    }
    validate(_context) {
        throw new Error('Something went wrong');
    }
}
function generateTable(pluginName, status, pluginVersion) {
    return (0, table_1.table)([
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
const validationReport = (data) => {
    const result = data.flatMap(d => {
        if (d.status === 'failure') {
            const title = reset(red(bright(`${d.title} (1 occurrences)`)));
            return [
                expect.stringMatching(new RegExp('Validation Report')),
                expect.stringMatching(new RegExp('-----------------')),
                expect.stringMatching(new RegExp(`Plugin: ${d.pluginName}`)),
                expect.stringMatching(new RegExp(`Status: ${d.status}`)),
                expect.stringMatching(new RegExp('\(Violations\)')),
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
                // new RegExp(''),
            ];
        }
        return [];
    });
    result.push(expect.stringMatching(new RegExp('Policy Validation Report Summary')), ...data.map(d => expect.stringMatching(new RegExp(`.*${d.pluginName}.*${d.status}.*`))));
    return result;
};
function reset(s) {
    return `${s}\x1b[0m`;
}
function red(s) {
    return `\x1b[31m${s}`;
}
function bright(s) {
    return `\x1b[1m${s}`;
}
class LevelTwoConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        new core.CfnResource(this, 'Resource', {
            type: 'Test::Resource::Fake',
            properties: {
                result: 'success',
            },
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQWdDO0FBQ2hDLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsMkNBQXVDO0FBQ3ZDLGlDQUE4QjtBQUM5QixrQ0FBa0M7QUFJbEMsSUFBSSxnQkFBa0MsQ0FBQztBQUN2QyxJQUFJLGNBQWdDLENBQUM7QUFDckMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0YsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekYsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsR0FBRyxFQUFFO0lBQ2IsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDL0IsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQy9CLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDdkIscUJBQXFCLEVBQUU7Z0JBQ3JCLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUM3QixXQUFXLEVBQUUscUJBQXFCO3dCQUNsQyxRQUFRLEVBQUUsV0FBVzt3QkFDckIsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFlBQVksRUFBRTs0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ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdGFibGUgfSBmcm9tICd0YWJsZSc7XG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBQb2xpY3lWYWxpZGF0aW9uUGx1Z2luUmVwb3J0QmV0YTEsIFBvbGljeVZpb2xhdGlvbkJldGExIH0gZnJvbSAnLi4vLi4vbGliJztcblxuXG5sZXQgY29uc29sZUVycm9yTW9jazogamVzdC5TcHlJbnN0YW5jZTtcbmxldCBjb25zb2xlTG9nTW9jazogamVzdC5TcHlJbnN0YW5jZTtcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBjb25zb2xlRXJyb3JNb2NrID0gamVzdC5zcHlPbihjb25zb2xlLCAnZXJyb3InKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4geyByZXR1cm4gdHJ1ZTsgfSk7XG4gIGNvbnNvbGVMb2dNb2NrID0gamVzdC5zcHlPbihjb25zb2xlLCAnbG9nJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHsgcmV0dXJuIHRydWU7IH0pO1xufSk7XG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIGNvbnNvbGVFcnJvck1vY2subW9ja1Jlc3RvcmUoKTtcbiAgY29uc29sZUxvZ01vY2subW9ja1Jlc3RvcmUoKTtcbn0pO1xuXG5kZXNjcmliZSgndmFsaWRhdGlvbnMnLCAoKSA9PiB7XG4gIHRlc3QoJ3ZhbGlkYXRpb24gZmFpbHVyZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoe1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCd0ZXN0LXBsdWdpbicsIFt7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICd0ZXN0IHJlY29tbWVuZGF0aW9uJyxcbiAgICAgICAgICBydWxlTmFtZTogJ3Rlc3QtcnVsZScsXG4gICAgICAgICAgc2V2ZXJpdHk6ICdtZWRpdW0nLFxuICAgICAgICAgIHJ1bGVNZXRhZGF0YToge1xuICAgICAgICAgICAgaWQ6ICdhYmNkZWZnJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZpb2xhdGluZ1Jlc291cmNlczogW3tcbiAgICAgICAgICAgIGxvY2F0aW9uczogWyd0ZXN0LWxvY2F0aW9uJ10sXG4gICAgICAgICAgICByZXNvdXJjZUxvZ2ljYWxJZDogJ0Zha2UnLFxuICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiAnL3BhdGgvdG8vRGVmYXVsdC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfV0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGYWtlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnZmFpbHVyZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9WYWxpZGF0aW9uIGZhaWxlZC8pO1xuXG4gICAgZXhwZWN0KGNvbnNvbGVFcnJvck1vY2subW9jay5jYWxsc1swXVswXS5zcGxpdCgnXFxuJykpLnRvRXF1YWwoZXhwZWN0LmFycmF5Q29udGFpbmluZyh2YWxpZGF0aW9uUmVwb3J0KFt7XG4gICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9EZWZhdWx0LnRlbXBsYXRlLmpzb24nLFxuICAgICAgY29uc3RydWN0UGF0aDogJ0RlZmF1bHQvRmFrZScsXG4gICAgICB0aXRsZTogJ3Rlc3QtcnVsZScsXG4gICAgICBwbHVnaW5OYW1lOiAndGVzdC1wbHVnaW4nLFxuICAgICAgc3RhdHVzOiAnZmFpbHVyZScsXG4gICAgICBydWxlTWV0YWRhdGE6IHtcbiAgICAgICAgaWQ6ICdhYmNkZWZnJyxcbiAgICAgIH0sXG4gICAgICBzZXZlcml0eTogJ21lZGl1bScsXG4gICAgICBjcmVhdGlvblN0YWNrOiBbXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvRGVmYXVsdCBcXChEZWZhdWx0XFwpLyksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSCIENvbnN0cnVjdDogQGF3cy1jZGtcXC9jb3JlLlN0YWNrLyksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSCIExpYnJhcnkgVmVyc2lvbjogLiovKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilJTilIDilIAgIEZha2UgXFwoRGVmYXVsdFxcL0Zha2VcXCkvKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgQ29uc3RydWN0OiBAYXdzLWNka1xcL2NvcmUuQ2ZuUmVzb3VyY2UvKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBMb2NhdGlvbjogUnVuIHdpdGggJy0tZGVidWcnIHRvIGluY2x1ZGUgbG9jYXRpb24gaW5mby8pLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRmFrZScsXG4gICAgfV0pKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gc3VjY2VzcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoe1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCd0ZXN0LXBsdWdpbicsIFtdKSxcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luMicsIFtdKSxcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luMycsIFtdKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHApO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnc3VjY2VzcycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS5ub3QudG9UaHJvdygvVmFsaWRhdGlvbiBmYWlsZWQvKTtcbiAgICBleHBlY3QoY29uc29sZUxvZ01vY2subW9jay5jYWxscykudG9FcXVhbChbXG4gICAgICBbXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvUGVyZm9ybWluZyBQb2xpY3kgVmFsaWRhdGlvbnMvKSxcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvUG9saWN5IFZhbGlkYXRpb24gU3VjY2Vzc2Z1bCEvKSxcbiAgICAgIF0sXG4gICAgXSk7XG4gICAgZXhwZWN0KGNvbnNvbGVFcnJvck1vY2subW9jay5jYWxsc1swXVswXSkudG9FcXVhbChgVmFsaWRhdGlvbiBSZXBvcnRcbi0tLS0tLS0tLS0tLS0tLS0tXG5cblBvbGljeSBWYWxpZGF0aW9uIFJlcG9ydCBTdW1tYXJ5XG5cbuKVlOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVpOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVl1xu4pWRIFBsdWdpbiAgICAgICDilIIgU3RhdHVzICDilZFcbuKVn+KUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKVolxu4pWRIHRlc3QtcGx1Z2luICDilIIgc3VjY2VzcyDilZFcbuKVn+KUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKVolxu4pWRIHRlc3QtcGx1Z2luMiDilIIgc3VjY2VzcyDilZFcbuKVn+KUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKVolxu4pWRIHRlc3QtcGx1Z2luMyDilIIgc3VjY2VzcyDilZFcbuKVmuKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVp+KVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVkOKVnVxuYCk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIHN0YWNrcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoe1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCd0ZXN0LXBsdWdpbicsIFt7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICd0ZXN0IHJlY29tbWVuZGF0aW9uJyxcbiAgICAgICAgICBydWxlTmFtZTogJ3Rlc3QtcnVsZScsXG4gICAgICAgICAgdmlvbGF0aW5nUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgbG9jYXRpb25zOiBbJ3Rlc3QtbG9jYXRpb24nXSxcbiAgICAgICAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRGVmYXVsdFJlc291cmNlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL3N0YWNrMS50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfV0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgY29yZS5TdGFjayhhcHAsICdzdGFjazEnKTtcbiAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdEZWZhdWx0UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXN1bHQ6ICdmYWlsdXJlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnc3RhY2syJyk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnZmFpbHVyZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9WYWxpZGF0aW9uIGZhaWxlZC8pO1xuXG4gICAgY29uc3QgcmVwb3J0ID0gY29uc29sZUVycm9yTW9jay5tb2NrLmNhbGxzWzBdWzBdO1xuICAgIC8vIEFzc3VtaW5nIHRoZSByZXN0IG9mIHRoZSByZXBvcnQncyBjb250ZW50IGlzIGNoZWNrZWQgYnkgYW5vdGhlciB0ZXN0XG4gICAgZXhwZWN0KHJlcG9ydCkudG9Db250YWluKCctIFRlbXBsYXRlIFBhdGg6IC9wYXRoL3RvL3N0YWNrMS50ZW1wbGF0ZS5qc29uJyk7XG4gICAgZXhwZWN0KHJlcG9ydCkubm90LnRvQ29udGFpbignLSBUZW1wbGF0ZSBQYXRoOiAvcGF0aC90by9zdGFjazIudGVtcGxhdGUuanNvbicpO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBzdGFnZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKHtcbiAgICAgIHBvbGljeVZhbGlkYXRpb25CZXRhMTogW1xuICAgICAgICBuZXcgRmFrZVBsdWdpbigndGVzdC1wbHVnaW4xJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIHNvbWV0aGluZycsXG4gICAgICAgICAgcnVsZU5hbWU6ICd0ZXN0LXJ1bGUxJyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdEZWZhdWx0UmVzb3VyY2UnLFxuICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiAnL3BhdGgvdG8vU3RhZ2Uxc3RhY2sxRERFRDhCNkMudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dLCAnMS4yLjMnKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhZ2UxID0gbmV3IGNvcmUuU3RhZ2UoYXBwLCAnU3RhZ2UxJywge1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCd0ZXN0LXBsdWdpbjInLCBbe1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZG8gc29tZXRoaW5nJyxcbiAgICAgICAgICBydWxlTmFtZTogJ3Rlc3QtcnVsZTInLFxuICAgICAgICAgIHZpb2xhdGluZ1Jlc291cmNlczogW3tcbiAgICAgICAgICAgIGxvY2F0aW9uczogWyd0ZXN0LWxvY2F0aW9uJ10sXG4gICAgICAgICAgICByZXNvdXJjZUxvZ2ljYWxJZDogJ0RlZmF1bHRSZXNvdXJjZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9TdGFnZTFzdGFjazFEREVEOEI2Qy50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfV0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFnZTIgPSBuZXcgY29yZS5TdGFnZShhcHAsICdTdGFnZTInLCB7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luMycsIFt7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdkbyBzb21ldGhpbmcnLFxuICAgICAgICAgIHJ1bGVOYW1lOiAndGVzdC1ydWxlMycsXG4gICAgICAgICAgdmlvbGF0aW5nUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgbG9jYXRpb25zOiBbJ3Rlc3QtbG9jYXRpb24nXSxcbiAgICAgICAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRGVmYXVsdFJlc291cmNlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL1N0YWdlMnN0YWNrMjU5QkE3MThFLnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XSksXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWdlMyA9IG5ldyBjb3JlLlN0YWdlKHN0YWdlMiwgJ1N0YWdlMycsIHtcbiAgICAgIHBvbGljeVZhbGlkYXRpb25CZXRhMTogW1xuICAgICAgICBuZXcgRmFrZVBsdWdpbigndGVzdC1wbHVnaW40JywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIHNvbWV0aGluZycsXG4gICAgICAgICAgcnVsZU5hbWU6ICd0ZXN0LXJ1bGU0JyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdEZWZhdWx0UmVzb3VyY2UnLFxuICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiAnL3BhdGgvdG8vU3RhZ2UyU3RhZ2Uzc3RhY2sxMENEMzY5MTUudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2szID0gbmV3IGNvcmUuU3RhY2soc3RhZ2UzLCAnc3RhY2sxJyk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2szLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnZmFpbHVyZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBjb3JlLlN0YWNrKHN0YWdlMSwgJ3N0YWNrMScpO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMSwgJ0RlZmF1bHRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdDogJ2ZhaWx1cmUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY29yZS5TdGFjayhzdGFnZTIsICdzdGFjazInKTtcbiAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazIsICdEZWZhdWx0UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXN1bHQ6ICdmYWlsdXJlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coL1ZhbGlkYXRpb24gZmFpbGVkLyk7XG5cbiAgICBjb25zdCByZXBvcnQgPSBjb25zb2xlRXJyb3JNb2NrLm1vY2suY2FsbHNbMF1bMF0uc3BsaXQoJ1xcbicpO1xuICAgIC8vIEFzc3VtaW5nIHRoZSByZXN0IG9mIHRoZSByZXBvcnQncyBjb250ZW50IGlzIGNoZWNrZWQgYnkgYW5vdGhlciB0ZXN0XG4gICAgZXhwZWN0KHJlcG9ydCkudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKFxuICAgICAgdmFsaWRhdGlvblJlcG9ydChbXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAndGVzdC1wbHVnaW4yJyxcbiAgICAgICAgICBzdGF0dXM6ICdmYWlsdXJlJyxcbiAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9TdGFnZTFzdGFjazFEREVEOEI2Qy50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICBjb25zdHJ1Y3RQYXRoOiAnU3RhZ2UxL3N0YWNrMS9EZWZhdWx0UmVzb3VyY2UnLFxuICAgICAgICAgIHRpdGxlOiAndGVzdC1ydWxlMicsXG4gICAgICAgICAgY3JlYXRpb25TdGFjazogW1xuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC9TdGFnZTEgXFwoU3RhZ2UxXFwpLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBDb25zdHJ1Y3Q6IEBhd3MtY2RrXFwvY29yZS5TdGFnZS8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSU4pSA4pSAICBzdGFjazEgXFwoU3RhZ2UxXFwvc3RhY2sxXFwpLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBDb25zdHJ1Y3Q6IEBhd3MtY2RrXFwvY29yZS5TdGFjay8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSU4pSA4pSAICBEZWZhdWx0UmVzb3VyY2UgXFwoU3RhZ2UxXFwvc3RhY2sxXFwvRGVmYXVsdFJlc291cmNlXFwpLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBDb25zdHJ1Y3Q6IEBhd3MtY2RrXFwvY29yZS5DZm5SZXNvdXJjZS8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRGVmYXVsdFJlc291cmNlJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIHNvbWV0aGluZycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAndGVzdC1wbHVnaW40JyxcbiAgICAgICAgICBzdGF0dXM6ICdmYWlsdXJlJyxcbiAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9TdGFnZTJTdGFnZTNzdGFjazEwQ0QzNjkxNS50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICBjb25zdHJ1Y3RQYXRoOiAnU3RhZ2UyL1N0YWdlMy9zdGFjazEvRGVmYXVsdFJlc291cmNlJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIHNvbWV0aGluZycsXG4gICAgICAgICAgdGl0bGU6ICd0ZXN0LXJ1bGU0JyxcbiAgICAgICAgICByZXNvdXJjZUxvZ2ljYWxJZDogJ0RlZmF1bHRSZXNvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAndGVzdC1wbHVnaW4zJyxcbiAgICAgICAgICBzdGF0dXM6ICdmYWlsdXJlJyxcbiAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9TdGFnZTJzdGFjazI1OUJBNzE4RS50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICBjb25zdHJ1Y3RQYXRoOiAnU3RhZ2UyL3N0YWNrMi9EZWZhdWx0UmVzb3VyY2UnLFxuICAgICAgICAgIHRpdGxlOiAndGVzdC1ydWxlMycsXG4gICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdEZWZhdWx0UmVzb3VyY2UnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZG8gc29tZXRoaW5nJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBsdWdpbk5hbWU6ICd0ZXN0LXBsdWdpbjEnLFxuICAgICAgICAgIHN0YXR1czogJ2ZhaWx1cmUnLFxuICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL1N0YWdlMXN0YWNrMURERUQ4QjZDLnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgIGNvbnN0cnVjdFBhdGg6ICdTdGFnZTEvc3RhY2sxL0RlZmF1bHRSZXNvdXJjZScsXG4gICAgICAgICAgdGl0bGU6ICd0ZXN0LXJ1bGUxJyxcbiAgICAgICAgICByZXNvdXJjZUxvZ2ljYWxJZDogJ0RlZmF1bHRSZXNvdXJjZScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdkbyBzb21ldGhpbmcnLFxuICAgICAgICB9LFxuICAgICAgXSksXG4gICAgKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIHN0YWdlcywgbXVsdGlwbGUgcGx1Z2lucycsICgpID0+IHtcbiAgICBjb25zdCBtb2NrVmFsaWRhdGUgPSBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIHZpb2xhdGlvbnM6IFtdLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoe1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICAgICAgICAgIHZhbGlkYXRlOiBtb2NrVmFsaWRhdGUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWdlMSA9IG5ldyBjb3JlLlN0YWdlKGFwcCwgJ1N0YWdlMScsIHsgfSk7XG4gICAgY29uc3Qgc3RhZ2UyID0gbmV3IGNvcmUuU3RhZ2UoYXBwLCAnU3RhZ2UyJywge1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAndGVzdC1wbHVnaW4yJyxcbiAgICAgICAgICB2YWxpZGF0ZTogbW9ja1ZhbGlkYXRlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFnZTMgPSBuZXcgY29yZS5TdGFnZShzdGFnZTIsICdTdGFnZTMnLCB7IH0pO1xuICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBjb3JlLlN0YWNrKHN0YWdlMywgJ3N0YWNrMScpO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMywgJ0RlZmF1bHRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdDogJ2ZhaWx1cmUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgY29yZS5TdGFjayhzdGFnZTEsICdzdGFjazEnKTtcbiAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdEZWZhdWx0UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXN1bHQ6ICdmYWlsdXJlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNvcmUuU3RhY2soc3RhZ2UyLCAnc3RhY2syJyk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnZmFpbHVyZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KG1vY2tWYWxpZGF0ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpO1xuICAgIGV4cGVjdChtb2NrVmFsaWRhdGUpLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDIsIHtcbiAgICAgIHRlbXBsYXRlUGF0aHM6IFtcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC9hc3NlbWJseS1TdGFnZTFcXC9TdGFnZTFzdGFjazFEREVEOEI2Qy50ZW1wbGF0ZS5qc29uLyksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvYXNzZW1ibHktU3RhZ2UyXFwvU3RhZ2Uyc3RhY2syNTlCQTcxOEUudGVtcGxhdGUuanNvbi8pLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL2Fzc2VtYmx5LVN0YWdlMlxcL2Fzc2VtYmx5LVN0YWdlMi1TdGFnZTNcXC9TdGFnZTJTdGFnZTNzdGFjazEwQ0QzNjkxNS50ZW1wbGF0ZS5qc29uLyksXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGV4cGVjdChtb2NrVmFsaWRhdGUpLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDEsIHtcbiAgICAgIHRlbXBsYXRlUGF0aHM6IFtcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC9hc3NlbWJseS1TdGFnZTJcXC9TdGFnZTJzdGFjazI1OUJBNzE4RS50ZW1wbGF0ZS5qc29uLyksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvYXNzZW1ibHktU3RhZ2UyXFwvYXNzZW1ibHktU3RhZ2UyLVN0YWdlM1xcL1N0YWdlMlN0YWdlM3N0YWNrMTBDRDM2OTE1LnRlbXBsYXRlLmpzb24vKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIHN0YWdlcywgc2luZ2xlIHBsdWdpbicsICgpID0+IHtcbiAgICBjb25zdCBtb2NrVmFsaWRhdGUgPSBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIHZpb2xhdGlvbnM6IFtdLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICBjb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoe1xuICAgICAgcG9saWN5VmFsaWRhdGlvbkJldGExOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICAgICAgICAgIHZhbGlkYXRlOiBtb2NrVmFsaWRhdGUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWdlMSA9IG5ldyBjb3JlLlN0YWdlKGFwcCwgJ1N0YWdlMScsIHsgfSk7XG4gICAgY29uc3Qgc3RhZ2UyID0gbmV3IGNvcmUuU3RhZ2UoYXBwLCAnU3RhZ2UyJywgeyB9KTtcbiAgICBjb25zdCBzdGFnZTMgPSBuZXcgY29yZS5TdGFnZShzdGFnZTIsICdTdGFnZTMnLCB7IH0pO1xuICAgIGNvbnN0IHN0YWNrMyA9IG5ldyBjb3JlLlN0YWNrKHN0YWdlMywgJ3N0YWNrMScpO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrMywgJ0RlZmF1bHRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdDogJ2ZhaWx1cmUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgY29yZS5TdGFjayhzdGFnZTEsICdzdGFjazEnKTtcbiAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjazEsICdEZWZhdWx0UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXN1bHQ6ICdmYWlsdXJlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNvcmUuU3RhY2soc3RhZ2UyLCAnc3RhY2syJyk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnZmFpbHVyZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KG1vY2tWYWxpZGF0ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgIGV4cGVjdChtb2NrVmFsaWRhdGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIHRlbXBsYXRlUGF0aHM6IFtcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC9hc3NlbWJseS1TdGFnZTFcXC9TdGFnZTFzdGFjazFEREVEOEI2Qy50ZW1wbGF0ZS5qc29uLyksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvYXNzZW1ibHktU3RhZ2UyXFwvU3RhZ2Uyc3RhY2syNTlCQTcxOEUudGVtcGxhdGUuanNvbi8pLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL2Fzc2VtYmx5LVN0YWdlMlxcL2Fzc2VtYmx5LVN0YWdlMi1TdGFnZTNcXC9TdGFnZTJTdGFnZTNzdGFjazEwQ0QzNjkxNS50ZW1wbGF0ZS5qc29uLyksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBjb25zdHJ1Y3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QgcmVjb21tZW5kYXRpb24nLFxuICAgICAgICAgIHJ1bGVOYW1lOiAndGVzdC1ydWxlJyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdTb21lUmVzb3VyY2UzMTdGREQ3MScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9EZWZhdWx0LnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XSksXG4gICAgICBdLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwKTtcbiAgICBuZXcgTGV2ZWxUd29Db25zdHJ1Y3Qoc3RhY2ssICdTb21lUmVzb3VyY2UnKTtcbiAgICBuZXcgTGV2ZWxUd29Db25zdHJ1Y3Qoc3RhY2ssICdBbm90aGVyUmVzb3VyY2UnKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvVmFsaWRhdGlvbiBmYWlsZWQvKTtcblxuICAgIGNvbnN0IHJlcG9ydCA9IGNvbnNvbGVFcnJvck1vY2subW9jay5jYWxsc1swXVswXTtcbiAgICAvLyBBc3N1bWluZyB0aGUgcmVzdCBvZiB0aGUgcmVwb3J0J3MgY29udGVudCBpcyBjaGVja2VkIGJ5IGFub3RoZXIgdGVzdFxuICAgIGV4cGVjdChyZXBvcnQpLnRvQ29udGFpbignLSBDb25zdHJ1Y3QgUGF0aDogRGVmYXVsdC9Tb21lUmVzb3VyY2UnKTtcbiAgICBleHBlY3QocmVwb3J0KS5ub3QudG9Db250YWluKCctIENvbnN0cnVjdCBQYXRoOiBEZWZhdWx0L0Fub3RoZXJSZXNvdXJjZScpO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBwbHVnaW5zJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3BsdWdpbjEnLCBbe1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZG8gc29tZXRoaW5nJyxcbiAgICAgICAgICBydWxlTmFtZTogJ3J1bGUtMScsXG4gICAgICAgICAgdmlvbGF0aW5nUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgbG9jYXRpb25zOiBbJ3Rlc3QtbG9jYXRpb24nXSxcbiAgICAgICAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRmFrZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVBhdGg6ICcvcGF0aC90by9EZWZhdWx0LnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XSksXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCdwbHVnaW4yJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIGFub3RoZXIgdGhpbmcnLFxuICAgICAgICAgIHJ1bGVOYW1lOiAncnVsZS0yJyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHApO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRmFrZScsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdDogJ2ZhaWx1cmUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvVmFsaWRhdGlvbiBmYWlsZWQvKTtcblxuICAgIGNvbnN0IHJlcG9ydCA9IGNvbnNvbGVFcnJvck1vY2subW9jay5jYWxsc1swXVswXS5zcGxpdCgnXFxuJyk7XG4gICAgZXhwZWN0KHJlcG9ydCkudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKFxuICAgICAgdmFsaWRhdGlvblJlcG9ydChbXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAncGx1Z2luMScsXG4gICAgICAgICAgc3RhdHVzOiAnZmFpbHVyZScsXG4gICAgICAgICAgdGVtcGxhdGVQYXRoOiAnL3BhdGgvdG8vRGVmYXVsdC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICBjb25zdHJ1Y3RQYXRoOiAnRGVmYXVsdC9GYWtlJyxcbiAgICAgICAgICB0aXRsZTogJ3J1bGUtMScsXG4gICAgICAgICAgY3JlYXRpb25TdGFjazogW1xuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC9EZWZhdWx0IFxcKERlZmF1bHRcXCkvKSxcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSCIENvbnN0cnVjdDogQGF3cy1jZGtcXC9jb3JlLlN0YWNrLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBMaWJyYXJ5IFZlcnNpb246IC4qLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBMb2NhdGlvbjogUnVuIHdpdGggJy0tZGVidWcnIHRvIGluY2x1ZGUgbG9jYXRpb24gaW5mby8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilJTilIDilIAgIEZha2UgXFwoRGVmYXVsdFxcL0Zha2VcXCkvKSxcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSCIENvbnN0cnVjdDogQGF3cy1jZGtcXC9jb3JlLkNmblJlc291cmNlLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBMaWJyYXJ5IFZlcnNpb246IC4qLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBMb2NhdGlvbjogUnVuIHdpdGggJy0tZGVidWcnIHRvIGluY2x1ZGUgbG9jYXRpb24gaW5mby8pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdkbyBzb21ldGhpbmcnLFxuICAgICAgICAgIHJlc291cmNlTG9naWNhbElkOiAnRmFrZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAncGx1Z2luMicsXG4gICAgICAgICAgc3RhdHVzOiAnZmFpbHVyZScsXG4gICAgICAgICAgdGVtcGxhdGVQYXRoOiAnL3BhdGgvdG8vRGVmYXVsdC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICBjb25zdHJ1Y3RQYXRoOiAnRGVmYXVsdC9GYWtlJyxcbiAgICAgICAgICB0aXRsZTogJ3J1bGUtMicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdkbyBhbm90aGVyIHRoaW5nJyxcbiAgICAgICAgICByZXNvdXJjZUxvZ2ljYWxJZDogJ0Zha2UnLFxuICAgICAgICB9LFxuICAgICAgXSksXG4gICAgKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIHBsdWdpbnMgd2l0aCBtaXhlZCByZXN1bHRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3BsdWdpbjEnLCBbXSksXG4gICAgICAgIG5ldyBGYWtlUGx1Z2luKCdwbHVnaW4yJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2RvIGFub3RoZXIgdGhpbmcnLFxuICAgICAgICAgIHJ1bGVOYW1lOiAncnVsZS0yJyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHApO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRmFrZScsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZTo6RmFrZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdDogJ2ZhaWx1cmUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvVmFsaWRhdGlvbiBmYWlsZWQvKTtcblxuICAgIGNvbnN0IHJlcG9ydCA9IGNvbnNvbGVFcnJvck1vY2subW9jay5jYWxsc1swXVswXS5zcGxpdCgnXFxuJyk7XG4gICAgZXhwZWN0KHJlcG9ydCkudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKFxuICAgICAgdmFsaWRhdGlvblJlcG9ydChbXG4gICAgICAgIHtcbiAgICAgICAgICBwbHVnaW5OYW1lOiAncGx1Z2luMScsXG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgY29uc3RydWN0UGF0aDogJycsXG4gICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICcnLFxuICAgICAgICAgIHRlbXBsYXRlUGF0aDogJycsXG4gICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGx1Z2luTmFtZTogJ3BsdWdpbjInLFxuICAgICAgICAgIHN0YXR1czogJ2ZhaWx1cmUnLFxuICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgY29uc3RydWN0UGF0aDogJ0RlZmF1bHQvRmFrZScsXG4gICAgICAgICAgdGl0bGU6ICdydWxlLTInLFxuICAgICAgICAgIGNyZWF0aW9uU3RhY2s6IFtcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygvRGVmYXVsdCBcXChEZWZhdWx0XFwpLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBDb25zdHJ1Y3Q6IEBhd3MtY2RrXFwvY29yZS5TdGFjay8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygv4pSU4pSA4pSAICBGYWtlIFxcKERlZmF1bHRcXC9GYWtlXFwpLyksXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoL+KUgiBDb25zdHJ1Y3Q6IEBhd3MtY2RrXFwvY29yZS5DZm5SZXNvdXJjZS8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTGlicmFyeSBWZXJzaW9uOiAuKi8pLFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKC/ilIIgTG9jYXRpb246IFJ1biB3aXRoICctLWRlYnVnJyB0byBpbmNsdWRlIGxvY2F0aW9uIGluZm8vKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZG8gYW5vdGhlciB0aGluZycsXG4gICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgfSxcbiAgICAgIF0pLFxuICAgICkpO1xuICB9KTtcblxuICB0ZXN0KCdwbHVnaW4gdGhyb3dzIGFuIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgLy8gVGhpcyBwbHVnaW4gd2lsbCB0aHJvdyBhbiBlcnJvclxuICAgICAgICBuZXcgQnJva2VuUGx1Z2luKCksXG5cbiAgICAgICAgLy8gQnV0IHRoaXMgb25lIHNob3VsZCBzdGlsbCBydW5cbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QgcmVjb21tZW5kYXRpb24nLFxuICAgICAgICAgIHJ1bGVOYW1lOiAndGVzdC1ydWxlJyxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGYWtlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnc3VjY2VzcycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coL1ZhbGlkYXRpb24gZmFpbGVkLyk7XG5cbiAgICBjb25zdCByZXBvcnQgPSBjb25zb2xlRXJyb3JNb2NrLm1vY2suY2FsbHNbMF1bMF07XG4gICAgZXhwZWN0KHJlcG9ydCkudG9Db250YWluKCdlcnJvcjogVmFsaWRhdGlvbiBwbHVnaW4gXFwnYnJva2VuLXBsdWdpblxcJyBmYWlsZWQ6IFNvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgZXhwZWN0KHJlcG9ydCkudG9Db250YWluKGdlbmVyYXRlVGFibGUoJ3Rlc3QtcGx1Z2luJywgJ2ZhaWx1cmUnLCAnTi9BJykpO1xuICB9KTtcblxuICB0ZXN0KCdwbHVnaW4gdHJpZXMgdG8gbW9kaWZ5IGEgdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKHtcbiAgICAgIHBvbGljeVZhbGlkYXRpb25CZXRhMTogW1xuICAgICAgICBuZXcgUm9ndWVQbHVnaW4oKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY29yZS5TdGFjayhhcHApO1xuICAgIG5ldyBjb3JlLkNmblJlc291cmNlKHN0YWNrLCAnRGVmYXVsdFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnc3VjY2VzcycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcHAuc3ludGgoKTtcbiAgICB9KS50b1Rocm93KC9JbGxlZ2FsIG9wZXJhdGlvbjogdmFsaWRhdGlvbiBwbHVnaW4gJ3JvZ3VlLXBsdWdpbicgbW9kaWZpZWQgdGhlIGNsb3VkIGFzc2VtYmx5Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0pTT04gZm9ybWF0JywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjb3JlLkFwcCh7XG4gICAgICBwb2xpY3lWYWxpZGF0aW9uQmV0YTE6IFtcbiAgICAgICAgbmV3IEZha2VQbHVnaW4oJ3Rlc3QtcGx1Z2luJywgW3tcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QgcmVjb21tZW5kYXRpb24nLFxuICAgICAgICAgIHJ1bGVOYW1lOiAndGVzdC1ydWxlJyxcbiAgICAgICAgICBydWxlTWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGlkOiAnYWJjZGVmZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aW9sYXRpbmdSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dKSxcbiAgICAgIF0sXG4gICAgICBjb250ZXh0OiB7ICdAYXdzLWNkay9jb3JlOnZhbGlkYXRpb25SZXBvcnRKc29uJzogdHJ1ZSB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwKTtcbiAgICBuZXcgY29yZS5DZm5SZXNvdXJjZShzdGFjaywgJ0Zha2UnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2U6OkZha2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXN1bHQ6ICdmYWlsdXJlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFwcC5zeW50aCgpO1xuICAgIH0pLnRvVGhyb3coL1ZhbGlkYXRpb24gZmFpbGVkLyk7XG5cbiAgICBjb25zdCByZXBvcnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGFwcC5vdXRkaXIsICdwb2xpY3ktdmFsaWRhdGlvbi1yZXBvcnQuanNvbicpKS50b1N0cmluZygndXRmLTgnKTtcbiAgICBleHBlY3QoSlNPTi5wYXJzZShyZXBvcnQpKS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgIHRpdGxlOiAnVmFsaWRhdGlvbiBSZXBvcnQnLFxuICAgICAgcGx1Z2luUmVwb3J0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ3Rlc3QtcGx1Z2luJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2ZhaWx1cmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmlvbGF0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBydWxlTmFtZTogJ3Rlc3QtcnVsZScsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGVzdCByZWNvbW1lbmRhdGlvbicsXG4gICAgICAgICAgICAgIHJ1bGVNZXRhZGF0YTogeyBpZDogJ2FiY2RlZmcnIH0sXG4gICAgICAgICAgICAgIHZpb2xhdGluZ1Jlc291cmNlczogW3tcbiAgICAgICAgICAgICAgICAnbG9jYXRpb25zJzogW1xuICAgICAgICAgICAgICAgICAgJ3Rlc3QtbG9jYXRpb24nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlTG9naWNhbElkJzogJ0Zha2UnLFxuICAgICAgICAgICAgICAgICd0ZW1wbGF0ZVBhdGgnOiAnL3BhdGgvdG8vRGVmYXVsdC50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIHZpb2xhdGluZ0NvbnN0cnVjdHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RTdGFjazoge1xuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnRGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgICAgICdjb25zdHJ1Y3QnOiAnQGF3cy1jZGsvY29yZS5TdGFjaycsXG4gICAgICAgICAgICAgICAgICAgICdsaWJyYXJ5VmVyc2lvbic6IGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogXCJSdW4gd2l0aCAnLS1kZWJ1ZycgdG8gaW5jbHVkZSBsb2NhdGlvbiBpbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICdwYXRoJzogJ0RlZmF1bHQnLFxuICAgICAgICAgICAgICAgICAgICAnY2hpbGQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ2lkJzogJ0Zha2UnLFxuICAgICAgICAgICAgICAgICAgICAgICdjb25zdHJ1Y3QnOiAnQGF3cy1jZGsvY29yZS5DZm5SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgJ2xpYnJhcnlWZXJzaW9uJzogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgICAgICAgICAgICAgICdsb2NhdGlvbic6IFwiUnVuIHdpdGggJy0tZGVidWcnIHRvIGluY2x1ZGUgbG9jYXRpb24gaW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICdwYXRoJzogJ0RlZmF1bHQvRmFrZScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY29uc3RydWN0UGF0aDogJ0RlZmF1bHQvRmFrZScsXG4gICAgICAgICAgICAgICAgICBsb2NhdGlvbnM6IFsndGVzdC1sb2NhdGlvbiddLFxuICAgICAgICAgICAgICAgICAgcmVzb3VyY2VMb2dpY2FsSWQ6ICdGYWtlJyxcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogJy9wYXRoL3RvL0RlZmF1bHQudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuICB9KTtcbn0pO1xuXG5jbGFzcyBGYWtlUGx1Z2luIGltcGxlbWVudHMgY29yZS5JUG9saWN5VmFsaWRhdGlvblBsdWdpbkJldGExIHtcbiAgcHJpdmF0ZSBfdmVyc2lvbj86IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlvbGF0aW9uczogUG9saWN5VmlvbGF0aW9uQmV0YTFbXSxcbiAgICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmVyc2lvbiA9IHZlcnNpb247XG4gIH1cblxuICB2YWxpZGF0ZShfY29udGV4dDogY29yZS5JUG9saWN5VmFsaWRhdGlvbkNvbnRleHRCZXRhMSk6IFBvbGljeVZhbGlkYXRpb25QbHVnaW5SZXBvcnRCZXRhMSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRoaXMudmlvbGF0aW9ucy5sZW5ndGggPT09IDAsXG4gICAgICB2aW9sYXRpb25zOiB0aGlzLnZpb2xhdGlvbnMsXG4gICAgICBwbHVnaW5WZXJzaW9uOiB0aGlzLl92ZXJzaW9uLFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgUm9ndWVQbHVnaW4gaW1wbGVtZW50cyBjb3JlLklQb2xpY3lWYWxpZGF0aW9uUGx1Z2luQmV0YTEge1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdyb2d1ZS1wbHVnaW4nO1xuXG4gIHZhbGlkYXRlKGNvbnRleHQ6IGNvcmUuSVBvbGljeVZhbGlkYXRpb25Db250ZXh0QmV0YTEpOiBQb2xpY3lWYWxpZGF0aW9uUGx1Z2luUmVwb3J0QmV0YTEge1xuICAgIGNvbnN0IHRlbXBsYXRlUGF0aCA9IGNvbnRleHQudGVtcGxhdGVQYXRoc1swXTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRlbXBsYXRlUGF0aCwgJ21hbGljaW91cyBkYXRhJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICB2aW9sYXRpb25zOiBbXSxcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIEJyb2tlblBsdWdpbiBpbXBsZW1lbnRzIGNvcmUuSVBvbGljeVZhbGlkYXRpb25QbHVnaW5CZXRhMSB7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lID0gJ2Jyb2tlbi1wbHVnaW4nO1xuXG4gIHZhbGlkYXRlKF9jb250ZXh0OiBjb3JlLklQb2xpY3lWYWxpZGF0aW9uQ29udGV4dEJldGExKTogUG9saWN5VmFsaWRhdGlvblBsdWdpblJlcG9ydEJldGExIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFZhbGlkYXRpb25SZXBvcnREYXRhIHtcbiAgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHN0YXR1czogc3RyaW5nO1xuICBwbHVnaW5OYW1lOiBzdHJpbmc7XG4gIGNvbnN0cnVjdFBhdGg6IHN0cmluZztcbiAgY3JlYXRpb25TdGFjaz86IHN0cmluZ1tdO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcmVzb3VyY2VMb2dpY2FsSWQ6IHN0cmluZztcbiAgc2V2ZXJpdHk/OiBzdHJpbmc7XG4gIHJ1bGVNZXRhZGF0YT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGFibGUocGx1Z2luTmFtZTogc3RyaW5nLCBzdGF0dXM6IHN0cmluZywgcGx1Z2luVmVyc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRhYmxlKFtcbiAgICBbYFBsdWdpbjogJHtwbHVnaW5OYW1lfWBdLFxuICAgIFtgVmVyc2lvbjogJHtwbHVnaW5WZXJzaW9ufWBdLFxuICAgIFtgU3RhdHVzOiAke3N0YXR1c31gXSxcbiAgXSwge1xuICAgIGhlYWRlcjogeyBjb250ZW50OiAnUGx1Z2luIFJlcG9ydCcgfSxcbiAgICBzaW5nbGVMaW5lOiB0cnVlLFxuICAgIGNvbHVtbnM6IFt7XG4gICAgICBwYWRkaW5nTGVmdDogMyxcbiAgICAgIHBhZGRpbmdSaWdodDogMyxcbiAgICB9XSxcbiAgfSk7XG59XG5cbmNvbnN0IHZhbGlkYXRpb25SZXBvcnQgPSAoZGF0YTogVmFsaWRhdGlvblJlcG9ydERhdGFbXSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBkYXRhLmZsYXRNYXAoZCA9PiB7XG4gICAgaWYgKGQuc3RhdHVzID09PSAnZmFpbHVyZScpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gcmVzZXQocmVkKGJyaWdodChgJHtkLnRpdGxlfSAoMSBvY2N1cnJlbmNlcylgKSkpO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoJ1ZhbGlkYXRpb24gUmVwb3J0JykpLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcobmV3IFJlZ0V4cCgnLS0tLS0tLS0tLS0tLS0tLS0nKSksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZyhuZXcgUmVnRXhwKGBQbHVnaW46ICR7ZC5wbHVnaW5OYW1lfWApKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoYFN0YXR1czogJHtkLnN0YXR1c31gKSksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZyhuZXcgUmVnRXhwKCdcXChWaW9sYXRpb25zXFwpJykpLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgLi4uZC5zZXZlcml0eSA/IFtleHBlY3Quc3RyaW5nTWF0Y2hpbmcobmV3IFJlZ0V4cChgU2V2ZXJpdHk6ICR7ZC5zZXZlcml0eX1gKSldIDogW10sXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZyhuZXcgUmVnRXhwKCcgIE9jY3VycmVuY2VzOicpKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoYCAgICAtIENvbnN0cnVjdCBQYXRoOiAke2QuY29uc3RydWN0UGF0aH1gKSksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZyhuZXcgUmVnRXhwKGAgICAgLSBUZW1wbGF0ZSBQYXRoOiAke2QudGVtcGxhdGVQYXRofWApKSxcbiAgICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoJyAgICAtIENyZWF0aW9uIFN0YWNrOicpKSxcbiAgICAgICAgLi4uZC5jcmVhdGlvblN0YWNrID8/IFtdLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcobmV3IFJlZ0V4cChgICAgIC0gUmVzb3VyY2UgSUQ6ICR7ZC5yZXNvdXJjZUxvZ2ljYWxJZH1gKSksXG4gICAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZyhuZXcgUmVnRXhwKCcgICAgLSBUZW1wbGF0ZSBMb2NhdGlvbnM6JykpLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcobmV3IFJlZ0V4cCgnICAgICAgPiB0ZXN0LWxvY2F0aW9uJykpLFxuICAgICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcobmV3IFJlZ0V4cChgICBEZXNjcmlwdGlvbjogJHtkLmRlc2NyaXB0aW9uID8/ICd0ZXN0IHJlY29tbWVuZGF0aW9uJ31gKSksXG4gICAgICAgIC4uLmQucnVsZU1ldGFkYXRhID8gW2V4cGVjdC5zdHJpbmdNYXRjaGluZygnICBSdWxlIE1ldGFkYXRhOicpLCAuLi5PYmplY3QuZW50cmllcyhkLnJ1bGVNZXRhZGF0YSkuZmxhdE1hcCgoW2tleSwgdmFsdWVdKSA9PiBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoYCR7a2V5fTogJHt2YWx1ZX1gKSldIDogW10sXG4gICAgICAgIC8vIG5ldyBSZWdFeHAoJycpLFxuICAgICAgXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9KTtcbiAgcmVzdWx0LnB1c2goXG4gICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoJ1BvbGljeSBWYWxpZGF0aW9uIFJlcG9ydCBTdW1tYXJ5JykpLFxuICAgIC4uLmRhdGEubWFwKGQgPT4gZXhwZWN0LnN0cmluZ01hdGNoaW5nKG5ldyBSZWdFeHAoYC4qJHtkLnBsdWdpbk5hbWV9Lioke2Quc3RhdHVzfS4qYCkpKSxcbiAgKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIHJlc2V0KHM6IHN0cmluZykge1xuICByZXR1cm4gYCR7c31cXHgxYlswbWA7XG59XG5cbmZ1bmN0aW9uIHJlZChzOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBcXHgxYlszMW0ke3N9YDtcbn1cblxuZnVuY3Rpb24gYnJpZ2h0KHM6IHN0cmluZykge1xuICByZXR1cm4gYFxceDFiWzFtJHtzfWA7XG59XG5cbmNsYXNzIExldmVsVHdvQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgbmV3IGNvcmUuQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlOjpGYWtlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzdWx0OiAnc3VjY2VzcycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=