import { Stack, Stage } from '@aws-cdk/core';
import { SynthesisMessage } from '@aws-cdk/cx-api';
import { Messages } from './private/message';
import { findMessage, hasMessage, hasNoMessage } from './private/messages';

/**
 * Suite of assertions that can be run on a CDK Stack.
 * Focused on asserting annotations.
 */
export class Annotations {
  /**
   * Base your assertions on the messages returned by a synthesized CDK `Stack`.
   * @param stack the CDK Stack to run assertions on
   */
  public static fromStack(stack: Stack): Annotations {
    return new Annotations(toMessages(stack));
  }

  private readonly _messages: Messages;

  private constructor(messages: SynthesisMessage[]) {
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
   * Assert that an error with the given message does not exist in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
   * @param message the error message as should be expected. This should be a string or Matcher object.
   */
  public hasNoError(constructPath: string, message: any): void {
    const matchError = hasNoMessage(this._messages, constructPath, constructMessage('error', message));
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
  public findError(constructPath: string, message: any): SynthesisMessage[] {
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
   * Assert that an warning with the given message does not exist in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
   * @param message the warning message as should be expected. This should be a string or Matcher object.
   */
  public hasNoWarning(constructPath: string, message: any): void {
    const matchError = hasNoMessage(this._messages, constructPath, constructMessage('warning', message));
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
  public findWarning(constructPath: string, message: any): SynthesisMessage[] {
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
   * Assert that an info with the given message does not exist in the synthesized CDK `Stack`.
   *
   * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
   * @param message the info message as should be expected. This should be a string or Matcher object.
   */
  public hasNoInfo(constructPath: string, message: any): void {
    const matchError = hasNoMessage(this._messages, constructPath, constructMessage('info', message));
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
  public findInfo(constructPath: string, message: any): SynthesisMessage[] {
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

function convertArrayToMessagesType(messages: SynthesisMessage[]): Messages {
  return messages.reduce((obj, item, index) => {
    return {
      ...obj,
      [index]: item,
    };
  }, {}) as Messages;
}

function convertMessagesTypeToArray(messages: Messages): SynthesisMessage[] {
  return Object.values(messages) as SynthesisMessage[];
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
