import { inspect, format } from 'util';
import { Logger } from '@smithy/types';
import { replacerBufferWithInfo } from '../../serialize';
import type { IIoHost } from '../../toolkit/cli-io-host';

export class SdkToCliLogger implements Logger {
  private readonly ioHost: IIoHost;

  public constructor(ioHost: IIoHost) {
    this.ioHost = ioHost;
  }

  private notify(level: 'debug' | 'info' | 'warn' | 'error', ...content: any[]) {
    void this.ioHost.notify({
      time: new Date(),
      level: 'trace', // always log all SDK logs at trace level, no matter what level they are coming from the SDK
      action: 'none' as any,
      code: 'CDK_SDK_I0000',
      message: format('[SDK %s] %s', level, formatSdkLoggerContent(content)),
    });
  }

  public trace(..._content: any[]) {
    // This is too much detail for our logs
    // this.notify('trace', ...content);
  }

  public debug(..._content: any[]) {
    // This is too much detail for our logs
    // this.notify('debug', ...content);
  }

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
    this.notify('info', ...content);
  }

  public warn(...content: any[]) {
    this.notify('warn', ...content);
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
    this.notify('error', ...content);
  }
}

/**
 * This can be anything.
 *
 * For debug, it seems to be mostly strings.
 * For info, it seems to be objects.
 *
 * Stringify and join without separator.
 */
export function formatSdkLoggerContent(content: any[]) {
  if (content.length === 1) {
    const apiFmt = formatApiCall(content[0]);
    if (apiFmt) {
      return apiFmt;
    }
  }
  return content.map((x) => typeof x === 'string' ? x : inspect(x)).join('');
}

function formatApiCall(content: any): string | undefined {
  if (!isSdkApiCallSuccess(content) && !isSdkApiCallError(content)) {
    return undefined;
  }

  const service = content.clientName.replace(/Client$/, '');
  const api = content.commandName.replace(/Command$/, '');

  const parts = [];
  if ((content.metadata?.attempts ?? 0) > 1) {
    parts.push(`[${content.metadata?.attempts} attempts, ${content.metadata?.totalRetryDelay}ms retry]`);
  }

  parts.push(`${service}.${api}(${JSON.stringify(content.input, replacerBufferWithInfo)})`);

  if (isSdkApiCallSuccess(content)) {
    parts.push('-> OK');
  } else {
    parts.push(`-> ${content.error}`);
  }

  return parts.join(' ');
}

interface SdkApiCallBase {
  clientName: string;
  commandName: string;
  input: Record<string, unknown>;
  metadata?: {
    httpStatusCode?: number;
    requestId?: string;
    extendedRequestId?: string;
    cfId?: string;
    attempts?: number;
    totalRetryDelay?: number;
  };
}

type SdkApiCallSuccess = SdkApiCallBase & { output: Record<string, unknown> };
type SdkApiCallError = SdkApiCallBase & { error: Error };

function isSdkApiCallSuccess(x: any): x is SdkApiCallSuccess {
  return x && typeof x === 'object' && x.commandName && x.output;
}

function isSdkApiCallError(x: any): x is SdkApiCallError {
  return x && typeof x === 'object' && x.commandName && x.error;
}
