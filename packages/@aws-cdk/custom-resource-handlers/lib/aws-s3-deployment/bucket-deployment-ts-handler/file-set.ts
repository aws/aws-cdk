/**
 * The objects already present under a destination prefix.
 *
 * For every file, retains file attributes (time, size) and a "claim" status
 * indicating whether it should be kept. Files are claimed as they are being uploaded,
 * and at the end any "unclaimed" files are considered stale and can be pruned.
 */
export class S3ObjectSet {
  private readonly objects = new Map<string, { size: number; lastModified: Date }>();
  private readonly claimed = new Set<string>();

  /** Record an object that is already at the destination, keyed relative to the prefix. */
  public add(relativeKey: string, size: number, lastModified: Date): void {
    this.objects.set(relativeKey, { size, lastModified });
  }

  /**
   * Whether the object at `relativeKey` is already what a file of this size and timestamp
   * would put there.
   *
   * This is `aws s3 sync`'s `SizeAndLastModifiedSync` rule: up to date when the object
   * exists, its size matches, and its last modification time is *not older* than the
   * candidate's. The `>=` is deliberate — the CLI classifies an exactly equal timestamp as
   * "destination is newer" and skips, and matching that matters because archive timestamps
   * are often whole seconds.
   *
   * Content is never hashed and metadata is never compared, which is what keeps the
   * decision to a single LIST. The two holes that buys are documented on `snapshot`.
   *
   * A candidate timestamp before 2000 is never trusted. CDK resets every entry of the asset
   * zips it builds to a fixed placeholder (the 1980 DOS epoch) to keep them reproducible, so
   * for those the timestamp carries no information and a same-size edit would otherwise be
   * skipped. Such files are always treated as changed. Archives produced elsewhere that
   * carry real timestamps still get the optimization.
   *
   * Answers from the listing alone, so it is unaffected by anything this deployment has
   * written and gives every source the same answer.
   */
  public objectUpToDate(relativeKey: string, size: number, lastModified: Date): boolean {
    if (lastModified.getTime() < PLACEHOLDER_TIMESTAMP_CUTOFF) { return false; }

    const existing = this.objects.get(relativeKey);
    if (!existing) { return false; }
    if (existing.size !== size) { return false; }

    return existing.lastModified.getTime() >= lastModified.getTime();
  }

  /**
   * Spare `relativeKey` from pruning.
   *
   * Called for every file a source wants deployed, whether or not it needed uploading: an
   * object that was already up to date is still accounted for. Idempotent, so several
   * sources claiming the same path is not a problem.
   */
  public markForKeeping(relativeKey: string): void {
    this.claimed.add(relativeKey);
  }

  /** The keys nothing marked for keeping. */
  public allUnmarked(): string[] {
    return [...this.objects.keys()].filter((key) => !this.claimed.has(key));
  }
}

/** Timestamps before this are reset placeholders, not real modification times. */
const PLACEHOLDER_TIMESTAMP_CUTOFF = Date.UTC(2000, 0, 1);
