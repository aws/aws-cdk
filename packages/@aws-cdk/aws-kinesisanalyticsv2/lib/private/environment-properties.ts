import { CfnApplication } from '../kinesisanalyticsv2.generated';
import { PropertyGroups } from '../types';

export function environmentProperties(propertyGroups?: PropertyGroups): CfnApplication.EnvironmentPropertiesProperty | undefined {
  const entries = Object.entries(propertyGroups ?? {});
  if (entries.length === 0) {
    return;
  }

  return {
    propertyGroups: entries.map(([id, map]) => ({
      propertyGroupId: id,
      propertyMap: map,
    })),
  };
}
