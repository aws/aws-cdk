/**
 * In-memory CloudFront.
 *
 * Only the two operations the provider uses, modelled closely enough that the provider's
 * waiter is exercised for real: an invalidation starts `InProgress` and reaches `Completed`
 * after a configurable number of polls, so a test can distinguish "waited" from
 * "fire-and-forget" without asserting on call counts.
 */
import type {
  CloudFrontClientResolvedConfig,
  CreateInvalidationCommandInput,
  CreateInvalidationCommandOutput,
  GetInvalidationCommandInput,
  GetInvalidationCommandOutput,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-cloudfront';
import { CreateInvalidationCommand, GetInvalidationCommand } from '@aws-sdk/client-cloudfront';
import type { AwsStub } from 'aws-sdk-client-mock';

export interface FakeInvalidation {
  readonly id: string;
  readonly distributionId: string;
  readonly paths: string[];
  readonly callerReference: string;
  status: 'InProgress' | 'Completed';
  /** Polls remaining before this invalidation reports `Completed`. */
  pollsUntilComplete: number;
}

function cloudFrontError(name: string, message: string): never {
  const e: any = new Error(message);
  e.name = name;
  e.$metadata = { httpStatusCode: 403 };
  throw e;
}

let invalidationCounter = 0;

export class FakeCloudFront {
  private readonly distributions = new Set<string>();
  private readonly invalidations = new Map<string, FakeInvalidation>();

  /**
   * How many `GetInvalidation` polls an invalidation needs before completing.
   *
   * `0` (the default) means it is already `Completed` on the first poll, which keeps tests
   * fast. Raise it to prove the provider really waits.
   */
  public pollsUntilComplete = 0;

  /** When set, `GetInvalidation` fails — the shape of a missing-permission failure. */
  public failGetInvalidation?: { name: string; message: string };

  /**
   * When set, invalidations never reach `Completed`.
   *
   * Distinct from a large `pollsUntilComplete`, which a fast-polling test can still
   * exhaust; this is the only way to exercise the waiter's timeout.
   */
  public neverComplete = false;

  // -----------------------------------------------------------------------
  // Test setup and inspection
  // -----------------------------------------------------------------------

  public createDistribution(distributionId: string): void {
    this.distributions.add(distributionId);
  }

  public reset(): void {
    this.distributions.clear();
    this.invalidations.clear();
    this.pollsUntilComplete = 0;
    this.failGetInvalidation = undefined;
    this.neverComplete = false;
  }

  /** Every invalidation created, oldest first. */
  public allInvalidations(): FakeInvalidation[] {
    return [...this.invalidations.values()];
  }

  /** Invalidations for one distribution, oldest first. */
  public invalidationsFor(distributionId: string): FakeInvalidation[] {
    return this.allInvalidations().filter((i) => i.distributionId === distributionId);
  }

  // -----------------------------------------------------------------------
  // Wiring
  // -----------------------------------------------------------------------

  public installUsingAwsMock(
    mock: AwsStub<ServiceInputTypes, ServiceOutputTypes, CloudFrontClientResolvedConfig>,
  ): void {
    mock.on(CreateInvalidationCommand).callsFake(this.createInvalidation.bind(this));
    mock.on(GetInvalidationCommand).callsFake(this.getInvalidation.bind(this));
  }

  // -----------------------------------------------------------------------
  // Operations
  // -----------------------------------------------------------------------

  public async createInvalidation(input: CreateInvalidationCommandInput): Promise<CreateInvalidationCommandOutput> {
    const distributionId = input.DistributionId!;
    if (!this.distributions.has(distributionId)) {
      cloudFrontError('NoSuchDistribution', `The specified distribution does not exist: ${distributionId}`);
    }

    const callerReference = input.InvalidationBatch?.CallerReference ?? '';

    // CloudFront deduplicates on caller reference: the same reference returns the existing
    // invalidation rather than creating another.
    const existing = this.allInvalidations()
      .find((i) => i.distributionId === distributionId && i.callerReference === callerReference);
    if (existing) {
      return { $metadata: { httpStatusCode: 200 }, Invalidation: this.describe(existing) };
    }

    const invalidation: FakeInvalidation = {
      id: `I${String(++invalidationCounter).padStart(10, '0')}`,
      distributionId,
      paths: [...(input.InvalidationBatch?.Paths?.Items ?? [])],
      callerReference,
      status: this.pollsUntilComplete > 0 || this.neverComplete ? 'InProgress' : 'Completed',
      pollsUntilComplete: this.pollsUntilComplete,
    };
    this.invalidations.set(invalidation.id, invalidation);

    return { $metadata: { httpStatusCode: 201 }, Invalidation: this.describe(invalidation) };
  }

  public async getInvalidation(input: GetInvalidationCommandInput): Promise<GetInvalidationCommandOutput> {
    if (this.failGetInvalidation) {
      cloudFrontError(this.failGetInvalidation.name, this.failGetInvalidation.message);
    }

    const invalidation = this.invalidations.get(input.Id!);
    if (!invalidation || invalidation.distributionId !== input.DistributionId) {
      cloudFrontError('NoSuchInvalidation', `The specified invalidation does not exist: ${input.Id}`);
    }

    if (this.neverComplete) {
      return { $metadata: { httpStatusCode: 200 }, Invalidation: this.describe(invalidation) };
    }

    if (invalidation.pollsUntilComplete > 0) {
      invalidation.pollsUntilComplete--;
      if (invalidation.pollsUntilComplete === 0) {
        invalidation.status = 'Completed';
      }
    }

    return { $metadata: { httpStatusCode: 200 }, Invalidation: this.describe(invalidation) };
  }

  private describe(invalidation: FakeInvalidation) {
    return {
      Id: invalidation.id,
      Status: invalidation.status,
      CreateTime: new Date(0),
      InvalidationBatch: {
        CallerReference: invalidation.callerReference,
        Paths: { Quantity: invalidation.paths.length, Items: invalidation.paths },
      },
    };
  }
}
