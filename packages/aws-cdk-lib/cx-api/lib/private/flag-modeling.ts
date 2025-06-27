export enum FlagType {
  /**
   * Change the default behavior of the API
   *
   * The old behavior is still valid, and possible to achieve with source
   * code changes, but we recommend the new behavior instead.
   *
   * Also valid for changes that don't affect CloudFormation, but the CXAPI
   * contract.
   */
  ApiDefault,

  /**
   * Address a bug in a way that requires contract breaking or has availability implications for existing infrastructure
   *
   * The old behavior is not recommended, and shouldn't have been possible in the first place.
   * We only have this flag because we can't roll out the fix to everyone
   * automatically for fear of breakage.
   */
  BugFix,

  /**
   * Advertise the presence of this context option in `cdk.json`
   */
  VisibleContext,

  /**
   * Use this type for flags that are to be removed on a set date
   */
  Temporary,
}

export interface FlagInfoBase {
  /** Single-line description for the flag */
  readonly summary: string;
  /** Detailed description for the flag (Markdown) */
  readonly detailsMd: string;
  /** Version number the flag was introduced in each version line. `undefined` means flag does not exist in that line. */
  readonly introducedIn: { v1?: string; v2?: string };
  /** What you would like new users to set this flag to (default in new projects) */
  readonly recommendedValue: any;
  /** If this flag is not set, it behaves as if the flag was set to <this>. if flag is unset by user. Adding a flag with a default may not change behavior after GA! */
  readonly unconfiguredBehavesLike?: { v1?: any; v2?: any };
}

/** Flag information, adding required fields if present */
export type FlagInfo = FlagInfoBase & (
  | { readonly type: FlagType.ApiDefault;

    /** Describe how to use the API to achieve pre-flag behavior, if the flag is set (Markdown) */
    readonly compatibilityWithOldBehaviorMd: string; }
  | { readonly type: FlagType.BugFix;
    /** Describe how to deal with the change if the flag is set (Markdown) */
    readonly compatibilityWithOldBehaviorMd?: string; }
  | { readonly type: FlagType.VisibleContext }
  | { readonly type: FlagType.Temporary;
    readonly compatibilityWithOldBehaviorMd?: string; }
);

/**
 * The magic value that will be substituted at version bump time with the actual
 * new V2 version.
 *
 * Do not import this constant in the `features.ts` file, or the substitution
 * process won't work.
 */
export const MAGIC_V2NEXT = 'V2NEXT';

/**
 * Compare two versions, returning -1, 0, or 1.
 */
export function compareVersions(a: string | undefined, b: string | undefined): number {
  if (a === b) { return 0; }
  if (a === undefined) { return -1; }
  if (b === undefined) { return 1; }

  const as = a.split('.').map(x => parseInt(x, 10));
  const bs = b.split('.').map(x => parseInt(x, 10));

  if (a === MAGIC_V2NEXT) { return bs[0] <= 2 ? 1 : -1; }
  if (b === MAGIC_V2NEXT) { return as[0] <= 2 ? -1 : 1; }

  for (let i = 0; i < Math.min(as.length, bs.length); i++) {
    if (as[i] < bs[i]) { return -1; }
    if (as[i] > bs[i]) { return 1; }
  }
  return as.length - bs.length;
}
