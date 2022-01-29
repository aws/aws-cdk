import { Annotations, Aspects, CfnResource, IAspect, Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { Annotations as _Annotations, Match } from '../lib';

describe('Messages', () => {
  let stack: Stack;
  let annotations: _Annotations;
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

    new CfnResource(stack, 'Fred', {
      type: 'Baz::Qux',
      properties: {
        Foo: 'Bar',
      },
    });

    new CfnResource(stack, 'Qux', {
      type: 'Fred::Thud',
      properties: {
        Fred: 'Bar',
      },
    });

    Aspects.of(stack).add(new MyAspect());
    annotations = _Annotations.fromStack(stack);
  });

  describe('hasError', () => {
    test('match', () => {
      annotations.hasError('/Default/Foo', 'this is an error');
    });

    test('no match', () => {
      expect(() => annotations.hasError('/Default/Fred', Match.anyValue()))
        .toThrowError(/Stack has 1 messages, but none match as expected./);
    });
  });

  describe('findError', () => {
    test('match', () => {
      const result = annotations.findError('*', Match.anyValue());
      expect(Object.keys(result).length).toEqual(2);
    });

    test('no match', () => {
      const result = annotations.findError('*', 'no message looks like this');
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('hasWarning', () => {
    test('match', () => {
      annotations.hasWarning('/Default/Fred', 'this is a warning');
    });

    test('no match', () => {
      expect(() => annotations.hasWarning('/Default/Foo', Match.anyValue())).toThrowError(/Stack has 1 messages, but none match as expected./);
    });
  });

  describe('findWarning', () => {
    test('match', () => {
      const result = annotations.findWarning('*', Match.anyValue());
      expect(Object.keys(result).length).toEqual(1);
    });

    test('no match', () => {
      const result = annotations.findWarning('*', 'no message looks like this');
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('hasInfo', () => {
    test('match', () => {
      annotations.hasInfo('/Default/Qux', 'this is an info');
    });

    test('no match', () => {
      expect(() => annotations.hasInfo('/Default/Qux', 'this info is incorrect')).toThrowError(/Stack has 1 messages, but none match as expected./);
    });
  });

  describe('findInfo', () => {
    test('match', () => {
      const result = annotations.findInfo('/Default/Qux', 'this is an info');
      expect(Object.keys(result).length).toEqual(1);
    });

    test('no match', () => {
      const result = annotations.findInfo('*', 'no message looks like this');
      expect(Object.keys(result).length).toEqual(0);
    });
  });

  describe('with matchers', () => {
    test('anyValue', () => {
      const result = annotations.findError('*', Match.anyValue());
      expect(Object.keys(result).length).toEqual(2);
    });

    test('not', () => {
      expect(() => annotations.hasError('/Default/Foo', Match.not('this is an error')))
        .toThrowError(/Found unexpected match: "this is an error" at \/entry\/data/);
    });

    test('stringLikeRegEx', () => {
      annotations.hasError('/Default/Foo', Match.stringLikeRegexp('.*error'));
    });
  });
});

class MyAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      if (node.cfnResourceType === 'Foo::Bar') {
        this.error(node, 'this is an error');
      } else if (node.cfnResourceType === 'Baz::Qux') {
        this.warn(node, 'this is a warning');
      } else {
        this.info(node, 'this is an info');
      }
    }
  };

  protected warn(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }

  protected error(node: IConstruct, message: string): void {
    Annotations.of(node).addError(message);
  }

  protected info(node: IConstruct, message: string): void {
    Annotations.of(node).addInfo(message);
  }
}