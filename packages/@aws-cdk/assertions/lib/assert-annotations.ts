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
   * Assert that a Message with the given properties exists in the CloudFormation template.
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

export function toMessages(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }

  // to support incremental assertions (i.e. "expect(stack).toNotContainSomething(); doSomething(); expect(stack).toContainSomthing()")
  const force = true;

  const assembly = root.synth({ force });

  return assembly.getStackArtifact(stack.artifactId).messages;
}
