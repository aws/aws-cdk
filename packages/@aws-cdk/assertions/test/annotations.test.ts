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
        .toThrowError(/Stack has 1 messages.*but none match as expected./);
    });
  });

  describe('hasNoError', () => {
    test('match', () => {
      annotations.hasNoError('/Default/Fred', Match.anyValue());
    });

    test('no match', () => {
      expect(() => annotations.hasNoError('/Default/Foo', 'this is an error'))
        .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
    });
  });

  describe('findError', () => {
    test('match', () => {
      const result = annotations.findError('*', Match.anyValue());
      expect(result.length).toEqual(2);
    });

    test('no match', () => {
      const result = annotations.findError('*', 'no message looks like this');
      expect(result.length).toEqual(0);
    });
  });

  describe('hasWarning', () => {
    test('match', () => {
      annotations.hasWarning('/Default/Fred', 'this is a warning');
    });

    test('no match', () => {
      expect(() => annotations.hasWarning('/Default/Foo', Match.anyValue())).toThrowError(/Stack has 1 messages.*but none match as expected./);
    });
  });

  describe('hasNoWarning', () => {
    test('match', () => {
      annotations.hasNoWarning('/Default/Foo', Match.anyValue());
    });

    test('no match', () => {
      expect(() => annotations.hasNoWarning('/Default/Fred', 'this is a warning'))
        .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
    });
  });

  describe('findWarning', () => {
    test('match', () => {
      const result = annotations.findWarning('*', Match.anyValue());
      expect(result.length).toEqual(1);
    });

    test('no match', () => {
      const result = annotations.findWarning('*', 'no message looks like this');
      expect(result.length).toEqual(0);
    });
  });

  describe('hasInfo', () => {
    test('match', () => {
      annotations.hasInfo('/Default/Qux', 'this is an info');
    });

    test('no match', () => {
      expect(() => annotations.hasInfo('/Default/Qux', 'this info is incorrect')).toThrowError(/Stack has 1 messages.*but none match as expected./);
    });
  });

  describe('hasNoInfo', () => {
    test('match', () => {
      annotations.hasNoInfo('/Default/Qux', 'this info is incorrect');
    });

    test('no match', () => {
      expect(() => annotations.hasNoInfo('/Default/Qux', 'this is an info'))
        .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
    });
  });

  describe('findInfo', () => {
    test('match', () => {
      const result = annotations.findInfo('/Default/Qux', 'this is an info');
      expect(result.length).toEqual(1);
    });

    test('no match', () => {
      const result = annotations.findInfo('*', 'no message looks like this');
      expect(result.length).toEqual(0);
    });
  });

  describe('with matchers', () => {
    test('anyValue', () => {
      const result = annotations.findError('*', Match.anyValue());
      expect(result.length).toEqual(2);
    });

    test('not', () => {
      expect(() => annotations.hasError('/Default/Foo', Match.not('this is an error')))
        .toThrowError(/Found unexpected match: "this is an error"/);
    });

    test('stringLikeRegEx', () => {
      annotations.hasError('/Default/Foo', Match.stringLikeRegexp('.*error'));
    });
  });
});

describe('Multiple Messages on the Resource', () => {
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

    const bar = new CfnResource(stack, 'Bar', {
      type: 'Foo::Bar',
      properties: {
        Baz: 'Qux',
      },
    });
    bar.node.setContext('disable-stack-trace', false);

    Aspects.of(stack).add(new MultipleAspectsPerNode());
    annotations = _Annotations.fromStack(stack);
  });

  test('succeeds on hasXxx APIs', () => {
    annotations.hasError('/Default/Foo', 'error: this is an error');
    annotations.hasError('/Default/Foo', 'error: unsupported type Foo::Bar');
    annotations.hasWarning('/Default/Foo', 'warning: Foo::Bar is deprecated');
  });

  test('succeeds on findXxx APIs', () => {
    const result1 = annotations.findError('*', Match.stringLikeRegexp('error:.*'));
    expect(result1.length).toEqual(4);
    const result2 = annotations.findError('/Default/Bar', Match.stringLikeRegexp('error:.*'));
    expect(result2.length).toEqual(2);
    const result3 = annotations.findWarning('/Default/Bar', 'warning: Foo::Bar is deprecated');
    expect(result3[0].entry.data).toEqual('warning: Foo::Bar is deprecated');
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

class MultipleAspectsPerNode implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      this.error(node, 'error: this is an error');
      this.error(node, `error: unsupported type ${node.cfnResourceType}`);
      this.warn(node, `warning: ${node.cfnResourceType} is deprecated`);
    }
  }

  protected warn(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }

  protected error(node: IConstruct, message: string): void {
    Annotations.of(node).addError(message);
  }
}