export enum FlagType {
  /**
   * Change the default behavior of the API
   *
   * The old behavior is not disrecommended, and possible to achieve with source
   * code changes. Also valid for changes that don't affect CloudFormation, but
   * the CXAPI contract.
   */
  ApiDefault,

  /**
   * Address a bug/introduce a recommended change
   *
   * The old behavior is no longer recommended. The only way to achieve it is by
   * keeping the flag at the legacy value.
   */
  BugFix,

  /**
   * Advertise the presence of this context option in `cdk.json`
   */
  VisibleContext,
};

export interface FlagInfo {
  /** Flag type */
  readonly type: FlagType;
  /** Single-line description for the flag */
  readonly summary: string;
  /** Detailed description for the flag */
  readonly details: string;
  /** Version number the flag was introduced in each version line. `undefined` means flag does not exist in that line. */
  readonly introducedIn: { v1?: string; v2?: string };
  /** Default value, if flag is unset by user. Adding a flag with a default may not change behavior after GA! */
  readonly defaults?: { v2?: any };
  /** Default in new projects */
  readonly recommendedValue: any;
};

