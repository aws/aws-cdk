declare type Flags = {
    [key: string]: any;
};
/**
 * jest helper function to be used when testing future flags. Twin function of the `testLegacyBehavior()`.
 * This should be used for testing future flags that will be removed in CDKv2, and updated such that these
 * will be the default behaviour.
 *
 * This function is specifically for unit tests that verify the behaviour when future flags are enabled.
 *
 * The version of CDK is determined by running `scripts/resolve-version.js`, and the logic is as follows:
 *
 * When run in CDKv1, the specified 'flags' parameter are passed into the CDK App's context, and then
 * the test is executed.
 *
 * When run in CDKv2, the specified 'flags' parameter is ignored, since the default behaviour should be as if
 * they are enabled, and then the test is executed.
 */
export declare function testFutureBehavior<T>(name: string, flags: Flags, cdkApp: new (props?: {
    context: Flags;
}) => T, fn: (app: T) => void, repoRoot?: string): void;
/**
 * jest helper function to be used when testing future flags. Twin function of the `testFutureBehavior()`.
 * This should be used for testing future flags that will be removed in CDKv2, and updated such that these
 * will be the default behaviour.
 *
 * This function is specifically for unit tests that verify the behaviour when future flags are disabled.
 *
 * The version of CDK is determined by running `scripts/resolve-version.js`, and the logic is as follows:
 *
 * When run in CDKv1, the test is executed as normal.
 *
 * When run in CDKv2, the test is skipped, since the feature flag usage is unsupported and blocked.
 */
export declare function testLegacyBehavior<T>(name: string, cdkApp: new () => T, fn: (app: T) => void, repoRoot?: string): void;
export {};
