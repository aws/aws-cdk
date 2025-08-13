import { ArtifactType, FeatureFlag } from '@aws-cdk/cloud-assembly-schema';
import { IConstruct } from 'constructs';
import { CloudAssemblyBuilder } from '../../../cx-api';
import * as feats from '../../../cx-api/lib/features';
import { FlagInfo } from '../../../cx-api/lib/private/flag-modeling';

/**
 * Creates a FeatureFlag object based on flag information given.
 */
function parseFeatureFlagInfo(flagName: string, info: FlagInfo, root: IConstruct): FeatureFlag {
  const userValue = root.node.tryGetContext(flagName) ?? undefined;

  let parsedFlag: FeatureFlag = {
    userValue: userValue,
    recommendedValue: info.recommendedValue,
    explanation: info.summary,

    // This is a historical accident. We used to copy all `unconfiguredBehavesLike` data
    // into the feature flag report, but we only needed to copy the behavior of the current library version.
    // In order to not break existing reports, we keep the same structure, but we baptize the 'v2' field as
    // the canonical name of the "current version" field, even for v3, v4, etc.
    // It looks weird, but it's safe & backwards compatible.
    unconfiguredBehavesLike: info.unconfiguredBehavesLike?.[feats.CURRENT_MV] ? {
      v2: info.unconfiguredBehavesLike?.[feats.CURRENT_MV],
    } : undefined,
  };

  return parsedFlag;
}

/**
 * Iterate through all feature flags, retrieve the user's context,
 * and create a Feature Flag report.
 */
export function generateFeatureFlagReport(builder: CloudAssemblyBuilder, root: IConstruct): void {
  const featureFlags: Record<string, FeatureFlag> = {};
  for (const [flagName, flagInfo] of Object.entries(feats.FLAGS)) {
    // Skip flags that don't apply to the current version line
    if (feats.CURRENT_VERSION_EXPIRED_FLAGS.includes(flagName)) {
      continue;
    }

    featureFlags[flagName] = parseFeatureFlagInfo(flagName, flagInfo, root);
  }

  builder.addArtifact('aws-cdk-lib/feature-flag-report', {
    type: ArtifactType.FEATURE_FLAG_REPORT,
    properties: {
      module: 'aws-cdk-lib',
      flags: featureFlags,
    },
  });
}
