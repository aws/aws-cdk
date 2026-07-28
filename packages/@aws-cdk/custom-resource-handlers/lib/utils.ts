import * as https from 'https';

/**
 * Shared helpers for sending a Custom Resource response back to CloudFormation
 * over the pre-signed S3 response URL.
 *
 * This mirrors the behavior of the custom resource provider framework runtime:
 * the response PUT is retried with exponential backoff, and only a successful
 * (< 400) HTTP response is treated as success. It lives here so it can be
 * shared by the bundled handlers in this package instead of being
 * reimplemented per handler.
 *
 * `withRetries` mirrors:
 * https://github.com/aws/aws-cdk/blob/3b1df7422f1e922849e94ec2a90928e6f2a05163/packages/aws-cdk-lib/custom-resources/lib/provider-framework/runtime/util.ts#L24-L40
 * `httpRequest` mirrors `defaultHttpRequest` from:
 * https://github.com/aws/aws-cdk/blob/3b1df7422f1e922849e94ec2a90928e6f2a05163/packages/aws-cdk-lib/custom-resources/lib/provider-framework/runtime/outbound.ts#L19-L36
 *
 * These cannot be imported directly: `aws-cdk-lib` depends on this package, so
 * importing from it would create a circular dependency (see the
 * `copied-from-aws-cdk-lib/` directory, which copies code for the same reason).
 *
 * NOTE: this module can only be consumed by handlers that are minified and
 * bundled by the custom-resources-framework (`minifyAndBundle: true`), because
 * esbuild inlines the import. Handlers that are copied verbatim
 * (`minifyAndBundle: false`, e.g. the nodejs-entrypoint handler) cannot import
 * it and must keep their own self-contained copy.
 */

export interface RetryOptions {
  /** How many retries (will at least try once) */
  readonly attempts: number;
  /** Sleep base, in ms */
  readonly sleep: number;
}

/**
 * Default retry options for sending a Custom Resource response to CloudFormation.
 *
 * Shared by the bundled handlers so they retry the response PUT consistently
 * (5 attempts, exponential backoff from a 1s base) instead of each PUT being
 * a single un-retried attempt.
 */
export const DEFAULT_RESPONSE_RETRY_OPTIONS: RetryOptions = {
  attempts: 5,
  sleep: 1000,
};

/**
 * Wraps an async function so it is retried with exponential backoff (and
 * jitter) on failure, throwing the last error once the attempts are exhausted.
 */
export function withRetries<A extends Array<any>, B>(options: RetryOptions, fn: (...xs: A) => Promise<B>): (...xs: A) => Promise<B> {
  return async (...xs: A) => {
    let attempts = options.attempts;
    let ms = options.sleep;
    while (true) {
      try {
        return await fn(...xs);
      } catch (e) {
        if (attempts-- <= 0) {
          throw e;
        }
        await sleep(Math.floor(Math.random() * ms));
        ms *= 2;
      }
    }
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((ok) => setTimeout(ok, ms));
}

/**
 * Performs a single HTTP request (used to PUT the response to the CloudFormation
 * pre-signed S3 response URL). Rejects on a network error or a non-successful
 * (>= 400) HTTP response so that a caller wrapping it in `withRetries` can retry,
 * instead of treating any received response as success.
 */
export async function httpRequest(options: https.RequestOptions, requestBody: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const request = https.request(options, (response) => {
        response.resume(); // Consume the response but don't care about it
        if (!response.statusCode || response.statusCode >= 400) {
          reject(new Error(`Unsuccessful HTTP response: ${response.statusCode}`));
        } else {
          resolve();
        }
      });
      request.on('error', reject);
      request.write(requestBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}
