import { ToolkitAction } from '../../toolkit';

/**
 * The reporting level of the message.
 * All messages are always reported, it's up to the IoHost to decide what to log.
 */
export type IoMessageLevel = 'error'| 'result' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * Valid reporting categories for messages.
 */
export type IoMessageCodeCategory = 'TOOLKIT' | 'SDK' | 'ASSETS' | 'ASSEMBLY';

/**
 * Code level matching the reporting level.
 */
export type IoCodeLevel = 'E' | 'W' | 'I';

/**
 * A message code at a specific level
 */
export type IoMessageSpecificCode<L extends IoCodeLevel> = `CDK_${IoMessageCodeCategory}_${L}${number}${number}${number}${number}`;

/**
 * A valid message code
 */
export type IoMessageCode = IoMessageSpecificCode<IoCodeLevel>;

export interface IoMessage<T> {
  /**
   * The time the message was emitted.
   */
  readonly time: Date;

  /**
   * The log level of the message.
   */
  readonly level: IoMessageLevel;

  /**
   * The action that triggered the message.
   */
  readonly action: ToolkitAction;

  /**
   * A short message code uniquely identifying a message type using the format CDK_[CATEGORY]_[E/W/I][0000-9999].
   *
   * The level indicator follows these rules:
   * - 'E' for error level messages
   * - 'W' for warning level messages
   * - 'I' for info/debug/trace level messages
   *
   * Codes ending in 000 0 are generic messages, while codes ending in 0001-9999 are specific to a particular message.
   * The following are examples of valid and invalid message codes:
   * ```ts
   * 'CDK_ASSETS_I0000'       // valid: generic assets info message
   * 'CDK_TOOLKIT_E0002'      // valid: specific toolkit error message
   * 'CDK_SDK_W0023'          // valid: specific sdk warning message
   * ```
   */
  readonly code: IoMessageCode;

  /**
   * The message text.
   * This is safe to print to an end-user.
   */
  readonly message: string;

  /**
   * The data attached to the message.
   */
  readonly data?: T;
}

export interface IoRequest<T, U> extends IoMessage<T> {
  /**
   * The default response that will be used if no data is returned.
   */
  readonly defaultResponse: U;
}

/**
 * Keep this list ordered from most to least verbose.
 * Every level "includes" all of the levels below it.
 * This is used to compare levels of messages to determine what should be logged.
 */
const levels = [
  'trace',
  'debug',
  'info',
  'warn',
  'result',
  'error',
] as const;

// compare levels helper
// helper to convert the array into a map with numbers
const orderedLevels: Record<typeof levels[number], number> = Object.fromEntries(Object.entries(levels).map(a => a.reverse()));
function compareFn(a: IoMessageLevel, b: IoMessageLevel): number {
  return orderedLevels[a] - orderedLevels[b];
}

/**
 * Determines if a message is relevant for the given log level.
 *
 * @param msg The message to compare.
 * @param level The level to compare against.
 * @returns true if the message is relevant for the given level.
 */
export function isMessageRelevantForLevel(msg: { level: IoMessageLevel}, level: IoMessageLevel): boolean {
  return compareFn(msg.level, level) >= 0;
}

