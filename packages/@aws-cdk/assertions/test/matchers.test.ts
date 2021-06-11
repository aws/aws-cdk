import { CfnResource, Stack } from '@aws-cdk/core';
import { Matchers, TemplateAssertions } from '../lib';

describe('Matchers', () => {
  test('absent', () => {
    const stack = new Stack();
    new CfnResource(stack, 'Resource', {
      type: 'Foo::Bar',
      properties: {
        baz: 'qux',
      },
    });

    const inspect = TemplateAssertions.fromStack(stack);
    inspect.assertHasResource('Foo::Bar', {
      fred: Matchers.absent(),
    });

    expect(() => inspect.assertHasResource('Foo::Bar', {
      baz: Matchers.absent(),
    })).toThrow(/None .* matches resource 'Foo::Bar'/);
  });
});