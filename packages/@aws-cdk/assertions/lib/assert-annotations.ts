import { Stack, Stage } from '@aws-cdk/core';
import { Message, Messages } from './private/message';
import { findMessage, hasMessage } from './private/messages';

/**
 * Suite of assertions that can be run on a CDK Stack.
 * Focused on asserting annotations.
 */
export class AssertAnnotations {
  /**
   * Base your assertions on the messages returned by a synthesized CDK `Stack`.
   * @param stack the CDK Stack to run assertions on
   */
  public static fromStack(stack: Stack): AssertAnnotations {
    return new AssertAnnotations(toMessages(stack));
  }

  private readonly _messages: Messages;

  private constructor(messages: Message[]) {
    this._messages = convertArrayToMessagesType(messages);
  }

  /**
   * Returns raw data of all messages on the stack.
   */
  public get messageList(): Message[] {
    return convertMessagesTypeToArray(this._messages);
  }

  /**
   * Assert that a Message with the given properties exists in the synthesized CDK `Stack`.
   * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
   * To configure different behavior, use other matchers in the `Match` class.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props the message as should be expected.
   */
  public hasMessage(logicalId: string, props: any): void {
    const matchError = hasMessage(this._messages, logicalId, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching messages of a given id and properties.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props by default, matches all resources with the given logicalId.
   * When a literal is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findMessage(logicalId: string, props: any): Message[] {
    return convertMessagesTypeToArray(findMessage(this._messages, logicalId, props) as Messages);
  }

  /**
   * Assert that an Error with the given properties exists in the synthesized CDK `Stack`.
   * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
   * To configure different behavior, use other matchers in the `Match` class.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props the error as should be expected.
   */
  public hasError(logicalId: string, props: any): void {
    if (props.level && props.level !== 'error') {
      throw new Error(`Message level mismatch: expected no level or 'error' but got ${props.level}`);
    }

    const matchError = hasMessage(this._messages, logicalId, {
      ...props,
      level: 'error',
    });
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Errors of a given id and properties.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props by default, matches all resources with the given logicalId.
   * When a literal is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findError(logicalId: string, props: any): Message[] {
    if (props.level && props.level !== 'error') {
      throw new Error(`Message level mismatch: expected no level or 'error' but got ${props.level}`);
    }

    return convertMessagesTypeToArray(findMessage(this._messages, logicalId, {
      ...props,
      level: 'error',
    }) as Messages);
  }

  /**
   * Assert that a Warning with the given properties exists in the synthesized CDK `Stack`.
   * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
   * To configure different behavior, use other matchers in the `Match` class.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props the warning as should be expected.
   */
  public hasWarning(logicalId: string, props: any): void {
    if (props.level && props.level !== 'warning') {
      throw new Error(`Message level mismatch: expected no level or 'warning' but got ${props.level}`);
    }

    const matchError = hasMessage(this._messages, logicalId, {
      ...props,
      level: 'warning',
    });
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Warnings of a given id and properties.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props by default, matches all resources with the given logicalId.
   * When a literal is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findWarning(logicalId: string, props: any): Message[] {
    if (props.level && props.level !== 'warning') {
      throw new Error(`Message level mismatch: expected no level or 'warning' but got ${props.level}`);
    }

    return convertMessagesTypeToArray(findMessage(this._messages, logicalId, {
      ...props,
      level: 'warning',
    }) as Messages);
  }
}

function convertArrayToMessagesType(messages: Message[]): Messages {
  return messages.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    };
  }, {}) as Messages;
}

function convertMessagesTypeToArray(messages: Messages): Message[] {
  return Object.values(messages) as Message[];
}

function toMessages(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }

  // to support incremental assertions (i.e. "expect(stack).toNotContainSomething(); doSomething(); expect(stack).toContainSomthing()")
  const force = true;

  const assembly = root.synth({ force });

  return assembly.getStackArtifact(stack.artifactId).messages;
}
