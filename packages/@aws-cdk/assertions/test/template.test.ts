import { App, CfnCondition, CfnMapping, CfnOutput, CfnParameter, CfnResource, Fn, LegacyStackSynthesizer, NestedStack, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Capture, Match, Template } from '../lib';

describe('Template', () => {
  test('fromString', () => {
    const template = Template.fromString(`{
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
      const app = new App({
        context: {
          '@aws-cdk/core:newStyleStackSynthesis': false,
        },
      });
      const stack = new Stack(app);
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: {
          Baz: 'Qux',
        },
      });
      const template = Template.fromStack(stack);

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
      const app = new App({
        context: {
          '@aws-cdk/core:newStyleStackSynthesis': false,
        },
      });
      const stack = new Stack(app);
      const nested = new NestedStack(stack, 'MyNestedStack');
      new CfnResource(nested, 'Foo', {
        type: 'Foo::Bar',
        properties: {
          Baz: 'Qux',
        },
      });
      const template = Template.fromStack(nested);

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
      const assertions = Template.fromString(`{
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
      const c = new Construct(undefined as any, '');
      const stack = new Stack(c, 'MyStack');
      expect(() => Template.fromStack(stack)).toThrow(/must be part of a Stage or an App/);
    });
  });

  describe('resourceCountIs', () => {
    test('resource exists', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      inspect.resourceCountIs('Foo::Bar', 1);

      expect(() => inspect.resourceCountIs('Foo::Bar', 0)).toThrow('Expected 0 resources of type Foo::Bar but found 1');
      expect(() => inspect.resourceCountIs('Foo::Bar', 2)).toThrow('Expected 2 resources of type Foo::Bar but found 1');

      expect(() => inspect.resourceCountIs('Foo::Baz', 1)).toThrow('Expected 1 resources of type Foo::Baz but found 0');
    });

    test('no resource', () => {
      const stack = new Stack();

      const inspect = Template.fromStack(stack);
      inspect.resourceCountIs('Foo::Bar', 0);

      expect(() => inspect.resourceCountIs('Foo::Bar', 1)).toThrow('Expected 1 resources of type Foo::Bar but found 0');
    });
  });

  describe('resourcePropertiesCountIs', () => {
    test('resource exists', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();

      const inspect = Template.fromStack(stack);
      inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 0);

      expect(() => {
        inspect.resourcePropertiesCountIs('Foo::Bar', { baz: 'qux' }, 1);
      }).toThrow('Expected 1 resources of type Foo::Bar but found 0');
    });
    test('absent - with properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.resourcePropertiesCountIs('Foo::Bar', {
        bar: Match.absent(),
      }, 1);
      inspect.resourcePropertiesCountIs('Foo::Bar', {
        baz: Match.absent(),
      }, 0);
    });
    test('absent - no properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      inspect.resourcePropertiesCountIs('Foo::Bar', {
        bar: Match.absent(),
        baz: 'qux',
      }, 0);
      inspect.resourcePropertiesCountIs('Foo::Bar', Match.absent(), 1);
    });
    test('not - with properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.resourcePropertiesCountIs('Foo::Bar', Match.not({
        baz: 'boo',
      }), 1);
    });
    test('not - no properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      inspect.resourcePropertiesCountIs('Foo::Bar', Match.not({
        baz: 'qux',
      }), 1);
    });
  });

  describe('templateMatches', () => {
    test('matches', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack', {
        synthesizer: new LegacyStackSynthesizer(),
      });
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: ['qux', 'quy'] },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: { baz: Match.arrayWith(['qux']) },
      });

      expect(() => inspect.hasResource('Foo::Bar', {
        Properties: { baz: Match.arrayWith(['waldo']) },
      })).toThrow(/Could not match arrayWith pattern 0/);
    });

    test('arrayWith - multiple resources', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo1', {
        type: 'Foo::Bar',
        properties: { foo: ['flob', 'qux'] },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { flob: ['qux'] },
      });

      const inspect = Template.fromStack(stack);

      await expectToThrow(() => {
        inspect.hasResource('Foo::Bar', {
          Properties: Match.arrayWith(['flob']),
        });
      }, [/closest matches/, /flob/, /qux/]);
    });

    test('objectLike', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: 'qux' }),
      });
      inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ fred: 'waldo' }),
      });

      expect(() => inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: 'waldo' }),
      })).toThrow(/Expected waldo but received qux/);
    });

    test('objectLike - multiple resources', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo1', {
        type: 'Foo::Bar',
        properties: { foo: { flob: 'qux' } },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { flob: 'waldo' },
      });

      const inspect = Template.fromStack(stack);

      expectToThrow(() => {
        inspect.hasResource('Foo::Bar', {
          Properties: Match.objectLike({ foo: { flob: 'foo' } }),
        });
      }, [/closest match/, /"flob": "qux"/]);
    });

    test('absent', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ foo: Match.absent() }),
      });
      expect(() => inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: Match.absent() }),
      })).toThrow(/key should be absent/);
    });

    test('incorrect types', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasResource('Foo::Baz', {
        Properties: Match.objectLike({ baz: 'qux' }),
      })).toThrow(/0 resources with type Foo::Baz/);
    });

    test('capture', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Bar1', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', real: true },
      });
      new CfnResource(stack, 'Bar2', {
        type: 'Foo::Bar',
        properties: { baz: 'waldo', real: true },
      });
      new CfnResource(stack, 'Bar3', {
        type: 'Foo::Bar',
        properties: { baz: 'fred', real: false },
      });

      const capture = new Capture();
      const inspect = Template.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: capture, real: true }),
      });

      expect(capture.asString()).toEqual('qux');
      expect(capture.next()).toEqual(true);
      expect(capture.asString()).toEqual('waldo');
      expect(capture.next()).toEqual(false);
    });
  });

  describe('hasResourceProperties', () => {
    test('exact match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResourceProperties('Foo::Bar', { baz: 'qux' });

      expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'waldo' }))
        .toThrow(/Expected waldo but received qux/);

      expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'qux', fred: 'waldo' }))
        .toThrow(/Missing key/);
    });

    test('absent - with properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);

      inspect.hasResourceProperties('Foo::Bar', {
        bar: Match.absent(),
      });

      expect(() => inspect.hasResourceProperties('Foo::Bar', {
        baz: Match.absent(),
      })).toThrow(/key should be absent/);
    });

    test('absent - no properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);

      expect(() => inspect.hasResourceProperties('Foo::Bar', { bar: Match.absent(), baz: 'qux' }))
        .toThrow(/Missing key/);

      inspect.hasResourceProperties('Foo::Bar', Match.absent());
    });

    test('not - with properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResourceProperties('Foo::Bar', Match.not({
        baz: 'boo',
      }));
    });

    test('not - no properties', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResourceProperties('Foo::Bar', Match.not({ baz: 'qux' }));
    });
  });

  describe('getResources', () => {
    test('matching resource type', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Bar')).toEqual({
        Foo: {
          Type: 'Foo::Bar',
          Properties: { baz: 'qux', fred: 'waldo' },
        },
      });
    });

    test('no matching resource type', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Baz')).toEqual({});
    });

    test('matching resource props', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(Object.keys(inspect.findResources('Foo::Bar', {
        Properties: { baz: 'qux' },
      })).length).toEqual(1);
    });

    test('no matching resource props', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Bar', {
        Properties: { baz: 'waldo' },
      })).toEqual({});
    });

    test('multiple matching resources', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', { type: 'Foo::Bar' });
      new CfnResource(stack, 'Bar', { type: 'Foo::Bar' });

      const inspect = Template.fromStack(stack);
      const result = inspect.findResources('Foo::Bar');
      expect(Object.keys(result).length).toEqual(2);
      expect(result.Foo).toEqual({ Type: 'Foo::Bar' });
      expect(result.Bar).toEqual({ Type: 'Foo::Bar' });
    });
  });

  describe('allResources', () => {
    test('all resource of type match', () => {
      const stack = new Stack();
      const partialProps = { baz: 'qux', fred: 'waldo' };
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { ...partialProps, lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: partialProps,
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.allResources('Foo::Bar', { Properties: partialProps }));
    });

    test('no resources match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.allResources('Foo::Bar', { Properties: { fred: 'waldo' } }),
        [
          'Template has 2 resource(s) with type Foo::Bar, but none match as expected.',
          'The following resources do not match the given definition:',
          /Foo/,
          /Foo2/,
        ],
      );
    });

    test('some resources match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.allResources('Foo::Bar', { Properties: { lorem: 'ipsum' } }),
        [
          'Template has 2 resource(s) with type Foo::Bar, but only 1 match as expected.',
          'The following resources do not match the given definition:',
          /Foo2/,
        ],
      );
    });

    test('using a "not" matcher ', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'baz' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.allResources('Foo::Bar', Match.not({ Properties: { baz: 'qux' } })));
    });
  });

  describe('allResourcesProperties', () => {
    test('all resource of type match', () => {
      const stack = new Stack();
      const partialProps = { baz: 'qux', fred: 'waldo' };
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { ...partialProps, lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: partialProps,
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.allResourcesProperties('Foo::Bar', partialProps));
    });

    test('no resources match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });
      new CfnResource(stack, 'NotFoo', {
        type: 'NotFoo::NotBar',
        properties: { fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.allResourcesProperties('Foo::Bar', { fred: 'waldo' }),
        [
          'Template has 2 resource(s) with type Foo::Bar, but none match as expected.',
          'The following resources do not match the given definition:',
          /Foo/,
          /Foo2/,
        ],
      );
    });

    test('some resources match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.allResourcesProperties('Foo::Bar', { lorem: 'ipsum' }),
        [
          'Template has 2 resource(s) with type Foo::Bar, but only 1 match as expected.',
          'The following resources do not match the given definition:',
          /Foo2/,
        ],
      );
    });

    test('using a "not" matcher ', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { lorem: 'ipsum' },
      });
      new CfnResource(stack, 'Foo2', {
        type: 'Foo::Bar',
        properties: { baz: 'baz' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.allResourcesProperties('Foo::Bar', Match.not({ baz: 'qux' })));
    });
  });

  describe('hasOutput', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Bar',
      });
      new CfnOutput(stack, 'Fred', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasOutput('Foo', { Value: 'Bar' })).not.toThrow();
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Bar',
        exportName: 'ExportBar',
      });
      new CfnOutput(stack, 'Fred', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasOutput('Foo', {
          Value: 'Bar',
          Export: { Name: 'ExportBaz' },
        }),
        [
          /1 outputs named Foo/,
          /Expected ExportBaz but received ExportBar/,
        ],
      );
    });

    test('value not matching with outputName', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Bar',
      });
      new CfnOutput(stack, 'Fred', {
        value: 'Baz',
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasOutput('Fred', {
          Value: 'Bar',
        }),
        [
          /1 outputs named Fred/,
          /Expected Bar but received Baz/,
        ],
      );
    });
  });

  test('outputName not matching', () => {
    const stack = new Stack();
    new CfnOutput(stack, 'Foo', {
      value: 'Bar',
      exportName: 'ExportBar',
    });

    const inspect = Template.fromStack(stack);
    expectToThrow(
      () => inspect.hasOutput('Fred', {
        Value: 'Bar',
        Export: { Name: 'ExportBar' },
      }),
      [
        /Template has 0 outputs named Fred./,
      ],
    );
  });

  describe('findOutputs', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
        description: 'FooFred',
      });
      new CfnOutput(stack, 'Bar', {
        value: 'Fred',
        description: 'BarFred',
      });
      new CfnOutput(stack, 'Baz', {
        value: 'Waldo',
        description: 'BazWaldo',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findOutputs('*', { Value: 'Fred' });
      expect(Object.keys(result).length).toEqual(2);
      expect(result.Foo).toEqual({ Value: 'Fred', Description: 'FooFred' });
      expect(result.Bar).toEqual({ Value: 'Fred', Description: 'BarFred' });
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findOutputs('*', { Value: 'Waldo' });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching specific output', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });
      new CfnOutput(stack, 'Baz', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findOutputs('Foo', { Value: 'Fred' });
      expect(result).toEqual({
        Foo: {
          Value: 'Fred',
        },
      });
    });

    test('not matching specific output', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });
      new CfnOutput(stack, 'Baz', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findOutputs('Foo', { Value: 'Waldo' });
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('hasMapping', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Bar: 'Lightning' },
        },
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasMapping('*', { Foo: { Bar: 'Lightning' } })).not.toThrow();
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Fred', Baz: 'Waldo' },
          Qux: { Bar: 'Fred' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Baz: 'Baz' },
        },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasMapping('*', {
          Foo: { Bar: 'Qux' },
        }),
        [
          /2 mappings/,
          /Expected Qux but received Fred/,
        ],
      );
    });

    test('matching specific outputName', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Bar: 'Lightning' },
        },
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasMapping('Foo', { Baz: { Bar: 'Qux' } })).not.toThrow();
    });

    test('not matching specific outputName', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Fred', Baz: 'Waldo' },
          Qux: { Bar: 'Fred' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Baz: 'Baz' },
        },
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasMapping('Fred', {
          Foo: { Baz: 'Fred' },
        }),
        [
          /1 mappings/,
          /Expected Fred but received Baz/,
        ],
      );
    });
  });

  describe('findParameters', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findParameters('*', { Type: 'String' });
      expect(result).toEqual({
        p1: {
          Description: 'string parameter',
          Type: 'String',
        },
      });
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findParameters('*', { Type: 'Number' });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific parameter name', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findParameters('p1', { Type: 'String' });
      expect(result).toEqual({
        p1: {
          Description: 'string parameter',
          Type: 'String',
        },
      });
    });

    test('not matching specific parameter name', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findParameters('p3', { Type: 'String' });
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('hasParameter', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.findParameters('p3', { Type: 'String' })).not.toThrow();
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasParameter('*', { Type: 'CommaDelimitedList' }),
        [
          // Third parameter is automatically included as part of DefaultSynthesizer
          /3 parameters/,
          /Expected CommaDelimitedList but received String/,
        ],
      );
    });

    test('matching specific parameter name', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.findParameters('p1', { Type: 'String' })).not.toThrow();
    });

    test('not matching specific parameter name', () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });
      new CfnParameter(stack, 'p2', {
        type: 'Number',
        description: 'number parameter',
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasParameter('p2', { Type: 'CommaDelimitedList' }),
        [
          /1 parameter/,
          /Expected CommaDelimitedList but received Number/,
        ],
      );
    });
  });

  describe('findMappings', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Bar: 'Lightning' },
        },
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Fred', Baz: 'Waldo' },
        },
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findMappings('*', { Foo: { Bar: 'Waldo' } });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific outputName', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Bar: 'Lightning' },
        },
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findMappings('Foo', { Foo: { Bar: 'Lightning' } });
      expect(result).toEqual({
        Foo: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
    });

    test('not matching specific output name', () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
      new CfnMapping(stack, 'Fred', {
        mapping: {
          Foo: { Bar: 'Lightning' },
        },
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findMappings('Fred', { Baz: { Bar: 'Qux' } });
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('hasCondition', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasCondition('*', { 'Fn::Equals': ['Bar', 'Baz'] })).not.toThrow();
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      new CfnCondition(stack, 'Qux', {
        expression: Fn.conditionNot(Fn.conditionEquals('Quux', 'Quuz')),
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasCondition('*', {
          'Fn::Equals': ['Baz', 'Bar'],
        }),
        [
          /2 conditions/,
          /Missing key/,
        ],
      );
    });

    test('matching specific outputName', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasCondition('Foo', { 'Fn::Equals': ['Bar', 'Baz'] })).not.toThrow();
    });

    test('not matching specific outputName', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Baz', 'Bar'),
      });

      const inspect = Template.fromStack(stack);
      expectToThrow(
        () => inspect.hasCondition('Foo', {
          'Fn::Equals': ['Bar', 'Baz'],
        }),
        [
          /1 conditions/,
          /Expected Baz but received Bar/,
        ],
      );
    });
  });

  describe('findConditions', () => {
    test('matching', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      new CfnCondition(stack, 'Qux', {
        expression: Fn.conditionNot(Fn.conditionEquals('Quux', 'Quuz')),
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findMappings('Bar');
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific outputName', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
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
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findConditions('Foo', { 'Fn::Equals': ['Bar', 'Qux'] });
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  test('throws when given a template with cyclic dependencies', () => {
    expect(() => {
      Template.fromJSON({
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
      Template.fromJSON({
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

function expectToThrow(fn: () => void, msgs: (RegExp | string)[]): void {
  try {
    fn();
    throw new Error('Function expected to throw, did not throw');
  } catch (error) {
    const message = (error as Error).message;
    const unmatching = msgs.filter(msg => {
      if (msg instanceof RegExp) {
        return !msg.test(message);
      } else {
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
