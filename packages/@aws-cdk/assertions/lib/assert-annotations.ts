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
   * Assert that an error with the given message exists in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
   * @param message the error message as should be expected. This should be a string or Matcher object.
   */
  public hasError(constructPath: string, message: any): void {
    const matchError = hasMessage(this._messages, constructPath, constructMessage('error', message));
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching errors of a given construct path and message.
   *
   * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
   * @param message the error message as should be expected. This should be a string or Matcher object.
   */
  public findError(constructPath: string, message: any): Message[] {
    return convertMessagesTypeToArray(findMessage(this._messages, constructPath, constructMessage('error', message)) as Messages);
  }

  /**
   * Assert that an warning with the given message exists in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
   * @param message the warning message as should be expected. This should be a string or Matcher object.
   */
  public hasWarning(constructPath: string, message: any): void {
    const matchError = hasMessage(this._messages, constructPath, constructMessage('warning', message));
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching warning of a given construct path and message.
   *
   * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
   * @param message the warning message as should be expected. This should be a string or Matcher object.
   */
  public findWarning(constructPath: string, message: any): Message[] {
    return convertMessagesTypeToArray(findMessage(this._messages, constructPath, constructMessage('warning', message)) as Messages);
  }

  /**
   * Assert that an info with the given message exists in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
   * @param message the info message as should be expected. This should be a string or Matcher object.
   */
  public hasInfo(constructPath: string, message: any): void {
    const matchError = hasMessage(this._messages, constructPath, constructMessage('info', message));
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching infos of a given construct path and message.
   *
   * @param constructPath the construct path to the info. Provide `'*'` to match all infos in the template.
   * @param message the info message as should be expected. This should be a string or Matcher object.
   */
  public findInfo(constructPath: string, message: any): Message[] {
    return convertMessagesTypeToArray(findMessage(this._messages, constructPath, constructMessage('info', message)) as Messages);
  }
}

function constructMessage(type: 'info' | 'warning' | 'error', message: any): {[key:string]: any } {
  return {
    level: type,
    entry: {
      data: message,
    },
  };
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
