import { Stack } from '@aws-cdk/core';
import { Message, Messages as MessagesType } from './private/message';
import { findMessage, hasMessage } from './private/messages';
import { toStackArtifact } from './private/util';

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

function toMessages(stack: Stack): any {
  return toStackArtifact(stack).messages;
}
