/**
 * The objects already present under a destination prefix.
 *
 * Built once from a single `ListObjectsV2`, and then asked two different questions:
 *
 * - *is the object at this key already up to date?*, which decides whether to upload; and
 * - *which objects did nothing claim?*, which decides what pruning removes.
 *
 * Keeping those separate matters. Marking a key as claimed must not change the answer to
 * the first question, or a path carried by several sources would stop being comparable
 * after the first one looked at it — and the later sources would upload needlessly.
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
   * Answers from the listing alone, so it is unaffected by anything this deployment has
   * written and gives every source the same answer.
   */
  public objectUpToDate(relativeKey: string, size: number, lastModified: Date): boolean {
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
