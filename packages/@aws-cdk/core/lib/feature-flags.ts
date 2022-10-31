import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Node } from 'constructs';

/**
 * Features that are implemented behind a flag in order to preserve backwards
 * compatibility for existing apps. The list of flags are available in the
 * `@aws-cdk/cx-api` module.
 *
 * The state of the flag for this application is stored as a CDK context variable.
 */
export class FeatureFlags {
  /**
   * Inspect feature flags on the construct node's context.
   */
  public static of(scope: IConstruct) {
    return new FeatureFlags(scope);
  }

  private constructor(private readonly construct: IConstruct) {}

  /**
   * Check whether a feature flag is enabled. If configured, the flag is present in
   * the construct node context. Falls back to the defaults defined in the `cx-api`
   * module.
   */
  public isEnabled(featureFlag: string): boolean | undefined {
    const context = Node.of(this.construct).tryGetContext(featureFlag);
    if (cxapi.FUTURE_FLAGS_EXPIRED.includes(featureFlag)) {
      if (context !== undefined) {
        throw new Error(`Unsupported feature flag '${featureFlag}'. This flag existed on CDKv1 but has been removed in CDKv2.`
          + ' CDK will now behave as the same as when the flag is enabled.');
      }
      return true;
    }
    return context !== undefined ? Boolean(context) : cxapi.futureFlagDefault(featureFlag);
  }
}
