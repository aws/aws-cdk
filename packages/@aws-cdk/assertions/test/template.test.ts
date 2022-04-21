/* eslint-disable @typescript-eslint/no-floating-promises */
import { App, CfnCondition, CfnMapping, CfnOutput, CfnParameter, CfnResource, Fn, LegacyStackSynthesizer, NestedStack, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Capture, Match, Template } from '../lib';

describe('Template', () => {
  test('fromString', async () => {
    const template = Template.fromString(`{
        "Resources": {
          "Foo": {
            "Type": "Baz::Qux",
            "Properties": { "Fred": "Waldo" }
          }
        }
      }`);

    expect(await template.toJSON()).toEqual({
      Resources: {
        Foo: {
          Type: 'Baz::Qux',
          Properties: { Fred: 'Waldo' },
        },
      },
    });
  });

  describe('fromStack', () => {
    test('default', async () => {
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

      expect(await template.toJSON()).toEqual({
        Resources: {
          Foo: {
            Type: 'Foo::Bar',
            Properties: { Baz: 'Qux' },
          },
        },
      });
    });

    test('nested', async () => {
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

      expect(await template.toJSON()).toEqual({
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
    test('resource exists', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      await inspect.resourceCountIs('Foo::Bar', 1);

      await expect(() => inspect.resourceCountIs('Foo::Bar', 0)).rejects.toThrow('Expected 0 resources of type Foo::Bar but found 1');
      await expect(() => inspect.resourceCountIs('Foo::Bar', 2)).rejects.toThrow('Expected 2 resources of type Foo::Bar but found 1');

      await expect(() => inspect.resourceCountIs('Foo::Baz', 1)).rejects.toThrow('Expected 1 resources of type Foo::Baz but found 0');
    });

    test('no resource', async () => {
      const stack = new Stack();

      const inspect = Template.fromStack(stack);
      await inspect.resourceCountIs('Foo::Bar', 0);

      await expect(() => inspect.resourceCountIs('Foo::Bar', 1)).rejects.toThrow('Expected 1 resources of type Foo::Bar but found 0');
    });
  });

  describe('templateMatches', () => {
    test('matches', async () => {
      const app = new App();
      const stack = new Stack(app, 'Stack', {
        synthesizer: new LegacyStackSynthesizer(),
      });
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.templateMatches({
        Resources: {
          Foo: {
            Type: 'Foo::Bar',
            Properties: { baz: 'qux' },
          },
        },
      });
    });

    test('fails', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await expect(() => inspect.templateMatches({
        Resources: {
          Foo: {
            Type: 'Foo::Bar',
            Properties: { baz: 'waldo' },
          },
        },
      })).rejects.toThrowError(/Expected waldo but received qux at \/Resources\/Foo\/Properties\/baz/);
    });
  });

  describe('hasResource', () => {
    test('exact match', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResource('Foo::Bar', {
        Properties: { baz: 'qux' },
      });

      await expect(() => inspect.hasResource('Foo::Bar', {
        Properties: { baz: 'waldo' },
      })).rejects.toThrow(/Expected waldo but received qux at \/Properties\/baz/);

      await expect(() => inspect.hasResource('Foo::Bar', {
        Properties: { baz: 'qux', fred: 'waldo' },
      })).rejects.toThrow(/Missing key at \/Properties\/fred/);
    });

    test('arrayWith', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: ['qux', 'quy'] },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResource('Foo::Bar', {
        Properties: { baz: Match.arrayWith(['qux']) },
      });

      await expect(() => inspect.hasResource('Foo::Bar', {
        Properties: { baz: Match.arrayWith(['waldo']) },
      })).rejects.toThrow(/Missing element \[waldo\] at pattern index 0 at \/Properties\/baz/);
    });

    test('arrayWith - multiple resources', (done) => {
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
      expectToThrow(async () => {
        await await inspect.hasResource('Foo::Bar', {
          Properties: Match.arrayWith(['flob']),
        });
      }, [/The closest result/, /flob/, /qux/], done);

      done();
    });

    test('objectLike', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: 'qux' }),
      });
      await inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ fred: 'waldo' }),
      });

      await expect(() => inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: 'waldo' }),
      })).rejects.toThrow(/Expected waldo but received qux at \/Properties\/baz/);
    });

    test('objectLike - multiple resources', done => {
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
      expectToThrow(async () => {
        await await inspect.hasResource('Foo::Bar', {
          Properties: Match.objectLike({ foo: { flob: 'foo' } }),
        });
      }, [/The closest result/, /"flob": "qux"/], done);

      done();
    });

    test('absent', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ foo: Match.absent() }),
      });
      await expect(() => inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: Match.absent() }),
      })).rejects.toThrow(/key should be absent at \/Properties\/baz/);
    });

    test('incorrect types', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      await expect(() => inspect.hasResource('Foo::Baz', {
        Properties: Match.objectLike({ baz: 'qux' }),
      })).rejects.toThrow(/No resource/);
    });

    test('capture', async () => {
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
      await inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: capture, real: true }),
      });

      expect(capture.asString()).toEqual('qux');
      expect(capture.next()).toEqual(true);
      expect(capture.asString()).toEqual('waldo');
      expect(capture.next()).toEqual(false);
    });
  });

  describe('hasResourceProperties', () => {
    test('exact match', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResourceProperties('Foo::Bar', { baz: 'qux' });
      await expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'waldo' }))
        .rejects.toThrow(/Expected waldo but received qux at \/Properties\/baz/);
      await expect(() => inspect.hasResourceProperties('Foo::Bar', { baz: 'qux', fred: 'waldo' }))
        .rejects.toThrow(/Missing key at \/Properties\/fred/);
    });

    test('absent - with properties', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);

      await inspect.hasResourceProperties('Foo::Bar', {
        bar: Match.absent(),
      });

      await expect(() => inspect.hasResourceProperties('Foo::Bar', {
        baz: Match.absent(),
      })).rejects.toThrow(/key should be absent at \/Properties\/baz/);
    });

    test('absent - no properties', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      await expect(() => inspect.hasResourceProperties('Foo::Bar', { bar: Match.absent(), baz: 'qux' }))
        .rejects.toThrow(/Missing key at \/Properties\/baz/);

      await inspect.hasResourceProperties('Foo::Bar', Match.absent());
    });

    test('not - with properties', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResourceProperties('Foo::Bar', Match.not({
        baz: 'boo',
      }));
    });

    test('not - no properties', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
      });

      const inspect = Template.fromStack(stack);
      await inspect.hasResourceProperties('Foo::Bar', Match.not({ baz: 'qux' }));
    });
  });

  describe('getResources', () => {
    test('matching resource type', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(await inspect.findResources('Foo::Bar')).toEqual({
        Foo: {
          Type: 'Foo::Bar',
          Properties: { baz: 'qux', fred: 'waldo' },
        },
      });
    });

    test('no matching resource type', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(await inspect.findResources('Foo::Baz')).toEqual({});
    });

    test('matching resource props', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(Object.keys(await inspect.findResources('Foo::Bar', {
        Properties: { baz: 'qux' },
      })).length).toEqual(1);
    });

    test('no matching resource props', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(await inspect.findResources('Foo::Bar', {
        Properties: { baz: 'waldo' },
      })).toEqual({});
    });

    test('multiple matching resources', async () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', { type: 'Foo::Bar' });
      new CfnResource(stack, 'Bar', { type: 'Foo::Bar' });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findResources('Foo::Bar');
      expect(Object.keys(result).length).toEqual(2);
      expect(result.Foo).toEqual({ Type: 'Foo::Bar' });
      expect(result.Bar).toEqual({ Type: 'Foo::Bar' });
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

    test('not matching', (done) => {
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
        done,
      );
      done();
    });

    test('value not matching with outputName', (done) => {
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
        done,
      );
      done();
    });
  });

  test('outputName not matching', (done) => {
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
        /No outputs named Fred found in the template./,
      ],
      done,
    );
    done();
  });

  describe('findOutputs', () => {
    test('matching', async () => {
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
      const result = await inspect.findOutputs('*', { Value: 'Fred' });
      expect(Object.keys(result).length).toEqual(2);
      expect(result.Foo).toEqual({ Value: 'Fred', Description: 'FooFred' });
      expect(result.Bar).toEqual({ Value: 'Fred', Description: 'BarFred' });
    });

    test('not matching', async () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findOutputs('*', { Value: 'Waldo' });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching specific output', async () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });
      new CfnOutput(stack, 'Baz', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findOutputs('Foo', { Value: 'Fred' });
      expect(result).toEqual({
        Foo: {
          Value: 'Fred',
        },
      });
    });

    test('not matching specific output', async () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });
      new CfnOutput(stack, 'Baz', {
        value: 'Waldo',
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findOutputs('Foo', { Value: 'Waldo' });
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

    test('not matching', (done) => {
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
        done,
      );
      done();
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

    test('not matching specific outputName', (done) => {
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
        done,
      );
      done();
    });
  });

  describe('findParameters', () => {
    test('matching', async () => {
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
      const result = await inspect.findParameters('*', { Type: 'String' });
      expect(result).toEqual({
        p1: {
          Description: 'string parameter',
          Type: 'String',
        },
      });
    });

    test('not matching', async () => {
      const stack = new Stack();
      new CfnParameter(stack, 'p1', {
        type: 'String',
        description: 'string parameter',
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findParameters('*', { Type: 'Number' });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific parameter name', async () => {
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
      const result = await inspect.findParameters('p1', { Type: 'String' });
      expect(result).toEqual({
        p1: {
          Description: 'string parameter',
          Type: 'String',
        },
      });
    });

    test('not matching specific parameter name', async () => {
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
      const result = await inspect.findParameters('p3', { Type: 'String' });
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

    test('not matching', (done) => {
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
        done,
      );
      done();
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

    test('not matching specific parameter name', (done) => {
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
        done,
      );
      done();
    });
  });

  describe('findMappings', () => {
    test('matching', async () => {
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
      const result = await inspect.findMappings('*', { Foo: { Bar: 'Lightning' } });
      expect(result).toEqual({
        Foo: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
        Fred: { Foo: { Bar: 'Lightning' } },
      });
    });

    test('not matching', async () => {
      const stack = new Stack();
      new CfnMapping(stack, 'Foo', {
        mapping: {
          Foo: { Bar: 'Fred', Baz: 'Waldo' },
        },
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findMappings('*', { Foo: { Bar: 'Waldo' } });
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific outputName', async () => {
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
      const result = await inspect.findMappings('Foo', { Foo: { Bar: 'Lightning' } });
      expect(result).toEqual({
        Foo: {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      });
    });

    test('not matching specific output name', async () => {
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
      const result = await inspect.findMappings('Fred', { Baz: { Bar: 'Qux' } });
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

    test('not matching', (done) => {
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
        done,
      );
      done();
    });

    test('matching specific outputName', () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      expect(() => inspect.hasCondition('Foo', { 'Fn::Equals': ['Bar', 'Baz'] })).not.toThrow();
    });

    test('not matching specific outputName', (done) => {
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
        done,
      );
      done();
    });
  });

  describe('findConditions', () => {
    test('matching', async () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      new CfnCondition(stack, 'Qux', {
        expression: Fn.conditionNot(Fn.conditionEquals('Quux', 'Quuz')),
      });

      const inspect = Template.fromStack(stack);
      const firstCondition = await inspect.findConditions('Foo');
      expect(firstCondition).toEqual({
        Foo: {
          'Fn::Equals': [
            'Bar',
            'Baz',
          ],
        },
      });

      const secondCondition = await inspect.findConditions('Qux');
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

    test('not matching', async () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findMappings('Bar');
      expect(Object.keys(result).length).toEqual(0);
    });

    test('matching with specific outputName', async () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findConditions('Foo', { 'Fn::Equals': ['Bar', 'Baz'] });
      expect(result).toEqual({
        Foo: {
          'Fn::Equals': [
            'Bar',
            'Baz',
          ],
        },
      });
    });

    test('not matching specific output name', async () => {
      const stack = new Stack();
      new CfnCondition(stack, 'Foo', {
        expression: Fn.conditionEquals('Bar', 'Baz'),
      });

      const inspect = Template.fromStack(stack);
      const result = await inspect.findConditions('Foo', { 'Fn::Equals': ['Bar', 'Qux'] });
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
});

async function expectToThrow(fn: () => Promise<void>, msgs: (RegExp | string)[], done: jest.DoneCallback): Promise<void> {
  try {
    await fn();
    done.fail('Function expected to throw, did not throw');
  } catch (error) {
    const message = (error as Error).message;
    const splits = message.split('\n');
    let splitIdx = 0;
    let msgsIdx = 0;
    while (splitIdx < splits.length && msgsIdx < msgs.length) {
      const msg = msgs[msgsIdx];
      const split = splits[splitIdx];
      let match = false;
      if (msg instanceof RegExp) {
        match = msg.test(split);
      } else {
        match = (msg === split);
      }

      if (match) {
        msgsIdx++;
      }
      splitIdx++;
    }

    if (msgsIdx < msgs.length) {
      done.fail([
        `Error thrown did not contain expected messages: ${msgs.slice(msgsIdx, msgs.length)}`,
        `Received error: ${message}`,
      ].join('\n'));
    }
  }
}
