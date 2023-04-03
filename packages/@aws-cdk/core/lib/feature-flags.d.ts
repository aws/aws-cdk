import { IConstruct } from 'constructs';
/**
 * Features that are implemented behind a flag in order to preserve backwards
 * compatibility for existing apps. The list of flags are available in the
 * `@aws-cdk/cx-api` module.
 *
 * The state of the flag for this application is stored as a CDK context variable.
 */
export declare class FeatureFlags {
    private readonly construct;
    /**
     * Inspect feature flags on the construct node's context.
     */
    static of(scope: IConstruct): FeatureFlags;
    private constructor();
    /**
     * Check whether a feature flag is enabled. If configured, the flag is present in
     * the construct node context. Falls back to the defaults defined in the `cx-api`
     * module.
     */
    isEnabled(featureFlag: string): boolean | undefined;
}
