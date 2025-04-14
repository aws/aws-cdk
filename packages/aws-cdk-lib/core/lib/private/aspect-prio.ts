import { IConstruct } from 'constructs';
import * as cxapi from '../../../cx-api';
import { FeatureFlags } from '../feature-flags';
import { AspectPriority } from '../aspect';

/**
 * Return the aspect priority of Aspects changed in https://github.com/aws/aws-cdk/pull/32333
 *
 * We retroactively made those controllable using a feature flag.
 *
 * Aspects newly added since this change should unconditionally have a priority of `MUTATING`.
 */
export function mutatingAspectPrio32333(scope: IConstruct) {
  return FeatureFlags.of(scope).isEnabled(cxapi.ASPECT_PRIORITIES_MUTATING) ? AspectPriority.MUTATING : undefined;
}
