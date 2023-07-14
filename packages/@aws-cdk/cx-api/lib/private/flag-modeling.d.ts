export declare enum FlagType {
    /**
     * Change the default behavior of the API
     *
     * The old behavior is not disrecommended, and possible to achieve with source
     * code changes. Also valid for changes that don't affect CloudFormation, but
     * the CXAPI contract.
     */
    ApiDefault = 0,
    /**
     * Address a bug/introduce a recommended change
     *
     * The old behavior is no longer recommended. The only way to achieve it is by
     * keeping the flag at the legacy value.
     */
    BugFix = 1,
    /**
     * Advertise the presence of this context option in `cdk.json`
     */
    VisibleContext = 2
}
export interface FlagInfoBase {
    /** Single-line description for the flag */
    readonly summary: string;
    /** Detailed description for the flag (Markdown) */
    readonly detailsMd: string;
    /** Version number the flag was introduced in each version line. `undefined` means flag does not exist in that line. */
    readonly introducedIn: {
        v1?: string;
        v2?: string;
    };
    /** Default value, if flag is unset by user. Adding a flag with a default may not change behavior after GA! */
    readonly defaults?: {
        v2?: any;
    };
    /** Default in new projects */
    readonly recommendedValue: any;
}
/** Flag information, adding required fields if present */
export type FlagInfo = FlagInfoBase & ({
    readonly type: FlagType.ApiDefault;
    /** Describe restoring old behavior or dealing with the change (Markdown) */
    readonly compatibilityWithOldBehaviorMd: string;
} | {
    readonly type: FlagType.BugFix;
    /** Describe restoring old behavior or dealing with the change (Markdown) */
    readonly compatibilityWithOldBehaviorMd?: string;
} | {
    readonly type: FlagType.VisibleContext;
});
/**
 * The magic value that will be substituted at version bump time with the actual
 * new V2 version.
 *
 * Do not import this constant in the `features.ts` file, or the substitution
 * process won't work.
 */
export declare const MAGIC_V2NEXT = "V2NEXT";
/**
 * Compare two versions, returning -1, 0, or 1.
 */
export declare function compareVersions(a: string | undefined, b: string | undefined): number;
