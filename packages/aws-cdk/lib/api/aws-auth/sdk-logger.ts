import { inspect } from 'util';
import { Logger } from '@smithy/types';
import { trace } from '../../logging';

export class SdkToCliLogger implements Logger {
  public trace(..._content: any[]) {
    // This is too much detail for our logs
    // trace('[SDK trace] %s', fmtContent(content));
  }

  public debug(..._content: any[]) {
    // This is too much detail for our logs
    // trace('[SDK debug] %s', fmtContent(content));
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
    trace('[sdk info] %s', formatSdkLoggerContent(content));
  }

  public warn(...content: any[]) {
    trace('[sdk warn] %s', formatSdkLoggerContent(content));
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
    trace('[sdk error] %s', formatSdkLoggerContent(content));
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

  parts.push(`${service}.${api}(${JSON.stringify(content.input)})`);

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
