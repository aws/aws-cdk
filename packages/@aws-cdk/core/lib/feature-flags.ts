import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from '../lib/construct-compat';

/**
 * Features that are implemented behind a flag in order to preserve backwards
 * compatibility for existing apps. The list of flags are available in the
 * `@aws-cdk/cx-api` module.
 *
 * The state of the flag for this application is stored as a CDK context variable.
 */
export class FeatureFlags {
  /**
   * Check whether a feature flag is enabled. If configured, the flag is present in
   * the construct node context. Falls back to the defaults defined in the `cx-api`
   * module.
   */
  public static isEnabled(construct: Construct, featureFlag: string): boolean | undefined {
    return construct.node.tryGetContext(featureFlag) ?? cxapi.futureFlagDefault(featureFlag);
  }
}