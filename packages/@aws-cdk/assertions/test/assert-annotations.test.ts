import { Annotations, Aspects, CfnResource, IAspect, Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { AssertAnnotations } from '../lib';

describe('Messages', () => {
  let stack: Stack;
  beforeAll(() => {
    stack = new Stack();
    new CfnResource(stack, 'Foo', {
      type: 'Foo::Bar',
      properties: {
        Fred: 'Thud',
      },
    });

    new CfnResource(stack, 'Bar', {
      type: 'Foo::Bar',
      properties: {
        Baz: 'Qux',
      },
    });

    new CfnResource(stack, 'Buzz', {
      type: 'Baz::Qux',
      properties: {
        Foo: 'Bar',
      },
    });

    Aspects.of(stack).add(new MyAspect());
  });

  describe('fromStack', () => {
    test('default', () => {
      const annotations = AssertAnnotations.fromStack(stack);
      expect(annotations.messageList).toHaveLength(3);
    });
  });

  describe('hasMessage', () => {
    test('exact match', () => {
      const annotations = AssertAnnotations.fromStack(stack);
      annotations.hasMessage('/Default/Foo', {
        level: 'error',
        entry: {
          data: 'this is an error',
        },
      });

      expect(() => annotations.hasMessage('/Default/Foo', {
        level: 'warning',
        entry: {
          data: 'this is a warning',
        },
      })).toThrowError(/Expected warning but received error at \/level/);

      expect(() => annotations.hasMessage('/Default/Foo', {
        level: 'error',
        entry: {
          data: 'this is wrong',
        },
      })).toThrowError(/Expected this is wrong but received this is an error at \/entry\/data/);
    });
  });

  describe('findMessage', () => {
    test('matching', () => {
      const annotations = AssertAnnotations.fromStack(stack);
      const result = annotations.findMessage('*', { level: 'error' });
      expect(Object.keys(result).length).toEqual(2);
      expect(result[0].id).toEqual('/Default/Foo');
      expect(result[1].id).toEqual('/Default/Bar');
    });

    test('not matching', () => {
      const annotations = AssertAnnotations.fromStack(stack);
      const resultA = annotations.findMessage('*', { level: 'info' });
      expect(Object.keys(resultA).length).toEqual(0);

      const resultB = annotations.findMessage('*', {
        level: 'warning',
        entry: {
          data: 'this is not a warning',
        },
      });
      expect(Object.keys(resultB).length).toEqual(0);
    });
  });
});

class MyAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      if (node.cfnResourceType === 'Foo::Bar') {
        this.error(node, 'this is an error');
      } else {
        this.warn(node, 'this is a warning');
      }
    }
  };

  protected warn(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }

  protected error(node: IConstruct, message: string): void {
    Annotations.of(node).addError(message);
  }
}