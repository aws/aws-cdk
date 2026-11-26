/**
 * CloudFront invalidation.
 */
import { createHash } from 'crypto';
import type { CloudFront } from '@aws-sdk/client-cloudfront';

/**
 * Message for a wait that could not be completed.
 */
const WAIT_FAILED_MESSAGE =
  'Unable to confirm that cache invalidation was successful. This may be a CloudFront ' +
  'regression as reported in https://github.com/aws/aws-cdk/issues/15891';

/** How often to ask CloudFront whether an invalidation has completed. */
const POLL_INTERVAL_MS = 20_000;

export interface InvalidationOptions {
  readonly distributionId: string;
  readonly paths: string[];
  readonly wait: boolean;
  /** How long to wait for completion before giving up. */
  readonly timeoutMs: number;
  /**
   * Makes the caller reference deterministic, so CloudFront recognizes a retry of the same
   * request as the same invalidation instead of creating another billable one.
   */
  readonly requestId: string;
}

export class CloudFrontInvalidator {
  constructor(private readonly cloudfront: CloudFront) {}

  /**
   * Create an invalidation and, if asked, wait for it to complete.
   *
   * Returns the invalidation id. When waiting, a successful return means edge caches are
   * flushed; when not waiting, the invalidation may still be in progress.
   */
  public async invalidate(options: InvalidationOptions): Promise<string> {
    const response = await this.cloudfront.createInvalidation({
      DistributionId: options.distributionId,
      InvalidationBatch: {
        Paths: { Quantity: options.paths.length, Items: options.paths },
        CallerReference: callerReference(options.requestId, options.paths),
      },
    });

    const invalidationId = response.Invalidation?.Id;
    if (!invalidationId) {
      throw new Error(`CloudFront did not return an invalidation id for distribution ${options.distributionId}`);
    }

    if (options.wait) {
      await this.waitForCompletion(options.distributionId, invalidationId, options.timeoutMs);
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
  private async waitForCompletion(distributionId: string, invalidationId: string, timeoutMs: number): Promise<void> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      let status: string | undefined;
      try {
        const response = await this.cloudfront.getInvalidation({
          DistributionId: distributionId,
          Id: invalidationId,
        });
        status = response.Invalidation?.Status;
      } catch (e: any) {
        throw new Error(`${WAIT_FAILED_MESSAGE} (${e.name}: ${e.message})`);
      }

      if (status === 'Completed') { return; }

      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(`${WAIT_FAILED_MESSAGE} (timed out after ${timeoutMs} ms)`);
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
