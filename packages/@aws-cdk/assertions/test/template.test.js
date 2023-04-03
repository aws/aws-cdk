"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
describe('Template', () => {
    test('fromString', () => {
        const template = lib_1.Template.fromString(`{
        "Resources": {
          "Foo": {
            "Type": "Baz::Qux",
            "Properties": { "Fred": "Waldo" }
          }
        }
      }`);
        expect(template.toJSON()).toEqual({
            Resources: {
                Foo: {
                    Type: 'Baz::Qux',
                    Properties: { Fred: 'Waldo' },
                },
            },
        });
    });
    describe('fromStack', () => {
        test('default', () => {
            const app = new core_1.App({
                context: {
                    '@aws-cdk/core:newStyleStackSynthesis': false,
                },
            });
            const stack = new core_1.Stack(app);
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: {
                    Baz: 'Qux',
                },
            });
            const template = lib_1.Template.fromStack(stack);
            expect(template.toJSON()).toEqual({
                Resources: {
                    Foo: {
                        Type: 'Foo::Bar',
                        Properties: { Baz: 'Qux' },
                    },
                },
            });
        });
        test('nested', () => {
            const app = new core_1.App({
                context: {
                    '@aws-cdk/core:newStyleStackSynthesis': false,
                },
            });
            const stack = new core_1.Stack(app);
            const nested = new core_1.NestedStack(stack, 'MyNestedStack');
            new core_1.CfnResource(nested, 'Foo', {
                type: 'Foo::Bar',
                properties: {
                    Baz: 'Qux',
                },
            });
            const template = lib_1.Template.fromStack(nested);
            expect(template.toJSON()).toEqual({
                Resources: {
                    Foo: {
                        Type: 'Foo::Bar',
                        Properties: { Baz: 'Qux' },
                    },
                },
            });
        });
    });
    describe('fromString', () => {
        test('default', () => {
            const assertions = lib_1.Template.fromString(`{
        "Resources": {
          "Foo": {
            "Type": "Baz::Qux",
            "Properties": { "Fred": "Waldo" }
          }
        }
      }`);
            assertions.resourceCountIs('Baz::Qux', 1);
        });
    });
    describe('fromStack', () => {
        test('fails when root is not a stage', () => {
            const c = new constructs_1.Construct(undefined, '');
            const stack = new core_1.Stack(c, 'MyStack');
            expect(() => lib_1.Template.fromStack(stack)).toThrow(/must be part of a Stage or an App/);
        });
    });
    describe('resourceCountIs', () => {
        test('resource exists', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Resource', {
                type: 'Foo::Bar',
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourceCountIs('Foo::Bar', 1);
            expect(() => inspect.resourceCountIs('Foo::Bar', 0)).toThrow('Expected 0 resources of type Foo::Bar but found 1');
            expect(() => inspect.resourceCountIs('Foo::Bar', 2)).toThrow('Expected 2 resources of type Foo::Bar but found 1');
            expect(() => inspect.resourceCountIs('Foo::Baz', 1)).toThrow('Expected 1 resources of type Foo::Baz but found 0');
        });
        test('no resource', () => {
            const stack = new core_1.Stack();
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourceCountIs('Foo::Bar', 0);
            expect(() => inspect.resourceCountIs('Foo::Bar', 1)).toThrow('Expected 1 resources of type Foo::Bar but found 0');
        });
    });
    describe('resourcePropertiesCountIs', () => {
        test('resource exists', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Resource', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 1);
            expect(() => {
                inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 0);
            }).toThrow('Expected 0 resources of type Foo::Bar but found 1');
            expect(() => {
                inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 2);
            }).toThrow('Expected 2 resources of type Foo::Bar but found 1');
            expect(() => {
                inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'nope' }, 1);
            }).toThrow('Expected 1 resources of type Foo::Bar but found 0');
            expect(() => {
                inspect.resourcePropertiesCountIs('Foo::Baz', { baz: 'qux' }, 1);
            }).toThrow('Expected 1 resources of type Foo::Baz but found 0');
        });
        test('no resource', () => {
            const stack = new core_1.Stack();
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 0);
            expect(() => {
                inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 1);
            }).toThrow('Expected 1 resources of type Foo::Bar but found 0');
        });
        test('absent - with properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', {
                bar: lib_1.Match.absent(),
            }, 1);
            inspect.resourcePropertiesCountIs('Foo::Bar', {
                baz: lib_1.Match.absent(),
            }, 0);
        });
        test('absent - no properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', {
                bar: lib_1.Match.absent(),
                baz: 'qux',
            }, 0);
            inspect.resourcePropertiesCountIs('Foo::Bar', lib_1.Match.absent(), 1);
        });
        test('not - with properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', lib_1.Match.not({
                baz: 'boo',
            }), 1);
        });
        test('not - no properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.resourcePropertiesCountIs('Foo::Bar', lib_1.Match.not({
                baz: 'qux',
            }), 1);
        });
    });
    describe('templateMatches', () => {
        test('matches', () => {
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'Stack', {
                synthesizer: new core_1.LegacyStackSynthesizer(),
            });
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.templateMatches({
                Resources: {
                    Foo: {
                        Type: 'Foo::Bar',
                        Properties: { baz: 'qux' },
                    },
                },
            });
        });
        test('fails', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.templateMatches({
                Resources: {
                    Foo: {
                        Type: 'Foo::Bar',
                        Properties: { baz: 'waldo' },
                    },
                },
            })).toThrowError(/Expected waldo but received qux/);
        });
    });
    describe('hasResource', () => {
        test('exact match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResource('Foo::Bar', {
                Properties: { baz: 'qux' },
            });
            expect(() => inspect.hasResource('Foo::Bar', {
                Properties: { baz: 'waldo' },
            })).toThrow(/Expected waldo but received qux/);
            expect(() => inspect.hasResource('Foo::Bar', {
                Properties: { baz: 'qux', fred: 'waldo' },
            })).toThrow(/Missing key/);
        });
        test('arrayWith', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: ['qux', 'quy'] },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResource('Foo::Bar', {
                Properties: { baz: lib_1.Match.arrayWith(['qux']) },
            });
            expect(() => inspect.hasResource('Foo::Bar', {
                Properties: { baz: lib_1.Match.arrayWith(['waldo']) },
            })).toThrow(/Could not match arrayWith pattern 0/);
        });
        test('arrayWith - multiple resources', async () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo1', {
                type: 'Foo::Bar',
                properties: { foo: ['flob', 'qux'] },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { flob: ['qux'] },
            });
            const inspect = lib_1.Template.fromStack(stack);
            await expectToThrow(() => {
                inspect.hasResource('Foo::Bar', {
                    Properties: lib_1.Match.arrayWith(['flob']),
                });
            }, [/closest matches/, /flob/, /qux/]);
        });
        test('objectLike', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ baz: 'qux' }),
            });
            inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ fred: 'waldo' }),
            });
            expect(() => inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ baz: 'waldo' }),
            })).toThrow(/Expected waldo but received qux/);
        });
        test('objectLike - multiple resources', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo1', {
                type: 'Foo::Bar',
                properties: { foo: { flob: 'qux' } },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { flob: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => {
                inspect.hasResource('Foo::Bar', {
                    Properties: lib_1.Match.objectLike({ foo: { flob: 'foo' } }),
                });
            }, [/closest match/, /"flob": "qux"/]);
        });
        test('absent', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ foo: lib_1.Match.absent() }),
            });
            expect(() => inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ baz: lib_1.Match.absent() }),
            })).toThrow(/key should be absent/);
        });
        test('incorrect types', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasResource('Foo::Baz', {
                Properties: lib_1.Match.objectLike({ baz: 'qux' }),
            })).toThrow(/0 resources with type Foo::Baz/);
        });
        test('capture', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Bar1', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', real: true },
            });
            new core_1.CfnResource(stack, 'Bar2', {
                type: 'Foo::Bar',
                properties: { baz: 'waldo', real: true },
            });
            new core_1.CfnResource(stack, 'Bar3', {
                type: 'Foo::Bar',
                properties: { baz: 'fred', real: false },
            });
            const capture = new lib_1.Capture();
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResource('Foo::Bar', {
                Properties: lib_1.Match.objectLike({ baz: capture, real: true }),
            });
            expect(capture.asString()).toEqual('qux');
            expect(capture.next()).toEqual(true);
            expect(capture.asString()).toEqual('waldo');
            expect(capture.next()).toEqual(false);
        });
    });
    describe('hasResourceProperties', () => {
        test('exact match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResourceProperties('Foo::Bar', { baz: 'qux' });
            expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'waldo' }))
                .toThrow(/Expected waldo but received qux/);
            expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'qux', fred: 'waldo' }))
                .toThrow(/Missing key/);
        });
        test('absent - with properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResourceProperties('Foo::Bar', {
                bar: lib_1.Match.absent(),
            });
            expect(() => inspect.hasResourceProperties('Foo::Bar', {
                baz: lib_1.Match.absent(),
            })).toThrow(/key should be absent/);
        });
        test('absent - no properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasResourceProperties('Foo::Bar', { bar: lib_1.Match.absent(), baz: 'qux' }))
                .toThrow(/Missing key/);
            inspect.hasResourceProperties('Foo::Bar', lib_1.Match.absent());
        });
        test('not - with properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResourceProperties('Foo::Bar', lib_1.Match.not({
                baz: 'boo',
            }));
        });
        test('not - no properties', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
            });
            const inspect = lib_1.Template.fromStack(stack);
            inspect.hasResourceProperties('Foo::Bar', lib_1.Match.not({ baz: 'qux' }));
        });
    });
    describe('getResources', () => {
        test('matching resource type', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.findResources('Foo::Bar')).toEqual({
                Foo: {
                    Type: 'Foo::Bar',
                    Properties: { baz: 'qux', fred: 'waldo' },
                },
            });
        });
        test('no matching resource type', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.findResources('Foo::Baz')).toEqual({});
        });
        test('matching resource props', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(Object.keys(inspect.findResources('Foo::Bar', {
                Properties: { baz: 'qux' },
            })).length).toEqual(1);
        });
        test('no matching resource props', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { baz: 'qux', fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.findResources('Foo::Bar', {
                Properties: { baz: 'waldo' },
            })).toEqual({});
        });
        test('multiple matching resources', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', { type: 'Foo::Bar' });
            new core_1.CfnResource(stack, 'Bar', { type: 'Foo::Bar' });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findResources('Foo::Bar');
            expect(Object.keys(result).length).toEqual(2);
            expect(result.Foo).toEqual({ Type: 'Foo::Bar' });
            expect(result.Bar).toEqual({ Type: 'Foo::Bar' });
        });
    });
    describe('allResources', () => {
        test('all resource of type match', () => {
            const stack = new core_1.Stack();
            const partialProps = { baz: 'qux', fred: 'waldo' };
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { ...partialProps, lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: partialProps,
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.allResources('Foo::Bar', { Properties: partialProps }));
        });
        test('no resources match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.allResources('Foo::Bar', { Properties: { fred: 'waldo' } }), [
                'Template has 2 resource(s) with type Foo::Bar, but none match as expected.',
                'The following resources do not match the given definition:',
                /Foo/,
                /Foo2/,
            ]);
        });
        test('some resources match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.allResources('Foo::Bar', { Properties: { lorem: 'ipsum' } }), [
                'Template has 2 resource(s) with type Foo::Bar, but only 1 match as expected.',
                'The following resources do not match the given definition:',
                /Foo2/,
            ]);
        });
        test('using a "not" matcher ', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'baz' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.allResources('Foo::Bar', lib_1.Match.not({ Properties: { baz: 'qux' } })));
        });
    });
    describe('allResourcesProperties', () => {
        test('all resource of type match', () => {
            const stack = new core_1.Stack();
            const partialProps = { baz: 'qux', fred: 'waldo' };
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { ...partialProps, lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: partialProps,
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.allResourcesProperties('Foo::Bar', partialProps));
        });
        test('no resources match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            new core_1.CfnResource(stack, 'NotFoo', {
                type: 'NotFoo::NotBar',
                properties: { fred: 'waldo' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.allResourcesProperties('Foo::Bar', { fred: 'waldo' }), [
                'Template has 2 resource(s) with type Foo::Bar, but none match as expected.',
                'The following resources do not match the given definition:',
                /Foo/,
                /Foo2/,
            ]);
        });
        test('some resources match', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'qux' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.allResourcesProperties('Foo::Bar', { lorem: 'ipsum' }), [
                'Template has 2 resource(s) with type Foo::Bar, but only 1 match as expected.',
                'The following resources do not match the given definition:',
                /Foo2/,
            ]);
        });
        test('using a "not" matcher ', () => {
            const stack = new core_1.Stack();
            new core_1.CfnResource(stack, 'Foo', {
                type: 'Foo::Bar',
                properties: { lorem: 'ipsum' },
            });
            new core_1.CfnResource(stack, 'Foo2', {
                type: 'Foo::Bar',
                properties: { baz: 'baz' },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(inspect.allResourcesProperties('Foo::Bar', lib_1.Match.not({ baz: 'qux' })));
        });
    });
    describe('hasOutput', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Bar',
            });
            new core_1.CfnOutput(stack, 'Fred', {
                value: 'Waldo',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasOutput('Foo', { Value: 'Bar' })).not.toThrow();
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Bar',
                exportName: 'ExportBar',
            });
            new core_1.CfnOutput(stack, 'Fred', {
                value: 'Waldo',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasOutput('Foo', {
                Value: 'Bar',
                Export: { Name: 'ExportBaz' },
            }), [
                /1 outputs named Foo/,
                /Expected ExportBaz but received ExportBar/,
            ]);
        });
        test('value not matching with outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Bar',
            });
            new core_1.CfnOutput(stack, 'Fred', {
                value: 'Baz',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasOutput('Fred', {
                Value: 'Bar',
            }), [
                /1 outputs named Fred/,
                /Expected Bar but received Baz/,
            ]);
        });
    });
    test('outputName not matching', () => {
        const stack = new core_1.Stack();
        new core_1.CfnOutput(stack, 'Foo', {
            value: 'Bar',
            exportName: 'ExportBar',
        });
        const inspect = lib_1.Template.fromStack(stack);
        expectToThrow(() => inspect.hasOutput('Fred', {
            Value: 'Bar',
            Export: { Name: 'ExportBar' },
        }), [
            /Template has 0 outputs named Fred./,
        ]);
    });
    describe('findOutputs', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Fred',
                description: 'FooFred',
            });
            new core_1.CfnOutput(stack, 'Bar', {
                value: 'Fred',
                description: 'BarFred',
            });
            new core_1.CfnOutput(stack, 'Baz', {
                value: 'Waldo',
                description: 'BazWaldo',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findOutputs('*', { Value: 'Fred' });
            expect(Object.keys(result).length).toEqual(2);
            expect(result.Foo).toEqual({ Value: 'Fred', Description: 'FooFred' });
            expect(result.Bar).toEqual({ Value: 'Fred', Description: 'BarFred' });
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Fred',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findOutputs('*', { Value: 'Waldo' });
            expect(Object.keys(result).length).toEqual(0);
        });
        test('matching specific output', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Fred',
            });
            new core_1.CfnOutput(stack, 'Baz', {
                value: 'Waldo',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findOutputs('Foo', { Value: 'Fred' });
            expect(result).toEqual({
                Foo: {
                    Value: 'Fred',
                },
            });
        });
        test('not matching specific output', () => {
            const stack = new core_1.Stack();
            new core_1.CfnOutput(stack, 'Foo', {
                value: 'Fred',
            });
            new core_1.CfnOutput(stack, 'Baz', {
                value: 'Waldo',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findOutputs('Foo', { Value: 'Waldo' });
            expect(Object.keys(result).length).toEqual(0);
        });
    });
    describe('hasMapping', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Bar: 'Lightning' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasMapping('*', { Foo: { Bar: 'Lightning' } })).not.toThrow();
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Fred', Baz: 'Waldo' },
                    Qux: { Bar: 'Fred' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Baz: 'Baz' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasMapping('*', {
                Foo: { Bar: 'Qux' },
            }), [
                /2 mappings/,
                /Expected Qux but received Fred/,
            ]);
        });
        test('matching specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Bar: 'Lightning' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasMapping('Foo', { Baz: { Bar: 'Qux' } })).not.toThrow();
        });
        test('not matching specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Fred', Baz: 'Waldo' },
                    Qux: { Bar: 'Fred' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Baz: 'Baz' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasMapping('Fred', {
                Foo: { Baz: 'Fred' },
            }), [
                /1 mappings/,
                /Expected Fred but received Baz/,
            ]);
        });
    });
    describe('findParameters', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findParameters('*', { Type: 'String' });
            expect(result).toEqual({
                p1: {
                    Description: 'string parameter',
                    Type: 'String',
                },
            });
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findParameters('*', { Type: 'Number' });
            expect(Object.keys(result).length).toEqual(0);
        });
        test('matching with specific parameter name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findParameters('p1', { Type: 'String' });
            expect(result).toEqual({
                p1: {
                    Description: 'string parameter',
                    Type: 'String',
                },
            });
        });
        test('not matching specific parameter name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findParameters('p3', { Type: 'String' });
            expect(Object.keys(result).length).toEqual(0);
        });
    });
    describe('hasParameter', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.findParameters('p3', { Type: 'String' })).not.toThrow();
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasParameter('*', { Type: 'CommaDelimitedList' }), [
                // Third parameter is automatically included as part of DefaultSynthesizer
                /3 parameters/,
                /Expected CommaDelimitedList but received String/,
            ]);
        });
        test('matching specific parameter name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.findParameters('p1', { Type: 'String' })).not.toThrow();
        });
        test('not matching specific parameter name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnParameter(stack, 'p1', {
                type: 'String',
                description: 'string parameter',
            });
            new core_1.CfnParameter(stack, 'p2', {
                type: 'Number',
                description: 'number parameter',
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasParameter('p2', { Type: 'CommaDelimitedList' }), [
                /1 parameter/,
                /Expected CommaDelimitedList but received Number/,
            ]);
        });
    });
    describe('findMappings', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Bar: 'Lightning' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findMappings('*', { Foo: { Bar: 'Lightning' } });
            expect(result).toEqual({
                Foo: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
                Fred: { Foo: { Bar: 'Lightning' } },
            });
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Fred', Baz: 'Waldo' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findMappings('*', { Foo: { Bar: 'Waldo' } });
            expect(Object.keys(result).length).toEqual(0);
        });
        test('matching with specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Bar: 'Lightning' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findMappings('Foo', { Foo: { Bar: 'Lightning' } });
            expect(result).toEqual({
                Foo: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
        });
        test('not matching specific output name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnMapping(stack, 'Foo', {
                mapping: {
                    Foo: { Bar: 'Lightning', Fred: 'Waldo' },
                    Baz: { Bar: 'Qux' },
                },
            });
            new core_1.CfnMapping(stack, 'Fred', {
                mapping: {
                    Foo: { Bar: 'Lightning' },
                },
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findMappings('Fred', { Baz: { Bar: 'Qux' } });
            expect(Object.keys(result).length).toEqual(0);
        });
    });
    describe('hasCondition', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasCondition('*', { 'Fn::Equals': ['Bar', 'Baz'] })).not.toThrow();
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            new core_1.CfnCondition(stack, 'Qux', {
                expression: core_1.Fn.conditionNot(core_1.Fn.conditionEquals('Quux', 'Quuz')),
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasCondition('*', {
                'Fn::Equals': ['Baz', 'Bar'],
            }), [
                /2 conditions/,
                /Missing key/,
            ]);
        });
        test('matching specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            expect(() => inspect.hasCondition('Foo', { 'Fn::Equals': ['Bar', 'Baz'] })).not.toThrow();
        });
        test('not matching specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Baz', 'Bar'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            expectToThrow(() => inspect.hasCondition('Foo', {
                'Fn::Equals': ['Bar', 'Baz'],
            }), [
                /1 conditions/,
                /Expected Baz but received Bar/,
            ]);
        });
    });
    describe('findConditions', () => {
        test('matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            new core_1.CfnCondition(stack, 'Qux', {
                expression: core_1.Fn.conditionNot(core_1.Fn.conditionEquals('Quux', 'Quuz')),
            });
            const inspect = lib_1.Template.fromStack(stack);
            const firstCondition = inspect.findConditions('Foo');
            expect(firstCondition).toEqual({
                Foo: {
                    'Fn::Equals': [
                        'Bar',
                        'Baz',
                    ],
                },
            });
            const secondCondition = inspect.findConditions('Qux');
            expect(secondCondition).toEqual({
                Qux: {
                    'Fn::Not': [
                        {
                            'Fn::Equals': [
                                'Quux',
                                'Quuz',
                            ],
                        },
                    ],
                },
            });
        });
        test('not matching', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findMappings('Bar');
            expect(Object.keys(result).length).toEqual(0);
        });
        test('matching with specific outputName', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findConditions('Foo', { 'Fn::Equals': ['Bar', 'Baz'] });
            expect(result).toEqual({
                Foo: {
                    'Fn::Equals': [
                        'Bar',
                        'Baz',
                    ],
                },
            });
        });
        test('not matching specific output name', () => {
            const stack = new core_1.Stack();
            new core_1.CfnCondition(stack, 'Foo', {
                expression: core_1.Fn.conditionEquals('Bar', 'Baz'),
            });
            const inspect = lib_1.Template.fromStack(stack);
            const result = inspect.findConditions('Foo', { 'Fn::Equals': ['Bar', 'Qux'] });
            expect(Object.keys(result).length).toEqual(0);
        });
    });
    test('throws when given a template with cyclic dependencies', () => {
        expect(() => {
            lib_1.Template.fromJSON({
                Resources: {
                    Res1: {
                        Type: 'Foo',
                        Properties: {
                            Thing: { Ref: 'Res2' },
                        },
                    },
                    Res2: {
                        Type: 'Foo',
                        DependsOn: ['Res1'],
                    },
                },
            });
        }).toThrow(/dependency cycle/);
    });
    test('does not throw when given a template with cyclic dependencies if check is skipped', () => {
        expect(() => {
            lib_1.Template.fromJSON({
                Resources: {
                    Res1: {
                        Type: 'Foo',
                        Properties: {
                            Thing: { Ref: 'Res2' },
                        },
                    },
                    Res2: {
                        Type: 'Foo',
                        DependsOn: ['Res1'],
                    },
                },
            }, {
                skipCyclicalDependenciesCheck: true,
            });
        }).not.toThrow(/dependency cycle/);
    });
});
function expectToThrow(fn, msgs) {
    try {
        fn();
        throw new Error('Function expected to throw, did not throw');
    }
    catch (error) {
        const message = error.message;
        const unmatching = msgs.filter(msg => {
            if (msg instanceof RegExp) {
                return !msg.test(message);
            }
            else {
                return !message.includes(msg);
            }
        });
        if (unmatching.length > 0) {
            throw new Error([
                `Error thrown did not contain expected messages: ${unmatching}`,
                `Received error: ${message}`,
            ].join('\n'));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlbXBsYXRlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBb0o7QUFDcEosMkNBQXVDO0FBQ3ZDLGdDQUFrRDtBQUVsRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLFFBQVEsR0FBRyxjQUFRLENBQUMsVUFBVSxDQUFDOzs7Ozs7O1FBT2pDLENBQUMsQ0FBQztRQUVOLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDaEMsU0FBUyxFQUFFO2dCQUNULEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsVUFBVTtvQkFDaEIsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRTtvQkFDUCxzQ0FBc0MsRUFBRSxLQUFLO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxLQUFLO2lCQUNYO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNoQyxTQUFTLEVBQUU7b0JBQ1QsR0FBRyxFQUFFO3dCQUNILElBQUksRUFBRSxVQUFVO3dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO3FCQUMzQjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRTtvQkFDUCxzQ0FBc0MsRUFBRSxLQUFLO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdkQsSUFBSSxrQkFBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEtBQUs7aUJBQ1g7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLFNBQVMsRUFBRTtvQkFDVCxHQUFHLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7cUJBQzNCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQ25CLE1BQU0sVUFBVSxHQUFHLGNBQVEsQ0FBQyxVQUFVLENBQUM7Ozs7Ozs7UUFPckMsQ0FBQyxDQUFDO1lBQ0osVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxzQkFBUyxDQUFDLFNBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUNqQyxJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1lBQ2xILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1lBRWxILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1FBQ3BILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7WUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1FBQ3BILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDakMsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWpFLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWpFLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbURBQW1ELENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFO2dCQUM1QyxHQUFHLEVBQUUsV0FBSyxDQUFDLE1BQU0sRUFBRTthQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRTtnQkFDNUMsR0FBRyxFQUFFLFdBQUssQ0FBQyxNQUFNLEVBQUU7YUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUU7Z0JBQzVDLEdBQUcsRUFBRSxXQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNuQixHQUFHLEVBQUUsS0FBSzthQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTixPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLFdBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7WUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLFdBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3RELEdBQUcsRUFBRSxLQUFLO2FBQ1gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1lBQy9CLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2FBQ2pCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxXQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN0RCxHQUFHLEVBQUUsS0FBSzthQUNYLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7WUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtnQkFDcEMsV0FBVyxFQUFFLElBQUksNkJBQXNCLEVBQUU7YUFDMUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztnQkFDdEIsU0FBUyxFQUFFO29CQUNULEdBQUcsRUFBRTt3QkFDSCxJQUFJLEVBQUUsVUFBVTt3QkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtxQkFDM0I7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7Z0JBQ25DLFNBQVMsRUFBRTtvQkFDVCxHQUFHLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7cUJBQzdCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQzNCLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7Z0JBQzlCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUMzQyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO2FBQzdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBRS9DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtnQkFDM0MsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQzFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUU7YUFDcEMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtnQkFDOUIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2FBQzlDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtnQkFDM0MsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO2FBQ2hELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7YUFDckMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTthQUM5QixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7b0JBQzlCLFVBQVUsRUFBRSxXQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3RDLENBQUMsQ0FBQztZQUNMLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTthQUMxQyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUM5QixVQUFVLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUM3QyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtnQkFDOUIsVUFBVSxFQUFFLFdBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDaEQsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUMzQyxVQUFVLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUMvQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTthQUNyQyxDQUFDLENBQUM7WUFDSCxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDOUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxQyxhQUFhLENBQUMsR0FBRyxFQUFFO2dCQUNqQixPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtvQkFDOUIsVUFBVSxFQUFFLFdBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztpQkFDdkQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUM5QixVQUFVLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzthQUN0RCxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7Z0JBQzNDLFVBQVUsRUFBRSxXQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO2FBQ3RELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtZQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQzFDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUMzQyxVQUFVLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUM3QyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7YUFDdkMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7YUFDekMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7YUFDekMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLEVBQUUsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUM5QixVQUFVLEVBQUUsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzNELENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDckMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7WUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFMUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDdEUsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFFOUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUNuRixPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRTtnQkFDeEMsR0FBRyxFQUFFLFdBQUssQ0FBQyxNQUFNLEVBQUU7YUFDcEIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3JELEdBQUcsRUFBRSxXQUFLLENBQUMsTUFBTSxFQUFFO2FBQ3BCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDekYsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTFCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxXQUFLLENBQUMsR0FBRyxDQUFDO2dCQUNsRCxHQUFHLEVBQUUsS0FBSzthQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1lBQy9CLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2FBQ2pCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxXQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQzFDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsVUFBVTtvQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2lCQUMxQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQzFDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDMUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRTtnQkFDbkQsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDMUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7YUFDN0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDcEQsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUVwRCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sWUFBWSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDbkQsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQ2hELENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFlBQVk7YUFDekIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTthQUMvQixDQUFDLENBQUM7WUFDSCxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFhLENBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUN6RTtnQkFDRSw0RUFBNEU7Z0JBQzVFLDREQUE0RDtnQkFDNUQsS0FBSztnQkFDTCxNQUFNO2FBQ1AsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQWEsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQzFFO2dCQUNFLDhFQUE4RTtnQkFDOUUsNERBQTREO2dCQUM1RCxNQUFNO2FBQ1AsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxXQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sWUFBWSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDbkQsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxHQUFHLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQ2hELENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLFlBQVk7YUFDekIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTthQUMvQixDQUFDLENBQUM7WUFDSCxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQy9CLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDOUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFhLENBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUNuRTtnQkFDRSw0RUFBNEU7Z0JBQzVFLDREQUE0RDtnQkFDNUQsS0FBSztnQkFDTCxNQUFNO2FBQ1AsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQWEsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQ3BFO2dCQUNFLDhFQUE4RTtnQkFDOUUsNERBQTREO2dCQUM1RCxNQUFNO2FBQ1AsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFdBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzNCLEtBQUssRUFBRSxPQUFPO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxLQUFLO2dCQUNaLFVBQVUsRUFBRSxXQUFXO2FBQ3hCLENBQUMsQ0FBQztZQUNILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUMzQixLQUFLLEVBQUUsT0FBTzthQUNmLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBYSxDQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUM3QixLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2FBQzlCLENBQUMsRUFDRjtnQkFDRSxxQkFBcUI7Z0JBQ3JCLDJDQUEyQzthQUM1QyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDMUIsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUM7WUFDSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDM0IsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQWEsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtnQkFDOUIsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDLEVBQ0Y7Z0JBQ0Usc0JBQXNCO2dCQUN0QiwrQkFBK0I7YUFDaEMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUMxQixLQUFLLEVBQUUsS0FBSztZQUNaLFVBQVUsRUFBRSxXQUFXO1NBQ3hCLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsYUFBYSxDQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQzlCLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtTQUM5QixDQUFDLEVBQ0Y7WUFDRSxvQ0FBb0M7U0FDckMsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUMxQixLQUFLLEVBQUUsTUFBTTtnQkFDYixXQUFXLEVBQUUsU0FBUzthQUN2QixDQUFDLENBQUM7WUFDSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDMUIsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsV0FBVyxFQUFFLFNBQVM7YUFDdkIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxPQUFPO2dCQUNkLFdBQVcsRUFBRSxVQUFVO2FBQ3hCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDMUIsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7WUFDSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDMUIsS0FBSyxFQUFFLE9BQU87YUFDZixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsR0FBRyxFQUFFO29CQUNILEtBQUssRUFBRSxNQUFNO2lCQUNkO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSxPQUFPO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDM0IsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtvQkFDeEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtpQkFDcEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUU7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7WUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDM0IsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtvQkFDbEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtpQkFDckI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7aUJBQ3BCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFhLENBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzVCLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7YUFDcEIsQ0FBQyxFQUNGO2dCQUNFLFlBQVk7Z0JBQ1osZ0NBQWdDO2FBQ2pDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksaUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUMzQixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO29CQUN4QyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUNILElBQUksaUJBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtpQkFDMUI7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxpQkFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzNCLE9BQU8sRUFBRTtvQkFDUCxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7b0JBQ2xDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7aUJBQ3JCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxpQkFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRTtvQkFDUCxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBYSxDQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUMvQixHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO2FBQ3JCLENBQUMsRUFDRjtnQkFDRSxZQUFZO2dCQUNaLGdDQUFnQzthQUNqQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM5QixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO2dCQUM1QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxXQUFXLEVBQUUsa0JBQWtCO2FBQ2hDLENBQUMsQ0FBQztZQUNILElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO2dCQUM1QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxXQUFXLEVBQUUsa0JBQWtCO2FBQ2hDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixFQUFFLEVBQUU7b0JBQ0YsV0FBVyxFQUFFLGtCQUFrQjtvQkFDL0IsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxrQkFBa0I7YUFDaEMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFDSCxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsRUFBRSxFQUFFO29CQUNGLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLElBQUksRUFBRSxRQUFRO2lCQUNmO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxrQkFBa0I7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxrQkFBa0I7YUFDaEMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFDSCxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7WUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFDSCxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQWEsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxDQUFDLEVBQy9EO2dCQUNFLDBFQUEwRTtnQkFDMUUsY0FBYztnQkFDZCxpREFBaUQ7YUFDbEQsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxrQkFBa0I7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxrQkFBa0I7YUFDaEMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFDSCxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQWEsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxDQUFDLEVBQ2hFO2dCQUNFLGFBQWE7Z0JBQ2IsaURBQWlEO2FBQ2xELENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksaUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUMzQixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO29CQUN4QyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUNILElBQUksaUJBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtpQkFDMUI7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixHQUFHLEVBQUU7b0JBQ0gsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO29CQUN4QyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2lCQUNwQjtnQkFDRCxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLEVBQUU7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksaUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUMzQixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO2lCQUNuQzthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDM0IsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtvQkFDeEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtpQkFDcEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUU7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsR0FBRyxFQUFFO29CQUNILEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtvQkFDeEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtpQkFDcEI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDM0IsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtvQkFDeEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtpQkFDcEI7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFJLGlCQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUU7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM3QixVQUFVLEVBQUUsU0FBRSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsWUFBWSxDQUFDLFNBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2hFLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBYSxDQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFO2dCQUM5QixZQUFZLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2FBQzdCLENBQUMsRUFDRjtnQkFDRSxjQUFjO2dCQUNkLGFBQWE7YUFDZCxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDN0IsVUFBVSxFQUFFLFNBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQzthQUM3QyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFhLENBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7YUFDN0IsQ0FBQyxFQUNGO2dCQUNFLGNBQWM7Z0JBQ2QsK0JBQStCO2FBQ2hDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsWUFBWSxDQUFDLFNBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2hFLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM3QixHQUFHLEVBQUU7b0JBQ0gsWUFBWSxFQUFFO3dCQUNaLEtBQUs7d0JBQ0wsS0FBSztxQkFDTjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsR0FBRyxFQUFFO29CQUNILFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxZQUFZLEVBQUU7Z0NBQ1osTUFBTTtnQ0FDTixNQUFNOzZCQUNQO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM3QixVQUFVLEVBQUUsU0FBRSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxtQkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQzdCLFVBQVUsRUFBRSxTQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsR0FBRyxFQUFFO29CQUNILFlBQVksRUFBRTt3QkFDWixLQUFLO3dCQUNMLEtBQUs7cUJBQ047aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDN0IsVUFBVSxFQUFFLFNBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQzthQUM3QyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLGNBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLEtBQUs7d0JBQ1gsVUFBVSxFQUFFOzRCQUNWLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7eUJBQ3ZCO3FCQUNGO29CQUNELElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsS0FBSzt3QkFDWCxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7cUJBQ3BCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUZBQW1GLEVBQUUsR0FBRyxFQUFFO1FBQzdGLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixjQUFRLENBQUMsUUFBUSxDQUFDO2dCQUNoQixTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRSxLQUFLO3dCQUNYLFVBQVUsRUFBRTs0QkFDVixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO3lCQUN2QjtxQkFDRjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLEtBQUs7d0JBQ1gsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO3FCQUNwQjtpQkFDRjthQUNGLEVBQUU7Z0JBQ0QsNkJBQTZCLEVBQUUsSUFBSTthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsYUFBYSxDQUFDLEVBQWMsRUFBRSxJQUF5QjtJQUM5RCxJQUFJO1FBQ0YsRUFBRSxFQUFFLENBQUM7UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7S0FDOUQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE1BQU0sT0FBTyxHQUFJLEtBQWUsQ0FBQyxPQUFPLENBQUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuQyxJQUFJLEdBQUcsWUFBWSxNQUFNLEVBQUU7Z0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzNCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQy9CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUM7Z0JBQ2QsbURBQW1ELFVBQVUsRUFBRTtnQkFDL0QsbUJBQW1CLE9BQU8sRUFBRTthQUM3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbkNvbmRpdGlvbiwgQ2ZuTWFwcGluZywgQ2ZuT3V0cHV0LCBDZm5QYXJhbWV0ZXIsIENmblJlc291cmNlLCBGbiwgTGVnYWN5U3RhY2tTeW50aGVzaXplciwgTmVzdGVkU3RhY2ssIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENhcHR1cmUsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdUZW1wbGF0ZScsICgpID0+IHtcbiAgdGVzdCgnZnJvbVN0cmluZycsICgpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdHJpbmcoYHtcbiAgICAgICAgXCJSZXNvdXJjZXNcIjoge1xuICAgICAgICAgIFwiRm9vXCI6IHtcbiAgICAgICAgICAgIFwiVHlwZVwiOiBcIkJhejo6UXV4XCIsXG4gICAgICAgICAgICBcIlByb3BlcnRpZXNcIjogeyBcIkZyZWRcIjogXCJXYWxkb1wiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1gKTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZS50b0pTT04oKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgRm9vOiB7XG4gICAgICAgICAgVHlwZTogJ0Jhejo6UXV4JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7IEZyZWQ6ICdXYWxkbycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tU3RhY2snLCAoKSA9PiB7XG4gICAgdGVzdCgnZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgJ0Bhd3MtY2RrL2NvcmU6bmV3U3R5bGVTdGFja1N5bnRoZXNpcyc6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgQmF6OiAnUXV4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICBleHBlY3QodGVtcGxhdGUudG9KU09OKCkpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBGb286IHtcbiAgICAgICAgICAgIFR5cGU6ICdGb286OkJhcicsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IEJhejogJ1F1eCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ015TmVzdGVkU3RhY2snKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQsICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBCYXo6ICdRdXgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpO1xuXG4gICAgICBleHBlY3QodGVtcGxhdGUudG9KU09OKCkpLnRvRXF1YWwoe1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBGb286IHtcbiAgICAgICAgICAgIFR5cGU6ICdGb286OkJhcicsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IEJhejogJ1F1eCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tU3RyaW5nJywgKCkgPT4ge1xuICAgIHRlc3QoJ2RlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhc3NlcnRpb25zID0gVGVtcGxhdGUuZnJvbVN0cmluZyhge1xuICAgICAgICBcIlJlc291cmNlc1wiOiB7XG4gICAgICAgICAgXCJGb29cIjoge1xuICAgICAgICAgICAgXCJUeXBlXCI6IFwiQmF6OjpRdXhcIixcbiAgICAgICAgICAgIFwiUHJvcGVydGllc1wiOiB7IFwiRnJlZFwiOiBcIldhbGRvXCIgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfWApO1xuICAgICAgYXNzZXJ0aW9ucy5yZXNvdXJjZUNvdW50SXMoJ0Jhejo6UXV4JywgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tU3RhY2snLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFpbHMgd2hlbiByb290IGlzIG5vdCBhIHN0YWdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYyA9IG5ldyBDb25zdHJ1Y3QodW5kZWZpbmVkIGFzIGFueSwgJycpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYywgJ015U3RhY2snKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spKS50b1Rocm93KC9tdXN0IGJlIHBhcnQgb2YgYSBTdGFnZSBvciBhbiBBcHAvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Jlc291cmNlQ291bnRJcycsICgpID0+IHtcbiAgICB0ZXN0KCdyZXNvdXJjZSBleGlzdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlQ291bnRJcygnRm9vOjpCYXInLCAxKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QucmVzb3VyY2VDb3VudElzKCdGb286OkJhcicsIDApKS50b1Rocm93KCdFeHBlY3RlZCAwIHJlc291cmNlcyBvZiB0eXBlIEZvbzo6QmFyIGJ1dCBmb3VuZCAxJyk7XG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5yZXNvdXJjZUNvdW50SXMoJ0Zvbzo6QmFyJywgMikpLnRvVGhyb3coJ0V4cGVjdGVkIDIgcmVzb3VyY2VzIG9mIHR5cGUgRm9vOjpCYXIgYnV0IGZvdW5kIDEnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QucmVzb3VyY2VDb3VudElzKCdGb286OkJheicsIDEpKS50b1Rocm93KCdFeHBlY3RlZCAxIHJlc291cmNlcyBvZiB0eXBlIEZvbzo6QmF6IGJ1dCBmb3VuZCAwJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyByZXNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5yZXNvdXJjZUNvdW50SXMoJ0Zvbzo6QmFyJywgMCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBpbnNwZWN0LnJlc291cmNlQ291bnRJcygnRm9vOjpCYXInLCAxKSkudG9UaHJvdygnRXhwZWN0ZWQgMSByZXNvdXJjZXMgb2YgdHlwZSBGb286OkJhciBidXQgZm91bmQgMCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcycsICgpID0+IHtcbiAgICB0ZXN0KCdyZXNvdXJjZSBleGlzdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5yZXNvdXJjZVByb3BlcnRpZXNDb3VudElzKCdGb286OkJhcicsIHsgYmF6OiAncXV4JyB9LCAxKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgaW5zcGVjdC5yZXNvdXJjZVByb3BlcnRpZXNDb3VudElzKCdGb286OkJhcicsIHsgYmF6OiAncXV4JyB9LCAwKTtcbiAgICAgIH0pLnRvVGhyb3coJ0V4cGVjdGVkIDAgcmVzb3VyY2VzIG9mIHR5cGUgRm9vOjpCYXIgYnV0IGZvdW5kIDEnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGluc3BlY3QucmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcygnRm9vOjpCYXInLCB7IGJhejogJ3F1eCcgfSwgMik7XG4gICAgICB9KS50b1Rocm93KCdFeHBlY3RlZCAyIHJlc291cmNlcyBvZiB0eXBlIEZvbzo6QmFyIGJ1dCBmb3VuZCAxJyk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywgeyBiYXo6ICdub3BlJyB9LCAxKTtcbiAgICAgIH0pLnRvVGhyb3coJ0V4cGVjdGVkIDEgcmVzb3VyY2VzIG9mIHR5cGUgRm9vOjpCYXIgYnV0IGZvdW5kIDAnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGluc3BlY3QucmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcygnRm9vOjpCYXonLCB7IGJhejogJ3F1eCcgfSwgMSk7XG4gICAgICB9KS50b1Rocm93KCdFeHBlY3RlZCAxIHJlc291cmNlcyBvZiB0eXBlIEZvbzo6QmF6IGJ1dCBmb3VuZCAwJyk7XG4gICAgfSk7XG4gICAgdGVzdCgnbm8gcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGluc3BlY3QucmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcygnRm9vOjpCYXInLCB7IGJhejogJ3F1eCcgfSwgMCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGluc3BlY3QucmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcygnRm9vOjpCYXInLCB7IGJhejogJ3F1eCcgfSwgMSk7XG4gICAgICB9KS50b1Rocm93KCdFeHBlY3RlZCAxIHJlc291cmNlcyBvZiB0eXBlIEZvbzo6QmFyIGJ1dCBmb3VuZCAwJyk7XG4gICAgfSk7XG4gICAgdGVzdCgnYWJzZW50IC0gd2l0aCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdxdXgnIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywge1xuICAgICAgICBiYXI6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSwgMSk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywge1xuICAgICAgICBiYXo6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSwgMCk7XG4gICAgfSk7XG4gICAgdGVzdCgnYWJzZW50IC0gbm8gcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywge1xuICAgICAgICBiYXI6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBiYXo6ICdxdXgnLFxuICAgICAgfSwgMCk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywgTWF0Y2guYWJzZW50KCksIDEpO1xuICAgIH0pO1xuICAgIHRlc3QoJ25vdCAtIHdpdGggcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5yZXNvdXJjZVByb3BlcnRpZXNDb3VudElzKCdGb286OkJhcicsIE1hdGNoLm5vdCh7XG4gICAgICAgIGJhejogJ2JvbycsXG4gICAgICB9KSwgMSk7XG4gICAgfSk7XG4gICAgdGVzdCgnbm90IC0gbm8gcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBpbnNwZWN0LnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0Zvbzo6QmFyJywgTWF0Y2gubm90KHtcbiAgICAgICAgYmF6OiAncXV4JyxcbiAgICAgIH0pLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RlbXBsYXRlTWF0Y2hlcycsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgICAgIHN5bnRoZXNpemVyOiBuZXcgTGVnYWN5U3RhY2tTeW50aGVzaXplcigpLFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICBGb286IHtcbiAgICAgICAgICAgIFR5cGU6ICdGb286OkJhcicsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgRm9vOiB7XG4gICAgICAgICAgICBUeXBlOiAnRm9vOjpCYXInLFxuICAgICAgICAgICAgUHJvcGVydGllczogeyBiYXo6ICd3YWxkbycgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpLnRvVGhyb3dFcnJvcigvRXhwZWN0ZWQgd2FsZG8gYnV0IHJlY2VpdmVkIHF1eC8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzUmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnZXhhY3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNSZXNvdXJjZSgnRm9vOjpCYXInLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IHsgYmF6OiAnd2FsZG8nIH0sXG4gICAgICB9KSkudG9UaHJvdygvRXhwZWN0ZWQgd2FsZG8gYnV0IHJlY2VpdmVkIHF1eC8pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNSZXNvdXJjZSgnRm9vOjpCYXInLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IHsgYmF6OiAncXV4JywgZnJlZDogJ3dhbGRvJyB9LFxuICAgICAgfSkpLnRvVGhyb3coL01pc3Npbmcga2V5Lyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcnJheVdpdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogWydxdXgnLCAncXV5J10gfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7IGJhejogTWF0Y2guYXJyYXlXaXRoKFsncXV4J10pIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7IGJhejogTWF0Y2guYXJyYXlXaXRoKFsnd2FsZG8nXSkgfSxcbiAgICAgIH0pKS50b1Rocm93KC9Db3VsZCBub3QgbWF0Y2ggYXJyYXlXaXRoIHBhdHRlcm4gMC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXJyYXlXaXRoIC0gbXVsdGlwbGUgcmVzb3VyY2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbzEnLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgZm9vOiBbJ2Zsb2InLCAncXV4J10gfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vMicsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBmbG9iOiBbJ3F1eCddIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgIGF3YWl0IGV4cGVjdFRvVGhyb3coKCkgPT4ge1xuICAgICAgICBpbnNwZWN0Lmhhc1Jlc291cmNlKCdGb286OkJhcicsIHtcbiAgICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5hcnJheVdpdGgoWydmbG9iJ10pLFxuICAgICAgICB9KTtcbiAgICAgIH0sIFsvY2xvc2VzdCBtYXRjaGVzLywgL2Zsb2IvLCAvcXV4L10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb2JqZWN0TGlrZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JywgZnJlZDogJ3dhbGRvJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5oYXNSZXNvdXJjZSgnRm9vOjpCYXInLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLm9iamVjdExpa2UoeyBiYXo6ICdxdXgnIH0pLFxuICAgICAgfSk7XG4gICAgICBpbnNwZWN0Lmhhc1Jlc291cmNlKCdGb286OkJhcicsIHtcbiAgICAgICAgUHJvcGVydGllczogTWF0Y2gub2JqZWN0TGlrZSh7IGZyZWQ6ICd3YWxkbycgfSksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5vYmplY3RMaWtlKHsgYmF6OiAnd2FsZG8nIH0pLFxuICAgICAgfSkpLnRvVGhyb3coL0V4cGVjdGVkIHdhbGRvIGJ1dCByZWNlaXZlZCBxdXgvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29iamVjdExpa2UgLSBtdWx0aXBsZSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vMScsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBmb286IHsgZmxvYjogJ3F1eCcgfSB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28yJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGZsb2I6ICd3YWxkbycgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgZXhwZWN0VG9UaHJvdygoKSA9PiB7XG4gICAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLm9iamVjdExpa2UoeyBmb286IHsgZmxvYjogJ2ZvbycgfSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LCBbL2Nsb3Nlc3QgbWF0Y2gvLCAvXCJmbG9iXCI6IFwicXV4XCIvXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhYnNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiBNYXRjaC5hYnNlbnQoKSB9KSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzUmVzb3VyY2UoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5vYmplY3RMaWtlKHsgYmF6OiBNYXRjaC5hYnNlbnQoKSB9KSxcbiAgICAgIH0pKS50b1Rocm93KC9rZXkgc2hvdWxkIGJlIGFic2VudC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW5jb3JyZWN0IHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdxdXgnLCBmcmVkOiAnd2FsZG8nIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNSZXNvdXJjZSgnRm9vOjpCYXonLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLm9iamVjdExpa2UoeyBiYXo6ICdxdXgnIH0pLFxuICAgICAgfSkpLnRvVGhyb3coLzAgcmVzb3VyY2VzIHdpdGggdHlwZSBGb286OkJhei8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FwdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdCYXIxJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcsIHJlYWw6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnQmFyMicsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICd3YWxkbycsIHJlYWw6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnQmFyMycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdmcmVkJywgcmVhbDogZmFsc2UgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjYXB0dXJlID0gbmV3IENhcHR1cmUoKTtcbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5oYXNSZXNvdXJjZSgnRm9vOjpCYXInLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLm9iamVjdExpa2UoeyBiYXo6IGNhcHR1cmUsIHJlYWw6IHRydWUgfSksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGNhcHR1cmUuYXNTdHJpbmcoKSkudG9FcXVhbCgncXV4Jyk7XG4gICAgICBleHBlY3QoY2FwdHVyZS5uZXh0KCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICBleHBlY3QoY2FwdHVyZS5hc1N0cmluZygpKS50b0VxdWFsKCd3YWxkbycpO1xuICAgICAgZXhwZWN0KGNhcHR1cmUubmV4dCgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc1Jlc291cmNlUHJvcGVydGllcycsICgpID0+IHtcbiAgICB0ZXN0KCdleGFjdCBtYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0Zvbzo6QmFyJywgeyBiYXo6ICdxdXgnIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0Zvbzo6QmFyJywgeyBiYXo6ICd3YWxkbycgfSkpXG4gICAgICAgIC50b1Rocm93KC9FeHBlY3RlZCB3YWxkbyBidXQgcmVjZWl2ZWQgcXV4Lyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBpbnNwZWN0Lmhhc1Jlc291cmNlUHJvcGVydGllcygnRm9vOjpCYXInLCB7IGJhejogJ3F1eCcsIGZyZWQ6ICd3YWxkbycgfSkpXG4gICAgICAgIC50b1Rocm93KC9NaXNzaW5nIGtleS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWJzZW50IC0gd2l0aCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdxdXgnIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdGb286OkJhcicsIHtcbiAgICAgICAgYmFyOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0Zvbzo6QmFyJywge1xuICAgICAgICBiYXo6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSkpLnRvVGhyb3coL2tleSBzaG91bGQgYmUgYWJzZW50Lyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhYnNlbnQgLSBubyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdGb286OkJhcicsIHsgYmFyOiBNYXRjaC5hYnNlbnQoKSwgYmF6OiAncXV4JyB9KSlcbiAgICAgICAgLnRvVGhyb3coL01pc3Npbmcga2V5Lyk7XG5cbiAgICAgIGluc3BlY3QuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdGb286OkJhcicsIE1hdGNoLmFic2VudCgpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCAtIHdpdGggcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0Zvbzo6QmFyJywgTWF0Y2gubm90KHtcbiAgICAgICAgYmF6OiAnYm9vJyxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCAtIG5vIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgaW5zcGVjdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0Zvbzo6QmFyJywgTWF0Y2gubm90KHsgYmF6OiAncXV4JyB9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRSZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2hpbmcgcmVzb3VyY2UgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JywgZnJlZDogJ3dhbGRvJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KGluc3BlY3QuZmluZFJlc291cmNlcygnRm9vOjpCYXInKSkudG9FcXVhbCh7XG4gICAgICAgIEZvbzoge1xuICAgICAgICAgIFR5cGU6ICdGb286OkJhcicsXG4gICAgICAgICAgUHJvcGVydGllczogeyBiYXo6ICdxdXgnLCBmcmVkOiAnd2FsZG8nIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vIG1hdGNoaW5nIHJlc291cmNlIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcsIGZyZWQ6ICd3YWxkbycgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdChpbnNwZWN0LmZpbmRSZXNvdXJjZXMoJ0Zvbzo6QmF6JykpLnRvRXF1YWwoe30pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0Y2hpbmcgcmVzb3VyY2UgcHJvcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcsIGZyZWQ6ICd3YWxkbycgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhpbnNwZWN0LmZpbmRSZXNvdXJjZXMoJ0Zvbzo6QmFyJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgIH0pKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBtYXRjaGluZyByZXNvdXJjZSBwcm9wcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JywgZnJlZDogJ3dhbGRvJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KGluc3BlY3QuZmluZFJlc291cmNlcygnRm9vOjpCYXInLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IHsgYmF6OiAnd2FsZG8nIH0sXG4gICAgICB9KSkudG9FcXVhbCh7fSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtdWx0aXBsZSBtYXRjaGluZyByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywgeyB0eXBlOiAnRm9vOjpCYXInIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnQmFyJywgeyB0eXBlOiAnRm9vOjpCYXInIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZFJlc291cmNlcygnRm9vOjpCYXInKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuRm9vKS50b0VxdWFsKHsgVHlwZTogJ0Zvbzo6QmFyJyB9KTtcbiAgICAgIGV4cGVjdChyZXN1bHQuQmFyKS50b0VxdWFsKHsgVHlwZTogJ0Zvbzo6QmFyJyB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FsbFJlc291cmNlcycsICgpID0+IHtcbiAgICB0ZXN0KCdhbGwgcmVzb3VyY2Ugb2YgdHlwZSBtYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwYXJ0aWFsUHJvcHMgPSB7IGJhejogJ3F1eCcsIGZyZWQ6ICd3YWxkbycgfTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyAuLi5wYXJ0aWFsUHJvcHMsIGxvcmVtOiAnaXBzdW0nIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbzInLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHBhcnRpYWxQcm9wcyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdChpbnNwZWN0LmFsbFJlc291cmNlcygnRm9vOjpCYXInLCB7IFByb3BlcnRpZXM6IHBhcnRpYWxQcm9wcyB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyByZXNvdXJjZXMgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGxvcmVtOiAnaXBzdW0nIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbzInLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICAgKCkgPT4gaW5zcGVjdC5hbGxSZXNvdXJjZXMoJ0Zvbzo6QmFyJywgeyBQcm9wZXJ0aWVzOiB7IGZyZWQ6ICd3YWxkbycgfSB9KSxcbiAgICAgICAgW1xuICAgICAgICAgICdUZW1wbGF0ZSBoYXMgMiByZXNvdXJjZShzKSB3aXRoIHR5cGUgRm9vOjpCYXIsIGJ1dCBub25lIG1hdGNoIGFzIGV4cGVjdGVkLicsXG4gICAgICAgICAgJ1RoZSBmb2xsb3dpbmcgcmVzb3VyY2VzIGRvIG5vdCBtYXRjaCB0aGUgZ2l2ZW4gZGVmaW5pdGlvbjonLFxuICAgICAgICAgIC9Gb28vLFxuICAgICAgICAgIC9Gb28yLyxcbiAgICAgICAgXSxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzb21lIHJlc291cmNlcyBtYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgbG9yZW06ICdpcHN1bScgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vMicsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdxdXgnIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3RUb1Rocm93KFxuICAgICAgICAoKSA9PiBpbnNwZWN0LmFsbFJlc291cmNlcygnRm9vOjpCYXInLCB7IFByb3BlcnRpZXM6IHsgbG9yZW06ICdpcHN1bScgfSB9KSxcbiAgICAgICAgW1xuICAgICAgICAgICdUZW1wbGF0ZSBoYXMgMiByZXNvdXJjZShzKSB3aXRoIHR5cGUgRm9vOjpCYXIsIGJ1dCBvbmx5IDEgbWF0Y2ggYXMgZXhwZWN0ZWQuJyxcbiAgICAgICAgICAnVGhlIGZvbGxvd2luZyByZXNvdXJjZXMgZG8gbm90IG1hdGNoIHRoZSBnaXZlbiBkZWZpbml0aW9uOicsXG4gICAgICAgICAgL0ZvbzIvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3VzaW5nIGEgXCJub3RcIiBtYXRjaGVyICcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgbG9yZW06ICdpcHN1bScgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vMicsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBiYXo6ICdiYXonIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoaW5zcGVjdC5hbGxSZXNvdXJjZXMoJ0Zvbzo6QmFyJywgTWF0Y2gubm90KHsgUHJvcGVydGllczogeyBiYXo6ICdxdXgnIH0gfSkpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FsbFJlc291cmNlc1Byb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYWxsIHJlc291cmNlIG9mIHR5cGUgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcGFydGlhbFByb3BzID0geyBiYXo6ICdxdXgnLCBmcmVkOiAnd2FsZG8nIH07XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgLi4ucGFydGlhbFByb3BzLCBsb3JlbTogJ2lwc3VtJyB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28yJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiBwYXJ0aWFsUHJvcHMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoaW5zcGVjdC5hbGxSZXNvdXJjZXNQcm9wZXJ0aWVzKCdGb286OkJhcicsIHBhcnRpYWxQcm9wcykpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm8gcmVzb3VyY2VzIG1hdGNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgICAgcHJvcGVydGllczogeyBsb3JlbTogJ2lwc3VtJyB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGb28yJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGJhejogJ3F1eCcgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnTm90Rm9vJywge1xuICAgICAgICB0eXBlOiAnTm90Rm9vOjpOb3RCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGZyZWQ6ICd3YWxkbycgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdFRvVGhyb3coXG4gICAgICAgICgpID0+IGluc3BlY3QuYWxsUmVzb3VyY2VzUHJvcGVydGllcygnRm9vOjpCYXInLCB7IGZyZWQ6ICd3YWxkbycgfSksXG4gICAgICAgIFtcbiAgICAgICAgICAnVGVtcGxhdGUgaGFzIDIgcmVzb3VyY2Uocykgd2l0aCB0eXBlIEZvbzo6QmFyLCBidXQgbm9uZSBtYXRjaCBhcyBleHBlY3RlZC4nLFxuICAgICAgICAgICdUaGUgZm9sbG93aW5nIHJlc291cmNlcyBkbyBub3QgbWF0Y2ggdGhlIGdpdmVuIGRlZmluaXRpb246JyxcbiAgICAgICAgICAvRm9vLyxcbiAgICAgICAgICAvRm9vMi8sXG4gICAgICAgIF0sXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc29tZSByZXNvdXJjZXMgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGxvcmVtOiAnaXBzdW0nIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbzInLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAncXV4JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICAgKCkgPT4gaW5zcGVjdC5hbGxSZXNvdXJjZXNQcm9wZXJ0aWVzKCdGb286OkJhcicsIHsgbG9yZW06ICdpcHN1bScgfSksXG4gICAgICAgIFtcbiAgICAgICAgICAnVGVtcGxhdGUgaGFzIDIgcmVzb3VyY2Uocykgd2l0aCB0eXBlIEZvbzo6QmFyLCBidXQgb25seSAxIG1hdGNoIGFzIGV4cGVjdGVkLicsXG4gICAgICAgICAgJ1RoZSBmb2xsb3dpbmcgcmVzb3VyY2VzIGRvIG5vdCBtYXRjaCB0aGUgZ2l2ZW4gZGVmaW5pdGlvbjonLFxuICAgICAgICAgIC9Gb28yLyxcbiAgICAgICAgXSxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd1c2luZyBhIFwibm90XCIgbWF0Y2hlciAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgICB0eXBlOiAnRm9vOjpCYXInLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGxvcmVtOiAnaXBzdW0nIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0ZvbzInLCB7XG4gICAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgYmF6OiAnYmF6JyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KGluc3BlY3QuYWxsUmVzb3VyY2VzUHJvcGVydGllcygnRm9vOjpCYXInLCBNYXRjaC5ub3QoeyBiYXo6ICdxdXgnIH0pKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNPdXRwdXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2hpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdmFsdWU6ICdCYXInLFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnRnJlZCcsIHtcbiAgICAgICAgdmFsdWU6ICdXYWxkbycsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNPdXRwdXQoJ0ZvbycsIHsgVmFsdWU6ICdCYXInIH0pKS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm90IG1hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHZhbHVlOiAnQmFyJyxcbiAgICAgICAgZXhwb3J0TmFtZTogJ0V4cG9ydEJhcicsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdGcmVkJywge1xuICAgICAgICB2YWx1ZTogJ1dhbGRvJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdFRvVGhyb3coXG4gICAgICAgICgpID0+IGluc3BlY3QuaGFzT3V0cHV0KCdGb28nLCB7XG4gICAgICAgICAgVmFsdWU6ICdCYXInLFxuICAgICAgICAgIEV4cG9ydDogeyBOYW1lOiAnRXhwb3J0QmF6JyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgW1xuICAgICAgICAgIC8xIG91dHB1dHMgbmFtZWQgRm9vLyxcbiAgICAgICAgICAvRXhwZWN0ZWQgRXhwb3J0QmF6IGJ1dCByZWNlaXZlZCBFeHBvcnRCYXIvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZhbHVlIG5vdCBtYXRjaGluZyB3aXRoIG91dHB1dE5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdmFsdWU6ICdCYXInLFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnRnJlZCcsIHtcbiAgICAgICAgdmFsdWU6ICdCYXonLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICAgKCkgPT4gaW5zcGVjdC5oYXNPdXRwdXQoJ0ZyZWQnLCB7XG4gICAgICAgICAgVmFsdWU6ICdCYXInLFxuICAgICAgICB9KSxcbiAgICAgICAgW1xuICAgICAgICAgIC8xIG91dHB1dHMgbmFtZWQgRnJlZC8sXG4gICAgICAgICAgL0V4cGVjdGVkIEJhciBidXQgcmVjZWl2ZWQgQmF6LyxcbiAgICAgICAgXSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ291dHB1dE5hbWUgbm90IG1hdGNoaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0ZvbycsIHtcbiAgICAgIHZhbHVlOiAnQmFyJyxcbiAgICAgIGV4cG9ydE5hbWU6ICdFeHBvcnRCYXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICgpID0+IGluc3BlY3QuaGFzT3V0cHV0KCdGcmVkJywge1xuICAgICAgICBWYWx1ZTogJ0JhcicsXG4gICAgICAgIEV4cG9ydDogeyBOYW1lOiAnRXhwb3J0QmFyJyB9LFxuICAgICAgfSksXG4gICAgICBbXG4gICAgICAgIC9UZW1wbGF0ZSBoYXMgMCBvdXRwdXRzIG5hbWVkIEZyZWQuLyxcbiAgICAgIF0sXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRPdXRwdXRzJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHZhbHVlOiAnRnJlZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRm9vRnJlZCcsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdCYXInLCB7XG4gICAgICAgIHZhbHVlOiAnRnJlZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQmFyRnJlZCcsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdCYXonLCB7XG4gICAgICAgIHZhbHVlOiAnV2FsZG8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0JheldhbGRvJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZE91dHB1dHMoJyonLCB7IFZhbHVlOiAnRnJlZCcgfSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QocmVzdWx0LkZvbykudG9FcXVhbCh7IFZhbHVlOiAnRnJlZCcsIERlc2NyaXB0aW9uOiAnRm9vRnJlZCcgfSk7XG4gICAgICBleHBlY3QocmVzdWx0LkJhcikudG9FcXVhbCh7IFZhbHVlOiAnRnJlZCcsIERlc2NyaXB0aW9uOiAnQmFyRnJlZCcgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdmFsdWU6ICdGcmVkJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZE91dHB1dHMoJyonLCB7IFZhbHVlOiAnV2FsZG8nIH0pO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0Y2hpbmcgc3BlY2lmaWMgb3V0cHV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIHZhbHVlOiAnRnJlZCcsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdCYXonLCB7XG4gICAgICAgIHZhbHVlOiAnV2FsZG8nLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zcGVjdC5maW5kT3V0cHV0cygnRm9vJywgeyBWYWx1ZTogJ0ZyZWQnIH0pO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIEZvbzoge1xuICAgICAgICAgIFZhbHVlOiAnRnJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCBtYXRjaGluZyBzcGVjaWZpYyBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgdmFsdWU6ICdGcmVkJyxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjaywgJ0JheicsIHtcbiAgICAgICAgdmFsdWU6ICdXYWxkbycsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBjb25zdCByZXN1bHQgPSBpbnNwZWN0LmZpbmRPdXRwdXRzKCdGb28nLCB7IFZhbHVlOiAnV2FsZG8nIH0pO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzTWFwcGluZycsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdMaWdodG5pbmcnLCBGcmVkOiAnV2FsZG8nIH0sXG4gICAgICAgICAgQmF6OiB7IEJhcjogJ1F1eCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmbk1hcHBpbmcoc3RhY2ssICdGcmVkJywge1xuICAgICAgICBtYXBwaW5nOiB7XG4gICAgICAgICAgRm9vOiB7IEJhcjogJ0xpZ2h0bmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBpbnNwZWN0Lmhhc01hcHBpbmcoJyonLCB7IEZvbzogeyBCYXI6ICdMaWdodG5pbmcnIH0gfSkpLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk1hcHBpbmcoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICBGb286IHsgQmFyOiAnRnJlZCcsIEJhejogJ1dhbGRvJyB9LFxuICAgICAgICAgIFF1eDogeyBCYXI6ICdGcmVkJyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZyZWQnLCB7XG4gICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICBGb286IHsgQmF6OiAnQmF6JyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICAgKCkgPT4gaW5zcGVjdC5oYXNNYXBwaW5nKCcqJywge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdRdXgnIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgLzIgbWFwcGluZ3MvLFxuICAgICAgICAgIC9FeHBlY3RlZCBRdXggYnV0IHJlY2VpdmVkIEZyZWQvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21hdGNoaW5nIHNwZWNpZmljIG91dHB1dE5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbk1hcHBpbmcoc3RhY2ssICdGb28nLCB7XG4gICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICBGb286IHsgQmFyOiAnTGlnaHRuaW5nJywgRnJlZDogJ1dhbGRvJyB9LFxuICAgICAgICAgIEJhejogeyBCYXI6ICdRdXgnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5NYXBwaW5nKHN0YWNrLCAnRnJlZCcsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdMaWdodG5pbmcnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5oYXNNYXBwaW5nKCdGb28nLCB7IEJhejogeyBCYXI6ICdRdXgnIH0gfSkpLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcgc3BlY2lmaWMgb3V0cHV0TmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdGcmVkJywgQmF6OiAnV2FsZG8nIH0sXG4gICAgICAgICAgUXV4OiB7IEJhcjogJ0ZyZWQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5NYXBwaW5nKHN0YWNrLCAnRnJlZCcsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXo6ICdCYXonIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3RUb1Rocm93KFxuICAgICAgICAoKSA9PiBpbnNwZWN0Lmhhc01hcHBpbmcoJ0ZyZWQnLCB7XG4gICAgICAgICAgRm9vOiB7IEJhejogJ0ZyZWQnIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgLzEgbWFwcGluZ3MvLFxuICAgICAgICAgIC9FeHBlY3RlZCBGcmVkIGJ1dCByZWNlaXZlZCBCYXovLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRQYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMScsIHtcbiAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnc3RyaW5nIHBhcmFtZXRlcicsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMicsIHtcbiAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbnVtYmVyIHBhcmFtZXRlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBjb25zdCByZXN1bHQgPSBpbnNwZWN0LmZpbmRQYXJhbWV0ZXJzKCcqJywgeyBUeXBlOiAnU3RyaW5nJyB9KTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBwMToge1xuICAgICAgICAgIERlc2NyaXB0aW9uOiAnc3RyaW5nIHBhcmFtZXRlcicsXG4gICAgICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCBtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncDEnLCB7XG4gICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ3N0cmluZyBwYXJhbWV0ZXInLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zcGVjdC5maW5kUGFyYW1ldGVycygnKicsIHsgVHlwZTogJ051bWJlcicgfSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtYXRjaGluZyB3aXRoIHNwZWNpZmljIHBhcmFtZXRlciBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMScsIHtcbiAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnc3RyaW5nIHBhcmFtZXRlcicsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMicsIHtcbiAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbnVtYmVyIHBhcmFtZXRlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBjb25zdCByZXN1bHQgPSBpbnNwZWN0LmZpbmRQYXJhbWV0ZXJzKCdwMScsIHsgVHlwZTogJ1N0cmluZycgfSk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgcDE6IHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ3N0cmluZyBwYXJhbWV0ZXInLFxuICAgICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcgc3BlY2lmaWMgcGFyYW1ldGVyIG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ3AxJywge1xuICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdzdHJpbmcgcGFyYW1ldGVyJyxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ3AyJywge1xuICAgICAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdudW1iZXIgcGFyYW1ldGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZFBhcmFtZXRlcnMoJ3AzJywgeyBUeXBlOiAnU3RyaW5nJyB9KTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc1BhcmFtZXRlcicsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncDEnLCB7XG4gICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ3N0cmluZyBwYXJhbWV0ZXInLFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncDInLCB7XG4gICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ251bWJlciBwYXJhbWV0ZXInLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuZmluZFBhcmFtZXRlcnMoJ3AzJywgeyBUeXBlOiAnU3RyaW5nJyB9KSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCBtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncDEnLCB7XG4gICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ3N0cmluZyBwYXJhbWV0ZXInLFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncDInLCB7XG4gICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ251bWJlciBwYXJhbWV0ZXInLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0VG9UaHJvdyhcbiAgICAgICAgKCkgPT4gaW5zcGVjdC5oYXNQYXJhbWV0ZXIoJyonLCB7IFR5cGU6ICdDb21tYURlbGltaXRlZExpc3QnIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgLy8gVGhpcmQgcGFyYW1ldGVyIGlzIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgYXMgcGFydCBvZiBEZWZhdWx0U3ludGhlc2l6ZXJcbiAgICAgICAgICAvMyBwYXJhbWV0ZXJzLyxcbiAgICAgICAgICAvRXhwZWN0ZWQgQ29tbWFEZWxpbWl0ZWRMaXN0IGJ1dCByZWNlaXZlZCBTdHJpbmcvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21hdGNoaW5nIHNwZWNpZmljIHBhcmFtZXRlciBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMScsIHtcbiAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnc3RyaW5nIHBhcmFtZXRlcicsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMicsIHtcbiAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbnVtYmVyIHBhcmFtZXRlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3QoKCkgPT4gaW5zcGVjdC5maW5kUGFyYW1ldGVycygncDEnLCB7IFR5cGU6ICdTdHJpbmcnIH0pKS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm90IG1hdGNoaW5nIHNwZWNpZmljIHBhcmFtZXRlciBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMScsIHtcbiAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnc3RyaW5nIHBhcmFtZXRlcicsXG4gICAgICB9KTtcbiAgICAgIG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdwMicsIHtcbiAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbnVtYmVyIHBhcmFtZXRlcicsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBleHBlY3RUb1Rocm93KFxuICAgICAgICAoKSA9PiBpbnNwZWN0Lmhhc1BhcmFtZXRlcigncDInLCB7IFR5cGU6ICdDb21tYURlbGltaXRlZExpc3QnIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgLzEgcGFyYW1ldGVyLyxcbiAgICAgICAgICAvRXhwZWN0ZWQgQ29tbWFEZWxpbWl0ZWRMaXN0IGJ1dCByZWNlaXZlZCBOdW1iZXIvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRNYXBwaW5ncycsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdMaWdodG5pbmcnLCBGcmVkOiAnV2FsZG8nIH0sXG4gICAgICAgICAgQmF6OiB7IEJhcjogJ1F1eCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmbk1hcHBpbmcoc3RhY2ssICdGcmVkJywge1xuICAgICAgICBtYXBwaW5nOiB7XG4gICAgICAgICAgRm9vOiB7IEJhcjogJ0xpZ2h0bmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZE1hcHBpbmdzKCcqJywgeyBGb286IHsgQmFyOiAnTGlnaHRuaW5nJyB9IH0pO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIEZvbzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdMaWdodG5pbmcnLCBGcmVkOiAnV2FsZG8nIH0sXG4gICAgICAgICAgQmF6OiB7IEJhcjogJ1F1eCcgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRnJlZDogeyBGb286IHsgQmFyOiAnTGlnaHRuaW5nJyB9IH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCBtYXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdGcmVkJywgQmF6OiAnV2FsZG8nIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBjb25zdCByZXN1bHQgPSBpbnNwZWN0LmZpbmRNYXBwaW5ncygnKicsIHsgRm9vOiB7IEJhcjogJ1dhbGRvJyB9IH0pO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0Y2hpbmcgd2l0aCBzcGVjaWZpYyBvdXRwdXROYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5NYXBwaW5nKHN0YWNrLCAnRm9vJywge1xuICAgICAgICBtYXBwaW5nOiB7XG4gICAgICAgICAgRm9vOiB7IEJhcjogJ0xpZ2h0bmluZycsIEZyZWQ6ICdXYWxkbycgfSxcbiAgICAgICAgICBCYXo6IHsgQmFyOiAnUXV4JyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZyZWQnLCB7XG4gICAgICAgIG1hcHBpbmc6IHtcbiAgICAgICAgICBGb286IHsgQmFyOiAnTGlnaHRuaW5nJyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zcGVjdC5maW5kTWFwcGluZ3MoJ0ZvbycsIHsgRm9vOiB7IEJhcjogJ0xpZ2h0bmluZycgfSB9KTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBGb286IHtcbiAgICAgICAgICBGb286IHsgQmFyOiAnTGlnaHRuaW5nJywgRnJlZDogJ1dhbGRvJyB9LFxuICAgICAgICAgIEJhejogeyBCYXI6ICdRdXgnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCBtYXRjaGluZyBzcGVjaWZpYyBvdXRwdXQgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuTWFwcGluZyhzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgbWFwcGluZzoge1xuICAgICAgICAgIEZvbzogeyBCYXI6ICdMaWdodG5pbmcnLCBGcmVkOiAnV2FsZG8nIH0sXG4gICAgICAgICAgQmF6OiB7IEJhcjogJ1F1eCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IENmbk1hcHBpbmcoc3RhY2ssICdGcmVkJywge1xuICAgICAgICBtYXBwaW5nOiB7XG4gICAgICAgICAgRm9vOiB7IEJhcjogJ0xpZ2h0bmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3BlY3QuZmluZE1hcHBpbmdzKCdGcmVkJywgeyBCYXo6IHsgQmFyOiAnUXV4JyB9IH0pO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzQ29uZGl0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzQ29uZGl0aW9uKCcqJywgeyAnRm46OkVxdWFscyc6IFsnQmFyJywgJ0JheiddIH0pKS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm90IG1hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdRdXgnLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbk5vdChGbi5jb25kaXRpb25FcXVhbHMoJ1F1dXgnLCAnUXV1eicpKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdFRvVGhyb3coXG4gICAgICAgICgpID0+IGluc3BlY3QuaGFzQ29uZGl0aW9uKCcqJywge1xuICAgICAgICAgICdGbjo6RXF1YWxzJzogWydCYXonLCAnQmFyJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgLzIgY29uZGl0aW9ucy8sXG4gICAgICAgICAgL01pc3Npbmcga2V5LyxcbiAgICAgICAgXSxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtYXRjaGluZyBzcGVjaWZpYyBvdXRwdXROYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgZXhwZWN0KCgpID0+IGluc3BlY3QuaGFzQ29uZGl0aW9uKCdGb28nLCB7ICdGbjo6RXF1YWxzJzogWydCYXInLCAnQmF6J10gfSkpLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcgc3BlY2lmaWMgb3V0cHV0TmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgQ2ZuQ29uZGl0aW9uKHN0YWNrLCAnRm9vJywge1xuICAgICAgICBleHByZXNzaW9uOiBGbi5jb25kaXRpb25FcXVhbHMoJ0JheicsICdCYXInKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGV4cGVjdFRvVGhyb3coXG4gICAgICAgICgpID0+IGluc3BlY3QuaGFzQ29uZGl0aW9uKCdGb28nLCB7XG4gICAgICAgICAgJ0ZuOjpFcXVhbHMnOiBbJ0JhcicsICdCYXonXSxcbiAgICAgICAgfSksXG4gICAgICAgIFtcbiAgICAgICAgICAvMSBjb25kaXRpb25zLyxcbiAgICAgICAgICAvRXhwZWN0ZWQgQmF6IGJ1dCByZWNlaXZlZCBCYXIvLFxuICAgICAgICBdLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRDb25kaXRpb25zJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdRdXgnLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbk5vdChGbi5jb25kaXRpb25FcXVhbHMoJ1F1dXgnLCAnUXV1eicpKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbnNwZWN0ID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIGNvbnN0IGZpcnN0Q29uZGl0aW9uID0gaW5zcGVjdC5maW5kQ29uZGl0aW9ucygnRm9vJyk7XG4gICAgICBleHBlY3QoZmlyc3RDb25kaXRpb24pLnRvRXF1YWwoe1xuICAgICAgICBGb286IHtcbiAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICdCYXInLFxuICAgICAgICAgICAgJ0JheicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZWNvbmRDb25kaXRpb24gPSBpbnNwZWN0LmZpbmRDb25kaXRpb25zKCdRdXgnKTtcbiAgICAgIGV4cGVjdChzZWNvbmRDb25kaXRpb24pLnRvRXF1YWwoe1xuICAgICAgICBRdXg6IHtcbiAgICAgICAgICAnRm46Ok5vdCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpFcXVhbHMnOiBbXG4gICAgICAgICAgICAgICAgJ1F1dXgnLFxuICAgICAgICAgICAgICAgICdRdXV6JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm90IG1hdGNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zcGVjdC5maW5kTWFwcGluZ3MoJ0JhcicpO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0Y2hpbmcgd2l0aCBzcGVjaWZpYyBvdXRwdXROYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBDZm5Db25kaXRpb24oc3RhY2ssICdGb28nLCB7XG4gICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbkVxdWFscygnQmFyJywgJ0JheicpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluc3BlY3QgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zcGVjdC5maW5kQ29uZGl0aW9ucygnRm9vJywgeyAnRm46OkVxdWFscyc6IFsnQmFyJywgJ0JheiddIH0pO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIEZvbzoge1xuICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgJ0JhcicsXG4gICAgICAgICAgICAnQmF6JyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgbWF0Y2hpbmcgc3BlY2lmaWMgb3V0cHV0IG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IENmbkNvbmRpdGlvbihzdGFjaywgJ0ZvbycsIHtcbiAgICAgICAgZXhwcmVzc2lvbjogRm4uY29uZGl0aW9uRXF1YWxzKCdCYXInLCAnQmF6JyksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaW5zcGVjdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICBjb25zdCByZXN1bHQgPSBpbnNwZWN0LmZpbmRDb25kaXRpb25zKCdGb28nLCB7ICdGbjo6RXF1YWxzJzogWydCYXInLCAnUXV4J10gfSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGdpdmVuIGEgdGVtcGxhdGUgd2l0aCBjeWNsaWMgZGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tSlNPTih7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIFJlczE6IHtcbiAgICAgICAgICAgIFR5cGU6ICdGb28nLFxuICAgICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgICBUaGluZzogeyBSZWY6ICdSZXMyJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlczI6IHtcbiAgICAgICAgICAgIFR5cGU6ICdGb28nLFxuICAgICAgICAgICAgRGVwZW5kc09uOiBbJ1JlczEnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvZGVwZW5kZW5jeSBjeWNsZS8pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCB0aHJvdyB3aGVuIGdpdmVuIGEgdGVtcGxhdGUgd2l0aCBjeWNsaWMgZGVwZW5kZW5jaWVzIGlmIGNoZWNrIGlzIHNraXBwZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFRlbXBsYXRlLmZyb21KU09OKHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgUmVzMToge1xuICAgICAgICAgICAgVHlwZTogJ0ZvbycsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIFRoaW5nOiB7IFJlZjogJ1JlczInIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmVzMjoge1xuICAgICAgICAgICAgVHlwZTogJ0ZvbycsXG4gICAgICAgICAgICBEZXBlbmRzT246IFsnUmVzMSddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LCB7XG4gICAgICAgIHNraXBDeWNsaWNhbERlcGVuZGVuY2llc0NoZWNrOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coL2RlcGVuZGVuY3kgY3ljbGUvKTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZXhwZWN0VG9UaHJvdyhmbjogKCkgPT4gdm9pZCwgbXNnczogKFJlZ0V4cCB8IHN0cmluZylbXSk6IHZvaWQge1xuICB0cnkge1xuICAgIGZuKCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBleHBlY3RlZCB0byB0aHJvdywgZGlkIG5vdCB0aHJvdycpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2U7XG4gICAgY29uc3QgdW5tYXRjaGluZyA9IG1zZ3MuZmlsdGVyKG1zZyA9PiB7XG4gICAgICBpZiAobXNnIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAhbXNnLnRlc3QobWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gIW1lc3NhZ2UuaW5jbHVkZXMobXNnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh1bm1hdGNoaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihbXG4gICAgICAgIGBFcnJvciB0aHJvd24gZGlkIG5vdCBjb250YWluIGV4cGVjdGVkIG1lc3NhZ2VzOiAke3VubWF0Y2hpbmd9YCxcbiAgICAgICAgYFJlY2VpdmVkIGVycm9yOiAke21lc3NhZ2V9YCxcbiAgICAgIF0uam9pbignXFxuJykpO1xuICAgIH1cbiAgfVxufVxuIl19