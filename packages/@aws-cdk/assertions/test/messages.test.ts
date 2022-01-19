import { Annotations, App, Aspects, CfnResource, IAspect, Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { Messages } from '../lib';

class MyAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      this.warn(node, 'my message');
    }
  };

  protected warn(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }
}

describe('Messages', () => {
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

      Aspects.of(stack).add(new MyAspect());

      const messages = Messages.fromStack(stack);
      expect(messages.messageList).toHaveLength(1);

      const message = messages.messageList[0];
      expect(message.level).toEqual('warning');
      expect(message.entry.data).toEqual('my message');
    });
  });

  describe('hasMessage', () => {
    test('exact match', () => {
      const stack = new Stack();
      new CfnResource(stack, 'Foo', {
        type: 'Foo::Bar',
        properties: { baz: 'qux' },
      });

      Aspects.of(stack).add(new MyAspect());

      const messages = Messages.fromStack(stack);
      messages.hasMessage({
        level: 'warning',
        entry: {
          data: 'my message',
        },
      });

      expect(() => messages.hasMessage({
        level: 'error',
        entry: {
          data: 'my message',
        },
      })).toThrowError();
    });
  });
});