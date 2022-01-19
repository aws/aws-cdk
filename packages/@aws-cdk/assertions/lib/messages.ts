import { Stack, Stage } from '@aws-cdk/core';
import { Message, Messages as MessagesType } from './private/message';
import { findMessage, hasMessage } from './private/messages';

/**
 * Messages
 */
export class Messages {
  /**
   * Base your assertions on the messages returned by a synthesized CDK `Stack`.
   * @param stack the CDK Stack to run assertions on
   */
  public static fromStack(stack: Stack): Messages {
    return new Messages(toMessages(stack));
  }

  private readonly _messages: MessagesType;

  private constructor(messages: Message[]) {
    this._messages = convertArrayToMessagesType(messages);
  }

  /**
   * MessageList
   */
  public get messageList(): Message[] {
    return convertMessagesTypeToArray(this._messages);
  }

  /**
   * hasMessage
   * @param props
   */
  public hasMessage(props: any): void {
    const matchError = hasMessage(this._messages, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * findMessages
   * @param props
   * @returns
   */
  public findMessage(props: any): Message[] {
    return convertMessagesTypeToArray(findMessage(this._messages, props) as MessagesType);
  }
}

function convertArrayToMessagesType(messages: Message[]): MessagesType {
  return messages.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    };
  }, {}) as MessagesType;
}

function convertMessagesTypeToArray(messages: MessagesType): Message[] {
  return Object.values(messages);
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
