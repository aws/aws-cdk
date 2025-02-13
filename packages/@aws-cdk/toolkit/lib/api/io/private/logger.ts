import * as util from 'node:util';
import type { Logger } from '@smithy/types';
import type { IoMessage, IoMessageCodeCategory, IoMessageLevel, IoRequest } from '../io-message';
import { debug, error, info, defaultMessageCode, trace, warn } from './messages';
import type { ActionAwareIoHost } from './types';
import type { ToolkitAction } from '../../../toolkit';
import { formatSdkLoggerContent } from '../../aws-cdk';
import type { IIoHost } from '../io-host';

/**
 * An IoHost wrapper that adds the given action to an actionless message before
 * sending the message to the given IoHost
 */
export function withAction(ioHost: IIoHost, action: ToolkitAction) {
  return {
    notify: async <T>(msg: Omit<IoMessage<T>, 'action'>) => {
      await ioHost.notify({
        ...msg,
        action,
      });
    },
    requestResponse: async <T, U>(msg: Omit<IoRequest<T, U>, 'action'>) => {
      return ioHost.requestResponse({
        ...msg,
        action,
      });
    },
  };
}

/**
 * An IoHost wrapper that strips out ANSI colors and styles from the message before
 * sending the message to the given IoHost
 */
export function withoutColor(ioHost: IIoHost): IIoHost {
  return {
    notify: async <T>(msg: IoMessage<T>) => {
      await ioHost.notify({
        ...msg,
        message: stripColor(msg.message),
      });
    },
    requestResponse: async <T, U>(msg: IoRequest<T, U>) => {
      return ioHost.requestResponse({
        ...msg,
        message: stripColor(msg.message),
      });
    },
  };
}

function stripColor(msg: string): string {
  return msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

/**
 * An IoHost wrapper that strips out emojis from the message before
 * sending the message to the given IoHost
 */
export function withoutEmojis(ioHost: IIoHost): IIoHost {
  return {
    notify: async <T>(msg: IoMessage<T>) => {
      await ioHost.notify({
        ...msg,
        message: stripEmojis(msg.message),
      });
    },
    requestResponse: async <T, U>(msg: IoRequest<T, U>) => {
      return ioHost.requestResponse({
        ...msg,
        message: stripEmojis(msg.message),
      });
    },
  };
}

function stripEmojis(msg: string): string {
  // https://www.unicode.org/reports/tr51/#def_emoji_presentation
  return msg.replace(/\p{Emoji_Presentation}/gu, '');
}

/**
 * An IoHost wrapper that trims whitespace at the beginning and end of messages.
 * This is required, since after removing emojis and ANSI colors,
 * we might end up with floating whitespace at either end.
 */
export function withTrimmedWhitespace(ioHost: IIoHost): IIoHost {
  return {
    notify: async <T>(msg: IoMessage<T>) => {
      await ioHost.notify({
        ...msg,
        message: msg.message.trim(),
      });
    },
    requestResponse: async <T, U>(msg: IoRequest<T, U>) => {
      return ioHost.requestResponse({
        ...msg,
        message: msg.message.trim(),
      });
    },
  };
}

// @todo these cannot be awaited WTF
export function asSdkLogger(ioHost: IIoHost, action: ToolkitAction): Logger {
  return new class implements Logger {
    // This is too much detail for our logs
    public trace(..._content: any[]) {}
    public debug(..._content: any[]) {}

    /**
     * Info is called mostly (exclusively?) for successful API calls
     *
     * Payload:
     *
     * (Note the input contains entire CFN templates, for example)
     *
     * ```
     * {
     *   clientName: 'S3Client',
     *   commandName: 'GetBucketLocationCommand',
     *   input: {
     *     Bucket: '.....',
     *     ExpectedBucketOwner: undefined
     *   },
     *   output: { LocationConstraint: 'eu-central-1' },
     *   metadata: {
     *     httpStatusCode: 200,
     *     requestId: '....',
     *     extendedRequestId: '...',
     *     cfId: undefined,
     *     attempts: 1,
     *     totalRetryDelay: 0
     *   }
     * }
     * ```
     */
    public info(...content: any[]) {
      void ioHost.notify({
        action,
        ...trace(`[sdk info] ${formatSdkLoggerContent(content)}`),
        data: {
          sdkLevel: 'info',
          content,
        },
      });
    }

    public warn(...content: any[]) {
      void ioHost.notify({
        action,
        ...trace(`[sdk warn] ${formatSdkLoggerContent(content)}`),
        data: {
          sdkLevel: 'warn',
          content,
        },
      });
    }

    /**
     * Error is called mostly (exclusively?) for failing API calls
     *
     * Payload (input would be the entire API call arguments).
     *
     * ```
     * {
     *   clientName: 'STSClient',
     *   commandName: 'GetCallerIdentityCommand',
     *   input: {},
     *   error: AggregateError [ECONNREFUSED]:
     *       at internalConnectMultiple (node:net:1121:18)
     *       at afterConnectMultiple (node:net:1688:7) {
     *     code: 'ECONNREFUSED',
     *     '$metadata': { attempts: 3, totalRetryDelay: 600 },
     *     [errors]: [ [Error], [Error] ]
     *   },
     *   metadata: { attempts: 3, totalRetryDelay: 600 }
     * }
     * ```
     */
    public error(...content: any[]) {
      void ioHost.notify({
        action,
        ...trace(`[sdk error] ${formatSdkLoggerContent(content)}`),
        data: {
          sdkLevel: 'error',
          content,
        },
      });
    }
  };
}

/**
 * Turn an ActionAwareIoHost into a logger that is compatible with older code, but doesn't support data
 */
export function asLogger(ioHost: ActionAwareIoHost, category?: IoMessageCodeCategory) {
  const code = (level: IoMessageLevel) => defaultMessageCode(level, category);

  return {
    trace: async (msg: string, ...args: any[]) => {
      await ioHost.notify(trace(util.format(msg, args), code('trace')));
    },
    debug: async (msg: string, ...args: any[]) => {
      await ioHost.notify(debug(util.format(msg, args), code('debug')));
    },
    info: async (msg: string, ...args: any[]) => {
      await ioHost.notify(info(util.format(msg, args), code('info')));
    },
    warn: async (msg: string, ...args: any[]) => {
      await ioHost.notify(warn(util.format(msg, args), code('warn')));
    },
    error: async (msg: string, ...args: any[]) => {
      await ioHost.notify(error(util.format(msg, args), code('error')));
    },
  };
}
