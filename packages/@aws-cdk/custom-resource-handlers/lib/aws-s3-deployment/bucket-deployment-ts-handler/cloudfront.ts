/**
 * CloudFront invalidation (contract §3.6).
 */
import { createHash } from 'crypto';
import type { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { CreateInvalidationCommand, GetInvalidationCommand } from '@aws-sdk/client-cloudfront';

/**
 * Message for a wait that could not be completed.
 *
 * The text is load-bearing: it names the long-standing CloudFront issue that makes this
 * failure mode worth distinguishing from a generic error, and operators grep for it.
 */
const WAIT_FAILED_MESSAGE =
  'Unable to confirm that cache invalidation was successful. This may be a CloudFront ' +
  'regression as reported in https://github.com/aws/aws-cdk/issues/15891';

export interface InvalidationOptions {
  readonly distributionId: string;
  readonly paths: string[];
  readonly wait: boolean;
  /**
   * Makes the caller reference deterministic so a CloudFormation retry of the same request
   * is recognized as the same invalidation instead of creating another billable one (B20).
   */
  readonly requestId: string;
}

export interface Waiter {
  /** Milliseconds between polls. */
  readonly intervalMs: number;
  /** Give up after this long. */
  readonly timeoutMs: number;
}

/** Roughly 13 minutes, which is what the original implementation allowed. */
export const DEFAULT_WAITER: Waiter = { intervalMs: 20_000, timeoutMs: 13 * 60_000 };

export class CloudFrontInvalidator {
  constructor(
    private readonly cloudfront: CloudFrontClient,
    private readonly waiter: Waiter = DEFAULT_WAITER,
    private readonly sleep: (ms: number) => Promise<void> = defaultSleep,
  ) {}

  /**
   * Create an invalidation and, if asked, wait for it to complete.
   *
   * Returns the invalidation id. When waiting, a successful return means edge caches are
   * flushed; when not waiting, the invalidation may still be in progress.
   */
  public async invalidate(options: InvalidationOptions): Promise<string> {
    const response = await this.cloudfront.send(new CreateInvalidationCommand({
      DistributionId: options.distributionId,
      InvalidationBatch: {
        Paths: { Quantity: options.paths.length, Items: options.paths },
        CallerReference: callerReference(options.requestId, options.paths),
      },
    }));

    const invalidationId = response.Invalidation?.Id;
    if (!invalidationId) {
      throw new Error(`CloudFront did not return an invalidation id for distribution ${options.distributionId}`);
    }

    if (options.wait) {
      await this.waitForCompletion(options.distributionId, invalidationId);
    }

    return invalidationId;
  }

  /**
   * Poll until the invalidation reports `Completed`.
   *
   * Any failure to observe completion — a timeout, a throttle, a missing permission — is
   * reported as the same documented error, because from the caller's point of view they
   * are the same thing: the deployment finished but the caches may not have.
   */
  private async waitForCompletion(distributionId: string, invalidationId: string): Promise<void> {
    const deadline = Date.now() + this.waiter.timeoutMs;

    while (Date.now() < deadline) {
      let status: string | undefined;
      try {
        const response = await this.cloudfront.send(new GetInvalidationCommand({
          DistributionId: distributionId,
          Id: invalidationId,
        }));
        status = response.Invalidation?.Status;
      } catch (e: any) {
        throw new Error(`${WAIT_FAILED_MESSAGE} (${e.name}: ${e.message})`);
      }

      if (status === 'Completed') { return; }

      await this.sleep(this.waiter.intervalMs);
    }

    throw new Error(`${WAIT_FAILED_MESSAGE} (timed out after ${this.waiter.timeoutMs} ms)`);
  }
}

/**
 * A caller reference that is stable for a given request and path set.
 *
 * CloudFront uses it to recognize a repeated request; deriving it from the CloudFormation
 * request id means a retry collapses, while a genuinely new request gets a new reference.
 */
export function callerReference(requestId: string, paths: string[]): string {
  const digest = createHash('sha256').update(JSON.stringify(paths)).digest('hex').slice(0, 16);
  return `aws-cdk-s3deployment-${requestId}-${digest}`;
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
