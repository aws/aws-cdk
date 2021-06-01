import { CfnResource, Stack } from '@aws-cdk/core';
import { ResourcePart, StackAssertions } from '../lib';

describe('StackAssertions', () => {

  describe('assertResourceCount', () => {
    test('resource exists', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = new StackAssertions(stack);
      inspect.assertResourceCount('Foo::Bar', 1);

      expect(() => inspect.assertResourceCount('Foo::Bar', 0)).toThrow(/has 1 resource of type Foo::Bar/);
      expect(() => inspect.assertResourceCount('Foo::Bar', 2)).toThrow(/has 1 resource of type Foo::Bar/);

      expect(() => inspect.assertResourceCount('Foo::Baz', 1)).toThrow(/has 0 resource of type Foo::Baz/);
    });

    test('no resource', () => {
      const stack = new Stack();

      const inspect = new StackAssertions(stack);
      inspect.assertResourceCount('Foo::Bar', 0);

      expect(() => inspect.assertResourceCount('Foo::Bar', 1)).toThrow(/has 0 resource of type Foo::Bar/);
    });
  });

  describe('assertResourceProps', () => {
    test('property matching', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
        properties: {
          baz: 'qux',
        },
      });

      const inspect = new StackAssertions(stack);
      inspect.assertResource('Foo::Bar', { baz: 'qux' });

      expect(() => inspect.assertResource('Foo::Bar', { fred: 'waldo' })).toThrow(/None .* matches resource 'Foo::Bar'/);
      expect(() => inspect.assertResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('no resource', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = new StackAssertions(stack);
      expect(() => inspect.assertResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('complete definition', () => {
      const stack = new Stack();
      const bar = new CfnResource(stack, 'Bar', { type: 'Foo::Bar', properties: { baz: 'qux' } });
      const baz = new CfnResource(stack, 'Baz', { type: 'Foo::Baz' });
      bar.node.addDependency(baz);

      const inspect = new StackAssertions(stack);
      inspect.assertResource('Foo::Bar', {
        Properties: { baz: 'qux' },
        DependsOn: ['Baz'],
      }, {
        part: ResourcePart.COMPLETE,
      });
    });
  });

  describe('assertMatchTemplate', () => {
    test('matches', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = new StackAssertions(stack);
      inspect.assertMatchTemplate({
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

      const inspect = new StackAssertions(stack);
      expect(() => inspect.assertMatchTemplate({
        Resources: {
          Foo: {
            Type: 'Foo::Bar',
            Properties: { baz: 'waldo' },
          },
        },
      })).resolves;
    });
  });
});