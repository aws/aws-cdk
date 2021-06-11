import { CfnResource, Stack } from '@aws-cdk/core';
import { ResourcePart, TemplateAssertions } from '../lib';

describe('StackAssertions', () => {

  describe('resourceCountIs', () => {
    test('resource exists', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.resourceCountIs('Foo::Bar', 1);

      expect(() => inspect.resourceCountIs('Foo::Bar', 0)).toThrow(/has 1 resource of type Foo::Bar/);
      expect(() => inspect.resourceCountIs('Foo::Bar', 2)).toThrow(/has 1 resource of type Foo::Bar/);

      expect(() => inspect.resourceCountIs('Foo::Baz', 1)).toThrow(/has 0 resource of type Foo::Baz/);
    });

    test('no resource', () => {
      const stack = new Stack();

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.resourceCountIs('Foo::Bar', 0);

      expect(() => inspect.resourceCountIs('Foo::Bar', 1)).toThrow(/has 0 resource of type Foo::Bar/);
    });
  });

  describe('hasResource', () => {
    test('property matching', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
        properties: {
          baz: 'qux',
        },
      });

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.hasResource('Foo::Bar', { baz: 'qux' });

      expect(() => inspect.hasResource('Foo::Bar', { fred: 'waldo' })).toThrow(/None .* matches resource 'Foo::Bar'/);
      expect(() => inspect.hasResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('no resource', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Resource', {
        type: 'Foo::Bar',
      });

      const inspect = TemplateAssertions.fromStack(stack);
      expect(() => inspect.hasResource('Foo::Baz', {})).toThrow(/None .* matches resource 'Foo::Baz'/);
    });

    test('complete definition', () => {
      const stack = new Stack();
      const bar = new CfnResource(stack, 'Bar', { type: 'Foo::Bar', properties: { baz: 'qux' } });
      const baz = new CfnResource(stack, 'Baz', { type: 'Foo::Baz' });
      bar.node.addDependency(baz);

      const inspect = TemplateAssertions.fromStack(stack);
      inspect.hasResource('Foo::Bar', {
        Properties: { baz: 'qux' },
        DependsOn: ['Baz'],
      }, {
        part: ResourcePart.COMPLETE,
      });
    });
  });

  describe('templateMatches', () => {
    test('matches', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      const inspect = TemplateAssertions.fromStack(stack);
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

      const inspect = TemplateAssertions.fromStack(stack);
      expect(() => inspect.templateMatches({
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