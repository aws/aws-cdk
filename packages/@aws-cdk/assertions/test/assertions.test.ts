import { CfnResource, Stack } from '@aws-cdk/core';
import { ResourcePart, TemplateAssertions } from '../lib';

describe('StackAssertions', () => {

  describe('assertResourceCount', () => {
    test('resource exists', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.assertResourceCountIs('Foo::Bar', 1);

      expect(() => inspect.assertResourceCountIs('Foo::Bar', 0)).toThrow(/has 1 resource of type Foo::Bar/);
      expect(() => inspect.assertResourceCountIs('Foo::Bar', 2)).toThrow(/has 1 resource of type Foo::Bar/);

      expect(() => inspect.assertResourceCountIs('Foo::Baz', 1)).toThrow(/has 0 resource of type Foo::Baz/);
    });

    test('no resource', () => {
      const stack = new Stack();

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.assertResourceCountIs('Foo::Bar', 0);

      expect(() => inspect.assertResourceCountIs('Foo::Bar', 1)).toThrow(/has 0 resource of type Foo::Bar/);
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

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.assertHasResource('Foo::Bar', { baz: 'qux' });

      expect(() => inspect.assertHasResource('Foo::Bar', { fred: 'waldo' })).toThrow(/None .* matches resource 'Foo::Bar'/);
      expect(() => inspect.assertHasResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('no resource', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = TemplateAssertions.fromStack(stack);
      expect(() => inspect.assertHasResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('complete definition', () => {
      const stack = new Stack();
      const bar = new CfnResource(stack, 'Bar', { type: 'Foo::Bar', properties: { baz: 'qux' } });
      const baz = new CfnResource(stack, 'Baz', { type: 'Foo::Baz' });
      bar.node.addDependency(baz);

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.assertHasResource('Foo::Bar', {
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

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.assertTemplateMatches({
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

      const inspect = TemplateAssertions.fromStack(stack);
      expect(() => inspect.assertTemplateMatches({
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