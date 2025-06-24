import { ArtifactType, FeatureFlag } from '@aws-cdk/cloud-assembly-schema';
import { IConstruct } from 'constructs';
import { CloudAssemblyBuilder } from '../../../cx-api';
import * as feats from '../../../cx-api/lib/features';
import { FlagInfo } from '../../../cx-api/lib/private/flag-modeling';

/**
 * Creates a FeatureFlag object based on flag information given.
 */
function parseFeatureFlagInfo(flagName: string, info: FlagInfo, root: IConstruct): FeatureFlag {
  const userValue = root.node.tryGetContext(flagName) ?? false;

  let parsedFlag: FeatureFlag = {
    userValue: userValue,
    recommendedValue: info.recommendedValue,
    explanation: info.summary,
  };

  return parsedFlag;
}

/**
 * Iterate through all feature flags, retrieve the user's context,
 * and create a Feature Flag report.
 */
export function generateFeatureFlagReport(builder: CloudAssemblyBuilder, root: IConstruct): void {
  try {
    const featureFlags: Record<string, FeatureFlag> = {};

    for (const [flagName, flagInfo] of Object.entries(feats.FLAGS)) {
      featureFlags[flagName] = parseFeatureFlagInfo(flagName, flagInfo, root);
    }
    
    builder.addArtifact('feature flag report', {
      type: ArtifactType.FEATURE_FLAG_REPORT,
      properties: {
        module: '@aws-cdk/core',
        flags: featureFlags,
      },
    });
  } catch (error) {
    throw error;
  }
}
