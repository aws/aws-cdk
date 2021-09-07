import { App, CfnMapping, CfnOutput, CfnResource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Match, Template } from '../lib';

describe('Template', () => {
  describe('asObject', () => {
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

    test('fromStack', () => {
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

      expect(() => inspect.resourceCountIs('Foo::Bar', 0)).toThrow(/has 1 resource of type Foo::Bar/);
      expect(() => inspect.resourceCountIs('Foo::Bar', 2)).toThrow(/has 1 resource of type Foo::Bar/);

      expect(() => inspect.resourceCountIs('Foo::Baz', 1)).toThrow(/has 0 resource of type Foo::Baz/);
    });

    test('no resource', () => {
      const stack = new Stack();

      const inspect = Template.fromStack(stack);
      inspect.resourceCountIs('Foo::Bar', 0);

      expect(() => inspect.resourceCountIs('Foo::Bar', 1)).toThrow(/has 0 resource of type Foo::Bar/);
    });
  });

  describe('templateMatches', () => {
    test('matches', () => {
      const stack = new Stack();
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
      })).toThrowError();
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
      })).toThrow(/Expected waldo but received qux at \/Properties\/baz/);

      expect(() => inspect.hasResource('Foo::Bar', {
        Properties: { baz: 'qux', fred: 'waldo' },
      })).toThrow(/Missing key at \/Properties\/fred/);
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
      })).toThrow(/Missing element \[waldo\] at pattern index 0 at \/Properties\/baz/);
    });

    test('arrayWith - multiple resources', done => {
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

      expectToThrow(() => {
        inspect.hasResource('Foo::Bar', {
          Properties: Match.arrayWith(['flob']),
        });
      }, [/The closest result/, /flob/, /qux/], done);

      done();
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
      })).toThrow(/Expected waldo but received qux at \/Properties\/baz/);
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

      expectToThrow(() => {
        inspect.hasResource('Foo::Bar', {
          Properties: Match.objectLike({ foo: { flob: 'foo' } }),
        });
      }, [/The closest result/, /"flob": "qux"/], done);

      done();
    });

    test('absent', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = Template.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ foo: Match.absentProperty() }),
      });
      expect(() => inspect.hasResource('Foo::Bar', {
        Properties: Match.objectLike({ baz: Match.absentProperty() }),
      })).toThrow(/Key should be absent at \/Properties\/baz/);
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
      })).toThrow(/No resource/);
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
      expect(inspect.findResources('Foo::Bar')).toEqual([{
        Type: 'Foo::Bar',
        Properties: { baz: 'qux', fred: 'waldo' },
      }]);
    });

    test('no matching resource type', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Baz')).toEqual([]);
    });

    test('matching resource props', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux', fred: 'waldo' },
      });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Bar', {
        Properties: { baz: 'qux' },
      }).length).toEqual(1);
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
      })).toEqual([]);
    });

    test('multiple matching resources', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', { type: 'Foo::Bar' });
      new CfnResource(stack, 'Bar', { type: 'Foo::Bar' });

      const inspect = Template.fromStack(stack);
      expect(inspect.findResources('Foo::Bar').length).toEqual(2);
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
      expect(result).toEqual([
        { Value: 'Fred', Description: 'FooFred' },
        { Value: 'Fred', Description: 'BarFred' },
      ]);
    });

    test('not matching', () => {
      const stack = new Stack();
      new CfnOutput(stack, 'Foo', {
        value: 'Fred',
      });

      const inspect = Template.fromStack(stack);
      const result = inspect.findOutputs('*', { Value: 'Waldo' });
      expect(result.length).toEqual(0);
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
      const result = inspect.findOutputs('Foo', { Value: 'Fred'});
      expect(result).toEqual([
        { Value: 'Fred' },
      ]);
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
      const result = inspect.findOutputs('Foo', { Value: 'Waldo'});
      expect(result.length).toEqual(0);
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
        () => inspect.hasMapping('*',{
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
        () => inspect.hasMapping('Fred',{
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
      expect(result).toEqual([
        {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
        { Foo: { Bar: 'Lightning' } },
      ]);
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
      expect(result.length).toEqual(0);
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
      expect(result).toEqual([
        {
          Foo: { Bar: 'Lightning', Fred: 'Waldo' },
          Baz: { Bar: 'Qux' },
        },
      ]);
    });

    test('not matching', () => {
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
      expect(result.length).toEqual(0);
    });
  });
});

function expectToThrow(fn: () => void, msgs: (RegExp | string)[], done: jest.DoneCallback): void {
  try {
    fn();
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